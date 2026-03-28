/**
 * main.js — Punto de entrada de la página principal (index.html)
 * Orquesta la inicialización de todos los módulos.
 */

// 1. Verificar autenticación
AUTH.requireAuth();

// 2. Inicializar eventos del carrito (panel)
CART.initEvents();

// 3. Cargar componentes y luego inicializar productos
LOADER.loadAll()
  .then(function () {
    return PRODUCTS.init();
  })
  .catch(function (err) {
    console.error('[MAIN] Error de inicialización:', err);
  });