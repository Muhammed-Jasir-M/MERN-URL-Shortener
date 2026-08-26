
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const shortenUrl = async (longUrl: string, customAlias?: string) => {
    const body: { longUrl: string; customAlias?: string } = { longUrl };
    if (customAlias && customAlias.trim()) {
        body.customAlias = customAlias.trim();
    }

    const res = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

export const getAllUrls = async () => {
    const res = await fetch(`${API_BASE_URL}/getAllUrls`);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch all URLs');
    }

    return res.json();
};

export const deleteUrl = async (shortCode: string) => {
    const res = await fetch(`${API_BASE_URL}/url/${shortCode}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete URL');
    }

    return res.json();
};

export const getStatsSummary = async () => {
    const res = await fetch(`${API_BASE_URL}/stats/summary`);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch stats summary');
    }

    return res.json();
};
