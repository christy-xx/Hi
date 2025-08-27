
import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Task } from './types';
import { analyzeBrainDump } from './services/geminiService';
import { parseDueDate } from './utils/dateUtils';

import Header from './components/Header';
import InputPanel from './components/InputPanel';
import WeekView from './components/WeekView';
import TaskCard from './components/TaskCard';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Could not load tasks from localStorage", error);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Set the initial date based on the user's context for consistency
  const [currentDate, setCurrentDate] = useState(new Date('2025-08-27T12:00:00Z'));

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Could not save tasks to localStorage", error);
    }
  }, [tasks]);


  const handleAnalyze = useCallback(async () => {
    if (!userInput.trim()) {
      setError('Please enter a description of your day.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTasks([]);

    try {
      const result = await analyzeBrainDump(userInput);
      setTasks(result);
      // Reset the view to the current date after analysis
      setCurrentDate(new Date('2025-08-27T12:00:00Z')); 
    } catch (err) {
      setError('An error occurred while analyzing your day. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const handleToggleComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };
  
  const handleSetReminder = async (taskId: string) => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }

    const taskToRemind = tasks.find(t => t.id === taskId);
    if (!taskToRemind) return;

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Set a timeout for 1 hour (3600 * 1000 milliseconds)
            setTimeout(() => {
                new Notification('Task Reminder', {
                    body: taskToRemind.taskName,
                    icon: '/vite.svg', // Optional: add an icon
                });
            }, 3600 * 1000);

            // Update the task state to indicate a reminder is set
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, reminderSet: true } : task
                )
            );
        } else {
            alert('Notification permission denied. We can\'t send you reminders.');
        }
    } catch(err) {
        console.error("Error requesting notification permission:", err);
        alert("An error occurred while setting up the reminder.");
    }
  };
  
  const handleAddToCalendar = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const startDate = parseDueDate(task.dueDate);
    if (!startDate) {
        alert("Sorry, we couldn't determine a specific date for this task to add it to your calendar.");
        return;
    }

    // Set end date to be 1 hour after the start date
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    // Format dates to ISO 8601 format without punctuation (YYYYMMDDTHHMMSSZ)
    const formatDateForGoogle = (date: Date) => date.toISOString().replace(/[-:.]/g, '').replace('000Z', 'Z');

    const googleCalendarUrl = new URL('https://www.google.com/calendar/render');
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.append('text', task.taskName);
    googleCalendarUrl.searchParams.append('dates', `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`);
    googleCalendarUrl.searchParams.append('details', `Task for subject: ${task.subject}`);
    
    window.open(googleCalendarUrl.toString(), '_blank');
  };

  const handlePreviousWeek = () => {
    setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() - 7);
        return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + 7);
        return newDate;
    });
  };

  const completedTasks = tasks.filter(task => task.isCompleted);
  const activeTasks = tasks.filter(task => !task.isCompleted);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <InputPanel 
              userInput={userInput}
              setUserInput={setUserInput}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
        </div>
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 lg:col-span-2 min-h-[500px] flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Your Weekly Plan</h2>
          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error} />}
          {!isLoading && !error && tasks.length === 0 && <EmptyState />}
          {!isLoading && !error && tasks.length > 0 && (
            <div>
              <WeekView 
                tasks={activeTasks}
                currentDate={currentDate}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onToggleComplete={handleToggleComplete}
                onSetReminder={handleSetReminder}
                onAddToCalendar={handleAddToCalendar}
              />

              {completedTasks.length > 0 && (
                 <div className="mt-8">
                    <h3 className={`text-xl font-semibold mb-3 pb-2 border-b-2 border-green-500 text-green-500`}>
                        Completed Tasks
                    </h3>
                    <div className="space-y-3">
                        {completedTasks.map((task) => (
                            <TaskCard key={task.id} task={task} onToggleComplete={handleToggleComplete} onSetReminder={handleSetReminder} onAddToCalendar={handleAddToCalendar} />
                        ))}
                    </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
