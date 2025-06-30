class NotesAPI {
    constructor() {
        this.baseURL = 'https://notes-api.dicoding.dev/v2';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Get all active notes
    async getNotes() {
        return this.request('/notes');
    }

    // Get all archived notes
    async getArchivedNotes() {
        return this.request('/notes/archived');
    }

    // Get single note by ID
    async getNote(id) {
        return this.request(`/notes/${id}`);
    }

    // Create new note
    async createNote(noteData) {
        return this.request('/notes', {
            method: 'POST',
            body: JSON.stringify(noteData),
        });
    }

    // Archive note
    async archiveNote(id) {
        return this.request(`/notes/${id}/archive`, {
            method: 'POST',
        });
    }

    // Unarchive note
    async unarchiveNote(id) {
        return this.request(`/notes/${id}/unarchive`, {
            method: 'POST',
        });
    }

    // Delete note
    async deleteNote(id) {
        return this.request(`/notes/${id}`, {
            method: 'DELETE',
        });
    }
}

export default NotesAPI;