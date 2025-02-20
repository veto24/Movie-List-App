import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Extract 'page' and 'limit' query parameters from the URL
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not provided
    const limit = parseInt(searchParams.get("limit") || "8", 10); // Default to 8 items per page if not provided

    // Calculate the 'skip' and 'take' values
    const skip = (page - 1) * limit;
    const take = limit;

    // Fetch paginated data from the database
    const data = await prisma.movie.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get the total count of records to include in the response for pagination metadata
    const totalRecords = await prisma.movie.count();
    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json(
      {
        movies: data,
        totalRecords,
        totalPages,
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Close the Prisma client connection
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, year, fileUrl } = body;

    const newMovie = await prisma.movie.create({
      data: { title, year, poster: fileUrl },
    });

    return NextResponse.json(
      {
        movie: newMovie,
        message: "Movie created successfully",
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
