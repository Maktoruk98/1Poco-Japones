// Contenido de la app: kana, vocabulario y frases.

const ROMAJI = [
  "a", "i", "u", "e", "o",
  "ka", "ki", "ku", "ke", "ko",
  "sa", "shi", "su", "se", "so",
  "ta", "chi", "tsu", "te", "to",
  "na", "ni", "nu", "ne", "no",
  "ha", "hi", "fu", "he", "ho",
  "ma", "mi", "mu", "me", "mo",
  "ya", "yu", "yo",
  "ra", "ri", "ru", "re", "ro",
  "wa", "wo", "n",
];

const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

const KANA = [
  ...[...HIRAGANA].map((char, i) => ({ id: `h-${ROMAJI[i]}`, type: "hiragana", char, romaji: ROMAJI[i] })),
  ...[...KATAKANA].map((char, i) => ({ id: `k-${ROMAJI[i]}`, type: "katakana", char, romaji: ROMAJI[i] })),
];

const VOCAB = [
  ["少し", "すこし", "sukoshi", "un poco"],
  ["水", "みず", "mizu", "agua"],
  ["猫", "ねこ", "neko", "gato"],
  ["犬", "いぬ", "inu", "perro"],
  ["本", "ほん", "hon", "libro"],
  ["山", "やま", "yama", "montaña"],
  ["川", "かわ", "kawa", "río"],
  ["海", "うみ", "umi", "mar"],
  ["花", "はな", "hana", "flor"],
  ["桜", "さくら", "sakura", "cerezo"],
  ["空", "そら", "sora", "cielo"],
  ["雨", "あめ", "ame", "lluvia"],
  ["月", "つき", "tsuki", "luna"],
  ["星", "ほし", "hoshi", "estrella"],
  ["家", "いえ", "ie", "casa"],
  ["友達", "ともだち", "tomodachi", "amigo/a"],
  ["先生", "せんせい", "sensei", "profesor/a"],
  ["学校", "がっこう", "gakkō", "escuela"],
  ["駅", "えき", "eki", "estación"],
  ["電車", "でんしゃ", "densha", "tren"],
  ["お茶", "おちゃ", "ocha", "té"],
  ["ご飯", "ごはん", "gohan", "arroz / comida"],
  ["魚", "さかな", "sakana", "pescado"],
  ["肉", "にく", "niku", "carne"],
  ["今日", "きょう", "kyō", "hoy"],
  ["明日", "あした", "ashita", "mañana (día)"],
  ["朝", "あさ", "asa", "la mañana (parte del día)"],
  ["夜", "よる", "yoru", "noche"],
  ["時間", "じかん", "jikan", "tiempo / hora"],
  ["日本", "にほん", "nihon", "Japón"],
  ["日本語", "にほんご", "nihongo", "idioma japonés"],
  ["食べる", "たべる", "taberu", "comer"],
  ["飲む", "のむ", "nomu", "beber"],
  ["行く", "いく", "iku", "ir"],
  ["見る", "みる", "miru", "ver / mirar"],
  ["大きい", "おおきい", "ōkii", "grande"],
  ["小さい", "ちいさい", "chiisai", "pequeño"],
  ["美味しい", "おいしい", "oishii", "delicioso"],
  ["好き", "すき", "suki", "que gusta"],
  ["元気", "げんき", "genki", "con energía / sano"],
].map(([word, kana, romaji, es]) => ({ id: `v-${romaji}`, word, kana, romaji, es }));

