document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeToggleIcon(true);
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeToggleIcon(!isDark);
    });

    function updateThemeToggleIcon(isDark) {
        themeToggle.innerHTML = isDark 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
    }

    // Enable/disable send button based on input
    userInput.addEventListener('input', () => {
        // Auto-resize the textarea
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight < 120) 
            ? `${userInput.scrollHeight}px` 
            : '120px';
        
        // Enable/disable button
        sendButton.disabled = userInput.value.trim() === '';
    });

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input and reset height
        userInput.value = '';
        userInput.style.height = 'auto';
        sendButton.disabled = true;
        
        // Show typing indicator
        typingIndicator.classList.remove('hidden');
        
        try {
            // Send message to server
            const response = await sendMessage(message);
            
            // Hide typing indicator
            typingIndicator.classList.add('hidden');
            
            // Add AI response to chat
            if (response.error) {
                addErrorMessage(response.error);
            } else {
                addMessage(response.response, 'ai', response.timestamp);
            }
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.classList.add('hidden');
            addErrorMessage('Sorry, something went wrong. Please try again.');
        }
        
        // Scroll to bottom
        scrollToBottom();
    });

    // Add message to chat
    function addMessage(text, sender, timestamp = getCurrentTime()) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Process markdown-like formatting in AI responses
        if (sender === 'ai') {
            messageContent.innerHTML = formatMessage(text);
        } else {
            messageContent.textContent = text;
        }
        
        const messageTimestamp = document.createElement('div');
        messageTimestamp.className = 'message-timestamp';
        messageTimestamp.textContent = timestamp;
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTimestamp);
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add error message
    function addErrorMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message error';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = text;
        
        const messageTimestamp = document.createElement('div');
        messageTimestamp.className = 'message-timestamp';
        messageTimestamp.textContent = getCurrentTime();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTimestamp);
        
        chatMessages.appendChild(messageDiv);
    }

    // Send message to server
    async function sendMessage(message) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    // Get current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Format message with markdown-like syntax
    function formatMessage(text) {
        // Replace code blocks
        text = text.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
        
        // Replace inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Replace bold text
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Replace italic text
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Replace newlines with <br>
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    // Scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Focus input on load
    userInput.focus();

    // Listen for Enter key to send message (Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendButton.disabled) {
                chatForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Initial scroll to bottom
    scrollToBottom();
});