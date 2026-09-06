export type GospelStory = {
  id: number;
  title: { de: string; en: string };
  reference: string;
  url: string;
  alt: string;
  lines: { de: string; en: string }[];
  questions: { de: string; en: string; answerDe: string; answerEn: string }[];
  activity: { de: string; en: string };
};
export const gospelStories: GospelStory[] = [
  {
    id: 1,
    title: { de: 'Jesus und die Kinder', en: 'Jesus welcomes the children' },
    reference: 'Mark 10:13–16',
    url: 'https://www.biblegateway.com/passage/?search=Mark+10%3A13-16&version=WEB',
    alt: 'Jesus warmly welcomes children outdoors',
    lines: [
      {
        de: 'Menschen bringen Kinder zu Jesus.',
        en: 'People bring children to Jesus.',
      },
      {
        de: 'Die Jünger wollen sie aufhalten.',
        en: 'The disciples want to stop them.',
      },
      {
        de: 'Jesus möchte, dass die Kinder zu ihm kommen.',
        en: 'Jesus wants the children to come to him.',
      },
      {
        de: 'Er nimmt sie in die Arme und segnet sie.',
        en: 'He takes them in his arms and blesses them.',
      },
    ],
    questions: [
      {
        de: 'Wer kommt zu Jesus?',
        en: 'Who comes to Jesus?',
        answerDe: 'Die Kinder kommen zu Jesus.',
        answerEn: 'The children come to Jesus.',
      },
      {
        de: 'Was macht Jesus?',
        en: 'What does Jesus do?',
        answerDe: 'Er segnet die Kinder.',
        answerEn: 'He blesses the children.',
      },
    ],
    activity: {
      de: 'Begrüße ein Spielzeug freundlich: Hallo! Schön, dass du da bist.',
      en: 'Welcome a toy kindly: Hello! It is lovely that you are here.',
    },
  },
  {
    id: 2,
    title: { de: 'Brot für viele Menschen', en: 'Bread for a great crowd' },
    reference: 'John 6:1–13',
    url: 'https://www.biblegateway.com/passage/?search=John+6&version=NIV%3BWEB',
    alt: 'Jesus gives thanks with bread and fish beside a grassy hillside and a crowd',
    lines: [
      {
        de: 'Viele Menschen kommen zu Jesus.',
        en: 'Many people come to Jesus.',
      },
      {
        de: 'Ein Junge hat fünf Brote und zwei Fische.',
        en: 'A boy has five loaves and two fish.',
      },
      {
        de: 'Jesus dankt Gott und gibt den Menschen zu essen.',
        en: 'Jesus thanks God and gives the people food.',
      },
      {
        de: 'Alle werden satt. Mit den Resten füllen sie zwölf Körbe.',
        en: 'Everyone has enough to eat. Twelve baskets of food are left over.',
      },
    ],
    questions: [
      {
        de: 'Wie viele Brote hat der Junge?',
        en: 'How many loaves does the boy have?',
        answerDe: 'Er hat fünf Brote.',
        answerEn: 'He has five loaves.',
      },
      {
        de: 'Sind alle satt?',
        en: 'Has everyone had enough to eat?',
        answerDe: 'Ja, alle sind satt.',
        answerEn: 'Yes, everyone has had enough.',
      },
    ],
    activity: {
      de: 'Zähle fünf Brote aus Papier und zwei Fische aus Papier.',
      en: 'Count five paper loaves and two paper fish.',
    },
  },
  {
    id: 3,
    title: { de: 'Jesus stillt den Sturm', en: 'Jesus calms the storm' },
    reference: 'Mark 4:35–41',
    url: 'https://www.biblegateway.com/passage/?search=Mark+4%3A35-41&version=WEB',
    alt: 'Jesus and his disciples in a boat on a calm lake after a storm',
    lines: [
      {
        de: 'Jesus und seine Jünger fahren in einem Boot.',
        en: 'Jesus and his disciples travel in a boat.',
      },
      {
        de: 'Ein Sturm kommt. Die Jünger haben Angst.',
        en: 'A storm comes. The disciples are afraid.',
      },
      {
        de: 'Sie wecken Jesus. Er spricht zum Wind und zum See.',
        en: 'They wake Jesus. He speaks to the wind and the lake.',
      },
      {
        de: 'Der Wind hört auf. Das Wasser wird ganz ruhig.',
        en: 'The wind stops. The water becomes very calm.',
      },
    ],
    questions: [
      {
        de: 'Wo sind Jesus und die Jünger?',
        en: 'Where are Jesus and the disciples?',
        answerDe: 'Sie sind im Boot.',
        answerEn: 'They are in the boat.',
      },
      {
        de: 'Wie ist das Wasser am Ende?',
        en: 'What is the water like at the end?',
        answerDe: 'Das Wasser ist ruhig.',
        answerEn: 'The water is calm.',
      },
    ],
    activity: {
      de: 'Bewege ein blaues Tuch: erst wild, dann ruhig. Sage: Jetzt ist es ruhig.',
      en: 'Move a blue cloth: first wildly, then calmly. Say: Now it is calm.',
    },
  },
  {
    id: 4,
    title: { de: 'Jesus besucht Zachäus', en: 'Jesus visits Zacchaeus' },
    reference: 'Luke 19:1–10',
    url: 'https://www.biblegateway.com/passage/?search=Luke+19%3A1-10&version=WEB',
    alt: 'Jesus looks up at Zacchaeus sitting in a tree',
    lines: [
      {
        de: 'Zachäus möchte Jesus sehen und klettert auf einen Baum.',
        en: 'Zacchaeus wants to see Jesus and climbs a tree.',
      },
      {
        de: 'Jesus sieht ihn und möchte ihn zu Hause besuchen.',
        en: 'Jesus sees him and wants to visit him at home.',
      },
      {
        de: 'Zachäus kommt schnell herunter und freut sich.',
        en: 'Zacchaeus comes down quickly and is happy.',
      },
      {
        de: 'Er will den Armen helfen und zu viel genommenes Geld zurückgeben.',
        en: 'He wants to help poor people and repay money he has taken unfairly.',
      },
    ],
    questions: [
      {
        de: 'Wo ist Zachäus zuerst?',
        en: 'Where is Zacchaeus at first?',
        answerDe: 'Er ist auf einem Baum.',
        answerEn: 'He is in a tree.',
      },
      {
        de: 'Wem will Zachäus helfen?',
        en: 'Whom does Zacchaeus want to help?',
        answerDe: 'Er will den Armen helfen.',
        answerEn: 'He wants to help poor people.',
      },
    ],
    activity: {
      de: 'Male einen Baum und ein Haus. Sage: Hier ist der Baum. Dort ist das Haus.',
      en: 'Draw a tree and a house. Say: Here is the tree. There is the house.',
    },
  },
  {
    id: 5,
    title: { de: 'Jesus im Tempel', en: 'Young Jesus in the temple' },
    reference: 'Luke 2:41–52',
    url: 'https://www.biblegateway.com/passage/?search=Luke+2%3A41-52&version=WEB',
    alt: 'Twelve-year-old Jesus listens to teachers in the temple in Jerusalem',
    lines: [
      {
        de: 'Jesus ist zwölf Jahre alt und reist nach Jerusalem.',
        en: 'Jesus is twelve years old and travels to Jerusalem.',
      },
      {
        de: 'Seine Eltern suchen ihn und finden ihn im Tempel.',
        en: 'His parents look for him and find him in the temple.',
      },
      {
        de: 'Er hört den Lehrern zu und stellt Fragen.',
        en: 'He listens to the teachers and asks questions.',
      },
      {
        de: 'Dann geht er mit seinen Eltern nach Nazareth zurück.',
        en: 'Then he returns to Nazareth with his parents.',
      },
    ],
    questions: [
      {
        de: 'Wie alt ist Jesus?',
        en: 'How old is Jesus?',
        answerDe: 'Er ist zwölf Jahre alt.',
        answerEn: 'He is twelve years old.',
      },
      {
        de: 'Was macht er im Tempel?',
        en: 'What does he do in the temple?',
        answerDe: 'Er hört zu und stellt Fragen.',
        answerEn: 'He listens and asks questions.',
      },
    ],
    activity: {
      de: 'Stelle einem Erwachsenen eine Frage. Höre der Antwort gut zu.',
      en: 'Ask a grown-up a question. Listen carefully to the answer.',
    },
  },
  {
    id: 6,
    title: { de: 'Frühstück mit Jesus', en: 'Breakfast with Jesus' },
    reference: 'John 21:1–14',
    url: 'https://search.biblegateway.com/passage/?search=John+21&version=WEB',
    alt: 'The risen Jesus serves bread and fish to his disciples beside the lake',
    lines: [
      {
        de: 'Nach seiner Auferstehung erscheint Jesus seinen Jüngern am See.',
        en: 'After his resurrection, Jesus appears to his disciples beside the lake.',
      },
      {
        de: 'Sie haben die ganze Nacht keine Fische gefangen.',
        en: 'They have caught no fish all night.',
      },
      {
        de: 'Sie tun, was Jesus sagt, und fangen viele Fische.',
        en: 'They do what Jesus says and catch many fish.',
      },
      {
        de: 'Am Ufer gibt Jesus ihnen Brot und Fisch zum Frühstück.',
        en: 'On the shore, Jesus gives them bread and fish for breakfast.',
      },
    ],
    questions: [
      {
        de: 'Wo ist Jesus?',
        en: 'Where is Jesus?',
        answerDe: 'Jesus ist am See.',
        answerEn: 'Jesus is beside the lake.',
      },
      {
        de: 'Was gibt es zum Frühstück?',
        en: 'What is there for breakfast?',
        answerDe: 'Es gibt Brot und Fisch.',
        answerEn: 'There is bread and fish.',
      },
    ],
    activity: {
      de: 'Decke einen kleinen Frühstückstisch für zwei Spielzeuge. Sage: Guten Morgen!',
      en: 'Set a little breakfast table for two toys. Say: Good morning!',
    },
  },
];
