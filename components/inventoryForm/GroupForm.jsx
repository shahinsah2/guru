"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createGroup, updateGroup, uploadImage } from "@/actions/inventory/groupActions"; // Ensure uploadImage action exists
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const schema = z.object({
  group_name: z.string().nonempty("Group Name is required!"),
  description: z.string().optional(),
  active_status: z.boolean().default(true),
  image: z.any().optional(), // Validate image field
});

const GroupForm = ({ type, data }) => {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [imageUrl, setImageUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Reset form when data is available (for edit mode)
  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  // Handle form submission
  const onSubmit = handleSubmit(async (formData) => {
    try {
      let uploadedImageUrl = formData.image; // Use existing image URL if present
  
      // If a new image is provided, upload it to Cloudinary client-side
      if (formData.image && formData.image instanceof File) {
        const formDataToUpload = new FormData();
        formDataToUpload.append("file", formData.image);
        formDataToUpload.append("upload_preset", "f7qcu316");  // Add your preset here
  
        const cloudinaryResponse = await fetch("https://api.cloudinary.com/v1_1/ds8msc40y/image/upload", {
          method: "POST",
          body: formDataToUpload,
        });
  
        const data = await cloudinaryResponse.json();
        uploadedImageUrl = data.secure_url; // Use Cloudinary's secure URL
      }
  
      const groupData = { ...formData, image: uploadedImageUrl };
  
      // Create or Update the group based on the type prop
      if (type === "create") {
        await createGroup(groupData);
      } else {
        await updateGroup({ ...groupData, id: data?._id });
      }
  
      toast.success(`Group ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/inventory/group");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  });
  

  // Handle image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Set image preview
      setValue("image", file); // Store the file in form state
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <h1 className="text-xl font-semibold col-span-2">{type === "create" ? "Add Group" : "Edit Group"}</h1>

      <div className="col-span-2">
        <label className="text-sm font-medium">Group Name</label>
        <Input {...register("group_name")} placeholder="Enter Group Name" />
        {errors.group_name && <p className="text-red-500 text-xs">{errors.group_name.message}</p>}
      </div>

      <div className="col-span-2">
        <label className="text-sm font-medium">Description</label>
        <Input {...register("description")} placeholder="Enter Description" />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      {/* Image Upload Field */}
      <div className="col-span-2">
        <label className="text-sm font-medium">Group Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2 block w-full" />
        {previewImage && (
          <div className="mt-4 relative w-24 h-24">
            <Image src={previewImage} alt="Group preview" layout="fill" objectFit="cover" className="rounded" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 col-span-2">
        <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
        <label className="text-sm font-medium">Active Status</label>
      </div>

      <div className="col-span-2 flex justify-end">
        <Button variant="outline" onClick={() => router.push("/inventory/group")}>Cancel</Button>
        <Button type="submit" className="bg-blue-500 text-white mx-2">{type === "create" ? "Create" : "Update"}</Button>
      </div>
    </form>
  );
};

export default GroupForm;