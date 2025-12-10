import EmptyState from "@/components/dataGrid/EmptyState";
import { ReportTable } from "@/components/dataGrid/ReportTable";
import type { GenerateReportFormData } from "@/components/modals/GenerateReportFormModal";
import GenerateReportFormModal from "@/components/modals/GenerateReportFormModal";
import Spinner from "@/components/shared/Spinner";
import { useExportReport } from "@/hooks/reports/useExportReport";
import {
  useGenerateReport,
  type ReportGenerateRequest,
} from "@/hooks/reports/useGenerateReport";
import { useState } from "react";

const ReportsPage = () => {
  const { report, generateReport, isPending } = useGenerateReport();
  const { exportReport } = useExportReport();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] =
    useState<ReportGenerateRequest | null>(null);

  const handleGenerateReportButtonClick = () => setIsFormModalOpen(true);

  const handleGenerateFormSubmit = (formData: GenerateReportFormData) => {
    const filters: ReportGenerateRequest = {
      type: formData.type,
      filters: {
        from: formData.from,
        to: formData.to,
        branch_ids: formData.branch_ids,
        class_ids: formData.class_ids,
        student_ids: formData.student_ids,
        attendance_status: formData.attendance_status,
      },
    };

    setCurrentFilters(filters);
    generateReport(filters);
    setIsFormModalOpen(false);
  };

  const handleExportCSV = () => {
    if (currentFilters) exportReport({ ...currentFilters, export_type: "csv" });
  };
  const handleExportExcel = () => {
    if (currentFilters)
      exportReport({ ...currentFilters, export_type: "excel" });
  };
  const handleExportPDF = () => {
    if (currentFilters) exportReport({ ...currentFilters, export_type: "pdf" });
  };

  if (isPending) return <Spinner />;

  return (
    <div className="m-20">
      <div className="mb-8 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">التقارير</h1>
        {report && report.data.length != 0 && (
          <button
            onClick={handleGenerateReportButtonClick}
            className="btn-primary"
          >
            إنشاء تقرير
          </button>
        )}
      </div>
      {report && report.data.length != 0 ? (
        <div className="flex flex-col gap-4">
          <ReportTable report={report} />
          <div className="flex justify-end gap-4">
            <button onClick={handleExportCSV} className="btn-primary">
              تحميل CSV
            </button>
            <button onClick={handleExportExcel} className="btn-primary">
              تحميل Excel
              {/* Add PDF icon here */}
            </button>
            <button onClick={handleExportPDF} className="btn-primary">
              تحميل PDF
            </button>
          </div>
        </div>
      ) : (
        <EmptyState entityName="نتائج" hasFilters={report != undefined}>
          <button
            onClick={handleGenerateReportButtonClick}
            className="btn-primary"
          >
            إنشاء تقرير
          </button>
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

export default ReportsPage;
