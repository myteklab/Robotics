// Robotics Documentation - Navigation, Search, Copy, Scroll Spy

(function() {
  // Copy button functionality
  function initCopyButtons() {
    document.querySelectorAll('.docs-section pre').forEach(function(pre) {
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.onclick = function() {
        var code = pre.textContent.replace('Copy', '').replace('Copied!', '').trim();
        navigator.clipboard.writeText(code).then(function() {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function() {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      };
      pre.appendChild(btn);
    });
  }

  // Scroll spy - highlight active TOC item
  function initScrollSpy() {
    var sections = document.querySelectorAll('.docs-section');
    var tocItems = document.querySelectorAll('.toc-item');

    function updateActive() {
      var scrollPos = window.scrollY + 100;
      var activeId = '';

      sections.forEach(function(section) {
        if (section.offsetTop <= scrollPos) {
          activeId = section.id;
        }
      });

      tocItems.forEach(function(item) {
        if (item.getAttribute('href') === '#' + activeId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', updateActive);
    updateActive();
  }

  // Collapsible TOC sections
  function initTocCollapse() {
    document.querySelectorAll('.toc-section-header').forEach(function(header) {
      header.onclick = function() {
        var chevron = header.querySelector('.chevron');
        var items = header.nextElementSibling;
        if (items.classList.contains('collapsed')) {
          items.classList.remove('collapsed');
          items.style.maxHeight = items.scrollHeight + 'px';
          chevron.classList.remove('collapsed');
        } else {
          items.classList.add('collapsed');
          chevron.classList.add('collapsed');
        }
      };

      // Set initial max-height for animation
      var items = header.nextElementSibling;
      if (items && !items.classList.contains('collapsed')) {
        items.style.maxHeight = items.scrollHeight + 'px';
      }
    });
  }

  // Search functionality
  function initSearch() {
    var searchInput = document.getElementById('docsSearch');
    if (!searchInput) return;

    var tocItems = document.querySelectorAll('.toc-item');
    var sections = document.querySelectorAll('.docs-section');

    searchInput.addEventListener('input', function() {
      var query = this.value.toLowerCase().trim();

      if (!query) {
        // Show all
        tocItems.forEach(function(item) { item.classList.remove('hidden'); });
        sections.forEach(function(section) { section.style.display = ''; });
        clearHighlights();
        return;
      }

      // Filter TOC items
      tocItems.forEach(function(item) {
        var text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      // Filter sections
      sections.forEach(function(section) {
        var text = section.textContent.toLowerCase();
        if (text.includes(query)) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });
    });

    // Clear on Escape
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        this.value = '';
        this.dispatchEvent(new Event('input'));
        this.blur();
      }
    });
  }

  function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach(function(el) {
      var parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
  }

  // Mobile sidebar toggle
  function initMobileNav() {
    var toggle = document.querySelector('.sidebar-toggle');
    var sidebar = document.querySelector('.docs-sidebar');

    if (toggle && sidebar) {
      toggle.onclick = function() {
        sidebar.classList.toggle('open');
      };

      // Close sidebar when clicking a link on mobile
      sidebar.querySelectorAll('.toc-item').forEach(function(item) {
        item.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
          }
        });
      });
    }
  }

  // Smooth scroll for TOC links
  function initSmoothScroll() {
    document.querySelectorAll('.toc-item').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', this.getAttribute('href'));
        }
      });
    });
  }

  // Handle hash on load
  function handleHash() {
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(function() {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }

  // Initialize all
  document.addEventListener('DOMContentLoaded', function() {
    initCopyButtons();
    initScrollSpy();
    initTocCollapse();
    initSearch();
    initMobileNav();
    initSmoothScroll();
    handleHash();
  });
})();
