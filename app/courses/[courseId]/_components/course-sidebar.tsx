import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Course, Chapter, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./course-sidebar-item";
import CourseProgress from "@/components/course-progress";

interface CouseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CouseSidebarProps) => {
  const { userId } = auth();
  if (!userId) redirect("/");
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });
  return (
    <div className="h-full border-r flex flex-col  overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col  border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-5">
            <CourseProgress variant={"success"} value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            courseId={course.id}
            isComplete={!!chapter.userProgress?.[0]?.isComplete}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
