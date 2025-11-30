import type { Weekday } from "@/types/classes";

export const englishToArabicDayMap: Record<Weekday, string> = {
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
};

export const arabicDaysOptions: { value: string; label: string }[] = [
  {
    label: "السبت",
    value: "saturday",
  },
  {
    label: "الاحد",
    value: "sunday",
  },
  {
    label: "الاثنين",
    value: "monday",
  },
  {
    label: "الثلاثاء",
    value: "tuesday",
  },
  {
    label: "الاربعاء",
    value: "wednesday",
  },
  {
    label: "الخميس",
    value: "thursday",
  },
  {
    label: "الجمعة",
    value: "friday",
  },
];
