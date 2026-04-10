import apiReq from "@/services/apiReq";
import type { StaffDetails } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

const useGetAllEmployees = () => {
  const { data, isPending, error, refetch } = useQuery<StaffDetails[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      return await apiReq(
        "GET",
        "/users/employees",
      );
    },
  });

  return {
    employees: data,
    isPending,
    error,
    refetch,
  };
};

export default useGetAllEmployees;
