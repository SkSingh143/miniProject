import React, { useState, useContext, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const DoctorSchedule = () => {
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  
  const [schedule, setSchedule] = useState({
    Monday: { isWorking: true, start: '09:00', end: '17:00' },
    Tuesday: { isWorking: true, start: '09:00', end: '17:00' },
    Wednesday: { isWorking: true, start: '09:00', end: '17:00' },
    Thursday: { isWorking: true, start: '09:00', end: '17:00' },
    Friday: { isWorking: true, start: '09:00', end: '17:00' },
    Saturday: { isWorking: false, start: '10:00', end: '14:00' },
    Sunday: { isWorking: false, start: '', end: '' },
  });

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

  const dayEmojis = {
    Monday: '📅', Tuesday: '📅', Wednesday: '📅', Thursday: '📅',
    Friday: '📅', Saturday: '🏖️', Sunday: '🏖️'
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{
        background: 'white', borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(20,184,166,0.08))',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(15,118,110,0.3)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Weekly Schedule</h1>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>Manage your availability</p>
            </div>
          </div>
        </div>

        {/* Schedule Items */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {Object.keys(schedule).map((day, idx) => (
              <div key={day} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: '12px',
                background: schedule[day].isWorking ? '#f0fdfa' : '#f8fafc',
                border: `1px solid ${schedule[day].isWorking ? '#99f6e4' : '#f1f5f9'}`,
                transition: 'all 0.25s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '140px' }}>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleDayToggle(day)}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                      background: schedule[day].isWorking ? 'linear-gradient(135deg, #0f766e, #14b8a6)' : '#cbd5e1',
                      position: 'relative', cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: schedule[day].isWorking ? '0 2px 6px rgba(15,118,110,0.3)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: 'white', position: 'absolute', top: '3px',
                      left: schedule[day].isWorking ? '23px' : '3px',
                      transition: 'left 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                    }} />
                  </button>
                  <span style={{
                    fontWeight: 600, fontSize: '0.9rem',
                    color: schedule[day].isWorking ? '#0f766e' : '#94a3b8'
                  }}>
                    {dayEmojis[day]} {day}
                  </span>
                </div>
                
                {schedule[day].isWorking ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="time" 
                      value={schedule[day].start}
                      onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                      style={{
                        padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                        fontSize: '0.82rem', fontFamily: 'inherit', background: 'white',
                        outline: 'none', transition: 'border-color 0.2s ease'
                      }}
                      onFocus={e => e.target.style.borderColor = '#14b8a6'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>to</span>
                    <input 
                      type="time" 
                      value={schedule[day].end}
                      onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                      style={{
                        padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                        fontSize: '0.82rem', fontFamily: 'inherit', background: 'white',
                        outline: 'none', transition: 'border-color 0.2s ease'
                      }}
                      onFocus={e => e.target.style.borderColor = '#14b8a6'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Not Working
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button 
            onClick={handleSaveSchedule} 
            isLoading={loading}
            className="w-full"
            style={{ width: '100%' }}
          >
            {loading ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;