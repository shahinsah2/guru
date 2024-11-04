// @/app/(admin)/settings/user/page.jsx
"use server";
import { getUsers, getUserByUsername } from "@/actions/userActions";
import { currentUser } from "@clerk/nextjs/server";

import { DataTable } from "@/components/DataTable";
import { columns, CreateNewUserButton } from "@/components/columns/usersColumns";

const moduleName = "Users";

export default async function UserPage({ searchParams }) {
  const { page } = searchParams;
  const user = await currentUser();

  if (!user) return {};

  // Fetch all users
  const users = await getUsers();

  // Fetch specific user by username
  const userDataByUsername = await getUserByUsername(user.username);

  // Log fetched data
  console.log("username:", user.username);
    console.log("User data by username:", userDataByUsername);

  return (
    <div className="bg-white p-1 rounded-md mt-0 flex-1">
      <CreateNewUserButton />
      <DataTable columns={columns} data={users} />
    </div>
  );
}
