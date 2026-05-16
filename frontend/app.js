/**
 * Lógica básica para manejar la UI orientada a componentes/vistas SPA.
 */

const app = {
    // Inicialización del sistema
    init() {
        this.bindEvents();
    },

    // Navegador de vistas simple a nivel DOM
    navigate(viewId) {
        // 1. Ocultar todas las secciones
        const views = document.querySelectorAll('.view-section');
        views.forEach(view => {
            view.classList.remove('active');
        });

        // 2. Mostrar la sección deseada
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            
            // Un micro-efecto de scroll top siempre es bienvenido al cambiar página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    // Acceso directo demostrativo
    loginAs(role) {
        // Podríamos guardar el rol en localStorage o estado global
        console.log("Iniciando sesión como: " + role);
        // Ambos van al dashboard principal por ahora
        this.navigate('view-admin');
    },

    // Captura de eventos estructurales
    bindEvents() {
        // Evento de Login Simulado
        const loginForm = document.getElementById('form-login');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Evitamos recarga
                
                // Efecto visual de 'cargando'
                const btn = document.getElementById('btn-iniciar-sesion');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Verificando...';
                btn.style.opacity = '0.8';

                // Simulamos una latencia de red de 600ms antes de avanzar
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                    
                    // Asumimos validación exitosa y llevamos al panel de administrador
                    this.navigate('view-admin');
                }, 600);
            });
        }

        // Evento de Enviar Reporte Simulado
        const reporteForm = document.getElementById('form-reporte');
        if (reporteForm) {
            reporteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const btn = reporteForm.querySelector('.btn-primary');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Enviando...';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    // Aquí posteriormente podemos mostrar un panel de "Avería comunicada con éxito"
                    alert("¡Avería enviada con éxito! El equipo de mantenimiento la evaluará en breve.");
                    reporteForm.reset();
                    
                    // Simular ir al panel principal del usuario (en el futuro)
                    // this.navigate('view-dashboard'); 
                }, 800);
            });
        }
        // Lógica de Filtros en Panel Admin
        const filterEstado = document.getElementById('filter-estado');
        const filterTecnico = document.getElementById('filter-tecnico');
        const filterPrioridad = document.getElementById('filter-prioridad');
        const searchAverias = document.getElementById('search-averias');
        
        const applyFilters = () => {
            const valEstado = filterEstado ? filterEstado.value : '';
            const valTecnico = filterTecnico ? filterTecnico.value : '';
            const valPrioridad = filterPrioridad ? filterPrioridad.value : '';
            const valSearch = searchAverias ? searchAverias.value.toLowerCase() : '';
            
            const cards = document.querySelectorAll('.fault-card');
            cards.forEach(card => {
                const cardEstadoSelect = card.querySelector('.val-estado');
                const cardTecnicoSelect = card.querySelector('.val-tecnico');
                const cardPrioridadSelect = card.querySelector('.val-prioridad');
                
                if (cardEstadoSelect && cardTecnicoSelect && cardPrioridadSelect) {
                    const cardEstado = cardEstadoSelect.value;
                    const cardTecnico = cardTecnicoSelect.value;
                    const cardPrioridad = cardPrioridadSelect.value;
                    
                    let show = true;
                    if (valEstado && cardEstado !== valEstado) show = false;
                    if (valTecnico && cardTecnico !== valTecnico) show = false;
                    if (valPrioridad && cardPrioridad !== valPrioridad) show = false;
                    
                    if (valSearch && show) {
                        const title = card.querySelector('.fault-title') ? card.querySelector('.fault-title').innerText.toLowerCase() : '';
                        const meta = card.querySelector('.fault-meta') ? card.querySelector('.fault-meta').innerText.toLowerCase() : '';
                        const descNode = card.querySelector('p.text-light');
                        const desc = descNode ? descNode.innerText.toLowerCase() : '';
                        
                        if (!title.includes(valSearch) && !meta.includes(valSearch) && !desc.includes(valSearch)) {
                            show = false;
                        }
                    }
                    
                    card.style.display = show ? 'block' : 'none';
                }
            });
        };

        if (filterEstado) filterEstado.addEventListener('change', applyFilters);
        if (filterTecnico) filterTecnico.addEventListener('change', applyFilters);
        if (filterPrioridad) filterPrioridad.addEventListener('change', applyFilters);
        if (searchAverias) searchAverias.addEventListener('input', applyFilters);

        document.querySelectorAll('.val-estado, .val-tecnico, .val-prioridad').forEach(select => {
            select.addEventListener('change', applyFilters);
        });

        // Evento de Crear Usuario Simulado
        const createUserForm = document.getElementById('form-crear-usuario');
        if (createUserForm) {
            createUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const btn = createUserForm.querySelector('.btn-primary');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Registrando...';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    alert("¡Usuario creado con éxito!");
                    createUserForm.reset();
                    this.navigate('view-admin'); 
                }, 800);
            });
        }
    }
};

// Iniciar app cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
