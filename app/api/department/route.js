// app/api/department/route.js
import { connectToDatabase } from '@/lib/database';
import Department from '@/lib/database/models/Department.model';


// GET all departments
export async function GET() {
  try {
    await connectToDatabase();
    const departments = await Department.find();
    return new Response(JSON.stringify(departments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching departments',error }), { status: 500 });
  }
}

// POST (create) a new department
export async function POST(req) {
  try {
    await connectToDatabase();
    const departmentData = await req.json();

    const newDepartment = new Department(departmentData);
    await newDepartment.save();

    return new Response(JSON.stringify({ message: 'Department created successfully!', department: newDepartment }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error creating department',error }), { status: 500 });
  }
}

// PUT (update) a department
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();

    const updatedDepartment = await Department.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDepartment) return new Response(JSON.stringify({ message: 'Department not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Department updated successfully!', department: updatedDepartment }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating department',error }), { status: 500 });
  }
}

// DELETE a department
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) return new Response(JSON.stringify({ message: 'Department not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Department deleted successfully!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting department',error }), { status: 500 });
  }
}
