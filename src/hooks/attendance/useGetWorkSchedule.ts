import apiReq from "@/services/apiReq";
import type { StaffWorkSchedule } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkScheduleParams {
  user_id: number;
  calendar_id?: number;
}

export const useGetWorkSchedule = (params: UseGetWorkScheduleParams) => {
  const { data, isPending, error, refetch } = useQuery<StaffWorkSchedule>({
    queryKey: [
      "attendance",
      "work-schedules",
      params.user_id,
      params.calendar_id,
    ],
    enabled: !!params.user_id,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.calendar_id)
        searchParams.append("calendar_id", params.calendar_id.toString());

      const queryString = searchParams.toString();
      const url = queryString
        ? `/attendance/work-schedules/${params.user_id}?${queryString}`
        : `/attendance/work-schedules/${params.user_id}`;

      return await apiReq("GET", url);
    },
  });

  return {
    schedule: data || null,
    isPending,
    error,
    refetch,
  };
};
