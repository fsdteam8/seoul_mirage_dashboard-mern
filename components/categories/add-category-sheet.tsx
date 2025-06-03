"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast"
import { addCategoryAction, updateCategoryAction } from "@/app/dashboard/categories/actions"
import type { Category } from "@/app/dashboard/categories/types"

// ✅ Updated schema to include `type`
const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50, "Category name too long"),
  type: z.string().min(2, "Category type must be at least 2 characters").max(50, "Category type too long"),
  description: z.string().max(200, "Description too long").optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface AddCategorySheetProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  categoryToEdit?: Category | null
}

export function AddCategorySheet({ isOpen, onOpenChange, categoryToEdit }: AddCategorySheetProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        form.reset({
          name: categoryToEdit.name,
          type: categoryToEdit.type || "",
          description: categoryToEdit.description || "",
        })
      } else {
        form.reset({
          name: "",
          type: "",
          description: "",
        })
      }
    }
  }, [isOpen, categoryToEdit, form])

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true)
    try {
      let result
      if (categoryToEdit) {
        result = await updateCategoryAction(categoryToEdit.id, data)
      } else {
        result = await addCategoryAction(data)
      }

      if (result.success) {
        toast({
          title: categoryToEdit ? "Category Updated" : "Category Added",
          description: result.message,
        })
        onOpenChange(false)
        form.reset()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch {
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
        if (!open) {
          form.reset()
        }
      }}
    >
      <SheetContent className="sm:max-w-md w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{categoryToEdit ? "Edit Category" : "Add New Category"}</SheetTitle>
          <SheetDescription>
            {categoryToEdit ? "Update the details of this category." : "Create a new product category."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input className="mt-3" id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type">Category Type</Label>
            <Input className="mt-3" id="type" {...form.register("type")} />
            {form.formState.errors.type && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.type.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              className="mt-3"
              id="description"
              {...form.register("description")}
              placeholder="A brief description of the category"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Buttons */}
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
                ? categoryToEdit
                  ? "Saving..."
                  : "Adding..."
                : categoryToEdit
                  ? "Save Changes"
                  : "Add Category"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

