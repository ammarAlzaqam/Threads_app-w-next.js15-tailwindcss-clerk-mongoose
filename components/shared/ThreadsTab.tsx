import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export default async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  let { threads, name, image, id } = await fetchUserPosts(accountId);

  if (!threads) redirect("/");

  const getAuthor = (thread: any) =>
    accountType === "User"
      ? { name, image, id }
      : {
          name: thread.author.name,
          image: thread.author.image,
          id: thread.author.id,
        };

  return (
    <section className="mt-9 flex flex-col gap-10">
      {threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={getAuthor(thread)}
          community={thread.community} // todo
          createAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
}
