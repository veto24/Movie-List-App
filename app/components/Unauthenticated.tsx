import Link from "next/link";
import React from "react";

const Unauthenticated = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">User is not authenticated</h1>
      <Link
        href="/sign-in"
        className="bg-primary hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
      >
        Login
      </Link>
    </div>
  );
};

export default Unauthenticated;
