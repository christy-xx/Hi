
import React from 'react';

interface InputPanelProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ userInput, setUserInput, onAnalyze, isLoading }) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Your Daily Brain Dump</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Describe everything that happened at school today. Mention homework, upcoming tests, projects, and what you learned. The more detail, the better!
      </p>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="e.g., In math, we learned about quadratic equations and got homework due tomorrow. English essay on 'The Great Gatsby' is due next Friday. Science class tomorrow will cover the water cycle..."
        className="w-full flex-grow p-3 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 resize-none min-h-[250px] md:min-h-[300px]"
        disabled={isLoading}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center shadow-lg transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze My Day'
        )}
      </button>
    </div>
  );
};

export default InputPanel;
