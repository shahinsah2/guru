// @/app/(admin)/user-performance/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import UserPerformanceForm from "@/components/userPerformanceForms/UserPerformanceForm";
import { getUserPerformanceById } from "@/actions/user-performance/userPerformanceActions";

export default function UpdateUserPerformancePage({ params }) {
  const { id } = params;
  const [userPerformanceData, setUserPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserPerformance() {
      const performance = await getUserPerformanceById(id);
      setUserPerformanceData(performance);
      setLoading(false);
    }
    fetchUserPerformance();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div>
      <UserPerformanceForm type="edit" data={userPerformanceData} />
    </div>
  );
}