const PHRASES = [
  ["おはようございます", "ohayō gozaimasu", "Buenos días (formal)."],
  ["こんにちは", "konnichiwa", "Hola / buenas tardes."],
  ["こんばんは", "konbanwa", "Buenas noches (como saludo)."],
  ["ありがとうございます", "arigatō gozaimasu", "Muchas gracias."],
  ["すみません", "sumimasen", "Perdón / disculpe. También sirve para llamar la atención de alguien."],
  ["いただきます", "itadakimasu", "Se dice antes de comer: «lo recibo con gratitud»."],
  ["ごちそうさまでした", "gochisōsama deshita", "Se dice al terminar de comer: «gracias por la comida»."],
  ["お疲れ様です", "otsukaresama desu", "«Gracias por tu esfuerzo». Muy usada entre compañeros."],
  ["よろしくお願いします", "yoroshiku onegaishimasu", "«Encantado / cuento contigo». Al presentarte o pedir algo."],
  ["いってきます", "ittekimasu", "«Me voy (y vuelvo)». Al salir de casa."],
  ["ただいま", "tadaima", "«Ya estoy en casa». Al volver."],
  ["おやすみなさい", "oyasuminasai", "Buenas noches (al irse a dormir)."],
  ["少しだけ日本語を話します", "sukoshi dake nihongo o hanashimasu", "Hablo solo un poco de japonés."],
  ["頑張って", "ganbatte", "¡Ánimo! / ¡Tú puedes!"],
  ["大丈夫です", "daijōbu desu", "Está bien / estoy bien."],
].map(([jp, romaji, es]) => ({ jp, romaji, es }));

// Momentos japoneses: hábitos y pequeños placeres que echa de menos quien vuelve de Japón
// (choque cultural inverso). Cada uno se puede apuntar una vez al día.
const MOMENT_CATEGORIES = [
  {
    id: "notar",
    title: "🚃 Pequeños placeres",
    hint: "Cosas que notas y que te recuerdan a Japón.",
    items: [
      ["puntual", "El bus o el tren llegó puntual", 10, "En Japón un retraso de un minuto merece una disculpa por megafonía."],
      ["servicio", "Me atendieron con un cuidado exquisito", 10, "Omotenashi (おもてなし): anticiparse a lo que necesita el otro."],
      ["limpio", "Una calle, estación o baño impecable", 5, "La limpieza es de lo que más se echa de menos al volver."],
      ["silencio", "Un transporte o sitio público en calma", 5, "El silencio en los trenes japoneses es casi una norma."],
      ["sorpresa", "Me encontré algo japonés por sorpresa", 5, "Una tienda, un konbini, un cartel, una canción…"],
      ["seguridad", "Me sentí seguro/a como en Japón", 5, "La sensación de seguridad, el gran clásico de quien vuelve."],
    ],
  },
  {
    id: "respeto",
    title: "🙇 Respeto y modales",
    hint: "Lo que haces tú para que el día sea un poco más japonés.",
    items: [
      ["amable", "Fui especialmente considerado/a con alguien", 10, "Pensar primero en cómo afecta lo que haces a los demás."],
      ["cola", "Hice cola en orden, sin agobiar", 5, "En los andenes hay líneas pintadas para esperar el tren."],
      ["salir", "Dejé salir antes de entrar", 5, "Tren, ascensor, tienda: primero salen, luego entras."],
      ["bajito", "Hablé bajito o no llamé por teléfono en el transporte", 10, "En Japón las llamadas se hacen entre vagones, si acaso."],
      ["basura", "Guardé mi basura hasta encontrar una papelera", 10, "En Japón casi no hay papeleras: cada uno se lleva lo suyo."],
      ["reverencia", "Hice una pequeña reverencia", 5, "Eshaku (会釈): la inclinación ligera de 15° para saludar."],
      ["otsukare", "Agradecí su trabajo a alguien", 10, "Otsukaresama (お疲れ様): «gracias por tu esfuerzo»."],
      ["perdon", "Pedí perdón sin poner excusas", 10, "Sumimasen (すみません) sirve para disculparse y para agradecer."],
      ["andar", "No comí caminando por la calle", 5, "Allí se come donde se compra, o al llegar."],
    ],
  },
  {
    id: "mesa",
    title: "🍱 Comida y casa",
    hint: "Japón en tu cocina y en tu casa.",
    items: [
      ["itadakimasu", "Dije いただきます antes de comer", 5, "«Lo recibo con gratitud»."],
      ["gochisosama", "Dije ごちそうさまでした al terminar", 5, "«Gracias por la comida»."],
      ["mottainai", "No dejé nada en el plato ni tiré comida", 10, "Mottainai (もったいない): qué pena desperdiciar."],
      ["cocinar", "Cociné algo japonés", 15, "Un bento, un ramen, un onigiri…"],
      ["te", "Me tomé un té verde o un matcha con calma", 5, "Una pausa de verdad, sin pantallas."],
      ["palillos", "Comí con palillos", 5, "Sin clavarlos en el arroz: recuerda a los funerales."],
      ["zapatos", "Me descalcé al entrar en casa", 5, "El genkan (玄関) separa la calle del hogar."],
      ["ofuro", "Me di un baño largo y relajado", 10, "El ofuro (お風呂) es para relajarse, no para lavarse."],
    ],
  },
  {
    id: "calma",
    title: "🌸 Calma y estética",
    hint: "Ideas japonesas para el día a día.",
    items: [
      ["naturaleza", "Paseé por un parque o por la naturaleza", 10, "Shinrin-yoku (森林浴): «baño de bosque»."],
      ["estacion", "Me paré a mirar algo de la estación del año", 10, "Momiji en otoño, sakura en primavera: mono no aware (物の哀れ)."],
      ["imperfecto", "Aprecié algo imperfecto o desgastado", 5, "Wabi-sabi (侘寂): la belleza de lo sencillo e imperfecto."],
      ["ordenar", "Ordené o despejé un rincón", 10, "Danshari (断捨離): quedarte solo con lo que importa."],
      ["kaizen", "Mejoré un poquito algo de mi rutina", 10, "Kaizen (改善): pequeñas mejoras constantes."],
      ["omiyage", "Tuve un detalle con alguien", 10, "Omiyage (お土産): el regalito para los tuyos."],
    ],
  },
  {
    id: "recuerdos",
    title: "🗾 Japón en mí",
    hint: "Mantener vivo el viaje.",
    items: [
      ["japones", "Usé una palabra o frase en japonés", 5, "Aunque sea un arigatō para ti."],
      ["fotos", "Repasé fotos o recuerdos del viaje", 5, "Un clásico para llevar mejor la vuelta."],
      ["cultura", "Vi, leí o escuché algo japonés", 5, "Una peli, un manga, un disco, un artículo…"],
      ["compartir", "Le conté a alguien algo que aprendí en Japón", 10, "Contarlo también es una forma de volver."],
      ["planear", "Soñé o planeé el próximo viaje", 5, "Siempre hay un siguiente."],
    ],
  },
].map((cat) => ({
  ...cat,
  items: cat.items.map(([id, text, xp, note]) => ({ id: `${cat.id}-${id}`, text, xp, note })),
}));

