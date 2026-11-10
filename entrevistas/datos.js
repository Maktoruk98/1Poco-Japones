// Sala de Entrevistas — contenido: categorías, competencias, banco de preguntas y guías.

const CATEGORIAS = {
  clasicas: "Clásicas",
  competencias: "Competencias",
  situacionales: "Situacionales",
  motivacion: "Motivación y encaje",
  presion: "Difíciles y trampa",
  liderazgo: "Liderazgo y gestión",
  tecnologia: "Tecnología",
  ventas: "Ventas y cliente",
  ingles: "In English",
  cierre: "Salario y cierre",
};

const COMPETENCIAS = {
  comunicacion: "Comunicación",
  equipo: "Trabajo en equipo",
  liderazgo: "Liderazgo",
  resolucion: "Resolución de problemas",
  iniciativa: "Iniciativa",
  adaptabilidad: "Adaptabilidad",
  conflicto: "Gestión de conflictos",
  resultados: "Orientación a resultados",
  aprendizaje: "Aprendizaje y autocrítica",
  organizacion: "Planificación",
  cliente: "Orientación al cliente",
  motivacion: "Motivación",
  integridad: "Integridad",
};

// [categoría, competencia, pregunta, qué busca quien entrevista, cómo enfocarla]
const BANCO = [
  // ---- Clásicas
  ["clasicas", "comunicacion", "Háblame de ti.", "Que sepas resumir tu trayectoria con criterio y conectarla con el puesto.", "Presente, pasado y futuro en 60–90 segundos: qué haces hoy, qué te trajo hasta aquí y por qué este puesto es el paso lógico."],
  ["clasicas", "motivacion", "¿Por qué quieres trabajar con nosotros?", "Que hayas investigado la empresa y tengas un motivo propio, no genérico.", "Cita algo concreto de la empresa (producto, cultura, momento) y únelo a algo que tú aportas o buscas."],
  ["clasicas", "resultados", "¿Por qué deberíamos contratarte?", "Tu propuesta de valor en pocas frases, apoyada en hechos.", "Tres argumentos: lo que necesita el puesto, la prueba de que ya lo has hecho y lo que te diferencia."],
  ["clasicas", "aprendizaje", "¿Cuál es tu mayor fortaleza?", "Autoconocimiento y que la fortaleza sea relevante para el puesto.", "Elige una sola, demuéstrala con un ejemplo breve y con su efecto medible."],
  ["clasicas", "aprendizaje", "¿Cuál es tu mayor debilidad?", "Honestidad, autocrítica y capacidad de mejora. No un falso defecto.", "Una debilidad real que no sea crítica para el puesto, qué haces para corregirla y qué has mejorado ya."],
  ["clasicas", "motivacion", "¿Dónde te ves dentro de cinco años?", "Ambición realista y que tu plan sea compatible con el puesto.", "Habla de las capacidades y la responsabilidad que quieres alcanzar, no de un cargo exacto."],
  ["clasicas", "motivacion", "¿Por qué quieres dejar tu trabajo actual?", "Que te mueva algo hacia delante y no hables mal de nadie.", "Di lo que buscas (reto, alcance, aprendizaje) en lugar de lo que huyes. Breve y sin reproches."],
  ["clasicas", "resultados", "¿De qué logro profesional estás más orgulloso?", "Qué consideras un éxito y cuál fue tu papel real.", "Una historia STAR con cifras: punto de partida, lo que hiciste tú y el resultado."],
  ["clasicas", "comunicacion", "¿Cómo te describirían tus compañeros?", "Coherencia entre tu imagen y lo que dirían tus referencias.", "Dos o tres rasgos, cada uno con un hecho que lo respalde, mejor si citas un comentario real."],
  ["clasicas", "motivacion", "¿Qué sabes de nuestra empresa?", "Interés real y preparación.", "Negocio, clientes, competencia y una noticia reciente. Termina con una pregunta o una opinión propia."],

  // ---- Competencias (conductuales)
  ["competencias", "conflicto", "Cuéntame una ocasión en la que tuviste un conflicto con un compañero.", "Madurez: cómo escuchas, negocias y preservas la relación.", "Describe el desacuerdo sin culpar, céntrate en la conversación que tuviste tú y en cómo quedó la relación después."],
  ["competencias", "aprendizaje", "Háblame de un error importante que hayas cometido.", "Responsabilidad y aprendizaje, sin excusas.", "Reconoce el error con claridad, explica cómo lo corregiste y qué cambiaste para que no se repita."],
  ["competencias", "organizacion", "Cuéntame una vez que tuviste que cumplir un plazo muy ajustado.", "Priorización y manejo de la presión.", "Explica cómo decidiste qué hacer primero, qué recortaste o delegaste y si llegaste a tiempo."],
  ["competencias", "iniciativa", "Dame un ejemplo de una mejora que propusiste por iniciativa propia.", "Proactividad y capacidad de llevar una idea hasta el final.", "El problema que viste, cómo convenciste a otros y el efecto medible de la mejora."],
  ["competencias", "equipo", "Háblame de un proyecto en equipo del que estés satisfecho.", "Cómo colaboras y cuál es tu aportación individual.", "Distingue lo que hizo el equipo de lo que hiciste tú. Usa «yo» para tus acciones."],
  ["competencias", "adaptabilidad", "Cuéntame una ocasión en la que cambiaron las prioridades de golpe.", "Flexibilidad y actitud ante el cambio.", "Qué cambió, cómo reorganizaste el trabajo y qué resultado salvaste."],
  ["competencias", "resolucion", "Describe el problema más difícil que has resuelto.", "Método de análisis y perseverancia.", "Cómo diagnosticaste la causa, qué opciones valoraste, por qué elegiste una y qué pasó."],
  ["competencias", "comunicacion", "Cuéntame una vez que tuviste que convencer a alguien que no estaba de acuerdo.", "Influencia sin autoridad y capacidad de argumentar.", "Qué le importaba a la otra persona, qué datos o argumentos usaste y cuál fue la decisión final."],
  ["competencias", "resultados", "Háblame de un objetivo que no conseguiste.", "Cómo gestionas el fracaso y qué aprendes.", "El objetivo, por qué no se alcanzó, tu parte de responsabilidad y qué haces distinto desde entonces."],
  ["competencias", "aprendizaje", "Cuéntame una ocasión en la que recibiste una crítica dura.", "Si aceptas feedback y lo conviertes en cambio.", "La crítica concreta, tu reacción y la prueba de que cambiaste algo."],
  ["competencias", "aprendizaje", "Dame un ejemplo de algo que aprendiste rápido porque el trabajo lo exigía.", "Velocidad de aprendizaje y autonomía.", "Qué no sabías, cómo te organizaste para aprenderlo y en cuánto tiempo eras productivo."],
  ["competencias", "integridad", "¿Has tenido que decir que no a un jefe o a un cliente? Cuéntamelo.", "Criterio propio y forma de plantear un desacuerdo.", "El motivo del no, cómo lo planteaste con alternativas y cómo terminó."],
  ["competencias", "organizacion", "Cuéntame cómo gestionaste varias tareas importantes a la vez.", "Sistema de trabajo y priorización.", "El criterio para ordenar (impacto, urgencia), las herramientas que usas y un resultado."],
  ["competencias", "cliente", "Háblame de una ocasión en la que fuiste más allá de lo esperado por un cliente o usuario.", "Vocación de servicio con sentido de negocio.", "La necesidad real del cliente, lo que hiciste de más y el efecto (renovación, valoración, venta)."],
  ["competencias", "iniciativa", "Cuéntame una decisión que tomaste sin tener toda la información.", "Juicio bajo incertidumbre y gestión del riesgo.", "Qué sabías, qué asumiste, cómo limitaste el riesgo y qué habrías hecho distinto."],
  ["competencias", "equipo", "Describe una vez que ayudaste a un compañero que lo estaba pasando mal con su trabajo.", "Empatía y generosidad sin descuidar lo tuyo.", "Cómo detectaste el problema, qué hiciste y qué cambió para esa persona y para el equipo."],

  // ---- Situacionales
  ["situacionales", "organizacion", "Tienes tres entregas urgentes para el mismo día y no llegas a todas. ¿Qué haces?", "Priorización y comunicación temprana.", "Ordena por impacto, avisa pronto a los afectados, propone alternativas y no prometas lo imposible."],
  ["situacionales", "conflicto", "Un compañero no está haciendo su parte y eso retrasa tu trabajo. ¿Cómo actúas?", "Que abordes el problema de frente y con respeto antes de escalar.", "Primero una conversación directa con hechos, después acuerdos concretos y solo al final escalar."],
  ["situacionales", "integridad", "Descubres que un compañero ha cometido un error grave y nadie más lo sabe. ¿Qué haces?", "Ética y sentido de la responsabilidad.", "Hablar primero con la persona, dar margen para corregir y asegurar que el problema se resuelve."],
  ["situacionales", "comunicacion", "Tu responsable te pide algo con lo que no estás de acuerdo. ¿Cómo reaccionas?", "Desacuerdo constructivo y compromiso.", "Expones tus motivos con datos, escuchas los suyos y, si la decisión se mantiene, la ejecutas bien."],
  ["situacionales", "adaptabilidad", "Empiezas en un equipo que ya funciona y eres la persona nueva. ¿Cómo te integras los primeros 90 días?", "Humildad, escucha y un plan.", "Primer mes escuchar y aprender, segundo aportar en algo pequeño, tercero asumir una responsabilidad propia."],
  ["situacionales", "cliente", "Un cliente importante está muy enfadado por un fallo que no es tuyo. ¿Qué haces?", "Calma, empatía y foco en la solución.", "Escuchar sin justificarte, asumir el problema como tuyo ante el cliente, dar un plazo y cumplirlo."],
  ["situacionales", "resolucion", "Te encargan un proyecto sobre algo que no dominas. ¿Por dónde empiezas?", "Cómo estructuras lo desconocido.", "Aclarar el objetivo, buscar a quien sabe, dividir en pasos y validar pronto con un primer resultado."],
  ["situacionales", "resultados", "A mitad de proyecto ves que no vais a llegar al objetivo. ¿Qué haces?", "Transparencia y reacción.", "Avisar pronto con datos, proponer escenarios (alcance, plazo, recursos) y recomendar uno."],

  // ---- Motivación y encaje
  ["motivacion", "motivacion", "¿Qué te motiva en el trabajo?", "Que lo que te mueve exista en este puesto.", "Dos motivadores reales con un ejemplo de cuándo los viviste, conectados con el puesto."],
  ["motivacion", "motivacion", "¿Qué buscas en tu próximo trabajo?", "Encaje entre tus expectativas y lo que pueden ofrecer.", "Tres criterios concretos y por qué este puesto los cumple."],
  ["motivacion", "equipo", "¿En qué tipo de ambiente trabajas mejor?", "Encaje cultural.", "Describe las condiciones en las que has rendido más, con un ejemplo, sin exigir un entorno perfecto."],
  ["motivacion", "equipo", "¿Cómo es tu jefe ideal?", "Cómo te gusta que te dirijan y si eres fácil de gestionar.", "Habla de comportamientos (claridad, confianza, feedback) y de lo que tú aportas a esa relación."],
  ["motivacion", "adaptabilidad", "¿Qué harías en tus primeros tres meses aquí?", "Que te imagines ya en el puesto y tengas método.", "Plan 30-60-90: aprender, aportar una primera mejora y asumir un objetivo."],
  ["motivacion", "aprendizaje", "¿Qué has aprendido en el último año?", "Curiosidad y crecimiento continuo.", "Una habilidad concreta, cómo la adquiriste y dónde la has aplicado."],
  ["motivacion", "motivacion", "¿Qué es lo que menos te gustaba de tu último puesto?", "Honestidad sin negatividad.", "Un aspecto estructural (no personas), cómo lo gestionabas y por qué aquí sería distinto."],

  // ---- Difíciles y trampa
  ["presion", "comunicacion", "Veo un hueco de varios meses en tu currículum. ¿Qué pasó?", "Transparencia y seguridad al explicarlo.", "Explícalo en una frase, di qué hiciste en ese tiempo y vuelve al presente."],
  ["presion", "motivacion", "Has cambiado mucho de empresa. ¿Por qué deberíamos pensar que aquí te quedarás?", "Estabilidad y coherencia de tu trayectoria.", "Da el hilo conductor de los cambios y qué tiene este puesto para ser de largo recorrido."],
  ["presion", "resultados", "Me parece que estás sobrecualificado para este puesto.", "Si te aburrirás o te irás pronto.", "Explica por qué lo quieres de verdad y qué ganan ellos con tu experiencia desde el primer día."],
  ["presion", "aprendizaje", "No tienes experiencia en nuestro sector. ¿Por qué deberíamos arriesgarnos?", "Capacidad de transferir lo que sabes.", "Reconoce la carencia, cita un caso en el que aprendiste un ámbito nuevo y qué traes de fuera que les sirve."],
  ["presion", "integridad", "¿Qué opinas de tu anterior jefe?", "Discreción y lealtad.", "Algo que aprendiste de esa persona y, como mucho, una diferencia de estilo contada con respeto."],
  ["presion", "comunicacion", "Si te preguntara por qué no contratarte, ¿qué me dirías?", "Autocrítica real y temple.", "Una limitación concreta para este puesto y tu plan para cubrirla en los primeros meses."],
  ["presion", "resultados", "¿Estás en otros procesos de selección?", "Tu interés y tu valor en el mercado.", "Sé sincero sin dar nombres y deja claro por qué este proceso es tu preferido."],
  ["presion", "adaptabilidad", "¿Cómo reaccionas cuando trabajas bajo mucha presión?", "Autocontrol y recursos propios.", "Un ejemplo real: qué sentiste, qué hiciste para mantener la calidad y cómo terminó."],
  ["presion", "comunicacion", "Convénceme de algo en un minuto.", "Agilidad mental y estructura improvisando.", "Una idea, tres razones y un cierre. Mejor claro que brillante."],

  // ---- Liderazgo y gestión
  ["liderazgo", "liderazgo", "¿Cómo describirías tu estilo de liderazgo?", "Que tengas un estilo consciente y lo adaptes a cada persona.", "Tus principios, cómo los adaptas según la persona y un ejemplo en el que funcionó."],
  ["liderazgo", "liderazgo", "Cuéntame una ocasión en la que tuviste que dar un feedback difícil.", "Valentía y cuidado al decir lo incómodo.", "Los hechos que observaste, cómo lo planteaste, la reacción y el cambio que hubo después."],
  ["liderazgo", "liderazgo", "Háblame de una persona de tu equipo a la que ayudaste a crecer.", "Si desarrollas a la gente o solo repartes tareas.", "Punto de partida de esa persona, qué hiciste tú (retos, apoyo, feedback) y dónde está ahora."],
  ["liderazgo", "conflicto", "¿Cómo gestionaste a alguien con bajo rendimiento?", "Exigencia con justicia y método.", "Diagnóstico de la causa, expectativas claras, seguimiento y desenlace, fuera el que fuera."],
  ["liderazgo", "organizacion", "¿Cómo decides qué delegar y a quién?", "Confianza en el equipo y control del riesgo.", "Tu criterio (riesgo, desarrollo, carga), cómo das contexto y cómo haces seguimiento sin microgestionar."],
  ["liderazgo", "resultados", "Cuéntame una decisión impopular que tuviste que tomar.", "Firmeza y capacidad de explicar el porqué.", "El contexto, cómo comunicaste la decisión y cómo mantuviste al equipo contigo."],
  ["liderazgo", "liderazgo", "¿Cómo motivas a un equipo que pasa por un mal momento?", "Lectura del equipo y liderazgo cercano.", "Qué viste, qué conversaciones tuviste, qué cambiaste y cómo mediste que mejoró."],
  ["liderazgo", "organizacion", "¿Cómo fijas objetivos y cómo los sigues?", "Método de gestión.", "De dónde salen los objetivos, cómo los haces medibles y con qué ritmo los revisas."],

  // ---- Tecnología
  ["tecnologia", "resolucion", "Cuéntame el proyecto técnico del que estás más orgulloso.", "Profundidad técnica y tu papel real.", "Problema, arquitectura o decisión clave, lo que construiste tú y el resultado en producción."],
  ["tecnologia", "resolucion", "Describe el fallo en producción más grave que has vivido.", "Cómo diagnosticas bajo presión y qué aprendes.", "Síntoma, cómo aislaste la causa, cómo lo arreglaste y qué cambiasteis para que no vuelva a pasar."],
  ["tecnologia", "comunicacion", "Explícame un concepto técnico complejo como si yo no fuera técnico.", "Claridad y empatía con quien escucha.", "Una analogía cotidiana, sin jerga, y comprueba al final que se ha entendido."],
  ["tecnologia", "resultados", "¿Cómo decides entre entregar rápido y hacerlo bien?", "Criterio sobre deuda técnica y negocio.", "El coste de cada opción en un caso real, qué elegiste y cómo pagaste la deuda después."],
  ["tecnologia", "conflicto", "Cuéntame un desacuerdo técnico con un compañero y cómo se resolvió.", "Que defiendas ideas sin ego.", "Las dos posturas con sus razones, cómo lo decidisteis (datos, prueba) y qué aprendiste."],
  ["tecnologia", "organizacion", "¿Cómo abordas una tarea grande y mal definida?", "Capacidad de dar estructura a la ambigüedad.", "Aclarar el objetivo, dividir en entregas pequeñas, validar pronto y comunicar el avance."],
  ["tecnologia", "aprendizaje", "¿Cómo te mantienes al día en tu área?", "Curiosidad y criterio para filtrar.", "Tus fuentes, una cosa reciente que aprendiste y dónde la aplicaste."],
  ["tecnologia", "equipo", "¿Cómo haces una buena revisión de código?", "Calidad y forma de dar feedback a iguales.", "Qué miras primero, cómo redactas los comentarios y un ejemplo de una revisión que evitó un problema."],

  // ---- Ventas y cliente
  ["ventas", "resultados", "Cuéntame la venta más difícil que has cerrado.", "Método comercial y perseverancia.", "El obstáculo principal, qué hiciste para superarlo y el importe o el efecto."],
  ["ventas", "cliente", "¿Cómo manejas la objeción «es demasiado caro»?", "Que vendas valor y no precio.", "Averiguar con qué compara, cuantificar el valor y solo después hablar de condiciones."],
  ["ventas", "resultados", "¿Qué haces cuando ves que no vas a llegar a tu objetivo del trimestre?", "Reacción, análisis y honestidad.", "Analizar el embudo, concentrarte en lo que puede cerrarse y avisar pronto con un plan."],
  ["ventas", "cliente", "Háblame de un cliente que perdiste y qué aprendiste.", "Autocrítica comercial.", "La causa real de la pérdida, tu parte y el cambio concreto en tu forma de trabajar."],
  ["ventas", "comunicacion", "Véndeme este bolígrafo.", "Si preguntas antes de vender.", "Empieza preguntando para qué lo usaría, adapta el argumento a su respuesta y pide el cierre."],
  ["ventas", "organizacion", "¿Cómo organizas tu cartera y tu semana?", "Disciplina y priorización comercial.", "Cómo segmentas las cuentas, cuánto tiempo dedicas a captar y qué indicadores sigues."],

  // ---- In English
  ["ingles", "comunicacion", "Tell me about yourself.", "Fluidez y estructura en inglés.", "Present, past, future in about a minute. Frases cortas y vocabulario que domines."],
  ["ingles", "resultados", "What is your greatest professional achievement?", "Que cuentes un logro con cifras en inglés.", "Situation, task, action, result. Prepara de antemano los verbos de acción en pasado."],
  ["ingles", "motivacion", "Why do you want this job?", "Motivación explicada con naturalidad.", "One thing about the company, one thing about the role, one thing you bring."],
  ["ingles", "conflicto", "Tell me about a time you disagreed with your manager.", "Matices y diplomacia en inglés.", "Usa fórmulas suaves: «I suggested», «we agreed to», «in the end»."],
  ["ingles", "aprendizaje", "What are your strengths and weaknesses?", "Autoconocimiento, con vocabulario preciso.", "One strength with proof, one real weakness and what you are doing about it."],
  ["ingles", "motivacion", "Where do you see yourself in five years?", "Uso natural de futuro y condicionales.", "Habla de skills y responsabilidad: «I'd like to be leading…», «I hope to have…»."],

  // ---- Salario y cierre
  ["cierre", "resultados", "¿Cuáles son tus expectativas salariales?", "Si conoces tu valor de mercado y eres razonable.", "Da un rango investigado cuyo mínimo ya te valga y muestra apertura a hablar del paquete completo."],
  ["cierre", "integridad", "¿Cuánto cobras actualmente?", "Un punto de referencia para la oferta.", "No estás obligado a decirlo: reconduce a lo que esperas para este puesto según mercado y responsabilidad."],
  ["cierre", "organizacion", "¿Cuándo podrías incorporarte?", "Disponibilidad y seriedad con tu empresa actual.", "Da un plazo realista que respete tu preaviso."],
  ["cierre", "motivacion", "¿Tienes alguna pregunta para nosotros?", "Interés, criterio y preparación. Decir «no» resta.", "Lleva tres preguntas sobre el puesto, el equipo y el éxito esperado. Evita lo que está en la web."],
  ["cierre", "comunicacion", "¿Hay algo más que quieras añadir?", "Tu capacidad de cerrar con fuerza.", "Resume en dos frases por qué encajas y reitera tu interés."],
];

