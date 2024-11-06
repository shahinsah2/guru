// @/app/(admin)/settings/branches/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import BranchForm from "@/components/settingsForms/BranchForm";
import { getBranchById } from "@/actions/settings/branchActions";
import { useRouter } from "next/navigation";

export default function EditBranchPage({ params }) {
  const { id } = params;
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranch() {
      const branch = await getBranchById(id);
      setBranchData(branch);
      setLoading(false);
    }
    fetchBranch();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <BranchForm type="edit" data={branchData} />
    </div>
  );
}
