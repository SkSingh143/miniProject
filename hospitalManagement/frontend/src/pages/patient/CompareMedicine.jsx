import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import MedicinePriceCard from '../../components/cards/MedicinePriceCard';

const CompareMedicine = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [comparisons, setComparisons] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setComparisons(null);
    try {
      const response = await axiosClient.get(`${API_ENDPOINTS.MEDICINES.SEARCH}?query=${query}`);
      setResults(response.data.medicines);
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (medicineId, medicineName) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`${API_ENDPOINTS.MEDICINES.COMPARE}?medicineId=${medicineId}`);
      setComparisons({ name: medicineName, data: response.data.prices });
    } catch (error) {
      console.error("Comparison failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Medicine Price Comparison
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
          Search and compare medicine prices across pharmacies
        </p>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="animate-fade-in-up stagger-1" style={{
        display: 'flex', gap: '10px', marginBottom: '24px',
        background: 'white', padding: '8px', borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
      }}>
        <div style={{ flex: 1 }}>
          <input
            placeholder="Search for a medicine (e.g. Paracetamol)"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', border: 'none',
              fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
              background: 'transparent', color: '#1e293b'
            }}
          />
        </div>
        <Button type="submit" isLoading={loading}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          }
        >
          Search
        </Button>
      </form>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (<div key={i} className="skeleton" style={{ height: '60px', borderRadius: '12px' }} />))}
        </div>
      )}

      {/* Search Results List */}
      {!loading && !comparisons && results.length > 0 && (
        <div className="animate-fade-in-up" style={{
          background: 'white', borderRadius: '14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
          overflow: 'hidden'
        }}>
          {results.map((med, idx) => (
            <div key={med._id} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
              padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: idx < results.length - 1 ? '1px solid #f1f5f9' : 'none',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', margin: 0 }}>{med.name}</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  {med.manufacturer} — {med.strength}
                </p>
              </div>
              <Button variant="outline" onClick={() => handleCompare(med._id, med.name)}>
                Compare Prices
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Result */}
      {comparisons && (
        <div className="animate-fade-in-up">
          <Button variant="secondary" onClick={() => setComparisons(null)} style={{ marginBottom: '16px' }}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            }
          >
            Back to Results
          </Button>
          <MedicinePriceCard 
            medicineName={comparisons.name} 
            comparisons={comparisons.data} 
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && !comparisons && results.length === 0 && query && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💊</div>
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No medicines found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default CompareMedicine;