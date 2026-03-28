/**
 * login.js — Lógica del formulario de inicio de sesión
 * Se carga exclusivamente en pages/login.html
 */

// Redirigir si ya hay sesión activa
if (AUTH.isLoggedIn()) {
  window.location.href = '../index.html';
}

// ── Elementos del DOM ──
const emailInput   = document.getElementById('email');
const passInput    = document.getElementById('password');
const loginBtn     = document.getElementById('login-btn');
const errorMsg     = document.getElementById('error-msg');

// ── Permitir login con tecla Enter ──
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') handleLogin();
});

loginBtn.addEventListener('click', handleLogin);

// ── Función principal de login ──
function handleLogin() {
  const email    = emailInput.value.trim();
  const password = passInput.value;

  clearErrors();

  if (!email || !password) {
    showError('Por favor completa todos los campos.');
    if (!email)    emailInput.classList.add('error');
    if (!password) passInput.classList.add('error');
    return;
  }

  setLoading(true);

  // Simular latencia de red — solo educativo
  setTimeout(function () {
    var result = AUTH.login(email, password);

    if (result.success) {
      loginBtn.querySelector('span').textContent = 'ACCEDIENDO ✓';
      setTimeout(function () {
        window.location.href = '../index.html';
      }, 600);
    } else {
      setLoading(false);
      emailInput.classList.add('error');
      passInput.classList.add('error');
      passInput.value = '';
      showError('Credenciales incorrectas. Intenta de nuevo.');
    }
  }, 800);
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add('visible');
}

function clearErrors() {
  errorMsg.classList.remove('visible');
  emailInput.classList.remove('error');
  passInput.classList.remove('error');
}

function setLoading(active) {
  if (active) {
    loginBtn.classList.add('loading');
    loginBtn.querySelector('span').textContent = 'VERIFICANDO...';
  } else {
    loginBtn.classList.remove('loading');
    loginBtn.querySelector('span').textContent = 'INGRESAR';
  }
}