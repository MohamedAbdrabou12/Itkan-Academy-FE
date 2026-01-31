import { useGetCalendars } from "@/hooks/attendance/useGetCalendars";
import { useGetHolidays } from "@/hooks/attendance/useGetHolidays";
import { useGetWorkingDays } from "@/hooks/attendance/useGetWorkingDays";
import { useSetWorkingDays } from "@/hooks/attendance/useSetWorkingDays";
import { useCreateHoliday } from "@/hooks/attendance/useCreateHoliday";
import { useUpdateHoliday } from "@/hooks/attendance/useUpdateHoliday";
import { useDeleteHoliday } from "@/hooks/attendance/useDeleteHoliday";
import type {
  CalendarWorkingDayCreate,
  CalendarHoliday,
  CalendarHolidayCreate,
  CalendarHolidayUpdate,
  Weekday,
} from "@/types/attendance";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import HookFormInput from "@/components/forms/HookFormInput";
import PermissionGate from "@/components/auth/PermissionGate";
import { PermissionKeys } from "@/constants/permissions";
import { Edit, Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";

export default function CalendarDetailPage() {
  const { calendarId } = useParams<{ calendarId: string }>();
  const navigate = useNavigate();
  const calendarIdNum = Number(calendarId);

  const { calendars } = useGetCalendars({});
  const calendar = calendars.find((c) => c.id === calendarIdNum);
  const { holidays, refetch: refetchHolidays } = useGetHolidays(calendarIdNum);
  const { workingDays: fetchedWorkingDays } = useGetWorkingDays(calendarIdNum);
  const { mutate: setWorkingDays, isPending: isSettingWorkingDays } =
    useSetWorkingDays();
  const { mutate: createHoliday, isPending: isCreatingHoliday } =
    useCreateHoliday();
  const { mutate: updateHoliday, isPending: isUpdatingHoliday } =
    useUpdateHoliday();
  const { mutate: deleteHoliday, isPending: isDeletingHoliday } =
    useDeleteHoliday();

  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<CalendarHoliday | null>(
    null,
  );
  const [deletingHolidayId, setDeletingHolidayId] = useState<number | null>(
    null,
  );
  const [workingDays, setWorkingDaysState] = useState<Record<Weekday, boolean>>(
    {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
  );

  // Initialize from fetched working days
  useEffect(() => {
    if (fetchedWorkingDays && fetchedWorkingDays.length > 0) {
      const wdMap: Record<Weekday, boolean> = {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
      };
      fetchedWorkingDays.forEach((wd) => {
        wdMap[wd.weekday] = wd.is_working;
      });
      setWorkingDaysState(wdMap);
    }
  }, [fetchedWorkingDays]);

  const weekdayLabels: Record<Weekday, string> = {
    mon: "الإثنين",
    tue: "الثلاثاء",
    wed: "الأربعاء",
    thu: "الخميس",
    fri: "الجمعة",
    sat: "السبت",
    sun: "الأحد",
  };

  const handleSaveWorkingDays = () => {
    const workingDaysList: CalendarWorkingDayCreate[] = Object.entries(
      workingDays,
    ).map(([weekday, is_working]) => ({
      weekday: weekday as Weekday,
      is_working,
    }));

    setWorkingDays({
      calendar_id: calendarIdNum,
      working_days: workingDaysList,
    });
  };

  const handleCreateHoliday = (data: CalendarHolidayCreate) => {
    createHoliday(
      { calendar_id: calendarIdNum, holiday: data },
      {
        onSuccess: () => {
          setIsHolidayModalOpen(false);
          refetchHolidays();
        },
      },
    );
  };

  const handleUpdateHoliday = (data: CalendarHolidayUpdate) => {
    if (!editingHoliday) return;
    updateHoliday(
      {
        calendar_id: calendarIdNum,
        holiday_id: editingHoliday.id,
        holiday: data,
      },
      {
        onSuccess: () => {
          setIsHolidayModalOpen(false);
          setEditingHoliday(null);
          refetchHolidays();
        },
      },
    );
  };

  const handleEditClick = (holiday: CalendarHoliday) => {
    setEditingHoliday(holiday);
    setIsHolidayModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingHolidayId) return;
    deleteHoliday(
      {
        calendar_id: calendarIdNum,
        holiday_id: deletingHolidayId,
      },
      {
        onSuccess: () => {
          setDeletingHolidayId(null);
          refetchHolidays();
        },
      },
    );
  };

  if (!calendar) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">التقويم غير موجود</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/itkan-dashboard/attendance-calendars")}
            className="mb-2 text-sm text-emerald-600 hover:text-emerald-700"
          >
            ← العودة للتقويمات
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{calendar.name}</h1>
          <p className="mt-1 text-sm text-gray-600">إدارة أيام العمل والعطل</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Working Days Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            أيام العمل
          </h2>

          <div className="space-y-3">
            {(Object.keys(weekdayLabels) as Weekday[]).map((weekday) => (
              <div
                key={weekday}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={workingDays[weekday]}
                    onChange={(e) =>
                      setWorkingDaysState({
                        ...workingDays,
                        [weekday]: e.target.checked,
                      })
                    }
                    className="h-5 w-5 rounded border-gray-300 text-emerald-600"
                  />
                  <span className="font-medium text-gray-700">
                    {weekdayLabels[weekday]}
                  </span>
                </label>
              </div>
            ))}
          </div>

          <PermissionGate
            permissions={[PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE]}
          >
            <button
              onClick={handleSaveWorkingDays}
              disabled={isSettingWorkingDays}
              className="btn-primary mt-4 w-full"
            >
              {isSettingWorkingDays ? "جاري الحفظ..." : "حفظ أيام العمل"}
            </button>
          </PermissionGate>
        </div>

        {/* Holidays Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">العطل</h2>
            <PermissionGate
              permissions={[PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE]}
            >
              <button
                onClick={() => setIsHolidayModalOpen(true)}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                إضافة عطلة
              </button>
            </PermissionGate>
          </div>

          {holidays.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              لا توجد عطل مسجلة
            </div>
          ) : (
            <div className="space-y-2">
              {holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {holiday.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {holiday.date}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        holiday.is_paid
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {holiday.is_paid ? "مدفوعة" : "غير مدفوعة"}
                    </span>
                  </div>
                  <PermissionGate
                    permissions={[
                      PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE,
                    ]}
                  >
                    <div className="mr-4 flex items-center gap-2 border-r border-gray-100 pr-4">
                      <button
                        onClick={() => handleEditClick(holiday)}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-emerald-600"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingHolidayId(holiday.id)}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-red-600"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </PermissionGate>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isHolidayModalOpen && (
        <HolidayModal
          isOpen={isHolidayModalOpen}
          onClose={() => {
            setIsHolidayModalOpen(false);
            setEditingHoliday(null);
          }}
          onSubmit={editingHoliday ? handleUpdateHoliday : handleCreateHoliday}
          isSubmitting={isCreatingHoliday || isUpdatingHoliday}
          holiday={editingHoliday}
        />
      )}

      {deletingHolidayId && (
        <DeleteConfirmationModal
          isOpen={!!deletingHolidayId}
          onClose={() => setDeletingHolidayId(null)}
          onConfirm={handleDeleteConfirm}
          title="حذف العطلة"
          description="هل أنت متأكد من حذف هذه العطلة؟ لا يمكن التراجع عن هذا الإجراء."
          isDeleting={isDeletingHoliday}
          itemName={holidays.find((h) => h.id === deletingHolidayId)?.name}
        />
      )}
    </div>
  );
}

interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; name: string; is_paid: boolean }) => void;
  isSubmitting: boolean;
  holiday?: CalendarHoliday | null;
}

function HolidayModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  holiday,
}: HolidayModalProps) {
  const holidaySchema = z.object({
    name: z.string().min(1, "اسم العطلة مطلوب"),
    date: z.string().min(1, "التاريخ مطلوب"),
    is_paid: z.boolean(),
  });

  type HolidayForm = z.infer<typeof holidaySchema>;

  const form = useForm<HolidayForm>({
    resolver: zodResolver(holidaySchema) as unknown as Resolver<HolidayForm>,
    defaultValues: {
      date: holiday?.date || "",
      name: holiday?.name || "",
      is_paid: holiday?.is_paid ?? true,
    },
  });

  const { handleSubmit, register } = form;

  if (!isOpen) return null;

  const internalSubmit = (data: HolidayForm) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          {holiday ? "تعديل عطلة" : "إضافة عطلة جديدة"}
        </h3>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
            <HookFormInput
              label="اسم العطلة"
              name="name"
              placeholder="اسم العطلة"
              type="text"
              required
            />

            <HookFormInput
              label="التاريخ"
              name="date"
              placeholder=""
              type="date"
              required
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_paid"
                {...register("is_paid")}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor="is_paid"
                className="text-sm font-medium text-gray-700"
              >
                عطلة مدفوعة
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? "جاري الحفظ..." : holiday ? "تحديث" : "إضافة"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
