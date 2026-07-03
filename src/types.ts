export interface UserProfile {
  name: string;
  email: string;
  title: string;
  location: string;
  skills: string[];
  experience: string; // text description
  education: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  contractType: string; // e.g. "Full-time", "Contract", "Part-time"
  description: string;
  created: string;
  url: string;
}

export interface JobMatchAnalysis {
  fitRating: number; // 0 - 100
  matchingSkills: string[];
  missingSkills: string[];
  pros: string[];
  cons: string[];
  interviewQuestions: string[];
}

export interface ApplicationMaterials {
  coverLetter: string;
  optimizedResumePoints: string[];
  outreachEmail: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  time: string;
  read: boolean;
}

export interface AppliedJobRecord {
  id: string;
  job: Job;
  appliedDate: string;
  status: 'Submitted' | 'Reviewing' | 'Interviewing' | 'Offered' | 'Declined';
  coverLetter?: string;
}

// For our Dev Console logs
export interface DevLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  caller: 'front-end' | 'back-end' | 'adzuna-api' | 'gemini-api';
  status: 'success' | 'pending' | 'error';
  payload: string; // stringified JSON or text info
  javaClassTrace?: {
    controller?: string;
    service?: string;
    apiWrapper?: string;
  };
}
