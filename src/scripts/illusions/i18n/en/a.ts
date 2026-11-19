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
  'кривая внизу — ваша: доля верно названных цифр при верно названной красной букве. На задержке в две-четыре позиции точность обычно проваливается: это и есть мигание внимания. Кадр в среднем длился {ms} мс.':
    'the curve below is yours: how often you named the digit, counting only runs where you got the red letter right. At a lag of two to four positions accuracy usually drops away: that is the attentional blink. Each frame lasted {ms} ms on average.',
  'какая буква была красной?': 'which letter was red?',
  'а какая цифра мелькнула после неё?': 'and which digit flashed up after it?',
  'по закону Боумы на этом удалении соседям нужно отойти примерно на {px} px, чтобы буква стала читаемой. Проверьте вторым ползунком.':
    'by Bouma’s law, at this distance the neighbours have to move about {px} px away before the letter becomes readable. Check it with the second slider.',

  /* audio */
  'низ': 'low',
  'верх': 'high',
  'играть': 'play',
  'стоп': 'stop',
  'следите за спектром: верхняя полоска гаснет ровно там, где снизу вступает новая.':
    'watch the spectrum: the top bar fades out exactly where a new one comes in at the bottom.',
  'доля разгоняется без конца. Расписание считается наперёд по часам звукового движка; направление и скорость меняются со следующего круга.':
    'the beat keeps speeding up without end. The schedule is worked out ahead of time on the audio engine’s clock; direction and speed change from the next cycle.',
  'доля замедляется без конца. Расписание считается наперёд по часам звукового движка; направление и скорость меняются со следующего круга.':
    'the beat keeps slowing down without end. The schedule is worked out ahead of time on the audio engine’s clock; direction and speed change from the next cycle.',
  'медленно': 'slow',
  'быстро': 'fast',
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
  'задержка {ms} мс: у щелчков здесь проходит порог эха. Многие уже слышат вторую копию справа отдельно.':
    'delay {ms} ms: for clicks, this is about where the echo threshold lies. Many people already hear the second copy separately, on the right.',
  'биения: {n} в секунду': 'beats: {n} per second',
  'обычные акустические биения: они в воздухе и слышны на динамиках.':
    'ordinary acoustic beats: they happen in the air, and you can hear them over speakers.',
  'бинауральные: в каждом ухе по чистому тону, а биение возникает в голове.':
    'binaural: each ear gets a pure tone, and the beat arises inside your head.',
  'основная {f} Гц': 'fundamental {f} Hz',
  'выключите основную галочкой — и высота не дрогнет.': 'tick the box to remove the fundamental: the pitch won’t budge.',
  'разностный тон должен звучать на {f} Гц. В воздухе его нет: он появляется в нелинейности улитки.':
    'the difference tone should sound at {f} Hz. It isn’t in the air: it arises from the nonlinearity of the cochlea.',
  'разностный тон f2−f1 — {f} Гц, кубический 2f1−f2 — {c} Гц. В воздухе их нет: они появляются в нелинейности улитки. На умеренной громкости легче услышать второй.':
    'the difference tone f2−f1 is at {f} Hz, the cubic one, 2f1−f2, at {c} Hz. Neither is in the air: both arise from the nonlinearity of the cochlea. At moderate volume the second is the easier one to hear.',
  'нужна приличная громкость — но не переусердствуйте.': 'you need a fair bit of volume, but don’t overdo it.',
  'тон разрезан; в разрыве — то, что выбрано': 'the tone is cut; the gap holds whatever you chose',
  'в тишине разрыв слышен отчётливо.': 'in silence the gap is clearly audible.',
  'под громким шумом тон идёт насквозь. Его там нет.': 'under loud noise the tone carries straight through. It isn’t there.',
  'тихого шума не хватает, чтобы объяснить пропажу тона, — и разрыв снова слышен.':
    'quiet noise isn’t enough to explain where the tone went, so the gap is audible again.',
  'шум с вырезанной полосой, восемь секунд. Не снимайте наушники.': 'noise with a band cut out, eight seconds. Keep your headphones on.',
  'теперь тишина. Слабый тон где-то около {f} Гц — это и есть тон Цвикера: соседние каналы адаптировались, а вырезанный нет.':
    'now silence. A faint tone somewhere around {f} Hz is the Zwicker tone: the neighbouring channels have adapted, and the cut-out one hasn’t.',
  'гудков: {b}, вспышек: {f}. Вспышка — один кадр, около {d} мс; от расписания гудков вспышки разошлись не больше чем на {e} мс. Смотрите на красную точку — на периферии эффект сильнее.':
    'beeps: {b}, flashes: {f}. Each flash lasts one frame, about {d} ms; the flashes were at most {e} ms off the beep schedule. Look at the red dot: the effect is stronger in peripheral vision.',
  'прошли насквозь или отскочили? По картинке определить нельзя.': 'did they pass through each other or bounce off? The picture alone can’t tell you.',
  'со щелчком в момент встречи большинство видит отскок.': 'with a click at the moment they meet, most people see a bounce.',
  'щелчок далеко от момента встречи, и отскок видят реже. Чем дальше, тем слабее эффект.':
    'the click is well away from the moment they meet, and the bounce is seen less often. The further away, the weaker the effect.',
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
  'красная — менять, синяя — оставлять': 'red: switch, blue: stick',
  'три двери, за одной машина. Выбирайте.': 'three doors, a car behind one of them. Pick one.',
  'дверь {n}': 'door {n}',
  'ведущий открыл дверь {n} — она пустая. Что делаете?': 'the host has opened door {n}: a goat. What do you do?',
  'оставить': 'stick',
  'поменять': 'switch',
  'машина. Ваш счёт: оставляли {sw}/{sn}, меняли {cw}/{cn}.': 'a car. Wins so far: sticking {sw}/{sn}, switching {cw}/{cn}.',
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
  'Линде 31 год, она не замужем, говорит прямо и очень неглупа. В университете изучала философию, занималась вопросами справедливости и ходила на демонстрации. Что вероятнее?':
    'Linda is 31, single, outspoken and very bright. At university she studied philosophy, cared deeply about social justice and went on demonstrations. Which is more probable?',
  'Линда — кассир в банке': 'Linda is a bank teller',
  'Линда — кассир в банке и участвует в феминистском движении': 'Linda is a bank teller and is active in the feminist movement',
  'Множество «кассир и феминистка» целиком лежит внутри множества «кассир». Второе не может быть вероятнее первого ни при каком описании.':
    'The set ‘bank teller and feminist’ lies entirely inside the set ‘bank teller’. The second cannot be more probable than the first, whatever the description.',
  'вы выбрали то, что не может быть менее вероятным. Большинство выбирает второе.':
    'you picked the option that cannot be the less probable one. Most people pick the second.',
  'так отвечает большинство. Есть и возражение: услышав «кассир», собеседник понимает «кассир и больше ничего» — тогда это не провал логики, а нормальный разговорный вывод.':
    'that is how most people answer. There is an objection, though: on hearing ‘bank teller’, a listener takes it to mean ‘bank teller and nothing else’, and then it is not a failure of logic but an ordinary conversational inference.',
  'Насколько вы управляли лампой? От 0 до 10.': 'How much control did you have over the lamp? From 0 to 10.',
  'вы оценили своё влияние в {v} из 10. Кнопка не была подключена ни к чему: лампа всё это время зажигалась сама. Совпадений: {h} из {n}.':
    'you rated your influence at {v} out of 10. The button wasn’t connected to anything: the lamp was lighting up on its own the whole time. Presses: {n}; lit on: {h}.',
  'часы Либета: стрелка делает оборот за {s} с.': 'Libet’s clock: the hand goes round once every {s} s.',
  'теперь посчитайте вслух от 30 до 1. Не торопитесь.': 'now count aloud from 30 down to 1. Take your time.',
  'слово «{w}» было в списке?': 'was ‘{w}’ on the list?',
  'не было': 'no',
  'слова «{w}» в списке не было ни разу. Вы его помните, потому что извлечение восстанавливает смысл, а не проигрывает запись.':
    '‘{w}’ was never on the list. You remember it because recall rebuilds the meaning rather than replaying a recording.',
  'вы устояли: слова «{w}» действительно не было. Большинство его вспоминает — и уверенно.':
    'you weren’t fooled: ‘{w}’ really wasn’t there. Most people recall it, and confidently.',
  'какая картинка вам нравится больше?': 'which picture do you like more?',
  'вы выбрали эту. Почему?': 'you chose this one. Why?',
  'вам вернули ту картинку, которую вы отвергли. В исходном опыте подмену сразу замечали примерно в одном случае из восьми; в остальных люди подробно и убедительно объясняли выбор. Отчёт о собственном решении собирается задним числом — записи решения просто нет.':
    'you were handed back the picture you rejected. In the original study the swap was caught on the spot in only about one trial in eight; in the rest, people explained their choice in detail and convincingly. The account of your own decision is put together after the fact. There is simply no record of the decision itself.',
  'какая из них «буба», а какая «кики»?': 'which one is ‘bouba’ and which is ‘kiki’?',
  'слева буба, справа кики': 'bouba on the left, kiki on the right',
  'слева кики, справа буба': 'kiki on the left, bouba on the right',
  'так отвечают девять человек из десяти, в большинстве языков и систем письма. Округлым губам отвечает округлый контур, резкому взрыву — угол.':
    'nine people out of ten answer this way, across most languages and writing systems. Rounded lips go with a rounded contour, a sharp burst with a corner.',
  'необычный ответ: так отвечает примерно один из десяти. Межкультурная работа 2022 года нашла языки, в которых эффект слабее, — и это честная версия утверждения.':
    'an unusual answer: only about one person in ten gives it. A 2022 cross-cultural study found languages in which the effect is weaker, and that is the honest version of the claim.',
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
  'настоящие стрелочные часы работают лучше и стоят дешевле — это тот случай, когда экран проигрывает предмету.':
    'a real clock with a second hand works better and costs less: one of those cases where the screen loses to the real thing.',
  'мышь при этом не умеет ничего. Ощущение целиком собрано из расхождения между командой и результатом.':
    'the mouse itself can do nothing of the sort. The sensation is built entirely from the mismatch between command and result.',
  'если станет мутить — жмите «остановить» немедленно. Векция без согласованного вестибулярного сигнала — это ровно тот конфликт, от которого укачивает.':
    'if you start to feel queasy, press ‘stop’ at once. Vection without a matching vestibular signal is exactly the conflict that causes motion sickness.',
  'тяжесть': 'gravity',
  'то, что меряют отолиты': 'what the otoliths measure',
  'насколько узор вам понравился? От 0 до 10.': 'how much did you like the pattern? From 0 to 10.',
  'оценка {v} из 10. Скажем прямо: этот звук никогда не был вашим пульсом. Он шёл с частотой {bpm} в минуту, выпавшей случайно, и в опыте Валинса именно такая подмена сдвигала оценки.':
    'you gave it {v} out of 10. To be clear: that sound was never your heartbeat. It ran at {bpm} beats a minute, a rate picked at random, and in Valins’s experiment it was exactly this kind of swap that shifted the ratings.',
  'наклоны 3/8 и 2/5 отличаются примерно на градус. Глаз тут не ошибается — его просто просят различить градус.':
    'slopes of 3/8 and 2/5 differ by about a degree. The eye isn’t wrong here: it’s simply being asked to spot a single degree.',
  'узор физически есть в изображении: обманываться здесь нечему, и камера снимет его так же.':
    'the pattern is physically there in the image: there is nothing to be fooled by, and a camera would capture it just the same.',
  'согласованные {c} мс, рассогласованные {i} мс. Ваша цена помехи — {d} мс. Ошибок: {e}.':
    'congruent {c} ms, incongruent {i} ms. Your interference cost is {d} ms. Mistakes: {e}.',
  'называйте цвет чернил, а не слово: кнопкой или клавишей 1–4. Двадцать проб вперемешку.':
    'name the colour of the ink, not the word, with a button or the keys 1–4. Twenty trials, mixed.',
  'коза, машина была за дверью {c}. Ваш счёт: оставляли {sw}/{sn}, меняли {cw}/{cn}.':
    'a goat; the car was behind door {c}. Wins so far: sticking {sw}/{sn}, switching {cw}/{cn}.',
  'якорь {n}': 'anchor {n}',
  'Днепр {n}': 'Dnieper {n}',
  'вы {n}': 'you {n}',
  'кассир': 'bank teller',
  'кассир и феминистка': 'bank teller and feminist',
  'попробуйте зажигать лампу кнопкой. Пятнадцать нажатий.': 'try to switch the lamp on with the button. Fifteen presses.',
  'нажатий: {n} из 15.': 'presses: {n} of 15.',
  'где стояла стрелка, когда вы нажали? Двигайте ползунок — синяя стрелка покажет ваш ответ.':
    'where was the hand when you pressed? Move the slider: the blue hand shows your answer.',
  'ошибка этой пробы {ms} мс (плюс — вы назвали момент позже настоящего). В среднем со звуком: {a}; без звука: {b}.':
    'this trial was off by {ms} ms (plus means you placed the press later than it happened). Average with the beep: {a}; without it: {b}.',
  '{n} мс': '{n} ms',
  'проб пока нет': 'no trials yet',
  'Разница {d} мс — ваше сближение нажатия со звуком. В опытах оно положительное, но небольшое, порядка десятка миллисекунд, и на нескольких пробах его легко заглушает разброс. Кадр вашего экрана — {f} мс: точнее этого стрелку не увидеть.':
    'The difference, {d} ms, is how far the beep pulled your press towards itself. In experiments it comes out positive but small, around ten milliseconds, and over a few trials the scatter easily drowns it. One frame on your screen lasts {f} ms: you can’t see the hand more precisely than that.',
  'проба со звуком: дайте стрелке сделать оборот и нажмите пробел (или щёлкните по часам), когда захотите. Через четверть секунды прозвучит сигнал.':
    'trial with a beep: let the hand go round once, then press the space bar (or click the clock) whenever you like. A beep will sound a quarter of a second later.',
  'проба без звука: дайте стрелке сделать оборот и нажмите пробел (или щёлкните по часам), когда захотите.':
    'trial without a beep: let the hand go round once, then press the space bar (or click the clock) whenever you like.',
  'точно было': 'definitely',
  'кажется, было': 'I think so',
  'слова «{w}» в списке не было ни разу, а вы уверены, что было. Извлечение восстанавливает смысл, а не проигрывает запись, и уверенность восстанавливается вместе с ним.':
    '‘{w}’ was never on the list, yet you’re sure it was. Recall rebuilds the meaning rather than replaying a recording, and the confidence gets rebuilt along with it.',
  'это не та картинка': 'that’s not the one I picked',
  'верно: вам вернули ту картинку, которую вы отвергли, и вы это заметили. В исходном опыте так сразу получалось примерно в одном случае из восьми; в остальных люди подробно и убедительно объясняли выбор.':
    'right: you were handed back the picture you rejected, and you noticed. In the original study that happened on the spot in only about one trial in eight; in the rest, people explained their choice in detail and convincingly.',
  'какой промежуток показался длиннее?': 'which interval seemed longer?',
  'первый': 'the first',
  'одинаковые': 'the same',
  'второй': 'the second',
  'оба промежутка шли ровно по 0,4 с. По расстоянию длиннее первый — каппа-эффект предсказывает, что дольше покажется именно он.':
    'both intervals lasted exactly 0.4 s. The first covers more distance, and the kappa effect predicts that it is the one that will seem longer.',
  'оба промежутка шли ровно по 0,4 с. По расстоянию длиннее второй — каппа-эффект предсказывает, что дольше покажется именно он.':
    'both intervals lasted exactly 0.4 s. The second covers more distance, and the kappa effect predicts that it is the one that will seem longer.',
  'оба промежутка шли ровно по 0,4 с, и по расстоянию они равны. Сдвиньте среднюю вспышку к краю и посмотрите ещё раз.':
    'both intervals lasted exactly 0.4 s, and they cover the same distance. Move the middle flash towards one end and watch again.',
  'смотрите на красную точку слева, потом резко переведите взгляд на счётчик справа. Цифра, на которую попадёт взгляд, покажется дольше остальных, хотя каждая стоит ровно секунду.':
    'look at the red dot on the left, then shift your gaze quickly to the counter on the right. The digit your eyes land on will seem to stay longer than the rest, though each one lasts exactly a second.',
  'направление полёта →': 'direction of flight →',
  'сила инерции': 'inertial force',
  'разгон {a} g для отолитов неотличим от наклона назад на {d}°: они меряют сумму и разложить её на слагаемые не могут. Это не сбой обработки — сведений, чтобы различить разгон и задирание носа, в сигнале физически нет.':
    'to the otoliths, accelerating at {a} g is indistinguishable from tilting back by {d}°: they measure the sum and cannot split it into its parts. This isn’t a processing glitch: the signal physically lacks the information to tell acceleration from the nose pitching up.',
  'это ваш пульс. Послушайте его несколько секунд и посмотрите на узор.':
    'this is your heartbeat. Listen to it for a few seconds and look at the pattern.',
  'расстояния по вертикали от прямой, соединяющей углы, растянуты ×{e}. Видно: в одной раскладке «гипотенуза» прогибается внутрь, в другой выгибается наружу. Разница площадей ровно одна клетка.':
    'vertical distances from the straight line joining the corners are stretched ×{e}. Now you can see it: in one arrangement the ‘hypotenuse’ sags inwards, in the other it bulges outwards. The difference in area is exactly one cell.',
  'те же четыре части, а одна клетка пустая. Приложите линейку и растяните вертикаль: гипотенуза не прямая.':
    'the same four pieces, yet one cell is empty. Put the ruler on and stretch the vertical: the hypotenuse isn’t straight.',

  /* colourfx */
  'смотрите строго в точку в центре.': 'keep your eyes fixed on the dot in the centre.',
  'зелёное пятно там, где было красное. Никакого зелёного на экране нет.': 'a green patch where the red one was. There is no green on the screen at all.',
  'под курсором {rgb}. Проведите по обоим шарам: краска у них одна.': 'under the cursor: {rgb}. Run it over both balls: they share the same paint.',
  'цвет растекается по прозрачному диску, которого не нарисовано.': 'the colour spreads across a transparent disc that isn’t drawn anywhere.',
  'окрасилось то, что было снаружи. Область не менялась — поменялись местами линии.':
    'now the outside is tinted. The region didn’t change; the lines swapped places.',
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
  'смотрите в точку в центре пятна.': 'look at the dot in the centre of the patch.',
  'теперь отведите взгляд от экрана: посмотрите на ладонь, потом на стол, потом на дальнюю стену. Образ на сетчатке один и тот же, а размер каждый раз новый.':
    'now look away from the screen: at your palm, then the table, then the far wall. The image on the retina is the same, but its apparent size changes each time.',
  'контур никому не отдан, и прочтения меняются сами.': 'the contour belongs to neither, and the readings flip on their own.',
  'обвести круги': 'outline the circles',
  'засекли. Жмите на каждом следующем перевороте.': 'timer started. Press at every flip from now on.',
  'интервалов: {n}, в среднем {s} с. У большинства выходит от полутора до пяти.':
    'intervals: {n}, averaging {s} s. Most people get between 1.5 and 5 s.',
  'счёт сброшен.': 'count reset.',
  'столбики внизу — ваши средние по трём стимулам. Сравнение между ними и есть самое интересное.':
    'the bars below are your averages for the three stimuli. Comparing them is the most interesting part.',
  'снимок 1976 года, 43 метра на пиксель. Лицо тут видят все.': 'the 1976 image, 43 metres per pixel. Everyone sees a face here.',
  'бросок {n}. Система опознания лиц настроена так, чтобы не пропустить ни одного, — а значит, обязана иногда срабатывать впустую.':
    'pattern {n}. The face-detection system is tuned never to miss a face, which means it is bound to fire for nothing now and then.',
  'звезду заливает цвет, дополнительный к лучам, которые обвёл контур. Переключите контур на другую звезду: адаптация была одна, а цвет сменится. На экране сейчас только белое и чёрная линия.':
    'the star fills with the colour complementary to the rays the outline encloses. Switch the outline to the other star: there was only one adaptation, yet the colour changes. Right now the screen shows nothing but white and a black line.',
  'выберите контур-звезду: какую обвести, ту и зальёт последовательный образ.':
    'pick one of the star outlines: whichever one is drawn, the afterimage fills it.',
  'экран обновляется {hz} раз в секунду, диск делает {rps} об/с — {deg}° за кадр. Поворот считается по настоящим меткам времени кадров, поэтому частота экрана влияет на результат.':
    'your screen refreshes {hz} times a second and the disc turns at {rps} rev/s, {deg}° per frame. The rotation is worked out from the real frame timestamps, so the refresh rate affects what you see.',
  ' Цвета поменялись местами; какие они, у каждого своё.':
    ' The colours have swapped places; which colours they are differs from person to person.',
  'цветные отрезки почти так же темны, как чёрные, и свечение гаснет: окно по контрасту узкое.':
    'the coloured segments are almost as dark as the black ones, and the glow fades: the contrast window is narrow.',
  'цветные отрезки почти сливаются с белым фоном, и растекаться почти нечему: окно по контрасту узкое.':
    'the coloured segments almost merge with the white background, so there is hardly anything left to spread: the contrast window is narrow.',
  'внутри контура такой же белый, как снаружи, а выглядит чуть оранжевым: это и есть растекание.':
    'inside the outline the white is exactly the same as outside, yet it looks faintly orange: that is the spreading.',
  'задано {set} мс, на экране вышло {got} мс. Кадр здесь идёт {ms} мс, точнее интервал не выставить.':
    'set to {set} ms, measured on screen: {got} ms. A frame here lasts {ms} ms, so the interval can’t be set any more precisely.',
  'плашка «{name}»: пиксель {px}, краска {paint}. Двигайте освещение: пиксель меняется, краска нет.':
    'the ‘{name}’ patch: pixel {px}, paint {paint}. Move the lighting slider: the pixel changes, the paint doesn’t.',
  'фон: пиксель {px}. Наведите на плашку — покажет и пиксель, и краску.':
    'background: pixel {px}. Point at a patch to see both the pixel and the paint.',
  'белый': 'white',
  'серый': 'grey',
  'вы поставили решётку на {d}° вправо — в ту же сторону, куда была наклонена адаптирующая (+15°). Так и должно быть: настоящая вертикаль после адаптации кажется заваленной влево, и вы это компенсировали.':
    'you set the grating {d}° to the right, the same way the adapting grating was tilted (+15°). That is what should happen: after adapting, true vertical looks tilted to the left, and you compensated for it.',
  'вы поставили решётку на {d}° влево. После адаптации к +15° ожидается обратное — сдвиг вправо: если эффект был, он уже прошёл или перекрыт разбросом установки.':
    'you set the grating {d}° to the left. After adapting to +15° the opposite is expected, a shift to the right: if there was an effect, it has worn off or is lost in the scatter of your setting.',
  'объём и поясок достались вазе: она стала предметом, а профили — тёмным фоном за ней.':
    'the shading and the band go to the vase: it has become an object, and the profiles a dark background behind it.',
  'глаза и тень достались профилям: теперь лица — предметы, а ваза — просвет между ними.':
    'the eyes and the shading go to the profiles: now the faces are objects, and the vase is just the gap between them.',
  'ни за кого': 'favours neither',
  'за чёрные': 'favours black',
  'за белые': 'favours white',
  'выпуклость {c}, площадь {a}, симметрия {s}. Каждый признак тянет контур на свою сторону, побеждает сумма.':
    'convexity {c}, area {a}, symmetry {s}. Each cue pulls the contour towards its own side; the sum wins.',
  'кругов шестнадцать, и край ни одного не нарисован: внутри круга тот же узор из панелей, только сдвинутый на полпанели. Круги были здесь всё время и просто проиграли прямоугольникам конкуренцию за контур.':
    'there are sixteen circles, and not one of them has a drawn edge: inside each circle is the same pattern of panels, just shifted by half a panel. The circles were there all along; they simply lost the contest for the contour to the rectangles.',
  'куб Неккера': 'Necker cube',
  'лестница Шрёдера': 'Schröder stairs',
  'кольца': 'rings',
  'та же гора на снимке 2001 года: камера Mars Global Surveyor различает детали примерно в 30 раз мельче. Лица нет и не было.':
    'the same hill in the 2001 image: the Mars Global Surveyor camera resolves detail about 30 times finer. There is no face, and there never was.',

  /* photo */
  'клюв опущен вниз, как у птицы, которая клюёт, — утка.': 'the beak points down, like a bird pecking: a duck.',
  'уши встали торчком — кролик.': 'the ears stand straight up: a rabbit.',
  'как в оригинале: клюв и уши лежат горизонтально, и прочтение переключается само.':
    'as in the original: beak and ears lie flat, and the reading flips on its own.',
  'блоки мельче деталей лица — квантования почти нет, и маскировать нечему.':
    'the blocks are smaller than the features of the face, so there is hardly any quantisation and nothing to mask it.',
  'глаза и рот на своих местах: лицо обычное под любым углом.': 'the eyes and mouth are back in place: the face looks normal at any angle.',
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
  'прямо': 'upright',
  'вверх ногами': 'upside down',
  '{c} из {n} · {s} с': '{c} of {n} · {s} s',
  'прямо — {a} из {n} верно, вверх ногами — {b} из {n}.': 'upright: {a} of {n} correct; upside down: {b} of {n}.',
  'Переворот стоил {d} п. п.: та же перемена в перевёрнутом лице заметна хуже.':
    'Turning the faces over cost you {d} percentage points: the same change is harder to spot in an upside-down face.',
  'Вверх ногами в этот раз вышло даже лучше, на {d} п. п. На двенадцати парах случай может и такое: повторите серию.':
    'This time you actually did better upside down, by {d} percentage points. With only twelve pairs, chance can do that; try another run.',
  'Ошибок почти нет ни там, ни там: для вас эти перемены слишком заметны, и точность упёрлась в потолок. Тогда цена переворота может проявиться разве что во времени ответа.':
    'Hardly any mistakes either way: for you these changes are too easy to spot, and accuracy has hit the ceiling. If inversion costs you anything here, it can only show in how long you took.',
  'Разницы в этот раз почти нет. На двенадцати парах в каждой ориентации так бывает: повторите серию.':
    'Hardly any difference this time. With twelve pairs per orientation that happens; try another run.',
  'В среднем на ответ уходило {u} с прямо и {i} с вверх ногами.': 'An answer took you {u} s on average upright and {i} s upside down.',
  'двадцать четыре пары: оба снимка — один и тот же портрет, но в половине пар у одного из них чуть сдвинуты глаза или рот. Каждая пара на экране две с половиной секунды, половина пар перевёрнута.':
    'twenty-four pairs. Both pictures are always the same portrait, but in half the pairs one of them has the eyes or the mouth shifted slightly. Each pair stays on screen for two and a half seconds, and half of them are upside down.',
  'одно и то же или разное?': 'same or different?',
  'одно и то же': 'same',
  'разное': 'different',

  /* stereo */
  'обвести сдвинутую область': 'outline the shifted area',
  'одним глазом в этом прямоугольнике не видно ровным счётом ничего: он отличается только сдвигом между картинками.':
    'with one eye there is nothing whatsoever to see in this rectangle: it differs only in how it is shifted between the two images.',
  'красное': 'red',
  'синее': 'blue',
  'на светлом фоне порядок глубины часто переворачивается. У кого как — спрашивайте у соседа.':
    'on a light background the depth order often reverses. It varies from person to person, so ask whoever is sitting next to you.',
  'на чёрном фоне красное обычно впереди.': 'on a black background the red usually looks nearer.',
  'сведите глаза к переносице, пока две красные точки наверху не превратятся в три. Тогда в середине проступит конус.':
    'cross your eyes towards your nose until the two red dots at the top turn into three. Then a cone will emerge in the middle.',
  'смотрите как бы сквозь экран, вдаль, пока две красные точки наверху не превратятся в три. Тогда в середине проступит конус.':
    'look as if through the screen, into the distance, until the two red dots at the top turn into three. Then a cone will emerge in the middle.',
  'периодов: {n}, в среднем {s} с. Столбики — ваши периоды по порядку. Сравните с кубом Неккера: у большинства разброс интервалов там похожей формы.':
    'periods: {n}, averaging {s} s. The bars are your periods in order. Compare them with the Necker cube: for most people the spread of intervals has a similar shape there.',
  'щёлкните по картинке, чтобы пробел попадал сюда, и держите его, пока целиком видна одна картинка.':
    'click the picture so the space bar works here, then hold it down for as long as only one image is visible.',
};
