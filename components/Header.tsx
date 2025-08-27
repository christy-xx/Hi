
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
          Academic Task Manager
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Turn your daily chaos into a clear action plan with AI.
        </p>
      </div>
    </header>
  );
};

export default Header;
