document.addEventListener('DOMContentLoaded', () => {
    // Apply saved sorting choice
    const savedSortBy = localStorage.getItem('sortBy');
    if (savedSortBy) {
        document.getElementById('sortBy').value = savedSortBy;
        sortTutors(savedSortBy); // Apply the sorting immediately
    }
});

function updateSorting() {
    const sortBy = document.getElementById('sortBy').value;
    localStorage.setItem('sortBy', sortBy); // Save to local storage
    sortTutors(sortBy); // Apply the sorting
}

function sortTutors(sortBy) {
    const tutorsList = document.getElementById('tutors-list');
    const tutorCards = Array.from(tutorsList.getElementsByClassName('tutor-card'));

    if (sortBy === 'lowToHigh') {
        // tutorCards.sort((a, b) => parseFloat(a.dataset.hourlyRate) - parseFloat(b.dataset.hourlyRate));
        tutorCards.sort((a, b) => parseFloat(a.getElementsByClassName('hr_rate')[0].textContent.replace(/[^0-9.]/g, '')) - parseFloat(b.getElementsByClassName('hr_rate')[0].textContent.replace(/[^0-9.]/g, '')));
    } else if (sortBy === 'highToLow') {
        // tutorCards.sort((a, b) => parseFloat(b.dataset.hourlyRate) - parseFloat(a.dataset.hourlyRate));
        tutorCards.sort((a, b) => parseFloat(b.getElementsByClassName('hr_rate')[0].textContent.replace(/[^0-9.]/g, '')) - parseFloat(a.getElementsByClassName('hr_rate')[0].textContent.replace(/[^0-9.]/g, '')));
    }

    // Clear and re-append sorted cards
    tutorsList.innerHTML = '';
    tutorCards.forEach(card => tutorsList.appendChild(card));
}
