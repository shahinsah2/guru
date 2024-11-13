// @/app/(admin)/product-library/group/[id]/page.jsx

"use client";

import { useEffect, useState } from 'react';
import GroupForm from "@/components/inventoryForm/GroupForm";
import { getGroupById } from "@/actions/inventory/groupActions";

export default function UpdateGroupPage({ params }) {
  const { id } = params;
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroup() {
      const group = await getGroupById(id);
      setGroupData(group);
      setLoading(false);
    }
    fetchGroup();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <GroupForm type="edit" data={groupData} />
    </div>
  );
}
