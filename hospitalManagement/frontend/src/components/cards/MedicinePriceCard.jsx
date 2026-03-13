import React from 'react';

const MedicinePriceCard = ({ medicineName, comparisons }) => {
  // comparisons expected format: [{ vendor: '1mg', price: 100 }, { vendor: 'Local', price: 90 }]
  
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 w-full">
      <h4 className="text-md font-bold text-gray-800 mb-3 capitalize">{medicineName}</h4>
      
      <div className="space-y-2">
        {comparisons && comparisons.length > 0 ? (
          comparisons.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">{item.vendor}</span>
              <span className={`font-bold ${index === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                ${item.price}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No price data available.</p>
        )}
      </div>
    </div>
  );
};

export default MedicinePriceCard;