class LoadingIndicator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['message', 'size'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const message = this.getAttribute('message') || 'Memuat catatan...';
        const size = this.getAttribute('size') || 'normal';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    grid-column: 1 / -1;
                }
                
                .loading-container {
                    text-align: center;
                    padding: ${size === 'large' ? '60px 20px' : '40px 20px'};
                    color: #666;
                    animation: fadeIn 0.5s ease-out;
                }
                
                .loading-spinner {
                    display: inline-block;
                    margin-bottom: 15px;
                }
                
                .loading-spinner i {
                    font-size: ${size === 'large' ? '3rem' : '2rem'};
                    color: #667eea;
                    animation: spin 1s linear infinite;
                }
                
                .loading-message {
                    font-size: ${size === 'large' ? '1.2rem' : '1.1rem'};
                    font-weight: 500;
                    color: #4a5568;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .pulse {
                    animation: pulse 2s infinite;
                }
            </style>
            
            <div class="loading-container">
                <div class="loading-spinner">
                    <i class="fas fa-spinner"></i>
                </div>
                <div class="loading-message pulse">${message}</div>
            </div>
        `;
    }

    show(message) {
        if (message) {
            this.setAttribute('message', message);
        }
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('loading-indicator', LoadingIndicator);