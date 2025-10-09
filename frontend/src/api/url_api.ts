
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const shortenUrl = async (longUrl: string) => {
    const res = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to shorten URL');
    }

    return res.json();
};

export const getStats = async (shortCode: string) => {
    const res = await fetch(`${API_BASE_URL}/stats/${shortCode}`);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch stats');
    }
    
    return res.json();
};
