import type { Report, ReportType } from "@/hooks/reports/useGenerateReport";
import type {
  EmployeeReportData,
  TeacherReportData,
  RevenueByBranchReportData,
  OutstandingTuitionReportData,
  TeacherPayrollReportData,
  StudentPaymentReportData,
} from "@/types/reports";
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
                  evaluationNames.map((name) => <th key={name}>تقييم {name}</th>)}
              </>
            )}
            {report.type === "teachers" && (
              <>
                <th>اسم الفرع</th>
                <th>اسم المعلم</th>
                <th>الفصول الدراسية</th>
                <th>اليوم</th>
                <th>حالة الحضور</th>
                <th>وقت الحضور</th>
                <th>وقت الانصراف</th>
                <th>مدة العمل</th>
                <th>التقييم</th>
                <th>المقيّم</th>
              </>
            )}
            {report.type === "staff" && (
              <>
                <th>اسم الفرع</th>
                <th>اسم الموظف</th>
                <th>الوظيفة</th>
                <th>اليوم</th>
                <th>حالة الحضور</th>
                <th>وقت الحضور</th>
                <th>وقت الانصراف</th>
                <th>مدة العمل</th>
                <th>التقييم</th>
                <th>المقيّم</th>
              </>
            )}
            {report.type === "finance/revenue-by-branch" && (
              <>
                <th>رقم الفرع</th>
                <th>اسم الفرع</th>
                <th>إجمالي الإيرادات</th>
                <th>عدد العمليات</th>
              </>
            )}
            {report.type === "finance/outstanding-tuition" && (
              <>
                <th>رقم الفاتورة</th>
                <th>اسم الفرع</th>
                <th>اسم الطالب</th>
                <th>المبلغ</th>
                <th>تاريخ الاستحقاق</th>
                <th>حالة الفاتورة</th>
                <th>الوصف</th>
              </>
            )}
            {report.type === "finance/teacher-payroll" && (
              <>
                <th>دورة الرواتب</th>
                <th>اسم المعلم</th>
                <th>الفروع</th>
                <th>الراتب الأساسي</th>
                <th>البدلات</th>
                <th>المكافآت</th>
                <th>الاستقطاعات</th>
                <th>صافي الراتب</th>
              </>
            )}
            {report.type === "finance/student-payments" && (
              <>
                <th>رقم العملية</th>
                <th>رقم الفاتورة</th>
                <th>اسم الطالب</th>
                <th>الفرع</th>
                <th>المبلغ</th>
                <th>بوابة الدفع</th>
                <th>رقم المعاملة</th>
                <th>تاريخ الدفع</th>
                <th>الحالة</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {report.data.map((reportItem, index) => {
            const teacherItem = reportItem as TeacherReportData;
            const staffItem = reportItem as EmployeeReportData;

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
                          <td key={mappedName}>
                            {reportItem.evaluation_grades?.find(
                              ({ name }) => name == mappedName,
                            )?.grade ?? "-"}
                          </td>
                        );
                      })}
                  </>
                )}
                {report.type === "teachers" && (
                  <>
                    <td>{teacherItem.branch_name}</td>
                    <td>{teacherItem.employee_name}</td>
                    <td>{teacherItem.classes || "-"}</td>
                    <td>{formatArabicDate(new Date(teacherItem.date))}</td>
                    <td>{teacherItem.status}</td>
                    <td>{teacherItem.check_in || "-"}</td>
                    <td>{teacherItem.check_out || "-"}</td>
                    <td>
                      {teacherItem.worked_minutes != null
                        ? `${Math.floor(teacherItem.worked_minutes / 60)} س ${teacherItem.worked_minutes % 60} د`
                        : "-"}
                    </td>
                    <td>
                      {teacherItem.evaluation_score != null
                        ? `${teacherItem.evaluation_score}%`
                        : "-"}
                    </td>
                    <td>{teacherItem.evaluator_name || "-"}</td>
                  </>
                )}
                {report.type === "staff" && (
                  <>
                    <td>{staffItem.branch_name}</td>
                    <td>{staffItem.employee_name}</td>
                    <td>{staffItem.role_name}</td>
                    <td>{formatArabicDate(new Date(staffItem.date))}</td>
                    <td>{staffItem.status}</td>
                    <td>{staffItem.check_in || "-"}</td>
                    <td>{staffItem.check_out || "-"}</td>
                    <td>
                      {staffItem.worked_minutes != null
                        ? `${Math.floor(staffItem.worked_minutes / 60)} س ${staffItem.worked_minutes % 60} د`
                        : "-"}
                    </td>
                    <td>
                      {staffItem.evaluation_score != null
                        ? `${staffItem.evaluation_score}%`
                        : "-"}
                    </td>
                    <td>{staffItem.evaluator_name || "-"}</td>
                  </>
                )}
                {report.type === "finance/revenue-by-branch" && (
                  <>
                    <td>{(reportItem as RevenueByBranchReportData).branch_id}</td>
                    <td>{(reportItem as RevenueByBranchReportData).branch_name}</td>
                    <td className="font-bold text-emerald-600">
                      {(reportItem as RevenueByBranchReportData).total_revenue.toFixed(2)} ج.م
                    </td>
                    <td>{(reportItem as RevenueByBranchReportData).payment_count}</td>
                  </>
                )}
                {report.type === "finance/outstanding-tuition" && (
                  <>
                    <td>{(reportItem as OutstandingTuitionReportData).invoice_id}</td>
                    <td>{(reportItem as OutstandingTuitionReportData).branch_name}</td>
                    <td>{(reportItem as OutstandingTuitionReportData).student_name}</td>
                    <td className="font-bold text-red-600">
                      {(reportItem as OutstandingTuitionReportData).amount.toFixed(2)} ج.م
                    </td>
                    <td>
                      {formatArabicDate(
                        new Date((reportItem as OutstandingTuitionReportData).due_date),
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          (reportItem as OutstandingTuitionReportData).status === "unpaid"
                            ? "badge-error"
                            : "badge-warning"
                        }`}
                      >
                        {(reportItem as OutstandingTuitionReportData).status === "unpaid"
                          ? "غير مدفوعة"
                          : (reportItem as OutstandingTuitionReportData).status}
                      </span>
                    </td>
                    <td>{(reportItem as OutstandingTuitionReportData).description || "-"}</td>
                  </>
                )}
                {report.type === "finance/teacher-payroll" && (
                  <>
                    <td>{(reportItem as TeacherPayrollReportData).cycle_name}</td>
                    <td>{(reportItem as TeacherPayrollReportData).employee_name}</td>
                    <td>{(reportItem as TeacherPayrollReportData).branch_names}</td>
                    <td>{(reportItem as TeacherPayrollReportData).base_salary.toFixed(2)} ج.م</td>
                    <td>{(reportItem as TeacherPayrollReportData).allowance.toFixed(2)} ج.م</td>
                    <td className="text-emerald-600">+{(reportItem as TeacherPayrollReportData).bonuses.toFixed(2)} ج.م</td>
                    <td className="text-red-600">-{(reportItem as TeacherPayrollReportData).deductions.toFixed(2)} ج.م</td>
                    <td className="font-bold text-emerald-700">
                      {(reportItem as TeacherPayrollReportData).net_salary.toFixed(2)} ج.م
                    </td>
                  </>
                )}
                {report.type === "finance/student-payments" && (
                  <>
                    <td>{(reportItem as StudentPaymentReportData).payment_id}</td>
                    <td>{(reportItem as StudentPaymentReportData).invoice_id}</td>
                    <td>{(reportItem as StudentPaymentReportData).student_name}</td>
                    <td>{(reportItem as StudentPaymentReportData).branch_name}</td>
                    <td className="font-bold text-emerald-600">
                      {(reportItem as StudentPaymentReportData).amount.toFixed(2)} ج.م
                    </td>
                    <td>{(reportItem as StudentPaymentReportData).gateway || "-"}</td>
                    <td>{(reportItem as StudentPaymentReportData).external_txn_id || "-"}</td>
                    <td>
                      {(reportItem as StudentPaymentReportData).paid_at
                        ? formatArabicDate(
                            new Date((reportItem as StudentPaymentReportData).paid_at!),
                          )
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          (reportItem as StudentPaymentReportData).status === "paid"
                            ? "badge-success"
                            : "badge-ghost"
                        }`}
                      >
                        {(reportItem as StudentPaymentReportData).status === "paid"
                          ? "مدفوعة"
                          : (reportItem as StudentPaymentReportData).status}
                      </span>
                    </td>
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

