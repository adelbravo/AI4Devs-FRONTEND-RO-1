import axios from 'axios';

// Types based on the design document
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

export interface PositionFlow {
  positionName: string;
  interviewFlow: InterviewFlow;
}

export interface Candidate {
  id: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  applicationId?: number; // Added applicationId field
}

export interface UpdateCandidateStageRequest {
  applicationId: number; // Changed from string to number to match API spec
  currentInterviewStep: number; // Changed from string to number to match API spec
}

export interface UpdateCandidateStageResponse {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: any[];
  };
}

// API base URL
const API_BASE_URL = 'http://localhost:3010';

/**
 * Fetches the position data and its interview flow
 * @param positionId - The ID of the position
 * @returns Promise with the position data and interview flow
 */
export const getPositionFlow = async (positionId: string): Promise<PositionFlow> => {
  try {
    // Ensure positionId is a clean string without any special characters
    const cleanPositionId = positionId.toString().trim();
    console.log(`Fetching position flow for ID: ${cleanPositionId}`);
    
    // Corrected URL based on API spec - using singular "position" instead of "positions"
    console.log(`URL: ${API_BASE_URL}/position/${cleanPositionId}/interviewFlow`);
    
    const response = await axios.get(`${API_BASE_URL}/position/${cleanPositionId}/interviewFlow`);
    console.log('Position flow response:', response.data);
    
    // Check if the response has the expected structure
    if (response.data && response.data.interviewFlow) {
      // The API is returning an extra wrapper object with "interviewFlow" key
      // Extract the actual data we need
      return response.data.interviewFlow;
    }
    
    // If the response doesn't have the expected structure, return it as is
    return response.data;
  } catch (error) {
    console.error('Error fetching position flow:', error);
    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      const errorMessage = error.response?.data?.message || 'Error al obtener datos de la posición';
      throw new Error(`Error: ${errorMessage}`);
    } else {
      // Handle unexpected errors
      throw new Error('Error inesperado al obtener datos de la posición');
    }
  }
};

/**
 * Fetches candidates for a specific position
 * @param positionId - The ID of the position
 * @returns Promise with the list of candidates
 */
export const getPositionCandidates = async (positionId: string): Promise<Candidate[]> => {
  try {
    // Ensure positionId is a clean string without any special characters
    const cleanPositionId = positionId.toString().trim();
    console.log(`Fetching candidates for position ID: ${cleanPositionId}`);
    
    // Corrected URL based on API spec - using singular "position" instead of "positions"
    console.log(`URL: ${API_BASE_URL}/position/${cleanPositionId}/candidates`);
    
    const response = await axios.get(`${API_BASE_URL}/position/${cleanPositionId}/candidates`);
    console.log('Position candidates response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching position candidates:', error);
    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      const errorMessage = error.response?.data?.message || 'Error al obtener candidatos de la posición';
      throw new Error(`Error: ${errorMessage}`);
    } else {
      // Handle unexpected errors
      throw new Error('Error inesperado al obtener candidatos de la posición');
    }
  }
};

/**
 * Updates the stage of a candidate
 * @param candidateId - The ID of the candidate
 * @param data - The data to update
 * @returns Promise with the update response
 */
export const updateCandidateStage = async (
  candidateId: string, 
  data: UpdateCandidateStageRequest
): Promise<UpdateCandidateStageResponse> => {
  try {
    // Log the request for debugging
    console.log(`Updating candidate stage for ID: ${candidateId}`);
    console.log(`URL: ${API_BASE_URL}/candidates/${candidateId}`);
    console.log('Request data:', data);
    
    // Corrected URL based on API spec - removing "/stage" from the path
    const response = await axios.put(`${API_BASE_URL}/candidates/${candidateId}`, data);
    console.log('Update candidate stage response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating candidate stage:', error);
    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      const errorMessage = error.response?.data?.message || 'Error al actualizar la fase del candidato';
      throw new Error(`Error: ${errorMessage}`);
    } else {
      // Handle unexpected errors
      throw new Error('Error inesperado al actualizar la fase del candidato');
    }
  }
};