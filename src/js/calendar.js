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
        
        // Progress tracking
        this._progress = this._loadProgress();
        this._initEasterEggs();
    }

    /** Load progress from localStorage */
    _loadProgress() {
        try {
            const saved = localStorage.getItem('mathCalendarProgress');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load progress:', e);
        }
        return { completed: {}, streak: 0, lastDate: null, totalCorrect: 0 };
    }

    /** Save progress to localStorage */
    _saveProgress() {
        try {
            localStorage.setItem('mathCalendarProgress', JSON.stringify(this._progress));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    }

    /** Mark a day as completed */
    _markCompleted(month, day) {
        const key = `${month}-${day}`;
        if (!this._progress.completed[key]) {
            this._progress.completed[key] = true;
            this._progress.totalCorrect++;
            
            // Update streak
            const today = new Date().toDateString();
            if (this._progress.lastDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (this._progress.lastDate === yesterday.toDateString()) {
                    this._progress.streak++;
                } else if (this._progress.lastDate !== today) {
                    this._progress.streak = 1;
                }
                this._progress.lastDate = today;
            }
            
            this._saveProgress();
            this._updateProgressUI();
            
            // Update day card visual
            const cards = document.querySelectorAll('.day-card:not(.empty)');
            if (cards[day - 1]) {
                cards[day - 1].classList.add('completed');
            }
        }
    }

    /** Check if a day is completed */
    _isCompleted(month, day) {
        return this._progress.completed[`${month}-${day}`] || false;
    }

    /** Update the progress UI */
    _updateProgressUI() {
        const totalDays = this._getTotalDays();
        const completed = Object.keys(this._progress.completed).length;
        const percentage = totalDays > 0 ? (completed / totalDays) * 100 : 0;
        
        const statsEl = document.getElementById('progressStats');
        const fillEl = document.getElementById('progressFill');
        const streakEl = document.getElementById('progressStreak');
        
        if (statsEl) statsEl.textContent = `${completed}/${totalDays}`;
        if (fillEl) fillEl.style.width = `${percentage}%`;
        if (streakEl) streakEl.textContent = `🔥 Streak: ${this._progress.streak}`;
        
        // Celebration for milestones
        if (completed === 10) {
            this._showCelebration('🌟 10 Problems Solved!');
        } else if (completed === 25) {
            this._showCelebration('🏆 25 Problems! Math Star!');
        } else if (completed === 50) {
            this._showCelebration('🎯 50 Problems! Amazing!');
        } else if (completed === 100) {
            this._showCelebration('👑 100 Problems! Math Wizard!');
        }
    }

    /** Get total days across all months */
    _getTotalDays() {
        let total = 0;
        for (const month of this.months) {
            if (this.data[month]) {
                total += this.data[month].days || 0;
            }
        }
        return total;
    }

    /** Show celebration animation */
    _showCelebration(text) {
        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay';
        overlay.innerHTML = `<div class="celebration-text">${text}</div>`;
        document.body.appendChild(overlay);
        
        // Confetti burst
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this._createConfetti(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 50);
        }
        
        setTimeout(() => overlay.remove(), 2000);
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
            const isCompleted = this._isCompleted(this.currMonth, i);

            const card = document.createElement('div');
            card.className = 'day-card' + (isCompleted ? ' completed' : '');
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
        
        // Update progress UI after rendering
        this._updateProgressUI();
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
        document.getElementById('aiOutput').innerHTML = '<span class="muted">Use the buttons above to get help!</span>';
        
        // Reset answer section
        const answerInput = document.getElementById('userAnswer');
        const feedback = document.getElementById('answerFeedback');
        if (answerInput) {
            answerInput.value = '';
            answerInput.disabled = false;
        }
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'answer-feedback';
        }
        
        // Check if already completed
        if (this._isCompleted(this.currMonth, day)) {
            if (feedback) {
                feedback.textContent = '✓ Already completed! Great job!';
                feedback.className = 'answer-feedback correct';
            }
        }
        
        document.getElementById('modal').classList.add('active');
        
        // Focus on answer input
        setTimeout(() => {
            if (answerInput) answerInput.focus();
        }, 300);
    }

    /**
     * Check the user's answer
     */
    checkAnswer() {
        const answerInput = document.getElementById('userAnswer');
        const feedback = document.getElementById('answerFeedback');
        
        if (!answerInput || !feedback || !this.selectedDay) return;
        
        const userAnswer = answerInput.value.trim().toLowerCase();
        
        if (!userAnswer) {
            feedback.textContent = '📝 Please enter an answer!';
            feedback.className = 'answer-feedback hint';
            answerInput.classList.add('shake');
            setTimeout(() => answerInput.classList.remove('shake'), 500);
            return;
        }
        
        // Get the expected answer from the fact
        const expectedAnswer = this.selectedDay.fact.a;
        
        if (expectedAnswer) {
            // Normalize both answers for comparison
            const normalizedExpected = String(expectedAnswer).trim().toLowerCase();
            const normalizedUser = userAnswer.replace(/\s+/g, ' ');
            
            // Check for match (allows for some flexibility)
            const isCorrect = normalizedUser === normalizedExpected ||
                             normalizedUser.includes(normalizedExpected) ||
                             normalizedExpected.includes(normalizedUser) ||
                             this._fuzzyMatch(normalizedUser, normalizedExpected);
            
            if (isCorrect) {
                this._handleCorrectAnswer(feedback, answerInput);
            } else {
                this._handleIncorrectAnswer(feedback, expectedAnswer);
            }
        } else {
            // No predefined answer - use AI to check or mark as complete
            this._handleOpenAnswer(feedback, answerInput);
        }
    }

    /** Fuzzy matching for answers */
    _fuzzyMatch(user, expected) {
        // Remove common variations
        const cleanUser = user.replace(/[,\.\s]/g, '');
        const cleanExpected = expected.replace(/[,\.\s]/g, '');
        return cleanUser === cleanExpected;
    }

    /** Handle correct answer */
    _handleCorrectAnswer(feedback, answerInput) {
        feedback.textContent = '🎉 Correct! Fantastic work!';
        feedback.className = 'answer-feedback correct';
        answerInput.disabled = true;
        
        // Mark as completed
        this._markCompleted(this.currMonth, this.selectedDay.day);
        
        // Celebration effects
        const rect = answerInput.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this._createConfetti(
                    rect.left + Math.random() * rect.width,
                    rect.top
                );
            }, i * 50);
        }
        
        // Update day card in grid
        const cards = document.querySelectorAll('.day-card:not(.empty)');
        const dayCard = cards[this.selectedDay.day - 1];
        if (dayCard) {
            dayCard.classList.add('completed');
        }
    }

    /** Handle incorrect answer */
    _handleIncorrectAnswer(feedback, expectedAnswer) {
        feedback.innerHTML = `❌ Not quite! Try again or use hints. <span style="color: var(--muted); font-size: 0.85rem;">(Answer starts with: ${expectedAnswer.charAt(0).toUpperCase()}...)</span>`;
        feedback.className = 'answer-feedback incorrect';
    }

    /** Handle open-ended answers (no predefined answer) */
    _handleOpenAnswer(feedback, answerInput) {
        feedback.textContent = '✅ Answer submitted! Use the Explain button to learn more.';
        feedback.className = 'answer-feedback correct';
        this._markCompleted(this.currMonth, this.selectedDay.day);
        answerInput.disabled = true;
        
        // Update day card
        const cards = document.querySelectorAll('.day-card:not(.empty)');
        const dayCard = cards[this.selectedDay.day - 1];
        if (dayCard) {
            dayCard.classList.add('completed');
        }
    }

    /**
     * Close the modal
     */
    closeModal() {
        document.getElementById('modal').classList.remove('active');
    }

    /**
     * Query Gemini API for AI responses
     * @param {string} type - Type of query: 'explain', 'fact', or 'hint'
     */
    async askGemini(type) {
        const out = document.getElementById('aiOutput');
        out.innerHTML = '<span class="loading">✨ Thinking...</span>';

        const m = this.currMonth;
        const d = this.selectedDay.day;
        const topic = this.selectedDay.fact.t;
        const question = this.selectedDay.fact.q;

        const prompt = this.buildPrompt(type, topic, question, d, m);

        // Prefer backend proxy when available so keys remain server-side
        if (this.apiBase) {
            try {
                const resp = await fetch(`${this.apiBase}/gemini`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, topic, question, day: d, month: m, prompt })
                });
                
                if (resp.ok) {
                    const payload = await resp.json();
                    if (payload.content) {
                        out.innerHTML = this._formatAIResponse(payload.content, type);
                        if (!payload.live && payload.fallbackReason) {
                            out.innerHTML = `<strong>📚 Quick Help:</strong><br>${payload.content}`;
                        }
                    } else {
                        out.innerHTML = '<span class="muted">No response received. Try again!</span>';
                    }
                    return;
                } else {
                    const errorData = await resp.json().catch(() => ({}));
                    console.warn('Gemini API error:', errorData);
                    out.innerHTML = this._getFallbackResponse(type, topic);
                    return;
                }
            } catch (err) {
                console.warn('Backend Gemini proxy unavailable:', err);
                out.innerHTML = this._getFallbackResponse(type, topic);
                return;
            }
        }

        if (!this.apiKey) {
            out.innerHTML = this._getFallbackResponse(type, topic);
            return;
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                out.innerHTML = this._formatAIResponse(data.candidates[0].content.parts[0].text, type);
            } else {
                out.innerHTML = this._getFallbackResponse(type, topic);
            }
        } catch (e) {
            console.error('Gemini API error:', e);
            out.innerHTML = this._getFallbackResponse(type, topic);
        }
    }

    /** Format AI response with nice styling */
    _formatAIResponse(text, type) {
        const icon = type === 'explain' ? '💡' : type === 'hint' ? '🔍' : '📚';
        const title = type === 'explain' ? 'Explanation' : type === 'hint' ? 'Hint' : 'Context';
        return `<strong>${icon} ${title}:</strong><br>${text.replace(/\n/g, '<br>')}`;
    }

    /** Get fallback response when API is unavailable */
    _getFallbackResponse(type, topic) {
        if (type === 'hint') {
            return `<strong>🔍 Hint:</strong><br>Think about the key concepts in "${topic}". Break down the problem into smaller steps!`;
        } else if (type === 'explain') {
            return `<strong>💡 Quick Tip:</strong><br>This topic relates to ${topic}. Try searching online for examples or ask your teacher for more details!`;
        }
        return `<strong>📚 Info:</strong><br>Learn more about ${topic} - it's a fascinating area of mathematics!`;
    }

    buildPrompt(type, topic, question, day, month) {
        if (type === 'explain') {
            return `Provide a clear, kid-friendly explanation of "${topic}" for the question: "${question}". Use simple language suitable for students. Include one worked example. Keep it under 150 words.`;
        } else if (type === 'hint') {
            return `Give a helpful hint (NOT the answer) for this math question: "${question}" about "${topic}". Be encouraging and guide the student toward the solution without giving it away. Keep it to 2-3 sentences.`;
        }
        return `Share a fun, interesting fact about "${topic}" that would excite a young student. Make it engaging and memorable. Keep it to 2-3 sentences.`;
    }
}
