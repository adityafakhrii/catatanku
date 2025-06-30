class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['note-title', 'note-body', 'note-date', 'archived'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    render() {
        const title = this.getAttribute('note-title') || 'Tanpa Judul';
        const body = this.getAttribute('note-body') || 'Tanpa isi';
        const createdAt = this.getAttribute('note-date') || new Date().toISOString();
        const archived = this.getAttribute('archived') === 'true';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                :host {
                    display: block;
                    animation: fadeInUp 0.6s ease-out;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    width: 100%;
                }
                
                .note-card {
                    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(102, 126, 234, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    min-height: 200px;
                    max-height: 100%;
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 20px;
                }
                
                .note-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: ${archived ? 'linear-gradient(90deg, #ffa726, #ff7043)' : 'linear-gradient(90deg, #667eea, #764ba2)'};
                }
                
                .note-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
                }
                
                .note-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                    gap: 10px;
                }
                
                .note-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin: 0;
                    line-height: 1.4;
                    flex: 1;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
                
                .note-status {
                    background: ${archived ? '#ffa726' : '#667eea'};
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                
                .note-body {
                    color: #4a5568;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    margin-bottom: 15px;
                    flex: 1;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    max-height: 150px;
                    overflow-y: auto;
                }
                
                .note-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 12px;
                    border-top: 1px solid #e2e8f0;
                    margin-top: auto;
                }
                
                .note-date {
                    color: #718096;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .note-date i {
                    font-size: 0.8rem;
                }
                
                .note-actions {
                    display: flex;
                    gap: 8px;
                }
                
                .action-btn {
                    background: none;
                    border: none;
                    padding: 6px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                }
                
                .action-btn:hover {
                    background: rgba(102, 126, 234, 0.1);
                    transform: scale(1.1);
                }
                
                .delete-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 480px) {
                    .note-card {
                        padding: 15px;
                        margin-bottom: 15px;
                    }
                    
                    .note-title {
                        font-size: 1.1rem;
                    }
                    
                    .note-body {
                        font-size: 0.85rem;
                        max-height: 120px;
                    }
                    
                    .note-footer {
                        flex-direction: column;
                        gap: 8px;
                        align-items: flex-start;
                    }
                    
                    .note-actions {
                        width: 100%;
                        justify-content: flex-end;
                    }
                }
            </style>
            
            <article class="note-card">
                <div class="note-header">
                    <h3 class="note-title">${title}</h3>
                    <span class="note-status">${archived ? 'Diarsipkan' : 'Aktif'}</span>
                </div>
                
                <div class="note-body">${body}</div>
                
                <div class="note-footer">
                    <time class="note-date">
                        <i class="far fa-calendar"></i>
                        ${this.formatDate(createdAt)}
                    </time>
                    <div class="note-actions">
                        <button class="action-btn archive-btn" title="${archived ? 'Batal Arsip' : 'Arsipkan'}">
                            <i class="fas ${archived ? 'fa-box-open' : 'fa-box'}"></i>
                        </button>
                        <button class="action-btn delete-btn" title="Hapus">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;

        // Add event listeners
        const archiveBtn = this.shadowRoot.querySelector('.archive-btn');
        const deleteBtn = this.shadowRoot.querySelector('.delete-btn');

        archiveBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('archive-note', {
                bubbles: true,
                detail: { archived: !archived }
            }));
        });

        deleteBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-note', {
                bubbles: true
            }));
        });
    }
}

customElements.define('note-item', NoteItem);