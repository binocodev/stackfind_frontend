import React, { useState } from 'react';
import axios from 'axios';

const GithubSearch = () => {
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/v1/search?location=${encodeURIComponent(location)}`);
      setResults(response.data);
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error(err);
      console.log(err.response.data)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {results.length > 0 && (
        <ul>
          {results.map((company, index) => (
            <li key={index}>
              <h3>{company.name}</h3>
              <p>Repositories: {company.repository_count}</p>
              <h4>Languages:</h4>
              <ul>
                {Object.entries(company.languages).map(([lang, count]) => (
                  <li key={lang}>{lang}: {count}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GithubSearch;