// @/app/(admin)/settings/user/new/page.jsx
"use client";
import UsersForm from "@/components/settingsForms/UsersForm";

export default function NewUserPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <UsersForm type="create" />
    </div>
  );
}
