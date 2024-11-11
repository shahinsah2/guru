// @/app/(admin)/settings/order-checklist/new/page.jsx

"use client";

import OrderChecklistForm from "@/components/settingsForms/OrderChecklistForm";

export default function NewOrderChecklistPage() {
  return (
    <div>
      <OrderChecklistForm type="create" />
    </div>
  );
}
