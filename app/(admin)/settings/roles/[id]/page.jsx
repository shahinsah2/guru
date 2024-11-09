// @/app/(admin)/settings/roles/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import RolesForm from "@/components/settingsForms/RolesForm";
import { getRoleById } from "@/actions/roleActions";
// import { useRouter } from "next/navigation";

export default function EditRolePage({ params }) {
  const { id } = params;
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      const role = await getRoleById(id);
      setRoleData(role);
      setLoading(false);
    }
    fetchRole();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <RolesForm type="edit" data={roleData} />
    </div>
  );
}
