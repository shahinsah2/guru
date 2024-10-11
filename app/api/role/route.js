// app/api/role/route.js
import { connectToDatabase } from '@/lib/database';
import Role from '@/lib/database/models/Role.model';

// GET all roles
export async function GET() {
  try {
    await connectToDatabase();
    const roles = await Role.find().populate('department');

    // Format the roles to send proper structure in response
    const formattedRoles = roles.map((role) => {
      const formattedModuleAccess = role.module_access.map((module) => {
        const { module_name, ...permissions } = module;
        return {
          module_name,
          permissions,  // Return permissions as an object
        };
      });
      return {
        ...role._doc,  // Spread the other fields
        module_access: formattedModuleAccess,  // Return the formatted module access
      };
    });

    return new Response(JSON.stringify(formattedRoles), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching roles', error }), { status: 500 });
  }
}

// POST (create) a new role
export async function POST(req) {
  try {
    await connectToDatabase();
    const roleData = await req.json();

    console.log('Role data received:', roleData);

    // Unpack permissions and reformat them properly for saving
    const formattedModuleAccess = roleData.module_access.map((module) => {
      const { permissions, module_name } = module;

      // Explicitly extract the permission fields
      return {
        module_name,
        ...permissions,  // Spread permissions to separate keys like can_add, can_edit, etc.
      };
    });

    // Create a new role with the unpacked module access
    const newRole = new Role({
      ...roleData,
      module_access: formattedModuleAccess,  // Assign the formatted module access
    });

    await newRole.save();

    return new Response(JSON.stringify({ message: 'Role created successfully!', role: newRole }), { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return new Response(JSON.stringify({ message: 'Error creating role', error }), { status: 500 });
  }
}

// PUT (update) a role
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();

    // Unpack permissions and reformat them properly for saving
    const formattedModuleAccess = updateData.module_access.map((module) => {
      const { permissions, module_name } = module;

      // Explicitly extract the permission fields
      return {
        module_name,
        ...permissions,  // Spread permissions to separate keys like can_add, can_edit, etc.
      };
    });

    const updatedRole = await Role.findByIdAndUpdate(id, { ...updateData, module_access: formattedModuleAccess }, { new: true });
    if (!updatedRole) return new Response(JSON.stringify({ message: 'Role not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Role updated successfully!', role: updatedRole }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating role', error }), { status: 500 });
  }
}

// DELETE a role
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) return new Response(JSON.stringify({ message: 'Role not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Role deleted successfully!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting role', error }), { status: 500 });
  }
}
