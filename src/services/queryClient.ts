import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Query, QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: "query-cache-available-permissions",
});

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: Query) => {
      const persistableKeys = ["available-permissions"];
      return (
        typeof query.queryKey[0] === "string" &&
        persistableKeys.includes(query.queryKey[0])
      );
    },
  },
});
