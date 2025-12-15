import type { Exam, ExamCreate, ExamUpdate } from "@/types/exams";
import apiReq from "./apiReq";

export const getExams = async (): Promise<Exam[]> => {
  const { data } = await apiReq("get", "/exams");
  return data;
};

export const getExam = async (id: number): Promise<Exam> => {
  const { data } = await apiReq("get", `/exams/${id}`);
  return data;
};

export const createExam = async (exam: ExamCreate): Promise<Exam> => {
  const { data } = await apiReq("post", "/exams", exam);
  return data;
};

export const updateExam = async (
  id: number,
  exam: ExamUpdate,
): Promise<Exam> => {
  const { data } = await apiReq("put", `/exams/${id}`, exam);
  return data;
};

export const deleteExam = async (id: number): Promise<void> => {
  await apiReq("delete", `/exams/${id}`);
};

export const publishExam = async (id: number): Promise<Exam> => {
  const { data } = await apiReq("post", `/exams/${id}/publish`);
  return data;
};

export const closeExam = async (id: number): Promise<Exam> => {
  const { data } = await apiReq("post", `/exams/${id}/close`);
  return data;
};
