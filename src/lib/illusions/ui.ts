/* Everything the illusions pages say around the entries themselves: headings, buttons,
   the catalogue's introduction. One block per language, each written in that language
   rather than translated, the same rule as the entries. Strings marked `html` are set
   with set:html because they carry <b> and <i>. */
import type { IllLang } from './labels';

export interface IllUi {
  base: string;
  index: {
    title: string;
    description: (n: number) => string;
    h1: string;
    lede: string;
    /** html */
    framing: string[];
    note: (x: { entries: number; mods: number; withCopy: number; withDemo: number; rows: number; sources: number; generated: string }) => string;
    searchLabel: string;
    placeholder: string;
    clear: string;
    all: string;
    withDemo: string;
    badgeDemo: string;
    badgeCopy: string;
    /** one, few, many — the count under the search box */
    countForms: [string, string, string];
    empty: string;
    aboutH: string;
    /** html */
    about: string[];
  };
  entry: {
    titleSuffix: string;
    back: string;
    also: string;
    caution: string;
    what: string;
    how: string;
    twist: string;
    stub: string;
    firstH: string;
    disputed: string;
    sourcesH: string;
    noSources: string;
    flagFirst: string;
    flagPrimary: string;
    descFallback: (name: string, alt: string, cat: string) => string;
  };
  demo: {
    headphones: string;
    material: string;
    clockZero: string;
  };
}

