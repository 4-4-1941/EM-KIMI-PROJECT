(() => {
  const curriculum = window.EM_CURRICULUM;
  const KEY = 'em_academic_course_v2';
  const defaultState = () => ({ completedUnits: [], unlockedThrough: 1, examSessions: {} });
  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  class App {
    constructor() {
      this.root = document.getElementById('app'); this.state = this.load();
      this.exam = new CourseExams(this); this.timer = null; this.renderHome();
      window.addEventListener('hashchange', () => this.routeHash()); this.routeHash();
    }
    load() {
      try {
        const s = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (s && Array.isArray(s.completedUnits) && s.examSessions) return {...defaultState(), ...s};
      } catch (_) {}
      return defaultState();
    }
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (_) {} }
    moduleById(id) { return curriculum.modules.find(m => m.id === id); }
    unitById(id) { for (const m of curriculum.modules) { const u=m.units.find(x=>x.id===id); if(u) return {module:m,unit:u}; } return null; }
    isUnlocked(n) { return n <= this.state.unlockedThrough; }
    isComplete(id) { return this.state.completedUnits.includes(id); }
    allUnitsComplete(m) { return m.units.every(u => this.isComplete(u.id)); }
    examPassed(m) { return this.state.examSessions[m.id]?.status === 'passed'; }
    routeHash() {
      const p = decodeURIComponent(location.hash.slice(1));
      if (p.startsWith('lesson/')) { const id=p.slice(7); if(this.unitById(id)) this.openLesson(id, false); }
      else if (p.startsWith('exam/')) { const id=p.slice(5); if(this.moduleById(id)) this.openExam(id, false); }
      else if (!p || p === 'campus') this.renderHome();
    }
    setHash(value) { if(location.hash !== `#${value}`) location.hash=value; else this.routeHash(); }
    showMessage(text) { const box=document.getElementById('course-message'); if(box){box.textContent=text;box.hidden=false;box.focus();} }
    renderHome() {
      clearInterval(this.timer); this.root.innerHTML = `<section class="campus-heading"><div><p class="eyebrow dark">TU RECORRIDO</p><h2>Programa del curso</h2><p>Avanza módulo por módulo. El contenido y tu progreso se guardan en este navegador.</p></div><button class="reset-button" id="reset-progress">Reiniciar progreso</button></section><div class="overall-progress"><div><strong>${this.state.completedUnits.length} / 48 unidades</strong><span> completadas · ${this.state.unlockedThrough} de 5 módulos desbloqueados</span></div><div class="progress-track"><span style="width:${Math.round(this.state.completedUnits.length/48*100)}%"></span></div></div><div id="course-message" class="notice" role="alert" tabindex="-1" hidden></div><section class="module-list">${curriculum.modules.map(m=>this.moduleCard(m)).join('')}</section><section class="source-note"><strong>Uso académico:</strong> Las situaciones clínicas son viñetas ficticias. Los exámenes son formativos y el curso no otorga por sí solo certificación MINT ni resultados oficiales MITI.</section>`;
      document.getElementById('reset-progress').onclick=()=>this.reset();
      this.root.querySelectorAll('[data-open-module]').forEach(b=>b.onclick=()=>this.toggleModule(b.dataset.openModule));
      this.root.querySelectorAll('[data-open-lesson]').forEach(b=>b.onclick=()=>this.setHash(`lesson/${b.dataset.openLesson}`));
      this.root.querySelectorAll('[data-start-exam]').forEach(b=>b.onclick=()=>this.exam.start(b.dataset.startExam));
    }
    moduleCard(m) {
      const locked=!this.isUnlocked(m.number), done=m.units.filter(u=>this.isComplete(u.id)).length;
      const exam=this.state.examSessions[m.id];
      return `<article class="module-card ${locked?'locked':''}" style="--module-color:${m.color}"><button class="module-toggle" data-open-module="${m.id}" ${locked?'aria-disabled="true"':''}><span class="module-badge">${esc(m.badge)}</span><span class="module-main"><span class="module-level">${esc(m.level)}</span><strong>${esc(m.title)}</strong><span>${esc(m.subtitle)}</span></span><span class="module-state">${locked?'🔒 Bloqueado':this.examPassed(m)?'✓ Aprobado':`🔓 Desbloqueado`}<small>${done}/${m.units.length} unidades</small></span><span class="module-chevron">${locked?'🔒':'⌄'}</span></button>${locked?`<p class="lock-note">Aprueba el examen de M${m.number-1} con ${curriculum.passPercent}% para desbloquear este módulo.</p>`:`<div class="module-details" id="details-${m.id}"><div class="unit-list">${m.units.map(u=>`<button class="unit-row" data-open-lesson="${u.id}"><span class="unit-number">${esc(u.id)}</span><span>${esc(u.title)}</span><span class="unit-status">${this.isComplete(u.id)?'✓ Completada':'Estudiar →'}</span></button>`).join('')}</div><div class="module-exam"><div><strong>Examen final cronometrado</strong><p>${m.exam.questions.length} preguntas · ${m.exam.durationMinutes} minutos · aprobación ${m.exam.passPercent}%${exam?` · Último intento: ${exam.percent}%`:''}</p></div><button class="primary-button" data-start-exam="${m.id}" ${this.allUnitsComplete(m)?'':'disabled'}>${exam?.status==='in-progress'?'Continuar examen':exam?.status==='passed'?'Revisar / Reintentar':'Rendir examen'}</button></div></div>`}</article>`;
    }
    toggleModule(id) { const m=this.moduleById(id); if(!m || !this.isUnlocked(m.number)) return; const el=document.getElementById(`details-${id}`); if(el) el.classList.toggle('collapsed'); }
    openLesson(id, updateHash=true) {
      const found=this.unitById(id); if(!found) return;
      const {module:m,unit:u}=found;
      if(!this.isUnlocked(m.number)){this.renderHome();this.showMessage('Este módulo está bloqueado. Aprueba el examen del módulo anterior para continuar.');return;}
      clearInterval(this.timer); if(updateHash && location.hash!==`#lesson/${id}`) history.replaceState(null,'',`#lesson/${id}`);
      const index=m.units.findIndex(x=>x.id===id); const previous=m.units[index-1], next=m.units[index+1];
      const source=curriculum.references.filter(r=> m.number===5 ? /MITI|Miller.*Rollnick|MINT/i.test(r.citation) : /Miller.*Rollnick|MINT|MITI/i.test(r.citation)).slice(0,4);
      const checkKey=`check-${id}`;
      this.root.innerHTML=`<article class="lesson-view"><div class="lesson-toolbar"><button class="text-button" id="back-campus">← Volver al temario</button><span>${esc(m.badge)} · Unidad ${esc(id)} de ${m.units.length}</span><span>${this.isComplete(id)?'✓ Completada':'En estudio'}</span></div><header class="lesson-header" style="--module-color:${m.color}"><div class="eyebrow dark">${esc(m.title)}</div><h2>${esc(u.title)}</h2><p>${esc(u.overview)}</p></header><div class="lesson-body"><aside class="learning-box"><strong>Al terminar podrás</strong><ul>${u.learningGoals.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></aside>${u.sections.filter(s=>s.heading!=='Viñeta clínica comentada').map(s=>`<section class="lesson-section"><h3>${esc(s.heading)}</h3><div class="rich-copy">${s.html}</div></section>`).join('')}<details class="supplementary-reading"><summary>${esc(u.supplementaryReading.heading)}</summary><div class="rich-copy">${u.supplementaryReading.html}</div></details><section class="lesson-section case-section"><h3>Análisis de la viñeta</h3><p class="case-disclaimer">Caso ficticio con fines educativos; no es una transcripción real.</p><div class="rich-copy">${u.sections.find(s=>s.heading==='Viñeta clínica comentada')?.html || ''}</div></section><section class="quick-check"><span class="section-kicker">COMPRUEBA TU COMPRENSIÓN</span><h3>${esc(u.quickCheck.question)}</h3><div class="check-options">${u.quickCheck.options.map((o,i)=>`<label><input type="radio" name="${checkKey}" value="${i}"><span>${esc(o)}</span></label>`).join('')}</div><button class="secondary-button" id="check-answer">Revisar respuesta</button><div id="check-feedback" class="feedback" aria-live="polite"></div></section><section class="references"><h3>Lecturas y fuentes para ampliar</h3><p>Consulta el texto completo y la edición indicada; las referencias no reemplazan la lectura de la fuente primaria.</p><ul>${source.map(r=>`<li>${esc(r.citation)} <a href="${esc(r.url)}" target="_blank" rel="noopener">Ver fuente ↗</a></li>`).join('')}</ul></section><div class="lesson-actions"><button class="secondary-button" id="mark-complete" ${this.isComplete(id)?'disabled':''}>${this.isComplete(id)?'✓ Unidad completada':'Marcar unidad como completada'}</button><div class="lesson-nav">${previous?`<button class="text-button" id="prev-unit">← Anterior</button>`:''}${next?`<button class="primary-button" id="next-unit">Siguiente unidad →</button>`:`<button class="primary-button" id="go-exam">Ir al examen del módulo</button>`}</div></div></div></article>`;
      document.getElementById('back-campus').onclick=()=>this.setHash('campus');
      const check=document.getElementById('check-answer');
      check.onclick=()=>{
        const selected=this.root.querySelector(`input[name="${checkKey}"]:checked`); const f=document.getElementById('check-feedback');
        if(!selected){f.innerHTML='<span class="incorrect">Selecciona una opción para revisar.</span>';return;}
        const correct=Number(selected.value)===u.quickCheck.correctIndex;
        f.innerHTML=`<strong class="${correct?'correct':'incorrect'}">${correct?'Correcto.':'Revisa el contenido y vuelve a intentarlo.'}</strong><p>${esc(u.quickCheck.explanation)}</p>`;
        if(correct){document.getElementById('mark-complete').disabled=false; document.getElementById('mark-complete').dataset.eligible='true';}
      };
      document.getElementById('mark-complete').onclick=()=>{if(!this.root.querySelector('#mark-complete').dataset.eligible && !this.isComplete(id))return; if(!this.isComplete(id))this.state.completedUnits.push(id);this.save();this.openLesson(id,false);};
      if(previous)document.getElementById('prev-unit').onclick=()=>this.setHash(`lesson/${previous.id}`);
      if(next)document.getElementById('next-unit').onclick=()=>{if(!this.isComplete(id)){this.showMessage('Completa la lectura y responde correctamente la comprobación antes de avanzar.');return;}this.setHash(`lesson/${next.id}`);};
      else document.getElementById('go-exam').onclick=()=>{if(!this.allUnitsComplete(m)){this.showMessage('Completa todas las unidades del módulo antes del examen.');return;}this.setHash(`exam/${m.id}`);};
      window.scrollTo({top:0,behavior:'smooth'});
    }
    openExam(moduleId, updateHash=true) {
      const m=this.moduleById(moduleId); if(!m || !this.isUnlocked(m.number))return;
      if(!this.allUnitsComplete(m)){this.renderHome();this.showMessage('Completa todas las unidades antes de rendir el examen.');return;}
      clearInterval(this.timer); if(updateHash && location.hash!==`#exam/${moduleId}`)history.replaceState(null,'',`#exam/${moduleId}`);
      const session=this.state.examSessions[moduleId];
      if(!session || session.status!=='in-progress'){this.renderResults(m,session);return;}
      this.root.innerHTML=`<section class="exam-view"><div class="exam-top"><button class="text-button" id="back-campus">← Volver al temario</button><span>${esc(m.badge)} · Evaluación final</span><div id="exam-clock" class="exam-clock">20:00</div></div><div class="exam-intro"><span class="section-kicker">EVALUACIÓN CRONOMETRADA</span><h2>${esc(m.title)}</h2><p>Responde las preguntas basándote en las lecturas. Puedes cambiar respuestas mientras quede tiempo. Al enviar, verás la revisión comentada. Se requiere ${m.exam.passPercent}% para aprobar y desbloquear el siguiente módulo.</p><p class="exam-warning">El tiempo continúa si recargas la página o sales del examen.</p></div><form id="exam-form">${session.order.map((idx,display)=>{const q=m.exam.questions[idx];return `<fieldset class="exam-question"><legend><span>${display+1}.</span> ${esc(q.question)}</legend>${q.options.map((o,i)=>`<label><input type="radio" name="q-${idx}" value="${i}" ${Number(session.answers[idx])===i?'checked':''}><span>${esc(o)}</span></label>`).join('')}</fieldset>`;}).join('')}<div class="exam-submit-row"><button class="primary-button" type="submit">Entregar examen</button></div></form></section>`;
      document.getElementById('back-campus').onclick=()=>this.setHash('campus');
      const form=document.getElementById('exam-form');
      form.querySelectorAll('input').forEach(input=>input.onchange=()=>{session.answers[input.name.slice(2)]=Number(input.value);this.save();});
      form.onsubmit=e=>{e.preventDefault();this.exam.submit(moduleId,false);};
      const tick=()=>{const left=this.exam.remaining(session);const el=document.getElementById('exam-clock');if(el){const sec=Math.ceil(left/1000);el.textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;el.classList.toggle('urgent',left<60000);}if(left<=0){clearInterval(this.timer);this.exam.submit(moduleId,true);}};
      tick();this.timer=setInterval(tick,500);window.scrollTo({top:0,behavior:'smooth'});
    }
    renderResults(m,session) {
      clearInterval(this.timer);
      if(!session){this.renderHome();return;}
      const passed=session.status==='passed';
      const review=m.exam.questions.map((q,i)=>{const ans=Number(session.answers[i]);const correct=ans===q.correctIndex;return `<article class="review-card"><strong>${i+1}. ${esc(q.question)}</strong><p class="${correct?'correct':'incorrect'}">${correct?'Correcta':'Incorrecta o sin respuesta'}</p><p><b>Respuesta correcta:</b> ${esc(q.options[q.correctIndex])}</p><p>${esc(q.explanation)}</p></article>`;}).join('');
      this.root.innerHTML=`<section class="results-view"><div class="result-icon">${passed?'✓':'↻'}</div><span class="section-kicker">RESULTADO DEL EXAMEN</span><h2>${passed?'Módulo aprobado':'Aún no aprobado'}</h2><p class="score">${session.percent}% <span>(${session.correct} de ${session.total})</span></p><p>${passed?(m.number<5?`Módulo ${m.number+1} desbloqueado. Puedes continuar cuando estés listo.`:'Has completado la secuencia de módulos del curso.'):`Se requiere ${m.exam.passPercent}%. Repasa las unidades y vuelve a intentarlo.`}${session.timedOut?' El tiempo se agotó y se calificaron las respuestas guardadas.':''}</p><div class="result-actions"><button class="primary-button" id="result-campus">Volver al temario</button><button class="secondary-button" id="retry-exam">${passed?'Reintentar examen':'Reintentar'}</button></div><details class="review-details" open><summary>Revisión comentada de las preguntas</summary>${review}</details></section>`;
      document.getElementById('result-campus').onclick=()=>this.setHash('campus');
      document.getElementById('retry-exam').onclick=()=>{this.state.examSessions[m.id]=null;this.save();this.exam.start(m.id);};
      window.scrollTo({top:0,behavior:'smooth'});
    }
    reset(){if(confirm('¿Seguro que quieres borrar el progreso y los resultados guardados en este navegador?')){localStorage.removeItem(KEY);this.state=defaultState();this.setHash('campus');}}
  }
  document.addEventListener('DOMContentLoaded',()=>{window.courseApp=new App();});
})();
