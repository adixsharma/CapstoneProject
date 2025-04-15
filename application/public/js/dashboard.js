function initializeDashboard() {
    const profiles = [
        { id: 1, className: "CSC 340", imgSrc: "https://via.placeholder.com/100" },
        { id: 2, className: "CSC 413", imgSrc: "https://via.placeholder.com/100" },
        { id: 3, className: "CSC 415", imgSrc: "https://via.placeholder.com/100" }
    ];

    const messageSection = document.getElementById("messageSection");
    const profileSection = document.getElementById("profileSection");

    // Hide sections initially
    if (messageSection) messageSection.style.display = "none";
    if (profileSection) profileSection.style.display = "none";

    // Event listener for Tutor Messages button
    document.getElementById("tutorMessagesBtn")?.addEventListener("click", () => {
        if (profileSection) profileSection.style.display = "none";
        if (messageSection) {
            messageSection.style.display = "block";
            loadMessageContent(); // Load messages dynamically
        }
    });

    // Event listener for Tutor Profiles button
    document.getElementById("tutorProfilesBtn")?.addEventListener("click", () => {
        if (messageSection) messageSection.style.display = "none";
        if (profileSection) {
            profileSection.style.display = "block";
            loadProfiles(); // Load profiles dynamically
        }
    });

    // Event listener for Recover Profiles button
    document.getElementById("recoverProfilesBtn")?.addEventListener("click", recoverProfiles);

    // Load messages
    function loadMessageContent() {
        const messagesContent = document.getElementById("messagesContent");
        if (messagesContent) {
            messagesContent.innerHTML = `
                <div class="message">
                    <div class="message-header">
                        <strong>Name:</strong> Jonny Livington &nbsp;&nbsp;&nbsp;&nbsp; 
                        <strong>Subject:</strong> Algebra &nbsp;&nbsp;&nbsp;&nbsp; 
                        <strong>Date:</strong> Oct 13, 2024
                    </div>
                    <div class="message-contact">
                        <strong>Contact Info:</strong> JonnyInAlgebra@mail.com
                    </div>
                    <div class="message-body">
                        <strong>Message:</strong> <br>
                        Hello Joseph, I am struggling in Algebra. Can you help me study? 
                        I am free on Zoom/on campus from Wednesday to Sunday anytime 
                        between 9am and 9pm for 1-2 hour tutoring sessions. Please let me know!
                    </div>
                </div>`;
        }
    }

    // Load profile cards
    function loadProfiles() {
        const deletedProfiles = JSON.parse(localStorage.getItem("deletedProfiles")) || [];
        const profilesContent = document.getElementById("profilesContent");
        if (!profilesContent) return;

        profilesContent.innerHTML = ""; // Clear current profiles

        profiles.forEach(profile => {
            if (!deletedProfiles.includes(profile.id)) {
                const profileCard = document.createElement("div");
                profileCard.className = "profile-card";
                profileCard.innerHTML = `
                    <button class="delete-btn">X</button>
                    <img src="${profile.imgSrc}" alt="Tutor Photo">
                    <div class="class-name">${profile.className}</div>
                `;
                profilesContent.appendChild(profileCard);

                // Add delete functionality
                profileCard.querySelector(".delete-btn").addEventListener("click", () => deleteProfile(profile.id));
            }
        });
    }

    // Delete a profile
    function deleteProfile(profileId) {
        const deletedProfiles = JSON.parse(localStorage.getItem("deletedProfiles")) || [];
        if (!deletedProfiles.includes(profileId)) {
            deletedProfiles.push(profileId);
            localStorage.setItem("deletedProfiles", JSON.stringify(deletedProfiles));
        }
        loadProfiles();
    }

    // Recover profiles
    function recoverProfiles() {
        localStorage.removeItem("deletedProfiles");
        loadProfiles();
    }

    // Initialize profiles
    loadProfiles();
}

// Initialize the dashboard script
document.addEventListener("DOMContentLoaded", initializeDashboard);
