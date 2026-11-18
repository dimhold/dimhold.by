/* Строки демонстраций (en), часть a. Ключ — русский текст из модуля демонстрации.
   Модули: audio, cognition, colourfx, photo, attention, stereo. */
export const EN_A: Record<string, string> = {
  /* общее */
  '{s} с': '{s} s',
  'остановлено.': 'stopped.',
  'убрать обводку': 'hide the outline',

  /* attention */
  'остановить': 'stop',
  'начать': 'start',
  'что-то на картинке исчезает и появляется. Ищите.': 'something in the picture keeps vanishing and coming back. Find it.',
  'искали {s} с. Предмет обведён — и он крупный, и он в середине кадра.':
    'you searched for {s} s. The object is now outlined: it’s large, and right in the middle of the frame.',
  'задержка между целями →': 'lag between targets →',
  'кривая внизу — ваша. На задержке в две-четыре позиции точность проваливается: это и есть мигание внимания.':
    'the curve below is yours. At a lag of two to four positions accuracy drops away: that is the attentional blink.',
  'какая буква шла после красной?': 'which letter came after the red one?',
  'по закону Боумы на этом удалении соседям нужно отойти примерно на {px} px, чтобы буква стала читаемой. Проверьте вторым ползунком.':
    'by Bouma’s law, at this distance the neighbours have to move about {px} px away before the letter becomes readable. Check it with the second slider.',

  /* audio */
  'низ': 'low',
  'верх': 'high',
  'играть': 'play',
  'стоп': 'stop',
  'следите за спектром: верхняя полоска гаснет ровно там, где снизу вступает новая.':
    'watch the spectrum: the top bar fades out exactly where a new one comes in at the bottom.',
  'доля разгоняется без конца. Расписание считается наперёд по часам звукового движка, иначе на загруженной странице всё рассыпается.':
    'the beat keeps speeding up without end. The schedule is worked out ahead of time on the audio engine’s clock; otherwise, on a busy page, it all falls apart.',
  'второй тон выше или ниже первого?': 'is the second tone higher or lower than the first?',
  'выше': 'higher',
  'ниже': 'lower',
  'три раза подряд «выше» — и через три шага по четыре полутона вы вернулись в исходную ноту. Ваши собственные ответы образуют кольцо: «выше» перестало быть отношением порядка.':
    '‘higher’ three times in a row, and after three steps of four semitones you are back on the note you started from. Your own answers form a circle: ‘higher’ has stopped being an ordering.',
  'ответы разошлись — так тоже бывает, окно у этого стимула узкое. Попробуйте ещё круг.':
    'your answers were mixed. That happens: this stimulus has a narrow window. Try another round.',
  '{n} из 3. Жмите дальше.': '{n} of 3. Keep going.',
  'красное — «вверх», синее — «вниз»': 'red: ‘up’, blue: ‘down’',
  'пара пошла вверх или вниз?': 'did the pair go up or down?',
  'вверх': 'up',
  'вниз': 'down',
  '{n} из 12. Круг внизу — ваш.': '{n} of 12. The circle below is yours.',
  'круг заполнен. У кого-то он повёрнут ровно наоборот — и это зависит от языка и говора, на которых человек вырос.':
    'the circle is full. For some people it is turned exactly the other way, and that depends on the language and dialect they grew up with.',
  'большинство слышит один тон, скачущий из уха в ухо, и высота при этом чередуется.':
    'most people hear a single tone hopping from ear to ear, its pitch alternating as it goes.',
  'каналы поменяны местами. Большинство слушателей не слышит никакой разницы — и вот это самое поразительное.':
    'the channels have been swapped. Most listeners hear no difference at all, and that is the most striking part.',
  'сначала низкий тон слева, потом высокий справа. Если слышно иначе — наушники надеты наоборот.':
    'first a low tone on the left, then a high one on the right. If you hear it the other way round, your headphones are on back to front.',
  'слышно две ровные мелодии, каждая чисто из своего уха.': 'you hear two smooth melodies, each one cleanly in its own ear.',
  'в одиночку этот канал даёт рваную скачущую последовательность — ровно ту, что там и записана. Она прямо противоречит тому, что вы только что слышали двумя ушами.':
    'on its own this channel plays a jagged, leaping sequence, exactly what is recorded there. It flatly contradicts what you just heard with both ears.',
  'обе копии почти одновременны — звук в середине головы.': 'the two copies are almost simultaneous: the sound is in the middle of your head.',
  'задержка {ms} мс: звук целиком слева, откуда пришёл первым, — даже если правая копия громче.':
    'delay {ms} ms: the sound sits entirely on the left, where it arrived first, even if the right-hand copy is louder.',
  'за порогом эха звук распадается на два.': 'past the echo threshold the sound splits in two.',
  'биения: {n} в секунду': 'beats: {n} per second',
  'обычные акустические биения: они в воздухе и слышны на динамиках.':
    'ordinary acoustic beats: they happen in the air, and you can hear them over speakers.',
  'бинауральные: в каждом ухе по чистому тону, а биение возникает в голове.':
    'binaural: each ear gets a pure tone, and the beat arises inside your head.',
  'основная {f} Гц': 'fundamental {f} Hz',
  'выключите основную галочкой — и высота не дрогнет.': 'tick the box to remove the fundamental: the pitch won’t budge.',
  'разностный тон должен звучать на {f} Гц. В воздухе его нет: он появляется в нелинейности улитки.':
    'the difference tone should sound at {f} Hz. It isn’t in the air: it arises from the nonlinearity of the cochlea.',
  'нужна приличная громкость — но не переусердствуйте.': 'you need a fair bit of volume, but don’t overdo it.',
  'тон разрезан; в разрыве — то, что выбрано': 'the tone is cut; the gap holds whatever you chose',
  'в тишине разрыв слышен отчётливо.': 'in silence the gap is clearly audible.',
  'под громким шумом тон идёт насквозь. Его там нет.': 'under loud noise the tone carries straight through. It isn’t there.',
  'тихого шума не хватает, чтобы объяснить пропажу тона, — и разрыв снова слышен.':
    'quiet noise isn’t enough to explain where the tone went, so the gap is audible again.',
  'шум с вырезанной полосой, восемь секунд. Не снимайте наушники.': 'noise with a band cut out, eight seconds. Keep your headphones on.',
  'теперь тишина. Слабый тон где-то около {f} Гц — это и есть тон Цвикера: соседние каналы адаптировались, а вырезанный нет.':
    'now silence. A faint tone somewhere around {f} Hz is the Zwicker tone: the neighbouring channels have adapted, and the cut-out one hasn’t.',
  'гудков: {b}, вспышек: {f}. Смотрите на красную точку — на периферии эффект сильнее.':
    'beeps: {b}, flashes: {f}. Look at the red dot: the effect is stronger in peripheral vision.',
  'прошли насквозь или отскочили? По картинке определить нельзя.': 'did they pass through each other or bounce off? The picture alone can’t tell you.',
  'со щелчком в момент встречи они отскакивают, и однозначно.': 'with a click at the moment they meet, they unmistakably bounce.',
  'щелчок далеко от момента встречи — и он больше ничего не решает. Окно узкое.':
    'the click is far from the moment they meet, and it no longer decides anything. The window is narrow.',
  'панорама звука не менялась. Источник поехал за картинкой, а не за звуком.':
    'the sound’s panning hasn’t changed. The source moved with the picture, not with the sound.',

  /* cognition */
  'это столкновение: причину видно так же прямо, как цвет.': 'this is a collision: you see the cause as directly as you see colour.',
  'причинность вытекла: два несвязанных события, и никакое знание её не возвращает.':
    'the causality has drained away: two unrelated events, and no amount of knowing brings it back.',
  'причинность слабеет.': 'the causality is weakening.',
  'что здесь произошло? Опишите своими словами.': 'what happened here? Describe it in your own words.',
  'почти никто не описывает это геометрическими словами.': 'almost nobody describes this in geometric terms.',
  'красный': 'red',
  'синий': 'blue',
  'зелёный': 'green',
  'жёлтый': 'yellow',
  'согласованные {c} мс, рассогласованные {i} мс. Ваша цена помехи — {d} мс.':
    'congruent {c} ms, incongruent {i} ms. Your interference cost is {d} ms.',
  'называйте цвет чернил, а не слово. Двадцать проб.': 'name the colour of the ink, not the word. Twenty trials.',
  'красная — менять, синяя — оставлять': 'red: switch, blue: stick',
  'три двери, за одной машина. Выбирайте.': 'three doors, a car behind one of them. Pick one.',
  'дверь {n}': 'door {n}',
  'ведущий открыл дверь {n} — она пустая. Что делаете?': 'the host has opened door {n}: a goat. What do you do?',
  'оставить': 'stick',
  'поменять': 'switch',
  'машина. Ваш счёт: оставляли {sw}/{sn}, меняли {cw}/{cn}.': 'a car. Wins so far: sticking {sw}/{sn}, switching {cw}/{cn}.',
  'коза. Ваш счёт: оставляли {sw}/{sn}, меняли {cw}/{cn}.': 'a goat. Wins so far: sticking {sw}/{sn}, switching {cw}/{cn}.',
  'на десяти тысячах партий: оставлять — {st} %, менять — {sw} %.': 'over 10,000 games: sticking wins {st}%, switching {sw}%.',
  '{n} км': '{n} km',
  'Длина Днепра больше или меньше {n} км?': 'Is the Dnieper longer or shorter than {n} km?',
  'больше': 'longer',
  'меньше': 'shorter',
  'А сколько именно, по-вашему?': 'And how long exactly, would you say?',
  'км': 'km',
  'ответить': 'answer',
  'вы ответили {g} км. Число {a}, которое вы видели до вопроса, выпало вам случайно и к Днепру отношения не имеет — а оценки тех, кому выпало другое, систематически другие. Настоящая длина — 2201 км.':
    'you answered {g} km. The number {a} you saw before the question was drawn at random and has nothing to do with the Dnieper, yet people who drew a different number give systematically different estimates. The real length is 2,201 km.',
  'Лине 31 год, она не замужем, говорит прямо и очень неглупа. В университете изучала философию, занималась вопросами справедливости и ходила на демонстрации. Что вероятнее?':
    'Linda is 31, single, outspoken and very bright. At university she studied philosophy, cared deeply about social justice and went on demonstrations. Which is more probable?',
  'Лина — кассир в банке': 'Linda is a bank teller',
  'Лина — кассир в банке и участвует в феминистском движении': 'Linda is a bank teller and is active in the feminist movement',
  'Множество «кассир и феминистка» целиком лежит внутри множества «кассир». Второе не может быть вероятнее первого ни при каком описании.':
    'The set ‘bank teller and feminist’ lies entirely inside the set ‘bank teller’. The second cannot be more probable than the first, whatever the description.',
  'вы выбрали то, что не может быть менее вероятным. Большинство выбирает второе.':
    'you picked the option that cannot be the less probable one. Most people pick the second.',
  'так отвечает большинство. Есть и возражение: услышав «кассир», собеседник понимает «кассир и больше ничего» — тогда это не провал логики, а нормальный разговорный вывод.':
    'that is how most people answer. There is an objection, though: on hearing ‘bank teller’, a listener takes it to mean ‘bank teller and nothing else’, and then it is not a failure of logic but an ordinary conversational inference.',
  'Насколько вы управляли лампой? От 0 до 10.': 'How much control did you have over the lamp? From 0 to 10.',
  'вы оценили своё влияние в {v} из 10. Кнопка не была подключена ни к чему: лампа всё это время зажигалась сама. Совпадений: {h} из {n}.':
    'you rated your influence at {v} out of 10. The button wasn’t connected to anything: the lamp was lighting up on its own the whole time. Presses: {n}; lit on: {h}.',
  'нажмите пробел в любой момент — через четверть секунды прозвучит сигнал.':
    'press the space bar whenever you like: a beep will sound a quarter of a second later.',
  'часы Либета: стрелка делает оборот за {s} с.': 'Libet’s clock: the hand goes round once every {s} s.',
  'где стояла стрелка, когда вы нажали?': 'where was the hand when you pressed?',
  'ваша оценка разошлась с настоящим моментом на {ms} мс. При произвольном действии оценка обычно сдвигается позже, а оценка звука — раньше: они сближаются.':
    'your estimate was {ms} ms off the real moment. For a voluntary action the estimate usually shifts later, and the estimate of the beep shifts earlier: the two draw together.',
  'теперь посчитайте вслух от 30 до 1. Не торопитесь.': 'now count aloud from 30 down to 1. Take your time.',
  'слово «{w}» было в списке?': 'was ‘{w}’ on the list?',
  'было': 'yes',
  'не было': 'no',
  'слова «{w}» в списке не было ни разу. Вы его помните, потому что извлечение восстанавливает смысл, а не проигрывает запись.':
    '‘{w}’ was never on the list. You remember it because recall rebuilds the meaning rather than replaying a recording.',
  'вы устояли: слова «{w}» действительно не было. Большинство его вспоминает — и уверенно.':
    'you weren’t fooled: ‘{w}’ really wasn’t there. Most people recall it, and confidently.',
  'какая картинка вам нравится больше?': 'which picture do you like more?',
  'вы выбрали эту. Почему?': 'you chose this one. Why?',
  'вам вернули ту картинку, которую вы отвергли. Подмену замечает примерно один человек из восьми; остальные объясняют выбор подробно и убедительно. Отчёт о собственном решении собирается задним числом — записи решения просто нет.':
    'you were handed back the picture you rejected. Only about one person in eight notices the swap; the rest explain their choice in detail and convincingly. The account of your own decision is put together after the fact. There is simply no record of the decision itself.',
  'какая из них «буба», а какая «кики»?': 'which one is ‘bouba’ and which is ‘kiki’?',
  'слева буба, справа кики': 'bouba on the left, kiki on the right',
  'слева кики, справа буба': 'kiki on the left, bouba on the right',
  'так отвечают девять человек из десяти, в большинстве языков и систем письма. Округлым губам отвечает округлый контур, резкому взрыву — угол.':
    'nine people out of ten answer this way, across most languages and writing systems. Rounded lips go with a rounded contour, a sharp burst with a corner.',
  'необычный ответ: так отвечает примерно один из десяти. Межкультурная работа 2022 года нашла языки, в которых эффект слабее, — и это честная версия утверждения.':
    'an unusual answer: only about one person in ten gives it. A 2022 cross-cultural study found languages in which the effect is weaker, and that is the honest version of the claim.',
  'интервалы по времени равны — по 0,4 с. Если средняя вспышка стоит не посередине, они перестают быть равными на слух и на глаз.':
    'the time intervals are equal: 0.4 s each. If the middle flash isn’t halfway along, they stop looking equal.',
  'сколько длился красный квадрат по сравнению с кругами?': 'how long did the red square last compared with the circles?',
  'дольше': 'longer',
  'столько же': 'the same',
  'короче': 'shorter',
  'все кадры шли ровно по 400 мс, включая красный. Внимание ускоряет обработку, а больше обработки читается как больше времени.':
    'every frame lasted exactly 400 ms, the red one included. Attention speeds up processing, and more processing reads as more time.',
  'вы устояли. Большинство говорит «дольше» — все кадры шли ровно по 400 мс.':
    'you weren’t fooled. Most people say ‘longer’, but every frame lasted exactly 400 ms.',
  'попыток: {n}, средний промах {d} px по ходу движения. Систематический сдвиг вперёд — это и есть инерция представления.':
    'attempts: {n}, average miss {d} px in the direction of motion. A systematic forward shift is representational momentum.',
  'запомните, где он остановился, и щёлкните там.': 'remember where it stopped and click there.',
  'смотрите на красную точку слева, потом резко переведите взгляд на счётчик справа. Первая цифра простоит дольше секунды.':
    'look at the red dot on the left, then shift your gaze quickly to the counter on the right. The first digit will stay up for longer than a second.',
  'настоящие стрелочные часы работают лучше и стоят дешевле — это тот случай, когда экран проигрывает предмету.':
    'a real clock with a second hand works better and costs less: one of those cases where the screen loses to the real thing.',
  'мышь при этом не умеет ничего. Ощущение целиком собрано из расхождения между командой и результатом.':
    'the mouse itself can do nothing of the sort. The sensation is built entirely from the mismatch between command and result.',
  'если станет мутить — жмите «остановить» немедленно. Векция без согласованного вестибулярного сигнала — это ровно тот конфликт, от которого укачивает.':
    'if you start to feel queasy, press ‘stop’ at once. Vection without a matching vestibular signal is exactly the conflict that causes motion sickness.',
  'тяжесть': 'gravity',
  'ускорение': 'acceleration',
  'то, что меряют отолиты': 'what the otoliths measure',
  'отолиты меряют сумму и разложить её на слагаемые не могут. Это не сбой обработки: сведений, чтобы различить разгон и задирание носа, в сигнале физически нет.':
    'the otoliths measure the sum and cannot split it into its parts. This isn’t a processing glitch: the signal physically lacks the information to tell acceleration from the nose pitching up.',
  'послушайте несколько секунд и посмотрите на узор.': 'listen for a few seconds and look at the pattern.',
  'насколько узор вам понравился? От 0 до 10.': 'how much did you like the pattern? From 0 to 10.',
  'оценка {v} из 10. Скажем прямо: этот звук никогда не был вашим пульсом. Он шёл с частотой {bpm} в минуту, выпавшей случайно, и в опыте Валинса именно такая подмена сдвигала оценки.':
    'you gave it {v} out of 10. To be clear: that sound was never your heartbeat. It ran at {bpm} beats a minute, a rate picked at random, and in Valins’s experiment it was exactly this kind of swap that shifted the ratings.',
  'при растянутой вертикали видно: гипотенуза изгибается в одну сторону и в другую. Разница площадей ровно одна клетка.':
    'with the vertical stretched you can see it: the hypotenuse bends one way and then the other. The difference in area is exactly one cell.',
  'наклоны 3/8 и 2/5 отличаются примерно на градус. Глаз тут не ошибается — его просто просят различить градус.':
    'slopes of 3/8 and 2/5 differ by about a degree. The eye isn’t wrong here: it’s simply being asked to spot a single degree.',
  'узор физически есть в изображении: обманываться здесь нечему, и камера снимет его так же.':
    'the pattern is physically there in the image: there is nothing to be fooled by, and a camera would capture it just the same.',

  /* colourfx */
  'смотрите строго в точку в центре.': 'keep your eyes fixed on the dot in the centre.',
  'зелёное пятно там, где было красное. Никакого зелёного на экране нет.': 'a green patch where the red one was. There is no green on the screen at all.',
  'цвета поменялись местами. У разных людей они разные — это одна из самых наглядных иллюзий, которая у каждого своя.':
    'the colours have swapped places. They differ from person to person: this is one of the clearest illusions that everyone sees differently.',
  'частота обновления вашего экрана здесь влияет на результат: вращение считается по настоящим меткам времени кадров.':
    'your screen’s refresh rate affects the result here: the rotation is computed from the real frame timestamps.',
  'под курсором {rgb}. Проведите по обоим шарам: краска у них одна.': 'under the cursor: {rgb}. Run it over both balls: they share the same paint.',
  'окно по контрасту узкое, и здесь эффект схлопнулся.': 'the contrast window is narrow, and here the effect has collapsed.',
  'цвет растекается по прозрачному диску, которого не нарисовано.': 'the colour spreads across a transparent disc that isn’t drawn anywhere.',
  'окрасилось то, что было снаружи. Область не менялась — поменялись местами линии.':
    'now the outside is tinted. The region didn’t change; the lines swapped places.',
  'кадр здесь идёт {ms} мс, значит интервал выставляется с такой же точностью, не лучше.':
    'a frame here lasts {ms} ms, so the interval can only be set that precisely, no better.',
  'если считать свет тёплым, вычесть надо желтизну — и ткань выйдет синей с чёрным.':
    'if the light is taken to be warm, yellow has to be subtracted, and the fabric comes out blue and black.',
  'если считать свет холодным дневным, вычитается синева — и та же ткань выходит белой с золотым.':
    'if the light is taken to be cool daylight, blue gets subtracted, and the same fabric comes out white and gold.',
  'здесь освещение неоднозначно, и системе не на чем остановиться.': 'here the lighting is ambiguous, and the system has nothing to settle on.',
  'краска у каждой плашки одна и та же во всём диапазоне. Меняется только множитель освещения — а цвета вы всё равно называете правильно.':
    'each patch keeps the same paint across the whole range. Only the lighting multiplier changes, yet you still name the colours correctly.',
  'смотрите в красную точку, не отводя взгляд.': 'look at the red dot and don’t look away.',
  'теперь выставьте решётку в вертикаль и нажмите «проверить».': 'now set the grating to vertical and press ‘check’.',
  'ровно ноль — последействия у вас не осталось или оно уже прошло.': 'exactly zero: either you have no aftereffect left or it has already worn off.',
  'ваша ошибка {d}° вправо. Адаптация шла на +15°, и отклонение должно быть в противоположную сторону.':
    'your error: {d}° to the right. You adapted to +15°, so the error should go the opposite way.',
  'ваша ошибка {d}° влево. Адаптация шла на +15°, и отклонение должно быть в противоположную сторону.':
    'your error: {d}° to the left. You adapted to +15°, so the error should go the opposite way.',
  'смотрите в точку в центре пятна.': 'look at the dot in the centre of the patch.',
  'теперь отведите взгляд от экрана: посмотрите на ладонь, потом на стол, потом на дальнюю стену. Образ на сетчатке один и тот же, а размер каждый раз новый.':
    'now look away from the screen: at your palm, then the table, then the far wall. The image on the retina is the same, but its apparent size changes each time.',
  'контур отдан вазе — лиц больше нет.': 'the contour goes to the vase: the faces are gone.',
  'контур отдан профилям — вазы больше нет.': 'the contour goes to the profiles: the vase is gone.',
  'контур никому не отдан, и прочтения меняются сами.': 'the contour belongs to neither, and the readings flip on their own.',
  'каждый ползунок тянет контур на свою сторону. Побеждает сумма, а не один признак.':
    'each slider pulls the contour towards its own side. The sum wins, not any single cue.',
  'обвести круги': 'outline the circles',
  'круги были нарисованы теми же отрезками всё это время. Они просто проиграли конкуренцию за владение контуром.':
    'the circles were drawn by those same segments all along. They simply lost the contest for ownership of the contour.',
  'засекли. Жмите на каждом следующем перевороте.': 'timer started. Press at every flip from now on.',
  'интервалов: {n}, в среднем {s} с. У большинства выходит от полутора до пяти.':
    'intervals: {n}, averaging {s} s. Most people get between 1.5 and 5 s.',
  'счёт сброшен.': 'count reset.',
  'столбики внизу — ваши средние по трём стимулам. Сравнение между ними и есть самое интересное.':
    'the bars below are your averages for the three stimuli. Comparing them is the most interesting part.',
  'та же гора при вчетверо большем разрешении: лица нет и не было.': 'the same hill at four times the resolution: there is no face, and there never was.',
  'снимок 1976 года, 43 метра на пиксель. Лицо тут видят все.': 'the 1976 image, 43 metres per pixel. Everyone sees a face here.',
  'бросок {n}. Система опознания лиц настроена так, чтобы не пропустить ни одного, — а значит, обязана иногда срабатывать впустую.':
    'pattern {n}. The face-detection system is tuned never to miss a face, which means it is bound to fire for nothing now and then.',

  /* photo */
  'клюв встал горизонтально — утка.': 'the beak is horizontal: a duck.',
  'уши легли назад — кролик.': 'the ears lie back: a rabbit.',
  'ровно — и переключается само.': 'balanced: it flips on its own.',
  'обведён клюв.': 'the beak is outlined.',
  'те же два отростка — уши, а вмятина справа — рот.': 'the same two protrusions are ears, and the dent on the right is a mouth.',
  'ухо': 'ear',
  'подбородок': 'chin',
  'глаз': 'eye',
  'нос': 'nose',
  'молодая отвернулась: то, что обведено, — ухо и подбородок.': 'the young woman is turned away: what’s outlined is her ear and chin.',
  'те же две области у старухи — глаз и кончик носа. Линии одни и те же.':
    'on the old woman the same two areas are an eye and the tip of a nose. The lines are identical.',
  'подробности срезаны — и вместо дамы у зеркала виден череп.': 'the detail is cut away, and instead of a lady at her mirror you see a skull.',
  'добавили размытия — и лицо проступило. Размытие срезало ложные края, которые внесло квантование.':
    'add some blur and the face emerges. The blur removed the false edges that the quantisation introduced.',
  'блоки добавили высоких частот, которых в лице не было. Они и маскируют.':
    'the blocks added high frequencies that were never in the face. That is what masks it.',
  'под курсором {rgb} — красноватый.': 'under the cursor: {rgb}, reddish.',
  'под курсором {rgb} — не красный: зелёного и синего в нём больше.': 'under the cursor: {rgb}. Not red: there is more green and blue in it.',
  '{s} с до узнавания. Второй раз этот секундомер на этой картинке уже не запустить: найденная организация применяется дальше автоматически.':
    '{s} s to recognition. You can’t run this stopwatch on this picture a second time: the organisation you found is now applied automatically.',
  'вверх ногами — почти нормальное лицо.': 'upside down: an almost normal face.',
  'прямо — и это гримаса. Пиксели те же самые.': 'upright, it’s a grimace. The pixels are exactly the same.',
  'где-то здесь у большинства и появляется гримаса.': 'somewhere around here, for most people, the grimace appears.',
  'лица прямо': 'faces upright',
  'лица вверх ногами': 'faces inverted',
  'дома прямо': 'houses upright',
  'дома вверх ногами': 'houses inverted',
  '{p} % / {ms} мс': '{p}% / {ms} ms',
  'цена переворота: у лиц {f} п. п., у домов {h}. Если первое заметно больше второго, вы только что воспроизвели Йина.':
    'cost of inversion: faces {f} pp, houses {h} pp. If the first is clearly bigger than the second, you have just replicated Yin.',
  'одно и то же или разное?': 'same or different?',
  'одно и то же': 'same',
  'разное': 'different',

  /* stereo */
  'обвести сдвинутую область': 'outline the shifted area',
  'одним глазом в этом прямоугольнике не видно ровным счётом ничего: он отличается только сдвигом между картинками.':
    'with one eye there is nothing whatsoever to see in this rectangle: it differs only in how it is shifted between the two images.',
  'сведите глаза так, чтобы две красные точки наверху слились в три. Тогда в середине проступит конус.':
    'cross your eyes until the two red dots at the top merge into three. Then a cone will emerge in the middle.',
  'периодов: {n}, в среднем {s} с. Сравните с вашим же кубом Неккера — форма распределения у них одинаковая.':
    'periods: {n}, averaging {s} s. Compare them with your own Necker cube: the distributions have the same shape.',
  'красное': 'red',
  'синее': 'blue',
  'на светлом фоне порядок глубины часто переворачивается. У кого как — спрашивайте у соседа.':
    'on a light background the depth order often reverses. It varies from person to person, so ask whoever is sitting next to you.',
  'на чёрном фоне красное обычно впереди.': 'on a black background the red usually looks nearer.',
};
