import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Proofline | The Evidence OS for AI-built software';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'black',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 'bold', marginBottom: '20px' }}>
          Proofline
        </div>
        <div style={{ fontSize: 48, color: '#a1a1aa' }}>
          The Evidence OS for AI-built software
        </div>
      </div>
    ),
    { ...size }
  );
}
