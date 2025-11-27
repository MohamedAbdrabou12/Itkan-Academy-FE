import apiReq from "@/services/apiReq";
import type { AttendanceStatusMap } from "@/types/classes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface EditBulkEvaluationData {
  class_id: number;
  // YYYY-MM-DD
  date: string;
  records: AttendanceStatusMap;
}

export const useEditBulkEvaluation = (
  setSelectedClassId: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  const {
    mutate: editBulkEvaluation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: EditBulkEvaluationData) => {
      return await apiReq("PUT", "/evaluations", data);
    },
    onSuccess: (res) => {
      toast(res.message, { type: "success" });
      setSelectedClassId(null);
    },
    onError: (error) => {
      toast(error.message, { type: "error" });
    },
  });

  return { editBulkEvaluation, isPending, error };
};
