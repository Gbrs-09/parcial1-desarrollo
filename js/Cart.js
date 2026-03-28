/**
 * cart.js — Módulo del Carrito de Compras
 *
 * Gestiona el estado del carrito, el panel lateral y el resumen de compra.
 */

var CART = {
  items: [],   // [{ product, qty }]

  // ── Abrir / cerrar panel ──
  open: function () {
    document.getElementById('cart-panel').classList.add('open');
    document.getElementById('cart-overlay').classList.add('visible');
    this.render();
  },

  close: function () {
    document.getElementById('cart-panel').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('visible');
  },

  toggle: function () {
    var panel = document.getElementById('cart-panel');
    if (panel.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  },

  // ── Agregar producto ──
  add: function (product) {
    var existing = this.items.find(function (i) { return i.product.id === product.id; });
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ product: product, qty: 1 });
    }
    this.updateBadge();
    this.render();
    PRODUCTS.showToast(product.name + ' agregado al carrito');
  },

  // ── Quitar una unidad ──
  decrease: function (productId) {
    var idx = this.items.findIndex(function (i) { return i.product.id === productId; });
    if (idx === -1) return;
    this.items[idx].qty -= 1;
    if (this.items[idx].qty <= 0) {
      this.items.splice(idx, 1);
    }
    this.updateBadge();
    this.render();
  },

  // ── Eliminar producto completo ──
  remove: function (productId) {
    this.items = this.items.filter(function (i) { return i.product.id !== productId; });
    this.updateBadge();
    this.render();
  },

  // ── Vaciar carrito ──
  clear: function () {
    this.items = [];
    this.updateBadge();
    this.render();
  },

  // ── Total ──
  getTotal: function () {
    return this.items.reduce(function (sum, i) {
      return sum + (i.product.price * i.qty);
    }, 0);
  },

  // ── Cantidad total de unidades ──
  getTotalQty: function () {
    return this.items.reduce(function (sum, i) { return sum + i.qty; }, 0);
  },

  // ── Formatear precio ──
  formatPrice: function (value) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  },

  // ── Actualizar badge del header ──
  updateBadge: function () {
    var badge = document.getElementById('cart-count');
    if (badge) badge.textContent = this.getTotalQty();
  },

  // ── Renderizar panel ──
  render: function () {
    var container  = document.getElementById('cart-items');
    var subtotalEl = document.getElementById('cart-subtotal');
    var totalEl    = document.getElementById('cart-total');
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = this.emptyTemplate();
    } else {
      container.innerHTML = this.items.map(function (item) {
        return CART.itemTemplate(item);
      }).join('');
    }

    var total = this.getTotal();
    if (subtotalEl) subtotalEl.textContent = this.formatPrice(total);
    if (totalEl)    totalEl.textContent    = this.formatPrice(total);

    this.bindItemEvents();
  },

  // ── Plantilla ítem ──
  itemTemplate: function (item) {
    return '<div class="cart-item" data-id="' + item.product.id + '">'
      + '<div class="cart-item-img-wrap">'
      + '<img class="cart-item-img" src="' + item.product.image + '" alt="' + item.product.name + '" />'
      + '</div>'
      + '<div class="cart-item-info">'
      + '<p class="cart-item-name">' + item.product.name + '</p>'
      + '<p class="cart-item-price">' + this.formatPrice(item.product.price) + '</p>'
      + '</div>'
      + '<div class="cart-item-controls">'
      + '<button class="cart-qty-btn cart-decrease" data-id="' + item.product.id + '">−</button>'
      + '<span class="cart-qty">' + item.qty + '</span>'
      + '<button class="cart-qty-btn cart-increase" data-id="' + item.product.id + '">+</button>'
      + '</div>'
      + '<button class="cart-remove-btn" data-id="' + item.product.id + '">'
      + '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">'
      + '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
      + '</svg></button>'
      + '</div>';
  },

  // ── Plantilla vacío ──
  emptyTemplate: function () {
    return '<div class="cart-empty">'
      + '<span class="cart-empty-icon">◻</span>'
      + '<p>Tu carrito está vacío</p>'
      + '<span>Agrega productos del catálogo</span>'
      + '</div>';
  },

  // ── Bind eventos de los ítems ──
  bindItemEvents: function () {
    var self = this;

    document.querySelectorAll('.cart-increase').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(btn.dataset.id);
        var item = self.items.find(function (i) { return i.product.id === id; });
        if (item) { item.qty += 1; self.updateBadge(); self.render(); }
      });
    });

    document.querySelectorAll('.cart-decrease').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.decrease(parseInt(btn.dataset.id));
      });
    });

    document.querySelectorAll('.cart-remove-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.remove(parseInt(btn.dataset.id));
      });
    });
  },

  // ── Inicializar eventos del panel ──
  initEvents: function () {
    var self = this;

    var closeBtn = document.getElementById('cart-close-btn');
    var overlay  = document.getElementById('cart-overlay');
    var clearBtn = document.getElementById('btn-clear-cart');
    var checkout = document.getElementById('btn-checkout');

    if (closeBtn) closeBtn.addEventListener('click', function () { self.close(); });
    if (overlay)  overlay.addEventListener('click',  function () { self.close(); });
    if (clearBtn) clearBtn.addEventListener('click', function () { self.clear(); });

    if (checkout) {
      checkout.addEventListener('click', function () {
        if (self.items.length === 0) {
          PRODUCTS.showToast('El carrito está vacío');
          return;
        }
        PRODUCTS.showToast('¡Compra realizada! Gracias 🖤');
        self.clear();
        self.close();
      });
    }
  }
};