// 19 niveles, uno por estación de la Loop Line: al subir de nivel eliges la palabra
// de la siguiente estación. El nivel 1 es Bentenchō.
const LEVELS = [
  [0, "観光客", "kankōkyaku", "Turista con jet lag"],
  [40, "旅人", "tabibito", "Alma viajera"],
  [100, "乗客", "jōkyaku", "Billete en mano"],
  [180, "常連", "jōren", "Cliente habitual"],
  [280, "通勤", "tsūkin", "Rutina de cercanías"],
  [400, "住人", "jūnin", "Gente del barrio"],
  [540, "町の顔", "machi no kao", "Cara conocida del barrio"],
  [700, "見習い", "minarai", "Aprendiz"],
  [880, "稽古", "keiko", "Práctica constante"],
  [1080, "職人", "shokunin", "Artesanía de las costumbres"],
  [1300, "先輩", "senpai", "Senpai"],
  [1550, "案内人", "annainin", "Guía local"],
  [1830, "茶人", "chajin", "Alma del té"],
  [2140, "達人", "tatsujin", "Maestría"],
  [2480, "師範", "shihan", "Quien enseña"],
  [2850, "名人", "meijin", "Leyenda local"],
  [3250, "侍", "samurai", "Samurái de la puntualidad"],
  [3700, "将軍", "shōgun", "Shōgun"],
  [4200, "日本の心", "nihon no kokoro", "Corazón japonés"],
].map(([xp, jp, romaji, es], i) => ({ level: i + 1, xp, jp, romaji, es }));

