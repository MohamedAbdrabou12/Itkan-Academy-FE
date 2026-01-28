import apiReq from "@/services/apiReq";
import type { AttendanceStatusMap } from "@/types/classes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface EditBulkEvaluationData {
  class_id: number;
  // YYYY-MM-DD
  date: string;
  records: AttendanceStatusMap;
  unit_item_id: number;
}

export const useEditBulkEvaluation = (resetData: () => unknown) => {
  const queryClient = useQueryClient();

  const {
    mutate: editBulkEvaluation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: EditBulkEvaluationData) => {
      return await apiReq("PUT", "/evaluations", data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast(res.message, { type: "success" });
      resetData();
    },
    onError: (error) => {
      toast(error.message, { type: "error" });
    },
  });

  return { editBulkEvaluation, isPending, error };
};
