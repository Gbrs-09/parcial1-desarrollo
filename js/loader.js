/**
 * loader.js — Carga dinámica de fragmentos HTML (header, sidebar, footer)
 * Usa Fetch API para inyectar componentes reutilizables en el DOM.
 */

var LOADER = {
  loadComponent: function (selector, path, callback) {
    var container = document.querySelector(selector);
    if (!container) return Promise.resolve();

    return fetch(path)
      .then(function (res) {
        if (!res.ok) throw new Error('Error ' + res.status + ': ' + path);
        return res.text();
      })
      .then(function (html) {
        container.innerHTML = html;
        if (typeof callback === 'function') callback();
      })
      .catch(function (err) {
        console.error('[LOADER]', err);
        container.innerHTML = '<div style="color:var(--red);font-size:11px;padding:8px;">Error: ' + path + '</div>';
      });
  },

  loadAll: function (basePath) {
    basePath = basePath || '';
    var self = this;

    return Promise.all([
      self.loadComponent('#header-placeholder',  basePath + 'components/header.html',  function () { self.initHeader(); }),
      self.loadComponent('#sidebar-placeholder', basePath + 'components/sidebar.html', function () { self.initSidebar(); }),
      self.loadComponent('#footer-placeholder',  basePath + 'components/footer.html')
    ]);
  },

  initHeader: function () {
    // Botón carrito en el header
    var cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', function () { CART.toggle(); });
    }

    // Botón logout en el header
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () { AUTH.logout(); });
    }

    // Actualizar badge tras cargar header
    CART.updateBadge();
  },

  initSidebar: function () {
    // Filtros de categoría
    var categoryLinks = document.querySelectorAll('#category-nav a[data-filter]');
    categoryLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        PRODUCTS.filterByCategory(link.dataset.filter);
        categoryLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      });
    });

    // Filtros de tag
    var tagBtns = document.querySelectorAll('#tag-filters .filter-tag');
    tagBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        PRODUCTS.filterByTag(btn.dataset.tag);
        tagBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    // Logout en sidebar
    var sidebarLogout = document.getElementById('sidebar-logout');
    if (sidebarLogout) {
      sidebarLogout.addEventListener('click', function (e) {
        e.preventDefault();
        AUTH.logout();
      });
    }
  }
};