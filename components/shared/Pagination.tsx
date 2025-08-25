"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationPage({ isNext }: { isNext: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // لو فيه page في ال URL خدها، لو مش موجودة خلّيها 1
  const currentPage = Number(searchParams.get("page")) || 1;

  // 🔹 function تغير ال URL بالصفحة الجديدة
  const goToPage = (page: number) => {
    router.push(`?page=${page}`);
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          {currentPage > 1 && (
            <PaginationItem className="bg-dark-2 text-primary-500">
              <PaginationPrevious
                className="bg-dark-2 text-primary-500 hover:bg-dark-1 hover:text-light-2 cursor-pointer"
                onClick={() => goToPage(currentPage - 1)}
              />
            </PaginationItem>
          )}

          {/* Current Page */}
          <PaginationItem className="bg-dark-2 text-primary-500">
            <PaginationLink
              className="bg-dark-2 text-primary-500 hover:bg-dark-3 hover:text-light-2 cursor-pointer border-none"
              isActive
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {/* Next */}
          {isNext && (
            <>
              <PaginationItem>
                <PaginationEllipsis className="bg-dark-2 text-primary-500" />
              </PaginationItem>

              <PaginationItem className="bg-dark-2 text-primary-500">
                <PaginationNext
                  className="bg-dark-2 text-primary-500 hover:bg-dark-3 hover:text-light-2 cursor-pointer"
                  onClick={() => goToPage(currentPage + 1)}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
