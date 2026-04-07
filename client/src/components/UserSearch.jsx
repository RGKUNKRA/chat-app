import React, { useState } from 'react';
import { chatService } from '../services/api';
import '../styles/UserSearch.css';

const UserSearch = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search/users/${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    onSelectUser(user);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="user-search">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      {isSearching && <p className="searching">Searching...</p>}

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(user => (
            <div
              key={user._id}
              className="search-result-item"
              onClick={() => handleSelectUser(user)}
            >
              <div className="user-avatar">{user.username[0].toUpperCase()}</div>
              <div className="user-info">
                <p className="username">{user.username}</p>
                <p className="email">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
