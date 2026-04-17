const app = {
  // Inicialización del sistema
  init() {
      this.bindEvents();
  },

  // Navegador de vistas simple a nivel DOM
  navigate(viewId) {
      const views = document.querySelectorAll('.view-section');
      views.forEach(view => {
          view.classList.remove('active');
      });

      const targetView = document.getElementById(viewId);
      if (targetView) {
          targetView.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (viewId === 'view-admin') {
        this.loadDashboard();
      }
  },

  loginAs(role) {
      console.log("Iniciando sesión como: " + role);
      this.navigate('view-admin');
  },

  bindEvents() {
      const loginForm = document.getElementById('form-login');
      if (loginForm) {
          loginForm.addEventListener('submit', (e) => {
              e.preventDefault();
              const btn = document.getElementById('btn-iniciar-sesion');
              const originalText = btn.innerHTML;
              btn.innerHTML = 'Verificando...';
              btn.style.opacity = '0.8';

              setTimeout(() => {
                  btn.innerHTML = originalText;
                  btn.style.opacity = '1';
                  this.navigate('view-admin');
              }, 600);
          });
      }

      const reporteForm = document.getElementById('form-reporte');
      if (reporteForm) {
          reporteForm.addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const btn = reporteForm.querySelector('.btn-primary');
              const originalText = btn.innerHTML;
              btn.innerHTML = 'Enviando...';

              const payload = {
                nombre: document.getElementById('nombre_averia').value,
                tipo: document.getElementById('tipo_averia').value,
                ubicacion: document.getElementById('ubicacion').value,
                descripcion: document.getElementById('descripcion').value
              };

              try {
                const res = await fetch('/api/averias', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                  alert("¡Avería enviada con éxito!");
                  reporteForm.reset();
                  this.navigate('view-welcome');
                } else {
                  alert("Error al enviar la avería");
                }
              } catch (e) {
                console.error(e);
                alert("Error de red");
              } finally {
                btn.innerHTML = originalText;
              }
          });
      }
  },

  async loadDashboard() {
    try {
      const parent = document.querySelector('.fault-list');
      if (!parent) return;

      parent.innerHTML = '<p class="text-light">Cargando averías...</p>';

      const averiasRes = await fetch('/api/averias');
      const tecnicosRes = await fetch('/api/averias/tecnicos');
      const averias = await averiasRes.json();
      const tecnicos = await tecnicosRes.json();

      parent.innerHTML = '';
      if (averias.length === 0) {
        parent.innerHTML = '<p class="text-light">No hay averías registradas.</p>';
      }

      averias.forEach(av => {
        parent.appendChild(this.buildCard(av, tecnicos));
      });
    } catch(err) {
      console.error(err);
      document.querySelector('.fault-list').innerHTML = '<p class="text-light">Error al conectar con el servidor.</p>';
    }
  },

  buildCard(averia, tecnicos) {
    const isCritica = averia.valoracion === "CRITICA";
    const isMenor = averia.valoracion === "MENOR";
    const isAcumulable = averia.valoracion === "ACUMULABLE";

    const isEnReparacion = averia.estado === "EN_REPARACION";
    const isTerminada = averia.estado === "TERMINADA";

    let clz = "fault-card";
    if (isCritica) clz += " priority-critica";
    if (isMenor) clz += " priority-menor";
    if (isAcumulable) clz += " priority-acumulable";

    let statusClz = "badge badge-status";
    let statusText = "Sin empezar";
    if (isEnReparacion) {
      statusClz += " en-reparacion";
      statusText = "En Reparación";
    } else if (isTerminada) {
      statusClz += " terminada";
      statusText = "Terminada";
    }

    const reportadorNombre = averia.reportador?.nombre || 'Invitado';

    const div = document.createElement('div');
    div.className = clz;

    let tecOptions = `<option value="" disabled ${!averia.reparador ? 'selected' : ''}>Sin asignar</option>`;
    tecnicos.forEach(t => {
      tecOptions += `<option value="${t.id}" ${averia.reparador?.id === t.id ? 'selected' : ''}>${t.nombre}</option>`;
    });

    div.innerHTML = `
      <div class="fault-header">
          <div>
              <h3 class="fault-title">${averia.nombre}</h3>
              <div class="fault-meta">
                  <span style="text-transform: capitalize;">${averia.tipo}</span> • <span>${averia.ubicacion}</span>
              </div>
          </div>
          <span class="${statusClz}">${statusText}</span>
      </div>
      <p class="text-light">${averia.descripcion}</p>
      <div style="font-size: 0.75rem; color: #64748b; margin-top: -0.5rem; margin-bottom: 0.5rem;">
        Reportado por ${reportadorNombre}
      </div>
      <div class="fault-actions">
          <div>
              <label class="form-label" style="font-size:0.75rem;">Prioridad</label>
              <select class="form-control select-sm prio-sel">
                  <option value="CRITICA" ${isCritica ? 'selected' : ''}>Crítica</option>
                  <option value="MENOR" ${isMenor ? 'selected' : ''}>Menor</option>
                  <option value="ACUMULABLE" ${isAcumulable ? 'selected' : ''}>Acumulable</option>
              </select>
          </div>
          <div>
              <label class="form-label" style="font-size:0.75rem;">Asignado a</label>
              <select class="form-control select-sm tec-sel">
                  ${tecOptions}
              </select>
          </div>
          <div style="grid-column: span 2;">
              <label class="form-label" style="font-size:0.75rem;">Estado Operativo</label>
              <select class="form-control select-sm est-sel">
                  <option value="SIN_EMPEZAR" ${!isEnReparacion && !isTerminada ? 'selected' : ''}>Sin empezar</option>
                  <option value="EN_REPARACION" ${isEnReparacion ? 'selected' : ''}>En reparación</option>
                  <option value="TERMINADA" ${isTerminada ? 'selected' : ''}>Terminada</option>
              </select>
          </div>
      </div>
    `;

    // Events
    div.querySelector('.prio-sel').addEventListener('change', async (e) => {
      await fetch('/api/averias/'+averia.id+'/prioridad', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prioridad: e.target.value })
      });
      app.loadDashboard();
    });

    div.querySelector('.est-sel').addEventListener('change', async (e) => {
      await fetch('/api/averias/'+averia.id+'/estado', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: e.target.value })
      });
      app.loadDashboard();
    });

    div.querySelector('.tec-sel').addEventListener('change', async (e) => {
      await fetch('/api/averias/'+averia.id+'/tecnico', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tecnicoId: e.target.value })
      });
      app.loadDashboard();
    });

    return div;
  }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
