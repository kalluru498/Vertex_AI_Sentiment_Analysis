from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
from ai_service import get_ai_response
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    """Render the chat interface."""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Process a chat message and return an AI response."""
    try:
        if not request.is_json:
            return jsonify({
                'error': 'Request must be JSON'
            }), 400

        data = request.get_json()
        if data is None:
            return jsonify({
                'error': 'Invalid JSON in request body'
            }), 400

        user_message = data.get('message')
        if not user_message:
            return jsonify({
                'error': 'Message cannot be empty'
            }), 400
        
        # Get response from AI service
        ai_response = get_ai_response(user_message)
        
        if not ai_response:
            return jsonify({
                'error': 'Failed to get response from AI service'
            }), 500

        return jsonify({
            'response': ai_response,
            'timestamp': datetime.now().strftime("%H:%M:%S")
        })
    
    except Exception as e:
        app.logger.error(f"Error processing chat request: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)