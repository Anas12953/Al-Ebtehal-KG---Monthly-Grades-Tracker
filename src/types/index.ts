export type GradeLevel = 'KG1' | 'KG2';

export type AssessmentGrade = 'EX' | 'M' | 'D' | 'E';

export type AttendanceStatus = 'ملتزم' | 'ملتزم جزئياً' | 'غير ملتزم';

export type SubjectDomain =
  | 'arabic'
  | 'english'
  | 'math'
  | 'science'
  | 'islamic'
  | 'national';

export interface AssessmentStandard {
  id: string;
  nameAr: string;
  nameEn: string;
  domain: SubjectDomain;
  domainAr: string;
  domainEn: string;
  grade: AssessmentGrade;
}

export interface ProgressSnapshot {
  term: 'term1' | 'term2';
  termNameAr: string;
  termNameEn: string;
  timestamp: string; // ISO date string
  counts: {
    EX: number;
    M: number;
    D: number;
    E: number;
  };
}

export interface StudentRecord {
  emiratesId: string; // Exact 15-digit string formatted or unformatted
  nameAr: string;
  nameEn?: string;
  gradeLevel: GradeLevel;
  classNumber: number;
  fullClass: string; // e.g. "KG1-3" or "KG2-5"
  attendanceStatus: AttendanceStatus;
  standards: AssessmentStandard[];
  teacherNotes: string;
  translatedNotes?: string;
  guardianAccessCode: string;
  lastSynchronized: string; // ISO timestamp
  historicalSnapshots?: ProgressSnapshot[];
}

export interface UserSession {
  token: string;
  student: Omit<StudentRecord, 'guardianAccessCode'>;
}

export interface AdvisorFeedback {
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
  narrativeAr: string;
  narrativeEn: string;
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'fahem';
  text: string;
  timestamp: string;
  language?: 'ar' | 'en';
}

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';
