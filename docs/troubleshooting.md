# 🔧 Troubleshooting

This guide helps you resolve common issues with the application.

## Installation Issues

### Node.js Version Error

**Symptom:**
```
error engine Unsupported engine
```

**Solution:**
Update Node.js to version 18 or higher:
```bash
# Using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Dependency Installation Fails

**Symptom:**
```
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Permission Denied

**Symptom:**
```
npm ERR! EACCES permission denied
```

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use npx
npx vite
```

---

## Development Server Issues

### Port Already in Use

**Symptom:**
```
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Find process using port
lsof -i :5173

# Kill process
kill -9 <PID>

# Or let Vite use next port (automatic)
```

### Hot Reload Not Working

**Symptom:** Changes not reflecting in browser.

**Solution:**
1. Check if file is saved
2. Restart dev server: `npm run dev`
3. Clear browser cache: Ctrl+Shift+R
4. Check for syntax errors in terminal

### Blank Page

**Symptom:** Browser shows blank page.

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify `index.html` exists

---

## API Issues

### Rate Limit Exceeded (429)

**Symptom:**
```
Error: Too Many Requests (429)
```

**Solution:**
This is expected with Open-Meteo API. The app will:
1. Use cached data if available
2. Show "Data unavailable" if no cache
3. Retry after cache expires (30 min)

To reduce API calls:
- Increase cache duration in `services/api.ts`
- Reduce number of cities monitored

### Network Error

**Symptom:**
```
TypeError: Failed to fetch
```

**Solution:**
1. Check internet connection
2. Check if API endpoints are accessible:
   ```bash
   curl https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson
   ```
3. Check for CORS issues (shouldn't occur with these APIs)
4. Try disabling VPN/proxy

### No Disaster Data

**Symptom:** Map shows no markers.

**Possible causes:**
1. **No current disasters** - This can happen! Check:
   - [USGS Latest Earthquakes](https://earthquake.usgs.gov/earthquakes/map/)
   - [NASA EONET](https://eonet.gsfc.nasa.gov/)
   
2. **API down** - Check browser console for errors

3. **Filters active** - Make sure filters aren't hiding all types

---

## Display Issues

### Map Not Rendering

**Symptom:** Map area is blank or shows placeholder.

**Solution:**
1. Check browser console for SVG errors
2. Verify `RealWorldMap.tsx` has valid SVG data
3. Try hard refresh: Ctrl+Shift+R

### 3D Globe Not Loading

**Symptom:** Globe button does nothing or shows error.

**Solution:**
1. Check if Three.js is installed:
   ```bash
   npm ls three @react-three/fiber @react-three/drei
   ```
2. Reinstall if missing:
   ```bash
   npm install three @react-three/fiber @react-three/drei
   ```
3. Check browser WebGL support:
   - Visit [get.webgl.org](https://get.webgl.org/)

### Styling Broken

**Symptom:** No styles applied, plain HTML.

**Solution:**
1. Check if Tailwind is installed:
   ```bash
   npm ls tailwindcss @tailwindcss/vite
   ```
2. Verify `vite.config.ts` has Tailwind plugin:
   ```typescript
   import tailwindcss from '@tailwindcss/vite'
   export default defineConfig({
     plugins: [react(), tailwindcss()],
   })
   ```
3. Check `src/index.css` has Tailwind import:
   ```css
   @import "tailwindcss";
   ```

### Charts Not Rendering

**Symptom:** Disaster Trends shows empty charts.

**Solution:**
1. Check if Recharts is installed:
   ```bash
   npm ls recharts
   ```
2. Verify disaster data exists (check console.log)
3. Ensure chart container has dimensions

---

## Performance Issues

### Slow Initial Load

**Symptom:** App takes long to load initially.

**Solution:**
1. Build for production: `npm run build`
2. Enable lazy loading for heavy components:
   ```tsx
   const Globe3D = React.lazy(() => import('./Globe3D'));
   ```

### High Memory Usage

**Symptom:** Browser becomes slow over time.

**Solution:**
1. The 3D globe is memory-intensive - close when not needed
2. Reduce number of markers displayed
3. Increase refresh interval

### Laggy Map Interactions

**Symptom:** Map markers slow to respond.

**Solution:**
1. Reduce marker complexity
2. Use CSS transforms instead of SVG animations
3. Debounce hover events

---

## Build Issues

### TypeScript Errors

**Symptom:**
```
error TS2345: Argument of type X is not assignable...
```

**Solution:**
1. Read the error message carefully
2. Check types in `src/types/index.ts`
3. Run: `npx tsc --noEmit` to see all errors
4. Fix one file at a time

### Build Fails

**Symptom:**
```
npm run build fails with errors
```

**Solution:**
1. Fix all TypeScript errors first
2. Check for unused imports (ESLint warnings)
3. Verify all files are saved
4. Try: `rm -rf dist && npm run build`

### Large Bundle Size

**Symptom:** Build output is very large.

**Solution:**
1. Check bundle analysis:
   ```bash
   npx vite-bundle-visualizer
   ```
2. Lazy load heavy components
3. Use production build: `npm run build`

---

## Browser Compatibility

### Supported Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| IE | Any | ❌ Not supported |

### Safari-Specific Issues

**Backdrop filter not working:**
```css
/* Add webkit prefix */
-webkit-backdrop-filter: blur(20px);
backdrop-filter: blur(20px);
```

### Mobile Issues

**Touch interactions not working:**
- Make sure `onClick` handlers also handle `onTouchEnd`
- Check viewport meta tag in `index.html`

---

## Getting Help

### Check the Logs

Always check browser console (F12 → Console) for errors.

### Minimal Reproduction

If reporting a bug:
1. Identify the smallest steps to reproduce
2. Note your browser and OS
3. Include any error messages

### Open an Issue

[Create an issue](https://github.com/Dev-Lahrani/Live-weather-and-Natural-disaster-viewing-using-a-live-map/issues/new) with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Console error messages

---

## Quick Fixes Checklist

- [ ] Is Node.js 18+ installed?
- [ ] Did `npm install` complete successfully?
- [ ] Is the dev server running (`npm run dev`)?
- [ ] Are there errors in the browser console?
- [ ] Is your internet connection working?
- [ ] Have you tried clearing browser cache?
- [ ] Have you tried restarting the dev server?
