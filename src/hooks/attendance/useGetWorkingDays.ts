import apiReq from "@/services/apiReq";
import type { CalendarWorkingDay } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkingDays = (calendar_id: number) => {
  const { data, isPending, error, refetch } = useQuery<CalendarWorkingDay[]>({
    queryKey: ["attendance", "working-days", calendar_id],
    enabled: !!calendar_id,
    queryFn: async () => {
      return await apiReq(
        "GET",
        `/attendance/calendars/${calendar_id}/working-days`,
      );
    },
  });

  return {
    workingDays: data || [],
    isPending,
    error,
    refetch,
  };
};
