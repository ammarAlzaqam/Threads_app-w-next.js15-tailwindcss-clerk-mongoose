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
import { UserValidationSchema } from "@/lib/validations/user";
import Image from "next/image";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

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

export default function AccountProfile({ user, btnTitle }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { startUpload } = useUploadThing("media");

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
    resolver: zodResolver(UserValidationSchema),
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    const allFiles = e.target.files;
    if (!allFiles?.length || !allFiles[0]?.type.includes("image")) return;
    setFiles(Array.from(allFiles));
    const fileReader = new FileReader();

    fileReader.onload = async (event) => {
      const imageDataUrl = event.target?.result?.toString() || "";
      fieldChange(imageDataUrl);
    };
    fileReader.readAsDataURL(allFiles[0]);
  };

  const onSubmit = async ({
    profile_photo,
    name,
    username,
    bio,
  }: z.infer<typeof UserValidationSchema>) => {
    setLoading(true);
    const blob = profile_photo;

    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgQuery = startUpload(files);
      const imgRes = await imgQuery;
      console.log("Upload Result:", imgRes);
      if (imgRes && imgRes[0]) {
        profile_photo = imgRes[0].ufsUrl;
      } else {
        profile_photo = user?.image || "";
      }
    }

    try {
      await updateUser({
        userId: user.id,
        name,
        username,
        image: profile_photo,
        bio,
        path: pathname,
      });

      pathname === "/profile/edit" ? router.back() : router.push("/");
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
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>

              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  className="account-form_input no-focus"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  className="account-form_input no-focus"
                  type="text"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus min-h-48"
                  {...field}
                />
              </FormControl>
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
          {loading ? "Submitting..." : btnTitle}
        </Button>
      </form>
    </Form>
  );
}
