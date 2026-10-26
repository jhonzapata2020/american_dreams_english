/**
 * Enrutador de audios locales a costo cero para ADE (American Dream English)
 * Sincronizado exactamente con los 28 archivos MP3 de alta fidelidad presentes en public/audio/ade/
 */

export interface StaticAudioRoute {
  id: string;
  lang: 'es' | 'en';
  audioUrl: string;
  text: string;
  triggers: (RegExp | string)[];
}

export interface StaticAudioMatch {
  id: string;
  lang: 'es' | 'en';
  audioUrl: string;
  text: string;
  matchedTrigger: string;
  cached: boolean;
}

/**
 * Normaliza texto eliminando acentos, diacríticos, signos y espacios redundantes
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina tildes (á->a, é->e, etc.)
    .replace(/[¿?¡!.,;:_()\-+"'\/\\#$%=*]/g, ' ') // Remueve signos de puntuación
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normaliza texto básico en minúsculas sin signos pero preservando ñ y acentos comunes
 */
export function normalizeLight(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[¿?¡!.,;:_()\-+"'\/\\#$%=*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Filtro de idioma estricto (Language Guard).
 * Si el input contiene palabras inequívocamente en inglés ('english', 'talk', 'practice', 'speak', 'where', 'how', 'want', 'thank')
 * o patrones conversacionales en inglés, BLOQUEA automáticamente cualquier disparo de archivos en español ('es-*.mp3')
 * para evitar que respuestas de tienda o precios en español interrumpan una conversación en inglés.
 */
export function isLikelyEnglish(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const rawLower = input.toLowerCase();
  const normalized = normalizeText(input);
  if (!normalized) return false;

  // 0. Si el usuario pide explícitamente español o habla en español, no clasificar como inglés
  const explicitSpanish = /\b(hablemos en espanol|hablemos en español|en espanol por favor|en español por favor|cambia a espanol|cambia a español|ya no quiero practicar|no mas ingles|no se ingles|no sé ingles|no hablo ingles|en espanol|en español|cursos de|clases de|hola|buenas|cuanto|precios?|costo|matricul|horario|por favor)\b/i;
  if (explicitSpanish.test(normalized) || explicitSpanish.test(rawLower) || Boolean(input.match(/[¿¡áéíóúñ]/i))) {
    return false;
  }

  // 1. Palabras clave inequívocas en inglés requeridas estrictamente
  const strictEnglishKeywords = /\b(english|talk|practice|speak|where|how|want|thank)\b/i;
  if (strictEnglishKeywords.test(normalized) || strictEnglishKeywords.test(rawLower)) {
    return true;
  }

  // 2. Patrones conversacionales claros en inglés
  const englishPatterns = [
    /\btell\s+me\s+about\s+(the\s+)?courses?\b/i,
    /\bwhat\s+courses\b/i,
    /\bwhich\s+courses\b/i,
    /\babout\s+(the\s+)?courses?\b/i,
    /\bi\s+want\b/i,
    /\bi\s+would\s+like\b/i,
    /\btalk\s+in\s+english\b/i,
    /\bspeak\s+english\b/i,
    /\bpractice\s+english\b/i,
    /\bcan\s+we\s+practice\b/i,
    /\blet'?s\s+practice\b/i,
    /\benglish\s+practice\b/i,
    /\bhow\s+are\s+you\b/i,
    /\bhow\s+is\s+it\s+going\b/i,
    /\bwhat'?s\s+up\b/i,
    /\bhow\s+do\s+you\s+do\b/i,
    /\bgood\s+morning\b/i,
    /\bgood\s+afternoon\b/i,
    /\bgood\s+evening\b/i,
    /\bgood\s+night\b/i,
    /\bsee\s+you\b/i,
    /\bsee\s+you\s+later\b/i,
    /\bbye\s+bye\b/i,
    /\bhello\b/i,
    /\bhi\s+there\b/i,
    /\bwith\s+you\b/i,
    /\bwhat\s+is\b/i,
    /\bwhere\s+are\b/i,
    /\bwhere\s+is\b/i,
    /\bwhere\s+do\s+you\b/i,
    /\bhow\s+much\b/i,
    /\bcan\s+you\b/i,
    /\btell\s+me\b/i,
    /\bwho\s+are\s+you\b/i,
    /\bwhat\s+is\s+your\s+name\b/i,
    /\bthank\s+you\b/i,
    /\bthanks\b/i,
    /\bnice\s+to\s+meet\b/i,
    /\bdoing\s+well\b/i,
    /\bi\s+am\s+fine\b/i,
    /\bi'?m\s+fine\b/i,
    /\bi\s+am\s+good\b/i,
    /\bi'?m\s+good\b/i,
    /\bhave\s+a\s+good\s+one\b/i,
    /\bhave\s+a\s+good\s+day\b/i,
    /\btake\s+care\b/i,
    /\bvirtual\s+campus\b/i,
    /\bstudent\s+portal\b/i
  ];

  for (const pattern of englishPatterns) {
    if (pattern.test(normalized) || pattern.test(rawLower)) {
      return true;
    }
  }

  // 3. Conteo de stopwords y palabras estructurales del inglés
  const englishStopwords = new Set([
    'the', 'is', 'are', 'was', 'were', 'am', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'my', 'your', 'his', 'her', 'our', 'their', 'this', 'that', 'these', 'those',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might', 'must', 'want', 'need', 'like', 'talk', 'speak',
    'practice', 'english', 'with', 'about', 'from', 'for', 'in', 'on', 'at', 'to',
    'and', 'or', 'but', 'because', 'what', 'when', 'where', 'which', 'who', 'whom',
    'whose', 'why', 'how', 'hello', 'bye', 'good', 'day', 'today', 'classes', 'course'
  ]);

  const words = normalized.split(/\s+/).filter(Boolean);
  let englishMatches = 0;
  for (const w of words) {
    if (englishStopwords.has(w)) {
      englishMatches++;
    }
  }

  if (words.length > 0 && (englishMatches >= 2 || englishMatches / words.length >= 0.35)) {
    return true;
  }

  return false;
}

/**
 * Catálogo completo de las 28 respuestas locales estáticas a costo cero ($0 ElevenLabs / $0 OpenAI)
 * 15 audios en español + 13 audios en inglés sincronizados exactamente con public/audio/ade/
 */
export const LOCAL_ADE_ROUTES: StaticAudioRoute[] = [
  // ==========================================
  // BLOQUE EN ESPAÑOL (15 Audios Locales)
  // ==========================================
  {
    id: 'es-bienvenida',
    lang: 'es',
    audioUrl: '/audio/ade/es-bienvenida.mp3',
    text: '¡Hola! Te doy una cálida bienvenida a American Dream English. Soy ADE, tu tutora virtual, y estoy aquí para ayudarte a alcanzar la fluidez en inglés. ¿En qué te puedo asesorar hoy?',
    triggers: [/\bhola\b/i, /\bbuenos dias\b/i, /\btardes\b/i, /\bnoches\b/i, /\bque tal\b/i]
  },
  {
    id: 'es-matricula',
    lang: 'es',
    audioUrl: '/audio/ade/es-matricula.mp3',
    text: '¡Es muy sencillo! Para matricularte hoy y asegurar tu cupo con tarifa preferencial, haz clic en el botón "Matricúlate". Puedes completar tu pago de forma 100% segura mediante Wompi.',
    triggers: [/\bmatricul/i, /\binscri/i, /\bseparar cupo\b/i, /\breservar cupo\b/i, /\bwompi\b/i, /\bcomo me matriculo\b/i]
  },
  {
    id: 'es-precios',
    lang: 'es',
    audioUrl: '/audio/ade/es-precios.mp3',
    text: 'Nuestros programas cuentan con facilidades de pago mensual y subsidios a través del Fondo Social. Puedes consultar todos los planes y valores actualizados en nuestra sección de Matrícula.',
    triggers: [/\bprecio/i, /\bcuanto cuestan\b/i, /\bcuanto cuesta\b/i, /\bcuanto valen\b/i, /\bcuanto vale\b/i, /\bcosto/i, /\bcostos\b/i, /\bmensualidad\b/i, /\bvalor\b/i, /\btarifa/i, /\bcuanto cobran\b/i]
  },
  {
    id: 'es-cuotas',
    lang: 'es',
    audioUrl: '/audio/ade/es-cuotas.mp3',
    text: 'Contamos con opciones de financiación flexibles y pago en cuotas mensuales para que puedas estudiar sin preocuparte. ¡Pregúntanos por nuestros planes diferidos!',
    triggers: [/\bcuota/i, /\bfinanciar\b/i, /\ba plazos\b/i, /\bfacilidad/i, /\babono/i]
  },
  {
    id: 'es-horarios',
    lang: 'es',
    audioUrl: '/audio/ade/es-horarios.mp3',
    text: 'Ofrecemos horarios con máxima flexibilidad en jornadas de mañana, tarde, noche y fines de semana, adaptándonos completamente a tu trabajo o estudio.',
    triggers: [/\bhorario/i, /\bque dias\b/i, /\ba que hora\b/i, /\bjornada/i, /\btarde/i]
  },
  {
    id: 'es-ubicacion',
    lang: 'es',
    audioUrl: '/audio/ade/es-ubicacion.mp3',
    text: 'Nuestra sede presencial principal está ubicada estratégicamente en Turbo, Urabá, sobre la Troncal, con aulas dinámicas y laboratorio de inmersión en inglés. ¡Ven a visitarnos!',
    triggers: [/\bcomo llegar\b/i, /\bdonde estan\b/i, /\bubicacion\b/i, /\bdireccion\b/i, /\bsede\b/i, /\btroncal\b/i]
  },
  {
    id: 'es-campus-virtual',
    lang: 'es',
    audioUrl: '/audio/ade/es-campus-virtual.mp3',
    text: 'En nuestro Campus Virtual ingresas a clases en directo las 24 horas por Microsoft Teams, interactuando cara a cara con docentes certificados C1 y C2 con retroalimentación inmediata.',
    triggers: [/\bcampus virtual\b/i, /\bclases virtuales\b/i, /\bteams\b/i, /\bmicrosoft teams\b/i, /\bzoom\b/i]
  },
  {
    id: 'es-portal-estudiante',
    lang: 'es',
    audioUrl: '/audio/ade/es-portal-estudiante.mp3',
    text: 'Si ya eres estudiante de American Dream English, puedes ingresar a tus aulas activas, lecciones y materiales desde el Portal del Estudiante en campus.americandreamenglish.com.',
    triggers: [/\bportal del estudiante\b/i, /\bentrar al campus\b/i, /\bingresar al campus\b/i, /\bmis cursos\b/i, /\biniciar sesion\b/i]
  },
  {
    id: 'es-campus-estudiante',
    lang: 'es',
    audioUrl: '/audio/ade/es-campus-estudiante.mp3',
    text: 'En el campus de estudiantes encuentras todas las guías descargables, talleres prácticos, foros de conversación y las grabaciones de tus clases para repasar cuando quieras.',
    triggers: [/\bguia/i, /\btaller/i, /\bgrabacion/i, /\bclases grabadas\b/i, /\btarea/i, /\bforo\b/i, /\bmaterial de estudio\b/i]
  },
  {
    id: 'es-metodologia',
    lang: 'es',
    audioUrl: '/audio/ade/es-metodologia.mp3',
    text: 'A diferencia de plataformas convencionales de videos pregrabados en soledad, en American Dream English practicas conversación en tiempo real con docentes certificados y grupos interactivos guiados.',
    triggers: [/\bmetodologia\b/i, /\bcomo enseñan\b/i, /\bcomo ensenan\b/i, /\bprofesores\b/i, /\bdocentes\b/i, /\ben vivo\b/i]
  },
  {
    id: 'es-certificacion',
    lang: 'es',
    audioUrl: '/audio/ade/es-certificacion.mp3',
    text: 'Nuestra institución opera con personería jurídica y Resolución oficial SED 2471 de la Secretaría de Educación, otorgando certificaciones bilingües B2 y C1 avaladas bajo el marco internacional MCER.',
    triggers: [/\bcertificacion\b/i, /\bes legal\b/i, /\bresolucion\b/i, /\bsecretaria de educacion\b/i, /\bmcer\b/i, /\bvalido\b/i]
  },
  {
    id: 'es-edades',
    lang: 'es',
    audioUrl: '/audio/ade/es-edades.mp3',
    text: 'Tenemos programas diseñados para todas las edades: niños, jóvenes y adultos, con pedagogía interactiva adaptada al ritmo de aprendizaje de cada estudiante.',
    triggers: [/\bedad/i, /\bcuantos años\b/i, /\bcuantos anos\b/i, /\bniño/i, /\bnino/i, /\bhijo/i, /\bpara mi hijo\b/i]
  },
  {
    id: 'es-tiempo-aprendizaje',
    lang: 'es',
    audioUrl: '/audio/ade/es-tiempo-aprendizaje.mp3',
    text: 'Con nuestro método intensivo notarás resultados de fluidez desde los primeros meses, completando niveles bajo el estándar MCER con acompañamiento constante y garantía de aprendizaje.',
    triggers: [/\ben cuanto tiempo\b/i, /\bcuanto dura\b/i, /\bgarantia\b/i, /\bcuando aprendo\b/i, /\bduracion\b/i]
  },
  {
    id: 'es-tienda',
    lang: 'es',
    audioUrl: '/audio/ade/es-tienda.mp3',
    text: 'En nuestra Tienda Digital tienes acceso a e-books descargables, audiolibros y guías gramaticales aceleradas diseñadas por el Teacher Anthony para complementar tu aprendizaje.',
    triggers: [/\btienda\b/i, /\bebooks?\b/i, /\blibros?\b/i]
  },
  {
    id: 'es-gracias-despedida',
    lang: 'es',
    audioUrl: '/audio/ade/es-gracias-despedida.mp3',
    text: '¡Con muchísimo gusto! Gracias a ti por comunicarte con American Dream English. ¡Que estés muy bien y espero verte muy pronto en clases!',
    triggers: [/\bgracias\b/i, /\bmuchas gracias\b/i, /\bchao\b/i, /\bhasta luego\b/i, /\bnos vemos\b/i, /\bque este bien\b/i, /\bcuidate\b/i]
  },
  {
    id: 'es-fallback-natural',
    lang: 'es',
    audioUrl: '/audio/ade/es-fallback-natural.mp3',
    text: '¡Siempre a la orden! Recuerda que en American Dream English estamos listos para acompañarte hacia tu fluidez. ¡Que tengas un excelente día!',
    triggers: [/\b(siempre a la orden|a la orden|cuando quieras|que tengas un buen dia|un placer)\b/i]
  },
  {
    id: 'es-charla-informal',
    lang: 'es',
    audioUrl: '/audio/ade/es-charla-informal.mp3',
    text: '¡Me alegra muchísimo conversar contigo! Si deseas practicar o conocer nuestras clases en vivo con profesores C1, aquí estaré siempre disponible.',
    triggers: [/\b(conversar|hablar un rato|como vas|todo bien)\b/i]
  },
  {
    id: 'es-cambio-idioma',
    lang: 'es',
    audioUrl: '/audio/ade/es-bienvenida.mp3',
    text: '¡Por supuesto! Hablemos en español. Con gusto te asesoro sobre nuestros cursos, horarios, facilidades de pago y matrícula. ¿Qué te gustaría consultar?',
    triggers: [
      /\b(hablemos en espanol|hablemos en español|en espanol por favor|en español por favor|cambia a espanol|cambia a español|ya no quiero practicar|no mas ingles|no se ingles|no sé ingles|no hablo ingles|en espanol|en español|hablemos espanol|hablemos español)\b/i
    ]
  },

  // ==========================================
  // BLOQUE EN INGLÉS (13 Audios Locales)
  // ==========================================
  {
    id: 'en-hello',
    lang: 'en',
    audioUrl: '/audio/ade/en-hello.mp3',
    text: 'Hello and welcome to American Dream English! I am ADE, your virtual advisor and tutor. How can I help you achieve fluency today?',
    triggers: [/\bhello\b/i, /\bhi\b/i, /\bhey\b/i, /\bgood morning\b/i, /\bgood afternoon\b/i]
  },
  {
    id: 'en-how-are-you',
    lang: 'en',
    audioUrl: '/audio/ade/en-how-are-you.mp3',
    text: 'I am doing wonderful, thank you for asking! I am very excited to help you learn English with our live C1 and C2 certified teachers.',
    triggers: [/\bhow are you\b/i, /\bhow do you do\b/i, /\bhow is it going\b/i]
  },
  {
    id: 'en-practice',
    lang: 'en',
    audioUrl: '/audio/ade/en-practice.mp3',
    text: "Sure! Let's practice. What would you like to talk about today?",
    triggers: [/\btalk in english\b/i, /\bpractice english\b/i, /\bspeak english\b/i, /\bwith you\b/i, /\blet's practice\b/i, /\blets practice\b/i]
  },
  {
    id: 'en-origin',
    lang: 'en',
    audioUrl: '/audio/ade/en-origin.mp3',
    text: 'We are based in Turbo, Urabá, with our modern campus on the Troncal highway, and we offer virtual live classes to students all around the world!',
    triggers: [/\bwhere are you from\b/i, /\bwhere do you live\b/i, /\bwhere are you located\b/i]
  },
  {
    id: 'en-im-fine',
    lang: 'en',
    audioUrl: '/audio/ade/en-im-fine.mp3',
    text: "I'm glad to hear that! What would you like to practice or learn about American Dream English today?",
    triggers: [/\bi am fine\b/i, /\bi'm fine\b/i, /\bi am good\b/i, /\bi'm good\b/i, /\bdoing well\b/i, /\band you\b/i]
  },
  {
    id: 'en-my-name',
    lang: 'en',
    audioUrl: '/audio/ade/en-my-name.mp3',
    text: 'My name is ADE, which stands for American Dream English. I am your virtual tutor and admissions advisor!',
    triggers: [/\bwhat is your name\b/i, /\bwho are you\b/i]
  },
  {
    id: 'en-levels',
    lang: 'en',
    audioUrl: '/audio/ade/en-levels.mp3',
    text: 'We offer courses covering all CEFR proficiency levels, from beginner A1 all the way to advanced C1 and C2 fluency.',
    triggers: [
      /\b(tell me about the courses?|what courses do you have|what courses|which courses|courses?|levels?|what levels|beginner|advanced|programs?)\b/i,
      /\babout (the )?courses?\b/i
    ]
  },
  {
    id: 'en-methodology',
    lang: 'en',
    audioUrl: '/audio/ade/en-methodology.mp3',
    text: 'Unlike conventional platforms that only offer pre-recorded videos, at American Dream English you speak in real-time with certified teachers and guided groups for immediate feedback.',
    triggers: [/\bmethodology\b/i, /\bhow do you teach\b/i]
  },
  {
    id: 'en-pricing',
    lang: 'en',
    audioUrl: '/audio/ade/en-pricing.mp3',
    text: 'We provide highly competitive tuition rates with flexible monthly options and partial scholarships through our Social Fund. Check out the Tuition section to enroll!',
    triggers: [/\bpricing\b/i, /\bhow much\b/i, /\bcost\b/i]
  },
  {
    id: 'en-store',
    lang: 'en',
    audioUrl: '/audio/ade/en-store.mp3',
    text: 'In our Digital Store, you can find downloadable e-books, accelerated study guides, and audio materials to speed up your fluency journey right away.',
    triggers: [/\bstore\b/i, /\bbooks?\b/i]
  },
  {
    id: 'en-goodbye-nice',
    lang: 'en',
    audioUrl: '/audio/ade/en-goodbye-nice.mp3',
    text: 'Have a wonderful day! Keep practicing your English and I look forward to seeing you soon in our live campus classes!',
    triggers: [/\bsee you later\b/i, /\bhave a good day\b/i, /\bgood night\b/i]
  },
  {
    id: 'en-bye',
    lang: 'en',
    audioUrl: '/audio/ade/en-bye.mp3',
    text: 'Goodbye! Thank you for visiting American Dream English. Keep practicing, and I look forward to seeing you soon in our live campus classes!',
    triggers: [/\bbye\b/i, /\bgoodbye\b/i]
  },
  {
    id: 'en-thanks-farewell',
    lang: 'en',
    audioUrl: '/audio/ade/en-thanks-farewell.mp3',
    text: "You're very welcome! It's a pleasure to assist you. Take care and see you soon at American Dream English!",
    triggers: [/\bthank you\b/i, /\bthanks\b/i, /\btake care\b/i, /\bhave a good one\b/i]
  }
];

/**
 * Evalúa si la entrada del usuario coincide con alguna de las 28 respuestas locales estáticas.
 * 
 * 1. FILTRO DE IDIOMA ESTRICTO (Language Guard):
 *    - Si la entrada contiene palabras inequívocamente en inglés ('english', 'talk', 'practice', 'speak', 'where', 'how', 'want', 'thank'):
 *      BLOQUEA automáticamente cualquier disparo de archivos en español ('es-*.mp3')
 *      para evitar que respuestas de tienda o precios en español interrumpan una conversación en inglés.
 * 
 * 2. COINCIDENCIA POR LÍMITES DE PALABRA (\b):
 *    - Evalúa mediante expresiones regulares con límites de palabra para evitar falsos positivos.
 * 
 * 3. RETORNO ESTÁNDAR:
 *    - Si coincide con un trigger, retorna { audioUrl: '/audio/ade/[archivo].mp3', text: transcript, cached: true } ($0 costo).
 *    - Si no coincide con la caché local, retorna null para delegar a Dapta / Gemini Flash.
 */
export function matchStaticResponse(
  userInput: string,
  preferredLang?: 'es' | 'en' | string,
  lastIntentKey?: string | null,
  lastAudioPlayed?: string | null
): StaticAudioMatch | null {
  if (!userInput || typeof userInput !== 'string') return null;

  const rawInput = userInput.trim();
  const normalizedInput = normalizeText(userInput);
  const lightInput = normalizeLight(userInput);

  if (!normalizedInput && !rawInput) return null;

  // 1. FILTRO DE IDIOMA DINÁMICO (Language Guard con Conmutación Limpia)
  // Determinar idioma prioritario según el contenido real del mensaje actual
  const isEnglishDetected = isLikelyEnglish(userInput);
  const hasSpanishIndicators = Boolean(userInput.match(/[¿¡áéíóúñ]/i));

  let candidateRoutes: StaticAudioRoute[];
  if (isEnglishDetected && !hasSpanishIndicators) {
    candidateRoutes = LOCAL_ADE_ROUTES.filter((r) => r.lang === 'en');
  } else if (hasSpanishIndicators || preferredLang === 'es') {
    candidateRoutes = LOCAL_ADE_ROUTES.filter((r) => r.lang === 'es');
  } else if (preferredLang === 'en') {
    // Si venía en inglés pero la frase no tiene palabras inglesas, revisar si coincide con rutas en español
    const matchesSpanish = LOCAL_ADE_ROUTES.filter(r => r.lang === 'es').some(r =>
      r.triggers.some(t => t instanceof RegExp ? t.test(normalizedInput) : normalizedInput.includes(normalizeText(t)))
    );
    candidateRoutes = matchesSpanish 
      ? LOCAL_ADE_ROUTES.filter((r) => r.lang === 'es')
      : LOCAL_ADE_ROUTES.filter((r) => r.lang === 'en');
  } else {
    candidateRoutes = LOCAL_ADE_ROUTES;
  }

  let bestMatch: { route: StaticAudioRoute; triggerStr: string } | null = null;
  let highestScore = 0;

  for (const route of candidateRoutes) {
    for (const trigger of route.triggers) {
      let isMatch = false;
      let triggerSource = '';

      if (trigger instanceof RegExp) {
        triggerSource = trigger.source;
        // Evaluar en texto normalizado sin acentos, texto ligero con acentos y texto crudo
        isMatch = trigger.test(normalizedInput) || trigger.test(lightInput) || trigger.test(rawInput);
      } else if (typeof trigger === 'string') {
        triggerSource = trigger;
        const normTrig = normalizeText(trigger);
        if (normTrig) {
          const escaped = normTrig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const boundRegex = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, 'i');
          isMatch = normalizedInput === normTrig || boundRegex.test(normalizedInput);
        }
      }

      if (isMatch) {
        // Prioridad: expresiones regulares o triggers más largos y específicos ganan
        const baseScore = triggerSource.replace(/[\\^$bB]/g, '').length;
        const exactMatchBonus = (normalizedInput === triggerSource.toLowerCase()) ? 500 : 0;
        const langBonus = (isEnglishDetected && route.lang === 'en') || (!isEnglishDetected && route.lang === 'es') ? 20 : 0;
        const score = baseScore + exactMatchBonus + langBonus;

        if (score > highestScore) {
          highestScore = score;
          bestMatch = { route, triggerStr: triggerSource };
        }
      }
    }
  }

  if (bestMatch) {
    let resolvedRoute = bestMatch.route;

    // ANTI-REPETICIÓN CONSECUTIVA DE INTENT / AUDIO (CORTESÍA, AGRADECIMIENTOS Y CIERRES)
    const isConsecutiveRepeat = Boolean(
      (lastIntentKey && (lastIntentKey === resolvedRoute.id || (resolvedRoute.id.includes('thanks') && lastIntentKey.includes('thanks')))) ||
      (lastAudioPlayed && lastAudioPlayed.includes(resolvedRoute.audioUrl))
    );

    if (isConsecutiveRepeat) {
      // 1. Agradecimiento consecutivo en inglés ("thank you" -> "thank you so much")
      if (resolvedRoute.id === 'en-thanks-farewell') {
        const alternate = candidateRoutes.find((r) => r.id === 'en-goodbye-nice') ||
                          candidateRoutes.find((r) => r.id === 'en-bye');
        if (alternate) {
          resolvedRoute = alternate;
        }
      }
      // 2. Agradecimiento consecutivo en español ("gracias" -> "muchas gracias")
      else if (resolvedRoute.id === 'es-gracias-despedida') {
        const alternate = candidateRoutes.find((r) => r.id === 'es-fallback-natural') ||
                          candidateRoutes.find((r) => r.id === 'es-charla-informal');
        if (alternate) {
          resolvedRoute = alternate;
        }
      }
      // 3. Saludo consecutivo ("hello" -> "hi", "hola" -> "buenas")
      else if (resolvedRoute.id === 'en-hello') {
        const alternate = candidateRoutes.find((r) => r.id === 'en-practice');
        if (alternate) {
          resolvedRoute = alternate;
        }
      } else if (resolvedRoute.id === 'es-bienvenida') {
        const alternate = candidateRoutes.find((r) => r.id === 'es-charla-informal') ||
                          candidateRoutes.find((r) => r.id === 'es-metodologia');
        if (alternate) {
          resolvedRoute = alternate;
        }
      }
    }

    return {
      id: resolvedRoute.id,
      lang: resolvedRoute.lang,
      audioUrl: resolvedRoute.audioUrl,
      text: resolvedRoute.text,
      matchedTrigger: bestMatch.triggerStr,
      cached: true
    };
  }

  return null;
}
