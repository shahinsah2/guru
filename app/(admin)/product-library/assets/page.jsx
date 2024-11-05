// @/app/(admin)/product-library/assets/page.jsx

"use server";

import { getAssets } from "@/actions/productLibrary/assetActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewAssetButton } from "@/components/productLibraryColumns/assetColumns";

export default async function AssetPage() {
  const assets = await getAssets();

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewAssetButton />
      <DataTable columns={columns} data={assets} />
    </div>
  );
}
