// @/app/(admin)/settings/terms/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import TermsForm from "@/components/settingsForms/TermsForm";
import { getTermById } from "@/actions/settings/termsAndConditionsActions";
import { useRouter } from "next/navigation";

export default function EditTermsPage({ params }) {
  const { id } = params;
  const [termData, setTermData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTerm() {
      const term = await getTermById(id);
      setTermData(term);
      setLoading(false);
    }
    fetchTerm();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <TermsForm type="edit" data={termData} />
    </div>
  );
}
