import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const CreatePrescription = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);

  const appointmentId = searchParams.get('aptId');
  const patientId = searchParams.get('patientId');

  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosClient.post(API_ENDPOINTS.DOCTOR.PRESCRIPTIONS, {
        appointmentId, patientId, diagnosis, medicines, notes
      });
      addToast('Prescription saved successfully', 'success');
      navigate('/doctor/appointments');
    } catch (error) {
      addToast('Failed to save prescription', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{
        background: 'white', borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Create Prescription</h1>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>Fill in the prescription details below</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {/* Diagnosis */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Diagnosis <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea 
              rows="3"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              placeholder="Enter patient diagnosis..."
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                border: '2px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit',
                outline: 'none', transition: 'all 0.2s ease', resize: 'vertical',
                minHeight: '80px'
              }}
              onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Medicines */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                Medicines ({medicines.length})
              </h3>
              <Button type="button" variant="ghost" onClick={addMedicine}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
              >
                Add Medicine
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {medicines.map((med, index) => (
                <div key={index} className="animate-fade-in-up" style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: '8px', padding: '14px', borderRadius: '12px',
                  background: '#f8fafc', border: '1px solid #f1f5f9',
                  alignItems: 'center'
                }}>
                  <input 
                    placeholder="Medicine Name" 
                    value={med.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    required
                    style={{
                      padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = '#818cf8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <input 
                    placeholder="Dosage (1-0-1)" 
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    required
                    style={{
                      padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = '#818cf8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <input 
                    placeholder="Duration (5 days)" 
                    value={med.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    required
                    style={{
                      padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = '#818cf8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    disabled={medicines.length === 1}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                      background: medicines.length === 1 ? '#f1f5f9' : '#fee2e2',
                      color: medicines.length === 1 ? '#cbd5e1' : '#dc2626',
                      cursor: medicines.length === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease', flexShrink: 0
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Additional Notes
            </label>
            <textarea 
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or instructions..."
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                border: '2px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit',
                outline: 'none', transition: 'all 0.2s ease', resize: 'vertical'
              }}
              onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full" style={{ width: '100%' }}>
            {isSubmitting ? 'Saving...' : 'Save & Issue Prescription'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescription;