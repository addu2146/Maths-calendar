/**
 * Calendar Module
 * Core calendar functionality including rendering, modal handling, and user interactions
 */

export class Calendar {
    constructor({ data, months, apiKey = "", apiBase = "" } = {}) {
        this.data = data || {};
        this.months = months || Object.keys(data || {});
        this.currMonth = this.months[0] || "january";
        this.selectedDay = null;
        this.apiKey = apiKey;
        this.apiBase = apiBase;
        this._sparkleGlyphs = ['✨', '⭐', '💫', '🌟', '✦'];
        this._confettiEmojis = ['🎉', '🎊', '🥳', '🎈', '🎁', '⭐', '💖', '🌈', '🦄', '🍭'];
        this._konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this._konamiIndex = 0;
        this._clickCount = 0;
        this._partyMode = false;
        this._initEasterEggs();
    }

    /** Replace dataset (useful after fetching from backend) */
    setData({ data, months }) {
        if (data) this.data = data;
        if (months && months.length) this.months = months;
        if (!this.currMonth && this.months.length) this.currMonth = this.months[0];
    }

    /**
     * Initialize calendar by spawning floating background shapes
     */
    init() {
        this.spawnShapes();
    }

    /**
     * Spawn animated floating mathematical symbols
     */
    spawnShapes() {
        const container = document.getElementById('bgShapes');
        const symbols = ['π', '∞', '∑', '√', '∫', '≠', '≈', '∆', '1', '2', '3'];
        for (let i = 0; i < 20; i++) {
            const el = document.createElement('div');
            el.className = 'shape';
            el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            el.style.left = Math.random() * 100 + '%';
            el.style.animationDuration = (Math.random() * 10 + 10) + 's';
            el.style.animationDelay = (Math.random() * 5) + 's';
            container.appendChild(el);
        }
    }

    /**
     * Start the calendar app - hide intro, show main interface
     */
    start() {
        document.getElementById('introScreen').classList.add('hidden');
        document.getElementById('appMain').classList.remove('hidden');
        this.renderNav();
        this.renderMonth(this.currMonth || 'january');
    }

