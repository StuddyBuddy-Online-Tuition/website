export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"

export interface Timeslot {
  timeslotId: string
  subjectCode: string
  day: Weekday
  startTime: string
  endTime: string
  teacherName: string
  studentId: string | null
  studentName: string | null
}
  
export type DbTimeslot = {
  timeslotid: string;
  subjectcode: string;
  day: Weekday; // matches DB enum weekday
  starttime: string; // time
  endtime: string; // time
  teachername: string;
  studentid: string | null;
  studentname: string | null;
};