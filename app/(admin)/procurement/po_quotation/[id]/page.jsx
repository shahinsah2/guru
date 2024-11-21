"use client";

import { useEffect, useState } from "react";
import PoQuotationForm from "@/components/procurementForm/po_quotationForm";
import { getPoQuotationById } from '@/actions/procurement/po_quotationAction';
import { useRouter } from "next/navigation";

export default function EditPrPage({ params }) {
  const { id } = params;
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchase() {
      const purchase = await getPoQuotationById(id);
      setPurchaseData(purchase);
      setLoading(false);
    }
    fetchPurchase();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div>
<PoQuotationForm type="edit" data={purchaseData} />
</div>
  );
}
