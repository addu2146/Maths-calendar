# Development Guide

This guide provides detailed information for developers working on the Maths Calendar project.

## Architecture Overview

The project follows a modular architecture with clear separation of concerns:

```
User Interface (index.html)
        ↓
Event Handlers (main.js)
        ↓
Calendar Class (calendar.js)
        ↓
Data Layer (data.js)
        ↓
Styling (styles.css)
```

## Module Dependencies

- **main.js** → imports `Calendar` from `calendar.js`
- **calendar.js** → imports `MONTHS, DATA` from `data.js`
- **data.js** → no dependencies (data-only module)
- **styles.css** → imported in `index.html` (no JS dependencies)

## Code Organization Principles

### 1. Single Responsibility
Each module has one clear purpose:
- `data.js`: Store data
- `calendar.js`: Business logic
- `main.js`: UI coordination
- `styles.css`: Visual presentation

### 2. ES6 Modules
All JavaScript files use ES6 `import`/`export`:
```javascript
// Export
export class Calendar { /* ... */ }
export const MONTHS = [ /* ... */ ]

// Import
import { Calendar } from './calendar.js';
import { MONTHS, DATA } from './data.js';
```

### 3. Class-Based Design
The `Calendar` class encapsulates all application state and methods:
```javascript
class Calendar {
    constructor() {
        this.currMonth = "january";
        this.selectedDay = null;
    }
    
    // Public methods
    init() { /* ... */ }
    renderMonth(name) { /* ... */ }
}
```

## Adding New Features

### Example: Add a Favorites Feature

1. **Update HTML** (`index.html`)
   ```html
   <button id="favBtn" class="btn-ai">❤️ Add to Favorites</button>
   ```

2. **Extend Calendar Class** (`calendar.js`)
   ```javascript
   constructor() {
       this.currMonth = "january";
       this.selectedDay = null;
       this.favorites = [];  // NEW
   }

   addToFavorites(day) {  // NEW METHOD
       this.favorites.push({
           month: this.currMonth,
           day: day
       });
       localStorage.setItem('favorites', JSON.stringify(this.favorites));
   }
   ```

3. **Add Styles** (`styles.css`)
   ```css
   .btn-favorite.active {
       background: #ff6b6b;
   }
   ```

4. **Wire Up Events** (`main.js`)
   ```javascript
   document.getElementById('favBtn').addEventListener('click', () => {
       app.addToFavorites(app.selectedDay.day);
   });
   ```

## Performance Considerations

### CSS Animations
Use `transform` and `opacity` for GPU acceleration:
```css
/* ✅ Good - GPU accelerated */
.element {
    transform: translateY(-10px);
    opacity: 0.8;
}

/* ❌ Avoid - CPU intensive */
.element {
    top: -10px;
    color: rgba(0,0,0,0.2);
}
```

### DOM Operations
Minimize reflows by batching updates:
```javascript
// ❌ Bad - multiple reflows
for (let i = 0; i < 10; i++) {
    element.appendChild(child);  // Reflow each iteration
}

// ✅ Good - single reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
    fragment.appendChild(child);
}
element.appendChild(fragment);
```

### Data Fetching
Cache API responses when appropriate:
```javascript
async askGemini(type) {
    // Check cache first
    const cacheKey = `${this.currMonth}_${this.selectedDay.day}_${type}`;
    if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
    }
    
    // Fetch and cache
    const response = await fetch(/* ... */);
    this.cache[cacheKey] = response;
    return response;
}
```

## Testing

### Manual Testing Checklist
- [ ] All months render correctly
- [ ] Day cards show correct facts
- [ ] Modal opens/closes smoothly
- [ ] Navigation buttons highlight properly
- [ ] Responsive design works on mobile
- [ ] Animations are smooth (60fps)
- [ ] API calls work (with valid key)

### Browser Testing
Test on multiple browsers:
```
Chrome/Edge (Chromium)
Firefox
Safari
Mobile Chrome
Mobile Safari
```

## Debugging

### Enable Debug Mode
Add to `calendar.js`:
```javascript
const DEBUG = true;

if (DEBUG) {
    console.log('Calendar initialized', this);
    console.log('Current month:', this.currMonth);
}
```

### Common Issues

**Issue: Modal won't open**
- Check if `openModal()` is being called
- Verify modal HTML IDs match JavaScript selectors
- Check browser console for JavaScript errors

**Issue: Styles not applying**
- Verify CSS file path in `<link>` tag
- Check CSS specificity conflicts
- Use browser DevTools to inspect element styles

**Issue: API not responding**
- Verify API key is valid and not revoked
- Check browser network tab for API request
- Verify CORS headers in response
- Check API rate limits

## Version Control

### Commit Message Format
```
feat: Add feature description
fix: Fix bug description
docs: Update documentation
refactor: Code cleanup
style: CSS/formatting changes
test: Add/update tests
```

### Branching Strategy
```
main (production)
├── develop (staging)
└── feature/your-feature (development)
```

## Deployment

### Local Testing Before Deployment
```bash
npm start
# Test all features
# Verify responsive design
# Check performance
```

### Build Optimization
Since this is a static site:
1. Minify CSS and JS for production
2. Optimize images
3. Enable gzip compression on server
4. Set appropriate cache headers

### Environment Variables
Store sensitive data (API keys) using:
- Environment variables
- Backend API endpoint
- Secure token exchange

Never commit API keys to version control!

## Resources

- [MDN JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [CSS Variables Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Google Gemini API Docs](https://ai.google.dev/)
- [ES6 Class Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

## Support

For questions or issues, refer to the main README.md or create an issue on GitHub.
