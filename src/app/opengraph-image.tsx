import { ImageResponse } from 'next/og';
export const alt = 'Autor Copilot — Escreva sua história. Conecte seu universo.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#fafaf7', padding: 80, flexDirection: 'column', justifyContent: 'center', color: '#292b29' }}><div style={{ fontSize: 24, color: '#356b55', marginBottom: 45 }}>AUTOR COPILOT · ESPAÇO PARA CRIAR</div><div style={{ fontSize: 67, letterSpacing: -3 }}>Escreva sua história.</div><div style={{ fontSize: 67, letterSpacing: -3, color: '#356b55' }}>Conecte seu universo.</div><div style={{ fontSize: 24, marginTop: 40, color: '#666b66' }}>Manuscrito, personagens e ideias no mesmo lugar.</div></div>, size);
}
