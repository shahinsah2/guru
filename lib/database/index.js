// @/lib/database/index.js

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  // If the connection is already established, return it
  if (cached.conn) {
    return cached.conn;
  }

  // Check if there's no URI present
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  // If a promise is already in progress, await it
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'guru1',
      bufferCommands: false,  // Disable mongoose buffering commands
    });
  }

  // Wait for the connection to resolve
  cached.conn = await cached.promise;

  return cached.conn;
};
