import { useState } from "react";
import ExamsGridPage from "../general-manager/ExamsGridPage";
import CreateExam from "@/components/Exams/CreateExam";
import UpdateExam from "@/components/Exams/UpdateExam";
import type { Exam } from "@/types/exams";

export default function ExamPage() {
  const [activeMood, setActiveMood] = useState<"view" | "edit" | "add">("view");
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  return (
    <div className="h-full w-full overflow-hidden">
      {activeMood == "view" && (
        <ExamsGridPage
          setActiveMood={setActiveMood}
          setExamToEdit={setExamToEdit}
        />
      )}
      {activeMood == "add" && <CreateExam setActiveMood={setActiveMood} />}
      {activeMood == "edit" && (
        <UpdateExam setActiveMood={setActiveMood} examToEdit={examToEdit} />
      )}
    </div>
  );
}
