(function () {
  'use strict';

  var data = CmsData.load();

  var sideLinks = document.querySelectorAll('.side-link[data-view]');
  var views = document.querySelectorAll('.admin-view');

  function switchView(name) {
    sideLinks.forEach(function (l) { l.classList.toggle('active', l.dataset.view === name); });
    views.forEach(function (v) { v.classList.toggle('active', v.id === 'view-' + name); });
    if (name === 'dashboard') renderDashboard();
    if (name === 'pages') renderPages();
    if (name === 'settings') renderSettings();
  }

  sideLinks.forEach(function (l) {
    l.addEventListener('click', function () { switchView(l.dataset.view); });
  });

  document.getElementById('btnResetData').addEventListener('click', function () {
    if (!confirm('确定要重置成示例数据吗？这会清空你新增/修改的所有内容。')) return;
    data = CmsData.reset();
    switchView('dashboard');
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- Dashboard ----------
  function renderDashboard() {
    var total = data.pages.length;
    var publishedCount = data.pages.filter(function (p) { return p.published; }).length;
    var inNavCount = data.pages.filter(function (p) { return p.published && p.showInNav; }).length;

    var stats = [
      { label: '页面总数', value: total },
      { label: '已发布页面', value: publishedCount },
      { label: '显示于导航', value: inNavCount },
      { label: '未发布页面', value: total - publishedCount },
    ];
    document.getElementById('statGrid').innerHTML = stats.map(function (s) {
      return '<div class="stat-card"><div class="num">' + s.value + '</div><div class="label">' + s.label + '</div></div>';
    }).join('');

    var recent = data.pages.slice().sort(function (a, b) { return a.updatedAt < b.updatedAt ? 1 : -1; }).slice(0, 6);
    document.getElementById('recentPagesBody').innerHTML = recent.map(function (p) {
      return '<tr><td>' + escapeHtml(p.title) + '</td>' +
        '<td><span class="badge ' + (p.published ? 'published' : 'unpublished') + '">' + (p.published ? '已发布' : '未发布') + '</span></td>' +
        '<td>' + p.updatedAt + '</td></tr>';
    }).join('') || '<tr><td colspan="3" style="color:var(--muted)">暂无页面</td></tr>';
  }

  // ---------- Pages ----------
  var pageModalBackdrop = document.getElementById('pageModalBackdrop');
  var pageModalTitle = document.getElementById('pageModalTitle');
  var pageModalMsg = document.getElementById('pageModalMsg');
  var pageForm = document.getElementById('pageForm');
  var pageIdInput = document.getElementById('pageIdInput');
  var pageTitleInput = document.getElementById('pageTitleInput');
  var pageSlugInput = document.getElementById('pageSlugInput');
  var pageContentInput = document.getElementById('pageContentInput');
  var pageNavOrderInput = document.getElementById('pageNavOrderInput');
  var pageShowInNavInput = document.getElementById('pageShowInNavInput');
  var pagePublishedInput = document.getElementById('pagePublishedInput');

  function renderPages() {
    var sorted = data.pages.slice().sort(function (a, b) { return a.navOrder - b.navOrder; });
    document.getElementById('pagesBody').innerHTML = sorted.map(function (p) {
      return '<tr><td>' + escapeHtml(p.title) + '</td><td>' + escapeHtml(p.slug) + '</td><td>' + p.navOrder + '</td>' +
        '<td>' + (p.showInNav ? '是' : '否') + '</td>' +
        '<td><span class="badge ' + (p.published ? 'published' : 'unpublished') + '">' + (p.published ? '已发布' : '未发布') + '</span></td>' +
        '<td class="table-actions">' +
        '<button class="btn btn-sm" data-edit="' + p.id + '">编辑</button>' +
        '<button class="btn btn-sm btn-danger" data-delete="' + p.id + '">删除</button>' +
        '</td></tr>';
    }).join('') || '<tr><td colspan="6" style="color:var(--muted)">暂无页面</td></tr>';

    document.querySelectorAll('[data-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () { openPageModal(btn.dataset.edit); });
    });
    document.querySelectorAll('[data-delete]').forEach(function (btn) {
      btn.addEventListener('click', function () { deletePage(btn.dataset.delete); });
    });
  }

  function openPageModal(id) {
    pageModalMsg.innerHTML = '';
    pageForm.reset();
    pageShowInNavInput.checked = true;
    pagePublishedInput.checked = true;
    if (id) {
      var p = data.pages.find(function (x) { return x.id === id; });
      pageModalTitle.textContent = '编辑页面';
      pageIdInput.value = p.id;
      pageTitleInput.value = p.title;
      pageSlugInput.value = p.slug;
      pageContentInput.value = p.content || '';
      pageNavOrderInput.value = p.navOrder;
      pageShowInNavInput.checked = !!p.showInNav;
      pagePublishedInput.checked = !!p.published;
    } else {
      pageModalTitle.textContent = '新增页面';
      pageIdInput.value = '';
      pageNavOrderInput.value = data.pages.length;
    }
    pageModalBackdrop.classList.add('show');
  }

  document.getElementById('btnAddPage').addEventListener('click', function () { openPageModal(null); });
  document.getElementById('btnClosePageModal').addEventListener('click', function () { pageModalBackdrop.classList.remove('show'); });
  pageModalBackdrop.addEventListener('click', function (e) { if (e.target === pageModalBackdrop) pageModalBackdrop.classList.remove('show'); });

  pageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = pageTitleInput.value.trim();
    var slug = pageSlugInput.value.trim().toLowerCase();
    var content = pageContentInput.value.trim();
    var navOrder = parseInt(pageNavOrderInput.value, 10);
    var showInNav = pageShowInNavInput.checked;
    var published = pagePublishedInput.checked;
    var id = pageIdInput.value;

    if (!title || !slug) {
      pageModalMsg.innerHTML = '<div class="msg error">请填写页面标题和 Slug。</div>';
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      pageModalMsg.innerHTML = '<div class="msg error">Slug 只能包含小写字母、数字和短横线（例如 about-us）。</div>';
      return;
    }
    if (isNaN(navOrder)) {
      pageModalMsg.innerHTML = '<div class="msg error">导航顺序需要是一个数字。</div>';
      return;
    }

    var duplicate = data.pages.some(function (p) { return p.slug === slug && p.id !== id; });
    if (duplicate) {
      pageModalMsg.innerHTML = '<div class="msg error">Slug "' + escapeHtml(slug) + '" 已被其他页面使用，请换一个。</div>';
      return;
    }

    if (id) {
      var p = data.pages.find(function (x) { return x.id === id; });
      p.title = title; p.slug = slug; p.content = content; p.navOrder = navOrder;
      p.showInNav = showInNav; p.published = published; p.updatedAt = CmsData.todayStr();
    } else {
      data.pages.push({
        id: CmsData.uid('pg'), title: title, slug: slug, content: content, navOrder: navOrder,
        showInNav: showInNav, published: published, updatedAt: CmsData.todayStr(),
      });
    }
    CmsData.save(data);
    pageModalBackdrop.classList.remove('show');
    renderPages();
  });

  function deletePage(id) {
    if (!confirm('确定删除这个页面吗？该操作无法撤销。')) return;
    data.pages = data.pages.filter(function (p) { return p.id !== id; });
    CmsData.save(data);
    renderPages();
  }

  // ---------- Settings ----------
  var settingsForm = document.getElementById('settingsForm');
  var settingsMsg = document.getElementById('settingsMsg');
  var siteNameInput = document.getElementById('siteNameInput');
  var siteDescInput = document.getElementById('siteDescInput');
  var contactPhoneInput = document.getElementById('contactPhoneInput');
  var contactEmailInput = document.getElementById('contactEmailInput');

  function renderSettings() {
    settingsMsg.innerHTML = '';
    siteNameInput.value = data.settings.siteName;
    siteDescInput.value = data.settings.siteDescription;
    contactPhoneInput.value = data.settings.contactPhone || '';
    contactEmailInput.value = data.settings.contactEmail || '';
  }

  settingsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var siteName = siteNameInput.value.trim();
    var siteDescription = siteDescInput.value.trim();
    if (!siteName || !siteDescription) {
      settingsMsg.innerHTML = '<div class="msg error">网站名称和网站简介不能为空。</div>';
      return;
    }
    data.settings.siteName = siteName;
    data.settings.siteDescription = siteDescription;
    data.settings.contactPhone = contactPhoneInput.value.trim();
    data.settings.contactEmail = contactEmailInput.value.trim();
    CmsData.save(data);
    settingsMsg.innerHTML = '<div class="msg success">站点设置已保存，前台将在下次访问时显示最新内容。</div>';
  });

  switchView('dashboard');
})();
