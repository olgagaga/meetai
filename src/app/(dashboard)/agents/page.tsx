import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";
import { AgentsListHeader } from "@/modules/agents/ui/components/list-header";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const queryClinet = getQueryClient();
  await queryClinet.prefetchQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClinet)}>
        <Suspense
          fallback={
            <LoadingState
              title="Loading Agents"
              description="This may take a few seconds"
            />
          }
        >
          <AgentsView />
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
