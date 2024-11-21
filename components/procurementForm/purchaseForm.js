// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { createPurchase, updatePurchase } from '@/actions/procurement/purchaseAction';
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { useEffect, useState } from "react";

// const schema = z.object({
//   pr_id: z
//     .number()
//     .positive("require")
//     .or(z.undefined().nullable()),

//   pr_date: z
//     .date()
//     .nullable()
//     .or(z.undefined())
//     .refine((date) => date === null || date === undefined || date instanceof Date, {
//       message: "Invalid date format",
//     }),


    

// // Cannot read properties of undefined (reading 'pr_id')


//   pr_owner: z.string().min(1, { message: "Owner is required!" }),

//   supplier: z.string().min(1, { message: "Supplier is required!" }),
//   total_product_qty: z
//     .number()
//     .positive("require")
//     .or(z.undefined().nullable()), approve_status: z.string().min(1, { message: "Approve Status is required!" }),
//   move_to_next: z.string().min(1, { message: "Move to Next is required!" }),
//   active_status: z.boolean().default(true),
// });

// const PurchaseRequestForm = ({ type, data }) => {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//     reset
//   } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: data || {},
//   });

//   const [state, setState] = useState({ success: false, error: false, loading: false, message: "" });

//   useEffect(() => {
//     if (type === "edit" && data) reset(data);
//   }, [type, data, reset]);

//   const onSubmit = handleSubmit(async (formData) => {
//     console.log("get data",onSubmit)
//     setState((prevState) => ({ ...prevState, loading: true }));
//     try {
//       const response = await (type === "create" ? createPurchase : updatePurchase)({
//         ...formData,
//         id: data?._id
//       });
//       if (!response.success) {
//         setState({ success: false, error: true, loading: false, message: response.message });
//       } else {
//         setState({ success: true, error: false, loading: false, message: "" });
//         toast.success(`Purchase ${type === "create" ? "created" : "updated"} successfully!`);
//         router.push("/procurement/purchase");
//       }
//     } catch (error) {
//       setState({ success: false, error: true, loading: false, message: error.message });
//     }
//   });
//   useEffect(() => {
//     if (state?.success) {
//       toast.success(`Product  ${type === "create" ? "created" : "updated"} successfully!`);
//       router.push("/procurement/purchase");
//       router.refresh();
//     } else if (state?.error) {
//       toast.error(state.message);
//     }
//   }, [state, router, type]);

//   return (
//     <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
//       <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
//         <h1 className="text-xl font-semibold">
//           {type === "create" ? "Create Purchase Request" : "Edit Purchase Request"}
//         </h1>

//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="bg-gray-50 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="mb-4">
//               <label htmlFor="pr_id" className="text-sm font-medium">
//                 Pr Id

//               </label>
//               <Input
//                 id="pr_id"
//                 type="number"
//                 {...register("pr_id", { valueAsNumber: true })}
//                 placeholder="Enter pr_id"
//                 className="w-full max-w-xs border border-gray-300 rounded-md p-2"
//               />
//               {errors.pr_id && (
//                 <p className="text-red-500 text-xs">{errors.pr_id.message}</p>
//               )}
//             </div>

//             <div className="mb-4">
//               <label htmlFor="pr_date" className="text-sm font-medium">
//                 PR Date
//               </label>
//               <Input
//                 id="pr_date"
//                 type="date"
//                 {...register("pr_date", { valueAsDate: true })}
//                 className="w-full max-w-xs border border-gray-300 rounded-md p-2"
//               />
//               {errors.pr_date && (
//                 <p className="text-red-500 text-xs">{errors.pr_date.message}</p>
//               )}
//             </div>




//             <div>
//               <label className="text-sm font-medium">Owner</label>
//               <Input {...register("pr_owner")} placeholder="Enter Owner" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
//               {errors.pr_owner && <p className="text-red-500 text-xs">{errors.pr_owner.message}</p>}
//             </div>

//             <div>
//               <label className="text-sm font-medium">Supplier</label>
//               <Input {...register("supplier")} placeholder="Enter Supplier" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
//               {errors.supplier && <p className="text-red-500 text-xs">{errors.supplier.message}</p>}
//             </div>

//             <div className="mb-4">
//               <label htmlFor="total_product_qty" className="text-sm font-medium">
//                 Product Price

//               </label>
//               <Input
//                 id="total_product_qty"
//                 type="number"
//                 {...register("total_product_qty", { valueAsNumber: true })}
//                 placeholder="Enter product Qty"
//                 className="w-full max-w-xs border border-gray-300 rounded-md p-2"
//               />
//               {errors.total_product_qty && (
//                 <p className="text-red-500 text-xs">{errors.total_product_qty.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium">Approve Status</label>
//               <Input {...register("approve_status")} placeholder="Enter Status" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
//               {errors.approve_status && <p className="text-red-500 text-xs">{errors.approve_status.message}</p>}
//             </div>

//             <div>
//               <label className="text-sm font-medium">Move to Next</label>
//               <Input {...register("move_to_next")} placeholder="Move to Next" className="w-full max-w-xs border border-gray-300 rounded-md p-2" />
//               {errors.move_to_next && <p className="text-red-500 text-xs">{errors.move_to_next.message}</p>}
//             </div>
//           </div>

