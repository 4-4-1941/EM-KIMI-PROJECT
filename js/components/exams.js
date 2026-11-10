/* Examen formativo cronometrado; no constituye codificación MITI oficial. */
class CourseExams {
  constructor(app) { this.app = app; }
  start(moduleId) {
    const module = this.app.moduleById(moduleId);
    if (!module || !this.app.isUnlocked(module.number)) return;
    if (!this.app.allUnitsComplete(module)) { this.app.showMessage('Completa primero todas las lecturas y comprobaciones de este módulo.'); return; }
    const prior = this.app.state.examSessions[moduleId];
    if (prior && prior.status === 'in-progress') { this.app.openExam(moduleId); return; }
    this.app.state.examSessions[moduleId] = {status:'in-progress',startedAt:Date.now(),durationMs:module.exam.durationMinutes*60000,answers:{},order:this.shuffle(module.exam.questions.map((_,i)=>i))};
    this.app.save(); this.app.openExam(moduleId);
  }
  shuffle(items) { for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];} return items; }
  remaining(s) { return Math.max(0,s.durationMs-(Date.now()-s.startedAt)); }
  submit(moduleId,timedOut=false) {
    const m=this.app.moduleById(moduleId),s=this.app.state.examSessions[moduleId];
    if(!m||!s||s.status!=='in-progress')return;
    let correct=0; m.exam.questions.forEach((q,i)=>{if(Number(s.answers[i])===q.correctIndex)correct++;});
    s.percent=Math.round(correct/m.exam.questions.length*100);s.correct=correct;s.total=m.exam.questions.length;s.status=s.percent>=m.exam.passPercent?'passed':'failed';s.completedAt=Date.now();s.timedOut=timedOut;
    if(s.status==='passed')this.app.state.unlockedThrough=Math.max(this.app.state.unlockedThrough,Math.min(5,m.number+1));
    this.app.save();this.app.renderResults(m,s);
  }
}
window.CourseExams=CourseExams;
