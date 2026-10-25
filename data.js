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
