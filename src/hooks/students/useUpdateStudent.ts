import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { StudentFormData } from "@/validation/studentSchema";
import type { StudentsResponse, StudentDetails } from "@/types/Students";

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ student_id, ...data }: StudentFormData & { student_id: number }) => {
      const payload = {
        ...data,
        phone: data.phone?.trim() === "" ? null : data.phone,
        admission_date: data.admission_date || null,
        branch_ids: data.branch_ids?.map(Number) || [],
        class_ids: data.class_ids?.map(Number) || [],
        status: data.status,
      };

      const res = await apiReq("PUT", `/students/${student_id}`, payload);
      return res;
    },
    onSuccess: (updatedStudent: StudentDetails) => {
      const studentWithStatus: StudentDetails = {
        ...updatedStudent,
        status: updatedStudent.status,
      };

      queryClient.setQueriesData<StudentsResponse>(
        { queryKey: ["students"] },
        (oldData) => {
          if (!oldData) return oldData;

          const newItems: StudentDetails[] = oldData.items.map((s) =>
            s.student_id === studentWithStatus.student_id ? studentWithStatus : s
          );

          return {
            ...oldData,
            items: newItems,
          };
        }
      );
    },
  });
};