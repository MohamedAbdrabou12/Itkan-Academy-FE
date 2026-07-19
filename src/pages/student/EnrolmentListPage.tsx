import { useGetParentEnrolmentPricingPlans } from "@/hooks/enrolmentPricingPlans/useGetParentEnrolmentPricingPlans";
import apiReq from "@/services/apiReq";
import type { User } from "@/types/auth";
import type { Enrolment } from "@/types/enrolment";
import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const months = [
  "يناير",
  "فبراير",
  "مارس",
  "ابريل",
  "مايو",
  "يونيو",
  "يوليو",
  "اغسطس",
  "سبتمبر",
  "اكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const EnrolmentForm: React.FC<{ planId: number; parentChildren: User[] }> = (
  props,
) => {
  const [selectedChildId, setSelectedChildId] = useState<number>(
    props.parentChildren[0]?.id,
  );
  const [isLoading, setIsLoading] = useState<boolean>();

  const handleEnrol = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const url = new URL(window.location.href);
      url.search = "";
      const response = await apiReq("POST", "/enrolments/enrol", {
        pricing_plan_id: props.planId,
        student_id: selectedChildId,
        redirection_url: url.toString(),
      });
      window.location.href = response.checkout_url;
    } catch (error) {
      toast.error((error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <select
        value={selectedChildId ?? ""}
        onChange={(e) => setSelectedChildId(Number(e.target.value))}
        className="mb-2.5 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
      >
        {props.parentChildren.map((child) => (
          <option key={child.id} value={child.id}>
            {child.full_name}
          </option>
        ))}
      </select>{" "}
      <button
        onClick={() => handleEnrol()}
        className="rounded-xl bg-emerald-600 px-6 py-2.5 font-medium text-white transition hover:bg-emerald-700 active:scale-95"
      >
        {isLoading ? "جار التواصل مع منصة الدفع..." : "+ تسجيل طالب جديد"}
      </button>
    </>
  );
};

export const EnrolmentListPage: React.FC = () => {
  const { pricingPlans: plans, children: parentChildren } =
    useGetParentEnrolmentPricingPlans();

  const [loadingEnrolmentId, setLoadingEnrolmentId] = useState<number | null>();

  const handlePayMonthlyFee = async (enrolment: Enrolment) => {
    if (loadingEnrolmentId) return;

    setLoadingEnrolmentId(enrolment.id);
    try {
      const response = await apiReq(
        "POST",
        `/enrolments/${enrolment.id}/monthly-fee?redirection_url=${window.location.href}`,
      );
      window.location.href = response.checkout_url;
    } catch (error) {
      toast.error((error as any).message);
    } finally {
      setLoadingEnrolmentId(null);
    }
  };

  return (
    <div className="space-y-8 bg-gray-50 p-6">
      {plans.map((plan) => (
        <section
          key={plan.id}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="bg-linear-to-r flex flex-col gap-4 from-emerald-600 to-emerald-500 p-6 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{plan.name}</h2>

              <p className="mt-1 text-sm text-emerald-100">
                {plan.curriculum_name}
                {plan.branch_name && ` - ${plan.branch_name}`}
              </p>

              <p className="mt-3 text-sm text-emerald-50">
                من {months[plan.start_month - 1]} إلى{" "}
                {months[plan.end_month - 1]}
              </p>
            </div>

            <div className="rounded-xl bg-white/20 px-5 py-3 text-center backdrop-blur">
              <p className="text-3xl font-bold">{plan.monthly_price} ج.م</p>
              <p className="text-xs text-emerald-100">الرسوم الشهرية</p>
            </div>
          </div>

          <div className="p-6">
            {plan.enrolments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-8 text-center">
                <p className="mb-4 text-gray-600">
                  لا يوجد طلاب مسجلون في هذه الخطة.
                </p>

                <EnrolmentForm
                  planId={plan.id}
                  parentChildren={parentChildren}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {plan.enrolments.map((enrolment) => (
                  <div
                    key={enrolment.id}
                    className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {enrolment.student_full_name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                          المدفوع: {enrolment.months_paid} شهر
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePayMonthlyFee(enrolment)}
                      className="rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700 active:scale-95"
                    >
                      {loadingEnrolmentId == enrolment.id
                        ? "جار التواصل مع منصة الدفع..."
                        : "دفع الرسوم الشهرية"}
                    </button>
                  </div>
                ))}
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-400 p-2 text-center">
                  <EnrolmentForm
                    planId={plan.id}
                    parentChildren={parentChildren}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};
