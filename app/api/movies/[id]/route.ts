import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// GET method to fetch a specific movie by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const body = await req.json();

  const { title, year, fileUrl } = body;

  try {
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: { title, year, poster: fileUrl },
    });

    return NextResponse.json(
      {
        movie: updatedMovie,
        message: "Movie updated successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE method to delete a specific movie by ID
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    await prisma.movie.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Movie deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
