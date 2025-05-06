# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Performance Optimizations and User Preferences

### HyperSpeed Animation Management

The application includes an immersive HyperSpeed animation on the Search page for visual engagement. We've implemented several optimizations and user preference controls:

#### Performance Optimizations

- **Automatic Performance Detection**: The app automatically detects low-performance devices (mobile devices, low memory, or limited CPU cores) and adjusts animation complexity accordingly.
- **Lazy Loading**: The HyperSpeed component is lazy-loaded to improve initial load time.
- **Component Cleanup**: When the animation is dismissed, the component is fully unmounted after a brief fade-out to free up resources.
- **Instance Limiting**: We track animation instances to prevent memory leaks and force a page refresh if too many instances are created.
- **Adaptive Particle Count**: Lower-end devices receive a simplified version with fewer particles and effects.

#### User Preference Settings

Users can control the HyperSpeed animation in two ways:

1. **Via Support Menu**:
   - Click on "Support" in the navbar
   - Select "Settings"
   - Toggle "Skip HyperSpeed Animation" to disable/enable the animation on future visits

2. **Direct Control on Search Page**:
   - When HyperSpeed is hidden, a settings button appears next to the "Hyperspeed" reset button
   - This button toggles whether HyperSpeed should appear on future page loads

#### Technical Implementation

- **Persistent Storage**: User preferences are stored in `localStorage` under the key `disableHyperSpeed`
- **Real-time Response**: Changes to settings are applied immediately and persisted across browser sessions
- **Visual Feedback**: Toast notifications confirm when settings are changed
- **Graceful Degradation**: The application remains fully functional regardless of animation settings

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
