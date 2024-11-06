// @/app/(admin)/settings/order-checklist/new/page.jsx

"use client";

import OrderChecklistForm from "@/components/settingsForms/OrderChecklistForm";

export default function NewOrderChecklistPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <OrderChecklistForm type="create" />
    </div>
  );
}
