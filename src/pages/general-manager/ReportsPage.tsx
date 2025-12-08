import EmptyState from "@/components/dataGrid/EmptyState";
import type { GenerateReportFormData } from "@/components/modals/GenerateReportFormModal";
import GenerateReportFormModal from "@/components/modals/GenerateReportFormModal";
import Spinner from "@/components/shared/Spinner";
import {
  useGenerateReport,
  type Report,
  type ReportType,
} from "@/hooks/reports/useGenerateAttendanceReport";
import { attendanceStatusDisplayNames } from "@/utils/attendanceStatusDisplayNames";
import { formatArabicDate } from "@/utils/formatDate";
import { useMemo, useState } from "react";

const ReportsPage = () => {
  const { report, generateReport, isPending } = useGenerateReport();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const handleGenerateReportButtonClick = () => setIsFormModalOpen(true);

  const handleGenerateFormSubmit = (formData: GenerateReportFormData) => {
    generateReport({
      type: formData.type,
      filters: {
        from: formData.from,
        to: formData.to,
        branch_ids: formData.branch_ids,
        class_ids: formData.class_ids,
        student_ids: formData.student_ids,
      },
    });
    setIsFormModalOpen(false);
  };

  if (isPending) return <Spinner />;

  return (
    <div className="m-20">
      <div className="mb-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">التقارير</h1>
        {report && report.data.length != 0 && (
          <GenerateReportButton onClick={handleGenerateReportButtonClick} />
        )}
      </div>
      {report && report.data.length != 0 ? (
        <ReportTable report={report} />
      ) : (
        <EmptyState entityName="نتائج" hasFilters={report != undefined}>
          <GenerateReportButton onClick={handleGenerateReportButtonClick} />
        </EmptyState>
      )}
      {isFormModalOpen && (
        <GenerateReportFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleGenerateFormSubmit}
        />
      )}
    </div>
  );
};

const GenerateReportButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
    >
      إنشاء تقرير
    </button>
  );
};

const ReportTable = ({ report }: { report: Report<ReportType> }) => {
  const evaluationNames = useMemo(() => {
    if (report?.type == "students/evaluations") {
      const names = new Set<string>();
      for (const item of report.data) {
        if (item.type == "evaluation") {
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
    <div className="overflow-x-auto">
      <table className="table-zebra table">
        <thead>
          <tr>
            <th>اسم الفرع</th>
            <th>اسم الفصل</th>
            <th>اسم الطالب</th>
            <th>اليوم</th>
            {report.type == "students/attendance" ? (
              <th>الحضور</th>
            ) : (
              evaluationNames.map((name) => <th>تقييم {name}</th>)
            )}
          </tr>
        </thead>
        <tbody>
          {report.data.map((reportItem, index) => {
            return (
              <tr key={index}>
                <td>{reportItem.branch_name}</td>
                <td>{reportItem.class_name}</td>
                <td>{reportItem.student_name}</td>
                <td>{formatArabicDate(new Date(reportItem.date))}</td>
                {reportItem.type == "attendance" ? (
                  <td>{attendanceStatusDisplayNames[reportItem.status]}</td>
                ) : (
                  evaluationNames.map((mappedName) => {
                    return (
                      <td>
                        {reportItem.evaluation_grades?.find(
                          ({ name }) => name == mappedName,
                        )?.grade ?? "-"}
                      </td>
                    );
                  })
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;