// Proverbios japoneses (ことわざ) para la pantalla de carga: uno distinto cada día.
const PROVERBS = [
  ["継続は力なり", "keizoku wa chikara nari", "La constancia es poder."],
  ["塵も積もれば山となる", "chiri mo tsumoreba yama to naru", "Hasta el polvo, acumulado, se vuelve montaña."],
  ["千里の道も一歩から", "senri no michi mo ippo kara", "Un viaje de mil leguas empieza con un paso."],
  ["七転び八起き", "nana korobi ya oki", "Cae siete veces, levántate ocho."],
  ["一期一会", "ichigo ichie", "Cada encuentro es único e irrepetible."],
  ["石の上にも三年", "ishi no ue ni mo sannen", "Tres años sobre una piedra: la paciencia da fruto."],
  ["急がば回れ", "isogaba maware", "Si tienes prisa, da un rodeo."],
  ["習うより慣れよ", "narau yori nare yo", "Mejor acostumbrarse que estudiar: la práctica enseña."],
  ["好きこそ物の上手なれ", "suki koso mono no jōzu nare", "Lo que te gusta es lo que mejor se te da."],
  ["笑う門には福来る", "warau kado ni wa fuku kitaru", "La fortuna llega a la casa donde se ríe."],
  ["雨降って地固まる", "ame futte ji katamaru", "Tras la lluvia, la tierra se asienta."],
  ["案ずるより産むが易し", "anzuru yori umu ga yasushi", "Hacerlo es más fácil que preocuparse."],
  ["猿も木から落ちる", "saru mo ki kara ochiru", "Hasta los monos se caen de los árboles."],
  ["花より団子", "hana yori dango", "Mejor dango que flores: lo práctico antes que lo bonito."],
].map(([jp, romaji, es]) => ({ jp, romaji, es }));

// ---------- Aprender a leer ----------

// Lecciones por filas, en el orden tradicional (あいうえお, かきくけこ…).
const KANA_ROWS = [
  ["a", "i", "u", "e", "o"],
  ["ka", "ki", "ku", "ke", "ko"],
  ["sa", "shi", "su", "se", "so"],
  ["ta", "chi", "tsu", "te", "to"],
  ["na", "ni", "nu", "ne", "no"],
  ["ha", "hi", "fu", "he", "ho"],
  ["ma", "mi", "mu", "me", "mo"],
  ["ya", "yu", "yo"],
  ["ra", "ri", "ru", "re", "ro"],
  ["wa", "wo", "n"],
];

// Consejos de pronunciación, solo donde el sonido no es el obvio para alguien que habla español.
const KANA_TIPS = {
  a: "Las vocales japonesas suenan igual que en español. ¡Buena noticia!",
  shi: "Suena «shi», como en inglés «she». Nunca «si».",
  chi: "Suena «chi», como en «chico».",
  tsu: "Suena «tsu», como en «tsunami»: una t y una s muy juntas.",
  fu: "Entre «fu» y «ju»: se dice soplando suave, sin juntar los dientes con el labio.",
  ha: "Como partícula (は) se lee «wa».",
  he: "Como partícula (へ) se lee «e».",
  ra: "La r japonesa es suave, entre nuestra «r» de «cara» y una «l».",
  wo: "Suena «o». Solo se usa como partícula.",
  n: "Es la única consonante que va sola. Suena como la «n» de «canción» o la «m» de «campo».",
};

