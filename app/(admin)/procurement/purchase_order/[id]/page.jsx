"use client";

import { useEffect, useState } from "react";
import PoForm from "@/components/procurementForm/purchase_orderForm";
import { getPoById } from '@/actions/procurement/purchase_orderAction';
import { useRouter } from "next/navigation";

export default function EditPrPage({ params }) {
  const { id } = params;
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchase() {
      const purchase = await getPoById(id);
      setPurchaseData(purchase);
      setLoading(false);
    }
    fetchPurchase();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div>
<PoForm type="edit" data={purchaseData} />
</div>
  );
}