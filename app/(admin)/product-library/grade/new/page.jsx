// @/app/(admin)/product-library/grade/new/page.jsx

"use client";

import GradeForm from "@/components/productLibraryForms/GradeForm";

export default function NewGradePage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <GradeForm type="create" />
    </div>
  );
}
