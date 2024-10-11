// app/api/user-by-username/route.js

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';

// Fetch user by Clerk username (login_id) 
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username'); // Get the username from the query params

    if (!username) {
      return new Response(JSON.stringify({ message: 'Username is required' }), { status: 400 });
    }


    // Find user by login_id (same as clerk username)
    const user = await User.findOne({ login_id: username }).populate('roles departments branches');
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching user', error }), { status: 500 });
  }
}
