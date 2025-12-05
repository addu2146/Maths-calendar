/**
 * Main Entry Point
 * Initializes the calendar app and sets up event listeners
 */

import { Calendar } from './calendar.js';
import { DEFAULT_DATA, DEFAULT_MONTHS } from './data.js';

const API_BASE = '/api';

// Initialize calendar instance with local dataset; may be replaced after backend fetch
const app = new Calendar({ data: DEFAULT_DATA, months: DEFAULT_MONTHS, apiBase: API_BASE });

/**
 * DOMContentLoaded - Set up event listeners when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize background shapes
    app.init();

    // Attempt to hydrate data from backend if available
    hydrateFromBackend();

    // Start button - transition from intro to calendar
    document.getElementById('startBtn').addEventListener('click', () => {
        app.start();
    });

    // Modal close button
    document.getElementById('closeBtn').addEventListener('click', () => {
        app.closeModal();
    });

    // Check Answer button
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    if (checkAnswerBtn) {
        checkAnswerBtn.addEventListener('click', () => {
            app.checkAnswer();
        });
    }

    // Enter key to submit answer
    const userAnswerInput = document.getElementById('userAnswer');
    if (userAnswerInput) {
        userAnswerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                app.checkAnswer();
            }
        });
    }

    // AI Genie buttons
    document.getElementById('explainBtn').addEventListener('click', () => {
        app.askGemini('explain');
    });

    document.getElementById('factBtn').addEventListener('click', () => {
        app.askGemini('fact');
    });

    // Hint button
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            app.askGemini('hint');
        });
    }

    // Close modal on overlay click (outside modal content)
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            app.closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            app.closeModal();
        }
    });
});

async function hydrateFromBackend() {
    try {
        const response = await fetch(`${API_BASE}/months`);
        if (!response.ok) return; // silent fallback to local data
        const payload = await response.json();
        // Expect shape: { months: [...], data: { january: {...}, ... } }
        if (payload && payload.data && payload.months) {
            app.setData({ data: payload.data, months: payload.months });
            app.renderNav();
            app.renderMonth(payload.months[0] || 'january');
        }
    } catch (err) {
        // Ignore and keep local data
        console.warn('Using bundled dataset; backend unreachable.', err);
    }
}
