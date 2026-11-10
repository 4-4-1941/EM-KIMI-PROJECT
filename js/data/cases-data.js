/**
 * Casos Clínicos Ramificados para el Simulador de Entrevista Motivacional
 * Basados en la rúbrica MITI 4.2.1 y la 4.ª edición de Miller & Rollnick (2023)
 */
const CLINICAL_CASES = [
  {
    id: "caso-carlos",
    title: "Caso 1: Carlos (38 años) — Ambivalencia ante el Consumo de Alcohol",
    profile: {
      name: "Carlos",
      age: 38,
      profession: "Ingeniero de Sistemas",
      context: "Acude a consulta médica preventiva por insistencia de su pareja. Sus transaminasas hepáticas salieron elevadas. Reconoce que bebe cerveza los fines de semana para 'desconectar' de la presión laboral, pero minimiza el impacto general.",
      initialState: "Defensivo y ambivalente. Teme que le prohíban beber por completo."
    },
    stages: [
      {
        step: 1,
        clientPrompt: "Mire, doctor, vengo porque mi esposa me insistió tras los análisis, pero honestamente yo no soy ningún alcohólico. Trabajo de lunes a viernes diez horas al día sin fallar. El fin de semana solo salgo con amigos a relajarme con unas cervezas. Todo el mundo lo hace.",
        options: [
          {
            id: "opt-1a",
            text: "Carlos, los análisis de laboratorio no mienten: sus transaminasas indican daño hepático precoz. Si sigue bebiendo así, desarrollará cirrosis o esteatosis severa.",
            type: "EM_NON_ADHERENT",
            code: "Fixing Reflex / Confrontación",
            clientReaction: "Pues muchos médicos exageran los números. Mi abuelo bebió toda la vida y vivió hasta los 85. Me siento en perfecto estado.",
            impact: "sustain",
            score: 1,
            feedback: "<strong>Error técnico grave:</strong> Activación del <em>Fixing Reflex</em> y la <em>Trampa de la Confrontación</em>. Al recurrir a los datos analíticos para doblegar su perspectiva, se desencadena reactancia psicológica inmediata (Brehm & Brehm, 1981) y el consultante verbaliza argumentos defensivos (Discurso de Sostenimiento) según la Teoría de la Autopercepción (Bem, 1972).",
            citation: "Miller, W. R., & Rollnick, S. (2023). Motivational interviewing (4th ed.), Cap. 2."
          },
          {
            id: "opt-1b",
            text: "¿Cuántas botellas de cerveza se toma exactamente cada viernes y sábado?",
            type: "NEUTRAL",
            code: "Pregunta Cerrada / Trampa del Interrogatorio",
            clientReaction: "No llevo la cuenta exacta... cuatro, cinco, a veces más si la reunión se alarga. Lo normal.",
            impact: "neutral",
            score: 2,
            feedback: "<strong>Subóptimo:</strong> Trampa del interrogatorio con pregunta cerrada. Frena la exploración de los significados emocionales y posiciona al paciente en una postura pasiva de responder datos burocráticos.",
            citation: "Moyers et al. (2014). MITI 4.2.1 Coding Manual."
          },
          {
            id: "opt-1c",
            text: "Para usted es muy importante dejar claro que es un profesional responsable y que estas salidas de fin de semana representan un espacio indispensable de alivio y desconexión frente al estrés semanal.",
            type: "EM_ADHERENT",
            code: "Reflejo Complejo / Validación de Autonomía",
            clientReaction: "Exacto... es que la presión en la empresa es asfixiante. Aunque, siendo sincero, los domingos en la noche a veces me cuesta dormir y los lunes llego al trabajo con la cabeza embotada.",
            impact: "change",
            score: 5,
            feedback: "<strong>Excelente intervención:</strong> Reflejo complejo que reconoce y valida el significado de su conducta sin juzgar. Al no sentirse atacado ni etiquetado, Carlos baja las defensas de forma espontánea e introduce él mismo la primera señal de discrepancia / discurso de cambio (*Change Talk* preparatorio: Necesidad/Razón).",
            citation: "Amrhein et al. (2003); Miller & Rollnick (2012, 2023)."
          }
        ]
      },
      {
        step: 2,
        clientPrompt: "Es que cuando lo pienso en frío, el lunes pasado cometí un error en un despliegue de código por la fatiga del fin de semana y mi jefe me llamó la atención. Me dio mucha vergüenza.",
        options: [
          {
            id: "opt-2a",
            text: "¿Ve lo que le decía? El alcohol ya está saboteando su carrera profesional. Tiene que ponerse una meta de cero consumo a partir de hoy.",
            type: "EM_NON_ADHERENT",
            code: "Fixing Reflex / Enfoque Prematuro",
            clientReaction: "Tampoco es para tanto, fue un error menor que corregí en media hora. No necesito que me controlen la vida.",
            impact: "sustain",
            score: 1,
            feedback: "<strong>Error:</strong> Se arrebata la autonomía del consultante y se impone una solución directiva externa prematura. Se extingue el discurso de cambio recién iniciado y reaparece la discordia relacional.",
            citation: "Miller & Rollnick (2023), Tarea de Evocar vs. Imposición."
          },
          {
            id: "opt-2b",
            text: "Por un lado disfruta de esa relajación con amigos, y al mismo tiempo su reputación y competencia en el trabajo son tan valiosas para usted que le dolió mucho sentir que estaban en riesgo.",
            type: "EM_ADHERENT",
            code: "Reflejo Doble / Sembrar Semillas (Planting Seeds)",
            clientReaction: "Totalmente. Mi carrera me ha costado diez años de sacrificio. No quiero tirar por la borda lo que he construido por pasarme de copas un sábado.",
            impact: "change",
            score: 5,
            feedback: "<strong>Maestría clínica (MITI Nivel Avanzado):</strong> Reflejo doble que conecta la ambivalencia con sus valores nucleares profundos (identidad profesional). Estimula directamente la emergencia de Discurso de Cambio fuerte (CAT: Razones y Deseo explícito de cuidar su trayectoria).",
            citation: "Miller & Moyers (2021); Festinger (1957) Disonancia Cognitiva."
          },
          {
            id: "opt-2c",
            text: "¿Y qué le dijo su jefe exactamente cuando ocurrió el problema?",
            type: "NEUTRAL",
            code: "Pregunta Abierta / Desvío de Foco",
            clientReaction: "Me dijo que tuviera más cuidado, nada más. Pasó a otro tema.",
            impact: "neutral",
            score: 2.5,
            feedback: "<strong>Oportunidad perdida:</strong> Si bien es una pregunta abierta, desvía el foco de la emoción y del valor personal hacia un detalle narrativo irrelevante, enfriando el impulso motivacional.",
            citation: "Rollnick et al. (2008)."
          }
        ]
      },
      {
        step: 3,
        clientPrompt: "Si tuviera que hacer un ajuste, ¿cómo podría empezar sin tener que aislarme socialmente de mis amigos?",
        options: [
          {
            id: "opt-3a",
            text: "Usted ya ha logrado metas muy complejas en su vida profesional cuando se lo propuso. ¿Qué ideas se le ocurren a usted mismo que le permitirían compartir con sus amigos y a la vez despertarse despejado el domingo?",
            type: "EM_ADHERENT",
            code: "Empoderamiento (Empowerment) / Evocación de Capacidad",
            clientReaction: "Podría pedir cerveza sin alcohol después de la segunda ronda, o retirarme a las 11 pm en vez de quedarme hasta la madrugada. Si les digo que tengo que madrugar para entrenar, nadie me va a insistir.",
            impact: "change",
            score: 5,
            feedback: "<strong>Intervención óptima de la 4.ª Edición:</strong> Aplica el principio de <em>Empowerment</em>. Hace que el propio paciente genere el plan de acción concreto (CAT: Pasos Tomados y Activación), garantizando internalización y autoeficacia (Bandura, 1977).",
            citation: "Miller & Rollnick (2023), Tarea de Planificar; Bandura (1977)."
          },
          {
            id: "opt-3b",
            text: "Lo mejor es que cambie de círculo de amistades; esos amigos solo lo arrastran a beber.",
            type: "EM_NON_ADHERENT",
            code: "Consejo No Solicitado / Invalidación",
            clientReaction: "Son mis amigos desde la secundaria, no los voy a abandonar. Eso no es negociable para mí.",
            impact: "sustain",
            score: 1,
            feedback: "<strong>Grave infracción del espíritu:</strong> Consejo invasivo no solicitado que vulnera los vínculos afectivos del consultante y destruye la alianza colaborativa.",
            citation: "Moyers et al. (2014)."
          }
        ]
      }
    ]
  },
  {
    id: "caso-elena",
    title: "Caso 2: Elena (52 años) — Salud Crónica y Adherencia en Diabetes Tipo 2",
    profile: {
      name: "Elena",
      age: 52,
      profession: "Profesora de Secundaria",
      context: "Diagnosticada con Diabetes Tipo 2 hace 7 meses. HbA1c en 8.8%. Se le prescribió metformina y ajuste dietético, pero olvida la medicación frecuentemente y consume alimentos azucarados cuando se siente estresada con las calificaciones escolares.",
      initialState: "Culpabilizada, agobiada y con sensación de fracaso personal."
    },
    stages: [
      {
        step: 1,
        clientPrompt: "Sé que mi hemoglobina glicosilada salió pésima otra vez. Cada vez que vengo a este consultorio me siento como una alumna desobediente a la que van a reprender. Entre el colegio, mi madre enferma y las tareas de la casa, no tengo tiempo de pesar la comida ni de salir a caminar.",
        options: [
          {
            id: "opt-elena-1a",
            text: "Elena, aquí nadie está para juzgarla ni regañarla. Al contrario, me asombra cómo logra sostener tantas responsabilidades familiares y laborales al mismo tiempo. Es admirable su entrega.",
            type: "EM_ADHERENT",
            code: "Afirmación Compleja / Alianza Desculpabilizadora",
            clientReaction: "Gracias... casi nadie ve lo difícil que es cuidar a una madre con demencia y atender a 90 alumnos. Me siento muy cansada, pero quiero estar sana para ellos.",
            impact: "change",
            score: 5,
            feedback: "<strong>Alta fidelidad técnica:</strong> Afirmación compleja (Miller & Moyers, 2021) que desactiva la trampa de la culpa y la trampa del experto. Conecta con el valor del cuidado familiar y genera de inmediato lenguaje de deseo y necesidad (*Change Talk*).",
            citation: "Miller & Moyers (2021); Miller & Rollnick (2023)."
          },
          {
            id: "opt-elena-1b",
            text: "Si no se cuida, Elena, no va a poder cuidar a nadie. La diabetes mal cuidada provoca ceguera y amputaciones. El tiempo tiene que buscarlo como sea.",
            type: "EM_NON_ADHERENT",
            code: "Fixing Reflex / Apelación al Miedo",
            clientReaction: "Ya sé todo eso, doctor. Solo hace que me sienta más angustiada y con ganas de comer algo dulce para calmar la ansiedad.",
            impact: "sustain",
            score: 1,
            feedback: "<strong>Error iatrogénico:</strong> El uso de amenazas sobre complicaciones físicas eleva la angustia emocional y activa conductas de evitación y comida emocional compensatoria.",
            citation: "Rollnick, Miller & Butler (2008), Motivational Interviewing in Health Care."
          }
        ]
      },
      {
        step: 2,
        clientPrompt: "Me gustaría tomarme las pastillas todos los días sin falta, pero cuando llego en la noche a casa estoy tan agotada que simplemente se me olvida si me la tomé o no.",
        options: [
          {
            id: "opt-elena-2a",
            text: "¿Me permite compartirle lo que otros profesores y personas muy ocupadas han probado con éxito para no olvidar sus tomas?",
            type: "EM_ADHERENT",
            code: "Elicit-Provide-Elicit / Petición de Permiso",
            clientReaction: "Sí, por favor, cualquier idea práctica me ayudaría.",
            impact: "change",
            score: 5,
            feedback: "<strong>Excelente práctica médica:</strong> Aplicación del protocolo E-P-E (*Elicit-Provide-Elicit*). Pedir permiso antes de brindar información técnica protege la autonomía del paciente y maximiza la receptividad.",
            citation: "Rollnick et al. (2008); Moyers et al. (2014)."
          },
          {
            id: "opt-elena-2b",
            text: "Descárguese una alarma en el teléfono y póngase un pastillero semanal en la cocina hoy mismo.",
            type: "NEUTRAL",
            code: "Prescripción sin Permiso",
            clientReaction: "El teléfono lo dejo en silencio durante las clases y en la cocina casi nunca estoy.",
            impact: "sustain",
            score: 2,
            feedback: "<strong>Subóptimo:</strong> Dar soluciones estandarizadas sin explorar el contexto cotidiano genera objeciones prácticas inmediatas.",
            citation: "Miller & Rollnick (2012)."
          }
        ]
      }
    ]
  },
  {
    id: "caso-marcos",
    title: "Caso 3: Marcos (19 años) — Mandato Judicial y Reactancia Psicológica",
    profile: {
      name: "Marcos",
      age: 19,
      profession: "Estudiante de bachillerato técnico",
      context: "Remitido por el juzgado de menores tras participar en una riña a la salida de una discoteca en estado de embriaguez. Debe cumplir 6 sesiones obligatorias o enfrentará sanciones penales.",
      initialState: "Hostil, retraído, con los brazos cruzados y mirada evasiva."
    },
    stages: [
      {
        step: 1,
        clientPrompt: "Mire, no pierda su tiempo haciéndose el simpático. Estoy aquí porque el juez me obligó a venir a perder una hora de mi vida. No tengo problemas con nadie ni con las drogas, así que firme el papel de asistencia y me voy.",
        options: [
          {
            id: "opt-marcos-1a",
            text: "A ver jovencito, baje ese tono. Si el juez lo envió aquí es porque cometió una falta grave. Si no colabora en la sesión, informaré de su desacato al tribunal.",
            type: "EM_NON_ADHERENT",
            code: "Trampa de la Confrontación / Coerción Activa",
            clientReaction: "(Guarda silencio absoluto, mira al suelo y se niega a responder cualquier otra palabra).",
            impact: "sustain",
            score: 0,
            feedback: "<strong>Fracaso clínico rotundo:</strong> Escalar la discordia institucional confirma la creencia del adolescente de que el profesional es un agente punitivo más del sistema penal. Se anula por completo la alianza.",
            citation: "Brehm & Brehm (1981); Moyers & Miller (2013)."
          },
          {
            id: "opt-marcos-1b",
            text: "Tienes toda la razón, Marcos. Estás aquí por obligación judicial y preferirías estar en cualquier otro lado. Además, nadie —ni el juez ni yo— puede obligarte a decir nada que no quieras, ni a cambiar nada de tu vida si tú no lo decides. La última palabra sobre ti la tienes tú.",
            type: "EM_ADHERENT",
            code: "Restauración de Autonomía Radical / Desactivación de Discordia",
            clientReaction: "...(descruza los brazos y suspira). Por fin alguien que no me viene con sermones hipócritas. La policía solo me agarró a mí porque fui el único que no corrió cuando empezó la bronca.",
            impact: "change",
            score: 5,
            feedback: "<strong>Intervención magistral:</strong> Desactiva la reactancia psicológica paradójica al conceder y enfatizar de manera honesta la autonomía inalienable del consultante. Pasa instantáneamente de la discordia al diálogo auténtico.",
            citation: "Miller & Rollnick (2023), Cap. 12; Brehm (1981)."
          }
        ]
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CLINICAL_CASES };
}
