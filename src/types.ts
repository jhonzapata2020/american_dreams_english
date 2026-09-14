export interface TeacherFeedback {
  score: number; // 1.0 to 5.0
  maxScore: number;
  pronunciationNotes: string;
  classroomNotes: string;
  reviewedAt: string;
  teacherName: string;
}

export interface Submission {
  id: string;
  challengeId: string;
  studentId: string;
  studentName: string;
  studentLevel: 'A1' | 'A2' | 'B1' | 'B2';
  studentAvatar: string;
  audioUrl: string; // Blob URL or synthesized data URL
  durationSeconds: number;
  submittedAt: string;
  status: 'pending' | 'reviewed';
  feedback?: TeacherFeedback;
  isSimulated?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  targetLevel: 'A1' | 'A2' | 'B1' | 'B2';
  weeklyTopic: string;
  dueDate: string;
  description: string;
  promptText: string;
  phoneticTips: string[];
  samplePhrase: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  totalSubmissions: number;
  averageScore: number;
}

export interface Program {
  id: string;
  title: string;
  badge: string;
  targetAudience: string;
  description: string;
  schedule: string;
  features: string[];
  levelRange: string;
  iconName: string;
}

export interface PlacementLead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  estimatedLevel: string;
  goal: string;
  createdAt: string;
}
