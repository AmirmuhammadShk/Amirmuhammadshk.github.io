// === Tab switching ===
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function () {
    // Activate clicked tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    // Show corresponding section
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    const targetId = this.getAttribute('href').substring(1);
    document.getElementById(targetId).classList.add('active');

    // Load dynamic content for specific tabs
    if (targetId === 'blog') {
        loadBlogMarkdown();
        }
    if (targetId === 'home') {
      loadHomeMarkdown();
      resetTypewriter();
    }

    // Close nav drawer (mobile)
    document.getElementById('nav-drawer').classList.remove('open');
  });
});

// === NavDrawer toggle ===
function toggleNavDrawer() {
  document.getElementById('nav-drawer').classList.toggle('open');
}

// === Close nav drawer when clicking outside ===
window.addEventListener('click', function (event) {
  const drawer = document.getElementById('nav-drawer');
  const hamburger = document.querySelector('.hamburger-menu');
  if (!drawer.contains(event.target) && !hamburger.contains(event.target)) {
    drawer.classList.remove('open');
  }
});

// === Typewriter effect ===
const typeTarget = document.getElementById('typewriter');
const typeText = 'Amirmohammad Shakeri';
let typeIndex = 0;
let typeTimer;

function typeWriter() {
  if (typeIndex < typeText.length) {
    typeTarget.textContent += typeText.charAt(typeIndex);
    typeIndex++;
    typeTimer = setTimeout(typeWriter, 100);
  }
}

function resetTypewriter() {
  clearTimeout(typeTimer);
  typeTarget.textContent = '';
  typeIndex = 0;
  typeWriter();
}

// === Markdown Loader for Home ===
function loadHomeMarkdown() {
  fetch('home.md')
    .then(res => res.text())
    .then(md => {
      const html = marked.parse(md);
      document.getElementById('home-md').innerHTML = html;
    });
}

// === Initial Page Load ===
window.addEventListener('DOMContentLoaded', () => {
  loadHomeMarkdown();
  typeWriter();
});


const blogStructure = {
  AI: ['Test.md'],
};

function loadBlogMarkdown() {
  const container = document.getElementById('blog-categories');
  container.innerHTML = ''; // clear previous

  for (const [category, posts] of Object.entries(blogStructure)) {
    const categoryDiv = document.createElement('div');
    const categoryHeader = document.createElement('h2');
    categoryHeader.textContent = `📂 ${category.toUpperCase()}`;
    categoryDiv.appendChild(categoryHeader);

    posts.forEach(filename => {
      const postDiv = document.createElement('div');
      const postPath = `blog/${category}/${filename}`;

      fetch(postPath)
        .then(res => res.text())
        .then(md => {
          const html = marked.parse(md);
          postDiv.innerHTML = html;
          postDiv.classList.add('blog-post');
          categoryDiv.appendChild(postDiv);
        });
    });

    container.appendChild(categoryDiv);
  }
}
