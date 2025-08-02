// Handling the Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        // Add active class to the clicked tab
        this.classList.add('active');
        
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

        // Show the corresponding content section
        const contentId = this.getAttribute('href').substring(1);
        document.getElementById(contentId).classList.add('active');
    });
});

// Toggle NavDrawer visibility
function toggleNavDrawer() {
    const drawer = document.getElementById('nav-drawer');
    drawer.classList.toggle('open');
}

// Close the drawer if clicked outside
window.addEventListener('click', function(event) {
    const drawer = document.getElementById('nav-drawer');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (!drawer.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        drawer.classList.remove('open');
    }
});

const typeTarget = document.getElementById('typewriter');
const typeText = 'Amirmohammad Shakeri';
let typeIndex = 0;

function typeWriter() {
  if (typeIndex < typeText.length) {
    typeTarget.textContent += typeText.charAt(typeIndex);
    typeIndex++;
    setTimeout(typeWriter, 100);
  }
}

// Only run when home tab is active
window.addEventListener('DOMContentLoaded', () => {
  typeWriter();
});



function loadHomeMarkdown() {
  fetch('home.md')
    .then(res => res.text())
    .then(md => {
      const html = marked.parse(md);
      document.getElementById('home-md').innerHTML = html;
    });
}

// Initial load for Home
window.addEventListener('DOMContentLoaded', () => {
  loadHomeMarkdown();
});

// Re-load if Home tab clicked again (optional)
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const id = tab.getAttribute('href').substring(1);
    if (id === 'home') loadHomeMarkdown();
  });
});