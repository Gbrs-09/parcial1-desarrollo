/**
 * products.js — Módulo de Productos
 * Carga, renderiza y filtra productos desde el JSON.
 */

var PRODUCTS = {
  allProducts:   [],
  currentFilter: { category: 'Todos', tag: 'Todos' },
  _toastTimer:   null,

  init: function () {
    var self = this;
    return fetch('data/products.json')
      .then(function (res) {
        if (!res.ok) throw new Error('No se pudo cargar productos');
        return res.json();
      })
      .then(function (data) {
        self.allProducts = data;
        self.render();
      })
      .catch(function (err) {
        console.error('[PRODUCTS]', err);
        var grid = document.getElementById('products-grid');
        if (grid) grid.innerHTML = '<p style="color:var(--muted);font-family:var(--font-mono);font-size:12px;padding:40px;">Error cargando productos.</p>';
      });
  },

  getFiltered: function () {
    var cat = this.currentFilter.category;
    var tag = this.currentFilter.tag;
    return this.allProducts.filter(function (p) {
      var okCat = cat === 'Todos' || p.category === cat;
      var okTag = tag === 'Todos' || p.tag === tag;
      return okCat && okTag;
    });
  },

  render: function () {
    var grid    = document.getElementById('products-grid');
    var countEl = document.getElementById('products-count');
    if (!grid) return;

    var filtered = this.getFiltered();
    if (countEl) countEl.textContent = filtered.length + ' productos';

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="no-results">SIN RESULTADOS PARA ESTE FILTRO</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (p, i) {
      return PRODUCTS.cardTemplate(p, i);
    }).join('');

    // Bind botones agregar
    grid.querySelectorAll('.product-add-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(btn.dataset.id);
        var product = PRODUCTS.allProducts.find(function (p) { return p.id === id; });
        if (product) CART.add(product);
      });
    });
  },

  cardTemplate: function (product, index) {
    var tagOverlay = product.tag
      ? '<span class="product-tag-overlay">' + product.tag + '</span>'
      : '';

    var price = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(product.price);

    return '<article class="product-card" style="animation-delay:' + (index * 0.07) + 's">'
      + '<div class="product-img-wrapper">'
      + '<img class="product-img" src="' + product.image + '" alt="' + product.name + '" loading="lazy" />'
      + tagOverlay
      + '</div>'
      + '<div class="product-card-body">'
      + '<h3 class="product-name">' + product.name + '</h3>'
      + '<p class="product-category">' + product.category + '</p>'
      + '<p class="product-desc">' + product.description + '</p>'
      + '<div class="product-footer">'
      + '<span class="product-price">' + price + '</span>'
      + '<button class="product-add-btn" data-id="' + product.id + '">+ AGREGAR</button>'
      + '</div>'
      + '</div>'
      + '</article>';
  },

  filterByCategory: function (category) {
    this.currentFilter.category = category;
    this.render();
  },

  filterByTag: function (tag) {
    this.currentFilter.tag = tag;
    this.render();
  },

  showToast: function (message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2500);
  }
};