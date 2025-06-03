"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  addPromoCodeAction,
  updatePromoCodeAction,
  generateUniquePromoCodeString,
} from "@/app/dashboard/promocodes/actions"
import type { PromoCode } from "@/app/dashboard/promocodes/types"

const promoCodeSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(50, "Code too long")
      .regex(/^[a-zA-Z0-9_-]+$/, "Code can only contain letters, numbers, underscores, and hyphens"),
    description: z.string().max(200, "Description too long").optional(),
    discountType: z.enum(["percentage", "fixed"], { required_error: "Discount type is required" }),
    discountValue: z.coerce.number().positive("Discount value must be positive"),
    minPurchaseAmount: z.coerce.number().min(0, "Minimum purchase cannot be negative").optional(),
    expiryDate: z.date().optional(),
    usageLimit: z.coerce.number().min(0, "Usage limit cannot be negative").optional(), // 0 for unlimited
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.discountType === "percentage" && data.discountValue > 100) {
        return false
      }
      return true
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    },
  )

type PromoCodeFormValues = z.infer<typeof promoCodeSchema>

interface AddPromoCodeSheetProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  promoCodeToEdit?: PromoCode | null
}

export function AddPromoCodeSheet({ isOpen, onOpenChange, promoCodeToEdit }: AddPromoCodeSheetProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PromoCodeFormValues>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minPurchaseAmount: 0,
      usageLimit: 0, // 0 means unlimited
      isActive: true,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (promoCodeToEdit) {
        form.reset({
          code: promoCodeToEdit.code,
          description: promoCodeToEdit.description || "",
          discountType: promoCodeToEdit.discountType,
          discountValue: promoCodeToEdit.discountValue,
          minPurchaseAmount: promoCodeToEdit.minPurchaseAmount || 0,
          expiryDate: promoCodeToEdit.expiryDate ? new Date(promoCodeToEdit.expiryDate) : undefined,
          usageLimit: promoCodeToEdit.usageLimit || 0,
          isActive: promoCodeToEdit.isActive,
        })
      } else {
        ;(async () => {
          const generatedCode = await generateUniquePromoCodeString(8, "SALE")
          form.reset({
            code: generatedCode,
            description: "",
            discountType: "percentage",
            discountValue: 10,
            minPurchaseAmount: 0,
            usageLimit: 0,
            isActive: true,
            expiryDate: undefined,
          })
        })()
      }
    }
  }, [isOpen, promoCodeToEdit, form])

  const handleGenerateCode = async () => {
    form.setValue("code",await generateUniquePromoCodeString(8, form.getValues("code").substring(0, 4) || "PROMO"))
  }

  const onSubmit = async (data: PromoCodeFormValues) => {
    setIsSubmitting(true)
    const payload = {
      ...data,
      expiryDate: data.expiryDate ? format(data.expiryDate, "yyyy-MM-dd") : undefined,
      usageLimit: data.usageLimit === 0 ? undefined : data.usageLimit, // Store undefined for unlimited
      minPurchaseAmount: data.minPurchaseAmount === 0 ? undefined : data.minPurchaseAmount,
    }

    try {
      let result
      if (promoCodeToEdit) {
        result = await updatePromoCodeAction(promoCodeToEdit.id, payload)
      } else {
        result = await addPromoCodeAction(payload)
      }

      if (result.success) {
        toast({
          title: promoCodeToEdit ? "Promo Code Updated" : "Promo Code Added",
          description: result.message,
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch  {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) form.reset()
      }}
    >
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{promoCodeToEdit ? "Edit Promo Code" : "Add New Promo Code"}</SheetTitle>
          <SheetDescription>
            {promoCodeToEdit ? "Update the details of this promo code." : "Create a new promo code for your store."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4 pr-2">
          <div>
            <Label htmlFor="code">Promo Code</Label>
            <div className="flex items-center gap-2">
              <Input id="code" {...form.register("code")} />
              <Button type="button" variant="outline" size="icon" onClick={handleGenerateCode} title="Generate Code">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            {form.formState.errors.code && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.code.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="e.g., Holiday special, new customer offer"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discountType">Discount Type</Label>
              <Controller
                name="discountType"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="discountValue">Value ({form.watch("discountType") === "percentage" ? "%" : "$"})</Label>
              <Input
                id="discountValue"
                type="number"
                step={form.watch("discountType") === "percentage" ? "1" : "0.01"}
                {...form.register("discountValue")}
              />
              {form.formState.errors.discountValue && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.discountValue.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPurchaseAmount">Min. Purchase ($) (Optional)</Label>
              <Input
                id="minPurchaseAmount"
                type="number"
                step="0.01"
                placeholder="0 for no minimum"
                {...form.register("minPurchaseAmount")}
              />
            </div>
            <div>
              <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
              <Input id="usageLimit" type="number" placeholder="0 for unlimited" {...form.register("usageLimit")} />
            </div>
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Controller
              name="expiryDate"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} // Disable past dates
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <SheetFooter className="pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-black text-brand-white hover:bg-brand-black/90"
            >
              {isSubmitting
                ? promoCodeToEdit
                  ? "Saving..."
                  : "Adding..."
                : promoCodeToEdit
                  ? "Save Changes"
                  : "Add Promo Code"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}