import apiReq from "@/services/apiReq";
import type { SchoolCalendar } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";

interface UseGetCalendarsParams {
  branch_id?: number;
  is_active?: boolean;
}

export const useGetCalendars = (params?: UseGetCalendarsParams) => {
  const { data, isPending, error, refetch } = useQuery<SchoolCalendar[]>({
    queryKey: ["attendance", "calendars", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.branch_id)
        searchParams.append("branch_id", params.branch_id.toString());
      if (params?.is_active !== undefined)
        searchParams.append("is_active", params.is_active.toString());

      const queryString = searchParams.toString();
      const url = queryString
        ? `/attendance/calendars?${queryString}`
        : "/attendance/calendars";

      return await apiReq("GET", url);
    },
  });

  return {
    calendars: data || [],
    isPending,
    error,
    refetch,
  };
};
