import os
import vertexai
from vertexai.generative_models import GenerativeModel

def initialize_vertex_ai():
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    location = os.environ.get("GOOGLE_CLOUD_REGION", "us-central1")
    vertexai.init(project=project_id, location=location)

def get_ai_response(user_message):
    try:
        initialize_vertex_ai()
        model = GenerativeModel("gemini-2.0-flash")  # Use the new model alias
        response = model.generate_content(user_message)
        return response.text
    except Exception as e:
        print(f"Error getting AI response: {str(e)}")
        return "Sorry, I encountered an error processing your request."
