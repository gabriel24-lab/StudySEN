// script.js

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id], main section[id]');
  const areasSelect = document.getElementById('areasSelect');
  const areasGrid = document.getElementById('areasGrid');

  // Función para marcar nav activo y cambiar color del nav
  function setActiveNav(sectionId, color) {
    navLinks.forEach(link => {
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Aplicar color al nav (usamos variable CSS --active-color)
    if (color) {
      header.style.setProperty('--active-color', color);
      header.style.backgroundColor = color + '22'; // ligera tonalidad de fondo
      header.style.boxShadow = '0 6px 20px ' + hexToRgba(color, 0.12);
    } else {
      header.style.removeProperty('--active-color');
      header.style.backgroundColor = '';
      header.style.boxShadow = '';
    }
  }

  // Convierte hex a rgba (para sombras)
  function hexToRgba(hex, alpha = 1) {
    const h = hex.replace('#','');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Click en nav: marcar activo y hacer scroll a sección
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      const color = link.dataset.color || null;
      setActiveNav(sectionId, color);

      // Scroll suave a la sección correspondiente si existe
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Observador de intersección para actualizar nav según scroll (opcional)
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.45 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // Buscar nav link con data-section igual a id
        const link = document.querySelector(`.nav-link[data-section="${id}"]`);
        const color = link ? link.dataset.color : entry.target.dataset.color;
        setActiveNav(id, color);
      }
    });
  }, observerOptions);

  // Registrar secciones observables
  sections.forEach(sec => observer.observe(sec));

  // Filtrado simple de áreas por select
  if (areasSelect && areasGrid) {
    areasSelect.addEventListener('change', () => {
      const val = areasSelect.value;
      const cards = areasGrid.querySelectorAll('.area-card');
      cards.forEach(card => {
        if (val === 'all' || card.dataset.area === val) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Inicial: marcar "inicio" como activo
  const initialLink = document.querySelector('.nav-link[data-section="inicio"]');
  if (initialLink) {
    setActiveNav('inicio', initialLink.dataset.color);
  }

  // Botones de ejemplo
  const btnJoin = document.getElementById('btn-join');
  const btnMore = document.getElementById('btn-more');
  if (btnJoin) {
  btnJoin.addEventListener('click', () => {
    window.location.href = "/Login/login.html";
  });
}

});

// Añadir clase .scrolled al header cuando el usuario baja
(function() {
  const header = document.getElementById('siteHeader');
  const threshold = 100; // px de scroll antes de activar

  function onScroll() {
    if (window.scrollY > threshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Ejecutar al cargar para estado inicial
  onScroll();
})();

// Preguntas y noticias: datos de ejemplo y lógica de interacción
(function(){
  const sampleQuestions = [
    { id:1, area:'sistemas', title:'¿Cómo instalo Node.js en Windows?', body:'Quiero instalar Node.js para un proyecto. ¿Qué pasos debo seguir?', answer:'Descarga el instalador desde nodejs.org, ejecuta el instalador y verifica con `node -v`.'},
    { id:2, area:'contabilidad', title:'¿Qué es el activo corriente?', body:'Necesito una definición simple de activo corriente.', answer:'Son bienes y derechos convertibles en efectivo en el corto plazo, como caja, bancos e inventarios.'},
    { id:3, area:'administracion', title:'¿Cómo hacer un plan de trabajo?', body:'Busco una estructura básica para un plan de trabajo.', answer:'Define objetivos, tareas, responsables, tiempos y recursos; revisa y ajusta periódicamente.'},
    { id:4, area:'finanzas', title:'¿Qué es el VAN?', body:'Explicación breve del Valor Actual Neto.', answer:'Es la suma de flujos de caja descontados menos la inversión inicial; si es positivo, el proyecto es rentable.'}
  ];

  const sampleNews = [
    { id:1, title:'Convocatoria de cursos SENA', desc:'Abierta la inscripción para cursos técnicos gratuitos.', time:'hace 2 horas' },
    { id:2, title:'Hackathon estudiantil', desc:'Participa en el hackathon regional el próximo mes.', time:'1 día' },
    { id:3, title:'Nueva guía de contabilidad', desc:'Publicada guía práctica para registros contables básicos.', time:'3 días' }
  ];

  const questionsList = document.getElementById('questionsList');
  const newsList = document.getElementById('newsList');
  const newsTime = document.getElementById('newsTime');
  const qCategories = document.getElementById('qCategories');
  const qSearch = document.getElementById('qSearch');
  const qAsk = document.getElementById('qAsk');

  // Render preguntas
  function renderQuestions(filterArea = 'all', query = '') {
    questionsList.innerHTML = '';
    const filtered = sampleQuestions.filter(q => (filterArea === 'all' || q.area === filterArea) &&
      (q.title.toLowerCase().includes(query) || q.body.toLowerCase().includes(query)));
    if (filtered.length === 0) {
      questionsList.innerHTML = '<div class="q-card"><p class="q-body">No se encontraron preguntas.</p></div>';
      return;
    }
    filtered.forEach(q => {
      const card = document.createElement('article');
      card.className = 'q-card';
      card.innerHTML = `
        <div class="q-meta"><strong class="chip" style="background:#eef9f6;color:#065f46;border:none">${q.area}</strong><span class="muted">ID ${q.id}</span></div>
        <h4 class="q-title">${q.title}</h4>
        <p class="q-body">${q.body}</p>
        <div class="q-actions">
          <button class="q-btn btn-answer" data-id="${q.id}">Ver respuesta</button>
          <button class="q-btn btn-like" data-id="${q.id}">👍 0</button>
          <a class="q-btn" href="#">Comentar</a>
        </div>
        <div class="q-answer" id="answer-${q.id}">${q.answer}</div>
      `;
      questionsList.appendChild(card);
    });
  }

  // Render noticias
  function renderNews() {
    newsList.innerHTML = '';
    sampleNews.forEach(n => {
      const item = document.createElement('div');
      item.className = 'news-item';
      item.innerHTML = `
        <div class="news-thumb">N</div>
        <div class="news-content">
          <h4 class="news-title">${n.title}</h4>
          <p class="news-desc">${n.desc}</p>
          <div class="news-time">${n.time}</div>
        </div>
      `;
      newsList.appendChild(item);
    });
    newsTime.textContent = new Date().toLocaleString();
  }

  // Inicial render
  renderQuestions();
  renderNews();

  // Category click
  qCategories.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    qCategories.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const area = btn.dataset.area || 'all';
    renderQuestions(area, qSearch.value.trim().toLowerCase());
  });

  // Search input
  qSearch.addEventListener('input', () => {
    const active = qCategories.querySelector('.chip.active');
    const area = active ? active.dataset.area : 'all';
    renderQuestions(area, qSearch.value.trim().toLowerCase());
  });

  // Delegación para ver respuesta y like
  questionsList.addEventListener('click', (e) => {
    const ansBtn = e.target.closest('.btn-answer');
    if (ansBtn) {
      const id = ansBtn.dataset.id;
      const ans = document.getElementById('answer-' + id);
      if (ans) ans.style.display = ans.style.display === 'block' ? 'none' : 'block';
      return;
    }
    const likeBtn = e.target.closest('.btn-like');
    if (likeBtn) {
      // contador simple visual
      const current = parseInt(likeBtn.textContent.replace(/\D/g,'')) || 0;
      likeBtn.textContent = `👍 ${current + 1}`;
    }
  });

  // Botón preguntar (simulación)
  qAsk.addEventListener('click', () => {
    alert('Funcionalidad de preguntar: aquí puedes abrir un modal o formulario para crear una nueva pregunta.');
  });

})();

// Interacciones para Sobre Nosotros
(function(){
  const btnJoinAbout = document.getElementById('btn-join-about');
  const aboutImage = document.getElementById('aboutImage');

  if (btnJoinAbout) {
    btnJoinAbout.addEventListener('click', () => {
      // Acción de ejemplo: abrir modal o redirigir a registro
      alert('Redirigiendo a registro o modal de inscripción.');
    });
  }

  // Si quieres que la imagen de la derecha mantenga proporción y no se salga,
  // puedes ajustar dinámicamente su altura según el ancho del contenedor.
  function adjustAboutImage() {
    if (!aboutImage) return;
    const maxH = 320; // cambiar si quieres otra altura máxima
    aboutImage.style.maxHeight = maxH + 'px';
  }

  window.addEventListener('resize', adjustAboutImage);
  adjustAboutImage();
})();