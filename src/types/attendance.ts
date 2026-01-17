export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type AttendanceSourceType = "manual" | "biometric" | "rfid" | "mobile" | "api";

export type AttendanceLogType = "check_in" | "check_out";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half_day"
  | "on_leave";

export interface CalendarWorkingDay {
  id: number;
  calendar_id: number;
  weekday: Weekday;
  is_working: boolean;
  created_at: string;
}

export interface CalendarHoliday {
  id: number;
  calendar_id: number;
  date: string;
  name: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolCalendar {
  id: number;
  branch_id: number;
  name: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  working_days?: CalendarWorkingDay[];
  holidays?: CalendarHoliday[];
}

export interface AttendanceSource {
  id: number;
  name: string;
  type: AttendanceSourceType;
  created_at: string;
}

export interface StaffWorkSchedule {
  id: number;
  user_id: number;
  calendar_id: number;
  start_time: string;
  end_time: string;
  grace_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface AttendanceLog {
  id: number;
  user_id: number;
  branch_id: number;
  timestamp: string;
  type: AttendanceLogType;
  source_id?: number;
  device_id?: string;
  created_at: string;
}

export interface AttendanceDaily {
  id: number;
  user_id: number;
  branch_id: number;
  date: string;
  status: AttendanceStatus;
  check_in_time?: string;
  check_out_time?: string;
  worked_minutes?: number;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface CheckInRequest {
  user_id?: number;
  branch_id?: number;
  timestamp?: string;
  source: AttendanceSourceType;
  device_id?: string;
}

export interface CheckOutRequest {
  user_id?: number;
  branch_id?: number;
  timestamp?: string;
  source: AttendanceSourceType;
  device_id?: string;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  attendance_log?: AttendanceLog;
  is_late?: boolean;
}

export interface CheckOutResponse {
  success: boolean;
  message: string;
  attendance_log?: AttendanceLog;
  daily_summary?: AttendanceDaily;
}

export interface CalendarWorkingDayCreate {
  weekday: Weekday;
  is_working: boolean;
}

export interface CalendarHolidayCreate {
  date: string;
  name: string;
  is_paid: boolean;
}

export interface SchoolCalendarCreate {
  branch_id: number;
  name: string;
  timezone?: string;
  is_active?: boolean;
  working_days?: CalendarWorkingDayCreate[];
}

export interface StaffWorkScheduleCreate {
  user_id: number;
  calendar_id: number;
  start_time: string;
  end_time: string;
  grace_minutes?: number;
}

export interface AttendanceSourceCreate {
  name: string;
  type: AttendanceSourceType;
}
