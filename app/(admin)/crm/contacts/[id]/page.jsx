"use client";

import { useEffect, useState } from "react";
import CRMForm from "@/components/crmForms/CRMForm"; // Adjust the path as necessary
import { getContactById } from "@/actions/crm/contactActions"; // Replace with your actual action

export default function UpdateContactPage({ params }) {
  const { id } = params;
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContact() {
      const contact = await getContactById(id);
      setContactData(contact);
      setLoading(false);
    }
    fetchContact();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div>
      <CRMForm type="edit" data={contactData} />
    </div>
  );
}
