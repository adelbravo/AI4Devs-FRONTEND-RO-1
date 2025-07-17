import { 
  InterviewFlowResponse, 
  Candidate, 
  UpdateCandidateRequest, 
  UpdateCandidateResponse 
} from '../types/kanban';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

class PositionService {
  /**
   * Obtiene el flujo de entrevistas de una posición específica
   */
  static async getPositionInterviewFlow(positionId: number): Promise<InterviewFlowResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/position/${positionId}/interviewflow`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      // El backend devuelve { interviewFlow: { positionName, interviewFlow } }
      return data.interviewFlow;
    } catch (error) {
      console.error('Error fetching position interview flow:', error);
      throw new Error('Error al cargar el flujo de entrevistas');
    }
  }

  /**
   * Obtiene todos los candidatos en proceso para una posición
   */
  static async getPositionCandidates(positionId: number): Promise<Candidate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/position/${positionId}/candidates`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const candidates = await response.json();
      
      // El backend devuelve currentInterviewStep como nombre (string)
      // pero necesitamos el ID para el kanban, así que mantenemos el nombre
      // y lo mapeamos en el componente
      return candidates;
    } catch (error) {
      console.error('Error fetching position candidates:', error);
      throw new Error('Error al cargar los candidatos');
    }
  }

  /**
   * Actualiza la etapa del proceso de un candidato
   */
  static async updateCandidateStage(
    candidateId: number, 
    applicationId: number, 
    newStepId: number
  ): Promise<UpdateCandidateResponse> {
    try {
      const requestBody: UpdateCandidateRequest = {
        applicationId,
        currentInterviewStep: newStepId
      };

      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      throw new Error('Error al actualizar la etapa del candidato');
    }
  }
}

export default PositionService; 