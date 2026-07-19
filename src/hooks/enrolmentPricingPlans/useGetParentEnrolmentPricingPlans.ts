import apiReq from "@/services/apiReq";
import type { EnrolmentPricingPlanListParent } from "@/types/enrolment";
import { useQuery } from "@tanstack/react-query";

interface UseGetParentEnrolmentPricingPlansParams {
  owned_only: boolean;
}

export const useGetParentEnrolmentPricingPlans = (
  params?: UseGetParentEnrolmentPricingPlansParams,
) => {
  const { data, isPending, error, refetch } =
    useQuery<EnrolmentPricingPlanListParent>({
      queryKey: ["enrolment-pricing-plans-parent", params],
      queryFn: async () => {
        const searchParams = new URLSearchParams();

        // Add params to URL if they exist
        if (params?.owned_only) searchParams.append("owned_only", "true");

        const queryString = searchParams.toString();
        const url = queryString
          ? `/enrolments/pricing-plans/parent/?${queryString}`
          : "/enrolments/pricing-plans/parent/";

        return await apiReq("GET", url);
      },
    });

  return {
    pricingPlans: data?.pricing_plans || [],
    children: data?.children || [],
    isPending,
    error,
    refetch,
  };
};