export const UI: Record<IllLang, IllUi> = {
  ru: {
    base: '/ru/illusions/',
    index: {
      title: 'Иллюзии: каталог — Дмитрий Семенкевич',
      description: (n) => `Каталог иллюзий: ${n} записей десяти модальностей, с первоисточниками и демонстрациями, написанными с нуля.`,
      h1: 'Иллюзии',
      lede: 'Восприятие — не окно, а догадка. Обычно догадка верна, и мы её не замечаем. Иллюзия — это место, где догадку видно: там, где она ошибается, наконец понятно, из чего она была собрана.',
      framing: [
        'Это каталог. Про каждую запись он отвечает на три вопроса: <b>где её упомянули впервые</b>, <b>где посмотреть примеры</b> и <b>откуда взято то, что здесь написано</b>. Ссылки ведут на источники, а не на пересказы источников.',
        'Демонстрации написаны с нуля. Ни одна не скопирована с чужой реализации, и почти у каждой есть ручка, которая иллюзию <i>ломает</i>: объяснение, которое нельзя опровергнуть прямо на странице, — это не объяснение, а подпись к картинке.',
        'Там, где без чужой картинки не обойтись — утка-кролик 1892 года, гравюра Хогарта, снимки «Викинга», — взято только общественное достояние и CC0. Лицензия перепроверяется скриптом при каждой выгрузке, а под демонстрацией стоит подпись: кто, что, когда и на каких правах. Ни одного файла с формулировкой «вероятно, можно» здесь нет.',
      ],
      note: (x) =>
        `${x.entries} записей · ${x.mods} модальностей · ${x.withCopy} с разбором · ${x.withDemo} с демонстрацией. За ними — рабочее досье на ${x.rows} строк и ${x.sources} источников; сюда попадает только доведённая часть. Обновлено ${x.generated}.`,
      searchLabel: 'Найти иллюзию',
      placeholder: 'мюллер, кафе, шепард, 1832…',
      clear: 'сбросить',
      all: 'всё',
      withDemo: 'с демонстрацией',
      badgeDemo: 'демо',
      badgeCopy: 'разбор',
      countForms: ['запись', 'записи', 'записей'],
      empty: 'Ничего не нашлось. Попробуйте по-английски — многие записи известны только под английским именем.',
      aboutH: 'Чего здесь нет',
      about: [
        'Собрать все иллюзии невозможно: их придумывают быстрее, чем каталогизируют, и «одна иллюзия» — вопрос вкуса, а не факта. Поэтому каталог собран по категориям, а не по экземплярам. Иллюзия формы, проделанная с треугольником, квадратом и ромбом, — это одна запись, а не три.',
        'На уровне категорий вопрос о полноте уже осмысленный. Проверка — сетка Ричарда Грегори: что именно не так с восприятием (двойственность, искажение, парадокс, вымысел) против того, где вошла ошибка (оптика, сигналы, правила, знание). Шестнадцать клеток. Все шестнадцать заполнены.',
        'Дальше начинается спорное. Каталогу показалось, что сетке не хватает пятой строки — для случаев, где восприятие не добавляет лишнего, а <i>вычитает</i> существующее: угасание Трокслера, слепота к изменениям, вызванная движением слепота. Проверка на предшественников это опровергла: класс описан давно и называется иначе — psychophysical blinding у Кима и Блейка, 2005. Так же закончились ещё три догадки.',
        'Это нормальный исход, и он записан здесь намеренно. Каталог, который печатает только удачные ходы, — реклама, а не каталог.',
      ],
    },
    entry: {
      titleSuffix: 'Иллюзии — Дмитрий Семенкевич',
      back: '← каталог',
      also: 'Также',
      caution: 'Осторожно.',
      what: 'Что видно',
      how: 'Как это работает',
      twist: 'Отдельно стоит знать',
      stub: 'Разбора на русском пока нет — его пишут руками, по одной записи за раз, и до этой очередь ещё не дошла. Всё, что каталог про неё знает, ниже: кто описал первым, где и откуда это известно. Ради этого каталог и собирался.',
      firstH: 'Где упомянута впервые',
      disputed: 'Приоритет оспаривается: в литературе встречаются разные даты и разные имена. Здесь стоит та версия, под которой есть проверяемая ссылка.',
      sourcesH: 'Откуда это известно',
      noSources: 'Источники по этой записи ещё не выверены.',
      flagFirst: 'первое упоминание',
      flagPrimary: 'первоисточник',
      descFallback: (name, alt, cat) => `${name} (${alt}) — ${cat}. Первоисточник и литература в каталоге иллюзий dimhold.by.`,
    },
    demo: {
      headphones: 'Нужны наушники: на динамиках это другой стимул, и иллюзии там нет.',
      material: 'материал',
      clockZero: '0,0 с',
    },
  },

  en: {
    base: '/illusions/',
    index: {
      title: 'Illusions: a catalogue · Dmitriy Semenkevich',
      description: (n) => `A catalogue of ${n} illusions across ten modalities, traced back to their original sources, with demos built from scratch.`,
      h1: 'Illusions',
      lede: 'Perception is less a window than a guess. Usually the guess is right, and we never notice it being made. An illusion is where it shows: in the places where the guess goes wrong, you can at last see what it was assembled from.',
      framing: [
        'This is a catalogue. For each entry it answers three questions: <b>where it was first mentioned</b>, <b>where to see it for yourself</b> and <b>where the claims on this page come from</b>. The links point to the sources themselves rather than to someone’s retelling of them.',
        'The demos are written from scratch. None is copied from anyone else’s code, and nearly all of them have a control that <i>breaks</i> the illusion. An explanation you can’t put to the test on the page is only a caption.',
        'Some pictures had to be borrowed: the 1892 duck-rabbit, the Hogarth engraving, the Viking images of Mars. For those, only public-domain and CC0 material is used. A script rechecks every licence each time the files are fetched, and every demo carries a credit line saying who made what, when, and under what terms. Nothing here rests on ‘probably fine’.',
      ],
      note: (x) =>
        `${x.entries} entries · ${x.mods} modalities · ${x.withCopy} with a write-up · ${x.withDemo} with a demo. Behind them is a working dossier of ${x.rows} rows and ${x.sources} sources, and only the finished part makes it onto this page. Updated ${x.generated}.`,
      searchLabel: 'Find an illusion',
      placeholder: 'müller, café, shepard, 1832…',
      clear: 'clear',
      all: 'all',
      withDemo: 'with a demo',
      badgeDemo: 'demo',
      badgeCopy: 'write-up',
      countForms: ['entry', 'entries', 'entries'],
      empty: 'Nothing found. Try another spelling or an older name: many illusions are known by more than one.',
      aboutH: 'What isn’t here',
      about: [
        'No catalogue can hold every illusion. New ones are invented faster than anyone can list them, and what counts as ‘one illusion’ is a matter of taste rather than fact. So this one is organised by kind, not by specimen: a shape illusion drawn with a triangle, a square and a rhombus is one entry, not three.',
        'Once you count kinds, asking whether the list is complete becomes a fair question. The test used here is Richard Gregory’s grid, which crosses what is wrong with the percept (ambiguity, distortion, paradox, fiction) with where the error crept in (optics, signals, rules, knowledge). That makes sixteen cells, and all sixteen are filled.',
        'This is where it gets contentious. The catalogue seemed to show that the grid lacked a fifth row, for cases where perception, instead of adding something that isn’t there, <i>subtracts</i> something that is: Troxler fading, change blindness, motion-induced blindness. A search for prior work put an end to that. The class had already been described under another name, psychophysical blinding (Kim and Blake, 2005). Three more hunches went the same way.',
        'That is a normal outcome, and it is recorded here on purpose. A catalogue that prints only its successes is advertising.',
      ],
    },
    entry: {
      titleSuffix: 'Illusions · Dmitriy Semenkevich',
      back: '← catalogue',
      also: 'Also known as',
      caution: 'Caution.',
      what: 'What happens',
      how: 'How it works',
      twist: 'Worth knowing',
      stub: 'There’s no English write-up for this entry yet. Each one is written by hand, one at a time, and this one’s turn hasn’t come. Everything the catalogue knows about it is below: who described it first, where, and how we know. That part is the reason the catalogue exists.',
      firstH: 'Where it was first mentioned',
      disputed: 'Priority is disputed: different sources give different dates and different names. The version shown here is the one backed by a reference you can check.',
      sourcesH: 'How we know',
      noSources: 'The sources for this entry haven’t been verified yet.',
      flagFirst: 'first mention',
      flagPrimary: 'primary source',
      descFallback: (name, alt, cat) => `${name} (${cat}): where it was first mentioned and what has been written on it, from the dimhold.by catalogue of illusions.`,
    },
    demo: {
      headphones: 'You’ll need headphones: over speakers the stimulus changes and the illusion disappears.',
      material: 'image credit',
      clockZero: '0.0 s',
    },
  },

  be: {
    base: '/be/illusions/',
    index: {
      title: 'Ілюзіі: каталог — Дзмітрый Семенкевіч',
      description: (n) => `Каталог ілюзій: ${n} запісаў з дзесяці мадальнасцей, з першакрыніцамі і з дэманстрацыямі, напісанымі з нуля.`,
      h1: 'Ілюзіі',
      lede: 'Успрыманне — не акно, а здагадка. Звычайна здагадка слушная, і мы яе проста не заўважаем. Ілюзія — тое месца, дзе яе відаць: там, дзе здагадка памыляецца, нарэшце бачна, з чаго яна была складзена.',
      framing: [
        'Гэта каталог. Пра кожную ілюзію ён адказвае на тры пытанні: <b>дзе яе ўпершыню згадалі</b>, <b>дзе яе паглядзець</b> і <b>адкуль узята тое, што тут напісана</b>. Спасылкі вядуць на самі крыніцы, а не на іх пераказы.',
        'Дэманстрацыі напісаныя з нуля. Ніводная не спісаная з чужога кода, і амаль у кожнай ёсць рычажок, які ілюзію <i>ламае</i>. Тлумачэнне, якое нельга праверыць і абвергнуць тут жа, на старонцы, — гэта не тлумачэнне, а подпіс пад малюнкам.',
        'Дзе без чужога малюнка не абысціся (качка-трус 1892 года, гравюра Хогарта, здымкі «Вікінга»), выкарыстаныя толькі матэрыялы з грамадскага набытку або пад CC0. Скрыпт пераправярае ліцэнзіі пры кожнай выгрузцы, а пад кожнай дэманстрацыяй ёсць подпіс: хто, што, калі і на якіх правах. Ніводнага файла на ўмовах «здаецца, можна» тут няма.',
      ],
      note: (x) =>
        `${x.entries} запісаў · ${x.mods} мадальнасцей · ${x.withCopy} з разборам · ${x.withDemo} з дэманстрацыяй. За імі стаіць працоўнае дасье на ${x.rows} радкоў і ${x.sources} крыніц; сюды трапляе толькі тое, што даведзена да ладу. Абноўлена ${x.generated}.`,
      searchLabel: 'Знайсці ілюзію',
      placeholder: 'мюлер, качка, шэпард, 1832…',
      clear: 'ачысціць',
      all: 'усе',
      withDemo: 'з дэманстрацыяй',
      badgeDemo: 'дэма',
      badgeCopy: 'разбор',
      countForms: ['запіс', 'запісы', 'запісаў'],
      empty: 'Нічога не знайшлося. Паспрабуйце па-англійску: шмат якія ілюзіі вядомыя толькі пад англійскай назвай.',
      aboutH: 'Чаго тут няма',
      about: [
        'Сабраць усе ілюзіі немагчыма. Новыя прыдумваюць хутчэй, чым іх паспяваюць апісаць, а што лічыць «адной ілюзіяй» — справа густу, а не факту. Таму каталог складзены па катэгорыях, а не па асобніках: ілюзія формы, паказаная на трохкутніку, квадраце і ромбе, — адзін запіс, а не тры.',
        'Калі лічыць катэгорыі, пытанне пра паўнату ўжо мае сэнс. Правяраем па сетцы Рычарда Грэгары: што менавіта не так з успрыманнем (двухсэнсоўнасць, скажэнне, парадокс, выдумка) і дзе ўкралася памылка (оптыка, сігналы, правілы, веды). Шаснаццаць клетак. Запоўненыя ўсе шаснаццаць.',
        'Далей пачынаецца спрэчнае. Каталогу здалося, што ў сетцы не хапае пятага радка — для выпадкаў, калі ўспрыманне не дадае лішняга, а <i>адымае</i> тое, што ёсць: згасанне Трокслера, слепата да змен, слепата, выкліканая рухам. Пошук папярэднікаў гэтую думку абверг: такі клас даўно апісаны пад іншай назвай — psychophysical blinding у Кіма і Блэйка, 2005. Гэтак жа скончыліся яшчэ тры здагадкі.',
        'Гэта звычайны вынік, і тут ён запісаны наўмысна. Каталог, які друкуе толькі ўдалыя хады, — рэклама, а не каталог.',
      ],
    },
    entry: {
      titleSuffix: 'Ілюзіі — Дзмітрый Семенкевіч',
      back: '← каталог',
      also: 'Іншыя назвы',
      caution: 'Асцярожна.',
      what: 'Што відаць',
      how: 'Як гэта працуе',
      twist: 'Варта ведаць яшчэ',
      stub: 'Разбору па-беларуску пакуль няма. Разборы пішуць уручную, па адным запісе, і да гэтага чарга яшчэ не дайшла. Усё, што каталог ведае пра гэтую ілюзію, — ніжэй: хто апісаў яе першым, дзе і адкуль гэта вядома. Дзеля гэтага каталог і збіраўся.',
      firstH: 'Дзе ўпершыню згадана',
      disputed: 'Першынства спрэчнае: у літаратуры трапляюцца розныя даты і розныя імёны. Тут пададзена тая версія, за якой стаіць спасылка, што можна праверыць.',
      sourcesH: 'Адкуль гэта вядома',
      noSources: 'Крыніцы для гэтага запісу яшчэ не правераныя.',
      flagFirst: 'першая згадка',
      flagPrimary: 'першакрыніца',
      descFallback: (name, alt, cat) => `${name} (${alt}) — ${cat}. Першакрыніца і літаратура ў каталогу ілюзій dimhold.by.`,
    },
    demo: {
      headphones: 'Патрэбныя навушнікі: праз дынамікі стымул ужо іншы, і ілюзіі няма.',
      material: 'матэрыял',
      clockZero: '0,0 с',
    },
  },
};
