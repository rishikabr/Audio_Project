document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = '/api';

    // Views
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');

    // Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // App elements
    const userInfoDiv = document.getElementById('user-info');
    const audioPlayer = document.getElementById('audio-player');
    const audioList = document.getElementById('audio-list');
    const nowPlayingSpan = document.querySelector('#now-playing span');
    const uploadBtn = document.getElementById('upload-btn');
    const audioUploadInput = document.getElementById('audio-upload-input');
    const logoutBtn = document.getElementById('logout-btn');
    const rewindBtn = document.getElementById('rewind-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const currentAudioName = document.getElementById('current-audio-name');

    // View toggling
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // --- All Event Listeners ---

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.style.display = 'none';
        loginView.style.display = 'block';
    });

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegistration);
    logoutBtn.addEventListener('click', handleLogout);
    uploadBtn.addEventListener('click', handleUpload);
    rewindBtn.addEventListener('click', () => audioPlayer.currentTime -= 5);
    forwardBtn.addEventListener('click', () => audioPlayer.currentTime += 5);

    audioUploadInput.addEventListener('change', () => {
        const fileName = audioUploadInput.files[0]?.name || 'Drag & drop a file or click to select';
        const fileMsg = document.querySelector('.file-msg');
        fileMsg.textContent = fileName;

        const dropArea = document.querySelector('.file-drop-area');
        if (audioUploadInput.files.length > 0) {
            dropArea.classList.add('is-active');
        } else {
            dropArea.classList.remove('is-active');
        }
    });


    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        fetch(`${apiBaseUrl}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                showApp();
            } else {
                alert(data.error || 'Login failed');
            }
        });
    }

    function handleRegistration(e) {
        e.preventDefault();
        if (!validateRegistrationForm()) {
            return;
        }
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const phone_number = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;

        fetch(`${apiBaseUrl}/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, phone_number }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                alert('Registration successful! Please log in.');
                showLoginLink.click();
            } else {
                // Handle backend validation errors (e.g., username already exists)
                const errorMsg = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n');
                alert(errorMsg);
            }
        });
    }

    function handleLogout() {
        localStorage.removeItem('token');
        showAuth();
    }

    function handleUpload() {
        const token = localStorage.getItem('token');
        const file = audioUploadInput.files[0];
        if (!file) {
            showToast('Please select a file to upload.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // Disable button and show status
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        fetch(`${apiBaseUrl}/upload/`, {
            method: 'POST',
            headers: { 'Authorization': `Token ${token}` },
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                fetchUserDetails();
                showToast('Upload successful!');
            } else {
                showToast('Upload failed.', 'error');
            }
        })
        .finally(() => {
            // Re-enable button and restore text
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload';
            // Clear the file input
            audioUploadInput.value = '';
            document.querySelector('.file-msg').textContent = 'Drag & drop a file or click to select';
            document.querySelector('.file-drop-area').classList.remove('is-active');
        });
    }

    function validateRegistrationForm() {
        let isValid = true;
        const emailField = document.getElementById('register-email');
        const passwordField = document.getElementById('register-password');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');

        // Reset errors
        emailError.textContent = '';
        passwordError.textContent = '';

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        // Password validation (e.g., at least 8 characters)
        if (passwordField.value.length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters long.';
            isValid = false;
        }

        return isValid;
    }

    // Add real-time validation on input
    document.getElementById('register-email').addEventListener('input', validateRegistrationForm);
    document.getElementById('register-password').addEventListener('input', validateRegistrationForm);

    function showApp() {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        fetchUserDetails();
    }

    function showAuth() {
        appContainer.style.display = 'none';
        authContainer.style.display = 'block';
        loginView.style.display = 'block';
        registerView.style.display = 'none';
    }

    function fetchUserDetails() {
        const token = localStorage.getItem('token');
        if (!token) {
            showAuth();
            return;
        }

        fetch(`${apiBaseUrl}/user/`, {
            headers: { 'Authorization': `Token ${token}` }
        })
            .then(response => response.json())
            .then(data => {
            if (data.detail) { // Handle invalid token
                showAuth();
                return;
            }
            let profilePic = '<div class="profile-pic-placeholder"></div>';
            if (data.profile && data.profile.profile_picture) {
                profilePic = `<img src="${data.profile.profile_picture}" alt="Profile Picture" class="profile-pic">`;
            }
                userInfoDiv.innerHTML = `
                ${profilePic}
                <div class="user-details">
                    <h2>${data.username}</h2>
                    <p>${data.email}</p>
                    <p>${data.profile?.phone_number || ''}</p>
                </div>
                `;
            renderAudioList(data.audio_files);
                if (data.audio_files.length > 0) {
                    const latestAudio = data.audio_files[data.audio_files.length - 1];
                audioPlayer.src = latestAudio.file;
                currentAudioName.textContent = latestAudio.file.split('/').pop();
                    audioPlayer.load();
            } else {
                currentAudioName.textContent = 'None';
                }
        });
    }

    function renderAudioList(files) {
        audioList.innerHTML = '';
        if (files.length === 0) {
            audioList.innerHTML = '<li>No audio files uploaded yet.</li>';
            return;
        }

        files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.dataset.filePath = file.file;
            listItem.dataset.fileName = file.file.split('/').pop();
            listItem.innerHTML = `
                <span>${listItem.dataset.fileName}</span>
                <div class="actions">
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            listItem.addEventListener('click', () => {
                // Remove active class from all other items
                document.querySelectorAll('#audio-list li').forEach(item => item.classList.remove('active'));
                // Add active class to the clicked item
                listItem.classList.add('active');
                
                audioPlayer.src = listItem.dataset.filePath;
                audioPlayer.play();
                nowPlayingSpan.textContent = listItem.dataset.fileName;
            });

            listItem.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the click from triggering the li's click listener
                if (confirm(`Are you sure you want to delete ${listItem.dataset.fileName}?`)) {
                    deleteAudioFile(file.id);
                }
            });

            audioList.appendChild(listItem);
        });
    }

    function deleteAudioFile(fileId) {
        const token = localStorage.getItem('token');
        fetch(`${apiBaseUrl}/audio/${fileId}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Token ${token}` },
        })
        .then(response => {
            if (response.ok) {
                fetchUserDetails(); // Refresh the list
                showToast('File deleted successfully.');
            } else {
                showToast('Failed to delete file.', 'error');
            }
        });
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 500);
        }, 3000);
    }

    // Initial check
    if (localStorage.getItem('token')) {
        showApp();
    } else {
        showAuth();
    }
}); 