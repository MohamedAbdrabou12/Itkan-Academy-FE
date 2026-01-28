import apiReq from "@/services/apiReq";
import { type Unit } from "@/types/units";
import { useQuery } from "@tanstack/react-query";

export const useGetClassUnits = (class_id: number) => {
  const {
    data: units,
    isPending,
    error,
  } = useQuery<Unit[]>({
    queryKey: ["units", class_id],
    queryFn: async () => {
      return await apiReq("GET", `/units/class/${class_id}`);
    },
  });

  return { units, isPending, error };
};
