import React from 'react';
import { render } from '@testing-library/react';
import BreathingRingBackground from './BreathingRingBackground';

describe('BreathingRingBackground', () => {
  test('renders without crashing', () => {
    const { container } = render(<BreathingRingBackground />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('has correct background styling', () => {
    const { container } = render(<BreathingRingBackground />);
    const backgroundElement = container.firstChild;
    
    expect(backgroundElement).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: '#000',
      zIndex: '-1'
    });
  });

  test('contains ring elements', () => {
    const { container } = render(<BreathingRingBackground />);
    const rings = container.querySelectorAll('[class*="Ring"]');
    expect(rings.length).toBeGreaterThan(0);
  });
}); 