import type { User } from "./auth";

export interface Enrolment {
  id: number;
  pricing_plan_id: number;
  pricing_plan_name: string;
  student_id: number;
  student_full_name: string;
  start_month: number;
  end_month: number;
  months_paid: number;
  [key: string]: unknown; // index signature
}

export interface EnrolmentPricingPlan {
  id: number;
  curriculum_id: number;
  curriculum_name: string;
  branch_id?: number;
  branch_name?: string;
  name: string;
  monthly_price: string;
  start_month: number;
  end_month: number;
  [key: string]: unknown; // index signature
}

export interface EnrolmentPricingPlanWithEnrolments
  extends EnrolmentPricingPlan {
  enrolments: Enrolment[];
}

export interface EnrolmentPricingPlanListParent {
  pricing_plans: EnrolmentPricingPlanWithEnrolments[];
  children: User[];
}
