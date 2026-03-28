/**
 * auth.js — Módulo de Autenticación
 *
 * AVISO EDUCATIVO: Las credenciales están "quemadas" en el código
 * únicamente con fines de aprendizaje. En producción, la autenticación
 * debe manejarse en el servidor con contraseñas hasheadas.
 */

var AUTH = {
  VALID_EMAIL:   'admin@blackstore.com',
  VALID_PASSWORD: 'black2024',
  SESSION_KEY:   'blackstore_session',

  login: function (email, password) {
    if (email === this.VALID_EMAIL && password === this.VALID_PASSWORD) {
      var session = {
        user:      email,
        loginTime: Date.now(),
        expires:   Date.now() + (2 * 60 * 60 * 1000)
      };
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return { success: true };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  },

  logout: function () {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'pages/login.html';
  },

  logoutFromPages: function () {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = '../pages/login.html';
  },

  isLoggedIn: function () {
    try {
      var raw     = sessionStorage.getItem(this.SESSION_KEY);
      if (!raw) return false;
      var session = JSON.parse(raw);
      if (Date.now() > session.expires) {
        sessionStorage.removeItem(this.SESSION_KEY);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  requireAuth: function () {
    if (!this.isLoggedIn()) {
      window.location.href = 'pages/login.html';
    }
  }
};