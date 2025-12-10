import type { Report, ReportType } from "@/hooks/reports/useGenerateReport";
import { formatArabicDate } from "@/utils/formatDate";
import { useMemo } from "react";

export const ReportTable = ({ report }: { report: Report<ReportType> }) => {
  const evaluationNames = useMemo(() => {
    if (report?.type === "students/evaluations") {
      const names = new Set<string>();
      for (const item of report.data) {
        if (item.type === "evaluation") {
          for (const evaluation of item.evaluation_grades ?? []) {
            names.add(evaluation.name);
          }
        }
      }
      return Array.from(names);
    }

    return [];
  }, [report]);

  return (
    <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border">
      <table className="table">
        <thead>
          <tr className="bg-emerald-100/50">
            {/* Attendance and Evaluations Headers */}
            {report.type.startsWith("students") && (
              <>
                <th>اسم الفرع</th>
                <th>اسم الفصل</th>
                <th>اسم الطالب</th>
                <th>اليوم</th>
                {report.type == "students/attendance" && <th>الحضور</th>}
                {report.type == "students/evaluations" &&
                  evaluationNames.map((name) => <th>تقييم {name}</th>)}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {report.data.map((reportItem, index) => {
            return (
              <tr key={index} className="text-center">
                {/* Attendance and Evaluations Rows */}
                {report.type.startsWith("students") && (
                  <>
                    <td>{reportItem.branch_name}</td>
                    <td>{reportItem.class_name}</td>
                    <td>{reportItem.student_name}</td>
                    <td>{formatArabicDate(new Date(reportItem.date))}</td>
                    {reportItem.type === "attendance" && (
                      <td>{reportItem.status}</td>
                    )}
                    {reportItem.type === "evaluation" &&
                      evaluationNames.map((mappedName) => {
                        return (
                          <td>
                            {reportItem.evaluation_grades?.find(
                              ({ name }) => name == mappedName,
                            )?.grade ?? "-"}
                          </td>
                        );
                      })}
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
