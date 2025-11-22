import apiReq from "./apiReq";
import type { StudentFormData } from "@/validation/studentSchema";
import type { StudentsResponse, StudentDetails } from "@/types/Students";


export const listStudents = async (
  params?: Record<string, string | number | boolean>
): Promise<StudentsResponse> => {
  const query = params
    ? new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
    : "";

  const url = query ? `/students/?${query}` : "/students/";
  return await apiReq("GET", url);
};

export const getStudent = async (id: number): Promise<StudentDetails> => {
  return await apiReq("GET", `/students/${id}/`);
};

export const createStudent = async (data: StudentFormData) => {
  return await apiReq("POST", "/students/", data);
};

export const updateStudent = async (id: number, data: StudentFormData) => {
  return await apiReq("PUT", `/students/${id}/`, data);
};

export const deleteStudent = async (id: number) => {
  return await apiReq("DELETE", `/students/${id}/`);
};

export const approveStudent = async (id: number) => {
  return await apiReq("POST", `/students/${id}/approve/`);
};

export const rejectStudent = async (id: number) => {
  return await apiReq("POST", `/students/${id}/reject/`);
};
