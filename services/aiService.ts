import { BatchSummary } from '../types';

export const generateBatchSummary = async (titles: string[]): Promise<BatchSummary> => {
  return {
    folderName: "TikTok_Batch_" + new Date().toISOString().slice(0, 10),
    description: "Batch downloaded videos (AI removed)",
    totalVideos: titles.length
  };
};