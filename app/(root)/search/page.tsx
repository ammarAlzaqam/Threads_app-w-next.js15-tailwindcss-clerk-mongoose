import UserCard from "@/components/cards/UserCard";
import PaginatedPage from "@/components/shared/Pagination";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Searchbar from "@/components/shared/Searchbar";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { query, page } = await searchParams;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { users, isNext } = await fetchUsers({
    userId: user.id,
    searchString: query,
    pageNumber: parseInt(page) || 1,
    pageSize: 7,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar query={query} path="/search" />

      <div className="my-14 flex flex-col gap-9">
        {users.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>

      <PaginatedPage isNext={isNext} />
    </section>
  );
}
