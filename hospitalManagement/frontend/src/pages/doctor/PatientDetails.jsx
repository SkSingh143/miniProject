import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Button from '../../components/common/Button';

const PatientDetails = () => {
  const { patientId } = useParams();
  const { data, loading, error } = useFetch(`/doctor/patient/${patientId}`);

  const patient = data?.patient;
  const prescriptions = data?.pastPrescriptions || [];

  if (loading) {
    return (
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="skeleton" style={{ height: '140px', borderRadius: '16px', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '200px', borderRadius: '16px' }} />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
        <p style={{ color: '#94a3b8' }}>Patient not found.</p>
        <Link to="/doctor/appointments" style={{ marginTop: '12px', display: 'inline-block' }}>
          <Button variant="secondary">Back to Appointments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      {/* Back */}
      <Link to="/doctor/appointments" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#64748b', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '16px'
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Appointments
      </Link>

      {/* Patient Info Card */}
      <div className="animate-fade-in-up" style={{
        background: 'white', borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        overflow: 'hidden', marginBottom: '16px'
      }}>
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(99,102,241,0.06))',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '1.6rem',
            boxShadow: '0 4px 14px rgba(59,130,246,0.35)'
          }}>
            {patient.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{patient.name}</h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
              {patient.email}
            </p>
          </div>
        </div>

        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Name', value: patient.name },
            { label: 'Email', value: patient.email },
            { label: 'Prescriptions by You', value: prescriptions.length },
          ].map((item, i) => (
            <div key={i}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
                {item.label}
              </p>
              <p style={{ fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prescription History */}
      <div className="animate-fade-in-up stagger-1" style={{
        background: 'white', borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden'
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Your Prescriptions for this Patient <span style={{ color: '#94a3b8', fontWeight: 500 }}>({prescriptions.length})</span>
          </h2>
        </div>

        {prescriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</div>
            <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>No prescriptions issued to this patient yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {prescriptions.map((rx, idx) => (
              <div key={rx._id} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
                padding: '16px 24px', borderBottom: idx < prescriptions.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1e293b', margin: '0 0 4px', fontSize: '0.92rem' }}>
                      {rx.diagnosis}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                      {rx.medicines?.length} medicine{rx.medicines?.length !== 1 ? 's' : ''} prescribed
                      {rx.appointment?.date && (
                        <span> • {new Date(rx.appointment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      )}
                    </p>

                    {/* Medicine chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {rx.medicines?.slice(0, 4).map((m, mi) => (
                        <span key={mi} style={{
                          padding: '2px 10px', borderRadius: '20px',
                          background: '#f0fdfa', border: '1px solid #99f6e4',
                          fontSize: '0.73rem', fontWeight: 600, color: '#0f766e'
                        }}>
                          {m.name}
                        </span>
                      ))}
                      {rx.medicines?.length > 4 && (
                        <span style={{ fontSize: '0.73rem', color: '#94a3b8', padding: '2px 0' }}>
                          +{rx.medicines.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(rx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
