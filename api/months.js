import { DEFAULT_DATA, DEFAULT_MONTHS } from '../src/js/data.js';

export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ months: DEFAULT_MONTHS, data: DEFAULT_DATA });
}
