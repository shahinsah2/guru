"use client";

import { useEffect, useState } from "react";
import PurchaseRequestForm from "@/components/procurementForm/purchaseForm";
import { getPurchaseById } from '@/actions/procurement/purchaseAction';
import { useRouter } from "next/navigation";

export default function EditPrPage({ params }) {
  const { id } = params;
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchase() {
      const purchase = await getPurchaseById(id);
      setPurchaseData(purchase);
      setLoading(false);
    }
    fetchPurchase();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div>
<PurchaseRequestForm type="edit" data={purchaseData} />
</div>
  );
}
