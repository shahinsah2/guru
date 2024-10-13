// @/actions/getUserByUsername.js
"use server";

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User.model';

export const getUserByUsername = async (username) => {

  await connectToDatabase();
  
  // Find user by login_id (same as Clerk username)
  const user = await User.findOne({ login_id: username }).populate('roles');
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
