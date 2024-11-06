// @/app/(admin)/settings/tax-list/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import TaxListForm from "@/components/settingsForms/TaxListForm";
import { getTaxListById } from "@/actions/settings/taxListActions";
import { useRouter } from "next/navigation";

export default function EditTaxListPage({ params }) {
  const { id } = params;
  const [taxListData, setTaxListData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTaxList() {
      const taxList = await getTaxListById(id);
      setTaxListData(taxList);
      setLoading(false);
    }
    fetchTaxList();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <TaxListForm type="edit" data={taxListData} />
    </div>
  );
}