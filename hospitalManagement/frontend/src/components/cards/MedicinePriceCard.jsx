import React from 'react';

const MedicinePriceCard = ({ medicineName, comparisons }) => {
  // Sort by price ascending so cheapest is first
  const sorted = comparisons ? [...comparisons].sort((a, b) => a.price - b.price) : [];
  const maxPrice = sorted.length > 0 ? sorted[sorted.length - 1].price : 1;

  return (
    <div className="animate-fade-in-up" style={{
      background: 'white', borderRadius: '16px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden',
      border: '1px solid #f1f5f9'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(15,118,110,0.05), rgba(99,102,241,0.05))',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3"/>
            </svg>
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', textTransform: 'capitalize', margin: 0 }}>
            {medicineName}
          </h4>
        </div>
      </div>
      
      {/* Price Bars */}
      <div style={{ padding: '20px 24px' }}>
        {sorted.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sorted.map((item, index) => {
              const barWidth = (item.price / maxPrice) * 100;
              const isCheapest = index === 0;
              return (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>{item.vendor}</span>
                      {isCheapest && (
                        <span style={{
                          padding: '1px 8px', borderRadius: '20px',
                          background: '#dcfce7', color: '#166534',
                          fontSize: '0.65rem', fontWeight: 700
                        }}>
                          ✓ Best Price
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontWeight: 700, fontSize: '0.95rem',
                      color: isCheapest ? '#059669' : '#1e293b'
                    }}>
                      ₹{item.price}
                    </span>
                  </div>
                  <div style={{
                    height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '4px', width: `${barWidth}%`,
                      background: isCheapest 
                        ? 'linear-gradient(90deg, #10b981, #34d399)' 
                        : 'linear-gradient(90deg, #6366f1, #818cf8)',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isCheapest ? '0 0 8px rgba(16,185,129,0.3)' : 'none'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
            No price data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicinePriceCard;