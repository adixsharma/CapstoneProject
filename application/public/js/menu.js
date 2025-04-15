/**
 * André
 *
 * Method for toggling menu in the header (nav bar)
 *
 */

function toggleMenu() {
    const menu = document.getElementById("menuItems");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

