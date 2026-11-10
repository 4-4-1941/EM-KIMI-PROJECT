/**
 * Motor del Laboratorio de Micro-habilidades (DARN-CAT y OARS)
 */
class SkillsLaboratory {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentDrillIndex = 0;
    this.correctCount = 0;
    this.answered = false;
    this.mode = 'darnCat'; // 'darnCat' or 'oars'
    this.init();
  }

  init() {
    if (!this.container || !window.DRILLS_DATA) return;
    this.render();
  }

  setMode(mode) {
    this.mode = mode;
    this.currentDrillIndex = 0;
    this.correctCount = 0;
    this.answered = false;
    this.render();
  }

  render() {
    if (!this.container) return;

    let navHtml = `
      <div class="drill-mode-nav">
        <button class="drill-mode-btn ${this.mode === 'darnCat' ? 'active' : ''}" onclick="window.skillsLab.setMode('darnCat')">
          🎯 Clasificación DARN-CAT (Psicolingüística)
        </button>
        <button class="drill-mode-btn ${this.mode === 'oars' ? 'active' : ''}" onclick="window.skillsLab.setMode('oars')">
          🛠️ Taller de Reformulación OARS
        </button>
      </div>
    `;

    let contentHtml = '';
    if (this.mode === 'darnCat') {
      contentHtml = this.renderDarnCat();
    } else {
      contentHtml = this.renderOars();
    }

    this.container.innerHTML = `
      <div class="laboratory-wrapper">
        ${navHtml}
        ${contentHtml}
      </div>
    `;
  }

  renderDarnCat() {
    const list = DRILLS_DATA.darnCat;
    if (this.currentDrillIndex >= list.length) {
      const pct = Math.round((this.correctCount / list.length) * 100);
      return `
        <div class="drill-result-card">
          <h3>🏆 ¡Laboratorio DARN-CAT Completado!</h3>
          <p class="drill-score-large">Puntuación: <strong>${this.correctCount} / ${list.length}</strong> (${pct}%)</p>
          <p>Has practicado la discriminación empírica del lenguaje del consultante según el modelo causal de Amrhein et al. (2003).</p>
          <button class="sim-reset-btn" onclick="window.skillsLab.setMode('darnCat')">Reiniciar Ejercicios</button>
        </div>
      `;
    }

    const item = list[this.currentDrillIndex];
    const buttons = [
      { code: 'D', label: 'D · Deseo (Desire)' },
      { code: 'A', label: 'A · Capacidad (Ability)' },
      { code: 'R', label: 'R · Razones (Reasons)' },
      { code: 'N', label: 'N · Necesidad (Need)' },
      { code: 'C', label: 'C · Compromiso (Commitment)' },
      { code: 'Act', label: 'Act · Activación (Activation)' },
      { code: 'TS', label: 'TS · Pasos Tomados (Taking Steps)' },
      { code: 'ST', label: 'ST · Discurso Sostenimiento' }
    ];

    let buttonsHtml = '<div class="darn-grid">';
    buttons.forEach(b => {
      const disabledAttr = this.answered ? 'disabled' : '';
      buttonsHtml += `
        <button class="darn-choice-btn" ${disabledAttr} onclick="window.skillsLab.answerDarn('${b.code}')">
          ${b.label}
        </button>
      `;
    });
    buttonsHtml += '</div>';

    let feedbackHtml = '';
    if (this.answered) {
      const isCorrect = this.lastChoice === item.correct;
      const statusClass = isCorrect ? 'correct' : 'incorrect';
      const icon = isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto';
      feedbackHtml = `
        <div class="drill-feedback ${statusClass}">
          <h4>${icon}</h4>
          <p><strong>Categoría correcta:</strong> ${item.category}</p>
          <p>${item.explanation}</p>
          <button class="drill-next-btn" onclick="window.skillsLab.nextDarn()">Siguiente Ejercicio →</button>
        </div>
      `;
    }

    return `
      <div class="drill-card">
        <div class="drill-meta">
          <span>Ejercicio ${this.currentDrillIndex + 1} de ${list.length}</span>
          <span>Aciertos: ${this.correctCount}</span>
        </div>
        <div class="drill-prompt-box">
          <span class="quote-label">Frase textual del consultante:</span>
          <p class="drill-quote">«${item.quote}»</p>
        </div>
        <p class="drill-instruction">Clasifica a qué dimensión del lenguaje pertenece esta emisión verbal:</p>
        ${buttonsHtml}
        ${feedbackHtml}
      </div>
    `;
  }

  renderOars() {
    const list = DRILLS_DATA.oarsDrills;
    if (this.currentDrillIndex >= list.length) {
      return `
        <div class="drill-result-card">
          <h3>🎖️ ¡Taller OARS Completado!</h3>
          <p>Has practicado la transformación de respuestas directivas a intervenciones de alta adherencia terapéutica.</p>
          <button class="sim-reset-btn" onclick="window.skillsLab.setMode('oars')">Reiniciar Taller</button>
        </div>
      `;
    }

    const item = list[this.currentDrillIndex];
    let optionsHtml = '<div class="oars-options">';
    item.options.forEach((opt, idx) => {
      const disabledAttr = this.answered ? 'disabled' : '';
      optionsHtml += `
        <button class="oars-option-btn" ${disabledAttr} onclick="window.skillsLab.answerOars(${idx})">
          <span class="opt-num">${idx + 1}</span>
          <span class="opt-txt">${opt.text}</span>
        </button>
      `;
    });
    optionsHtml += '</div>';

    let feedbackHtml = '';
    if (this.answered) {
      const chosen = item.options[this.chosenOarsIndex];
      const isCorrect = chosen.type === 'correct';
      feedbackHtml = `
        <div class="drill-feedback ${isCorrect ? 'correct' : 'incorrect'}">
          <h4>${isCorrect ? '✅ ¡Excelente elección!' : '⚠️ Intervención subóptima'}</h4>
          <p>${chosen.feedback}</p>
          <button class="drill-next-btn" onclick="window.skillsLab.nextOars()">Siguiente Caso →</button>
        </div>
      `;
    }

    return `
      <div class="drill-card">
        <div class="drill-meta">
          <span>Caso ${this.currentDrillIndex + 1} de ${list.length}</span>
        </div>
        <div class="drill-prompt-box">
          <p class="drill-quote">${item.scenario}</p>
        </div>
        <div class="trap-box">
          <strong>❌ Trampa directiva habitual (Fixing Reflex):</strong>
          <p><em>«${item.directiveTrap}»</em></p>
        </div>
        <p class="drill-instruction">¿Cuál de las siguientes alternativas responde con verdadero espíritu y técnica EM?</p>
        ${optionsHtml}
        ${feedbackHtml}
      </div>
    `;
  }

  answerDarn(choice) {
    if (this.answered) return;
    this.answered = true;
    this.lastChoice = choice;
    const item = DRILLS_DATA.darnCat[this.currentDrillIndex];
    if (choice === item.correct) {
      this.correctCount++;
    }
    this.render();
  }

  nextDarn() {
    this.answered = false;
    this.currentDrillIndex++;
    this.render();
  }

  answerOars(idx) {
    if (this.answered) return;
    this.answered = true;
    this.chosenOarsIndex = idx;
    this.render();
  }

  nextOars() {
    this.answered = false;
    this.currentDrillIndex++;
    this.render();
  }
}

window.SkillsLaboratory = SkillsLaboratory;
