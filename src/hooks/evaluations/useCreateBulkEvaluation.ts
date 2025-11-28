import apiReq from "@/services/apiReq";
import type { AttendanceStatusMap } from "@/types/classes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CreateBulkEvaluationData {
  class_id: number;
  // YYYY-MM-DD
  date: string;
  records: AttendanceStatusMap;
}

export const useCreateBulkEvaluation = (
  setSelectedClassId: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  const queryClient = useQueryClient();

  const {
    mutate: createBulkEvaluation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: CreateBulkEvaluationData) => {
      const response = await apiReq("POST", "/evaluations", data);
      return response;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast(res.message, { type: "success" });
      setSelectedClassId(null);
    },
    onError: (error) => {
      toast(error.message, { type: "error" });
    },
  });

  return { createBulkEvaluation, isPending, error };
};
