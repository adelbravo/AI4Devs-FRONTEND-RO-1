import axios from 'axios';
import { 
  getPositionFlow, 
  getPositionCandidates, 
  updateCandidateStage,
  UpdateCandidateStageRequest
} from '../positionService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Position Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPositionFlow', () => {
    const mockPositionFlow = {
      positionName: 'Frontend Developer',
      interviewFlow: {
        id: 1,
        description: 'Standard Interview Process',
        interviewSteps: [
          {
            id: 101,
            interviewFlowId: 1,
            interviewTypeId: 1,
            name: 'CV Review',
            orderIndex: 1
          },
          {
            id: 102,
            interviewFlowId: 1,
            interviewTypeId: 2,
            name: 'Technical Interview',
            orderIndex: 2
          }
        ]
      }
    };

    it('fetches position flow data successfully', async () => {
      // Setup mock response
      mockedAxios.get.mockResolvedValueOnce({ data: mockPositionFlow });

      // Call the function
      const result = await getPositionFlow('1');

      // Assertions
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3010/positions/1/interviewFlow');
      expect(result).toEqual(mockPositionFlow);
    });

    it('handles error when fetching position flow data', async () => {
      // Setup mock error response
      const errorResponse = {
        response: {
          data: {
            message: 'Position not found'
          },
          status: 404
        }
      };
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      // Call the function and expect it to throw
      await expect(getPositionFlow('999')).rejects.toThrow();
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3010/positions/999/interviewFlow');
    });

    it('handles unexpected error when fetching position flow data', async () => {
      // Setup mock network error
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      // Call the function and expect it to throw
      await expect(getPositionFlow('1')).rejects.toThrow('Error inesperado al obtener datos de la posición');
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3010/positions/1/interviewFlow');
    });
  });

  describe('getPositionCandidates', () => {
    const mockCandidates = [
      {
        id: 201,
        fullName: 'John Doe',
        currentInterviewStep: 'CV Review',
        averageScore: 4.5
      },
      {
        id: 202,
        fullName: 'Jane Smith',
        currentInterviewStep: 'Technical Interview',
        averageScore: 3.8
      }
    ];

    it('fetches position candidates successfully', async () => {
      // Setup mock response
      mockedAxios.get.mockResolvedValueOnce({ data: mockCandidates });

      // Call the function
      const result = await getPositionCandidates('1');

      // Assertions
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3010/positions/1/candidates');
      expect(result).toEqual(mockCandidates);
    });

    it('handles error when fetching position candidates', async () => {
      // Setup mock error response
      const errorResponse = {
        response: {
          data: {
            message: 'Failed to fetch candidates'
          },
          status: 500
        }
      };
      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      // Call the function and expect it to throw
      await expect(getPositionCandidates('1')).rejects.toThrow();
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3010/positions/1/candidates');
    });

    it('handles unexpected error when fetching position candidates', async () => {
      // Setup mock network error
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      // Call the function and expect it to throw
      await expect(getPositionCandidates('1')).rejects.toThrow('Error inesperado al obtener candidatos de la posición');
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3010/positions/1/candidates');
    });
  });

  describe('updateCandidateStage', () => {
    const mockUpdateRequest: UpdateCandidateStageRequest = {
      applicationId: '1',
      currentInterviewStep: 'Technical Interview'
    };

    const mockUpdateResponse = {
      message: 'Candidate stage updated successfully',
      data: {
        id: 1,
        positionId: 1,
        candidateId: 201,
        applicationDate: '2025-07-16T10:00:00Z',
        currentInterviewStep: 2,
        notes: null,
        interviews: []
      }
    };

    it('updates candidate stage successfully', async () => {
      // Setup mock response
      mockedAxios.put.mockResolvedValueOnce({ data: mockUpdateResponse });

      // Call the function
      const result = await updateCandidateStage('201', mockUpdateRequest);

      // Assertions
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'http://localhost:3010/candidates/201/stage',
        mockUpdateRequest
      );
      expect(result).toEqual(mockUpdateResponse);
    });

    it('handles error when updating candidate stage', async () => {
      // Setup mock error response
      const errorResponse = {
        response: {
          data: {
            message: 'Invalid stage transition'
          },
          status: 400
        }
      };
      mockedAxios.put.mockRejectedValueOnce(errorResponse);

      // Call the function and expect it to throw
      await expect(updateCandidateStage('201', mockUpdateRequest)).rejects.toThrow();
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'http://localhost:3010/candidates/201/stage',
        mockUpdateRequest
      );
    });

    it('handles unexpected error when updating candidate stage', async () => {
      // Setup mock network error
      mockedAxios.put.mockRejectedValueOnce(new Error('Network Error'));

      // Call the function and expect it to throw
      await expect(updateCandidateStage('201', mockUpdateRequest)).rejects.toThrow('Error inesperado al actualizar la fase del candidato');
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'http://localhost:3010/candidates/201/stage',
        mockUpdateRequest
      );
    });
  });
});