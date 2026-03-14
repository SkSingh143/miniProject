import React, { useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const BookAppointment = () => {
  const { addToast } = useContext(ToastContext);
  const [searchParams] = useSearchParams();
  const clinicId = searchParams.get('clinicId');
  const clinicName = searchParams.get('clinicName');

  const { data: doctors, loading: doctorsLoading } = useFetch(
    clinicId ? `/patient/clinics/${clinicId}/doctors` : null
  );

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // If no clinic selected, redirect prompt
  if (!clinicId) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏥</div>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>Please select a clinic first</p>
        <Link to="/patient/select-clinic">
          <Button>Browse Clinics</Button>
        </Link>
      </div>
    );
  }

  const currentStep = !selectedDoctor ? 1 : !selectedSlot ? 2 : 3;

  // Generate 30-minute time slots between start and end time
  const generateSlots = (startTime, endTime) => {
    const slots = [];
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    let cur = sh * 60 + sm;
    const end = eh * 60 + em;
    while (cur + 30 <= end) {
      const h = String(Math.floor(cur / 60)).padStart(2, '0');
      const m = String(cur % 60).padStart(2, '0');
      slots.push(`${h}:${m}`);
      cur += 30;
    }
    return slots;
  };

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchSlots = async (doctorUserId, date) => {
    if (!date || !doctorUserId) return;
    setSlotsLoading(true);
    try {
      // Get already-booked slots from backend
      const response = await axiosClient.get(`/appointments/slots?doctorId=${doctorUserId}&date=${date}`);
      const booked = response.data || [];

      // Figure out doctor's availability for this day-of-week
      const dayName = DAYS[new Date(date + 'T00:00:00').getDay()];
      const daySlot = selectedDoctor?.availability?.find(a => a.day === dayName);

      let allSlots;
      if (daySlot?.startTime && daySlot?.endTime) {
        allSlots = generateSlots(daySlot.startTime, daySlot.endTime);
      } else {
        // Default 9am-5pm if no availability configured
        allSlots = generateSlots('09:00', '17:00');
      }

      // Remove already-booked slots
      setAvailableSlots(allSlots.filter(s => !booked.includes(s)));
    } catch {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedSlot('');
    if (selectedDoctor) fetchSlots(selectedDoctor.user?._id || selectedDoctor._id, date);
  };

  const handleBook = async () => {
    setIsBooking(true);
    try {
      await axiosClient.post('/appointments/book', {
        clinicId,
        doctorId: selectedDoctor.user?._id || selectedDoctor._id,
        date: selectedDate,
        timeSlot: selectedSlot
      });
      addToast('Appointment booked successfully! 🎉', 'success');
      setSelectedDoctor(null); setSelectedDate(''); setAvailableSlots([]); setSelectedSlot('');
    } catch (error) {
      addToast(error.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const steps = ['Select Doctor', 'Pick Date & Time', 'Confirm'];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link to="/patient/select-clinic" style={{ color: '#64748b', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            All Clinics
          </Link>
          <span style={{ color: '#cbd5e1' }}>›</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f766e' }}>{clinicName}</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Book Appointment</h1>
      </div>

      {/* Step progress */}
      <div className="animate-fade-in-up stagger-1" style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        {steps.map((label, idx) => (
          <React.Fragment key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: currentStep >= idx + 1 ? 'linear-gradient(135deg, #0f766e, #14b8a6)' : '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: currentStep >= idx + 1 ? 'white' : '#94a3b8',
                fontWeight: 700, fontSize: '0.8rem',
                transition: 'all 0.3s ease', flexShrink: 0
              }}>
                {currentStep > idx + 1 ? '✓' : idx + 1}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: currentStep === idx + 1 ? 700 : 500, color: currentStep >= idx + 1 ? '#0f766e' : '#94a3b8', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', margin: '0 10px', background: currentStep > idx + 1 ? 'linear-gradient(90deg, #14b8a6, #06b6d4)' : '#e2e8f0', borderRadius: '1px', transition: 'background 0.3s ease' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {!selectedDoctor && (
        <div className="animate-fade-in-up">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '14px' }}>
            Available Doctors at {clinicName}
          </h2>
          {doctorsLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '150px', borderRadius: '14px' }} />)}
            </div>
          ) : doctors?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👨‍⚕️</div>
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No doctors available at this clinic yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {doctors?.map((profile, idx) => (
                <div key={profile._id} className={`animate-fade-in-up stagger-${idx + 1}`}
                  onClick={() => setSelectedDoctor(profile)}
                  style={{
                    background: 'white', borderRadius: '14px', padding: '20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
                    cursor: 'pointer', transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#99f6e4'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#3b82f6', fontWeight: 800, fontSize: '1.1rem'
                    }}>
                      {(profile.user?.name || 'D').charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>Dr. {profile.user?.name}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f766e', background: '#f0fdfa', padding: '2px 8px', borderRadius: '20px' }}>
                        {profile.specialization}
                      </span>
                    </div>
                  </div>
                  {profile.availability?.length > 0 && (
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Available {profile.availability.length} day{profile.availability.length !== 1 ? 's' : ''} a week
                    </p>
                  )}
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 600 }}>Select →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Date & Slot */}
      {selectedDoctor && (
        <div className="animate-fade-in-up" style={{
          background: 'white', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#3b82f6', fontWeight: 800, fontSize: '1.1rem'
              }}>
                {(selectedDoctor.user?.name || 'D').charAt(0)}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: '1rem' }}>Dr. {selectedDoctor.user?.name}</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedDoctor.specialization}</span>
              </div>
            </div>
            <Button variant="secondary" onClick={() => { setSelectedDoctor(null); setSelectedDate(''); setAvailableSlots([]); setSelectedSlot(''); }}>
              Change Doctor
            </Button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Select Date</label>
            <input type="date" value={selectedDate} onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#14b8a6'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {slotsLoading && <div className="skeleton" style={{ height: '80px', borderRadius: '10px', marginBottom: '16px' }} />}

          {selectedDate && !slotsLoading && (
            <div className="animate-fade-in-up" style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem', marginBottom: '10px' }}>Available Slots</h4>
              {availableSlots.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableSlots.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', border: '2px solid',
                        borderColor: selectedSlot === slot ? '#0f766e' : '#e2e8f0',
                        background: selectedSlot === slot ? 'linear-gradient(135deg, #0f766e, #14b8a6)' : 'white',
                        color: selectedSlot === slot ? 'white' : '#475569',
                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: 'inherit'
                      }}
                      onMouseEnter={e => { if (selectedSlot !== slot) e.currentTarget.style.borderColor = '#99f6e4'; }}
                      onMouseLeave={e => { if (selectedSlot !== slot) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>No slots available for this date.</p>
              )}
            </div>
          )}

          <Button onClick={handleBook} disabled={!selectedSlot} isLoading={isBooking} style={{ width: '100%' }}>
            {isBooking ? 'Booking...' : selectedSlot ? `Confirm — ${selectedSlot}` : 'Select a time slot'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;