import apiReq from "@/services/apiReq";
import type { StaffWorkSchedule } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkSchedulesParams {
  user_id?: number;
  calendar_id?: number;
}

export const useGetWorkSchedules = (params: UseGetWorkSchedulesParams = {}) => {
  const { data, isPending, error, refetch } = useQuery<StaffWorkSchedule[]>({
    queryKey: [
      "attendance",
      "work-schedules-list",
      params.user_id,
      params.calendar_id,
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.user_id)
        searchParams.append("user_id", params.user_id.toString());
      if (params.calendar_id)
        searchParams.append("calendar_id", params.calendar_id.toString());

      const queryString = searchParams.toString();
      const url = queryString
        ? `/attendance/work-schedules?${queryString}`
        : `/attendance/work-schedules`;

      return await apiReq("GET", url);
    },
  });

  return {
    schedules: data || [],
    isPending,
    error,
    refetch,
  };
};
