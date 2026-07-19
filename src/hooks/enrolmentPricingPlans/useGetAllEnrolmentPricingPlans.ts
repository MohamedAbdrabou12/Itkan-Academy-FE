import apiReq from "@/services/apiReq";
import type { EnrolmentPricingPlan } from "@/types/enrolment";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../useDebounce";

interface UseGetAllEnrolmentPricingPlansParams {
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

interface GetAllEnrolmentsPricingPlansResponse {
  items: EnrolmentPricingPlan[];
  page: number;
  size: number;
  total: number;
  pages: number;
}

export const useGetAllEnrolmentPricingPlans = (
  params?: UseGetAllEnrolmentPricingPlansParams,
) => {
  const debouncedSearch = useDebounce(params?.search, 300);

  const { data, isPending, error, refetch } =
    useQuery<GetAllEnrolmentsPricingPlansResponse>({
      queryKey: [
        "enrolment-pricing-plans",
        { ...params, search: debouncedSearch },
      ],
      queryFn: async () => {
        const searchParams = new URLSearchParams();

        // Add params to URL if they exist
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.size) searchParams.append("size", params.size.toString());
        if (debouncedSearch) searchParams.append("search", debouncedSearch);
        if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
        if (params?.sort_order)
          searchParams.append("sort_order", params.sort_order);

        const queryString = searchParams.toString();
        const url = queryString
          ? `/enrolments/pricing-plans/?${queryString}`
          : "/enrolments/pricing-plans/";

        return await apiReq("GET", url);
      },
    });

  return {
    pricingPlans: (data?.items as EnrolmentPricingPlan[]) || [],
    pagination: {
      page: data?.page || 1,
      pageSize: data?.size || 10,
      total: data?.total || 0,
      totalPages: data?.pages || 0,
    },
    isPending,
    error,
    refetch,
  };
};
