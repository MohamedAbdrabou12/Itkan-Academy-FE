import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from "@tanstack/react-query";
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
})

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24,
});
