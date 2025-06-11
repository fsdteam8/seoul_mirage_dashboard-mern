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
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// Define types to avoid import errors
type ProductStatus = "active" | "inactive" | "draft";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice?: number;
  stock: number;
  description?: string;
  tags?: string[];
  vendor?: string;
  images?: string[];
  status: ProductStatus;
}

// Mock data - replace with your actual imports
const productCategories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
];

// Updated schema to match backend structure
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  category_id: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  cost_price: z.coerce.number().optional(),
  stock_quantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  vendor: z.string().optional(),
  status: z.enum(["active", "inactive", "draft"]),
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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "",
      price: 0,
      stock_quantity: 0,
      description: "",
      tags: [],
      vendor: "",
      status: "active",
    },
  });

  // Reset form when productToEdit changes or sheet closes
  React.useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        const defaultValues = {
          name: productToEdit.name || "",
          category_id: "1", // Default category ID based on your mock 'productCategories'
          price: productToEdit.price || 0,
          cost_price: productToEdit.costPrice,
          stock_quantity: productToEdit.stock || 0,
          description: productToEdit.description || "",
          tags: productToEdit.tags || [],
          vendor: productToEdit.vendor || "",
          status: (productToEdit.status || "active") as ProductStatus,
        };
        form.reset(defaultValues);
        setImagePreviews(productToEdit.images || []);
        setSelectedFiles([]);
      } else {
        const defaultValues = {
          name: "",
          category_id: "",
          price: 0,
          stock_quantity: 0,
          description: "",
          tags: [],
          vendor: "",
          status: "active" as ProductStatus,
          cost_price: undefined,
        };
        form.reset(defaultValues);
        setImagePreviews([]);
        setSelectedFiles([]);

        console.log("=== NEW PRODUCT FORM INITIALIZED ===");
        console.log("Default Values:", defaultValues);
      }
    }
  }, [isOpen, productToEdit, form]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        // const token = localStorage.getItem("token");

        console.log("=== SENDING FORMDATA TO BACKEND ===");
        console.log("API Endpoint: /api/products");
        console.log("Method: POST");
        console.log("Authorization: Bearer", token ? "***" : "No token");

        // Log all FormData entries
        console.log("=== FORMDATA CONTENTS ===");
        const entries = Array.from(formData.entries());

        // Group images together for better logging
        const imageEntries = entries.filter(([key]) => key === "images");
        const otherEntries = entries.filter(([key]) => key !== "images");

        // Log non-image fields
        otherEntries.forEach(([key, value]) => {
          console.log(`${key}:`, value);
        });

        // Log image files
        console.log(`images: ${imageEntries.length} files`);
        imageEntries.forEach(([key, value], index) => {
          console.log(key);
          if (value instanceof File) {
            console.log(`  images[${index}]:`, {
              name: value.name,
              size: `${(value.size / 1024).toFixed(2)} KB`,
              type: value.type,
              lastModified: new Date(value.lastModified).toISOString(),
            });
          }
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
          {
            method: "POST",
            headers: {
              Accept: "multipart/form-data",
              ...(token && { Authorization: `Bearer ${token}` }),
              // Don't set Content-Type - let browser set it for FormData
            },
            body: formData,
          }
        );

        console.log("=== API RESPONSE ===");
        console.log("Status:", res.status);
        console.log("Status Text:", res.statusText);

        if (!res.ok) {
          let errorMessage = "Failed to create product";
          try {
            const error = await res.json();
            errorMessage = error.message || errorMessage;
            console.error("API Error Response:", error);
          } catch (e) {
            console.error("Failed to parse error response:", e);
          }
          throw new Error(errorMessage);
        }

        const result = await res.json();
        console.log("API Success Response:", result);
        return result;
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },

    onSuccess: (data) => {
      console.log("=== PRODUCT CREATION SUCCESS ===");
      console.log("Created Product:", data);

      toast({
        title: "Product Created",
        description: "The product has been created successfully.",
        variant: "default",
      });

      setIsSubmitting(false);
      onOpenChange(false);
      form.reset();
      setSelectedFiles([]);
      setImagePreviews([]);

      console.log("Form reset and modal closed");
    },

    onError: (error: Error) => {
      console.error("=== PRODUCT CREATION ERROR ===");
      console.error("Error:", error.message);
      console.error("Full Error:", error);

      toast({
        title: "Error Creating Product",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });

      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      console.log("=== FORM SUBMISSION STARTED ===");
      console.log("Form Data:", data);
      console.log("Selected Files Count:", selectedFiles.length);

      // Create FormData object
      const formData = new FormData();

      // Add all form fields as strings
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("category_id", data.category_id);
      formData.append("price", data.price.toString());
      formData.append("status", data.status);
      formData.append("cost_price", data.cost_price?.toString() || "");
      formData.append("stock_quantity", data.stock_quantity.toString());

      // Add optional fields
      if (data.vendor) {
        formData.append("vendor", data.vendor);
      }

      // Add tags as JSON string
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", JSON.stringify(data.tags));
        console.log("Tags added:", data.tags);
      }

      // Add ALL images under the same "images" key
      if (selectedFiles.length > 0) {
        console.log("=== ADDING IMAGES TO FORMDATA ===");
        selectedFiles.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
          console.log(`Added images[${index}]:`, {
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            type: file.type,
          });
        });
        console.log(`Total images added: ${selectedFiles.length}`);
      }

      console.log("=== FORMDATA PREPARATION COMPLETE ===");
      console.log(
        "Total FormData entries:",
        Array.from(formData.entries()).length
      );

      // Submit the FormData
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

    console.log("=== NEW FILES SELECTED ===");
    console.log("Number of files:", files.length);

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    newFiles.forEach((file, index) => {
      console.log(`File ${index + 1}:`, {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
      });

      // Validate file type
      if (!file.type.startsWith("image/")) {
        console.warn(`File ${file.name} is not an image, skipping`);
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`File ${file.name} is too large`);
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push(previewUrl);
    });

    // Update state
    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset input
    event.target.value = "";

    if (validFiles.length > 0) {
      toast({
        title: "Images Added",
        description: `${validFiles.length} image${
          validFiles.length !== 1 ? "s" : ""
        } added successfully`,
      });
    }
  };

  // Remove specific image
  const removeImage = (indexToRemove: number) => {
    console.log("Removing image at index:", indexToRemove);

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category_id">Category</Label>
              <Controller
                name="category_id"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((cat, index) => (
                        <SelectItem key={cat} value={(index + 1).toString()}>
                          {cat}
                        </SelectItem>
                      ))}
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
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.status && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.status.message}
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
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              className="mt-2 h-[44px]"
              id="vendor"
              {...form.register("vendor")}
            />
          </div>

          {/* Images Section */}
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
