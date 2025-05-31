"use client"

import React from "react"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addProductAction, updateProductAction } from "@/app/dashboard/products/actions"
import {
  type Product,
  type ProductStatus,
  productCategories,
  productStatuses,
  productTags,
} from "@/app/dashboard/products/types"
import { UploadCloud, X } from "lucide-react"
import Image from "next/image"

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  costPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  vendor: z.string().optional(),
  thumbnailUrl: z.string().optional(), // For simplicity, we'll just use a string URL. Real upload is complex.
  status: z.custom<ProductStatus>((val) => productStatuses.includes(val as ProductStatus), {
    message: "Invalid status",
  }),
})

type ProductFormValues = z.infer<typeof productSchema>

interface AddProductSheetProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  productToEdit?: Product | null
}

export function AddProductSheet({ isOpen, onOpenChange, productToEdit }: AddProductSheetProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(productToEdit?.thumbnailUrl || null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: productToEdit
      ? {
          name: productToEdit.name,
          category: productToEdit.category,
          price: productToEdit.price,
          costPrice: productToEdit.costPrice,
          stock: productToEdit.stock,
          description: productToEdit.description || "",
          tags: productToEdit.tags || [],
          vendor: productToEdit.vendor || "",
          thumbnailUrl: productToEdit.thumbnailUrl || "",
          status: productToEdit.status,
        }
      : {
          name: "",
          category: "",
          price: 0,
          stock: 0,
          description: "",
          tags: [],
          vendor: "",
          thumbnailUrl: "",
          status: "Active",
        },
  })

  // Reset form when productToEdit changes or sheet closes
  React.useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        form.reset({
          name: productToEdit.name,
          category: productToEdit.category,
          price: productToEdit.price,
          costPrice: productToEdit.costPrice,
          stock: productToEdit.stock,
          description: productToEdit.description || "",
          tags: productToEdit.tags || [],
          vendor: productToEdit.vendor || "",
          thumbnailUrl: productToEdit.thumbnailUrl || "",
          status: productToEdit.status,
        })
        setThumbnailPreview(productToEdit.thumbnailUrl || null)
      } else {
        form.reset({
          name: "",
          category: "",
          price: 0,
          stock: 0,
          description: "",
          tags: [],
          vendor: "",
          thumbnailUrl: "",
          status: "Active",
          costPrice: undefined,
        })
        setThumbnailPreview(null)
      }
    }
  }, [isOpen, productToEdit, form])

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      let result
      if (productToEdit) {
        result = await updateProductAction(productToEdit.id, {
          ...data,
          thumbnailUrl: thumbnailPreview || data.thumbnailUrl,
        })
      } else {
        result = await addProductAction({ ...data, thumbnailUrl: thumbnailPreview || data.thumbnailUrl || "" })
      }

      if (result.success) {
        toast({
          title: productToEdit ? "Product Updated" : "Product Added",
          description: result.message,
        })
        onOpenChange(false) // Close sheet on success
        form.reset()
        setThumbnailPreview(null)
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

  // Simulate file upload by setting a placeholder URL
  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
        // In a real app, you would upload the file and get a URL
        // form.setValue("thumbnailUrl", "simulated_url_after_upload.jpg");
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          form.reset() // Reset form when closing
          setThumbnailPreview(null)
        }
      }}
    >
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{productToEdit ? "Edit Product" : "Add New Product"}</SheetTitle>
          <SheetDescription>
            {productToEdit ? "Update the details of this product." : "Create a new product in your catalog."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.category && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.category.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {productStatuses.map((stat) => (
                        <SelectItem key={stat} value={stat}>
                          {stat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.status && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" step="0.01" {...form.register("price")} />
              {form.formState.errors.price && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.price.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="costPrice">Cost Price ($) (Optional)</Label>
              <Input id="costPrice" type="number" step="0.01" {...form.register("costPrice")} />
              {form.formState.errors.costPrice && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.costPrice.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input id="stock" type="number" {...form.register("stock")} />
            {form.formState.errors.stock && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.stock.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} placeholder="Type your message here." />
          </div>

          <div>
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Controller
              name="tags"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value ? value.split(",") : [])}
                  value={field.value?.join(",") || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags (multi-select not directly supported, use CSV or custom component)" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Basic multi-select simulation. For real multi-select, use a custom component or library */}
                    <p className="p-2 text-xs text-muted-foreground">
                      Tip: For multiple, select one, then re-open to add more (not ideal).
                    </p>
                    {productTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground mt-1">
              For multiple tags, you might need a more advanced multi-select component. This is a basic version.
            </p>
          </div>

          <div>
            <Label htmlFor="vendor">Vendor (Optional)</Label>
            <Input id="vendor" {...form.register("vendor")} />
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {thumbnailPreview ? (
                  <div className="relative mx-auto h-24 w-24">
                    <Image
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 bg-white rounded-full h-6 w-6 p-1"
                      onClick={() => setThumbnailPreview(null)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="thumbnail-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-brand-pink hover:text-brand-pink/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-pink"
                  >
                    <span>Upload a file</span>
                    <input
                      id="thumbnail-upload"
                      name="thumbnail-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
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
                ? productToEdit
                  ? "Saving..."
                  : "Adding..."
                : productToEdit
                  ? "Save Changes"
                  : "Add Product"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
