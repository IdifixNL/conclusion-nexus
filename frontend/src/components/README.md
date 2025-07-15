# Breathing Ring Background Component

A beautiful animated background component featuring concentric rings that breathe and wiggle, inspired by Conclusion's logo design.

## Features

- **Breathing Animation**: Rings scale from 100% to 107% over 12 seconds with ease-in-out timing
- **Independent Wiggle**: Each ring has its own wiggle animation with different phases
- **Hue Shift**: Subtle color shift across all rings over 20 seconds
- **GPU Optimized**: Uses CSS transforms for smooth 60fps performance
- **Responsive**: Stays centered and scaled on window resize
- **Accessible**: Respects `prefers-reduced-motion` media query

## Installation

The component is already included in the project. No additional dependencies required.

## Usage

```jsx
import BreathingRingBackground from './BreathingRingBackground';

function LoginPage() {
  return (
    <>
      <BreathingRingBackground />
      {/* Your login form content */}
    </>
  );
}
```

## Animation Specifications

- **Breathing Duration**: 12 seconds (ease-in-out)
- **Scale Range**: 100% → 107% → 100%
- **Wiggle Amplitude**: ±2px movement
- **Hue Shift**: ±8° over 20 seconds
- **Frame Rate**: 60fps
- **Background**: Black (#000)

## Ring Colors

1. **Ring 1** (200px): #E31E54 (Pink)
2. **Ring 2** (300px): #3B82F6 (Blue)
3. **Ring 3** (400px): #10B981 (Green)
4. **Ring 4** (500px): #F59E0B (Orange)
5. **Ring 5** (600px): #8B5CF6 (Purple)

## Testing

Run the test suite:

```bash
npm test BreathingRingBackground.test.js
```

## Performance

- Uses CSS animations for GPU acceleration
- Minimal DOM elements (5 rings + container)
- No JavaScript animation loops
- Optimized for mobile devices

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

To modify the animation:

1. **Speed**: Change the duration values in the keyframes
2. **Scale**: Adjust the scale percentage in the `breathe` animation
3. **Colors**: Modify the `border-color` in each Ring component
4. **Wiggle**: Adjust the translate values in wiggle animations
5. **Hue Shift**: Change the `hue-rotate` values in `hueShift` animation 