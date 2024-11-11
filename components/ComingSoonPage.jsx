"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

const ComingSoonPage = ({ currentPage }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Show nothing if user data isn't loaded or if the user isn't signed in
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          {currentPage} - Coming Soon
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Hello, {user?.username}! We&apos;re working hard to bring{" "}
          {currentPage} to you. Stay tuned for updates!
        </p>

        <div className="flex justify-center space-x-4 mb-6">
          <a
            href="https://example.com/notify-me"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300"
          >
            Notify Me
          </a>
          <a
            href="https://example.com/learn-more"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-300"
          >
            Learn More
          </a>
        </div>

        <p className="text-sm text-gray-500">
          © 2024 Guru Goutam Infotech. Developed by Innogenx. All Rights
          Reserved.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
