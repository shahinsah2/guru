// app/api/role/route.ts
import { connectToDatabase } from '@/lib/database';
import Role from '@/lib/database/models/Role.model';


// GET all roles
export async function GET() {
  try {
    await connectToDatabase();
    const roles = await Role.find().populate('department');
    return new Response(JSON.stringify(roles), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching roles',error }), { status: 500 });
  }
}

// POST (create) a new role
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const roleData = await req.json();

    const newRole = new Role(roleData);
    await newRole.save();

    return new Response(JSON.stringify({ message: 'Role created successfully!', role: newRole }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error creating role',error }), { status: 500 });
  }
}

// PUT (update) a role
export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();

    const updatedRole = await Role.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedRole) return new Response(JSON.stringify({ message: 'Role not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Role updated successfully!', role: updatedRole }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating role',error }), { status: 500 });
  }
}

// DELETE a role
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) return new Response(JSON.stringify({ message: 'Role not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Role deleted successfully!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting role',error }), { status: 500 });
  }
}
