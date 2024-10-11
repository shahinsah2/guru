// app/api/branch/route.js
import { connectToDatabase } from '@/lib/database';
import Branch from '@/lib/database/models/Branch.model';


// GET all branches
export async function GET() {
  try {
    await connectToDatabase();
    const branches = await Branch.find();
    return new Response(JSON.stringify(branches), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching branches',error }), { status: 500 });
  }
}

// POST (create) a new branch
export async function POST(req) {
  try {
    await connectToDatabase();
    const branchData = await req.json();

    console.log('==branchData====');
    console.log(branchData);
    console.log('===branchData===');

    const newBranch = new Branch(branchData);
    await newBranch.save();

    return new Response(JSON.stringify({ message: 'Branch created successfully!', branch: newBranch }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error creating branch',error }), { status: 500 });
  }
}

// PUT (update) a branch
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();

    const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBranch) return new Response(JSON.stringify({ message: 'Branch not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Branch updated successfully!', branch: updatedBranch }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating branch',error }), { status: 500 });
  }
}

// DELETE a branch
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    const deletedBranch = await Branch.findByIdAndDelete(id);
    if (!deletedBranch) return new Response(JSON.stringify({ message: 'Branch not found' }), { status: 404 });

    return new Response(JSON.stringify({ message: 'Branch deleted successfully!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting branch',error }), { status: 500 });
  }
}
