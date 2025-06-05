import React from 'react';

interface Item {
  label: string;
  value: number;
  color: string;
  maxValue: number;
}

interface BarListProps {
  data: Item[];
}

export const BarList: React.FC<BarListProps> = ({ data }) => {
  return (
    <div style={{ width: '90%', fontFamily: 'sans-serif', marginTop: '10px', padding: '10px' }}>
      {data.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '2px',
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                backgroundColor: item.color,
                borderRadius: '100%',
              }}
            />
            <div
              style={{
                flexGrow: 1,
                wordBreak: 'break-word',
                fontSize: '14px',
              }}
            >
              {item.label}
            </div>
            <div style={{ fontSize: '14px'}}>
              {(item.value/10000).toFixed(2)} га
            </div>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: '#4f4f4f',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(item.value / item.maxValue) * 100}%`,
                backgroundColor: item.color,
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
