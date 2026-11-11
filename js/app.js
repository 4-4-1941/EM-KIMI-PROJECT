// GESTOR INTERACTIVO: CURSO DE ENTREVISTA MOTIVACIONAL
(function () {
  'use strict';

  var STORAGE_KEY = 'em_interactive_progress_v2';
  var timerInterval = null;
  var timerSecondsLeft = 20 * 60;
  var currentExamModuleId = null;
  var currentExamData = null;
  var flatUnits = [];
  var currentUnitIdx = 0;

  // Estado persistente
  function getProgress() {
    var defaultProg = {
      unlockedModules: ['m1', 'm2', 'm3', 'm4', 'm5'],
      examScores: {},
      completedUnits: {}
    };
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        var parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') {
          // Todos los módulos abiertos para revisión directa
          parsed.unlockedModules = ['m1', 'm2', 'm3', 'm4', 'm5'];
          if (!parsed.examScores) parsed.examScores = {};
          if (!parsed.completedUnits) parsed.completedUnits = {};
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return defaultProg;
  }

  function saveProgress(prog) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
    } catch (e) {
      console.error(e);
    }
  }

  // Inicialización de lista plana de unidades
  function initUnits() {
    if (!window.EM_CURRICULUM || !window.EM_CURRICULUM.modules) return;
    flatUnits = [];
    window.EM_CURRICULUM.modules.forEach(function (mod) {
      mod.units.forEach(function (u) {
        flatUnits.push({
          moduleId: mod.id,
          moduleBadge: mod.badge,
          moduleTitle: mod.title,
          unit: u
        });
      });
    });
  }

  // Actualizar UI según estado de candados y exámenes
  function updateUI() {
    var prog = getProgress();
    var mods = ['m1', 'm2', 'm3', 'm4', 'm5'];

    mods.forEach(function (mid) {
      var card = document.getElementById('module-card-' + mid);
      var lockPill = document.getElementById('lock-pill-' + mid);
      var btnExam = document.getElementById('btn-exam-' + mid);
      var statusTag = document.getElementById('exam-status-' + mid);
      var examScore = prog.examScores[mid];

      // Todos los módulos abiertos para navegación y lectura libre
      if (card) {
        card.classList.remove('locked');
      }
      if (lockPill) {
        lockPill.style.display = 'none';
      }

      if (btnExam) {
        btnExam.disabled = false;
        if (examScore !== undefined && examScore >= 70) {
          btnExam.textContent = 'Aprobado (' + examScore + '%) · Repetir';
          btnExam.className = 'btn-module-exam passed';
          if (statusTag) {
            statusTag.textContent = '✓ Aprobado con ' + examScore + '%';
            statusTag.className = 'exam-status-tag passed';
          }
        } else if (examScore !== undefined) {
          btnExam.textContent = 'Reintentar Examen (' + examScore + '%) ⏱️';
          btnExam.className = 'btn-module-exam';
          if (statusTag) {
            statusTag.textContent = 'Intento previo: ' + examScore + '% · Requiere 70%';
            statusTag.className = 'exam-status-tag';
          }
        } else {
          btnExam.textContent = 'Iniciar Examen ' + mid.toUpperCase() + ' ⏱️';
          btnExam.className = 'btn-module-exam';
          if (statusTag) {
            statusTag.textContent = '⏱️ Examen disponible (20 min)';
            statusTag.className = 'exam-status-tag';
          }
        }
      }
    });
  }

  // MODAL DE UNIDAD / LECTURA
  window.openUnitModal = function (unitId) {
    if (flatUnits.length === 0) initUnits();
    var prog = getProgress();

    var targetIdx = -1;
    for (var i = 0; i < flatUnits.length; i++) {
      if (flatUnits[i].unit.id === unitId) {
        targetIdx = i;
        break;
      }
    }

    if (targetIdx === -1) return;
    var item = flatUnits[targetIdx];

    // Módulos abiertos para lectura

    currentUnitIdx = targetIdx;
    renderUnitContent(item);

    var modal = document.getElementById('unit-modal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var scrollArea = document.getElementById('modal-scroll-area');
      if (scrollArea) scrollArea.scrollTop = 0;
    }
  };

  function renderUnitContent(item) {
    var u = item.unit;
    document.getElementById('modal-mod-badge').textContent = item.moduleBadge + ' · ' + item.moduleTitle;
    document.getElementById('modal-unit-code').textContent = 'UNIDAD ' + u.id;
    document.getElementById('modal-unit-title').textContent = u.title;
    document.getElementById('modal-unit-overview').textContent = u.overview || '';

    // Objetivos
    var goalsUl = document.getElementById('modal-unit-goals');
    goalsUl.innerHTML = '';
    (u.learningGoals || []).forEach(function (g) {
      var li = document.createElement('li');
      li.textContent = g;
      goalsUl.appendChild(li);
    });

    // Secciones
    var sectionsDiv = document.getElementById('modal-unit-sections');
    sectionsDiv.innerHTML = '';
    (u.sections || []).forEach(function (sec) {
      var secBox = document.createElement('div');
      secBox.className = 'em-modal-section';
      secBox.innerHTML = '<h3>' + sec.heading + '</h3><div class="rich-copy">' + sec.html + '</div>';
      sectionsDiv.appendChild(secBox);
    });

    // Comprobación rápida
    var checkDiv = document.getElementById('modal-unit-check');
    checkDiv.innerHTML = '';
    if (u.quickCheck) {
      var qc = u.quickCheck;
      var qcHtml = '<h4>Comprobación rápida de autoevaluación</h4>' +
        '<p style="font-weight:600; font-size:14px; margin-bottom:12px;">' + qc.stem + '</p><div class="qc-options">';
      qc.options.forEach(function (opt, oIdx) {
        qcHtml += '<label class="check-option-item">' +
          '<input type="radio" name="qc_opt" value="' + oIdx + '" onchange="window.evaluateQuickCheck(' + qc.answerIndex + ', \'' + (qc.explanation || '').replace(/'/g, "\\'") + '\', ' + oIdx + ')">' +
          '<span>' + opt + '</span></label>';
      });
      qcHtml += '</div><div id="qc-feedback" class="check-feedback"></div>';
      checkDiv.innerHTML = qcHtml;
    }

    // Referencias y enlaces directos a fuentes
    var refsDiv = document.getElementById('modal-unit-refs');
    refsDiv.innerHTML = '';
    if (u.references && u.references.length > 0) {
      var refsHtml = '<h4>Referencias y literatura recomendada</h4><ul class="modal-refs-list">';
      u.references.forEach(function (r) {
        refsHtml += '<li style="margin-bottom:8px; line-height:1.5;"><strong>' + (r.title || '') + '</strong>' + (r.citation ? ' — ' + r.citation : '');
        if (r.url) {
          refsHtml += ' <a href="' + r.url + '" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-left:6px; color:#1B2B6B; font-weight:700; text-decoration:underline;">[🔗 Ver fuente original]</a>';
        }
        refsHtml += '</li>';
      });
      refsHtml += '</ul>';
      refsDiv.innerHTML = refsHtml;
    }

    // Contador y botones de navegación
    document.getElementById('modal-unit-counter').textContent = (currentUnitIdx + 1) + ' de ' + flatUnits.length;
    var btnPrev = document.getElementById('modal-btn-prev');
    var btnNext = document.getElementById('modal-btn-next');
    if (btnPrev) btnPrev.disabled = currentUnitIdx === 0;
    if (btnNext) btnNext.disabled = currentUnitIdx === flatUnits.length - 1;
  }

  window.evaluateQuickCheck = function (correctIdx, explanation, selectedIdx) {
    var fb = document.getElementById('qc-feedback');
    if (!fb) return;
    if (parseInt(selectedIdx, 10) === parseInt(correctIdx, 10)) {
      fb.className = 'check-feedback correct';
      fb.innerHTML = '<strong>✓ ¡Correcto!</strong> ' + explanation;
    } else {
      fb.className = 'check-feedback incorrect';
      fb.innerHTML = '<strong>✗ Respuesta incorrecta.</strong> ' + explanation;
    }
  };

  window.closeUnitModal = function () {
    var modal = document.getElementById('unit-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  window.navModalUnit = function (delta) {
    var nextIdx = currentUnitIdx + delta;
    if (nextIdx >= 0 && nextIdx < flatUnits.length) {
      var prog = getProgress();
      var targetItem = flatUnits[nextIdx];
      // Módulos abiertos para lectura libre
      currentUnitIdx = nextIdx;
      renderUnitContent(targetItem);
      var scrollArea = document.getElementById('modal-scroll-area');
      if (scrollArea) scrollArea.scrollTop = 0;
    }
  };

  // MODAL DE EXAMEN
  window.openExamModal = function (moduleId) {
    var prog = getProgress();

    if (!window.EM_CURRICULUM || !window.EM_CURRICULUM.modules) return;
    var modData = null;
    window.EM_CURRICULUM.modules.forEach(function (m) {
      if (m.id === moduleId) modData = m;
    });

    if (!modData || !modData.exam) {
      alert('No se encontraron preguntas de examen para este módulo.');
      return;
    }

    currentExamModuleId = moduleId;
    currentExamData = modData.exam;

    document.getElementById('exam-modal-badge').textContent = 'EVALUACIÓN ' + modData.badge;
    document.getElementById('exam-modal-title').textContent = modData.title;

    var qContainer = document.getElementById('exam-questions-container');
    var rContainer = document.getElementById('exam-results-container');
    var footer = document.getElementById('exam-footer');

    qContainer.style.display = 'block';
    rContainer.style.display = 'none';
    footer.style.display = 'flex';

    var questionsHtml = '<p style="font-size:14px; color:#4A5568; margin-bottom:20px;">' +
      'Responde las 10 preguntas con base en la literatura y modelos clínicos estudiados. Requiere 70% (7/10) para aprobar.</p>';

    currentExamData.questions.forEach(function (q, qIdx) {
      questionsHtml += '<div class="exam-question-block">' +
        '<div class="exam-question-num">Pregunta ' + (qIdx + 1) + ' de ' + currentExamData.questions.length + '</div>' +
        '<div class="exam-question-text">' + q.stem + '</div><div class="exam-options">';

      q.options.forEach(function (opt, oIdx) {
        questionsHtml += '<label class="exam-option-item">' +
          '<input type="radio" name="exam_q_' + qIdx + '" value="' + oIdx + '">' +
          '<span>' + opt + '</span></label>';
      });

      questionsHtml += '</div></div>';
    });

    qContainer.innerHTML = questionsHtml;

    // Iniciar temporizador (20 min)
    startExamTimer(20 * 60);

    var modal = document.getElementById('exam-modal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('exam-scroll-area').scrollTop = 0;
  };

  function startExamTimer(seconds) {
    if (timerInterval) clearInterval(timerInterval);
    timerSecondsLeft = seconds;
    updateTimerDisplay();

    timerInterval = setInterval(function () {
      timerSecondsLeft--;
      updateTimerDisplay();
      if (timerSecondsLeft <= 0) {
        clearInterval(timerInterval);
        alert('⏱️ El tiempo del examen ha terminado. Se calificarán tus respuestas actuales.');
        window.submitCurrentExam();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    var min = Math.floor(timerSecondsLeft / 60);
    var sec = timerSecondsLeft % 60;
    var display = (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
    var el = document.getElementById('exam-timer');
    if (el) el.textContent = display;
  }

  window.confirmCloseExam = function () {
    if (confirm('¿Deseas salir del examen? El progreso no enviado se perderá.')) {
      if (timerInterval) clearInterval(timerInterval);
      var modal = document.getElementById('exam-modal');
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  window.submitCurrentExam = function () {
    if (timerInterval) clearInterval(timerInterval);

    var questions = currentExamData.questions;
    var correctCount = 0;
    var reviews = [];

    questions.forEach(function (q, qIdx) {
      var selected = document.querySelector('input[name="exam_q_' + qIdx + '"]:checked');
      var userAns = selected ? parseInt(selected.value, 10) : -1;
      var isCorrect = userAns === q.answerIndex;
      if (isCorrect) correctCount++;

      reviews.push({
        qIdx: qIdx + 1,
        stem: q.stem,
        userAnsText: userAns >= 0 ? q.options[userAns] : 'Sin responder',
        correctAnsText: q.options[q.answerIndex],
        isCorrect: isCorrect,
        explanation: q.explanation || ''
      });
    });

    var score = Math.round((correctCount / questions.length) * 100);
    var passed = score >= 70;

    // Guardar progreso si aprueba
    var prog = getProgress();
    prog.examScores[currentExamModuleId] = score;

    var nextModMap = { 'm1': 'm2', 'm2': 'm3', 'm3': 'm4', 'm4': 'm5' };
    var nextModuleId = nextModMap[currentExamModuleId];

    if (passed && nextModuleId && prog.unlockedModules.indexOf(nextModuleId) === -1) {
      prog.unlockedModules.push(nextModuleId);
    }
    saveProgress(prog);

    // Mostrar resultados
    var qContainer = document.getElementById('exam-questions-container');
    var rContainer = document.getElementById('exam-results-container');
    var footer = document.getElementById('exam-footer');

    qContainer.style.display = 'none';
    footer.style.display = 'none';
    rContainer.style.display = 'block';

    var resHtml = '<div class="exam-results-card">' +
      '<div class="exam-score-big">' + score + '%</div>' +
      '<div class="exam-status-msg ' + (passed ? 'passed' : 'failed') + '">' +
      (passed ? '🎉 ¡Felicidades! Has aprobado la evaluación con ' + correctCount + ' de ' + questions.length + ' aciertos.' :
                '⚠️ No has alcanzado el 70% requerido (' + correctCount + ' de ' + questions.length + '). Revisa las respuestas y vuelve a intentarlo.') +
      '</div>';

    if (passed && nextModuleId) {
      resHtml += '<div style="margin-bottom:20px; padding:12px 18px; background:#E8F5E9; border-radius:8px; color:#1B5E20; font-weight:700;">' +
        '🔓 ¡El siguiente módulo (' + nextModuleId.toUpperCase() + ') ha sido desbloqueado!</div>';
    }

    resHtml += '<button type="button" class="btn-modal-nav primary" onclick="window.finishExamView()">Volver al Campus</button>' +
      '<div class="exam-review-list"><h3>Revisión detallada de preguntas</h3>';

    reviews.forEach(function (r) {
      resHtml += '<div class="exam-review-item ' + (r.isCorrect ? 'correct' : 'incorrect') + '">' +
        '<strong>Pregunta ' + r.qIdx + ':</strong> ' + r.stem + '<br>' +
        '<span style="font-size:13px; color:' + (r.isCorrect ? '#2E7D32' : '#C62828') + ';">' +
        (r.isCorrect ? '✓ Tu respuesta: ' : '✗ Tu respuesta: ') + r.userAnsText + '</span><br>' +
        (!r.isCorrect ? '<span style="font-size:13px; color:#2E7D32;">✓ Respuesta correcta: ' + r.correctAnsText + '</span><br>' : '') +
        '<p style="margin:6px 0 0; font-size:12.5px; color:#4A5568;"><em>' + r.explanation + '</em></p>' +
        '</div>';
    });

    resHtml += '</div></div>';
    rContainer.innerHTML = resHtml;
    document.getElementById('exam-scroll-area').scrollTop = 0;

    // Actualizar la interfaz general
    updateUI();
  };

  window.finishExamView = function () {
    var modal = document.getElementById('exam-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    updateUI();
  };

  // Inicialización al cargar la página
  document.addEventListener('DOMContentLoaded', function () {
    initUnits();
    updateUI();
  });

})();