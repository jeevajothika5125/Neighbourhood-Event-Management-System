import React, { useState } from 'react';

const EventSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    location: ''
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      location: ''
    });
    onSearch('');
  };

  return (
    <div className="event-search">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search events by name, description, or location..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button className="search-btn">
          🔍
        </button>
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="dateFrom">From Date:</label>
          <input
            type="date"
            id="dateFrom"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="dateTo">To Date:</label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Filter by location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>

        <button onClick={handleClearFilters} className="btn btn-secondary">
          Clear Filters
        </button>
      </div>
      
      <style jsx>{`
        .event-search {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          color: white;
        }

        .search-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .search-input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(236,72,153,0.6);
          box-shadow: 0 0 0 3px rgba(236,72,153,0.2);
          background: rgba(255,255,255,0.15);
        }

        .search-btn {
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 50px;
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(236,72,153,0.3);
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(236,72,153,0.4);
        }

        .search-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 600;
          color: #fce7f3;
          font-size: 0.9rem;
        }

        .filter-group input,
        .filter-group select {
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .filter-group input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .filter-group input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: rgba(236,72,153,0.6);
          box-shadow: 0 0 0 3px rgba(236,72,153,0.2);
          background: rgba(255,255,255,0.15);
        }

        .filter-group select option {
          background: #1f2937;
          color: white;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          height: fit-content;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .search-filters {
            grid-template-columns: 1fr;
          }

          .search-bar {
            flex-direction: column;
          }

          .search-input {
            border-radius: 10px;
          }

          .search-btn {
            border-radius: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default EventSearch;