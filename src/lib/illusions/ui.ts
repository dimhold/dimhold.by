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
      description: (n) => `A catalogue of ${n} illusions across ten senses and modes, each with its first source and a demo built from scratch.`,
      h1: 'Illusions',
      lede: 'Perception is not a window. It is a guess. Most of the time the guess is right and we never notice it. An illusion is where the guess shows: where it goes wrong, you can finally see what it was made of.',
      framing: [
        'This is a catalogue. For every entry it answers three questions: <b>where it was first described</b>, <b>where to see it</b> and <b>where the text here comes from</b>. The links go to the sources themselves, not to retellings of them.',
        'The demos are written from scratch. None is copied from someone else’s code, and nearly every one has a control that <i>breaks</i> the illusion. An explanation you cannot test on the page is not an explanation. It is a caption.',
        'Where a borrowed picture cannot be avoided, like the 1892 duck-rabbit, the Hogarth engraving or the Viking photographs, only public domain and CC0 material is used. A script rechecks every licence on each export, and every demo says who made what, when, and on what terms. Nothing here is “probably fine”.',
      ],
      note: (x) =>
        `${x.entries} entries · ${x.mods} modalities · ${x.withCopy} written up · ${x.withDemo} with a demo. Behind them sits a working dossier of ${x.rows} rows and ${x.sources} sources; only the finished part makes it here. Updated ${x.generated}.`,
      searchLabel: 'Find an illusion',
      placeholder: 'müller, café, shepard, 1832…',
      clear: 'clear',
      all: 'all',
      withDemo: 'with a demo',
      badgeDemo: 'demo',
      badgeCopy: 'notes',
      countForms: ['entry', 'entries', 'entries'],
      empty: 'Nothing found. Try another spelling: many entries go by a name that is not English.',
      aboutH: 'What is not here',
      about: [
        'Collecting every illusion is impossible. New ones are invented faster than anyone can list them, and what counts as “one illusion” is a matter of taste. So the catalogue is built by category, not by specimen. A shape illusion done with a triangle, a square and a rhombus is one entry, not three.',
        'At the level of categories, asking whether the list is complete starts to make sense. The test is Richard Gregory’s grid: what is wrong with the percept (ambiguity, distortion, paradox, fiction) against where the error came in (optics, signals, rules, knowledge). Sixteen cells. All sixteen are filled.',
        'Then it gets contentious. The catalogue thought the grid was missing a fifth row, for cases where perception does not add something false but <i>takes away</i> something real: Troxler fading, change blindness, motion-induced blindness. A search for prior work killed the idea. The class was described long ago under another name, psychophysical blinding, by Kim and Blake in 2005. Three more hunches ended the same way.',
        'That is a normal outcome, and it is written down here on purpose. A catalogue that prints only its good moves is an advert, not a catalogue.',
      ],
    },
    entry: {
      titleSuffix: 'Illusions · Dmitriy Semenkevich',
      back: '← catalogue',
      also: 'Also',
      caution: 'Caution.',
      what: 'What you see',
      how: 'How it works',
      twist: 'Worth knowing',
      stub: 'There are no English notes for this one yet. They are written by hand, one entry at a time, and this entry’s turn has not come. Everything the catalogue knows about it is below: who described it first, where, and how we know. That is what the catalogue was built for.',
      firstH: 'First described',
      disputed: 'Priority is disputed: the literature gives different dates and different names. The version shown is the one with a reference that can be checked.',
      sourcesH: 'How we know',
      noSources: 'The sources for this entry have not been checked yet.',
      flagFirst: 'first mention',
      flagPrimary: 'primary source',
      descFallback: (name, alt, cat) => `${name}: ${cat}. First source and literature in the dimhold.by catalogue of illusions.`,
    },
    demo: {
      headphones: 'Headphones needed: through speakers the stimulus is different and the illusion is gone.',
      material: 'material',
      clockZero: '0.0 s',
    },
  },

  be: {
    base: '/be/illusions/',
    index: {
      title: 'Ілюзіі: каталог — Дзмітрый Семенкевіч',
      description: (n) => `Каталог ілюзій: ${n} запісаў дзесяці мадальнасцей, з першакрыніцамі і дэманстрацыямі, напісанымі з нуля.`,
      h1: 'Ілюзіі',
      lede: 'Успрыманне — не акно, а здагадка. Звычайна здагадка правільная, і мы яе не заўважаем. Ілюзія — гэта месца, дзе здагадку відаць: там, дзе яна памыляецца, нарэшце зразумела, з чаго яна была складзеная.',
      framing: [
        'Гэта каталог. Пра кожны запіс ён адказвае на тры пытанні: <b>дзе яго ўпершыню згадалі</b>, <b>дзе паглядзець прыклады</b> і <b>адкуль узята тое, што тут напісана</b>. Спасылкі вядуць на крыніцы, а не на пераказы крыніц.',
        'Дэманстрацыі напісаныя з нуля. Ніводная не скапіяваная з чужой рэалізацыі, і амаль у кожнай ёсць ручка, якая ілюзію <i>ломіць</i>: тлумачэнне, якое нельга абвергнуць проста на старонцы, — не тлумачэнне, а подпіс да малюнка.',
        'Там, дзе без чужога малюнка не абысціся, — качка-трус 1892 года, гравюра Хогарта, здымкі «Вікінга», — узята толькі грамадскае здабытка і CC0. Ліцэнзію скрыпт пераправярае пры кожнай выгрузцы, а пад дэманстрацыяй стаіць подпіс: хто, што, калі і на якіх правах. Ніводнага файла з фармулёўкай «мабыць, можна» тут няма.',
      ],
      note: (x) =>
        `${x.entries} запісаў · ${x.mods} мадальнасцей · ${x.withCopy} з разборам · ${x.withDemo} з дэманстрацыяй. За імі — працоўнае дасье на ${x.rows} радкоў і ${x.sources} крыніц; сюды трапляе толькі дарабіцая частка. Абноўлена ${x.generated}.`,
      searchLabel: 'Знайсці ілюзію',
      placeholder: 'мюлер, кавярня, шэпард, 1832…',
      clear: 'скінуць',
      all: 'усё',
      withDemo: 'з дэманстрацыяй',
      badgeDemo: 'дэма',
      badgeCopy: 'разбор',
      countForms: ['запіс', 'запісы', 'запісаў'],
      empty: 'Нічога не знайшлося. Паспрабуйце па-англійску — многія запісы вядомыя толькі пад англійскай назвай.',
      aboutH: 'Чаго тут няма',
      about: [
        'Сабраць усе ілюзіі немагчыма: іх прыдумваюць хутчэй, чым каталагізуюць, і «адна ілюзія» — пытанне густу, а не факту. Таму каталог складзены па катэгорыях, а не па асобніках. Ілюзія формы, зробленая з трохкутнікам, квадратам і ромбам, — гэта адзін запіс, а не тры.',
        'На ўзроўні катэгорый пытанне пра паўнату ўжо мае сэнс. Праверка — сетка Рычарда Грэгары: што менавіта не так з успрыманнем (двайнасць, скажэнне, парадокс, выдумка) супраць таго, дзе ўвайшла памылка (оптыка, сігналы, правілы, веды). Шаснаццаць клетак. Усе шаснаццаць запоўненыя.',
        'Далей пачынаецца спрэчнае. Каталогу падалося, што сетцы не хапае пятага радка — для выпадкаў, дзе ўспрыманне не дадае лішняга, а <i>адымае</i> існае: згасанне Трокслера, слепата да змен, выкліканая рухам слепата. Праверка на папярэднікаў гэта абвергла: клас апісаны даўно і называецца інакш — psychophysical blinding у Кіма і Блэйка, 2005. Гэтак жа скончыліся яшчэ тры здагадкі.',
        'Гэта нармальны вынік, і ён запісаны тут наўмысна. Каталог, які друкуе толькі ўдалыя хады, — рэклама, а не каталог.',
      ],
    },
    entry: {
      titleSuffix: 'Ілюзіі — Дзмітрый Семенкевіч',
      back: '← каталог',
      also: 'Таксама',
      caution: 'Асцярожна.',
      what: 'Што відаць',
      how: 'Як гэта працуе',
      twist: 'Асобна варта ведаць',
      stub: 'Разбору па-беларуску пакуль няма — яго пішуць рукамі, па адным запісе за раз, і да гэтага чарга яшчэ не дайшла. Усё, што каталог пра яго ведае, ніжэй: хто апісаў першым, дзе і адкуль гэта вядома. Дзеля гэтага каталог і збіраўся.',
      firstH: 'Дзе згаданая ўпершыню',
      disputed: 'Прыярытэт аспрэчваецца: у літаратуры сустракаюцца розныя даты і розныя імёны. Тут стаіць тая версія, пад якой ёсць спасылка, што можна праверыць.',
      sourcesH: 'Адкуль гэта вядома',
      noSources: 'Крыніцы па гэтым запісе яшчэ не выверены.',
      flagFirst: 'першая згадка',
      flagPrimary: 'першакрыніца',
      descFallback: (name, alt, cat) => `${name} (${alt}) — ${cat}. Першакрыніца і літаратура ў каталогу ілюзій dimhold.by.`,
    },
    demo: {
      headphones: 'Патрэбныя навушнікі: праз дынамікі гэта іншы стымул, і ілюзіі там няма.',
      material: 'матэрыял',
      clockZero: '0,0 с',
    },
  },
};
