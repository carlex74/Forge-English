// Catálogo estático curricular enriquecido de guías y cheat sheets gramaticales para "Quick Learn"
// Diseñado siguiendo estándares pedagógicos (MCER / Cambridge) con desglose cromático de la composición oracional

export const QUICK_LEARN_CATEGORIES = [
  { id: 'all', label: 'Todos los Tópicos', icon: 'Sparkles' },
  { id: 'sentences', label: 'Estructura Oracional', icon: 'Layout' },
  { id: 'verbs', label: 'Tiempos Verbales', icon: 'Clock' },
  { id: 'adjectives', label: 'Uso de Adjetivos', icon: 'Palette' },
  { id: 'pronouns', label: 'Pronombres', icon: 'Users' },
  { id: 'prepositions', label: 'Preposiciones', icon: 'Compass' },
  { id: 'connectors', label: 'Conectores', icon: 'Link' },
]

export const QUICK_LEARN_TOPICS = [
  // =========================================================================
  // 1. ESTRUCTURA BÁSICA DE LA ORACIÓN (WORD ORDER S-V-O)
  // =========================================================================
  {
    id: 'sentence-structure',
    category: 'sentences',
    level: 'A1 - A2',
    title: 'Sentence Fundamentals (Word Order)',
    subtitle: 'La regla de oro del orden S-V-O y la posición de complementos',
    summary: 'A diferencia del español, el inglés tiene un orden de palabras estricto y casi nunca permite omitir el sujeto.',
    formulaBadge: 'Sujeto + Verbo + Objeto + Lugar + Tiempo (S-V-O-P-T)',
    formulaTokens: [
      { role: 'Sujeto (S)', color: 'blue', desc: 'Quién realiza la acción (obligatorio)' },
      { role: 'Verbo (V)', color: 'emerald', desc: 'Acción o estado del sujeto' },
      { role: 'Objeto (O)', color: 'amber', desc: 'Quién o qué recibe la acción directa' },
      { role: 'Lugar (P)', color: 'teal', desc: 'Dónde ocurre la acción' },
      { role: 'Tiempo (T)', color: 'rose', desc: 'Cuándo ocurre la acción (al final)' },
    ],
    explanation: 'En español es natural decir "Compré una manzana ayer" omitiendo el "Yo". En inglés, el sujeto es estrictamente OBLIGATORIO: "I bought an apple yesterday". Además, los complementos de Lugar siempre anteceden a los de Tiempo: Place antes de Time.',
    rules: [
      {
        title: 'Orden Afirmativo Estándar',
        formula: 'Subject + Verb + Object + Place + Time',
        example: 'She plays tennis at the club on Sundays.',
      },
      {
        title: 'Preguntas con Auxiliar (Inversión Q-A-S-V)',
        formula: 'Question Word + Auxiliary + Subject + Verb + Complement?',
        example: 'Where do you study English in the evening?',
      },
      {
        title: 'Posición de Adverbios de Frecuencia (always, never, often)',
        formula: 'Antes del verbo principal, pero DESPUÉS del verbo "to be"',
        example: 'I always drink water.  |  He is always punctual.',
      }
    ],
    coloredSentences: [
      {
        en: 'My brother bought a new laptop at the store yesterday.',
        es: 'Mi hermano compró una laptop nueva en la tienda ayer.',
        tokens: [
          { text: 'My brother', role: 'Sujeto', color: 'blue' },
          { text: 'bought', role: 'Verbo', color: 'emerald' },
          { text: 'a new laptop', role: 'Objeto', color: 'amber' },
          { text: 'at the store', role: 'Lugar', color: 'teal' },
          { text: 'yesterday.', role: 'Tiempo', color: 'rose' },
        ]
      },
      {
        en: 'Where do you study English on weekdays?',
        es: '¿Dónde estudias inglés los días de semana?',
        tokens: [
          { text: 'Where', role: 'Wh- Word', color: 'indigo' },
          { text: 'do', role: 'Auxiliar', color: 'purple' },
          { text: 'you', role: 'Sujeto', color: 'blue' },
          { text: 'study', role: 'Verbo', color: 'emerald' },
          { text: 'English', role: 'Objeto', color: 'amber' },
          { text: 'on weekdays?', role: 'Tiempo', color: 'rose' },
        ]
      },
      {
        en: 'They are always on time for every meeting.',
        es: 'Ellos siempre llegan a tiempo a cada reunión.',
        tokens: [
          { text: 'They', role: 'Sujeto', color: 'blue' },
          { text: 'are', role: 'Verbo (Be)', color: 'emerald' },
          { text: 'always', role: 'Adverbio', color: 'purple' },
          { text: 'on time for every meeting.', role: 'Complemento', color: 'slate' },
        ]
      }
    ],
    pitfalls: [
      'Omitir el sujeto: "Is raining" ❌ → "It is raining" ✔️ (el inglés requiere el pronombre "it").',
      'Poner el tiempo antes del objeto: "I saw yesterday my friend" ❌ → "I saw my friend yesterday" ✔️.'
    ]
  },

  // =========================================================================
  // 2. TIEMPOS VERBALES CON SUBPÁGINAS Y SUBTÓPICOS
  // =========================================================================
  {
    id: 'verb-tenses',
    category: 'verbs',
    level: 'A1 - B2',
    title: 'Verb Tenses & Aspects',
    subtitle: 'El mapa completo de los tiempos verbales en inglés',
    summary: 'Aprende cuándo usar cada tiempo verbal y haz clic en cualquiera de ellos para ver su explicación exhaustiva con fórmulas y colores.',
    formulaBadge: 'Tiempos Verbales: Presente, Pasado y Futuro',
    formulaTokens: [
      { role: 'Sujeto', color: 'blue', desc: 'Quién realiza la acción' },
      { role: 'Auxiliar', color: 'purple', desc: 'Do/Does, Have/Has, Will, Be' },
      { role: 'Verbo Principal', color: 'emerald', desc: 'Infinitivo, -ing o Participio' },
      { role: 'Complemento / Señal', color: 'amber', desc: 'Contexto y marcador temporal' },
    ],
    explanation: 'El inglés clasifica los verbos mediante Tiempo (Presente, Pasado, Futuro) y Aspecto (Simple, Continuo, Perfecto). Explora a continuación cada tiempo verbal en detalle:',
    // Subtópicos para navegación profunda
    subtopics: [
      {
        id: 'present-simple',
        name: 'Present Simple',
        subtitle: 'Rutinas, hábitos y hechos universales',
        level: 'A1',
        badge: 'S + Verb(-s para he/she/it)',
        whenToUse: [
          'Hábitos y rutinas cotidianas: "I wake up at 7 AM every day."',
          'Hechos científicos y verdades permanentes: "Water boils at 100°C."',
          'Horarios fijados o transporte público: "The train leaves at 9:00 PM."',
          'Estados y emociones con verbos estáticos (like, love, know, understand).'
        ],
        formulas: [
          {
            type: 'Afirmativa (+)',
            formula: 'Sujeto + Verbo (añadir "-s" o "-es" para he/she/it) + Complemento',
            tokens: [
              { text: 'She', role: 'Sujeto', color: 'blue' },
              { text: 'speaks', role: 'Verbo (-s)', color: 'emerald' },
              { text: 'three languages fluently.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Negativa (-)',
            formula: 'Sujeto + do/does not + Verbo en base + Complemento',
            tokens: [
              { text: 'He', role: 'Sujeto', color: 'blue' },
              { text: 'does not (doesn\'t)', role: 'Auxiliar Negativo', color: 'purple' },
              { text: 'eat', role: 'Verbo Base', color: 'emerald' },
              { text: 'meat.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Pregunta (?)',
            formula: 'Do/Does + Sujeto + Verbo en base + Complemento?',
            tokens: [
              { text: 'Do', role: 'Auxiliar', color: 'purple' },
              { text: 'you', role: 'Sujeto', color: 'blue' },
              { text: 'live', role: 'Verbo Base', color: 'emerald' },
              { text: 'in this neighborhood?', role: 'Complemento', color: 'amber' }
            ]
          }
        ],
        signalWords: 'always, usually, often, sometimes, rarely, never, every day/week/month, on Mondays',
        coloredSentences: [
          {
            en: 'She works at an international hospital in Madrid.',
            es: 'Ella trabaja en un hospital internacional en Madrid.',
            tokens: [
              { text: 'She', role: 'Sujeto (3ª Sing)', color: 'blue' },
              { text: 'works', role: 'Verbo +s', color: 'emerald' },
              { text: 'at an international hospital', role: 'Lugar', color: 'teal' },
              { text: 'in Madrid.', role: 'Complemento', color: 'slate' },
            ]
          },
          {
            en: 'Do they play soccer on the weekend?',
            es: '¿Ellos juegan al fútbol los fines de semana?',
            tokens: [
              { text: 'Do', role: 'Auxiliar', color: 'purple' },
              { text: 'they', role: 'Sujeto', color: 'blue' },
              { text: 'play', role: 'Verbo Base', color: 'emerald' },
              { text: 'soccer', role: 'Objeto', color: 'amber' },
              { text: 'on the weekend?', role: 'Tiempo', color: 'rose' },
            ]
          }
        ],
        pitfalls: [
          'Olvidar agregar "-s" o "-es" a la tercera persona: "He speak English" ❌ → "He speaks English" ✔️.',
          'Dejar la "-s" en el verbo cuando ya usamos does/doesn\'t: "He doesn\'t works" ❌ → "He doesn\'t work" ✔️.'
        ]
      },
      {
        id: 'present-continuous',
        name: 'Present Continuous',
        subtitle: 'Acciones en progreso ahora o situaciones temporales',
        level: 'A1 - A2',
        badge: 'S + am/is/are + Verb-ing',
        whenToUse: [
          'Acciones ocurriendo exactamente en este instante: "I am writing an email now."',
          'Situaciones temporales actuales: "He is living with his parents this month."',
          'Tendencias o cambios continuos: "The climate is changing rapidly."',
          'Planes personales firmes para el futuro cercano: "We are meeting Sarah tomorrow."'
        ],
        formulas: [
          {
            type: 'Afirmativa (+)',
            formula: 'Sujeto + am/is/are + Verbo con "-ing" + Complemento',
            tokens: [
              { text: 'They', role: 'Sujeto', color: 'blue' },
              { text: 'are', role: 'Auxiliar Be', color: 'purple' },
              { text: 'studying', role: 'Verbo -ing', color: 'emerald' },
              { text: 'for the exam right now.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Negativa (-)',
            formula: 'Sujeto + am/is/are not + Verbo con "-ing" + Complemento',
            tokens: [
              { text: 'I', role: 'Sujeto', color: 'blue' },
              { text: 'am not', role: 'Auxiliar Negativo', color: 'purple' },
              { text: 'watching', role: 'Verbo -ing', color: 'emerald' },
              { text: 'television at the moment.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Pregunta (?)',
            formula: 'Am/Is/Are + Sujeto + Verbo con "-ing" + Complemento?',
            tokens: [
              { text: 'Is', role: 'Auxiliar Be', color: 'purple' },
              { text: 'she', role: 'Sujeto', color: 'blue' },
              { text: 'working', role: 'Verbo -ing', color: 'emerald' },
              { text: 'from home today?', role: 'Complemento', color: 'amber' }
            ]
          }
        ],
        signalWords: 'now, right now, at the moment, currently, this week, today, Look!, Listen!',
        coloredSentences: [
          {
            en: 'We are learning English grammar together right now.',
            es: 'Estamos aprendiendo gramática en inglés juntos ahora mismo.',
            tokens: [
              { text: 'We', role: 'Sujeto', color: 'blue' },
              { text: 'are', role: 'Aux Be', color: 'purple' },
              { text: 'learning', role: 'Verbo -ing', color: 'emerald' },
              { text: 'English grammar', role: 'Objeto', color: 'amber' },
              { text: 'right now.', role: 'Tiempo', color: 'rose' },
            ]
          }
        ],
        pitfalls: [
          'Usar Present Continuous con verbos de estado: "I am knowing the answer" ❌ → "I know the answer" ✔️.',
          'Olvidar el verbo "to be": "She working today" ❌ → "She is working today" ✔️.'
        ]
      },
      {
        id: 'present-perfect',
        name: 'Present Perfect',
        subtitle: 'Experiencias de vida y acciones pasadas con efecto presente',
        level: 'A2 - B1',
        badge: 'S + have/has + Past Participle (3ª Columna)',
        whenToUse: [
          'Experiencias de vida sin especificar fecha: "I have visited Japan."',
          'Acciones que empezaron en el pasado y continúan en el presente: "I have lived here for 5 years."',
          'Acciones recién terminadas con "just": "She has just finished her dinner."',
          'Acciones pasadas cuyo resultado es visible hoy: "I have lost my key (I cannot open the door now)."'
        ],
        formulas: [
          {
            type: 'Afirmativa (+)',
            formula: 'Sujeto + have/has + Participio Pasado + Complemento',
            tokens: [
              { text: 'We', role: 'Sujeto', color: 'blue' },
              { text: 'have', role: 'Auxiliar Have', color: 'purple' },
              { text: 'lived', role: 'Participio Pasado', color: 'emerald' },
              { text: 'here for ten years.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Negativa (-)',
            formula: 'Sujeto + have/has not (haven\'t / hasn\'t) + Participio Pasado + Complemento',
            tokens: [
              { text: 'He', role: 'Sujeto', color: 'blue' },
              { text: 'has not (hasn\'t)', role: 'Auxiliar Negativo', color: 'purple' },
              { text: 'seen', role: 'Participio Pasado', color: 'emerald' },
              { text: 'that movie yet.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Pregunta (?)',
            formula: 'Have/Has + Sujeto + Participio Pasado + Complemento?',
            tokens: [
              { text: 'Have', role: 'Auxiliar Have', color: 'purple' },
              { text: 'you', role: 'Sujeto', color: 'blue' },
              { text: 'ever eaten', role: 'Participio Pasado', color: 'emerald' },
              { text: 'traditional Mexican tacos?', role: 'Complemento', color: 'amber' }
            ]
          }
        ],
        signalWords: 'already, yet, just, ever, never, since, for, recently, so far',
        coloredSentences: [
          {
            en: 'She has already read that fascinating book twice.',
            es: 'Ella ya ha leído ese libro fascinante dos veces.',
            tokens: [
              { text: 'She', role: 'Sujeto', color: 'blue' },
              { text: 'has', role: 'Aux Has', color: 'purple' },
              { text: 'already', role: 'Adverbio', color: 'slate' },
              { text: 'read', role: 'Participio', color: 'emerald' },
              { text: 'that fascinating book twice.', role: 'Complemento', color: 'amber' },
            ]
          }
        ],
        pitfalls: [
          'Usar Present Perfect con fechas exactas del pasado: "I have seen him yesterday" ❌ → "I saw him yesterday" ✔️ (con fecha cerrada se usa Past Simple).',
          'Confundir "since" (punto de inicio: since 2010) con "for" (duración: for 5 years).'
        ]
      },
      {
        id: 'past-simple',
        name: 'Past Simple',
        subtitle: 'Acciones completadas en un tiempo específico del pasado',
        level: 'A2',
        badge: 'S + Verb(-ed / Irregular 2da columna)',
        whenToUse: [
          'Acciones completamente terminadas en el pasado con un momento específico: "We arrived yesterday."',
          'Secuencia de eventos cronológicos: "He opened the door, smiled and entered the room."',
          'Hábitos pasados que ya no ocurren: "When I was young, I played the piano."'
        ],
        formulas: [
          {
            type: 'Afirmativa (+)',
            formula: 'Sujeto + Verbo en Pasado (-ed o 2da columna) + Complemento',
            tokens: [
              { text: 'They', role: 'Sujeto', color: 'blue' },
              { text: 'visited', role: 'Verbo Pasado', color: 'emerald' },
              { text: 'their grandparents last weekend.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Negativa (-)',
            formula: 'Sujeto + did not (didn\'t) + Verbo en base (infinitivo) + Complemento',
            tokens: [
              { text: 'I', role: 'Sujeto', color: 'blue' },
              { text: 'did not (didn\'t)', role: 'Auxiliar Did', color: 'purple' },
              { text: 'call', role: 'Verbo Base', color: 'emerald' },
              { text: 'him yesterday.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Pregunta (?)',
            formula: 'Did + Sujeto + Verbo en base (infinitivo) + Complemento?',
            tokens: [
              { text: 'Did', role: 'Auxiliar Did', color: 'purple' },
              { text: 'you', role: 'Sujeto', color: 'blue' },
              { text: 'understand', role: 'Verbo Base', color: 'emerald' },
              { text: 'the teacher\'s explanation?', role: 'Complemento', color: 'amber' }
            ]
          }
        ],
        signalWords: 'yesterday, last night/month/year, two days ago, in 1999, when I was a child',
        coloredSentences: [
          {
            en: 'He went to London and bought a red raincoat last month.',
            es: 'Él fue a Londres y compró un impermeable rojo el mes pasado.',
            tokens: [
              { text: 'He', role: 'Sujeto', color: 'blue' },
              { text: 'went', role: 'Verbo Pasado', color: 'emerald' },
              { text: 'to London and', role: 'Lugar', color: 'teal' },
              { text: 'bought', role: 'Verbo Pasado', color: 'emerald' },
              { text: 'a red raincoat', role: 'Objeto', color: 'amber' },
              { text: 'last month.', role: 'Tiempo', color: 'rose' },
            ]
          }
        ],
        pitfalls: [
          'Poner el verbo en pasado después de didn\'t: "I didn\'t went" ❌ → "I didn\'t go" ✔️.',
          'Poner el verbo en pasado en preguntas con did: "Did you bought it?" ❌ → "Did you buy it?" ✔️.'
        ]
      },
      {
        id: 'past-continuous',
        name: 'Past Continuous',
        subtitle: 'Acciones en progreso en el pasado e interrupciones',
        level: 'A2 - B1',
        badge: 'S + was/were + Verb-ing',
        whenToUse: [
          'Acción que estaba en desarrollo cuando otra acción puntual la interrumpió: "I was cooking when she called."',
          'Dos acciones simultáneas en el pasado conectadas por "while": "I was studying while he was sleeping."',
          'Descripción del ambiente o escenario en una historia: "The sun was shining and the birds were singing."'
        ],
        formulas: [
          {
            type: 'Afirmativa (+)',
            formula: 'Sujeto + was/were + Verbo-ing + Complemento',
            tokens: [
              { text: 'I', role: 'Sujeto', color: 'blue' },
              { text: 'was', role: 'Auxiliar Was', color: 'purple' },
              { text: 'driving', role: 'Verbo -ing', color: 'emerald' },
              { text: 'home when it started to snow.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Negativa (-)',
            formula: 'Sujeto + was/were not (wasn\'t/weren\'t) + Verbo-ing + Complemento',
            tokens: [
              { text: 'They', role: 'Sujeto', color: 'blue' },
              { text: 'were not (weren\'t)', role: 'Auxiliar Negativo', color: 'purple' },
              { text: 'listening', role: 'Verbo -ing', color: 'emerald' },
              { text: 'to the instructions.', role: 'Complemento', color: 'amber' }
            ]
          }
        ],
        signalWords: 'while, as, when, at 8 PM yesterday, all evening',
        coloredSentences: [
          {
            en: 'She was sleeping peacefully when the loud alarm rang.',
            es: 'Ella estaba durmiendo plácidamente cuando sonó la fuerte alarma.',
            tokens: [
              { text: 'She', role: 'Sujeto', color: 'blue' },
              { text: 'was', role: 'Aux Was', color: 'purple' },
              { text: 'sleeping', role: 'Acción en progreso', color: 'emerald' },
              { text: 'when', role: 'Conector', color: 'slate' },
              { text: 'the loud alarm rang.', role: 'Interrupción puntual', color: 'rose' },
            ]
          }
        ],
        pitfalls: [
          'Confundir when y while: Usualmente "while" va con Past Continuous ("while I was reading") y "when" va con Past Simple ("when the phone rang").'
        ]
      },
      {
        id: 'future-forms',
        name: 'Future: Will vs Going to',
        subtitle: 'Decisiones espontáneas vs Planes premeditados y evidencia',
        level: 'A2 - B1',
        badge: 'Will (Decisión al momento) vs Going to (Plan previo / Evidencia)',
        whenToUse: [
          'WILL: Decisiones tomadas en el momento exacto de hablar ("I will help you with those bags!").',
          'WILL: Promesas, ofertas y predicciones basadas en opinión ("I think it will be sunny").',
          'GOING TO: Planes o intenciones decididos antes del momento presente ("I am going to study medicine next year").',
          'GOING TO: Predicciones con evidencia física clara e inmediata ("Look at the clouds, it is going to rain!").'
        ],
        formulas: [
          {
            type: 'Will (+ / - / ?)',
            formula: 'S + will / won\'t + Verbo Base',
            tokens: [
              { text: 'I', role: 'Sujeto', color: 'blue' },
              { text: 'will', role: 'Auxiliar Will', color: 'purple' },
              { text: 'call', role: 'Verbo Base', color: 'emerald' },
              { text: 'you as soon as I arrive.', role: 'Complemento', color: 'amber' }
            ]
          },
          {
            type: 'Going to (+ / - / ?)',
            formula: 'S + am/is/are + going to + Verbo Base',
            tokens: [
              { text: 'They', role: 'Sujeto', color: 'blue' },
              { text: 'are going to', role: 'Going to', color: 'purple' },
              { text: 'travel', role: 'Verbo Base', color: 'emerald' },
              { text: 'to Italy next summer.', role: 'Complemento', color: 'amber' }
            ]
          }
        ],
        signalWords: 'tomorrow, next week, soon, in two days, probably, I think, I hope',
        coloredSentences: [
          {
            en: 'Look at that dark sky! It is going to rain very soon.',
            es: '¡Mira ese cielo oscuro! Va a llover muy pronto (evidencia visible).',
            tokens: [
              { text: 'Look at that dark sky!', role: 'Evidencia', color: 'teal' },
              { text: 'It', role: 'Sujeto', color: 'blue' },
              { text: 'is going to', role: 'Going to', color: 'purple' },
              { text: 'rain', role: 'Verbo Base', color: 'emerald' },
              { text: 'very soon.', role: 'Tiempo', color: 'rose' },
            ]
          }
        ],
        pitfalls: [
          'Usar will para planes con boleto o cita comprada: "I will fly to Paris tomorrow" ❌ → "I am flying / I am going to fly to Paris tomorrow" ✔️.'
        ]
      }
    ]
  },

  // =========================================================================
  // 3. EL ORDEN DE LOS ADJETIVOS (OSASCOMP)
  // =========================================================================
  {
    id: 'adjective-order',
    category: 'adjectives',
    level: 'A2 - B1',
    title: 'Adjective Order (OSASCOMP)',
    subtitle: 'El orden estricto de múltiples adjetivos antes del sustantivo',
    summary: 'Aprende la nemotécnica universal OSASCOMP para ordenar adjetivos con colores distintivos para cada categoría.',
    formulaBadge: 'Regla Mnemotécnica: O - S - A - S - C - O - M - P + Sustantivo',
    formulaTokens: [
      { role: 'Opinion (1)', color: 'blue', desc: 'Opinión o juicio: lovely, beautiful, delicious, ugly' },
      { role: 'Size (2)', color: 'emerald', desc: 'Tamaño: big, small, huge, tiny, tall' },
      { role: 'Age (3)', color: 'amber', desc: 'Edad / Antigüedad: old, young, new, ancient' },
      { role: 'Shape (4)', color: 'purple', desc: 'Forma: round, square, triangular, oval' },
      { role: 'Color (5)', color: 'rose', desc: 'Color: red, blue, dark, greenish, white' },
      { role: 'Origin (6)', color: 'teal', desc: 'Origen / Nacionalidad: Italian, French, Spanish' },
      { role: 'Material (7)', color: 'cyan', desc: 'Material: wooden, leather, golden, cotton' },
      { role: 'Purpose (8)', color: 'indigo', desc: 'Propósito: sleeping (bag), dining (table), racing (car)' },
      { role: 'Sustantivo (9)', color: 'slate', desc: 'El objeto o ser modificado' },
    ],
    explanation: 'En inglés no puedes colocar los adjetivos en cualquier orden. Si dices "a red big car", cualquier nativo sabrá inmediatamente que no suena natural: DEBE ser "a big red car". La mnemotecnia OSASCOMP te da el orden mental exacto:',
    osascompBreakdown: [
      { step: '1. Opinion (Opinión)', examples: 'beautiful, lovely, horrible, excellent, delicious, strange', color: 'blue' },
      { step: '2. Size (Tamaño)', examples: 'big, small, huge, tiny, long, short', color: 'emerald' },
      { step: '3. Age (Edad)', examples: 'old, young, antique, new, ancient', color: 'amber' },
      { step: '4. Shape (Forma)', examples: 'round, square, circular, rectangular, flat', color: 'purple' },
      { step: '5. Color (Color)', examples: 'red, black, yellow, greenish, brown', color: 'rose' },
      { step: '6. Origin (Origen)', examples: 'Italian, American, British, Japanese, German', color: 'teal' },
      { step: '7. Material (Material)', examples: 'wooden, leather, silk, metal, cotton, plastic', color: 'cyan' },
      { step: '8. Purpose (Propósito)', examples: 'dining (table), racing (car), sleeping (bag), coffee (cup)', color: 'indigo' },
      { step: '9. Noun (Sustantivo)', examples: 'table, car, jacket, box, dog, building', color: 'slate' },
    ],
    coloredSentences: [
      {
        en: 'She bought a lovely small old round brown Italian wooden dining table.',
        es: 'Ella compró una encantadora y pequeña mesa de comedor redonda, marrón, italiana y de madera antigua.',
        tokens: [
          { text: 'She bought a', role: null },
          { text: 'lovely', role: 'Opinion', color: 'blue' },
          { text: 'small', role: 'Size', color: 'emerald' },
          { text: 'old', role: 'Age', color: 'amber' },
          { text: 'round', role: 'Shape', color: 'purple' },
          { text: 'brown', role: 'Color', color: 'rose' },
          { text: 'Italian', role: 'Origin', color: 'teal' },
          { text: 'wooden', role: 'Material', color: 'cyan' },
          { text: 'dining', role: 'Purpose', color: 'indigo' },
          { text: 'table.', role: 'Sustantivo', color: 'slate' },
        ]
      },
      {
        en: 'He wore an expensive old black leather jacket to the party.',
        es: 'Él llevó una costosa chaqueta de cuero negro vieja a la fiesta.',
        tokens: [
          { text: 'He wore an', role: null },
          { text: 'expensive', role: 'Opinion', color: 'blue' },
          { text: 'old', role: 'Age', color: 'amber' },
          { text: 'black', role: 'Color', color: 'rose' },
          { text: 'leather', role: 'Material', color: 'cyan' },
          { text: 'jacket', role: 'Sustantivo', color: 'slate' },
          { text: 'to the party.', role: null },
        ]
      },
      {
        en: 'They found a fantastic huge ancient German castle in the mountains.',
        es: 'Encontraron un fantástico y enorme castillo alemán antiguo en las montañas.',
        tokens: [
          { text: 'They found a', role: null },
          { text: 'fantastic', role: 'Opinion', color: 'blue' },
          { text: 'huge', role: 'Size', color: 'emerald' },
          { text: 'ancient', role: 'Age', color: 'amber' },
          { text: 'German', role: 'Origin', color: 'teal' },
          { text: 'castle', role: 'Sustantivo', color: 'slate' },
          { text: 'in the mountains.', role: null },
        ]
      }
    ],
    pitfalls: [
      'Poner el color antes del tamaño: "a black big dog" ❌ → "a big black dog" ✔️ (Size va antes de Color).',
      'Poner el adjetivo después del sustantivo: "a jacket leather" ❌ → "a leather jacket" ✔️.'
    ]
  },

  // =========================================================================
  // 4. ADJETIVOS EN -ED vs -ING
  // =========================================================================
  {
    id: 'participial-adjectives',
    category: 'adjectives',
    level: 'A2 - B1',
    title: 'Adjectives: -ed vs -ing',
    subtitle: 'Sentimiento propio vs Cualidad de lo que lo provoca',
    summary: 'Aprende a diferenciar sin fallar nunca entre "I am bored" (estoy aburrido) y "I am boring" (soy aburrido).',
    formulaBadge: '-ED = Emoción interna (sentimiento)  |  -ING = Causa externa (cualidad)',
    formulaTokens: [
      { role: 'Sujeto Sintiente', color: 'blue', desc: 'La persona que experimenta la emoción' },
      { role: 'Adjetivo -ED', color: 'emerald', desc: 'Cómo se siente (bored, tired, excited, confused)' },
      { role: 'Causa / Estímulo', color: 'purple', desc: 'La cosa, película o actividad que lo genera' },
      { role: 'Adjetivo -ING', color: 'amber', desc: 'La característica que produce la emoción (boring, tiring, exciting)' },
    ],
    explanation: 'Los adjetivos terminados en **-ed** describen el estado emocional de una persona o ser vivo. Los adjetivos terminados en **-ing** describen el objeto, evento o situación que produce esa reacción.',
    pairList: [
      { ed: 'Bored (Aburrido)', ing: 'Boring (Monótono / Aburrido)', sample: 'I am bored because the history class is boring.' },
      { ed: 'Tired (Cansado)', ing: 'Tiring (Agotador)', sample: 'Running ten kilometers is tiring, so the runner is tired.' },
      { ed: 'Interested (Interesado)', ing: 'Interesting (Interesante)', sample: 'She is interested in art because it is an interesting topic.' },
      { ed: 'Excited (Emocionado)', ing: 'Exciting (Emocionante)', sample: 'The fans are excited because the championship is exciting.' },
      { ed: 'Confused (Confundido)', ing: 'Confusing (Confuso)', sample: 'The instructions are confusing, so I am very confused.' },
    ],
    coloredSentences: [
      {
        en: 'I am bored because this movie is really boring.',
        es: 'Estoy aburrido porque esta película es realmente aburrida.',
        tokens: [
          { text: 'I am', role: null },
          { text: 'bored', role: 'Sentimiento (-ed)', color: 'emerald' },
          { text: 'because this movie is', role: null },
          { text: 'really boring.', role: 'Causa (-ing)', color: 'amber' },
        ]
      },
      {
        en: 'The students were exhausted after a tiring exam.',
        es: 'Los estudiantes estaban exhaustos tras un examen agotador.',
        tokens: [
          { text: 'The students were', role: null },
          { text: 'exhausted', role: 'Sentimiento (-ed)', color: 'emerald' },
          { text: 'after a', role: null },
          { text: 'tiring', role: 'Causa (-ing)', color: 'amber' },
          { text: 'exam.', role: null },
        ]
      }
    ],
    pitfalls: [
      'Decir "I am boring" cuando quieres decir "Estoy aburrido": "I am boring" significa "Soy un aburrido/pesado" ❌ → "I am bored" ✔️.',
      'Decir "The game was excited": Los objetos inanimados no sienten emoción ❌ → "The game was exciting" ✔️.'
    ]
  },

  // =========================================================================
  // 5. COMPARATIVOS Y SUPERLATIVOS
  // =========================================================================
  {
    id: 'comparatives-superlatives',
    category: 'adjectives',
    level: 'A2 - B1',
    title: 'Comparatives & Superlatives',
    subtitle: 'Cómo comparar personas, objetos y extremos',
    summary: 'Aprende las reglas de 1 sílaba (-er/-est), 2+ sílabas (more/most) y las formas irregulares indispensables.',
    formulaBadge: 'Comparativo: A vs B (than)  |  Superlativo: 1 frente al grupo (the ...)',
    formulaTokens: [
      { role: 'Sujeto A', color: 'blue', desc: 'Elemento que se compara' },
      { role: 'Grado Comparativo', color: 'purple', desc: 'faster than / more expensive than' },
      { role: 'Grado Superlativo', color: 'rose', desc: 'the fastest / the most expensive' },
      { role: 'Referente B / Grupo', color: 'teal', desc: 'Con quién se compara o de qué conjunto' },
    ],
    explanation: 'El inglés cuenta las sílabas fonéticas del adjetivo. Si es corto (1 sílaba), se añade el sufijo *-er* o *-est*. Si es largo (2 o más sílabas), se antepone *more* o *the most*.',
    rules: [
      {
        title: 'Adjetivos Cortos (1 sílaba)',
        formula: 'Comparativo: Adj + "-er than"  |  Superlativo: "the" + Adj + "-est"',
        example: 'Fast → Faster than → The fastest  |  Old → Older than → The oldest',
      },
      {
        title: 'Adjetivos de 2 sílabas en "-y"',
        formula: 'La "y" se convierte en "i": Adj + "-ier than"  |  "the" + Adj + "-iest"',
        example: 'Happy → Happier than → The happiest  |  Easy → Easier than → The easiest',
      },
      {
        title: 'Adjetivos Largos (2 o más sílabas)',
        formula: 'Comparativo: "more" + Adj + "than"  |  Superlativo: "the most" + Adj',
        example: 'Expensive → More expensive than → The most expensive',
      },
      {
        title: 'Irregulares de Oro (¡Memorizar!)',
        formula: 'Good → Better → Best  |  Bad → Worse → Worst  |  Far → Further → Furthest',
        example: 'My result is better than yesterday, but hers is the best in the class.',
      }
    ],
    coloredSentences: [
      {
        en: 'A cheetah is much faster than a lion, but the peregrine falcon is the fastest animal in the world.',
        es: 'Un guepardo es mucho más rápido que un león, pero el halcón peregrino es el animal más rápido del mundo.',
        tokens: [
          { text: 'A cheetah is much', role: null },
          { text: 'faster than', role: 'Comparativo Corto', color: 'purple' },
          { text: 'a lion, but the peregrine falcon is', role: null },
          { text: 'the fastest', role: 'Superlativo', color: 'rose' },
          { text: 'animal in the world.', role: 'Grupo', color: 'teal' },
        ]
      },
      {
        en: 'Gold is more valuable than silver, but platinum is the most precious metal.',
        es: 'El oro es más valioso que la plata, pero el platino es el metal más precioso.',
        tokens: [
          { text: 'Gold is', role: null },
          { text: 'more valuable than', role: 'Comparativo Largo', color: 'purple' },
          { text: 'silver, but platinum is', role: null },
          { text: 'the most precious', role: 'Superlativo Largo', color: 'rose' },
          { text: 'metal.', role: null },
        ]
      }
    ],
    pitfalls: [
      'Doble comparativo: "more faster" o "more better" ❌ → "faster" o "better" ✔️.',
      'Usar "that" en vez de "than": "He is older that me" ❌ → "He is older than me" ✔️.'
    ]
  },

  // =========================================================================
  // 6. MATRIZ DE PRONOMBRES
  // =========================================================================
  {
    id: 'pronouns-matrix',
    category: 'pronouns',
    level: 'A1 - B1',
    title: 'The Pronoun Matrix',
    subtitle: 'Domina los pronombres de sujeto, objeto, posesivos y reflexivos',
    summary: 'Diferencia de una vez por todas entre "my" y "mine", "he" y "him", y "myself".',
    formulaBadge: '5 Formas Clave por Persona Gramatical',
    formulaTokens: [
      { role: 'Subject (Sujeto)', color: 'blue', desc: 'Realiza la acción: I, you, he, she, it, we, they' },
      { role: 'Object (Objeto)', color: 'emerald', desc: 'Recibe la acción: me, you, him, her, it, us, them' },
      { role: 'Possessive Adj.', color: 'amber', desc: 'Va con sustantivo: my car, your phone' },
      { role: 'Possessive Pron.', color: 'purple', desc: 'Reemplaza al sustantivo: it is mine, it is yours' },
      { role: 'Reflexive', color: 'rose', desc: 'Recae en sí mismo: myself, yourself, himself' },
    ],
    explanation: 'En español "su" es ambiguo (puede ser de él, de ella o de ellos). En inglés cada pronombre tiene su forma exacta y cambia según si es el ejecutor de la acción, el receptor o el poseedor.',
    pronounTable: [
      { person: '1ª Sing (Yo)', subj: 'I', obj: 'me', possAdj: 'my', possPron: 'mine', refl: 'myself' },
      { person: '2ª Sing (Tú / Vos)', subj: 'you', obj: 'you', possAdj: 'your', possPron: 'yours', refl: 'yourself' },
      { person: '3ª Masc (Él)', subj: 'he', obj: 'him', possAdj: 'his', possPron: 'his', refl: 'himself' },
      { person: '3ª Fem (Ella)', subj: 'she', obj: 'her', possAdj: 'her', possPron: 'hers', refl: 'herself' },
      { person: '3ª Cosa / Animal (Neutro)', subj: 'it', obj: 'it', possAdj: 'its', possPron: 'its', refl: 'itself' },
      { person: '1ª Plur (Nosotros)', subj: 'we', obj: 'us', possAdj: 'our', possPron: 'ours', refl: 'ourselves' },
      { person: '3ª Plur (Ellos/Ellas)', subj: 'they', obj: 'them', possAdj: 'their', possPron: 'theirs', refl: 'themselves' },
    ],
    coloredSentences: [
      {
        en: 'She called him because this wallet is his, not hers.',
        es: 'Ella lo llamó a él porque esta billetera es de él, no de ella.',
        tokens: [
          { text: 'She', role: 'Sujeto', color: 'blue' },
          { text: 'called', role: 'Verbo', color: 'emerald' },
          { text: 'him', role: 'Objeto', color: 'teal' },
          { text: 'because this wallet is', role: null },
          { text: 'his,', role: 'Posesivo Pron.', color: 'purple' },
          { text: 'not', role: null },
          { text: 'hers.', role: 'Posesivo Pron.', color: 'rose' },
        ]
      }
    ],
    pitfalls: [
      'Poner un sustantivo tras el pronombre posesivo: "This is mine book" ❌ → "This is my book" o "This book is mine" ✔️.',
      'Confundir "its" (posesivo) con "it\'s" (it is): "The dog hurt it\'s paw" ❌ → "its paw" ✔️.'
    ]
  },

  // =========================================================================
  // 7. PREPOSICIONES IN, ON, AT
  // =========================================================================
  {
    id: 'prepositions-pyramid',
    category: 'prepositions',
    level: 'A1 - B1',
    title: 'Prepositions: IN, ON, AT',
    subtitle: 'El método de la pirámide: de lo general a lo específico',
    summary: 'Visualiza una pirámide invertida: la base ancha es IN (grande/amplio), el centro es ON (medio/líneas) y la punta es AT (punto exacto).',
    formulaBadge: 'Pirámide: IN (Amplio) → ON (Intermedio) → AT (Punto exacto)',
    formulaTokens: [
      { role: 'IN (General)', color: 'blue', desc: 'Siglos, años, meses, estaciones | Países, ciudades, espacios cerrados' },
      { role: 'ON (Intermedio)', color: 'emerald', desc: 'Días de la semana, fechas | Calles, avenidas, superficies, transporte público' },
      { role: 'AT (Específico)', color: 'amber', desc: 'Horas exactas, momentos | Direcciones puntuales con número, puntos precisos' },
    ],
    explanation: 'Tanto para el Tiempo como para el Lugar, la regla espacial y temporal es la misma. Cuanto más grande y general sea el contenedor de tiempo o espacio, usamos IN. Al acotar a un día o a una superficie, usamos ON. Al apuntar con el dedo a un punto o una hora exacta en el reloj, usamos AT.',
    pyramidLevels: [
      {
        prep: 'IN',
        scope: 'General / Muy amplio',
        timeDesc: 'Años (in 1995), Siglos (in the 21st century), Meses (in July), Estaciones (in winter), Momentos del día (in the morning).',
        placeDesc: 'Países (in Spain), Ciudades (in New York), Espacios cerrados (in the car, in a room, in a box).',
        example: 'I was born in 1998 in a small town in Canada.'
      },
      {
        prep: 'ON',
        scope: 'Intermedio / Superficies y Días',
        timeDesc: 'Días de la semana (on Monday), Fechas concretas (on April 5th), Días especiales (on my birthday).',
        placeDesc: 'Superficies (on the table, on the wall), Calles y avenidas (on Oxford Street), Transporte colectivo (on the bus, on the train, on a plane).',
        example: 'We meet on Fridays in an office on 5th Avenue.'
      },
      {
        prep: 'AT',
        scope: 'Específico / Punto exacto',
        timeDesc: 'Horas exactas (at 5:30 PM), Momentos puntuales (at midnight, at lunchtime, at night, at the weekend [UK]).',
        placeDesc: 'Direcciones exactas (at 124 Main Street), Puntos de encuentro específicos (at the bus stop, at the door, at the station).',
        example: 'The train arrives at 8:00 AM at Platform 3.'
      }
    ],
    coloredSentences: [
      {
        en: 'The keynote presentation begins on Monday at 9:00 AM in the grand auditorium.',
        es: 'La presentación principal comienza el lunes a las 9:00 AM en el gran auditorio.',
        tokens: [
          { text: 'The keynote presentation begins', role: null },
          { text: 'on Monday', role: 'Día (ON)', color: 'emerald' },
          { text: 'at 9:00 AM', role: 'Hora Exacta (AT)', color: 'amber' },
          { text: 'in the grand auditorium.', role: 'Lugar Cerrado (IN)', color: 'blue' },
        ]
      }
    ],
    pitfalls: [
      'Decir "in Monday": Los días siempre llevan ON ❌ → "on Monday" ✔️.',
      'Decir "in the night": La noche puntual es una excepción con AT ❌ → "at night" ✔️.'
    ]
  },

  // =========================================================================
  // 8. CONECTORES Y CLÁUSULAS (LINKING WORDS)
  // =========================================================================
  {
    id: 'sentence-connectors',
    category: 'connectors',
    level: 'A2 - B2',
    title: 'Linking Words & Sentence Connectors',
    subtitle: 'Cómo conectar oraciones con fluidez y coherencia',
    summary: 'Aprende a conectar oraciones con contrastes, causas, consecuencias y adiciones enriquecidas.',
    formulaBadge: '4 Funciones: Contraste, Causa, Consecuencia y Adición',
    formulaTokens: [
      { role: 'Contrast (Contraste)', color: 'rose', desc: 'However, Although, But, Despite' },
      { role: 'Cause (Causa)', color: 'blue', desc: 'Because, Since, As, Due to' },
      { role: 'Result (Consecuencia)', color: 'emerald', desc: 'Therefore, As a result, So, Thus' },
      { role: 'Addition (Adición)', color: 'amber', desc: 'Furthermore, In addition, Moreover' },
    ],
    explanation: 'Los conectores permiten salir de las oraciones simples de principiante y redactar párrafos cohesionados y argumentativos.',
    connectorCategories: [
      {
        type: 'Contraste (Contrast)',
        words: 'However, Although, Even though, But, Despite',
        tip: '"Although" lleva Sujeto + Verbo ("Although it rained..."). "Despite" lleva sustantivo o gerundio ("Despite the rain...").',
        example: 'Although he worked hard, he could not finish on time.'
      },
      {
        type: 'Causa y Razón (Cause & Reason)',
        words: 'Because, Since, As, Due to, Because of',
        tip: '"Because" lleva oración completa ("Because she was tired"). "Because of" lleva sustantivo ("Because of her fatigue").',
        example: 'The flight was delayed due to severe weather.'
      },
      {
        type: 'Consecuencia (Result & Effect)',
        words: 'Therefore, As a result, So, Consequently',
        tip: '"Therefore" y "As a result" suelen iniciar oración seguidos de coma.',
        example: 'She studied hard; therefore, she passed with honors.'
      },
      {
        type: 'Adición (Addition & Expansion)',
        words: 'Furthermore, In addition, Moreover, Also',
        tip: 'Ideales para sumar argumentos adicionales en redacciones formales.',
        example: 'The platform is intuitive; furthermore, it works offline.'
      }
    ],
    coloredSentences: [
      {
        en: 'Although the weather was freezing, they enjoyed their walk in the park.',
        es: 'Aunque el clima estaba helado, disfrutaron su caminata en el parque.',
        tokens: [
          { text: 'Although', role: 'Conector Contraste', color: 'rose' },
          { text: 'the weather was freezing,', role: 'Cláusula 1', color: 'slate' },
          { text: 'they enjoyed their walk in the park.', role: 'Cláusula Principal', color: 'emerald' },
        ]
      }
    ],
    pitfalls: [
      'Usar "Despite of": "Despite" nunca lleva "of" ❌ → "Despite the rain" o "In spite of the rain" ✔️.',
      'Usar "Although" y "But" en la misma frase: "Although it was cold, but we went out" ❌ → "Although it was cold, we went out" ✔️.'
    ]
  }
]
