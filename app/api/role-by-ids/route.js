// app/api/role-by-ids/route.js

import { connectToDatabase } from '@/lib/database';
import Role from '@/lib/database/models/Role.model';
import mongoose from 'mongoose';

// POST (Fetch roles by IDs)
export async function POST(req) {
  try {
    await connectToDatabase();
    
    const { roleIds } = await req.json(); // Accept role IDs from the request body

    if (!roleIds || !Array.isArray(roleIds)) {
      return new Response(JSON.stringify({ message: 'Invalid role IDs provided' }), { status: 400 });
    }

    // Convert roleIds into ObjectId instances
    const objectIds = roleIds.map((roleId) => new mongoose.Types.ObjectId(roleId));

    // Find roles matching the provided role IDs
    const roles = await Role.find({ _id: { $in: objectIds } }).populate('department');

    return new Response(JSON.stringify(roles), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching roles', error }), { status: 500 });
  }
}
