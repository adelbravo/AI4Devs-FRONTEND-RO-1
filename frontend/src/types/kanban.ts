export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

export interface InterviewFlowResponse {
  positionName: string;
  interviewFlow: InterviewFlow;
}

export interface Candidate {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

export interface PositionData {
  positionName: string;
  interviewSteps: InterviewStep[];
  candidates: Candidate[];
}

export interface UpdateCandidateRequest {
  applicationId: number;
  currentInterviewStep: number;
}

export interface UpdateCandidateResponse {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: Array<{
      interviewDate: string;
      interviewStep: string;
      score: number | null;
    }>;
  };
} 