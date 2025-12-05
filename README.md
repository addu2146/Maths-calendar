# Maths Calendar 📅✨

An interactive, beautifully designed mathematical calendar featuring daily facts, educational concepts, and AI-powered explanations. Built with vanilla JavaScript and modern ES6 modules for clarity and maintainability.

## Features

- 🎨 **Vibrant UI**: Glassmorphism design with smooth animations
- 📊 **Interactive Calendar**: Month navigation with 365 days of mathematical facts
- 🧮 **Daily Facts**: Curated mathematical concepts and historical facts
- 🤖 **AI Integration**: Google Gemini API support for personalized explanations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✨ **Engaging Animations**: Floating shapes, sparkles, and smooth transitions
- 🎯 **Modular Architecture**: Clean separation of concerns for easy maintenance

## Project Structure

```
Maths-calendar/
├── index.html              # Main HTML entry point
├── package.json            # Project metadata and dependencies
├── README.md               # This file
├── src/
│   ├── css/
│   │   └── styles.css      # Centralized styling
│   └── js/
│       ├── main.js         # Application entry point & event handlers
│       ├── calendar.js     # Calendar class & core logic
│       └── data.js         # Calendar data (months, facts, quotes)
```

### Module Descriptions

#### `src/css/styles.css`
Comprehensive stylesheet with organized sections:
- CSS Variables for theming
- Layout and component styles
- Animations and transitions
- Responsive design rules

#### `src/js/data.js`
Centralized data module containing:
- Month list and calendar data for all 12 months
- Mathematical facts for January, February, March, April
- Mathematician names and inspirational quotes
- Fallback themes for months with minimal data

#### `src/js/calendar.js`
Core Calendar class with methods:
- `init()` - Initialize floating shapes
- `start()` - Transition from intro to calendar
- `renderNav()` - Generate month navigation
- `renderMonth(name)` - Render specific month's calendar
- `renderGrid(data)` - Build day grid with cards
- `openModal(day, fact)` - Display day details
- `closeModal()` - Hide modal
- `askGemini(type)` - Query AI for explanations/facts
- `createSparkle(x, y)` - Animate sparkle effects

#### `src/js/main.js`
Application entry point:
- Instantiates the Calendar class
- Sets up all DOM event listeners
- Handles button clicks and user interactions

## Setup & Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for development server)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/addu2146/Maths-calendar.git
   cd Maths-calendar
   ```

2. **Open locally**
   - Option A: Double-click `index.html` to open in browser
   - Option B: Use a local server for better development experience

3. **Using Live Server (Recommended)**
   ```bash
   npm install
   npm start
   ```
   This will open the app at `http://localhost:8080`

## Configuration

### Adding Gemini API Support

To enable AI-powered explanations:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. In `src/js/calendar.js`, update the `apiKey` property:
   ```javascript
   this.apiKey = "YOUR_API_KEY_HERE";
   ```

> **Security Note**: For production, use environment variables or a backend service instead of hardcoding API keys.

## Customization

### Add/Modify Monthly Data

Edit `src/js/data.js` to add facts for additional months:

```javascript
may: {
    name: "May",
    math: "Mathematician Name",
    quote: "Inspirational quote",
    bg: "gradient-or-color",
    offset: 4,     // Day of week for 1st (0=Sun, 6=Sat)
    days: 31,
    facts: [
        {t: "Fact title", q: "Discussion question"},
        // ... more facts
    ]
}
```

### Customize Colors

Update CSS variables in `src/css/styles.css`:

```css
:root {
    --primary: #6c5ce7;    /* Main color */
    --accent: #fdcb6e;     /* Highlight color */
    --text-dark: #2d3436;  /* Dark text */
    --font-playful: 'Comic Sans MS', ...;
}
```

## Development

### Adding New Features

1. **New UI Component**: Add styles to `src/css/styles.css`
2. **New Logic**: Create methods in the `Calendar` class (`src/js/calendar.js`)
3. **New Data**: Extend `DATA` object in `src/js/data.js`
4. **Event Handlers**: Register listeners in `src/js/main.js`

### Best Practices

- Keep HTML structure simple; use JavaScript for dynamic content
- Use ES6 modules for code organization
- Comment complex functions and logic
- Test changes across different browsers and screen sizes
- Use CSS variables for consistent theming

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 13+)
- IE 11: ⚠️ Limited (no ES6 modules)

## Performance Tips

- SVG shapes use CSS animations for smooth 60fps performance
- Modal transitions use GPU acceleration (`transform` properties)
- Grid layout is optimized for responsive breakpoints
- Lazy-load API responses to avoid blocking UI

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CSS not loading | Check file path in `<link>` tag; verify relative paths |
| JS not running | Ensure `index.html` uses `type="module"` for `<script>` tag |
| API not responding | Verify API key is valid; check CORS settings in browser console |
| Grid looks broken | Check viewport meta tag in HTML; test responsive breakpoint |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for educational purposes

## Acknowledgments

- **Mathematicians Featured**: Ramanujan, Aryabhata, Bhaskara II, Shakuntala Devi, and others
- **Design Inspiration**: Modern glassmorphism UI trends
- **AI Integration**: Google Gemini API

## Contact

For questions or suggestions, reach out to the Junior Ramanujan Maths Club

---

**Last Updated**: December 2025  
**Version**: 1.0.0
