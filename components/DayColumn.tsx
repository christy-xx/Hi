
import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface DayColumnProps {
    date: Date;
    tasks: Task[];
    isToday: boolean;
    onToggleComplete: (id: string) => void;
    onSetReminder: (id: string) => void;
    onAddToCalendar: (id: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ date, tasks, isToday, ...taskHandlers }) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = date.getDate();

    return (
        <div className={`rounded-lg p-2 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-slate-100 dark:bg-slate-800/20'}`}>
            <div className={`text-center mb-3 p-2 rounded ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                <p className="font-bold text-sm">{dayName}</p>
                <p className="text-2xl font-bold">{dayOfMonth}</p>
            </div>
            <div className="space-y-2 min-h-[100px]">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskCard key={task.id} task={task} {...taskHandlers} />
                    ))
                ) : (
                    <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
                        No tasks.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayColumn;