    /**
     * Render navigation buttons for all months
     */
    renderNav() {
        const nav = document.getElementById('monthNav');
        nav.innerHTML = this.months.map(m =>
            `<button class="nav-btn ${m === this.currMonth ? 'active' : ''}" data-month="${m}">${m.substring(0, 3).toUpperCase()}</button>`
        ).join('');

        // Add event listeners to nav buttons
        nav.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.renderMonth(btn.getAttribute('data-month'));
            });
        });
    }

    /**
     * Render a specific month's calendar
     * @param {string} monthName - Name of the month to render
     */
    renderMonth(monthName) {
        this.currMonth = monthName;
        const d = this.data[monthName];
        if (!d) return;

        // Update active button
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-month="${monthName}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Update Header
        const header = document.getElementById('calHeader');
        header.style.background = d.bg || "linear-gradient(135deg, #6c5ce7, #a29bfe)";
        document.getElementById('monthTitle').innerText = d.name;
        document.getElementById('monthMathematician').innerText = d.math;
        document.getElementById('monthQuote').innerText = `"${d.quote}"`;

        // Render Grid
        this.renderGrid(d);
    }

    /**
     * Render the calendar grid with day cards
     * @param {Object} monthData - Data object for the current month
     */
    renderGrid(monthData) {
        const grid = document.getElementById('calGrid');
        grid.innerHTML = '';

        // Day headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const header = document.createElement('div');
            header.className = 'day-header';
            header.innerText = day;
            grid.appendChild(header);
        });

        // Empty cells for offset
        for (let i = 0; i < monthData.offset; i++) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'day-card empty';
            grid.appendChild(emptyCard);
        }

        // Day cards with staggered bounce animation
        for (let i = 1; i <= monthData.days; i++) {
            const fact = this.getFactForDay(monthData, i);

            const card = document.createElement('div');
            card.className = 'day-card';
            card.innerHTML = `
                <div class="day-num">${i}</div>
                <div class="day-preview">${fact.t}</div>
            `;
            
            // Staggered bounce entrance animation
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.opacity = '1';
                card.classList.add('bounce');
                setTimeout(() => card.classList.remove('bounce'), 600);
            }, (i + monthData.offset) * 30);
            
            card.addEventListener('click', (e) => {
                this.createSparkle(e.clientX, e.clientY);
                card.classList.add('wiggle');
                setTimeout(() => card.classList.remove('wiggle'), 500);
                this.openModal(i, fact);
            });
            
            // Fun hover sound effect (visual feedback)
            card.addEventListener('mouseenter', () => {
                if (this._partyMode) {
                    card.classList.add('pulse-glow');
                }
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('pulse-glow');
            });
            
            grid.appendChild(card);
        }
    }

    /**
     * Determine the fact for a given day using curated data when available,
     * otherwise generate a thematic prompt to keep months consistent.
     */
    getFactForDay(monthData, day) {
        if (monthData.facts && monthData.facts[day - 1]) {
            return monthData.facts[day - 1];
        }
        return this.buildGeneratedFact(monthData, day);
    }

    /**
     * Generate a professional, concise prompt for months without curated entries.
     */
    buildGeneratedFact(monthData, day) {
        const theme = monthData.theme || 'Mathematics';
        const mathematician = monthData.math || 'a mathematician';
        return {
            t: `${theme} • Day ${day}`,
            q: `Illustrate a ${theme.toLowerCase()} idea inspired by ${mathematician}. Use a clear example suitable for senior students.`
        };
    }

    /**
     * Create a sparkle animation at a specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    createSparkle(x, y) {
        // Create multiple sparkles for more fun!
        const count = this._partyMode ? 8 : 3;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const s = document.createElement('div');
                s.className = 'sparkle';
                s.innerText = this._sparkleGlyphs[Math.floor(Math.random() * this._sparkleGlyphs.length)];
                s.style.left = (x + (Math.random() - 0.5) * 50) + 'px';
                s.style.top = (y + (Math.random() - 0.5) * 50) + 'px';
                document.body.appendChild(s);
                setTimeout(() => s.remove(), 800);
            }, i * 50);
        }
        
        // Confetti explosion!
        this._createConfetti(x, y);
        
        // Track clicks for secret
        this._clickCount++;
        if (this._clickCount === 10) {
            this._showFloatingEmoji(x, y, '🎯');
        } else if (this._clickCount === 50) {
            this._showSecretMessage('🏆 Super Explorer!', 'You clicked 50 times! You really love math!');
        } else if (this._clickCount === 100) {
            this._activatePartyMode();
        }
    }
    
    /**
     * Create confetti explosion
     */
    _createConfetti(x, y) {
        const count = this._partyMode ? 15 : 5;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const c = document.createElement('div');
                c.className = 'confetti';
                c.innerText = this._confettiEmojis[Math.floor(Math.random() * this._confettiEmojis.length)];
                c.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
                c.style.top = y + 'px';
                c.style.animationDuration = (1.5 + Math.random()) + 's';
                document.body.appendChild(c);
                setTimeout(() => c.remove(), 2000);
            }, i * 30);
        }
    }
    
    /**
     * Show floating emoji
     */
    _showFloatingEmoji(x, y, emoji) {
        const e = document.createElement('div');
        e.className = 'floating-emoji';
        e.innerText = emoji;
        e.style.left = x + 'px';
        e.style.top = y + 'px';
        document.body.appendChild(e);
        setTimeout(() => e.remove(), 3000);
    }
    
    /**
     * Initialize easter eggs
     */
    _initEasterEggs() {
        // Konami code listener
        document.addEventListener('keydown', (e) => this._checkKonamiCode(e));
        
        // Triple-click title for rainbow mode
        document.addEventListener('DOMContentLoaded', () => {
            const title = document.querySelector('.hero-title');
            if (title) {
                let clicks = 0;
                title.addEventListener('click', () => {
                    clicks++;
                    title.classList.add('wiggle');
                    setTimeout(() => title.classList.remove('wiggle'), 500);
                    if (clicks >= 3) {
                        document.body.classList.toggle('rainbow-mode');
                        this._showFloatingEmoji(window.innerWidth / 2, window.innerHeight / 2, '🌈');
                        clicks = 0;
                    }
                    setTimeout(() => clicks = 0, 1000);
                });
            }
        });
    }
    
    /**
     * Check for Konami code input
     */
    _checkKonamiCode(e) {
        const key = e.key;
        if (key === this._konamiCode[this._konamiIndex]) {
            this._konamiIndex++;
            if (this._konamiIndex === this._konamiCode.length) {
                this._activateDiscoMode();
                this._konamiIndex = 0;
            }
        } else {
            this._konamiIndex = 0;
        }
    }
    
    /**
     * Activate disco mode easter egg
     */
    _activateDiscoMode() {
        document.body.classList.add('disco-mode');
        this._showSecretMessage('🕺 DISCO MODE! 💃', 'You found the secret Konami code!');
        
        // Spawn lots of emojis
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this._showFloatingEmoji(
                    Math.random() * window.innerWidth,
                    window.innerHeight,
                    this._confettiEmojis[Math.floor(Math.random() * this._confettiEmojis.length)]
                );
            }, i * 100);
        }
        
        setTimeout(() => document.body.classList.remove('disco-mode'), 5000);
    }
    
    /**
     * Activate party mode
     */
    _activatePartyMode() {
        this._partyMode = true;
        document.body.classList.add('party-mode');
        this._showSecretMessage('🎉 PARTY MODE UNLOCKED! 🎉', '100 clicks! You are a math champion!');
        
        // Make all day cards bounce
        document.querySelectorAll('.day-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('bounce'), i * 50);
        });
    }
    
    /**
     * Show secret message popup
     */
    _showSecretMessage(title, message) {
        const existing = document.querySelector('.secret-message');
        if (existing) existing.remove();
        
        const popup = document.createElement('div');
        popup.className = 'secret-message';
        popup.innerHTML = `<h2>${title}</h2><p>${message}</p><p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">Click anywhere to close</p>`;
        document.body.appendChild(popup);
        
        popup.addEventListener('click', () => {
            popup.style.animation = 'popIn 0.3s ease reverse';
            setTimeout(() => popup.remove(), 300);
        });
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.style.animation = 'popIn 0.3s ease reverse';
                setTimeout(() => popup.remove(), 300);
            }
        }, 5000);
    }

    /**
     * Open modal with day details
     * @param {number} day - Day of month
     * @param {Object} fact - Fact object with topic and question
     */
    openModal(day, fact) {
        this.selectedDay = { day, fact };
        document.getElementById('modalDate').innerText = `${this.currMonth.toUpperCase().substring(0, 3)} ${day}`;
        document.getElementById('modalTopic').innerText = fact.t;
        document.getElementById('modalQuestion').innerText = fact.q;
        document.getElementById('aiOutput').innerText = "Select an option to generate an explanation.";
        document.getElementById('modal').classList.add('active');
    }

    /**
     * Close the modal
     */
    closeModal() {
        document.getElementById('modal').classList.remove('active');
    }

    /**
     * Query Gemini API for AI responses
     * @param {string} type - Type of query: 'explain' or 'fact'
     */
    async askGemini(type) {
        const out = document.getElementById('aiOutput');
        out.innerHTML = "Processing...";

        const m = this.currMonth;
        const d = this.selectedDay.day;
        const topic = this.selectedDay.fact.t;

        const prompt = this.buildPrompt(type, topic, d, m);

        // Prefer backend proxy when available so keys remain server-side
        if (this.apiBase) {
            try {
                const resp = await fetch(`${this.apiBase}/gemini`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, topic, day: d, month: m, prompt })
                });
                if (resp.ok) {
                    const payload = await resp.json();
                    out.innerText = payload.content || 'No response received.';
                    if (!payload.live && payload.fallbackReason) {
                        out.innerHTML = `<strong>Offline mode:</strong> ${payload.content}`;
                    }
                    return;
                }
            } catch (err) {
                console.warn('Backend Gemini proxy unavailable. Falling back to client key.', err);
            }
        }

        if (!this.apiKey) {
            setTimeout(() => {
                out.innerHTML = "<strong>(Demo Mode):</strong> Provide an API key or enable the backend proxy to fetch live explanations. Draft your own 3-4 sentence summary for " + topic + ".";
            }, 400);
            return;
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            out.innerText = data.candidates[0].content.parts[0].text;
        } catch (e) {
            out.innerText = "Oops! The Genie is sleeping (Error connecting to AI).";
        }
    }

    buildPrompt(type, topic, day, month) {
        if (type === 'explain') {
            return `Provide a concise explanation of "${topic}" suitable for advanced high-school students (Day ${day}, Month ${month}). Include one worked example.`;
        }
        return `Share a brief historical or contextual note about the topic "${topic}" (Month ${month}, Day ${day}). Keep it rigorous yet accessible.`;
    }
}