const PREGUNTAS_PARA_ELLOS = {
  "El puesto": [
    "¿Cómo sería un primer año excelente en este puesto?",
    "¿Cuál es el reto más urgente que tendría que resolver quien entre?",
    "¿Cómo es una semana normal en este puesto?",
    "¿Por qué está abierta la vacante?",
  ],
  "El equipo": [
    "¿Cómo está formado el equipo y con quién trabajaría más?",
    "¿Cómo tomáis las decisiones cuando hay desacuerdo?",
    "¿Qué es lo que más valoras de la gente de tu equipo?",
  ],
  "Crecimiento": [
    "¿Cómo se da el feedback y cada cuánto?",
    "¿Qué recorrido han tenido las personas que ocuparon antes este puesto?",
    "¿Qué formación o apoyo hay para seguir creciendo?",
  ],
  "La empresa": [
    "¿Cuáles son las prioridades de la empresa para este año?",
    "¿Qué os diferencia de vuestros competidores según vuestros clientes?",
    "¿Qué es lo que más te gusta de trabajar aquí, y lo que menos?",
  ],
  "El proceso": [
    "¿Cuáles son los siguientes pasos y los plazos?",
    "¿Hay algo de mi perfil que te genere dudas y que pueda aclarar ahora?",
  ],
};

