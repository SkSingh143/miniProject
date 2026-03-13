import React, { useState, useContext, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const DoctorSchedule = () => {
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  
  // Default structure for weekly availability
  const [schedule, setSchedule] = useState({
    Monday: { isWorking: true, start: '09:00', end: '17:00' },
    Tuesday: { isWorking: true, start: '09:00', end: '17:00' },
    Wednesday: { isWorking: true, start: '09:00', end: '17:00' },
    Thursday: { isWorking: true, start: '09:00', end: '17:00' },
    Friday: { isWorking: true, start: '09:00', end: '17:00' },
    Saturday: { isWorking: false, start: '10:00', end: '14:00' },
    Sunday: { isWorking: false, start: '', end: '' },
  });

  // Fetch existing schedule on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.DOCTOR.AVAILABILITY);
        if (response.data && response.data.schedule) {
          setSchedule(response.data.schedule);
        }
      } catch (error) {
        console.error("Could not fetch existing schedule", error);
      }
    };
    fetchSchedule();
  }, []);

  const handleDayToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], isWorking: !prev[day].isWorking }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSaveSchedule = async () => {
    setLoading(true);
    try {
      await axiosClient.put(API_ENDPOINTS.DOCTOR.AVAILABILITY, { schedule });
      addToast('Schedule updated successfully', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Manage Weekly Schedule</h1>
      
      <div className="space-y-4 mb-6">
        {Object.keys(schedule).map((day) => (
          <div key={day} className="flex items-center justify-between p-3 border rounded bg-gray-50">
            <div className="flex items-center space-x-4 w-1/3">
              <input 
                type="checkbox" 
                checked={schedule[day].isWorking}
                onChange={() => handleDayToggle(day)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className={`font-medium ${schedule[day].isWorking ? 'text-gray-900' : 'text-gray-400'}`}>
                {day}
              </span>
            </div>
            
            {schedule[day].isWorking ? (
              <div className="flex items-center space-x-2 w-2/3 justify-end">
                <input 
                  type="time" 
                  value={schedule[day].start}
                  onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                  className="border p-1 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="time" 
                  value={schedule[day].end}
                  onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                  className="border p-1 rounded text-sm"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic w-2/3 text-right">Not Working</span>
            )}
          </div>
        ))}
      </div>

      <Button 
        onClick={handleSaveSchedule} 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Saving...' : 'Save Availability'}
      </Button>
    </div>
  );
};

export default DoctorSchedule;