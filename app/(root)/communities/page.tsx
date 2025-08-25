import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import PaginationPage from "@/components/shared/Pagination";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Searchbar from "@/components/shared/Searchbar";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { profileTabs } from "@/constants";
import { fetchCommunities } from "@/lib/actions/community.actions";
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

  // Fetch communities
  const { communities, isNext } = await fetchCommunities({
    searchString: query,
    pageNumber: parseInt(page) || 1,
    pageSize: 1,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar query={query} path="/communities" />

      <div className="my-14 flex flex-col gap-9">
        {communities.length === 0 ? (
          <p className="no-result">No Communities</p>
        ) : (
          <>
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                bio={community.bio}
                members={community.members}
                imgUrl={community.image}
              />
            ))}
          </>
        )}
      </div>

      <PaginationPage isNext={isNext} />
    </section>
  );
}
