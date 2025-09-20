import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";

const Page = async () => {
  const queryClinet = getQueryClient();
  await queryClinet.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
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
  );
};

export default Page;
