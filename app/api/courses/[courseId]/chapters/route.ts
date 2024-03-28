import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner)
      return new NextResponse("Unauthenticated", { status: 403 });

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });
    
    const nextPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        courseId: params.courseId,
        title,
        position: nextPosition,
      },
    });
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[API/COURSES/[COURSEID]/CHAPTERS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

