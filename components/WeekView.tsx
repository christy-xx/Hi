
import React from 'react';
import { Task } from '../types';
import { getStartOfWeek, formatWeekRange, isSameDay, parseDueDate } from '../utils/dateUtils';
import DayColumn from './DayColumn';

interface WeekViewProps {
    tasks: Task[];
    currentDate: Date;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onToggleComplete: (id: string) => void;
    onSetReminder: (id: string) => void;
    onAddToCalendar: (id: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ tasks, currentDate, onPreviousWeek, onNextWeek, ...taskHandlers }) => {
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays: Date[] = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    // A static "today" based on the context for consistent highlighting
    const today = new Date('2025-08-27T12:00:00Z');

    const getTasksForDay = (day: Date): Task[] => {
        return tasks.filter(task => {
            const dueDate = parseDueDate(task.dueDate);
            return dueDate && isSameDay(dueDate, day);
        });
    };

    return (
        <div>
            {/* Week Navigation Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={onPreviousWeek}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Previous week"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="text-lg font-semibold text-center text-slate-700 dark:text-slate-300">
                    {formatWeekRange(currentDate)}
                </h3>
                <button
                    onClick={onNextWeek}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Next week"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {weekDays.map(day => (
                    <DayColumn
                        key={day.toISOString()}
                        date={day}
                        tasks={getTasksForDay(day)}
                        isToday={isSameDay(day, today)}
                        {...taskHandlers}
                    />
                ))}
            </div>
        </div>
    );
};

export default WeekView;
