"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
// import type { Category } from "@/app/dashboard/categories/types";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Category } from "@/types/CategoryDataType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Zod schema (no need for image validation now)
const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50),
  type: z
    .string()
    .min(2, "Category type must be at least 2 characters")
    .max(50),
  description: z.string().max(200).optional(),
  imageUrl: z.string().url().optional(), // For preview only
});

type CategoryFormValues = z.infer<typeof categorySchema> & {
  imageFile?: File; // for FormData
};

interface AddCategorySheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categoryToEdit?: Category | null;
}

export function AddCategorySheet({
  isOpen,
  onOpenChange,
  categoryToEdit,
}: AddCategorySheetProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      imageUrl: "",
      imageFile: undefined,
    },
  });
  const session = useSession();
  const token = session?.data?.accessToken ?? {};

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        form.reset({
          name: categoryToEdit.name,
          type: categoryToEdit.type || "",
          description: categoryToEdit.description || "",
          imageUrl: categoryToEdit.imageUrl || "",
          imageFile: undefined,
        });
      } else {
        form.reset();
      }
    }
  }, [isOpen, categoryToEdit, form]);

  const categoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      if (data.description) formData.append("description", data.description);
      if (data.imageFile) formData.append("image", data.imageFile);

      const res = await fetch(
        categoryToEdit
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryToEdit.id}?_method=PUT`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          method: "POST",
          headers: {
            Accept: "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to save category");
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: categoryToEdit ? "Category Updated" : "Category Added",
        description: data.message,
      });
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    categoryMutation.mutate(data);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) form.reset();
      }}
    >
      <SheetContent className="sm:max-w-md w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {categoryToEdit ? "Edit Category" : "Add Category"}
          </SheetTitle>
          <SheetDescription>
            {categoryToEdit
              ? "Update category details below."
              : "Add a new product category."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input className="mt-3" id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type">Category Type</Label>
            <Select
              onValueChange={(value) => form.setValue("type", value)}
              value={form.watch("type")}
            >
              <SelectTrigger className="mt-3">
                <SelectValue placeholder="Select a category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Skincare">Skincare</SelectItem>
                <SelectItem value="Collections">Collections</SelectItem>
                {/* <SelectItem value="digital">Digital</SelectItem> */}
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              className="mt-3"
              id="description"
              {...form.register("description")}
              placeholder="Write a brief description..."
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <Label htmlFor="image">Category Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              className="mt-3"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  form.setValue("imageFile", file);
                  const previewUrl = URL.createObjectURL(file);
                  form.setValue("imageUrl", previewUrl);
                }
              }}
            />
            {form.watch("imageUrl") && (
              <Image
                width={100}
                height={100}
                src={form.watch("imageUrl") || ""}
                alt="Preview"
                className="mt-3 max-h-32 rounded"
              />
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
              disabled={categoryMutation.isPending}
              className="bg-brand-black text-brand-white hover:bg-brand-black/90"
            >
              {categoryMutation.isPending
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
  );
}
