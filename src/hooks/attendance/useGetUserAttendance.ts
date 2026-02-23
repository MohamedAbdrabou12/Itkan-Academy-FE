import apiReq from "@/services/apiReq";
import type { AttendanceDaily } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";

interface UseGetUserAttendanceParams {
  user_id: number;
  from_date: string;
  to_date: string;
  branch_id?: number;
}

export const useGetUserAttendance = (params: UseGetUserAttendanceParams) => {
  const { data, isPending, error, refetch } = useQuery<AttendanceDaily[]>({
    queryKey: [
      "attendance",
      "user",
      params.user_id,
      params.from_date,
      params.to_date,
    ],
    enabled: !!params.user_id && !!params.from_date && !!params.to_date,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("from_date", params.from_date);
      searchParams.append("to_date", params.to_date);
      if (params.branch_id)
        searchParams.append("branch_id", params.branch_id.toString());

      return await apiReq(
        "GET",
        `/attendance/user/${params.user_id}?${searchParams}`,
      );
    },
  });

  return {
    attendance: data || [],
    isPending,
    error,
    refetch,
  };
};
