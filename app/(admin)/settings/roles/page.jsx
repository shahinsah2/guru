// app/(admin)/settings/roles/page.jsx

import { getRoles, getRolesCount } from "@/actions/roleActions";
import { getAllDepartments } from '@/actions/dataFetchActions';
import Table from "@/components/Table";
import FormModal from "@/components/settingsForms/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

export default async function RolesPage({ searchParams }) {
  const { page } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const [roles, totalRoles, departmentsOptions] = await Promise.all([
    getRoles({ skip: (currentPage - 1) * 10, limit: 10 }),
    getRolesCount(),
    getAllDepartments(),
  ]);

  console.log('====roles=====');
  console.log(roles);
  console.log('====roles=====');

  const columns = [
    { header: "Role Name", accessor: "role_name" },
    { header: "Department", accessor: "department.department_name" },
    { header: "Actions", accessor: "action" }
  ];

  const renderRow = (item) => (  
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td>{item.role_name}</td>
      <td>{item.department || "No Department"}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormModal table="Roles" type="update" data={JSON.stringify(item)} departmentsOptions={departmentsOptions} />
          <FormModal table="Roles" type="delete" id={item._id.toString()} />
        </div>
      </td>
    </tr>
  );
  

  return (
    <div className='bg-white p-4 rounded-md m-4 mt-0 flex-1'>
      {/* Top */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Roles</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src={'/filter.png'} alt='Filter' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src={'/sort.png'} alt='Sort' width={14} height={14} />
            </button>            
            <FormModal table="Roles" type="create" departmentsOptions={departmentsOptions} />
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={roles} />
      {/* Pagination */}
      <Pagination page={currentPage} count={totalRoles} />
    </div>
  );

}
