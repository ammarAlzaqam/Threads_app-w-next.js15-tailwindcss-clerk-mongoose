"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export default function Clear({query, path}: {query: string, path: string}) {
  const router = useRouter();

  const reset = (e: MouseEvent<HTMLButtonElement>) => {
    const form = document.querySelector(".searchbar") as HTMLFormElement;
    if (form) form.reset();

    const btn = e.currentTarget;
    btn?.setAttribute("data-state", "closed");
  };

  return (
    <button
      type="reset"
      id="reset_btn"
      data-state={query ? "open" : "closed"}
      className="text-base-regular p-1 cursor-pointer bg-light-4 hover:bg-light-3 rounded-full animate-zoom"
      onClick={reset}
    >
      <Link href={path}>
        <X className="size-5" />
      </Link>
    </button>
  );
}
