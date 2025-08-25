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
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";

// import { updateUser } from "@/lib/actions/user.actions";
import { ThreadValidationSchema } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export default function PostThread({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { organization } = useOrganization();

  const form = useForm({
    defaultValues: {
      thread: "",
      accountId: userId,
    },
    resolver: zodResolver(ThreadValidationSchema),
  });

  const onSubmit = async ({
    thread,
  }: z.infer<typeof ThreadValidationSchema>) => {
    console.log("ORG ID: ", organization)
    try {
      setLoading(true);
      await createThread({
        text: thread,
        author: userId,
        communityId: organization?.id || null,
        path: pathname,
      });

      router.push("/");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dar-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={15}
                  className="account-form_input no-focus !min-h-72"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={loading}
          type="submit"
          className={`cursor-pointer ${
            loading ? "text-gray-300" : "bg-primary-500"
          }`}
        >
          {loading ? "Submitting..." : "Post Thread"}
        </Button>
      </form>
    </Form>
  );
}
