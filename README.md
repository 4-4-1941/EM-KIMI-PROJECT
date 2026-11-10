# Programa de Formación en Entrevista Motivacional: De Aprendiz a Experto

Plataforma educativa interactiva y de investigación sobre la **Entrevista Motivacional (EM)**, fundamentada en la literatura científica de William R. Miller y Stephen Rollnick (1983–2023), los estudios psicolingüísticos de Paul Amrhein (2003) y el manual de fidelidad clínica **MITI 4.2.1** de la red internacional **MINT** (*Motivational Interviewing Network of Trainers*).

---

## 🚀 Características Interactivas

1. **Separatas de Lectura Académica (Normas APA 7.ª Edición):**
   - 6 separatas especializadas con marco epistemológico, fundamentos psicológicos (Rogers, Bem, Festinger, Bandura) y análisis de procesos.
   - Visor integrado de lectura en modal y enlaces directos para consulta o descarga.
2. **Clínica Virtual (Simulador de Diálogos Clínicos):**
   - Árbol de decisiones ramificado con viñetas clínicas complejas (adicciones, salud crónica/diabetes y contextos coercitivos/mandato judicial).
   - Evaluación en tiempo real según la escala MITI 4.2.1 y la 4.ª edición (PACE-E, Fixing reflex, etc.).
   - Justificación teórica inmediata con cita bibliográfica por cada intervención.
3. **Laboratorio de Micro-habilidades (Skill Drills):**
   - Práctica interactiva de discriminación de lenguaje **DARN-CAT** (Amrhein et al., 2003).
   - Taller de reformulación **OARS** (desactivación del Fixing Reflex).
4. **Línea de Tiempo Histórica (1982–2023):**
   - Cronología interactiva desde la estancia sabática de Miller en Noruega (1982) hasta la 4.ª edición revisada (2023).
5. **Seguimiento del Progreso del Alumno:**
   - Contador de lecturas y avance guardado automáticamente en el navegador (`localStorage`).

---

## 📂 Estructura del Repositorio

```text
EM-KIMI-PROJECT/
├── index.html                   # Campus virtual interactivo con pestañas y simulador
├── README.md                    # Documentación del proyecto
├── css/
│   └── styles.css               # Estilos del campus, simulador clínico y visor modal
├── separatas/                   # Dossier de lecturas académicas completas
│   ├── separata-0-historia-fundamentos.html
│   ├── separata-1-espiritu-pace.html
│   ├── separata-2-oars-darn-cat.html
│   ├── separata-3-cuatro-tareas.html
│   ├── separata-4-contextos-clinicos.html
│   └── separata-5-fidelidad-miti.html
└── js/
    ├── app.js                   # Enrutamiento, progreso del alumno y visor modal
    ├── data/
    │   ├── cases-data.js        # Casos clínicos ramificados con rúbrica MITI y citas
    │   └── drills-data.js       # Banco de ejercicios interactivos DARN-CAT y OARS
    └── components/
        ├── simulator.js         # Motor del simulador de diálogo clínico
        └── drills.js            # Motor del laboratorio de habilidades
```

---

## 📚 Referencias Principales

- Amrhein, P. C., et al. (2003). Client commitment language during motivational interviewing predicts drug use outcomes. *Journal of Consulting and Clinical Psychology*, 71(5), 862–878.
- Miller, W. R. (1983). Motivational interviewing with problem drinkers. *Behavioural Psychotherapy*, 11(2), 147–172.
- Miller, W. R., & Rollnick, S. (2012). *Motivational Interviewing: Helping People Change* (3rd ed.). Guilford Press.
- Miller, W. R., & Rollnick, S. (2023). *Motivational Interviewing: Helping People Change and Grow* (4th ed.). Guilford Press.
- Moyers, T. B., Manuel, J. K., & Ernst, D. (2014). *Motivational Interviewing Treatment Integrity Coding Manual 4.2.1 (MITI 4.2.1)*. University of New Mexico.
