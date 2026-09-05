export type Phrase = { de: string; en: string };
export type Lesson = {
  id: number;
  world: number;
  title: string;
  phrases: Phrase[];
  tip: string;
  mission: string;
  swap: string;
};
export const worlds = [
  {
    title: 'Hello, new friend!',
    icon: '👋',
    subtitle: 'Names, feelings & kind words',
  },
  {
    title: 'My colourful world',
    icon: '🌈',
    subtitle: 'Colours, numbers & favourite things',
  },
  {
    title: 'My favourite people',
    icon: '🏡',
    subtitle: 'Family, friends & pets',
  },
  {
    title: 'Snack-time café',
    icon: '🍎',
    subtitle: 'Food, drinks & polite requests',
  },
  {
    title: 'Ready for school',
    icon: '🎒',
    subtitle: 'School things & asking for help',
  },
  {
    title: 'Come and play!',
    icon: '⚽',
    subtitle: 'Games, hobbies & invitations',
  },
  {
    title: 'A day in my life',
    icon: '☀️',
    subtitle: 'Routines, days & simple plans',
  },
  {
    title: 'Out and about',
    icon: '🚌',
    subtitle: 'Places, directions & little trips',
  },
  {
    title: 'Rain or shine',
    icon: '☔',
    subtitle: 'Weather, clothes & getting ready',
  },
  {
    title: 'Animal explorers',
    icon: '🐾',
    subtitle: 'Animals, nature & discoveries',
  },
  {
    title: 'Let’s celebrate!',
    icon: '🎈',
    subtitle: 'Birthdays, presents & wishes',
  },
  {
    title: 'I can chat!',
    icon: '💬',
    subtitle: 'Mix your words in real conversations',
  },
];
type Row = [string, [string, string][], string, string, string];
const rows: Row[] = [
  [
    'Hello, I’m Mia!',
    [
      ['Hallo!', 'Hello!'],
      ['Hallo, ich heiße Mia.', 'Hello, my name is Mia.'],
      ['Wie heißt du?', 'What is your name?'],
      ['Ich heiße Ben. Und du?', 'My name is Ben. And you?'],
    ],
    'The ß in heißt sounds like s. Listen first; you do not need to learn letter rules today.',
    'Introduce two toys to each other. Give them silly pretend names.',
    'Swap Mia and Ben for toy names.',
  ],
  [
    'How are you?',
    [
      ['Wie geht es dir?', 'How are you?'],
      ['Mir geht es gut.', 'I am well.'],
      ['Und dir?', 'And you?'],
      ['Ich bin müde.', 'I am tired.'],
    ],
    'Use your face and voice to show how you feel. Müde means tired.',
    'Make a happy face and a sleepy face. Your partner guesses in German.',
    'Try froh (happy) instead of müde (tired): Ich bin froh.',
  ],
  [
    'Kind little words',
    [
      ['Möchtest du den Ball?', 'Would you like the ball?'],
      ['Ja, bitte!', 'Yes, please!'],
      ['Hier, bitte.', 'Here you are.'],
      ['Danke! Tschüss!', 'Thank you! Bye!'],
    ],
    'Bitte can mean please or here you are. The situation helps you work it out.',
    'Pass a toy back and forth with bitte and danke. Wave goodbye.',
    'Try Nein, danke! (No, thank you!) instead of Ja, bitte!',
  ],
  [
    'Colour detective',
    [
      ['Welche Farbe ist das?', 'What colour is that?'],
      ['Das ist blau.', 'That is blue.'],
      ['Ist das rot?', 'Is that red?'],
      ['Nein, das ist grün.', 'No, that is green.'],
    ],
    'Blau is blue, rot is red, and grün is green. Point at colours while you say them.',
    'Find three things in the room and tell your partner their colours.',
    'Swap blau for rot (red), grün (green) or gelb (yellow).',
  ],
  [
    'Let’s count',
    [
      ['Wie viele sind das?', 'How many are there?'],
      ['Das sind drei.', 'There are three.'],
      ['Kannst du bis fünf zählen?', 'Can you count to five?'],
      ['Eins, zwei, drei, vier, fünf.', 'One, two, three, four, five.'],
    ],
    'Count real objects slowly. Each German number gets one tap.',
    'Put out one to five blocks. Ask and answer how many, then change the number.',
    'Use zwei (two), vier (four) or fünf (five) instead of drei.',
  ],
  [
    'My favourite colour',
    [
      ['Was ist deine Lieblingsfarbe?', 'What is your favourite colour?'],
      ['Meine Lieblingsfarbe ist gelb.', 'My favourite colour is yellow.'],
      ['Magst du Blau?', 'Do you like blue?'],
      ['Ja, ich mag Blau.', 'Yes, I like blue.'],
    ],
    'Lieblingsfarbe is one long word: favourite + colour. Tap its parts as you listen.',
    'Choose a crayon without showing it. Say its colour so your partner can find the same one.',
    'Try Meine Lieblingsfarbe ist grün. (My favourite colour is green.)',
  ],
  [
    'Meet my family',
    [
      ['Wer ist das?', 'Who is that?'],
      ['Das ist meine Mama.', 'That is my mum.'],
      ['Ist das dein Papa?', 'Is that your dad?'],
      ['Ja, das ist mein Papa.', 'Yes, that is my dad.'],
    ],
    'Mein goes with Papa; meine goes with Mama. Learn each little phrase together.',
    'Draw a pretend family. Introduce each person. Any kind of family is welcome.',
    'Use meine Oma (my grandma) or mein Opa (my grandpa).',
  ],
  [
    'Brothers and sisters',
    [
      ['Hast du Geschwister?', 'Do you have brothers or sisters?'],
      ['Ich habe eine Schwester.', 'I have a sister.'],
      ['Hast du einen Bruder?', 'Do you have a brother?'],
      ['Nein, ich habe keinen Bruder.', 'No, I do not have a brother.'],
    ],
    'Geschwister means siblings. You can invent a toy family instead of describing your own.',
    'Give a toy a pretend brother or sister. Ask about its family.',
    'Try Ich habe einen Bruder. (I have a brother.) or Ich habe keine Geschwister. (I have no siblings.)',
  ],
  [
    'My pet friend',
    [
      ['Hast du ein Haustier?', 'Do you have a pet?'],
      ['Ich habe eine Katze.', 'I have a cat.'],
      ['Wie heißt deine Katze?', 'What is your cat’s name?'],
      ['Meine Katze heißt Mimi.', 'My cat is called Mimi.'],
    ],
    'Learn eine Katze (a cat) as a little word team. A pretend pet is fine.',
    'Draw an imaginary cat. Tell a partner its name and ask about their cat.',
    'Give your cat a different pretend name.',
  ],
  [
    'I’m hungry!',
    [
      ['Hast du Hunger?', 'Are you hungry?'],
      ['Ja, ich habe Hunger.', 'Yes, I am hungry.'],
      ['Möchtest du einen Apfel?', 'Would you like an apple?'],
      ['Ja, einen Apfel, bitte.', 'Yes, an apple, please.'],
    ],
    'German says I have hunger: Ich habe Hunger. Say the whole chunk.',
    'Make a pretend snack shop with drawings. Ask for an apple politely.',
    'Try Nein, danke. Ich habe keinen Hunger. (No, thank you. I am not hungry.)',
  ],
  [
    'Something to drink',
    [
      ['Was möchtest du trinken?', 'What would you like to drink?'],
      ['Ich möchte Wasser, bitte.', 'I would like water, please.'],
      ['Möchtest du Saft?', 'Would you like juice?'],
      ['Nein, danke. Wasser, bitte.', 'No, thank you. Water, please.'],
    ],
    'Ich möchte… is a useful polite way to ask for something.',
    'Set out two empty cups. Take turns playing the customer and café helper.',
    'Swap Wasser (water) for Saft (juice) or Milch (milk).',
  ],
  [
    'Yum or no thanks?',
    [
      ['Magst du Bananen?', 'Do you like bananas?'],
      ['Ja, ich mag Bananen.', 'Yes, I like bananas.'],
      ['Magst du Tomaten?', 'Do you like tomatoes?'],
      ['Nein, ich mag keine Tomaten.', 'No, I do not like tomatoes.'],
    ],
    'People like different things. You can disagree kindly.',
    'Draw a snack you like and one you do not. Ask your partner what they like.',
    'Try Ich mag Äpfel. (I like apples.)',
  ],
  [
    'What’s in my bag?',
    [
      ['Was ist das?', 'What is that?'],
      ['Das ist ein Buch.', 'That is a book.'],
      ['Ist das ein Stift?', 'Is that a pen or pencil?'],
      ['Ja, das ist ein Stift.', 'Yes, that is a pen or pencil.'],
    ],
    'Das ist… means that is… . Learn ein Buch and ein Stift as word teams.',
    'Hide a book or pencil behind your back. Show it and ask what it is.',
    'Try Das ist ein Heft. (That is an exercise book.)',
  ],
  [
    'Can I have a pencil?',
    [
      ['Brauchst du einen Stift?', 'Do you need a pen or pencil?'],
      ['Ja, ich brauche einen Stift.', 'Yes, I need a pen or pencil.'],
      ['Hier, bitte.', 'Here you are.'],
      ['Danke für den Stift.', 'Thank you for the pen or pencil.'],
    ],
    'Ich brauche… means I need… . Use the words to solve a real little problem.',
    'Pretend you are about to draw but your pencil is missing. Ask your partner for one.',
    'Try Ich brauche ein Buch. (I need a book.)',
  ],
  [
    'Please help me',
    [
      ['Verstehst du das?', 'Do you understand that?'],
      ['Ich verstehe das nicht.', 'I do not understand that.'],
      ['Noch einmal, bitte?', 'Again, please?'],
      ['Kannst du mir helfen?', 'Can you help me?'],
    ],
    'These are super-useful repair phrases. Asking for help is good speaking.',
    'A grown-up says a familiar phrase too quietly. Ask for it again, then swap roles.',
    'Try Langsam, bitte. (Slowly, please.)',
  ],
  [
    'My favourite game',
    [
      ['Was spielst du gern?', 'What do you like to play?'],
      ['Ich spiele gern Fußball.', 'I like playing football.'],
      ['Spielst du gern Verstecken?', 'Do you like playing hide-and-seek?'],
      ['Ja, ich spiele gern Verstecken.', 'Yes, I like playing hide-and-seek.'],
    ],
    'Gern means you enjoy doing something. Put it with a doing word.',
    'Mime football or hide-and-seek. Your partner asks what you like to play.',
    'Try Ich spiele gern Fangen. (I like playing tag.)',
  ],
  [
    'Join in!',
    [
      ['Möchtest du mitspielen?', 'Would you like to join in?'],
      ['Ja, ich spiele mit.', 'Yes, I will join in.'],
      ['Bist du bereit?', 'Are you ready?'],
      ['Ja, los geht’s!', 'Yes, let’s go!'],
    ],
    'Mitspielen means to join in a game. Invite someone kindly; no is okay too.',
    'Invite a grown-up to a two-minute game using German.',
    'Try Nein, danke. Vielleicht später. (No, thank you. Maybe later.)',
  ],
  [
    'Things I can do',
    [
      ['Kannst du schwimmen?', 'Can you swim?'],
      ['Ja, ich kann schwimmen.', 'Yes, I can swim.'],
      ['Kannst du singen?', 'Can you sing?'],
      ['Ja, ich kann singen.', 'Yes, I can sing.'],
    ],
    'Ich kann… tells someone what you can do. Use pretend examples if you like.',
    'Mime singing, dancing or swimming safely on dry land. Ask your partner to guess.',
    'Try Ich kann tanzen. (I can dance.) or Ich kann nicht schwimmen. (I cannot swim.)',
  ],
  [
    'Good morning!',
    [
      ['Guten Morgen!', 'Good morning!'],
      ['Guten Morgen! Ich bin wach.', 'Good morning! I am awake.'],
      ['Was machst du jetzt?', 'What are you doing now?'],
      ['Ich esse mein Frühstück.', 'I am eating my breakfast.'],
    ],
    'Jetzt means now. Say a tiny sentence about what you are doing.',
    'Use German to greet a toy and pretend to share breakfast.',
    'Try Ich putze meine Zähne. (I am brushing my teeth.)',
  ],
  [
    'Which day is it?',
    [
      ['Welcher Tag ist heute?', 'What day is it today?'],
      ['Heute ist Montag.', 'Today is Monday.'],
      ['Was machst du am Dienstag?', 'What are you doing on Tuesday?'],
      ['Am Dienstag spiele ich.', 'On Tuesday I am playing.'],
    ],
    'Montag is Monday; Dienstag is Tuesday. Am means on with a day.',
    'Make a two-day picture calendar. Ask about the days and the pictures.',
    'Try Heute ist Mittwoch. (Today is Wednesday.)',
  ],
  [
    'After school',
    [
      ['Was machst du nach der Schule?', 'What do you do after school?'],
      ['Ich spiele im Park.', 'I play in the park.'],
      ['Liest du auch?', 'Do you read too?'],
      ['Ja, ich lese gern.', 'Yes, I like reading.'],
    ],
    'Nach der Schule means after school. Auch means too.',
    'Draw an after-school plan. Tell your partner two things about it.',
    'Try Ich male gern. (I like drawing or painting.)',
  ],
  [
    'Where are we going?',
    [
      ['Wohin gehen wir?', 'Where are we going?'],
      ['Wir gehen in den Park.', 'We are going to the park.'],
      ['Kommst du mit?', 'Are you coming along?'],
      ['Ja, ich komme mit.', 'Yes, I am coming along.'],
    ],
    'Wir means we. Use it when you and someone else do something together.',
    'Move two toys from a pretend house to a park. Say where they are going.',
    'Try Wir gehen zur Schule. (We are going to school.)',
  ],
  [
    'Left or right?',
    [
      ['Wo ist der Park?', 'Where is the park?'],
      ['Der Park ist links.', 'The park is on the left.'],
      ['Ist die Schule rechts?', 'Is the school on the right?'],
      ['Ja, die Schule ist rechts.', 'Yes, the school is on the right.'],
    ],
    'Links is left; rechts is right. Point as you speak.',
    'Make a tiny map on a table. Help a toy find the park and the school.',
    'Swap links (left) and rechts (right).',
  ],
  [
    'On the bus',
    [
      ['Fahren wir mit dem Bus?', 'Are we going by bus?'],
      ['Ja, wir fahren mit dem Bus.', 'Yes, we are going by bus.'],
      ['Ist das unser Bus?', 'Is that our bus?'],
      ['Ja, komm mit!', 'Yes, come along!'],
    ],
    'Mit dem Bus means by bus. Learn the whole phrase rather than a grammar rule.',
    'Line up chairs for a pretend bus ride. Take a toy on a trip with a grown-up.',
    'Try Wir fahren mit dem Zug. (We are going by train.)',
  ],
  [
    'Look at the weather',
    [
      ['Wie ist das Wetter?', 'What is the weather like?'],
      ['Heute scheint die Sonne.', 'The sun is shining today.'],
      ['Regnet es?', 'Is it raining?'],
      ['Nein, es regnet nicht.', 'No, it is not raining.'],
    ],
    'Es regnet means it is raining. Add nicht to say it is not raining.',
    'Look out of the window with a grown-up and give a one-sentence weather report.',
    'Try Es regnet. (It is raining.) or Es ist windig. (It is windy.)',
  ],
  [
    'Getting dressed',
    [
      ['Was ziehst du an?', 'What are you putting on?'],
      ['Ich ziehe meine Jacke an.', 'I am putting on my jacket.'],
      ['Brauchst du deine Mütze?', 'Do you need your hat?'],
      ['Ja, ich brauche meine Mütze.', 'Yes, I need my hat.'],
    ],
    'In Ich ziehe…an, the little an comes at the end. Listen and copy the whole chunk.',
    'Dress a toy for an imaginary cold day. Explain one thing you put on it.',
    'Try Ich ziehe meine Schuhe an. (I am putting on my shoes.)',
  ],
  [
    'Warm or cold?',
    [
      ['Ist dir kalt?', 'Are you cold?'],
      ['Ja, mir ist kalt.', 'Yes, I am cold.'],
      ['Möchtest du deine Jacke?', 'Would you like your jacket?'],
      ['Ja, bitte. Danke!', 'Yes, please. Thank you!'],
    ],
    'For feeling cold, say Mir ist kalt. Copy this useful little phrase.',
    'Pretend to shiver. Ask for a jacket, then act warm and happy.',
    'Try Mir ist warm. (I am warm.)',
  ],
  [
    'At the animal park',
    [
      ['Was siehst du?', 'What do you see?'],
      ['Ich sehe einen Hund.', 'I see a dog.'],
      ['Ist der Hund groß?', 'Is the dog big?'],
      ['Nein, der Hund ist klein.', 'No, the dog is small.'],
    ],
    'Groß is big; klein is small. Stretch your arms to show the difference.',
    'Draw a tiny dog and a big dog. Tell your partner which one you can see.',
    'Try Der Hund ist groß. (The dog is big.)',
  ],
  [
    'What can it do?',
    [
      ['Was macht der Vogel?', 'What is the bird doing?'],
      ['Der Vogel fliegt.', 'The bird is flying.'],
      ['Kann der Fisch fliegen?', 'Can the fish fly?'],
      ['Nein, der Fisch schwimmt.', 'No, the fish is swimming.'],
    ],
    'Vogel means bird; Fisch means fish. Flying and swimming are different actions.',
    'Act like a bird or fish. Your partner says what the animal is doing.',
    'Try Der Hund läuft. (The dog is running.)',
  ],
  [
    'Nature treasure hunt',
    [
      ['Was ist das?', 'What is that?'],
      ['Das ist eine Blume.', 'That is a flower.'],
      ['Welche Farbe hat die Blume?', 'What colour is the flower?'],
      ['Die Blume ist rot.', 'The flower is red.'],
    ],
    'You already know colour words. Use old words in a new place.',
    'Find a flower in a picture or outside with a grown-up. Describe its colour without picking it.',
    'Try Die Blume ist gelb. (The flower is yellow.)',
  ],
  [
    'Happy birthday!',
    [
      ['Alles Gute zum Geburtstag!', 'Happy birthday!'],
      ['Vielen Dank!', 'Thank you very much!'],
      ['Wie alt bist du?', 'How old are you?'],
      ['Ich bin acht Jahre alt.', 'I am eight years old.'],
    ],
    'German says I am eight years old, just like English. Pretend ages are fine.',
    'Throw a pretend birthday party for a toy. Give it a new age.',
    'Try Ich bin sieben Jahre alt. (I am seven years old.) or neun (nine).',
  ],
  [
    'A present for you',
    [
      ['Ist das für mich?', 'Is that for me?'],
      ['Ja, das ist für dich.', 'Yes, that is for you.'],
      ['Was ist in der Schachtel?', 'What is in the box?'],
      ['Ein Ball! Danke schön!', 'A ball! Thank you very much!'],
    ],
    'Für mich means for me; für dich means for you. Point to help remember.',
    'Put a safe toy in a box. Give it as a pretend present using German.',
    'Try Ein Buch! Danke schön! (A book! Thank you very much!)',
  ],
  [
    'Let’s make a wish',
    [
      ['Was wünschst du dir?', 'What would you like as a present?'],
      ['Ich wünsche mir ein Buch.', 'I would like a book.'],
      ['Magst du Geschichten?', 'Do you like stories?'],
      ['Ja, ich mag Geschichten.', 'Yes, I like stories.'],
    ],
    'Ich wünsche mir… is a whole phrase for saying what you wish for.',
    'Draw a pretend wish list. Ask a partner about one thing on theirs.',
    'Try Ich wünsche mir einen Ball. (I would like a ball.)',
  ],
  [
    'Meet someone new',
    [
      ['Hallo! Wie heißt du?', 'Hello! What is your name?'],
      ['Ich heiße Mia. Und du?', 'My name is Mia. And you?'],
      [
        'Ich heiße Ben. Was spielst du gern?',
        'My name is Ben. What do you like to play?',
      ],
      ['Ich spiele gern Fußball.', 'I like playing football.'],
    ],
    'You can join two short sentences to keep a conversation going.',
    'Have a toy meet a new friend. Change the name and the favourite game without reading.',
    'Use a different name and Verstecken (hide-and-seek).',
  ],
  [
    'My little café chat',
    [
      ['Hallo! Was möchtest du?', 'Hello! What would you like?'],
      ['Ich möchte Wasser, bitte.', 'I would like water, please.'],
      ['Und einen Apfel?', 'And an apple?'],
      ['Ja, bitte. Vielen Dank!', 'Yes, please. Thank you very much!'],
    ],
    'Listen for the main meaning. You do not need to understand every new word to reply.',
    'Run a pretend café. The grown-up changes the offered snack so you need to listen.',
    'Swap Wasser for Milch (milk), or say Nein, danke.',
  ],
  [
    'Let’s make a plan',
    [
      ['Möchtest du mitspielen?', 'Would you like to join in?'],
      ['Ja, ich spiele gern mit.', 'Yes, I would be happy to join in.'],
      ['Gehen wir in den Park?', 'Shall we go to the park?'],
      ['Ja! Was spielen wir?', 'Yes! What shall we play?'],
    ],
    'A question of your own keeps the chat going. Asking someone to repeat is always okay.',
    'Plan a pretend playdate. Add a greeting, a game, and one question of your own.',
    'Try Spielen wir Verstecken? (Shall we play hide-and-seek?)',
  ],
];
export const lessons: Lesson[] = rows.map((r, i) => ({
  id: i + 1,
  world: Math.floor(i / 3),
  title: r[0],
  phrases: r[1].map(([de, en]) => ({ de, en })),
  tip: r[2],
  mission: r[3],
  swap: r[4],
}));
export const sources = [
  {
    title: 'Goethe-Institut: A1 learning hours',
    url: 'https://www.goethe.de/ins/de/en/prf/prf/gzsd1/inf.html',
  },
  {
    title: 'Cambridge: short, regular child-friendly practice',
    url: 'https://www.cambridgeenglish.org/learning-english/parents-and-children/how-to-support-your-child/how-parents-can-support-english-language-learning/',
  },
  {
    title: 'Council of Europe: beginner interaction',
    url: 'https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions',
  },
  {
    title: 'Goethe-Institut: German materials for children',
    url: 'https://www.goethe.de/prj/dlp/en/teachingmaterials/series/elementary_german_activities_and_exercises/kinderkurs',
  },
];
