import React, { useState } from 'react';
import '../styles/CreateGroup.css';

const CreateGroup = ({ onGroupCreated, onCancel }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/search/users/${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleAddMember = (user) => {
    if (!selectedMembers.find(m => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(m => m._id !== userId));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert('Group name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/groups/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: groupName,
          description,
          memberIds: selectedMembers.map(m => m._id)
        })
      });

      const data = await response.json();

      if (response.ok) {
        onGroupCreated(data.group);
        setGroupName('');
        setDescription('');
        setSelectedMembers([]);
      } else {
        alert(data.message || 'Error creating group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Error creating group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-modal">
      <div className="create-group-content">
        <h2>Create Group</h2>

        <form onSubmit={handleCreateGroup}>
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />

          <textarea
            placeholder="Group description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />

          <div className="member-search">
            <input
              type="text"
              placeholder="Search and add members..."
              value={searchQuery}
              onChange={handleSearch}
            />

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(user => (
                  <div
                    key={user._id}
                    className="search-result-item"
                    onClick={() => handleAddMember(user)}
                  >
                    <p>{user.username}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="selected-members">
            <h4>Members ({selectedMembers.length})</h4>
            <div className="member-list">
              {selectedMembers.map(member => (
                <div key={member._id} className="member-tag">
                  <span>{member.username}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member._id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
