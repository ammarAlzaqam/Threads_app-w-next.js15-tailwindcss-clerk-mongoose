import ThreadCard from "@/components/cards/ThreadCard";
import PaginationPage from "@/components/shared/Pagination";
import { fetchPosts } from "@/lib/actions/thread.actions";
import Thread from "@/lib/models/thread.model";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  const { posts, isNext } = await fetchPosts(parseInt(page) || 1, 10);
  const user = await currentUser();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      {posts.length === 0 ? (
        <p className="no-result">Posts not found</p>
      ) : (
        <div className="mt-10 flex flex-col gap-7">
          {posts.map((post) => (
            <ThreadCard
              key={post._id}
              id={post._id}
              currentUserId={user?.id || ""}
              parentId={post.parentId}
              content={post.text}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
            />
          ))}
          <PaginationPage isNext={isNext} />
        </div>
      )}
    </>
  );
}
