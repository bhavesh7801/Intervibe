// Re-export everything from apiClient so there is a single source of truth across the entire app
export { api, checkBackendConnection, streamEvaluateAnswer, transcribeAudio } from '../apiClient';
export { default } from '../apiClient';