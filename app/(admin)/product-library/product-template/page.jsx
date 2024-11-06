// @/app/(admin)/product-library/product-template/page.jsx

"use server";

import { getProductTemplates } from "@/actions/productLibrary/productTemplateActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewProductTemplateButton } from "@/components/productLibraryColumns/productTemplateColumns";

export default async function ProductTemplatePage() {
  const templates = await getProductTemplates();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewProductTemplateButton />
      <DataTable columns={columns} data={templates} />
    </div>
  );
}
