/**
 * Motor del Simulador Clínico de Entrevista Motivacional
 */
class ClinicalSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentCaseIndex = 0;
    this.currentStageIndex = 0;
    this.scoreHistory = [];
    this.history = [];
    this.init();
  }

  init() {
    if (!this.container || !window.CLINICAL_CASES || CLINICAL_CASES.length === 0) return;
    this.render();
  }

  setCase(index) {
    this.currentCaseIndex = index;
    this.currentStageIndex = 0;
    this.history = [];
    this.scoreHistory = [];
    this.render();
  }

  getCurrentCase() {
    return CLINICAL_CASES[this.currentCaseIndex];
  }

  getCurrentStage() {
    const c = this.getCurrentCase();
    return c.stages[this.currentStageIndex];
  }

  render() {
    const currentCase = this.getCurrentCase();
    const stage = this.getCurrentStage();

    let selectorHtml = '<div class="sim-case-selector">';
    CLINICAL_CASES.forEach((c, idx) => {
      const activeClass = idx === this.currentCaseIndex ? 'active' : '';
      selectorHtml += `<button class="case-tab-btn ${activeClass}" onclick="window.simulator.setCase(${idx})">${c.title.split('—')[0]}</button>`;
    });
    selectorHtml += '</div>';

    let historyHtml = '';
    this.history.forEach(item => {
      historyHtml += `
        <div class="sim-message client-msg">
          <div class="msg-avatar">👤 ${currentCase.profile.name}</div>
          <div class="msg-bubble">${item.prompt}</div>
        </div>
        <div class="sim-message therapist-msg">
          <div class="msg-avatar">🩺 Terapeuta (Tú)</div>
          <div class="msg-bubble">${item.selectedOption.text}</div>
          <span class="msg-badge ${item.selectedOption.type.toLowerCase()}">${item.selectedOption.code}</span>
        </div>
        <div class="sim-feedback-card ${item.selectedOption.impact}">
          <div class="fb-header">
            <strong>Evaluación MITI 4.2.1:</strong> Puntuación: ${item.selectedOption.score}/5
          </div>
          <div class="fb-body">${item.selectedOption.feedback}</div>
          <div class="fb-citation">📚 <em>${item.selectedOption.citation}</em></div>
        </div>
        <div class="sim-message client-msg reply-msg">
          <div class="msg-avatar">👤 ${currentCase.profile.name}</div>
          <div class="msg-bubble reaction-bubble">"${item.selectedOption.clientReaction}"</div>
        </div>
      `;
    });

    let currentPromptHtml = '';
    let optionsHtml = '';

    if (stage) {
      currentPromptHtml = `
        <div class="sim-message client-msg current-turn">
          <div class="msg-avatar">👤 ${currentCase.profile.name} (Paso ${this.currentStageIndex + 1}/${currentCase.stages.length})</div>
          <div class="msg-bubble prompt-active">${stage.clientPrompt}</div>
        </div>
      `;

      optionsHtml = `
        <div class="sim-options-prompt">
          <h4>Selecciona tu intervención como terapeuta:</h4>
          <div class="options-grid">
      `;
      stage.options.forEach((opt, idx) => {
        optionsHtml += `
          <button class="sim-option-btn" onclick="window.simulator.chooseOption('${opt.id}')">
            <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="opt-text">${opt.text}</span>
          </button>
        `;
      });
      optionsHtml += `</div></div>`;
    } else {
      // Completed case
      const avgScore = (this.scoreHistory.reduce((a, b) => a + b, 0) / this.scoreHistory.length).toFixed(1);
      optionsHtml = `
        <div class="sim-completion-card">
          <h3>🎉 ¡Caso Clínico Finalizado con Éxito!</h3>
          <p>Has completado las etapas de diálogo para <strong>${currentCase.profile.name}</strong>.</p>
          <div class="completion-score">
            <span>Puntuación Global de Fidelidad: <strong>${avgScore} / 5.0</strong></span>
          </div>
          <p class="completion-note">Revisa la retroalimentación de cada turno en el historial superior para consolidar el aprendizaje.</p>
          <button class="sim-reset-btn" onclick="window.simulator.setCase(${this.currentCaseIndex})">🔄 Repetir este caso</button>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="simulator-wrapper">
        ${selectorHtml}
        <div class="sim-patient-card">
          <div class="profile-header">
            <h3>${currentCase.title}</h3>
            <span class="patient-tag">${currentCase.profile.age} años · ${currentCase.profile.profession}</span>
          </div>
          <p class="profile-context"><strong>Contexto:</strong> ${currentCase.profile.context}</p>
          <p class="profile-state"><strong>Disposición inicial:</strong> ${currentCase.profile.initialState}</p>
        </div>

        <div class="sim-chat-area">
          ${historyHtml}
          ${currentPromptHtml}
          ${optionsHtml}
        </div>
      </div>
    `;

    // Save progress to app
    if (window.app && typeof window.app.updateProgress === 'function') {
      window.app.updateProgress();
    }
  }

  chooseOption(optionId) {
    const stage = this.getCurrentStage();
    if (!stage) return;
    const option = stage.options.find(o => o.id === optionId);
    if (!option) return;

    this.scoreHistory.push(option.score);
    this.history.push({
      prompt: stage.clientPrompt,
      selectedOption: option
    });

    this.currentStageIndex++;
    this.render();

    // Scroll chat area to bottom
    const chatArea = this.container.querySelector('.sim-chat-area');
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }
}

window.ClinicalSimulator = ClinicalSimulator;
