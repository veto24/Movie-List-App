"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MovieForm from "@/app/components/MovieForm";

const EditMovie = ({ params }: { params: Promise<{ id: string }> }) => {
  const [movieId, setMovieId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<{
    title: string;
    year: number;
    fileUrl: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setMovieId(unwrappedParams.id);
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (movieId) {
      // Fetch movie data from API
      const fetchMovie = async () => {
        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + `/api/movies/${movieId}`
          );
          const data = await response.json();
          setInitialData({
            title: data.title,
            year: data.year,
            fileUrl: data.poster,
          });
        } catch (error) {
          console.error("Error fetching movie:", error);
        }
      };

      fetchMovie();
    }
  }, [movieId]);

  const handleSubmit = async (formData: {
    title: string;
    year: number;
    fileUrl: string;
  }) => {
    if (!movieId) return;

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/movies/${movieId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      await response.json();

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Note: The poster is already deleted in the bucket in the movie form
  const handleDelete = async () => {
    if (!movieId) return;

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/movies/${movieId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        router.push("/");
      } else {
        const errorText = await response.text();
        throw new Error(`Error deleting movie: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-16">
      <div className="max-w-4xl w-full bg-transparent p-12 rounded-lg">
        <h1 className="text-white text-4xl font-semibold mb-8">Edit Movie</h1>
        <MovieForm
          initialData={initialData}
          onSubmit={handleSubmit}
          showDeleteButton
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default EditMovie;
