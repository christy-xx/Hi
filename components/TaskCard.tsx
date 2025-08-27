
import React from 'react';
import { Task, Priority } from '../types';

const priorityClasses: { [key in Priority]: { bg: string; text: string, ring: string } } = {
  [Priority.High]: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-800 dark:text-red-200', ring: 'ring-red-500/50' },
  [Priority.Medium]: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-800 dark:text-yellow-200', ring: 'ring-yellow-500/50' },
  [Priority.Low]: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-800 dark:text-blue-200', ring: 'ring-blue-500/50' },
};

const completedClasses = {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-green-500/50'
};

interface TaskCardProps {
    task: Task;
    onToggleComplete: (id: string) => void;
    onSetReminder: (id: string) => void;
    onAddToCalendar: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onSetReminder, onAddToCalendar }) => {
  const classes = task.isCompleted ? completedClasses : priorityClasses[task.priority];
  
  const ReminderButton = () => {
    // Only show reminder button for high-priority, incomplete tasks
    if (task.priority !== Priority.High || task.isCompleted) return null;

    if (task.reminderSet) {
        return (
            <div className="flex-shrink-0 text-green-600 dark:text-green-400" title="Reminder is set">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
        );
    }

    return (
        <button 
            onClick={() => onSetReminder(task.id)}
            className="flex-shrink-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            aria-label="Set reminder for 1 hour"
            title="Remind me in 1 hour"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        </button>
    )
  };

  const CalendarButton = () => {
    if (task.isCompleted) return null;
    return (
        <button
            onClick={() => onAddToCalendar(task.id)}
            className="flex-shrink-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            aria-label="Add to Google Calendar"
            title="Add to Google Calendar"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </button>
    )
  };

  return (
    <div className={`p-2 rounded shadow-sm transition-all duration-300 ${classes.bg} ring-1 ${classes.ring} flex flex-col gap-2 text-sm ${task.isCompleted ? 'opacity-70' : 'hover:scale-[1.03]'}`}>
      <div className="flex items-start gap-2">
        <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => onToggleComplete(task.id)}
            aria-labelledby={`task-name-${task.id}`}
            className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />
        <div className="flex-grow">
            <p id={`task-name-${task.id}`} className={`font-semibold ${classes.text} ${task.isCompleted ? 'line-through' : ''}`}>
                {task.taskName}
            </p>
            <span className={`text-xs font-medium text-slate-500 dark:text-slate-400 ${task.isCompleted ? 'line-through' : ''}`}>
                {task.subject}
            </span>
        </div>
      </div>
      {!task.isCompleted && (
        <div className="flex items-center justify-end gap-3 self-end pr-1">
          <CalendarButton />
          <ReminderButton />
        </div>
      )}
    </div>
  );
};

export default TaskCard;
