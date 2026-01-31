import apiReq from "@/services/apiReq";
import type { AttendanceDaily } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";

interface UseGetDailyAttendanceParams {
  date?: string;
  user_id?: number;
  branch_id?: number;
}

export const useGetDailyAttendance = (params?: UseGetDailyAttendanceParams) => {
  const { data, isPending, error, refetch } = useQuery<AttendanceDaily[]>({
    queryKey: ["attendance", "daily", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.date) searchParams.append("date", params.date);
      if (params?.user_id)
        searchParams.append("user_id", params.user_id.toString());
      if (params?.branch_id)
        searchParams.append("branch_id", params.branch_id.toString());

      const queryString = searchParams.toString();
      const url = queryString
        ? `/attendance/daily?${queryString}`
        : "/attendance/daily";

      return await apiReq("GET", url);
    },
  });

  return {
    attendance: data || [],
    isPending,
    error,
    refetch,
  };
};
