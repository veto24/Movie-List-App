import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightStartOnRectangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import { Movie } from "@prisma/client";
import Pagination from "./components/Pagination";

const Movies = async ({
  searchParams,
}: {
  searchParams: { page?: string } | any;
}) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 8;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/movies?page=${currentPage}&limit=${limit}`
  );

  const { movies, totalPages } = await response.json();

  return (
    <div className="min-h-screen px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-semibold text-white">My Movies</h1>
          <Link
            href="/movies/create"
            className="text-white py-2 px-2 rounded-md hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
          >
            <PlusCircleIcon className="h-6 w-6 text-white" />
          </Link>
        </div>
        {/* Logout Button */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/sign-in" });
          }}
        >
          <button
            className="text-white py-2 px-4 font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center"
            type="submit"
          >
            Logout
            <ArrowRightStartOnRectangleIcon
              className="h-5 w-5 text-white ml-2"
              strokeWidth={2}
            />
          </button>
        </form>
      </div>

      {/* Empty State */}
      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <h2 className="text-2xl font-semibold text-white">
            Your movie list is empty
          </h2>
          <Link
            href="/movies/create"
            className="mt-4 bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300"
          >
            Add a new movie
          </Link>
        </div>
      ) : (
        <>
          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {movies.map((movie: Movie) => (
              <Link key={movie.id} href={`/movies/edit/${movie.id}`}>
                <div className="bg-[#153041] p-4 rounded-lg shadow-lg cursor-pointer hover:bg-[#1e434e] transition duration-300">
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "125%" }} // 4/5 ratio = 0.8, so height = 125% of width
                  >
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      layout="fill" // Changed to fill to occupy container
                      objectFit="cover" // Changed to cover to maintain aspect ratio
                      className="rounded-md"
                    />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400">{movie.year}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
};

export default Movies;
