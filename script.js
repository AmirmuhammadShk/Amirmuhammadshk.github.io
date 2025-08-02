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
    if (targetId === 'cv') {
        loadCVMarkdown();
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


const blogData = {
  AI: ['Test.md'],
  GenAI: ['Generative.md'],
};

async function fetchMarkdown(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const md = await res.text();
    return marked.parse(md);
  } catch (err) {
    console.warn(err.message);
    return "";
  }
}
function loadBlogMarkdown() {
  const categoryTabs = document.getElementById('blog-categories-tabs');
  const postsList = document.getElementById('blog-posts-list');
  const postView = document.getElementById('blog-post-view');

  categoryTabs.innerHTML = '';
  postsList.innerHTML = '';
  postView.innerHTML = '';

  for (const category in blogData) {
    const btn = document.createElement('button');
    btn.textContent = category.toUpperCase();
    btn.classList.add('blog-tab');
    btn.onclick = () => {
      document.querySelectorAll('.blog-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showPostTitles(category);
      postView.innerHTML = '';
    };
    categoryTabs.appendChild(btn);
  }
}

function showPostTitles(category) {
  const postsList = document.getElementById('blog-posts-list');
  const postView = document.getElementById('blog-post-view');
  postsList.innerHTML = '';

  blogData[category].forEach(filename => {
    const title = filename.replace(/\.md$/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const postItem = document.createElement('div');
    postItem.classList.add('blog-list-item');
    postItem.textContent = `📄 ${title}`;
    postItem.onclick = () => {
      const path = `blog/${category}/${filename}`;
      fetch(path)
        .then(res => res.text())
        .then(md => {
          postView.innerHTML = marked.parse(md);
          window.scrollTo({ top: postView.offsetTop - 60, behavior: 'smooth' });
        });
    };
    postsList.appendChild(postItem);
  });
}

async function detectLatestCVPath() {
  // Manually list the folders since we can't read file structure in browser
  // Simulate this list for now — UPDATE with actual names from your server
  const allDirs = [
    "CV/2025-08-02-active",
    "CV/2025-07-02",
  ];

  const activeDirs = allDirs.filter(name => name.endsWith("-active"));
  if (!activeDirs.length) return null;

  activeDirs.sort(); // Alphabetical = chronological if formatted as yyyy-mm-dd
  return activeDirs[activeDirs.length - 1]; // Latest active
}


async function loadCVMarkdown() {
  const container = document.getElementById("cv-content");
  container.innerHTML = "";

  const basePath = await detectLatestCVPath();
  if (!basePath) {
    container.innerHTML = "<p>No active CV found.</p>";
    return;
  }

  const files = [
    "summary.md",
    "experience.md",  // ✅ this now exists
    // "contact.md",
    "skills.md",
    "certificates.md",
    "education.md"
  ];

  for (const file of files) {
    try {
      const html = await fetchMarkdown(`${basePath}/${file}`);
      container.innerHTML += `<section class="cv-section">${html}</section>`;
    } catch (e) {
      console.warn(`Could not load ${file}`, e);
    }
  }
}
function setTheme(themeName) {
  document.body.className = themeName;
  localStorage.setItem("selectedTheme", themeName);

  const topSelect = document.getElementById("theme-selector");
  const drawerSelect = document.getElementById("drawer-theme-selector");

  if (topSelect && topSelect.value !== themeName) topSelect.value = themeName;
  if (drawerSelect && drawerSelect.value !== themeName) drawerSelect.value = themeName;
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("selectedTheme") || "theme-green-matrix";
  document.body.className = saved;

  const topSelect = document.getElementById("theme-selector");
  const drawerSelect = document.getElementById("drawer-theme-selector");

  if (topSelect) topSelect.value = saved;
  if (drawerSelect) drawerSelect.value = saved;
});