const CHECKLIST = {
  "Días antes": [
    ["inv", "Investigar la empresa: negocio, clientes, competencia y noticias recientes"],
    ["oferta", "Releer la oferta y subrayar los tres requisitos clave"],
    ["quien", "Buscar a las personas que me entrevistan"],
    ["historias", "Tener seis historias STAR listas y ensayadas en voz alta"],
    ["pitch", "Ensayar «Háblame de ti» hasta que dure 60–90 segundos"],
    ["salario", "Fijar mi rango salarial con datos de mercado"],
    ["preguntas", "Elegir tres preguntas para hacer al final"],
  ],
  "El mismo día": [
    ["tec", "Probar cámara, micrófono y conexión, o calcular el trayecto con margen"],
    ["cv", "Tener a mano el currículum, la oferta y mis notas"],
    ["ropa", "Ropa un punto por encima de lo habitual en la empresa"],
    ["llegar", "Llegar o conectarme diez minutos antes"],
    ["agua", "Agua cerca y el móvil en silencio"],
  ],
  "Después": [
    ["notas", "Apuntar las preguntas que me hicieron y cómo respondí"],
    ["gracias", "Enviar un mensaje de agradecimiento en menos de 24 horas"],
    ["seguimiento", "Anotar la fecha para hacer seguimiento si no hay respuesta"],
  ],
};

