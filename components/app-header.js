class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'subtitle'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || 'Catatanku';
        const subtitle = this.getAttribute('subtitle') || 'Aplikasi Catatan';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .header {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                    animation: slideDown 0.8s ease-out;
                }
                
                .title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }
                
                .title::before {
                    content: "📝";
                    font-size: 2rem;
                }
                
                .subtitle {
                    color: #666;
                    font-size: 1.1rem;
                    font-weight: 400;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    .header {
                        padding: 20px;
                        border-radius: 15px;
                    }
                    
                    .title {
                        font-size: 2rem;
                    }
                    
                    .title::before {
                        font-size: 1.5rem;
                    }
                    
                    .subtitle {
                        font-size: 1rem;
                    }
                }
            </style>
            
            <header class="header">
                <h1 class="title">${title}</h1>
                <p class="subtitle">${subtitle}</p>
            </header>
        `;
    }
}

customElements.define('app-header', AppHeader);