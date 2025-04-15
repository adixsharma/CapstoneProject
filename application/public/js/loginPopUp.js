document.addEventListener("DOMContentLoaded", function () {
    const logInButtons = document.querySelectorAll("#logInButton"); // Select all login buttons
    const loginContainer = document.getElementById("loginContainer");

    if (logInButtons.length && loginContainer) {
        logInButtons.forEach((logInButton) => {
            logInButton.addEventListener("click", async function (event) {
                event.preventDefault(); // Prevent default link behavior

                // Check if the popup is already loaded
                if (!document.getElementById("loginPopUp")) {
                    try {
                        // Fetch the popup content from the server
                        const response = await fetch("/login", {
                            method: "GET",
                            headers: { "Content-Type": "text/html" },
                        });
                        if (response.ok) {
                            const loginHTML = await response.text();
                            loginContainer.innerHTML = loginHTML; // Inject popup into the container

                            // Display the popup
                            const loginPopUp = document.getElementById("loginPopUp");
                            loginPopUp.style.display = "block";

                            initializeLoginPopup(); // Initialize popup behavior
                        } else {
                            console.error("Failed to load login popup:", response.status);
                        }
                    } catch (error) {
                        console.error("Error fetching login popup:", error);
                    }
                } else {
                    // Popup already loaded; just display it
                    const loginPopUp = document.getElementById("loginPopUp");
                    loginPopUp.style.display = "block";
                }
            });
        });
    } else {
        console.error("logInButton(s) or loginContainer is missing.");
    }

    function initializeLoginPopup() {
        const closeLoginBtn = document.getElementById("closeLoginBtn");
        const loginSubmitBtn = document.getElementById("loginSubmitBtn");

        if (closeLoginBtn && loginSubmitBtn) {
            // Close the popup when the close button is clicked
            closeLoginBtn.addEventListener("click", function () {
                const loginPopUp = document.getElementById("loginPopUp");
                if (loginPopUp) {
                    loginPopUp.style.display = "none"; // Close the popup
                }
            });

            // Handle login form submission
            loginSubmitBtn.addEventListener("click", async function () {
                const username = document.getElementById("username").value.trim();
                const password = document.getElementById("password").value.trim();

                if (username && password) {
                    try {
                        // Send data to the server
                        const response = await fetch("/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ username, password }),
                        });

                        const result = await response.json();

                        if (result.success) {
                            alert("Login successful!");
                            const loginPopUp = document.getElementById("loginPopUp");
                            loginPopUp.style.display = "none";
                            // Optionally, redirect the user or update the UI
                            window.location.reload(); // Reload the page or redirect as needed
                        } else {
                            alert("Login failed: " + result.message);
                        }
                    } catch (error) {
                        console.error("Error during login:", error);
                        alert("An error occurred. Please try again.");
                    }
                } else {
                    alert("Please enter both username and password.");
                }
            });
        } else {
            console.error("Close button or login submit button is missing in the popup.");
        }
    }
});
