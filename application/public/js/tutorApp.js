// Authors:
//     Aditya Sharma
document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.querySelector('.tutor-application-form');

    // This variable is dynamically set by the backend in the template
    let userLoggedIn = window.userLoggedIn || false;

    // Prevent attaching multiple event listeners
    if (!form.dataset.listenerAttached) {
        form.dataset.listenerAttached = true;

        // Handle form's submit event
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission

            let isValid = true;
            let errorMessage = '';

            // Validate text and number fields
            const requiredTextFields = form.querySelectorAll('input[required]:not([type="file"]), textarea[required]');
            requiredTextFields.forEach(function (field) {
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Please fill in all required fields.';
                }
            });

            // Validate file inputs
            const requiredFileFields = form.querySelectorAll('input[type="file"][required]');
            requiredFileFields.forEach(function (field) {
                if (field.files.length === 0) {
                    isValid = false;
                    errorMessage = 'Please upload all required files.';
                }
            });

            if (!isValid) {
                alert(errorMessage);
                return;
            }

            if (userLoggedIn) {
                // Disable the submit button to prevent multiple clicks
                submitBtn.disabled = true;

                // Submit the form via AJAX
                const formData = new FormData(form);
                try {
                    const response = await fetch('/tutor-app/submit-application', {
                        method: 'POST',
                        body: formData,
                    });

                    const result = await response.json();
                    console.log('Submission Result:', result); // Debugging log

                    if (result.success) {
                        // Show Thank You popup with 24-hour notice
                        showThankYouPopup();
                    } else {
                        alert(result.message || 'Failed to submit the application.');
                    }
                } catch (error) {
                    console.error('Error submitting application:', error);
                    alert('An error occurred. Please try again.');
                } finally {
                    // Re-enable the submit button
                    submitBtn.disabled = false;
                }
            } else {
                // Show login popup if the user is not logged in
                showLoginPopup();
            }
        });
    }

    // Cancel Button Logic
    cancelBtn.addEventListener('click', function () {
        window.location.href = '/'; // Redirect to home page or another destination
    });

    /**
     * Function to Display Thank You Popup after submission
     */
    function showThankYouPopup() {
        console.log('Displaying Thank You Popup'); // Debugging log

        // Check if the popup already exists
        if (document.getElementById('thankYouPopup')) {
            console.log('Thank You Popup already exists');
            return;
        }

        const popup = document.createElement('div');
        popup.id = 'thankYouPopup';
        popup.innerHTML = `
            <div class="popup-overlay"></div>
            <div class="popup-content">
                <h3>Thank You for Your Submission!</h3>
                <p>Your application has been submitted successfully.</p>
                <p><strong>Please note:</strong> It may take up to 24 hours for your application to be reviewed and accepted.</p>
                <button id="closeThankYouPopup">OK</button>
            </div>
        `;

        document.body.appendChild(popup);

        // Event listener for closing the popup
        document.getElementById('closeThankYouPopup').addEventListener('click', function () {
            document.body.removeChild(popup);
            // Redirect to home page after closing the popup
            window.location.href = '/';
        });
    }

    /**
     * Function to Display Login Popup
     */
    function showLoginPopup() {
        console.log('Displaying Login Popup'); // Debugging log

        // Check if the login popup already exists
        if (document.getElementById('loginPopUp')) {
            console.log('Login Popup already exists');
            return;
        }

        const loginContainer = document.createElement('div');
        loginContainer.id = 'loginContainer';
        loginContainer.innerHTML = `
            <div id="loginPopUp" class="popup">
                <div class="popup-overlay"></div>
                <div class="popup-content">
                    <span class="close-btn" id="closeLoginPopUp">&times;</span>
                    <h2>Login Required</h2>
                    <form id="loginForm">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" placeholder="Enter your username" required>
                        
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" required>
                        
                        <button type="submit" id="loginSubmitBtn">Login</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(loginContainer);

        // Add event listener to close the popup
        const closeLoginPopUp = document.getElementById('closeLoginPopUp');
        closeLoginPopUp.addEventListener('click', () => {
            document.body.removeChild(loginContainer); // Remove the entire login container
        });

        // Handle login form submission
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();
                console.log('Login Result:', result); // Debugging log

                if (response.ok && result.success) {
                    alert('Login successful! Please resubmit your application.');
                    // Update the userLoggedIn status
                    userLoggedIn = true;
                    // Remove the login popup
                    document.body.removeChild(loginContainer);
                    // Re-enable the submit button in case it was disabled
                    submitBtn.disabled = false;
                } else {
                    alert(result.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});
