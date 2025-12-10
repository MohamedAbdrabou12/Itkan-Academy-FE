import apiReq from "@/services/apiReq";
import type { AttendanceStatus } from "@/types/classes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export type ReportType = "students/attendance" | "students/evaluations";

export interface ReportExportRequest {
  type: ReportType;
  filters: {
    from: string;
    to: string;
    branch_ids?: string[];
    class_ids?: string[];
    student_ids?: string[];
    attendance_status?: AttendanceStatus[];
  };
  export_type: "csv" | "excel" | "pdf";
}

export const useExportReport = () => {
  const { mutate: exportReport, isPending } = useMutation({
    mutationFn: async (params: ReportExportRequest) => {
      const filterQuery = new URLSearchParams();
      filterQuery.append("from", params.filters.from);
      filterQuery.append("to", params.filters.to);

      for (const branch_id of params.filters.branch_ids ?? [])
        filterQuery.append("branch_ids", branch_id);

      for (const class_id of params.filters.class_ids ?? [])
        filterQuery.append("class_ids", class_id);

      for (const student_id of params.filters.student_ids ?? [])
        filterQuery.append("student_ids", student_id);

      for (const status of params.filters.attendance_status ?? [])
        filterQuery.append("attendance_status", status);

      if (params.export_type)
        filterQuery.append("export_type", params.export_type);

      return {
        type: params.type,
        data: await apiReq("GET", `/reports/${params.type}?${filterQuery}`),
      };
    },
    onSuccess: (res) => {
      console.log({ res });
      return res;
    },
    onError: (err) => {
      toast(err.message, { type: "error" });
    },
  });

  return { exportReport, isPending };
};
