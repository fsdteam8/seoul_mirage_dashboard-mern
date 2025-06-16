"use client";

import { useEffect, useState } from "react";
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
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Category {
  id: number;
  name: string;
  description: string | null;
  type: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

const categorySchema = z.object({
  name: z.string().min(2).max(50),
  type: z.string().min(2).max(50),
  description: z.string().max(200).nullable(),
  image: z.string().nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

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
  const session = useSession();
  const token = session?.data?.accessToken ?? "";

  // Store new image file locally
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Store existing image URL from backend (relative path)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "",
      description: null,
      image: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        form.reset({
          name: categoryToEdit.name,
          type: categoryToEdit.type,
          description: categoryToEdit.description,
          image: categoryToEdit.image,
        });
        setExistingImageUrl(categoryToEdit.image);
        setImageFile(null);
      } else {
        form.reset();
        setExistingImageUrl(null);
        setImageFile(null);
      }
    }
  }, [isOpen, categoryToEdit, form]);

  const categoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const isEdit = !!categoryToEdit;
      const url = isEdit
        ? `${backendUrl}/api/categories/${categoryToEdit!.id}`
        : `${backendUrl}/api/categories`;

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      if (data.description) formData.append("description", data.description);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(url, {
        method: "POST", // or PUT/PATCH for edit if your API expects it
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Content-Type NOT set when using FormData
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to save category");
      }
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: categoryToEdit ? "Category Updated" : "Category Added",
        description: data.message || "Success!",
      });
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
      setImageFile(null);
      setExistingImageUrl(null);
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
        if (!open) {
          form.reset();
          setImageFile(null);
          setExistingImageUrl(null);
        }
      }}
    >
      <SheetContent className="sm:max-w-md w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {categoryToEdit ? "Edit Category" : "Add Category"}
          </SheetTitle>
          <SheetDescription>
            {categoryToEdit
              ? "Update the category info."
              : "Create a new category."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" {...form.register("name")} className="mt-2" />
          </div>

          <div>
            <Label htmlFor="type">Category Type</Label>
            <Select
              onValueChange={(value) => form.setValue("type", value)}
              value={form.watch("type")}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Products">Products</SelectItem>
                <SelectItem value="Skincare">Skincare</SelectItem>
                <SelectItem value="Collections">Collections</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              className="mt-2"
              placeholder="Optional..."
            />
          </div>

          <div>
            <Label htmlFor="image">Category Image</Label>
            <Input
              id="image"
              type="file"
              className="mt-2"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);

                if (file) {
                  setExistingImageUrl(null); // Clear existing image if new selected
                }
              }}
            />

            {imageFile ? (
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                width={100}
                height={100}
                className="mt-3 rounded"
              />
            ) : existingImageUrl ? (
              <Image
                src={`${backendUrl}/${existingImageUrl}`}
                alt="Existing Image"
                width={100}
                height={100}
                className="mt-3 rounded"
              />
            ) : null}
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={categoryMutation.isPending}>
              {categoryToEdit
                ? categoryMutation.isPending
                  ? "Saving..."
                  : "Save Changes"
                : categoryMutation.isPending
                ? "Adding..."
                : "Add Category"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
