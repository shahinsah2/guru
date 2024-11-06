// @/app/api/upload-image/route.js

import { NextResponse } from 'next/server';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExtension}`);
  }
});

const upload = multer({ storage });

// Middleware function to process the multipart/form-data request with multer
const parseFile = upload.single('image');

// Utility function to wrap the multer middleware for Next.js
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Main POST handler
export async function POST(req) {
  const res = NextResponse.next();

  try {
    // Run multer middleware to handle file upload
    await runMiddleware(req, res, parseFile);

    if (!req.file) {
      // Handle cases where no file was uploaded
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Return the file path
    const filePath = `/images/${req.file.filename}`;
    return NextResponse.json({ filePath }, { status: 200 });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
