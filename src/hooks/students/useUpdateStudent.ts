import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { StudentUpdateFormData } from "@/validation/studentSchema";
import type { StudentsResponse, StudentDetails } from "@/types/Students";

type UpdateStudentPayload = {
  full_name?: string;
  national_id?: string;
  email?: string | null;
  phone?: string | null;
  branch_ids?: number[];
  class_ids?: number[];
  status?: "pending" | "active" | "rejected" | "deactive";
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      student_id,
      ...data
    }: StudentUpdateFormData & { student_id: number }) => {
      const payload: UpdateStudentPayload = {};

      if (data.full_name !== undefined) {
        payload.full_name = data.full_name;
      }

      if (data.national_id !== undefined) {
        payload.national_id = data.national_id;
      }

      if ("email" in data) {
        payload.email = data.email?.trim() || null;
      }

      if ("phone" in data) {
        payload.phone = data.phone?.trim() || null;
      }

      if (data.branch_ids && data.branch_ids.length > 0) {
        payload.branch_ids = data.branch_ids.map(Number);
      }

      if (data.class_ids && data.class_ids.length > 0) {
        payload.class_ids = data.class_ids.map(Number);
      }

      if (data.status !== undefined) {
        payload.status = data.status;
      }

      const res = await apiReq("PUT", `/students/${student_id}`, payload);
      return res as StudentDetails;
    },

    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });

      queryClient.setQueriesData<StudentsResponse>(
        { queryKey: ["students"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((s) =>
              s.student_id === updatedStudent.student_id
                ? updatedStudent
                : s
            ),
          };
        }
      );
    },
  });
};