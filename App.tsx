import React, { useState, useCallback } from 'react';
import { VideoTask, TaskStatus } from './types';
import { InputSection } from './components/InputSection';
import { TaskItem } from './components/TaskItem';
import { DownloadCloud, Play, Trash2, ShieldCheck, FolderDown, CheckCheck, Loader2, RefreshCw } from 'lucide-react';
import JSZip from 'jszip';
import saveAs from 'file-saver';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<VideoTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Helper: Try multiple proxies to fetch data (JSON or Blob)
  // This solves the "Failed to fetch" error by having backups.
  const fetchWithProxies = async (targetUrl: string, type: 'json' | 'blob') => {
    // Proxy strategies
    const strategies = [
      // 1. CorsProxy.io - Fast, usually reliable
      (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      // 2. AllOrigins Raw - Good for direct data
      (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      // 3. CodeTabs - Excellent for binaries/videos
      (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
      // 4. Direct (Try as last resort, some CDNs allow it)
      (u: string) => u
    ];

    // Try standard proxies
    for (const createProxyUrl of strategies) {
      try {
        const url = createProxyUrl(targetUrl);
        const controller = new AbortController();
        // 15s timeout for video blobs, 8s for JSON
        const timeoutId = setTimeout(() => controller.abort(), type === 'blob' ? 15000 : 8000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) continue;

        if (type === 'json') {
           // Clone locally to try parsing
           const text = await response.text();
           try {
             return JSON.parse(text);
           } catch {
             // If text isn't JSON, this proxy might have returned an HTML error page
             continue;
           }
        } else {
          return await response.blob();
        }
      } catch (err) {
        // console.warn(`Proxy strategy failed:`, err);
        continue;
      }
    }

    // Special Fallback for JSON only: AllOrigins /get endpoint
    // This returns JSON wrapped in { contents: "..." } which bypasses some strict CORS headers
    if (type === 'json') {
       try {
         const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
         if (res.ok) {
           const wrapper = await res.json();
           if (wrapper.contents) {
             // Depending on the API, contents might be stringified JSON or just the string
             try {
                return JSON.parse(wrapper.contents);
             } catch {
                return wrapper.contents;
             }
           }
         }
       } catch (e) {
         console.warn("AllOrigins /get fallback failed");
       }
    }

    throw new Error("All proxies failed to fetch data.");
  };

  // Real TikTok Resolver using robust proxy rotation and rate limit handling
  const resolveVideoData = async (url: string, retryCount = 0): Promise<any> => {
    // API URL for TikWM
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    
    try {
      // Use the helper to try multiple proxies
      const data = await fetchWithProxies(apiUrl, 'json');

      // Check tikwm specific response code
      if (data && data.code === 0 && data.data) {
        return {
          title: data.data.title || `tiktok_video_${data.data.id}`,
          thumbnail: data.data.cover,
          downloadUrl: data.data.play, // MP4 URL
          size: data.data.size
        };
      } else {
        // Handle Rate Limit specifically
        if (data?.msg && typeof data.msg === 'string' && data.msg.toLowerCase().includes('limit')) {
           if (retryCount < 3) {
             console.warn(`Rate limit hit. Retrying in 2s... (Attempt ${retryCount + 1})`);
             await new Promise(r => setTimeout(r, 2000 + (retryCount * 1000)));
             return resolveVideoData(url, retryCount + 1);
           }
        }
        throw new Error(data?.msg || 'Video not found');
      }
    } catch (error: any) {
      // If error is explicitly about limit from a throw above
      if (error.message && error.message.toLowerCase().includes('limit') && retryCount < 3) {
         await new Promise(r => setTimeout(r, 2000));
         return resolveVideoData(url, retryCount + 1);
      }
      
      console.error("Resolve error:", error);
      throw new Error(error.message || 'Video data not found. Link might be invalid.');
    }
  };

  const addLinks = (links: string[]) => {
    const newTasks: VideoTask[] = links.map(url => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      status: TaskStatus.IDLE,
      progress: 0
    }));
    setTasks(prev => [...prev, ...newTasks]);
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => t.status !== TaskStatus.COMPLETED));
  };

  const processBatch = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const pendingTasks = tasks.filter(t => t.status === TaskStatus.IDLE || t.status === TaskStatus.ERROR);
    
    if (pendingTasks.length === 0) {
      setIsProcessing(false);
      return;
    }

    // REDUCED BATCH SIZE TO 1 to prevent "Free Api Limit" errors
    const BATCH_SIZE = 1; 
    
    for (let i = 0; i < pendingTasks.length; i += BATCH_SIZE) {
      const chunk = pendingTasks.slice(i, i + BATCH_SIZE);
      
      // Update status to Downloading
      setTasks(prev => prev.map(t => {
        if (chunk.find(c => c.id === t.id)) {
          return { ...t, status: TaskStatus.DOWNLOADING, progress: 20, errorMessage: undefined };
        }
        return t;
      }));

      // Process chunk
      await Promise.all(chunk.map(async (task) => {
         try {
             // Resolve Real Data
             const data = await resolveVideoData(task.url);
             
             // Update with Real Data
             setTasks(prev => prev.map(t => t.id === task.id ? { 
                ...t, 
                title: data.title,
                thumbnail: data.thumbnail,
                downloadUrl: data.downloadUrl,
                status: TaskStatus.COMPLETED,
                progress: 100
             } : t));

         } catch (error: any) {
             setTasks(prev => prev.map(t => t.id === task.id ? { 
                ...t, 
                status: TaskStatus.ERROR,
                errorMessage: error.message || "Failed to fetch.",
                progress: 0
             } : t));
         }
      }));
      
      // Force delay between requests to respect 1 req/sec limit
      if (i + BATCH_SIZE < pendingTasks.length) {
          await new Promise(r => setTimeout(r, 1300));
      }
    }

    setIsProcessing(false);
  }, [tasks, isProcessing]);

  // Handler for single retry button
  const handleSingleRetry = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: TaskStatus.DOWNLOADING, progress: 20, errorMessage: undefined } : t));

    try {
        const data = await resolveVideoData(task.url);
        setTasks(prev => prev.map(t => t.id === id ? { 
          ...t, 
          title: data.title,
          thumbnail: data.thumbnail,
          downloadUrl: data.downloadUrl,
          status: TaskStatus.COMPLETED,
          progress: 100
        } : t));
    } catch (error: any) {
        setTasks(prev => prev.map(t => t.id === id ? { 
          ...t, 
          status: TaskStatus.ERROR,
          errorMessage: error.message || "Retry failed.",
          progress: 0
        } : t));
    }
  };

  // Handler for "Retry All Failed" button
  const handleRetryAllErrors = async () => {
    // Reset all ERROR tasks to IDLE
    setTasks(prev => prev.map(t => t.status === TaskStatus.ERROR ? { ...t, status: TaskStatus.IDLE, errorMessage: undefined, progress: 0 } : t));
    
    // Wait a tick for state update, then trigger batch processing
    setTimeout(() => {
      processBatch();
    }, 100);
  };

  const handleSingleDownload = async (task: VideoTask) => {
    if (!task.downloadUrl) return;

    try {
      // Use the same robust proxy fetcher for the video blob
      const blob = await fetchWithProxies(task.downloadUrl, 'blob');
      const safeTitle = (task.title || `video_${task.id}`).replace(/[^a-z0-9]/gi, '_').substring(0, 50);
      saveAs(blob, `${safeTitle}.mp4`);
    } catch (error) {
      console.error("Single download failed:", error);
      alert("Failed to download video file. The link might be expired or blocked.");
    }
  };

  const handleBulkDownload = async () => {
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED && t.downloadUrl);
    if (completedTasks.length === 0) return;

    setIsZipping(true);
    const zip = new JSZip();

    try {
      const folder = zip.folder("TikTok_Batch_Download");
      
      // We process downloads in chunks to avoid blowing up browser memory or network
      const DOWNLOAD_BATCH = 3;
      
      for (let i = 0; i < completedTasks.length; i += DOWNLOAD_BATCH) {
        const chunk = completedTasks.slice(i, i + DOWNLOAD_BATCH);
        
        await Promise.all(chunk.map(async (task) => {
          if (!task.downloadUrl) return;
          
          const safeTitle = (task.title || `video_${task.id}`).replace(/[^a-z0-9]/gi, '_').substring(0, 50);
          const fileName = `${safeTitle}.mp4`;
          
          try {
            // Use robust fetcher for binary data
            const blob = await fetchWithProxies(task.downloadUrl, 'blob');
            folder?.file(fileName, blob);
          } catch (error) {
            console.error(`Failed to download content for ${task.title}`, error);
            folder?.file(`${safeTitle}_error.txt`, `Failed to download: ${task.url}\nError: Could not fetch video data via proxies.`);
          }
        }));
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "tiktok_videos_batch.zip");

    } catch (error) {
      console.error("Zip creation failed:", error);
      alert("An error occurred while creating the zip file.");
    } finally {
      setIsZipping(false);
    }
  };

  // Calculate stats
  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const idleCount = tasks.filter(t => t.status === TaskStatus.IDLE).length;
  const errorCount = tasks.filter(t => t.status === TaskStatus.ERROR).length;
  const hasItems = tasks.length > 0;
  const allComplete = hasItems && tasks.every(t => t.status === TaskStatus.COMPLETED);

  return (
    <div className="min-h-screen pb-20">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <DownloadCloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">TokBatch</h1>
              <p className="text-xs text-slate-400">Bulk Video Downloader</p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
             <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
               <ShieldCheck className="w-3 h-3 text-green-500" />
               <span>Berk</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        
        <InputSection onAddLinks={addLinks} />

        {/* Action Bar */}
        {tasks.length > 0 && (
          <div className="flex items-center justify-between mb-4 sticky top-20 z-40 bg-slate-900/90 p-2 rounded-lg border border-slate-800 backdrop-blur">
            <div className="text-sm font-medium text-slate-300 pl-2">
              Queue: <span className="text-white">{tasks.length}</span> · Idle: <span className="text-cyan-400">{idleCount}</span>
              {errorCount > 0 && <span className="ml-2 text-red-400">· Failed: {errorCount}</span>}
            </div>
            <div className="flex gap-2">
               {errorCount > 0 && (
                 <button
                   onClick={handleRetryAllErrors}
                   disabled={isProcessing}
                   className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 hover:text-orange-300 border border-orange-500/20 rounded-md transition-colors"
                 >
                   <RefreshCw className="w-3.5 h-3.5" />
                   Retry Failed
                 </button>
               )}
               {completedCount > 0 && (
                 <button 
                   onClick={clearCompleted}
                   className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                 >
                   <Trash2 className="w-3.5 h-3.5" />
                   Clear Done
                 </button>
               )}
               <button
                 onClick={processBatch}
                 disabled={isProcessing || (idleCount === 0 && errorCount === 0)}
                 className={`
                   flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-md transition-all
                   ${isProcessing || (idleCount === 0 && errorCount === 0)
                     ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                     : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95'
                   }
                 `}
               >
                 {isProcessing ? (
                   <>Processing...</>
                 ) : (
                   <>
                     <Play className="w-4 h-4 fill-current" />
                     Start Download
                   </>
                 )}
               </button>
            </div>
          </div>
        )}

        {/* Queue List */}
        <div className="space-y-0 min-h-[100px]">
          {tasks.length === 0 ? (
             <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <VideoTaskIcon className="w-8 h-8 text-slate-600" />
               </div>
               <p className="text-slate-500">No videos in queue.</p>
               <p className="text-slate-600 text-sm mt-1">Paste TikTok links above.</p>
             </div>
          ) : (
            tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onRemove={removeTask} 
                onDownload={handleSingleDownload}
                onRetry={handleSingleRetry}
              />
            ))
          )}
        </div>

        {/* Bulk Download Card (Shows when all items are complete) */}
        {completedCount > 0 && allComplete && !isProcessing && (
           <div className="mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 backdrop-blur-md animate-fade-in">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                   <CheckCheck className="w-8 h-8" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-white mb-1">All Downloads Ready!</h3>
                   <p className="text-slate-400 text-sm">
                     Successfully processed {completedCount} videos.
                   </p>
                 </div>
               </div>
               
               <button 
                 onClick={handleBulkDownload}
                 disabled={isZipping}
                 className={`
                    w-full sm:w-auto flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition-all shadow-lg 
                    ${isZipping 
                        ? 'bg-slate-700 text-slate-400 cursor-wait' 
                        : 'bg-green-500 hover:bg-green-400 text-slate-900 shadow-green-500/20 hover:scale-105 active:scale-95'
                    }
                 `}
               >
                 {isZipping ? (
                     <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Zip...
                     </>
                 ) : (
                     <>
                        <FolderDown className="w-5 h-5" />
                        Download All (.zip)
                     </>
                 )}
               </button>
             </div>
           </div>
        )}

      </main>
    </div>
  );
};

// Helper icon component for empty state
const VideoTaskIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 10l5 5-5 5" />
    <path d="M4 4v16" />
    <path d="M9 4v16" />
    <path d="M14 4v16" />
  </svg>
);

export default App;