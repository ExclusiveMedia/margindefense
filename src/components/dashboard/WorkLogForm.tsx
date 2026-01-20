/**
 * WorkLogForm Component
 * Manual entry form for logging work
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, FileText, Building2, Briefcase, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { classifyWork, getCategoryInfo } from '@/lib/classifier';
import { useClients } from '@/hooks/useData';
import { useProjects } from '@/hooks/useData';
import type { WorkCategory } from '@/types';

interface WorkLogFormProps {
  onSubmit: (data: {
    description: string;
    duration_minutes: number;
    project_id?: string;
    client_id?: string;
  }) => void;
  className?: string;
}

export function WorkLogForm({ onSubmit, className }: WorkLogFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<{ category: WorkCategory; confidence: number } | null>(null);

  const { clients } = useClients();
  const { projects } = useProjects();

  // Filter projects by selected client
  const filteredProjects = clientId
    ? projects.filter((p) => p.client_id === clientId)
    : projects;

  // Preview classification as user types
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (value.length > 10) {
      const result = classifyWork(value);
      setPreview({ category: result.category, confidence: result.confidence });
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    if (totalMinutes <= 0) return;

    setIsSubmitting(true);

    // Simulate slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    onSubmit({
      description: description.trim(),
      duration_minutes: totalMinutes,
      client_id: clientId || undefined,
      project_id: projectId || undefined,
    });

    // Reset form
    setDescription('');
    setHours('');
    setMinutes('');
    setClientId('');
    setProjectId('');
    setPreview(null);
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <div className={cn('', className)}>
      {/* Collapsed state - button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="w-full p-4 glass-panel hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2 text-slate-400 hover:text-white"
        >
          <Plus className="w-5 h-5" />
          <span>Log Work</span>
        </motion.button>
      )}

      {/* Expanded form */}
      <AnimatePresence>
        {isOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glass-panel overflow-hidden"
          >
            <div className="p-4 border-b border-slate-800/50">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Log Work
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 hover:text-white text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">
                  What did you work on?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="e.g., Weekly team sync meeting, Client strategy call, Built homepage design..."
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-slate-600 resize-none"
                  rows={3}
                  required
                />

                {/* AI Classification Preview */}
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-2 text-xs"
                  >
                    <Sparkles className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-500">AI predicts:</span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded',
                        getCategoryInfo(preview.category).bgColor,
                        getCategoryInfo(preview.category).color
                      )}
                    >
                      {getCategoryInfo(preview.category).icon}{' '}
                      {getCategoryInfo(preview.category).label}
                    </span>
                    <span className="text-slate-600">
                      ({Math.round(preview.confidence * 100)}% confidence)
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Duration
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
                    />
                    <span className="text-xs text-slate-600 mt-1 block">hours</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      placeholder="0"
                      min="0"
                      max="59"
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
                    />
                    <span className="text-xs text-slate-600 mt-1 block">minutes</span>
                  </div>
                </div>
              </div>

              {/* Client & Project (optional) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    <Building2 className="w-3 h-3 inline mr-1" />
                    Client (optional)
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      setProjectId(''); // Reset project when client changes
                    }}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600"
                  >
                    <option value="">No client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    <Briefcase className="w-3 h-3 inline mr-1" />
                    Project (optional)
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600"
                    disabled={filteredProjects.length === 0}
                  >
                    <option value="">No project</option>
                    {filteredProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !description.trim() || ((parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0)) <= 0}
                className={cn(
                  'w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2',
                  'bg-gradient-to-r from-burn-600 to-burn-500 hover:from-burn-500 hover:to-burn-400 text-white',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Log & Classify
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
