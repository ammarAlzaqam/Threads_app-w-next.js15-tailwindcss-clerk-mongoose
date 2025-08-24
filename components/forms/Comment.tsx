"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// import { updateUser } from "@/lib/actions/user.actions";
import { CommentValidationSchema } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { LoaderPinwheel } from "lucide-react";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

export default function Comment({
  threadId,
  currentUserImg,
  currentUserId,
}: Props) {
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      thread: "",
    },
    resolver: zodResolver(CommentValidationSchema),
  });

  const onSubmit = async ({
    thread,
  }: z.infer<typeof CommentValidationSchema>) => {
    try {
      setLoading(true);
      await addCommentToThread({
        commentText: thread,
        userId: currentUserId,
        threadId,
        path: pathname,
      });

      form.reset();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 w-full items-center">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  className="no-focus text-light-1 outline-none"
                  {...field}
                  placeholder="Comment..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={loading}
          type="submit"
          className={`comment-form_btn cursor-pointer ${
            loading && "text-gray-300"
          }`}
        >
          {loading ? <LoaderPinwheel className="animate-spin" /> : "Reply"}
        </Button>
      </form>
    </Form>
  );
}
