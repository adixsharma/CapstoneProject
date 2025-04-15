document.addEventListener("DOMContentLoaded", () => {
    // Attach click event to open popups
    document.querySelectorAll(".openPopup").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default link behavior

            const videoId = this.getAttribute("data-video-id");
            const popup = document.getElementById(videoId);
            popup.style.display = "block";
        });
    });

    // Attach click event to close popups
    document.querySelectorAll(".closePopup").forEach(closeBtn => {
        closeBtn.addEventListener("click", function() {
            const popup = this.closest(".popup");
            popup.style.display = "none";
        });
    });

    // Close the popup if the user clicks outside the content box
    window.addEventListener("click", function(event) {
        const popups = document.querySelectorAll(".popup");
        popups.forEach(popup => {
            if (event.target === popup) {
                popup.style.display = "none";
            }
        });
    });
});