//           <div className="bg-gray-50 p-6 border rounded-lg shadow-lg w-full md:w-1/3">
//             <h3 className="text-lg font-semibold mb-4">Control</h3>
//             <div className="flex items-center gap-2">
//               <Checkbox checked={watch("active_status")} onCheckedChange={(checked) => setValue("active_status", checked)} />
//               <label className="text-sm font-medium">Active Status</label>
//             </div>
//           </div>
//         </div>
//       </div>

//      {/* Actions */}
//      <div className="flex justify-end gap-4 mt-6">
//         <Button variant="outline" onClick={() => router.push("/procurement/purchase")}>
//           Cancel
//         </Button>
//         <Button type="submit" className="bg-blue-500 text-white">
//           {type === "create" ? "Create" : "Update"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default PurchaseRequestForm;



"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

import { createPurchase, updatePurchase } from "@/actions/procurement/purchaseAction";



// Zod Schema with Preprocessing
const schema = z.object({
  pr_id: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),
  pr_date: z
    .preprocess((value) => (value ? new Date(value) : undefined), z.date().or(z.undefined())),
  pr_owner: z.string().min(1, { message: "Owner is required!" }),
  supplier: z.string().min(1, { message: "Supplier is required!" }),
  total_product_qty: z
    .preprocess((value) => (value ? parseInt(value, 10) : undefined), z.number().positive().or(z.undefined())),
  approve_status: z.string().min(1, { message: "Approve Status is required!" }),
  active_status: z.boolean().default(true),
});

const PurchaseRequestForm = ({ type, data }) => {
 
  const router = useRouter();


  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [state, formAction] = useFormState(
    type === "create" ? createPurchase : updatePurchase,
    { success: false, error: false, message: "" }
  );




  const onSubmit = handleSubmit(async (formData) => {
    console.log(onSubmit)
    try {
      // Send plain data to the server action
      const plainData = {
        ...formData,
        id: data?._id,
      };

      await formAction(plainData);
    } catch (error) {
      console.error(error.message || "An unexpected error occurred.");
      toast.error(error.message || "An unexpected error occurred.");
    }
  });


  useEffect(() => {
    if (state?.success) {
      toast.success(`Product Template ${type === "create" ? "created" : "updated"} successfully!`);
      router.push("/procurement/purchase");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router, type]);

  return (
    <form className="w-full max-w-1xl mx-auto p-8 bg-white shadow-md rounded-lg" onSubmit={onSubmit}>
      <div className="bg-gray-50 p-6 border rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create Purchase Request" : "Edit Purchase Request"}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PR ID */}
            <div className="mb-4">
              <label htmlFor="pr_id" className="text-sm font-medium">PR ID</label>
              <Input
                id="pr_id"
                type="number"
                {...register("pr_id")}
                placeholder="Enter PR ID"
              />
              {errors.pr_id && <p className="text-red-500 text-xs">{errors.pr_id.message}</p>}
            </div>

            {/* PR Date */}
            <div className="mb-4">
              <label htmlFor="pr_date" className="text-sm font-medium">PR Date</label>
              <Input
                id="pr_date"
                type="date"
                {...register("pr_date")}
              />
              {errors.pr_date && <p className="text-red-500 text-xs">{errors.pr_date.message}</p>}
            </div>

            {/* Other Fields */}
            {/* Owner */}
            <div>
              <label className="text-sm font-medium">Owner</label>
              <Input {...register("pr_owner")} placeholder="Enter Owner" />
              {errors.pr_owner && <p className="text-red-500 text-xs">{errors.pr_owner.message}</p>}
            </div>

            {/* Supplier */}
            <div>
              <label className="text-sm font-medium">Supplier</label>
              <Input {...register("supplier")} placeholder="Enter Supplier" />
              {errors.supplier && <p className="text-red-500 text-xs">{errors.supplier.message}</p>}
            </div>

            {/* Total Product Qty */}
            <div>
              <label className="text-sm font-medium">Product Qty</label>
              <Input
                type="number"
                {...register("total_product_qty")}
                placeholder="Enter Qty"
              />
              {errors.total_product_qty && <p className="text-red-500 text-xs">{errors.total_product_qty.message}</p>}
            </div>

            {/* Approve Status */}
            <div>
              <label className="text-sm font-medium">Approve Status</label>
              <Input {...register("approve_status")} placeholder="Enter Status" />
              {errors.approve_status && <p className="text-red-500 text-xs">{errors.approve_status.message}</p>}
            </div>

         
          </div>
          <div className="w-full md:w-1/3">
            <Checkbox
              checked={watch("active_status")}
              onCheckedChange={(checked) => setValue("active_status", checked)}
            />
            <label className="text-sm font-medium">Active Status</label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/procurement/purchase")}>Cancel</Button>
        <Button type="submit" className="bg-blue-500 text-white">{type === "create" ? "Create" : "Update"}</Button>
      </div>
    </form>
  );
};

export default PurchaseRequestForm;

