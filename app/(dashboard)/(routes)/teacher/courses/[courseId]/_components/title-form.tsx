"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { Course } from "@prisma/client";
import { XSquare, Edit } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
});

interface TitleFormProps {
  course: Course;
  courseId: string;
}

const TitleForm = ({ course, courseId }: TitleFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success("Course title updated.");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
      console.log("something went wrong.");
    }
  };
  return (
    <div className="bg-slate-200 p-4 rounded-md mt-8">
      <div className="flex  justify-between py-2 font-medium">
        <h4 className="font-medium text-lg">Course title</h4>
        <h4
          onClick={toggleEdit}
          className="flex gap-x-1 items-center font-medium text-lg tracking-tight cursor-pointer"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {isEditing ? <XSquare size={20} /> : <Edit size={20} />}
              </TooltipTrigger>
              <TooltipContent>
                {isEditing ? <p>cancel</p> : <p>Edit title</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h4>
      </div>
      {/* <p>{course.title}</p> */}
      {!isEditing ? (
        <p>{course.title}</p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 "
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g: Advanced machine learning"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="py-2 px-4 bg-slate-500 text-white hover:bg-slate-400 rounded-md disabled:bg-slate-300 disabled:cursor-not-allowed"
              disabled={isSubmitting || !isValid}
            >
              save
            </button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default TitleForm;
