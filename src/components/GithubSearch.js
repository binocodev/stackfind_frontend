import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';

const GithubSearch = () => {
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [availableLanguages, setAvailableLanguages] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    setFilteredResults([]);
    setSelectedLanguage('');
    setAvailableLanguages([]);

    try {
      const response = await axios.get(`http://localhost:3001/api/v1/search?location=${encodeURIComponent(location)}`);
      setResults(response.data);
      setFilteredResults(response.data);
      const languages = new Set(response.data.flatMap(company => Object.keys(company.languages)));
      setAvailableLanguages(Array.from(languages));
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLanguage) {
      setFilteredResults(results.filter(company => company.languages[selectedLanguage]));
    } else {
      setFilteredResults(results);
    }
  }, [selectedLanguage, results]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="bg-transparent text-white pl-6 pr-2 py-4 w-full focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 flex items-center"
          >
            <Search className="mr-2" size={20} />
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex justify-center items-center mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {filteredResults.length > 0 && (
        <div className="mb-6">
          <label htmlFor="language-filter" className="block text-sm font-medium text-gray-400 mb-2">
            Filter by Language:
          </label>
          <div className="relative">
            <select
              id="language-filter"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="block appearance-none w-full bg-gray-800 border border-gray-700 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="">All Languages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {filteredResults.length > 0 && (
        <ul className="space-y-6">
          {filteredResults.map((company, index) => (
            <li key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={company.avatar}
                  alt={`${company.name} logo`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-semibold mb-2 text-white">{company.name}</h3>
                <p className="mb-2 text-gray-300">Repositories: {company.repository_count}</p>
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition duration-300 mb-4 inline-block"
                >
                  {company.url}
                </a>
                <h4 className="font-semibold mb-2 text-gray-200">Languages:</h4>
                <ul className="flex flex-wrap gap-2">
                  {Object.entries(company.languages).map(([lang, count]) => (
                    <li key={lang} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-white flex items-center">
                      <span>{lang}: {count}</span>
                      {selectedLanguage === lang && (
                        <button
                          onClick={() => setSelectedLanguage('')}
                          className="ml-2 focus:outline-none"
                          aria-label="Clear filter"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GithubSearch;