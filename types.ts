export enum TaskStatus {
  IDLE = 'IDLE',
  QUEUED = 'QUEUED',
  DOWNLOADING = 'DOWNLOADING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface VideoTask {
  id: string;
  url: string;
  status: TaskStatus;
  progress: number;
  title?: string;
  thumbnail?: string;
  downloadUrl?: string;
  errorMessage?: string;
}

export interface BatchSummary {
  folderName: string;
  description: string;
  totalVideos: number;
}