const MULETILLAS = ["eh", "em", "ehm", "mmm", "o sea", "en plan", "bueno", "pues", "vale", "sabes", "digamos", "básicamente", "la verdad", "como que", "tipo", "es decir", "un poco", "literalmente", "en realidad", "a ver", "you know", "like", "basically", "actually", "um", "uh"];

const DUBITATIVAS = ["creo que", "supongo", "quizá", "quizás", "a lo mejor", "intento", "intentaría", "más o menos", "no sé", "igual", "tal vez", "i guess", "maybe", "i think"];

const HISTORIA_EJEMPLO = {
  titulo: "Reducir los plazos de entrega de informes",
  s: "En mi anterior empresa los informes mensuales para clientes salían con una semana de retraso y habíamos recibido tres quejas formales en un trimestre.",
  t: "Como responsable del área, mi objetivo era entregar a tiempo sin ampliar el equipo.",
  a: "Analicé el proceso paso a paso y vi que el 60 % del tiempo se iba en recopilar datos a mano. Propuse automatizar la extracción, formé a dos compañeros y fijé una revisión semanal de avance.",
  r: "En dos meses pasamos de 7 días de retraso a entregar el día 2 de cada mes, y las quejas bajaron a cero. Aprendí a medir antes de proponer.",
  comps: ["iniciativa", "resultados", "organizacion"],
};
