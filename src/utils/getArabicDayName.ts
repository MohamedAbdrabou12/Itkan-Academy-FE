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
    value: "السبت",
  },
  {
    label: "الاحد",
    value: "الاحد",
  },
  {
    label: "الاثنين",
    value: "الاثنين",
  },
  {
    label: "الثلاثاء",
    value: "الثلاثاء",
  },
  {
    label: "الاربعاء",
    value: "الاربعاء",
  },
  {
    label: "الخميس",
    value: "الخميس",
  },
  {
    label: "الجمعة",
    value: "الجمعة",
  },
];
