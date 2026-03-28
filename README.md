# BLACKSTORE 🖤

> Tienda de moda urbana — todo en negro, sin excepciones.
> Proyecto académico de desarrollo web frontend con arquitectura modular.

---

## Índice

1. [¿Qué es la Modularización?](#1-qué-es-la-modularización)
2. [Estructura de carpetas](#2-estructura-de-carpetas)
3. [Formulario de inicio de sesión](#3-formulario-de-inicio-de-sesión)
4. [Fragmentos reutilizables](#4-fragmentos-reutilizables)
5. [Página principal modular](#5-página-principal-modular)
6. [Catálogo de productos con JSON](#6-catálogo-de-productos-con-json)
7. [Carrito de compras](#7-carrito-de-compras)
8. [Cómo ejecutar el proyecto](#8-cómo-ejecutar-el-proyecto)
9. [Tecnologías utilizadas](#9-tecnologías-utilizadas)
10. [Aviso de seguridad](#10-aviso-de-seguridad)

---

## 1. ¿Qué es la Modularización?

La **modularización** es el principio de dividir un sistema grande en partes más pequeñas, independientes y reutilizables llamadas **módulos**. En desarrollo web, esto significa separar el código en archivos distintos según su responsabilidad, en lugar de poner todo en un solo archivo.

### ¿Por qué es importante?

| Beneficio | Descripción |
|-----------|-------------|
| **Mantenibilidad** | Es más fácil encontrar y corregir errores cuando el código está organizado por partes. Si hay un bug en el carrito, sabes que debes ir a `Cart.js`. |
| **Reutilización** | Un componente como el header o footer se escribe una vez y se usa en todas las páginas sin repetir código. |
| **Escalabilidad** | Agregar nuevas funcionalidades (por ejemplo, una página de perfil) no afecta el resto del sistema. |
| **Colaboración** | Varios desarrolladores pueden trabajar en módulos distintos al mismo tiempo sin generar conflictos. |
| **Legibilidad** | El código separado por responsabilidades es más fácil de leer, entender y documentar. |

### Ejemplo aplicado en BLACKSTORE

En lugar de tener un único archivo `index.html` con cientos de líneas que mezcle estilos, lógica y estructura, el proyecto separa cada responsabilidad:

- **HTML** → estructura de cada página
- **CSS** → estilos globales, de login y de la página principal por separado
- **JS** → cada funcionalidad en su propio módulo (`auth.js`, `Cart.js`, `products.js`, etc.)
- **Componentes** → fragmentos HTML reutilizables que se inyectan dinámicamente
- **Datos** → la información de los productos vive en un archivo JSON independiente

---

## 2. Estructura de carpetas

```
BLACKSTORE/
│
├── index.html                 ← Página principal
├── login.html                 ← Formulario de inicio de sesión
├── README.md                  ← Este documento
│
├── components/                ← Fragmentos HTML reutilizables
│   ├── header.html            ← Encabezado con logo y botones de acción
│   ├── footer.html            ← Pie de página con derechos reservados
│   └── sidebar.html           ← Barra lateral con menú y filtros
│
├── css/                       ← Hojas de estilo separadas por contexto
│   ├── global.css             ← Variables CSS, reset y estilos base
│   ├── login.css              ← Estilos exclusivos del formulario de login
│   └── main.css               ← Estilos de la página principal y carrito
│
├── js/                        ← Módulos JavaScript con responsabilidad única
│   ├── auth.js                ← Lógica de autenticación y sesión
│   ├── Cart.js                ← Estado y renderizado del carrito de compras
│   ├── loader.js              ← Carga dinámica de componentes HTML
│   ├── login.js               ← Manejo del formulario de login
│   ├── Main.js                ← Punto de entrada: orquesta todos los módulos
│   └── products.js            ← Carga, filtrado y renderizado de productos
│
└── data/
    └── products.json          ← Datos del catálogo en formato JSON
```

### ¿Por qué esta separación?

Cada carpeta agrupa archivos por **tipo de responsabilidad**:

- `components/` → lo que se *ve* y se reutiliza entre páginas
- `css/` → cómo se *diseña* cada parte de la aplicación
- `js/` → cómo *funciona* cada módulo de la aplicación
- `data/` → la *información* que maneja la aplicación, separada de la lógica

---

## 3. Formulario de inicio de sesión

### ¿Qué hace?

El archivo `login.html` presenta un formulario con campos de correo electrónico y contraseña. Al enviarlo, el módulo `login.js` valida las credenciales contra los valores definidos en `auth.js`.

### Flujo de autenticación

```
Usuario ingresa email + contraseña
           │
           ▼
    login.js captura el submit
           │
           ▼
    AUTH.login(email, password)
           │
     ┌─────┴─────┐
   Correcto    Incorrecto
     │              │
     ▼              ▼
Guarda sesión   Muestra mensaje
en sessionStorage   de error en pantalla
     │
     ▼
Redirige a index.html
```

### Credenciales de prueba

```
Correo:     admin@blackstore.com
Contraseña: black2024
```

### Gestión de sesión

- La sesión se guarda en `sessionStorage` con un tiempo de expiración de **2 horas**.
- Si el usuario intenta acceder a `index.html` sin sesión activa, `auth.js` lo redirige automáticamente al login.
- Al cerrar sesión (botón en el header o en la barra lateral), se elimina la sesión y se redirige al login.

### ⚠️ Aviso educativo

> Las credenciales están escritas directamente en el código JavaScript. Esto se hace **únicamente con fines educativos** para demostrar el flujo de autenticación en el frontend. Ver la sección [Aviso de seguridad](#10-aviso-de-seguridad) para más detalles.

---

## 4. Fragmentos reutilizables

### ¿Qué son los fragmentos?

Los fragmentos (o componentes) son archivos HTML parciales que contienen solo una sección de la interfaz. No son páginas completas — no tienen `<html>`, `<head>` ni `<body>`. Se cargan dinámicamente dentro de las páginas que los necesitan.

### Componentes disponibles

#### `components/header.html`
Contiene el encabezado de la aplicación con:
- **Nombre del negocio** (`BLACKSTORE`) como enlace a la página principal
- Menú de navegación con enlaces principales
- Botones de acción: buscar, abrir carrito y cerrar sesión

#### `components/footer.html`
Contiene el pie de página con:
- Nombre de la marca
- Texto de **derechos reservados**: `© 2024 BLACKSTORE — Todos los derechos reservados`
- Enlaces a Privacidad, Términos y Contacto

#### `components/sidebar.html`
Contiene la barra lateral izquierda con:
- **Menú lateral de navegación** con enlaces a Inicio, Catálogo, Novedades y Favoritos
- Filtros de categoría: Todos, Hoodies, Camisetas, Pantalones, Chaquetas
- Filtros por etiqueta: NUEVO, TOP, ÚLTIMO
- Opción de cerrar sesión

### Carga dinámica con JavaScript

El módulo `loader.js` usa la **Fetch API** para cargar cada fragmento e inyectarlo en el DOM:

```javascript
// Ejemplo simplificado de cómo funciona loader.js
fetch('components/header.html')
  .then(response => response.text())
  .then(html => {
    document.querySelector('#header-placeholder').innerHTML = html;
  });
```

En `index.html` existen elementos contenedores vacíos que sirven como destino de cada fragmento:

```html
<div id="header-placeholder"></div>
<div id="sidebar-placeholder"></div>
<div id="footer-placeholder"></div>
```

Después de inyectar cada componente, `loader.js` ejecuta una función de inicialización para activar los eventos de ese componente (por ejemplo, conectar el botón del carrito al módulo `Cart.js`).

---

## 5. Página principal modular

### Integración de componentes

La página `index.html` integra todos los elementos de la interfaz de manera modular:

```
index.html
│
├── #header-placeholder    → carga components/header.html
├── #sidebar-placeholder   → carga components/sidebar.html
│
├── .app-shell             → contenedor del layout principal (CSS Grid)
│   └── .site-main         → sección central de contenido
│       ├── .hero-banner   → banner de bienvenida
│       └── #catalogo      → grid de productos
│
├── #footer-placeholder    → carga components/footer.html
│
├── #cart-overlay          → fondo oscuro del carrito
└── #cart-panel            → panel lateral del carrito
```

### Orden de inicialización (`Main.js`)

```javascript
// 1. Verificar que el usuario tenga sesión activa
AUTH.requireAuth();

// 2. Inicializar eventos del panel del carrito
CART.initEvents();

// 3. Cargar los fragmentos HTML y luego inicializar el catálogo
LOADER.loadAll()
  .then(() => PRODUCTS.init());
```

### Coherencia de diseño

Todos los componentes comparten:
- Las **variables CSS** definidas en `global.css` (colores, tipografías, espaciados)
- La misma paleta de color: fondo negro, texto blanco, acentos en gris
- Las fuentes: `Bebas Neue` para títulos, `Space Mono` para datos, `Inter` para texto general

---

## 6. Catálogo de productos con JSON

### Estructura del archivo `data/products.json`

Los productos se almacenan como un arreglo de objetos JSON. Cada producto tiene la siguiente forma:

```json
{
  "id": 1,
  "name": "Hoodie Obsidian",
  "category": "Hoodies",
  "price": 189000,
  "description": "Hoodie oversized en algodón pesado.",
  "tag": "NUEVO",
  "image": "https://..."
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | número | Identificador único del producto |
| `name` | string | Nombre del producto |
| `category` | string | Categoría: Hoodies, Camisetas, Pantalones, Chaquetas |
| `price` | número | Precio en pesos colombianos (COP) |
| `description` | string | Descripción breve del material y corte |
| `tag` | string \| null | Etiqueta destacada: NUEVO, TOP, AGOTÁNDOSE o null |
| `image` | string | URL de la imagen del producto |

### Cómo se cargan los productos

El módulo `products.js` hace una petición con `fetch()` al archivo JSON, construye las tarjetas de producto dinámicamente y las inserta en el grid del catálogo:

```javascript
fetch('data/products.json')
  .then(response => response.json())
  .then(products => {
    // Renderizar cada producto como una tarjeta HTML
  });
```

### Filtros disponibles

- **Por categoría**: filtra productos según su campo `category`
- **Por etiqueta**: filtra productos según su campo `tag`
- Los filtros se activan desde la barra lateral y actualizan el grid en tiempo real

---

## 7. Carrito de compras

El módulo `Cart.js` gestiona el estado del carrito completamente en memoria (sin backend). Sus funciones principales:

| Función | Descripción |
|---------|-------------|
| `CART.add(product)` | Agrega un producto o incrementa su cantidad |
| `CART.decrease(id)` | Reduce en 1 la cantidad de un producto |
| `CART.remove(id)` | Elimina completamente un producto del carrito |
| `CART.clear()` | Vacía todo el carrito |
| `CART.open() / close()` | Muestra u oculta el panel lateral |
| `CART.render()` | Actualiza el HTML del panel con el estado actual |

Los precios se formatean en pesos colombianos usando la API nativa del navegador:

```javascript
new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(precio);
```

---

## 8. Cómo ejecutar el proyecto

> El proyecto usa `fetch()` para cargar los componentes y el JSON, lo que requiere un servidor local. **No funciona** abriendo `index.html` directamente desde el explorador de archivos.

### Opción 1 — Live Server (recomendado para VS Code)

1. Instalar la extensión **Live Server** en VS Code
2. Abrir la carpeta del proyecto
3. Clic derecho sobre `login.html` → **Open with Live Server**

### Opción 2 — Python

```bash
# Desde la carpeta del proyecto:
python -m http.server 5502
# Luego abrir: http://localhost:5502/login.html
```

### Opción 3 — Node.js

```bash
npx serve .
# Luego abrir la URL que indique la terminal
```

### Flujo de uso

```
Abrir login.html
      │
      ▼
Ingresar credenciales:
admin@blackstore.com / black2024
      │
      ▼
Redirige automáticamente a index.html
      │
      ▼
Explorar catálogo → agregar productos → ver carrito
```

---

## 9. Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|------------|-------------------|
| **HTML5 semántico** | Estructura de páginas con etiquetas como `<header>`, `<aside>`, `<main>`, `<footer>` |
| **CSS3** | Variables (`custom properties`), Flexbox, CSS Grid, animaciones y media queries |
| **JavaScript ES6+** | Módulos con objeto literal, arrow functions, template literals, `Array.map/filter/find` |
| **Fetch API** | Carga dinámica de componentes HTML y del archivo JSON de productos |
| **sessionStorage** | Persistencia de la sesión de usuario en el navegador durante la visita |
| **Intl.NumberFormat** | Formateo de precios en pesos colombianos (COP) |
| **Google Fonts** | Tipografías: Bebas Neue, Space Mono, Inter |

---

## 10. Aviso de seguridad

> ### ⚠️ Solo para fines educativos
>
> El sistema de autenticación de este proyecto almacena las credenciales directamente en el código JavaScript (`auth.js`). Cualquier persona que inspeccione el código fuente del navegador puede ver el usuario y la contraseña.
>
> **Esto NO debe hacerse en aplicaciones reales.** En un entorno de producción, la autenticación debe:
>
> - Manejarse en un **servidor backend** (Node.js, Django, Laravel, etc.)
> - Transmitirse siempre mediante **HTTPS**
> - Almacenar contraseñas como **hashes con salt** (bcrypt, Argon2, etc.) — nunca en texto plano
> - Usar tokens seguros (**JWT**, sesiones del servidor) para mantener la autenticación
> - Nunca exponer credenciales en el código que se envía al navegador
>
> El objetivo de este proyecto es demostrar la **estructura modular** del frontend y el flujo de navegación con autenticación, no implementar seguridad real.

---

*Proyecto académico — Desarrollo Web Frontend*