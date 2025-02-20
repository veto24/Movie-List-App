"use client";

import MovieForm from "@/app/components/MovieForm";
import Unauthenticated from "@/app/components/Unauthenticated";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateMoviePage = () => {
  const router = useRouter();

  const session = useSession();

  if (!session?.data?.user) return <Unauthenticated />;

  const handleSubmit = async (formData: {
    title: string;
    year: number;
    fileUrl: string;
  }) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/movies",
        {
          method: "POST",
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

  return (
    <div className="min-h-screen flex items-center justify-center p-16">
      <div className="max-w-4xl w-full bg-transparent p-12 rounded-lg">
        <h1 className="text-white text-4xl font-semibold mb-8">
          Create a new movie
        </h1>
        <MovieForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateMoviePage;
