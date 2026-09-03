(function () {
  'use strict';

  var siteBrand = document.getElementById('siteBrand');
  var heroTitle = document.getElementById('heroTitle');
  var heroDesc = document.getElementById('heroDesc');
  var siteNav = document.getElementById('siteNav');
  var pageContent = document.getElementById('pageContent');

  var data = CmsData.load();

  function navPages() {
    return data.pages
      .filter(function (p) { return p.published && p.showInNav; })
      .slice()
      .sort(function (a, b) { return a.navOrder - b.navOrder; });
  }

  // Only ever resolves a page that is actually published — a page being
  // hidden from the nav (showInNav:false) or unpublished must not be
  // reachable by guessing its slug in the URL hash.
  function findPublishedPageBySlug(slug) {
    return data.pages.find(function (p) { return p.slug === slug && p.published; });
  }

  function renderHeader() {
    document.title = data.settings.siteName + ' - 官方网站';
    siteBrand.innerHTML = escapeHtml(data.settings.siteName.slice(0, 2)) + '<span class="accent">' + escapeHtml(data.settings.siteName.slice(2)) + '</span>';
    heroTitle.textContent = data.settings.siteName;
    heroDesc.textContent = data.settings.siteDescription;
  }

  function renderNav(activeSlug) {
    var pages = navPages();
    siteNav.innerHTML = pages.map(function (p) {
      var cls = 'site-nav__item' + (p.slug === activeSlug ? ' active' : '');
      return '<a class="' + cls + '" href="#' + encodeURIComponent(p.slug) + '" data-slug="' + p.slug + '">' + escapeHtml(p.title) + '</a>';
    }).join('');
  }

  function renderPage(page) {
    var paragraphs = page.content.split('\n').filter(function (line) { return line.length > 0; });
    pageContent.innerHTML = '<h2>' + escapeHtml(page.title) + '</h2>' +
      paragraphs.map(function (line) { return '<p>' + escapeHtml(line) + '</p>'; }).join('');
  }

  function renderNotFound() {
    pageContent.innerHTML = '<div class="not-found"><h2>页面不存在</h2><p>抱歉，你访问的页面不存在，或者尚未发布。请从上方导航栏选择一个页面。</p></div>';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function route() {
    // Re-read settings/nav-affecting bits each time so admin edits made in
    // another tab and saved to localStorage are picked up on next render.
    data = CmsData.load();
    renderHeader();

    var rawHash = location.hash.slice(1);
    var slug = rawHash ? decodeURIComponent(rawHash) : '';

    if (!slug) {
      var first = navPages()[0];
      if (first) {
        slug = first.slug;
      } else {
        renderNav('');
        renderNotFound();
        return;
      }
    }

    var page = findPublishedPageBySlug(slug);
    renderNav(page ? page.slug : '');
    if (page) {
      renderPage(page);
    } else {
      renderNotFound();
    }
  }

  window.addEventListener('hashchange', route);
  route();
})();
