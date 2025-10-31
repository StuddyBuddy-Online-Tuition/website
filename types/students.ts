export type CreateStudentInput = {
  name?: string;
  full_name?: string;
  parentname?: string;
  studentphone?: string;
  parentphone?: string;
  email?: string;
  school?: string;
  grade?: string;
  classinid?: string;
  registereddate?: string | Date;
  modes?: string[];
  dlp?: string;
  icnumber?: string;
};

export type CreateStudentResult = {
  data: any | null;
  error: string | null;
};