// Una palabra de ejemplo por símbolo: [palabra, romaji, significado].
const KANA_EXAMPLES = {
  hiragana: {
    a: ["あめ", "ame", "lluvia"], i: ["いぬ", "inu", "perro"], u: ["うみ", "umi", "mar"], e: ["えき", "eki", "estación"], o: ["おちゃ", "ocha", "té"],
    ka: ["かさ", "kasa", "paraguas"], ki: ["き", "ki", "árbol"], ku: ["くも", "kumo", "nube"], ke: ["けいと", "keito", "lana"], ko: ["こども", "kodomo", "niño, niña"],
    sa: ["さくら", "sakura", "cerezo"], shi: ["しお", "shio", "sal"], su: ["すし", "sushi", "sushi"], se: ["せんせい", "sensei", "profesor, profesora"], so: ["そら", "sora", "cielo"],
    ta: ["たまご", "tamago", "huevo"], chi: ["ちず", "chizu", "mapa"], tsu: ["つき", "tsuki", "luna"], te: ["て", "te", "mano"], to: ["とり", "tori", "pájaro"],
    na: ["なつ", "natsu", "verano"], ni: ["にく", "niku", "carne"], nu: ["ぬいぐるみ", "nuigurumi", "peluche"], ne: ["ねこ", "neko", "gato"], no: ["のり", "nori", "alga nori"],
    ha: ["はな", "hana", "flor"], hi: ["ひと", "hito", "persona"], fu: ["ふね", "fune", "barco"], he: ["へや", "heya", "habitación"], ho: ["ほし", "hoshi", "estrella"],
    ma: ["まど", "mado", "ventana"], mi: ["みず", "mizu", "agua"], mu: ["むし", "mushi", "insecto"], me: ["め", "me", "ojo"], mo: ["もり", "mori", "bosque"],
    ya: ["やま", "yama", "montaña"], yu: ["ゆき", "yuki", "nieve"], yo: ["よる", "yoru", "noche"],
    ra: ["らーめん", "rāmen", "ramen"], ri: ["りんご", "ringo", "manzana"], ru: ["るす", "rusu", "no estar en casa"], re: ["れきし", "rekishi", "historia"], ro: ["ろうそく", "rōsoku", "vela"],
    wa: ["わたし", "watashi", "yo"], wo: ["ほんを よむ", "hon o yomu", "leer un libro (を va entre «libro» y «leer»)"], n: ["ほん", "hon", "libro (ん siempre va detrás)"],
  },
  katakana: {
    a: ["アイス", "aisu", "helado"], i: ["イタリア", "Itaria", "Italia"], u: ["ウイスキー", "uisukī", "whisky"], e: ["エアコン", "eakon", "aire acondicionado"], o: ["オレンジ", "orenji", "naranja"],
    ka: ["カメラ", "kamera", "cámara"], ki: ["キス", "kisu", "beso"], ku: ["クッキー", "kukkī", "galleta"], ke: ["ケーキ", "kēki", "pastel"], ko: ["コーヒー", "kōhī", "café"],
    sa: ["サッカー", "sakkā", "fútbol"], shi: ["シーソー", "shīsō", "balancín"], su: ["スペイン", "Supein", "España"], se: ["セーター", "sētā", "jersey"], so: ["ソファ", "sofa", "sofá"],
    ta: ["タクシー", "takushī", "taxi"], chi: ["チーズ", "chīzu", "queso"], tsu: ["ツアー", "tsuā", "tour"], te: ["テレビ", "terebi", "televisión"], to: ["トマト", "tomato", "tomate"],
    na: ["ナイフ", "naifu", "cuchillo"], ni: ["ニュース", "nyūsu", "noticias"], nu: ["ヌードル", "nūdoru", "fideos"], ne: ["ネクタイ", "nekutai", "corbata"], no: ["ノート", "nōto", "cuaderno"],
    ha: ["ハンバーガー", "hanbāgā", "hamburguesa"], hi: ["ヒーター", "hītā", "calefactor"], fu: ["フランス", "Furansu", "Francia"], he: ["ヘリコプター", "herikoputā", "helicóptero"], ho: ["ホテル", "hoteru", "hotel"],
    ma: ["マスク", "masuku", "mascarilla"], mi: ["ミルク", "miruku", "leche"], mu: ["ムース", "mūsu", "mousse"], me: ["メロン", "meron", "melón"], mo: ["モデル", "moderu", "modelo"],
    ya: ["ヤギ", "yagi", "cabra"], yu: ["ユニフォーム", "yunifōmu", "uniforme"], yo: ["ヨーグルト", "yōguruto", "yogur"],
    ra: ["ラジオ", "rajio", "radio"], ri: ["リボン", "ribon", "lazo"], ru: ["ルール", "rūru", "regla"], re: ["レモン", "remon", "limón"], ro: ["ロボット", "robotto", "robot"],
    wa: ["ワイン", "wain", "vino"], wo: ["ヲ", "wo", "casi no se usa: en su lugar se escribe を en hiragana"], n: ["パン", "pan", "pan (ン siempre va detrás)"],
  },
};
