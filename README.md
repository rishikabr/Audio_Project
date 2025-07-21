# User Audio Player Application

This is a full-stack web application built with Django and vanilla JavaScript that allows users to view their details, upload audio files, and play them back.

## Features

- Fetch user details from a REST API.
- Upload audio files for a specific user.
- Play back the latest uploaded audio file.
- Change the audio file by uploading a new one.

## Project Structure

- `backend/`: Contains the Django project, including the REST API.
- `frontend/`: Contains the frontend application (HTML, CSS, JavaScript).

## Setup and Running the Application

### Prerequisites

- Python 3.x
- pip

### Setup

1.  **Navigate to the Project Directory:**
    All commands should be run from the `audio_project` subdirectory.
    ```bash
    cd audio_project
    ```

2.  **Install Dependencies:**
    Install the required packages:
    ```bash
    pip install -r backend/requirements.txt
    ```

3.  **Run Database Migrations:**
    Run the following commands to set up the database:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

### Running the Application

1.  **Run the Server:**
    Start the Django development server:
    ```bash
    python manage.py runserver
    ```

2.  **Open the Application:**
    Navigate to `http://127.0.0.1:8000` in your web browser.

3.  **Register and Log In:**
    - Use the "Register here" link to create a new user account.
    - Log in with the credentials you just created.
    - After logging in, you will be taken to your personal profile page where you can upload and play audio files.

### Optional: Admin Access

To manage users and profiles directly, you can use the admin panel.

1.  **Create a Superuser:**
    If you haven't already, create a superuser account:
    ```bash
    python manage.py createsuperuser
    ```
2.  **Access the Admin Panel:**
    Navigate to `http://127.0.0.1:8000/admin` and log in with your superuser credentials. 