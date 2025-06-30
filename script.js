class NotesApp {
    constructor() {
        this.notes = [];
        this.notesContainer = document.getElementById('notes-container');
        this.init();
    }

    async init() {
        await this.loadNotesData();
        this.setupEventListeners();
        this.renderNotes();
    }

    async loadNotesData() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/dicodingacademy/a163-bfwd-labs/099-shared-files/notes.js');
            const text = await response.text();
            
            // Extract the notes array from the JavaScript file
            const notesMatch = text.match(/const notesData = (\[[\s\S]*?\]);/);
            if (notesMatch) {
                const notesData = eval(notesMatch[1]);
                this.notes = notesData.map(note => ({
                    ...note,
                    id: note.id
                }));
            }
        } catch (error) {
            console.error('Error loading notes data:', error);
            // Fallback dummy data
            this.notes = [
                {
                    id: 'notes-1',
                    title: 'Welcome to Notes!',
                    body: 'This is your first note. You can archive it, delete it, or create new ones.',
                    createdAt: new Date().toISOString(),
                    archived: false
                }
            ];
        }
    }

    setupEventListeners() {
        // Listen for add note event
        document.addEventListener('add-note', (event) => {
            this.addNote(event.detail);
        });

        // Listen for archive/delete note events
        document.addEventListener('archive-note', (event) => {
            const noteElement = event.target.closest('note-item');
            const noteId = noteElement.dataset.noteId;
            this.toggleArchiveNote(noteId, event.detail.archived);
        });

        document.addEventListener('delete-note', (event) => {
            const noteElement = event.target.closest('note-item');
            const noteId = noteElement.dataset.noteId;
            this.deleteNote(noteId);
        });
    }

    addNote(noteData) {
        const newNote = {
            ...noteData,
            id: `notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        
        this.notes.unshift(newNote);
        this.renderNotes();
        
        // Show success message
        this.showNotification('✅ Note added successfully!', 'success');
    }

    toggleArchiveNote(noteId, archived) {
        const noteIndex = this.notes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            this.notes[noteIndex].archived = archived;
            this.renderNotes();
            
            const message = archived ? '📥 Note archived' : '📤 Note unarchived';
            this.showNotification(message, 'info');
        }
    }

    deleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== noteId);
            this.renderNotes();
            this.showNotification('🗑️ Note deleted successfully', 'warning');
        }
    }

    renderNotes() {
        if (this.notes.length === 0) {
            this.notesContainer.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 4rem; margin-bottom: 20px;">📝</div>
                    <h3 style="color: #4a5568; margin-bottom: 10px;">No notes yet</h3>
                    <p style="color: #718096;">Start by adding your first note!</p>
                </div>
            `;
            return;
        }

        // Sort notes: active first, then by creation date (newest first)
        const sortedNotes = [...this.notes].sort((a, b) => {
            if (a.archived !== b.archived) {
                return a.archived ? 1 : -1;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        this.notesContainer.innerHTML = '';
        
        sortedNotes.forEach((note, index) => {
            const noteElement = document.createElement('note-item');
            noteElement.setAttribute('note-title', note.title);
            noteElement.setAttribute('note-body', note.body);
            noteElement.setAttribute('note-date', note.createdAt);
            noteElement.setAttribute('archived', note.archived.toString());
            noteElement.dataset.noteId = note.id;
            
            // Add staggered animation delay
            noteElement.style.animationDelay = `${index * 0.1}s`;
            
            this.notesContainer.appendChild(noteElement);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'warning' ? '#ed8936' : '#667eea'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
            max-width: 300px;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        
        if (!document.head.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});

// Add empty state styles
const emptyStateStyles = document.createElement('style');
emptyStateStyles.textContent = `
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        border-radius: 20px;
        border: 2px dashed #e2e8f0;
    }
`;
document.head.appendChild(emptyStateStyles);