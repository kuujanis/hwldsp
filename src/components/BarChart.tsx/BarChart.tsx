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
    <div style={{ width: '90%', fontFamily: 'sans-serif' }}>
      {data.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '12px',
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
              {item.value}
            </div>
          </div>
          <div
            style={{
              height: '6px',
              backgroundColor: '#e0e0e0',
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
