"use client";

import React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Product } from "@/types/ProductDataType";

// Define types
type ProductStatus = "regular" | "coming_soon";

// export interface Product {
//   id: number;
//   name: string;
//   description?: string;
//   price: string | number;
//   cost_price?: string | number;
//   stock_quantity: number;
//   category_id: number | string;
//   status: ProductStatus;
//   created_at?: string;
//   updated_at?: string;
//   media?: { id: number; product_id: number; file_path: string }[];
//   category?: { id: number; name: string };
// }

// Schema for form validation
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  category_id: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  cost_price: z.coerce.number().optional(),
  stock_quantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  vendor: z.string().optional(),
  arrival_status: z.enum(["coming_soon", "regular"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  productToEdit?: Product | null;
}

export function AddProductSheet({
  isOpen,
  onOpenChange,
  productToEdit,
}: AddProductSheetProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const session = useSession();
  const token = session?.data?.accessToken ?? {};
  const queryClient = useQueryClient();

  // Fetch categories
  const {
    data: category,
    error: categoryError,
    isLoading: categoryLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories?paginate_count=100000`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      return res.json();
    },
  });

  const productCategories = category?.data?.data || [];

  // Form setup
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "",
      price: 0,
      stock_quantity: 0,
      description: "",
      arrival_status: "regular",
    },
  });

  // Reset form when productToEdit changes or sheet closes
  React.useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        const defaultValues = {
          name: productToEdit.name || "",
          category_id: productToEdit.category_id
            ? String(productToEdit.category_id)
            : "",
          price:
            typeof productToEdit.price === "string"
              ? parseFloat(productToEdit.price)
              : productToEdit.price || 0,
          cost_price:
            typeof productToEdit.cost_price === "string"
              ? parseFloat(productToEdit.cost_price)
              : productToEdit.cost_price ?? undefined,
          stock_quantity: productToEdit.stock_quantity || 0,
          description: productToEdit.description || "",
          arrival_status:
            productToEdit.arrival_status === "regular" ||
            productToEdit.arrival_status === "coming_soon"
              ? productToEdit.arrival_status
              : "regular",
        } as ProductFormValues;
        form.reset(defaultValues);

        // Set image previews from media array
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const imageUrls =
          productToEdit.media?.map(
            (media) => `${baseUrl}/${media.file_path}`
          ) || [];
        setImagePreviews(imageUrls);
        setSelectedFiles([]);
      } else {
        const defaultValues = {
          name: "",
          category_id: "",
          price: 0,
          stock_quantity: 0,
          description: "",
          status: "regular" as ProductStatus,
          cost_price: undefined,
        };
        form.reset(defaultValues);
        setImagePreviews([]);
        setSelectedFiles([]);
      }
    }
  }, [isOpen, productToEdit, form]);

  // Mutation for creating/updating product
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const entries = Array.from(formData.entries());

        // Log form data
        const imageEntries = entries.filter(([key]) => key.includes("images"));
        const otherEntries = entries.filter(([key]) => !key.includes("images"));
        otherEntries.forEach(([key, value]) => console.log(`${key}:`, value));
        imageEntries.forEach(([, value], index) => {
          if (value instanceof File) {
            console.log(`images[${index}]:`, {
              name: value.name,
              size: `${(value.size / 1024).toFixed(2)} KB`,
              type: value.type,
            });
          }
        });

        const res = await fetch(
          productToEdit
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productToEdit.id}?_method=PUT`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
          {
            method: "POST",
            headers: {
              Accept: "multipart/form-data",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
          }
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to create product");
        }

        return res.json();
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Product Created",
        description: "The product has been created successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsSubmitting(false);
      onOpenChange(false);
      form.reset();
      setSelectedFiles([]);
      setImagePreviews([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Product",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("category_id", data.category_id);
      formData.append("price", data.price.toString());
      formData.append("arrival_status", data.arrival_status);
      formData.append("cost_price", data.cost_price?.toString() || "");
      formData.append("stock_quantity", data.stock_quantity.toString());

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }

      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error("Submit error:", error);
      setIsSubmitting(false);
    }
  };

  // Handle multiple image uploads
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    newFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 10MB size limit.`,
          variant: "destructive",
        });
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    event.target.value = "";
  };

  // Remove specific image
  const removeImage = (indexToRemove: number) => {
    const previewToRemove = imagePreviews[indexToRemove];
    if (previewToRemove?.startsWith("blob:")) {
      URL.revokeObjectURL(previewToRemove);
    }
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    toast({
      title: "Image Removed",
      description: "Image has been removed from the selection",
    });
  };

  // Clear all images
  const clearAllImages = () => {
    imagePreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });
    setImagePreviews([]);
    setSelectedFiles([]);
    toast({
      title: "All Images Cleared",
      description: "All images have been removed",
    });
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          form.reset();
          clearAllImages();
          setIsSubmitting(false);
        }
      }}
    >
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {productToEdit ? "Edit Product" : "Add New Product"}
          </SheetTitle>
          <SheetDescription>
            {productToEdit
              ? "Update the details of this product."
              : "Create a new product in your catalog."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              className="mt-2 h-[44px]"
              id="name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="category_id">Category</Label>
              {categoryLoading && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading categories...
                </p>
              )}
              {categoryError && (
                <p className="text-xs text-red-500 mt-1">
                  Failed to load categories
                </p>
              )}
              <Controller
                name="category_id"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map(
                        (cat: { id: string | number; name: string }) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.category_id && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.category_id.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="arrival_status"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="coming_soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.arrival_status && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.arrival_status.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                className="mt-2 h-[44px]"
                step="0.01"
                {...form.register("price")}
              />
              {form.formState.errors.price && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                className="mt-2 h-[44px]"
                step="0.01"
                {...form.register("cost_price")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              className="mt-2 h-[44px]"
              id="stock_quantity"
              type="number"
              {...form.register("stock_quantity")}
            />
            {form.formState.errors.stock_quantity && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.stock_quantity.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="mt-2 h-[108px]"
              {...form.register("description")}
              placeholder="Type your message here."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Product Images
              </Label>
              {imagePreviews.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllImages}
                >
                  Clear All ({imagePreviews.length})
                </Button>
              )}
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative overflow-hidden rounded-md border">
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <label htmlFor="images-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Upload images
                </span>
                <input
                  id="images-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 10MB each
              </p>
              {imagePreviews.length > 0 && (
                <p className="text-xs font-medium text-green-600 mt-2">
                  {imagePreviews.length} image
                  {imagePreviews.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          <SheetFooter className="pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
