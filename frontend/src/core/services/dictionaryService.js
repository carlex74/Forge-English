import { API_URL } from '../../config/api';

export const getTags = async () => {
    const res = await fetch(`${API_URL}/dictionary/tags`);
    if (!res.ok) throw new Error('Error fetching tags');
    return res.json();
};

export const getWords = async (skip = 0, limit = 50, search = '', tagId = '') => {
    const params = new URLSearchParams({ skip, limit });
    if (search) params.append('search', search);
    if (tagId) params.append('tag_id', tagId);
    
    const res = await fetch(`${API_URL}/dictionary/words?${params.toString()}`);
    if (!res.ok) throw new Error('Error fetching words');
    return res.json();
};
