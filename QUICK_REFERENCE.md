# Quick Reference Guide

## Project Overview

### What Changed?
```
BEFORE: One 668-line index.html file
AFTER:  Organized, professional project structure
```

## File Navigation

### 📄 HTML Structure
**`index.html`** - Main webpage (75 lines)
- Clean semantic HTML
- Defines UI elements
- References external resources
- No logic or styles inside

### 🎨 Styling
**`src/css/styles.css`** - All CSS (9.8 KB)
- Theme variables at top
- Component styles organized
- Animations and transitions
- Responsive breakpoints

### 🔧 JavaScript Modules

| File | Purpose | Size |
|------|---------|------|
| `src/js/main.js` | App entry point & events | 1.2 KB |
| `src/js/calendar.js` | Calendar logic & methods | 7.6 KB |
| `src/js/data.js` | Calendar data | 13.4 KB |

### 📚 Documentation

| File | Contains |
|------|----------|
| `README.md` | Getting started, features, setup |
| `DEVELOPMENT.md` | Architecture, guidelines, debugging |
| `REFACTORING_SUMMARY.md` | Before/after analysis |
| `REFACTORING_CHECKLIST.md` | Completion verification |

### ⚙️ Configuration
- `package.json` - Project metadata & scripts
- `.gitignore` - Git configuration

## How to Use

### Starting the Project
```bash
# Option 1: Open directly
Open index.html in your browser

# Option 2: Use live server
npm install
npm start
```

### Adding Features

**Example: Add a "Share" Button**

1. **HTML** (`index.html`)
   ```html
   <button id="shareBtn" class="btn-ai">📤 Share</button>
   ```

2. **JavaScript** (`src/js/calendar.js`)
   ```javascript
   share() {
       const url = window.location.href;
       navigator.share?.({
           title: 'Maths Calendar',
           url: url
       });
   }
   ```

3. **Event** (`src/js/main.js`)
   ```javascript
   document.getElementById('shareBtn').addEventListener('click', () => {
       app.share();
   });
   ```

### File Organization Reference

```
Need to change...              Edit file...
─────────────────────────────────────────────
Colors or layout        →      src/css/styles.css
Calendar data/facts     →      src/js/data.js
Business logic          →      src/js/calendar.js
UI interactions         →      src/js/main.js
HTML structure          →      index.html
```

## Code Examples

### Accessing Data
```javascript
import { MONTHS, DATA } from './data.js';

const januaryData = DATA['january'];
console.log(januaryData.name);        // "January"
console.log(januaryData.facts[0]);    // First fact
```

### Using Calendar Class
```javascript
import { Calendar } from './calendar.js';

const cal = new Calendar();
cal.init();              // Initialize
cal.start();             // Show calendar
cal.renderMonth('march'); // Switch month
```

### Adding Styles
```css
/* Add to src/css/styles.css */
.my-new-component {
    background: var(--primary);      /* Use theme color */
    padding: 2rem;
    border-radius: 12px;
    transition: all 0.3s;            /* Smooth animation */
}

.my-new-component:hover {
    transform: scale(1.05);
    box-shadow: var(--glass-shadow);
}
```

## Common Tasks

### Change Theme Colors
Edit top of `src/css/styles.css`:
```css
:root {
    --primary: #6c5ce7;      /* Change this */
    --accent: #fdcb6e;       /* Or this */
    --text-dark: #2d3436;    /* Or this */
}
```

### Add New Month Data
Add to `DATA` object in `src/js/data.js`:
```javascript
export const DATA = {
    // ... existing months
    newmonth: {
        name: "New Month",
        math: "Mathematician Name",
        quote: "Inspirational quote",
        bg: "#color",
        offset: 0,
        days: 31,
        facts: [
            {t: "Title", q: "Question"},
        ]
    }
};
```

### Set Up Google Gemini API
In `src/js/calendar.js`:
```javascript
export class Calendar {
    constructor() {
        this.apiKey = "YOUR_ACTUAL_API_KEY";  // Get from makersuite.google.com
    }
}
```

## Performance Tips

✅ **Do:**
- Use CSS `transform` for animations
- Batch DOM updates
- Cache API responses
- Use `const` for immutable data

❌ **Avoid:**
- Multiple DOM reflows
- Direct CSS property changes
- Loading external fonts
- Large images without optimization

## Testing Checklist

Before pushing changes:
- [ ] All months render correctly
- [ ] Modal opens/closes smoothly
- [ ] Navigation works
- [ ] Page is responsive
- [ ] No console errors
- [ ] Animations are smooth
- [ ] Links work properly

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ iOS 13+ |

## Troubleshooting

**Problem**: Styles not loading
- Check: Is `index.html` in the root folder?
- Check: Does `src/css/styles.css` exist?
- Fix: Verify the path in `<link>` tag

**Problem**: JavaScript not running
- Check: Is `type="module"` on the script tag?
- Check: Are all imports correct?
- Fix: Open DevTools (F12) and check console

**Problem**: API not working
- Check: Is the API key valid?
- Check: Does the key have API limits?
- Fix: Generate new key from Google AI Studio

## Project Statistics

```
Total Files:           11
Total Code Lines:      ~2,200
Documentation:         4 guides
Modules:              3
CSS Lines:            470+
JavaScript Lines:     ~220
HTML Lines:           75
```

## Quick Links

- 📖 Full Documentation: See `README.md`
- 👨‍💻 For Developers: See `DEVELOPMENT.md`
- 📊 Refactoring Details: See `REFACTORING_SUMMARY.md`
- ✅ Completion Details: See `REFACTORING_CHECKLIST.md`

## Need Help?

1. **Setup Issues**: Check README.md Setup section
2. **Code Questions**: See DEVELOPMENT.md
3. **Adding Features**: See feature examples above
4. **Debugging**: See DEVELOPMENT.md Debugging section

---

**Professional Project Structure Ready for Development** 🚀
