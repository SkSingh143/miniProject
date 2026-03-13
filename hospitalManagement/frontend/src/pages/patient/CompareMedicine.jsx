import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import MedicinePriceCard from '../../components/cards/MedicinePriceCard';

const CompareMedicine = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Stores search results (medicines)
  const [comparisons, setComparisons] = useState(null); // Stores price data for selected med
  const [loading, setLoading] = useState(false);

  // Step 1: Search for medicine by name
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setComparisons(null); // Reset previous comparison
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

  // Step 2: Fetch prices for a specific medicine ID
  const handleCompare = async (medicineId, medicineName) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`${API_ENDPOINTS.MEDICINES.COMPARE}?medicineId=${medicineId}`);
      // Response expected: { prices: [{ vendor: '1mg', price: 50 }, ...] }
      setComparisons({ name: medicineName, data: response.data.prices });
    } catch (error) {
      console.error("Comparison failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Medicine Price Comparison</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="flex-1">
          <InputField 
            placeholder="Search for a medicine (e.g. Paracetamol)" 
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="mt-1"> 
        {/* mt-1 aligns button with input visually since InputField has a wrapper div */}
          <Button type="submit">Search</Button>
        </div>
      </form>

      {loading && <p>Loading data...</p>}

      {/* Search Results List */}
      {!comparisons && results.length > 0 && (
        <div className="bg-white rounded shadow divide-y">
          {results.map((med) => (
            <div key={med._id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">{med.name}</h3>
                <p className="text-sm text-gray-500">{med.manufacturer} - {med.strength}</p>
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
        <div>
          <Button variant="secondary" onClick={() => setComparisons(null)} className="mb-4">
            &larr; Back to Results
          </Button>
          <MedicinePriceCard 
            medicineName={comparisons.name} 
            comparisons={comparisons.data} 
          />
        </div>
      )}
    </div>
  );
};

export default CompareMedicine;