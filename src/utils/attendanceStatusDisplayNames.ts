import { AttendanceStatus } from "@/types/classes";

// Map status to display names
export const attendanceStatusDisplayNames = {
  [AttendanceStatus.PRESENT]: "حاضر",
  [AttendanceStatus.ABSENT]: "غائب",
  [AttendanceStatus.LATE]: "متأخر",
  [AttendanceStatus.EXCUSED]: "معتذر",
};
