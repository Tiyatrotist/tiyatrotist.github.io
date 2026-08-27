import FullScreenDotBreaker from '@/components/FullScreenDotBreaker';
import CustomCursor from '@/components/CustomCursor';
import './fullscreen-breaker.css';

export default function NotFound() {
  return (
    <main style={{ backgroundColor: '#000000', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CustomCursor />
      <FullScreenDotBreaker />
    </main>
  );
}
