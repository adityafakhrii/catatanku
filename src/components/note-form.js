class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupValidation();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .form-container {
                    animation: slideInLeft 0.8s ease-out;
                    max-width: 100%;
                    box-sizing: border-box;
                }
                
                .form-title {
                    color: #4a5568;
                    margin-bottom: 25px;
                    font-size: 1.5rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .form-title::before {
                    content: "✏️";
                    font-size: 1.3rem;
                    animation: wiggle 2s infinite;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    color: #4a5568;
                    font-weight: 500;
                    font-size: 0.95rem;
                }
                
                .form-input,
                .form-textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-family: 'Poppins', sans-serif;
                    transition: all 0.3s ease;
                    background: #f8f9ff;
                    box-sizing: border-box;
                    max-width: 100%;
                }
                
                .form-input:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    background: white;
                    transform: scale(1.02);
                }
                
                .form-textarea {
                    resize: vertical;
                    min-height: 120px;
                    line-height: 1.6;
                    overflow-y: auto;
                }
                
                .form-button {
                    width: 100%;
                    padding: 14px 20px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                }
                
                .form-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s;
                }
                
                .form-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                }
                
                .form-button:hover::before {
                    left: 100%;
                }
                
                .form-button:active {
                    transform: translateY(0);
                }
                
                .form-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .validation-message {
                    color: #e53e3e;
                    font-size: 0.85rem;
                    margin-top: 5px;
                    display: none;
                    animation: fadeIn 0.3s ease;
                }
                
                .validation-message.show {
                    display: block;
                }
                
                .form-input.error,
                .form-textarea.error {
                    border-color: #e53e3e;
                    background: #fef5f5;
                    animation: shake 0.5s ease-in-out;
                }
                
                .form-input.valid,
                .form-textarea.valid {
                    border-color: #38a169;
                    background: #f0fff4;
                }
                
                .char-counter {
                    text-align: right;
                    font-size: 0.8rem;
                    color: #718096;
                    margin-top: 5px;
                }
                
                .char-counter.warning {
                    color: #d69e2e;
                }
                
                .char-counter.error {
                    color: #e53e3e;
                }
                
                form {
                    width: 100%;
                }
                
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes wiggle {
                    0%, 7% { transform: rotateZ(0); }
                    15% { transform: rotateZ(-15deg); }
                    20% { transform: rotateZ(10deg); }
                    25% { transform: rotateZ(-10deg); }
                    30% { transform: rotateZ(6deg); }
                    35% { transform: rotateZ(-4deg); }
                    40%, 100% { transform: rotateZ(0); }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                @media (max-width: 768px) {
                    .form-title {
                        font-size: 1.3rem;
                    }
                    
                    .form-input,
                    .form-textarea,
                    .form-button {
                        padding: 12px 14px;
                    }
                }
            </style>
            
            <div class="form-container">
                <h2 class="form-title">Tambah Catatan Baru</h2>
                
                <form id="note-form">
                    <div class="form-group">
                        <label for="title" class="form-label">Judul Catatan *</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            class="form-input" 
                            placeholder="Masukkan judul catatan..."
                            maxlength="100"
                            required
                        >
                        <div class="validation-message" id="title-error"></div>
                        <div class="char-counter" id="title-counter">0/100</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="body" class="form-label">Isi Catatan *</label>
                        <textarea 
                            id="body" 
                            name="body" 
                            class="form-textarea" 
                            placeholder="Tulis isi catatan Anda di sini..."
                            maxlength="1000"
                            required
                        ></textarea>
                        <div class="validation-message" id="body-error"></div>
                        <div class="char-counter" id="body-counter">0/1000</div>
                    </div>
                    
                    <button type="submit" class="form-button" id="submit-btn">
                        <span>➕</span>
                        Tambah Catatan
                    </button>
                </form>
            </div>
        `;
    }

    setupValidation() {
        const form = this.shadowRoot.getElementById('note-form');
        const titleInput = this.shadowRoot.getElementById('title');
        const bodyInput = this.shadowRoot.getElementById('body');
        const submitBtn = this.shadowRoot.getElementById('submit-btn');

        // Real-time validation
        titleInput.addEventListener('input', () => this.validateTitle());
        bodyInput.addEventListener('input', () => this.validateBody());
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    validateTitle() {
        const titleInput = this.shadowRoot.getElementById('title');
        const titleError = this.shadowRoot.getElementById('title-error');
        const titleCounter = this.shadowRoot.getElementById('title-counter');
        const value = titleInput.value.trim();
        const length = value.length;

        titleCounter.textContent = `${length}/100`;
        
        if (length > 80) {
            titleCounter.className = 'char-counter warning';
        } else if (length > 95) {
            titleCounter.className = 'char-counter error';
        } else {
            titleCounter.className = 'char-counter';
        }

        if (length === 0) {
            this.showError(titleInput, titleError, 'Judul catatan tidak boleh kosong');
            return false;
        } else if (length < 3) {
            this.showError(titleInput, titleError, 'Judul minimal 3 karakter');
            return false;
        } else {
            this.showValid(titleInput, titleError);
            return true;
        }
    }

    validateBody() {
        const bodyInput = this.shadowRoot.getElementById('body');
        const bodyError = this.shadowRoot.getElementById('body-error');
        const bodyCounter = this.shadowRoot.getElementById('body-counter');
        const value = bodyInput.value.trim();
        const length = value.length;

        bodyCounter.textContent = `${length}/1000`;
        
        if (length > 800) {
            bodyCounter.className = 'char-counter warning';
        } else if (length > 950) {
            bodyCounter.className = 'char-counter error';
        } else {
            bodyCounter.className = 'char-counter';
        }

        if (length === 0) {
            this.showError(bodyInput, bodyError, 'Isi catatan tidak boleh kosong');
            return false;
        } else if (length < 10) {
            this.showError(bodyInput, bodyError, 'Isi catatan minimal 10 karakter');
            return false;
        } else {
            this.showValid(bodyInput, bodyError);
            return true;
        }
    }

    validateForm() {
        const titleValid = this.validateTitle();
        const bodyValid = this.validateBody();
        return titleValid && bodyValid;
    }

    showError(input, errorElement, message) {
        input.className = 'form-input error';
        if (input.tagName === 'TEXTAREA') {
            input.className = 'form-textarea error';
        }
        errorElement.textContent = message;
        errorElement.className = 'validation-message show';
    }

    showValid(input, errorElement) {
        input.className = 'form-input valid';
        if (input.tagName === 'TEXTAREA') {
            input.className = 'form-textarea valid';
        }
        errorElement.className = 'validation-message';
    }

    async submitForm() {
        const titleInput = this.shadowRoot.getElementById('title');
        const bodyInput = this.shadowRoot.getElementById('body');
        const submitBtn = this.shadowRoot.getElementById('submit-btn');

        const noteData = {
            title: titleInput.value.trim(),
            body: bodyInput.value.trim()
        };

        // Disable button temporarily
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳</span> Menambahkan...';

        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('add-note', {
            bubbles: true,
            detail: noteData
        }));

        // Reset form after successful submission
        setTimeout(() => {
            titleInput.value = '';
            bodyInput.value = '';
            titleInput.className = 'form-input';
            bodyInput.className = 'form-textarea';
            this.shadowRoot.getElementById('title-counter').textContent = '0/100';
            this.shadowRoot.getElementById('body-counter').textContent = '0/1000';
            this.shadowRoot.getElementById('title-counter').className = 'char-counter';
            this.shadowRoot.getElementById('body-counter').className = 'char-counter';
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>➕</span> Tambah Catatan';
        }, 1000);
    }
}

customElements.define('note-form', NoteForm);