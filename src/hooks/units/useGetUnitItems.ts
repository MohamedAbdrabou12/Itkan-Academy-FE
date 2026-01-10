import apiReq from "@/services/apiReq";
import { type UnitItems } from "@/types/unitItems";
import { useQuery } from "@tanstack/react-query";

export const useGetUnitItems = (
  unitId: number | null,
  type: string = "lessons",
) => {
  const {
    data: unitItems,
    isPending,
    error,
  } = useQuery<UnitItems[]>({
    queryKey: ["unitItems", unitId],
    queryFn: async () => {
      return await apiReq("GET", `/unit-items/${unitId}/${type}`);
    },
    enabled: !!unitId,
  });

  return { unitItems, isPending, error };
};
