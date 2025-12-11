import React, { useState } from 'react';
import { VideoTask, TaskStatus } from '../types';
import { Loader2, CheckCircle2, XCircle, FileVideo, Download, RefreshCw } from 'lucide-react';

interface TaskItemProps {
  task: VideoTask;
  onRemove: (id: string) => void;
  onDownload: (task: VideoTask) => void;
  onRetry: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onRemove, onDownload, onRetry }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    await onDownload(task);
    setIsDownloading(false);
  };

  const handleRetryClick = async () => {
    setIsRetrying(true);
    await onRetry(task.id);
    setIsRetrying(false);
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case TaskStatus.DOWNLOADING:
        return <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />;
      case TaskStatus.COMPLETED:
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case TaskStatus.ERROR:
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FileVideo className="w-5 h-5 text-slate-500" />;
    }
  };

  const getProgressBarColor = () => {
    if (task.status === TaskStatus.ERROR) return 'bg-red-500';
    if (task.status === TaskStatus.COMPLETED) return 'bg-green-500';
    return 'bg-cyan-500';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-3 flex items-center gap-4 hover:border-slate-600 transition-colors group">
      {/* Thumbnail / Icon */}
      <div className="w-16 h-16 bg-slate-900 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-700/50">
        {task.thumbnail ? (
          <img src={task.thumbnail} alt="thumb" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="text-slate-600">
            <FileVideo className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Info & Progress */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-medium text-slate-200 truncate pr-4">
            {task.title || task.url}
          </h3>
          <button 
            onClick={() => onRemove(task.id)}
            className="text-slate-500 hover:text-red-400 transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
           <span className={task.status === TaskStatus.ERROR ? "text-red-400" : ""}>
             {task.errorMessage || task.status}
           </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ease-out ${getProgressBarColor()}`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        
        {/* Retry Button (Visible on Error) */}
        {task.status === TaskStatus.ERROR && (
          <button
            onClick={handleRetryClick}
            disabled={isRetrying}
            className="flex-shrink-0 bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors disabled:opacity-50"
            title="Retry Download"
          >
            <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
          </button>
        )}

        {/* Download Button (Visible on Complete) */}
        {task.status === TaskStatus.COMPLETED && (
          <button 
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className="flex-shrink-0 bg-green-500/10 hover:bg-green-500/20 text-green-400 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
              title="Download Video"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>
        )}
        
        {/* Status Icon Indicator */}
        <div className="flex-shrink-0 text-slate-400 pl-1">
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};