/**
 * Batería de Ejercicios Interactivos de Micro-habilidades (DARN-CAT & OARS)
 * Respaldado en Amrhein et al. (2003) y Miller & Rollnick (2023)
 */
const DRILLS_DATA = {
  darnCat: [
    {
      id: 1,
      quote: "Ojalá pudiera levantarme sin esta pesadez en el pecho todas las mañanas.",
      correct: "D",
      category: "Deseo (DARN Preparatorio)",
      explanation: "Expresa un anhelo o deseo subjetivo de cambio sin comprometerse aún a ninguna acción concreta. Típico de la 'D' en DARN (Amrhein et al., 2003)."
    },
    {
      id: 2,
      quote: "Sé que si sigo comiendo así, terminaré con las mismas úlceras que sufrió mi padre.",
      correct: "R",
      category: "Razones (DARN Preparatorio)",
      explanation: "Plantea una justificación lógica causal / consecuencia negativa específica que fundamenta la necesidad de cambiar (Amrhein et al., 2003)."
    },
    {
      id: 3,
      quote: "El lunes mismo le voy a decir a mi jefe que no aceptaré más horas extras los fines de semana.",
      correct: "C",
      category: "Compromiso (CAT Movilizador)",
      explanation: "Utiliza un verbo de compromiso en futuro explícito ('voy a decir'). Es una promesa de acción definida que predice cambio conductual real."
    },
    {
      id: 4,
      quote: "Ayer en la noche regalé todos los ceniceros y encendedores que tenía en la casa.",
      correct: "TS",
      category: "Pasos Tomados (CAT Movilizador)",
      explanation: "Describe una conducta concreta ya realizada en el pasado reciente en dirección hacia la meta terapéutica ('Taking Steps')."
    },
    {
      id: 5,
      quote: "La verdad es que fumar un cigarro después de almorzar es el único placer que me queda en el día.",
      correct: "ST",
      category: "Discurso de Sostenimiento (Sustain Talk)",
      explanation: "Argumenta a favor de mantener el comportamiento actual y destaca sus beneficios subjetivos. Requiere escucha reflexiva sin juzgar."
    },
    {
      id: 6,
      quote: "Tengo que reducir mis niveles de estrés como sea, mi cuerpo no da más.",
      correct: "N",
      category: "Necesidad (DARN Preparatorio)",
      explanation: "Expone una urgencia e imperativo interno ('tengo que') sin detallar los pasos técnicos para lograrlo."
    },
    {
      id: 7,
      quote: "Yo sé que si me pongo la alarma en el teléfono, soy perfectamente capaz de tomarme la pastilla a tiempo.",
      correct: "A",
      category: "Capacidad (DARN Preparatorio)",
      explanation: "Verbaliza autoeficacia percibida ('soy capaz de'), un elemento crucial de la autoeficacia de Bandura (1977)."
    },
    {
      id: 8,
      quote: "Estoy dispuesto a venir dos veces por semana a las sesiones del taller.",
      correct: "Act",
      category: "Activación (CAT Movilizador)",
      explanation: "Indica una disposición inmediata ('estoy dispuesto a') que bordea el compromiso formal sin cerrar aún el contrato de acción."
    }
  ],
  oarsDrills: [
    {
      id: 1,
      scenario: "Consultante: 'Todo el mundo me dice lo que tengo que hacer con mi peso, pero ninguno de ellos vive con mi ansiedad ni tiene mi trabajo.'",
      directiveTrap: "Usted no debería fijarse en lo que dicen los demás, sino enfocarse en su salud por su propio bien.",
      options: [
        {
          text: "¿Y por qué no le dice a esas personas que no se metan en su vida privada?",
          type: "incorrect",
          feedback: "Pregunta directiva que incita a la confrontación interpersonal en lugar de procesar la emoción."
        },
        {
          text: "Se siente profundamente incomprendido y agotado de que opinen sobre su cuerpo sin conocer el peso real de sus cargas cotidianas.",
          type: "correct",
          feedback: "<strong>¡Excelente reflejo complejo!</strong> Valida la experiencia emocional interna profunda (empatía precisa) sin juzgar ni dar consejos."
        },
        {
          text: "¿Cuánto pesa actualmente y cuántas calorías consume?",
          type: "incorrect",
          feedback: "Trampa del interrogatorio con recolección de datos que destruye la sintonía relacional."
        }
      ]
    },
    {
      id: 2,
      scenario: "Consultante: 'Llevo 3 semanas seguidas asistiendo al gimnasio tres días por semana, aunque hubo días en que llovía y me costaba levantarme.'",
      directiveTrap: "¡Qué bien! Siga así y no afloje.",
      options: [
        {
          text: "Usted es una persona con una determinación impresionante; cuando se compromete con su bienestar, es capaz de superar la incomodidad para cumplir con su palabra.",
          type: "correct",
          feedback: "<strong>¡Afirmación Compleja magistral!</strong> (Miller & Moyers, 2021). No es un simple aplauso exterior, sino que conecta la conducta con una fortaleza identitaria nuclear (determinación e integridad)."
        },
        {
          text: "¿Y por qué no va cuatro días en lugar de tres?",
          type: "incorrect",
          feedback: "Exigencia perfeccionista que minimiza el logro alcanzado y desmotiva al consultante."
        }
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DRILLS_DATA };
}
