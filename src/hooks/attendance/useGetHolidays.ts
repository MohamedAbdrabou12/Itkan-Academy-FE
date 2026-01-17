import apiReq from "@/services/apiReq";
import type { CalendarHoliday } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";

export const useGetHolidays = (calendar_id: number) => {
  const { data, isPending, error, refetch } = useQuery<CalendarHoliday[]>({
    queryKey: ["attendance", "holidays", calendar_id],
    enabled: !!calendar_id,
    queryFn: async () => {
      return await apiReq("GET", `/attendance/calendars/${calendar_id}/holidays`);
    },
  });

  return {
    holidays: data || [],
    isPending,
    error,
    refetch,
  };
};
