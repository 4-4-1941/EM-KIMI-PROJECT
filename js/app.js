/**
 * Campus Virtual de Entrevista Motivacional
 * Controlador Maestro
 */
class AppController {
  constructor() {
    this.currentTab = 'separatas';
    this.progress = this.loadProgress();
    this.init();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('em_course_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      readSeparatas: [],
      casesDone: [],
      drillsDone: 0
    };
  }

  saveProgress() {
    try {
      localStorage.setItem('em_course_progress', JSON.stringify(this.progress));
    } catch (e) {}
    this.updateProgressUi();
  }

  init() {
    // Hash router
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();

    // Setup reader modal listeners
    const modal = document.getElementById('reading-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        const iframe = document.getElementById('modal-iframe');
        if (iframe) iframe.src = '';
      });
    }

    this.updateProgressUi();
  }

  handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'separatas';
    this.switchTab(hash);
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update nav links
    document.querySelectorAll('.nav-tab').forEach(el => {
      if (el.dataset.tab === tabId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update section visibility
    document.querySelectorAll('.tab-section').forEach(sec => {
      if (sec.id === `section-${tabId}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Lazy initialization of components
    if (tabId === 'simulator' && !window.simulator) {
      window.simulator = new ClinicalSimulator('simulator-container');
    }
    if (tabId === 'lab' && !window.skillsLab) {
      window.skillsLab = new SkillsLaboratory('laboratory-container');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openReader(fileUrl, separataId) {
    const modal = document.getElementById('reading-modal');
    const iframe = document.getElementById('modal-iframe');
    if (modal && iframe) {
      iframe.src = fileUrl;
      modal.classList.add('open');
      if (separataId && !this.progress.readSeparatas.includes(separataId)) {
        this.progress.readSeparatas.push(separataId);
        this.saveProgress();
      }
    }
  }

  updateProgressUi() {
    const countEl = document.getElementById('progress-separatas-count');
    const barEl = document.getElementById('progress-bar-fill');
    if (countEl) {
      const readCount = this.progress.readSeparatas.length;
      countEl.textContent = `${readCount} de 6 separatas leídas`;
      if (barEl) {
        const pct = Math.round((readCount / 6) * 100);
        barEl.style.width = `${pct}%`;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
