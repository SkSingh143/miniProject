import React from 'react';
import Button from '../common/Button';

const DoctorCard = ({ doctor, onAction, actionLabel = "Book" }) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Placeholder Avatar */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
          {doctor.name.charAt(0)}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-sm text-gray-600">{doctor.specialization}</p>
          <p className="text-sm text-gray-500">{doctor.experience} years experience</p>
          
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Available:</span> {doctor.availability ? doctor.availability.join(', ') : 'Check slots'}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant="primary" onClick={() => onAction(doctor)}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;