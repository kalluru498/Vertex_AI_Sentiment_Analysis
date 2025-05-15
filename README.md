# AI Chat Assistant with Google Vertex AI

A simple web application that allows users to chat with an AI assistant powered by Google Cloud Vertex AI (PaLM or Gemini).

## Features

- Clean, responsive chat interface
- Integration with Google Cloud Vertex AI models
- Support for both PaLM and Gemini models
- Light and dark theme
- Message formatting for code blocks and text styling
- Typing indicators and animations

## Tech Stack

- **Backend**: Python with Flask
- **Frontend**: HTML, CSS, JavaScript
- **AI Integration**: Google Cloud Vertex AI
- **Deployment**: Docker + Google Cloud Run

## Setup Instructions

### Prerequisites

1. Google Cloud account with Vertex AI API enabled
2. Google Cloud project with billing enabled
3. Python 3.7+ and pip
4. Docker (for containerization)

### Local Development

1. Clone this repository
2. Create a `.env` file based on `.env.example`
3. Set up Google Cloud authentication:
   ```
   gcloud auth application-default login
   ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the application:
   ```
   python app.py
   ```
6. Access the application at http://localhost:8080

### Google Cloud Setup

1. Enable the Vertex AI API in your Google Cloud project
2. Create a service account with the necessary permissions (Vertex AI User)
3. Download the service account key file and set the path in your `.env` file

### Deployment to Cloud Run

1. Build the Docker image:
   ```
   docker build -t gcr.io/[PROJECT-ID]/ai-chat-app .
   ```

2. Push the image to Google Container Registry:
   ```
   docker push gcr.io/[PROJECT-ID]/ai-chat-app
   ```

3. Deploy to Cloud Run:
   ```
   gcloud run deploy ai-chat-app \
     --image gcr.io/[PROJECT-ID]/ai-chat-app \
     --platform managed \
     --region [REGION] \
     --allow-unauthenticated \
     --set-env-vars GOOGLE_CLOUD_PROJECT=[PROJECT-ID],GOOGLE_CLOUD_REGION=[REGION],VERTEX_MODEL_ID=[MODEL-ID]
   ```

## Environment Variables

- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID
- `GOOGLE_CLOUD_REGION`: Google Cloud region (e.g., us-central1)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account key file
- `VERTEX_MODEL_ID`: Vertex AI model ID (e.g., gemini-1.0-pro or text-bison)
- `FLASK_ENV`: Environment (development, production)
- `SECRET_KEY`: Flask secret key
- `PORT`: Port for the application (default: 8080)

## License

MIT