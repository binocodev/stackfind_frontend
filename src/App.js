import React from 'react';
import GithubSearch from './components/GithubSearch';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">GitHub Tech Stack Finder</h1>
      <GithubSearch />
    </div>

  );
}

export default App;