# Migración del Proyecto a React y SCSS

## 1. ¿Qué se ha hecho?
Se ha migrado por completo el proyecto original (que estaba construido en HTML plano, JavaScript vanilla y CSS tradicional) a una arquitectura moderna basada en **React** usando **Vite** como empaquetador y **SCSS** para los estilos. 

Los pasos principales han sido:
1. **Inicialización de Vite:** Se creó la estructura del proyecto React ejecutando `create-vite`.
2. **Modularización en Componentes (React):** Se separó la lógica de una sola página de `index.html` en múltiples componentes de React para facilitar el mantenimiento y la escalabilidad.
3. **Conversión a SCSS:** Se transformó el archivo `styles.css` a `styles.scss`, añadiendo el potencial de SCSS (anidamiento de selectores) y organizando las variables nativas.
4. **Gestión de Estado Centralizada:** Se reemplazó el sistema manual de manipular clases `.active` por un estado Reactivo (`useState`) dentro de `App.jsx`, que controla de manera eficiente qué vista debe renderizarse.
5. **Simulación de Base de Datos:** Se implementó un estado dinámico en el Panel de Administración que permite ver, editar y filtrar los datos de las averías en tiempo real y sin necesidad de recargar la página.

## 2. Estructura del Código: Vistas Reactivas

La aplicación ha sido dividida en vistas modulares ubicadas en la carpeta `src/views/`. Cada componente maneja su propio estado interno de forma independiente y autónoma:

* **`App.jsx`:** Es el enrutador principal.
* **`WelcomeView.jsx`:** Pantalla inicial "Landing".
* **`LoginView.jsx`:** Pantalla de inicio de sesión.
* **`ReportView.jsx`:** Formulario accesible para invitados.
* **`AdminView.jsx`:** Panel de administración interactivo. Filtra averías basándose en el estado interno del componente.
* **`CreateUserView.jsx`:** Formulario para registrar nuevos usuarios.
* **`UsersFaultsView.jsx`:** Lista general de usuarios y sus averías.

## 3. ¿Qué hace y cómo funciona ahora?

Al utilizar **React**, el enfoque cambia de "Manipulación imperativa del DOM" a "Programación declarativa y reactiva":

1. **Eventos Nativos de React (Más Simple y Eficiente):** Se ha simplificado drásticamente el código empleando los eventos nativos de React (`onClick`, `onChange`, `onSubmit`). El código ahora está completamente integrado en el ciclo de vida del componente, sin necesidad de buscar elementos del DOM con selectores arcaicos como `document.getElementById`, lo que lo hace mucho más fácil de leer, mantener y con un rendimiento superior.
2. **Navegación Fluida:** Ya no estamos ocultando bloques con `display: none`. Cuando cambias de vista, React monta y desmonta el HTML dinámicamente en memoria, lo que hace la aplicación extremadamente rápida y ligera.
3. **Interactividad Optimizada:** En el componente `AdminView`, tenemos un estado `averias` y lo filtramos mediante funciones de array (`.filter`, `.map`) según las reglas dadas. El HTML se vuelve a pintar instantáneamente mostrando sólo lo necesario.
4. **Control de Formularios y Botones:** Ahora cada formulario gestiona un pequeño estado llamado `cargando`. Al hacer clic, los botones se deshabilitan para evitar dobles envíos y muestran "Verificando..." o "Enviando...", dándole al usuario retroalimentación real (UX).
5. **Estilos y Mantenimiento:** Al emplear SCSS, hemos podido estructurar los componentes de CSS anidando propiedades, reduciendo considerablemente el código CSS y previniendo bugs de diseño a futuro.

En conclusión, la aplicación hace visualmente y funcionalmente lo mismo que la versión original, pero ahora tiene una base tecnológica robusta, simple y escalable que permitiría conectarlo a una base de datos real o API REST muy fácilmente.
