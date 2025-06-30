// Import styles
import './styles/main.css';

// Import components
import './components/app-header.js';
import './components/note-form.js';
import './components/note-item.js';
import './components/loading-indicator.js';

// Import services and utilities
import NotesAPI from './services/notes-api.js';
import NotificationManager from './utils/notification.js';

class NotesApp {
    constructor() {
        this.api = new NotesAPI();
        this.notes = [];
        this.archivedNotes = [];
        this.currentView = 'active'; // 'active' or 'archived'
        this.notesContainer = document.getElementById('notes-container');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadNotes();
    }

    setupEventListeners() {
        // Form submission
        document.addEventListener('add-note', async (event) => {
            await this.addNote(event.detail);
        });

        // Note actions
        document.addEventListener('archive-note', async (event) => {
            const { noteId, archived } = event.detail;
            await this.toggleArchiveNote(noteId, archived);
        });

        document.addEventListener('delete-note', async (event) => {
            const { noteId } = event.detail;
            await this.deleteNote(noteId);
        });

        // View toggle buttons
        const activeNotesBtn = document.getElementById('active-notes-btn');
        const archivedNotesBtn = document.getElementById('archived-notes-btn');

        activeNotesBtn.addEventListener('click', () => {
            this.switchView('active');
        });

        archivedNotesBtn.addEventListener('click', () => {
            this.switchView('archived');
        });
    }

    showLoading(show = true) {
        if (show) {
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    async loadNotes() {
        try {
            this.showLoadingIndicator('Memuat catatan...');
            
            // Load both active and archived notes
            const [activeResponse, archivedResponse] = await Promise.all([
                this.api.getNotes(),
                this.api.getArchivedNotes()
            ]);

            this.notes = activeResponse.data || [];
            this.archivedNotes = archivedResponse.data || [];
            
            this.renderNotes();
        } catch (error) {
            console.error('Error loading notes:', error);
            NotificationManager.showError(
                'Gagal memuat catatan. Periksa koneksi internet Anda.',
                'Gagal Memuat Data'
            );
            this.renderEmptyState('Gagal memuat catatan');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    async addNote(noteData) {
        try {
            this.showLoading();
            
            const response = await this.api.createNote(noteData);
            
            if (response.status === 'success') {
                // Add to local array
                this.notes.unshift(response.data);
                
                // Re-render if currently viewing active notes
                if (this.currentView === 'active') {
                    this.renderNotes();
                }
                
                NotificationManager.showSuccess('Catatan berhasil ditambahkan!');
            }
        } catch (error) {
            console.error('Error adding note:', error);
            NotificationManager.showError(
                'Gagal menambahkan catatan. Silakan coba lagi.',
                'Gagal Menambah Catatan'
            );
        } finally {
            this.showLoading(false);
        }
    }

    async toggleArchiveNote(noteId, shouldArchive) {
        try {
            this.showLoading();
            
            let response;
            if (shouldArchive) {
                response = await this.api.archiveNote(noteId);
            } else {
                response = await this.api.unarchiveNote(noteId);
            }
            
            if (response.status === 'success') {
                // Move note between arrays
                if (shouldArchive) {
                    const noteIndex = this.notes.findIndex(note => note.id === noteId);
                    if (noteIndex !== -1) {
                        const note = this.notes.splice(noteIndex, 1)[0];
                        note.archived = true;
                        this.archivedNotes.unshift(note);
                    }
                } else {
                    const noteIndex = this.archivedNotes.findIndex(note => note.id === noteId);
                    if (noteIndex !== -1) {
                        const note = this.archivedNotes.splice(noteIndex, 1)[0];
                        note.archived = false;
                        this.notes.unshift(note);
                    }
                }
                
                this.renderNotes();
                
                const message = shouldArchive ? 'Catatan berhasil diarsipkan' : 'Catatan berhasil dibatalkan dari arsip';
                NotificationManager.showInfo(message);
            }
        } catch (error) {
            console.error('Error toggling archive:', error);
            NotificationManager.showError(
                'Gagal mengubah status arsip catatan.',
                'Gagal Mengarsipkan'
            );
        } finally {
            this.showLoading(false);
        }
    }

    async deleteNote(noteId) {
        try {
            const confirmed = await NotificationManager.showConfirmation(
                'Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.',
                'Konfirmasi Hapus Catatan'
            );

            if (!confirmed) return;

            this.showLoading();
            
            const response = await this.api.deleteNote(noteId);
            
            if (response.status === 'success') {
                // Remove from local arrays
                this.notes = this.notes.filter(note => note.id !== noteId);
                this.archivedNotes = this.archivedNotes.filter(note => note.id !== noteId);
                
                this.renderNotes();
                NotificationManager.showSuccess('Catatan berhasil dihapus!');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            NotificationManager.showError(
                'Gagal menghapus catatan. Silakan coba lagi.',
                'Gagal Menghapus Catatan'
            );
        } finally {
            this.showLoading(false);
        }
    }

    switchView(view) {
        this.currentView = view;
        
        // Update button states
        const activeBtn = document.getElementById('active-notes-btn');
        const archivedBtn = document.getElementById('archived-notes-btn');
        const sectionTitle = document.getElementById('section-title-text');
        
        if (view === 'active') {
            activeBtn.classList.add('active');
            archivedBtn.classList.remove('active');
            sectionTitle.textContent = 'Daftar Catatan Aktif';
        } else {
            activeBtn.classList.remove('active');
            archivedBtn.classList.add('active');
            sectionTitle.textContent = 'Daftar Catatan Arsip';
        }
        
        this.renderNotes();
    }

    renderNotes() {
        const currentNotes = this.currentView === 'active' ? this.notes : this.archivedNotes;
        
        if (currentNotes.length === 0) {
            this.renderEmptyState();
            return;
        }

        // Sort notes by creation date (newest first)
        const sortedNotes = [...currentNotes].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        this.notesContainer.innerHTML = '';
        
        sortedNotes.forEach((note, index) => {
            const noteElement = document.createElement('note-item');
            noteElement.setAttribute('note-id', note.id);
            noteElement.setAttribute('note-title', note.title);
            noteElement.setAttribute('note-body', note.body);
            noteElement.setAttribute('note-date', note.createdAt);
            noteElement.setAttribute('archived', note.archived.toString());
            
            // Add staggered animation delay
            noteElement.style.animationDelay = `${index * 0.1}s`;
            noteElement.classList.add('animate__animated', 'animate__fadeInUp');
            
            this.notesContainer.appendChild(noteElement);
        });
    }

    renderEmptyState(message = null) {
        const emptyMessage = message || (this.currentView === 'active' 
            ? 'Belum ada catatan aktif' 
            : 'Belum ada catatan yang diarsipkan');
        
        const emptyDescription = message || (this.currentView === 'active'
            ? 'Mulai dengan menambahkan catatan pertama Anda!'
            : 'Catatan yang diarsipkan akan muncul di sini.');

        this.notesContainer.innerHTML = `
            <div class="empty-state animate__animated animate__fadeIn">
                <div class="icon">${this.currentView === 'active' ? '📝' : '📦'}</div>
                <h3>${emptyMessage}</h3>
                <p>${emptyDescription}</p>
            </div>
        `;
    }

    showLoadingIndicator(message = 'Memuat catatan...') {
        this.notesContainer.innerHTML = '';
        const loadingElement = document.createElement('loading-indicator');
        loadingElement.setAttribute('message', message);
        loadingElement.setAttribute('size', 'large');
        this.notesContainer.appendChild(loadingElement);
    }

    hideLoadingIndicator() {
        const loadingElement = this.notesContainer.querySelector('loading-indicator');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});