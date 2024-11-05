// @/app/(admin)/product-library/grade/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import GradeForm from "@/components/productLibraryForms/GradeForm";
import { getGradeById } from "@/actions/productLibrary/gradeActions";

export default function UpdateGradePage({ params }) {
  const { id } = params;
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrade() {
      const grade = await getGradeById(id);
      setGradeData(grade);
      setLoading(false);
    }
    fetchGrade();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <GradeForm type="edit" data={gradeData} />
    </div>
  );
}
