"use client";
import Image from "next/image";

export const columns = [
  {
    accessorKey: "u",
    header: "Product Image",
    cell: ({ row }) => (
      row.index + 1,
      (
        <div className="flex justify-center mr-5">
          <Image
            src={row.original.image || "/avatar.png"} // Placeholder if no image
            alt="Product"
            width={64} 
            height={64}
            className="w-16 h-16 object-cover border rounded"
          />
        </div>
      )
    ),
  },
  {
    id: "product_name", // Add unique ID
    accessorKey: "product_name",
    header: "Product Name",
  },
  {
    id: "brand", // Add unique ID
    accessorKey: "brand",
    header: "Brand",
  },
  {
    id: "specifications", // Already has an ID
    header: "Specifications",
    cell: ({ row }) => {
      const specs = row.original.specifications || {};
      return (
        <ul className="text-sm">
          {Object.entries(specs).map(([key, spec]) => (
            <li key={key}>
              <strong className="capitalize">{key}:</strong>{" "}
              {spec?.brand?.brand_name || "N/A"} - {spec?.type?.type || "N/A"}
            </li>
          ))}
        </ul>
      );
    },
  },
];
