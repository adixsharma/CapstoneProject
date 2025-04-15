// tutor_app.js
document.addEventListener('DOMContentLoaded', function() {
    const messageButtons = document.querySelectorAll('.message-btn');
    const messagePopUp = document.getElementById('messagePopUp');
    const tutorNameElement = document.getElementById('tutorName');
    const messageText = document.getElementById('messageText');

    // Show popup when a message button is clicked
    messageButtons.forEach(button => {
        button.addEventListener('click', function() {
            tutorNameElement.textContent = this.dataset.tutor;
            messagePopUp.style.display = 'block';
        });
    });

    // Logic to send the message when the 'Send' button is clicked
    document.getElementById('sendMessageBtn').addEventListener('click', function() {
        const tutorName = tutorNameElement.textContent;
        const message = messageText.value;

        if (message.trim()) {
            alert(`Message sent to ${tutorName}: ${message}`);
            messagePopUp.style.display = 'none';
            messageText.value = '';
        }
    });

    // Close the message pop up
    document.getElementById('closeMessageBtn').addEventListener('click', function() {
        messagePopUp.style.display = 'none';
        messageText.value = '';
    });
});
