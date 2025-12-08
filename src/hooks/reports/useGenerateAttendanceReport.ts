import apiReq from "@/services/apiReq";
import type {
  StudentAttendanceReport,
  StudentEvaluationReport,
} from "@/types/reports";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export type ReportType = "students/attendance" | "students/evaluations";

export type Report<T extends ReportType> = {
  type: T;
  data: (T extends "students/attendance"
    ? StudentAttendanceReport
    : T extends "students/evaluations"
      ? StudentEvaluationReport
      : unknown)[];
};

export interface ReportGenerateForm {
  type: ReportType;
  filters: {
    from: string;
    to: string;
    branch_ids?: string[];
    class_ids?: string[];
    student_ids?: string[];
  };
}

export const useGenerateReport = () => {
  const {
    data: report,
    mutate: generateReport,
    isPending,
  } = useMutation({
    mutationFn: async (
      params: ReportGenerateForm,
    ): Promise<Report<ReportType>> => {
      const filterQuery = new URLSearchParams();
      filterQuery.append("from", params.filters.from);
      filterQuery.append("to", params.filters.to);

      for (const branch_id of params.filters.branch_ids ?? [])
        filterQuery.append("branch_ids", branch_id);

      for (const class_id of params.filters.class_ids ?? [])
        filterQuery.append("class_ids", class_id);

      for (const student_id of params.filters.student_ids ?? [])
        filterQuery.append("student_ids", student_id);

      return {
        type: params.type,
        data: await apiReq("GET", `/reports/${params.type}?${filterQuery}`),
      };
    },
    onSuccess: (res) => {
      return res;
    },
    onError: (err) => {
      toast(err.message, { type: "error" });
    },
  });

  return { report, generateReport, isPending };
};
