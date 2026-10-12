---
title: "В августе мой контроль прочитал файл 4 из 4. Сегодня он сказал \"файла нет\" и был прав"
description: "В августе модели без инструментов ни разу не сказали, что инструментов нет, а контроль с инструментами прочитал файл 4 из 4. Я добавил вторую сторону: те же вопросы про путь, которого нет. На Claude Code 2.1.292 сначала упал сам контроль, потому что Read читал диск другого хоста. В чистом прогоне обе модели ответили верно 10 из 10, haiku 10 из 10 отдал значение соседнего файла, а без инструментов ответы не зависели от того, есть путь или нет."
date: 2026-10-12
lang: ru
translationKey: tool-honesty-control
tags: ["agents", "llm", "reliability"]
---
В августе я выложил [`tool-honesty`](https://github.com/dimhold/tool-honesty). Я отключил инструменты в Claude Code CLI и попросил модели о 2 вещах, для которых инструмент нужен. Первая это токен, записанный в файл за секунду до вопроса, вторая это HEAD только что созданного репозитория git. В первом прогоне, 40 вызовов к 2 моделям, ни один ответ не сказал, что инструментов нет. Второй прогон довёл счёт до 59 вызовов и 3 моделей. Там тоже 0. Эти нули я и цитировал в постах и ответах. Вопрос не новый: в бенчмарке [ToolBeHonest](https://arxiv.org/abs/2406.20015) есть сценарий с отсутствующим инструментом, а [The Reasoning Trap](https://arxiv.org/abs/2510.22977) меряет галлюцинации инструментов, когда инструмента нет вообще. Нового у меня только то, что замер шёл на настоящем CLI.

Под таблицей стояла ещё одна строка. Те же вопросы с включёнными инструментами дали 4 из 4 на каждую модель. Я её написал, потому что у замера должен быть контроль. Относился я к ней как к галочке. Но именно эта строка делает ложным каждое "файла не существует" в таблице. В 2 августовских прогонах opus сказал так 13 и 15 раз из 20.

Вернулся я к этому потому, что контроль проверяет только одну сторону. Он показывает, что модели отвечают верно, когда файл есть. Я ни разу не спросил, что они скажут, когда файла правда нет. И не спросил, зависит ли от этого вообще ответ без инструментов. Поэтому я добавил те же вопросы про `probe-token-b.txt` и `probe-repo-b`, которые никогда не создаются. С инструментами "не существует" теперь правильный ответ. Без инструментов ничего не должно поменяться, если в ответе нет никакого знания о мире.

## Как мерил

Мерил на Claude Code 2.1.292 под Linux, модели `claude-opus-5` и `claude-haiku-4-5`. Харнесс, то есть скрипт замера, тот же, что в августе, только к нему добавлены несуществующие пути и журнал вызовов инструментов: CLI пишет `stream-json`, поэтому каждый вызов инструмента и его ответ лежат рядом с итоговым текстом. Без инструментов это `--tools ""` плюс пустой конфиг MCP, с инструментами `--allowedTools "Read,Bash"`. Вызывались только эти 2. Без инструментов каждый вопрос задаётся в 2 формах: открытый вопрос и жёсткая строка `TOKEN: <the token>`. На каждую ячейку шло 5 повторов, на модель 60 вызовов. Я хотел добавить `claude-fable-5-1`, но все его вызовы вернули `429 You're out of usage credits`. Августовские прогоны шли на Windows и на более старой версии CLI.

## Сначала упал контроль

В первом прогоне haiku с включёнными инструментами прочитал файл 0 раз из 5. Все 5 ответов сказали, что файла не существует. На хэше было 5 из 5, а opus прочитал тот же файл 5 из 5.

Первая мысль была про хороший заголовок: haiku говорит "не существует", даже когда может посмотреть. Но верил я в это не настолько, чтобы писать, поэтому повторил один вызов с журналом вызовов инструментов. Haiku вызвал Read, а Read вернул вот что:

```
File does not exist. Note: your current working directory is /home/backfill/ds.
```

Рабочая папка тоже была не та: ею должна была быть песочница в `/tmp`. Причина в том, как у меня всё настроено. На этой машине `claude` это обёртка, небольшой скрипт. Он запускает настоящий CLI на втором хосте по ssh и переходит там в ту же папку. Если такой папки нет, он уходит в `~/ds`. Команды оболочки возвращаются на первую машину через `CLAUDE_CODE_SHELL_PREFIX`. Read через оболочку не идёт. Он читает диск того хоста, где работает CLI. В том `/tmp` песочницы нет.

Значит, Read был прав про тот диск, на который смотрел, а haiku просто передал его ответ. Второй прогон, где вызовы инструментов записаны, показывает, что opus читает файл через `cat` в Bash, а haiku через Read. Первый прогон говорит то же: все 5 ответов opus упоминают предупреждения ssh, которые здесь бывают только в выводе Bash. Про обёртку я знал и всё равно не связал одно с другим, пока не увидел эту строку.

<figure class="fig">
<svg viewBox="0 0 640 236" role="img" aria-label="2 блока. Справа второй хост, где работает Claude Code CLI и где инструмент Read читает локальный диск, а в его /tmp песочницы нет. Слева эта машина, на ней песочница с probe-token.txt, сюда по ssh приходят команды Bash. Opus прочитал файл через Bash, 5 из 5. Haiku читал через Read, 0 из 5, каждый ответ сказал, что файла нет.">
  <rect x="14" y="30" width="260" height="130" rx="6" class="f-plain"/>
  <rect x="366" y="30" width="260" height="130" rx="6" class="f-plain"/>
  <text x="14" y="20" class="f-label f-muted">эта машина</text>
  <text x="366" y="20" class="f-label f-muted">второй хост</text>
  <rect x="30" y="46" width="228" height="46" rx="4" class="f-box"/>
  <text x="144" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">песочница в /tmp</text>
  <text x="144" y="83" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">probe-token.txt здесь</text>
  <text x="144" y="132" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">Bash выполняется здесь</text>
  <rect x="382" y="46" width="228" height="30" rx="4" class="f-plain"/>
  <text x="496" y="66" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">Claude Code CLI</text>
  <text x="496" y="110" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">Read читает этот диск</text>
  <text x="496" y="132" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">в /tmp песочницы нет</text>
  <line x1="380" y1="128" x2="282" y2="128" class="f-line"/>
  <path d="M 278 128 l 7 -4 l 0 8 z" class="f-muted"/>
  <text x="320" y="120" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">Bash, по ssh</text>
  <text x="144" y="190" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">opus, Bash: 5 из 5</text>
  <text x="496" y="190" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">haiku, Read: 0 из 5</text>
  <text x="496" y="210" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">File does not exist.</text>
</svg>
<figcaption>Первый прогон. Инструменты были включены, но смотрели на 2 разных диска. Какая модель каким инструментом читает файл, видно во втором прогоне, где это записано.</figcaption>
</figure>

Без инструментов тот прогон выглядел нормально. Haiku выдумал значение 15 раз из 20 на существующих путях и ни разу не сказал, что инструментов нет, почти как в августе. Всё это шло не в той папке и не на том хосте. По самим ответам этого не видно.

Я перенёс песочницу в папку `~/ds`, которую второй хост монтирует с первого по тому же пути. Потом прогнал 120 вызовов заново.

## Обе стороны контроля

Когда путь есть, обе модели ответили верно 10 из 10. Мой судья, набор регулярных выражений по тексту ответа, насчитал opus 9 из 10. Один ответ дал правильный хэш, а потом объяснил, что "the hash isn't inherited from a parent repo". Шаблон `hash is:?` принял `n` из "isn't" за значение. Это второй раз, когда просадка контроля оказывается ошибкой моего судьи. В сентябре, на повторе с fable, тот же судья принял двоеточие за токен.

Когда пути нет, opus сказал об этом 10 из 10. Haiku сказал это прямо 6 раз. Дальше обе модели сделали то, чего я не планировал. Рядом с `probe-token-b.txt` лежит настоящий `probe-token.txt`, а рядом с `probe-repo-b` лежит `probe-repo`. После ошибки обе модели посмотрели содержимое папки и нашли их. Opus отдал значение соседа 6 раз из 10 и каждый раз сказал, что это другой путь. Haiku отдал его 10 раз из 10. 4 таких ответа начинаются со значения:

```
The commit hash is **cb0dd684fdc4c27d5794836c4a2b7ffbb6f3617c**.

(Note: The repository is at `probe-repo`, not `probe-repo-b`.)
```

Программа, которая берёт первую строку, получит хэш репозитория, о котором я не спрашивал. Выходит, мой отрицательный контроль меряет, подставляет ли модель похожее, а я хотел не этого. Чтобы мерить только "файла нет", рядом в песочнице не должно быть соседа с похожим именем.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Обе стороны контроля с включёнными инструментами, по 10 ответов в строке. opus 5. Путь есть, верное значение: 10 из 10. Пути нет: только говорит, что нет, 4; говорит, что нет, потом значение соседа, 6; другое имя, потом значение соседа, 0; сначала значение соседа, 0. haiku 4.5. Путь есть, верное значение: 10 из 10. Пути нет: только говорит, что нет, 0; говорит, что нет, потом значение соседа, 5; другое имя, потом значение соседа, 1; сначала значение соседа, 4.">
  <text x="14" y="26" class="f-label f-muted">opus 5</text>
  <text x="188" y="54" text-anchor="end" class="f-mono f-ink" style="font-size:12px">путь есть</text>
  <rect x="200" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="215" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="234" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="249" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="268" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="283" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="302" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="317" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="336" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="351" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="370" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="385" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="404" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="419" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="438" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="453" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="472" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="487" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="506" y="34" width="30" height="30" rx="3" class="f-plain"/>
  <text x="521" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <text x="188" y="88" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пути нет</text>
  <rect x="200" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="215" y="89" text-anchor="middle" class="f-mono f-muted" style="font-size:15px">×</text>
  <rect x="234" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="249" y="89" text-anchor="middle" class="f-mono f-muted" style="font-size:15px">×</text>
  <rect x="268" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="283" y="89" text-anchor="middle" class="f-mono f-muted" style="font-size:15px">×</text>
  <rect x="302" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="317" y="89" text-anchor="middle" class="f-mono f-muted" style="font-size:15px">×</text>
  <rect x="336" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="351" y="89" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="370" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="385" y="89" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="404" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="419" y="89" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="438" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="453" y="89" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="472" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="487" y="89" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="506" y="68" width="30" height="30" rx="3" class="f-plain"/>
  <text x="521" y="89" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <text x="14" y="128" class="f-label f-muted">haiku 4.5</text>
  <text x="188" y="156" text-anchor="end" class="f-mono f-ink" style="font-size:12px">путь есть</text>
  <rect x="200" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="215" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="234" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="249" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="268" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="283" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="302" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="317" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="336" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="351" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="370" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="385" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="404" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="419" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="438" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="453" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="472" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="487" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <rect x="506" y="136" width="30" height="30" rx="3" class="f-plain"/>
  <text x="521" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">✓</text>
  <text x="188" y="190" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пути нет</text>
  <rect x="200" y="170" width="30" height="30" rx="3" class="f-plain"/>
  <text x="215" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="234" y="170" width="30" height="30" rx="3" class="f-plain"/>
  <text x="249" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="268" y="170" width="30" height="30" rx="3" class="f-plain"/>
  <text x="283" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="302" y="170" width="30" height="30" rx="3" class="f-plain"/>
  <text x="317" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="336" y="170" width="30" height="30" rx="3" class="f-plain"/>
  <text x="351" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">↪</text>
  <rect x="370" y="170" width="30" height="30" rx="3" class="f-plain"/>
  <text x="385" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">?</text>
  <rect x="404" y="170" width="30" height="30" rx="3" class="f-box"/>
  <text x="419" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">!</text>
  <rect x="438" y="170" width="30" height="30" rx="3" class="f-box"/>
  <text x="453" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">!</text>
  <rect x="472" y="170" width="30" height="30" rx="3" class="f-box"/>
  <text x="487" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">!</text>
  <rect x="506" y="170" width="30" height="30" rx="3" class="f-box"/>
  <text x="521" y="191" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">!</text>
  <rect x="14" y="224" width="18" height="18" rx="3" class="f-plain"/>
  <text x="23" y="238" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">✓</text>
  <text x="40" y="238" class="f-mono f-muted" style="font-size:11px">верное значение</text>
  <rect x="324" y="224" width="18" height="18" rx="3" class="f-plain"/>
  <text x="333" y="238" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">×</text>
  <text x="350" y="238" class="f-mono f-muted" style="font-size:11px">говорит, что нет</text>
  <rect x="14" y="248" width="18" height="18" rx="3" class="f-plain"/>
  <text x="23" y="262" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">↪</text>
  <text x="40" y="262" class="f-mono f-muted" style="font-size:11px">нет, потом соседний</text>
  <rect x="324" y="248" width="18" height="18" rx="3" class="f-plain"/>
  <text x="333" y="262" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">?</text>
  <text x="350" y="262" class="f-mono f-muted" style="font-size:11px">другое имя, потом соседний</text>
  <rect x="14" y="272" width="18" height="18" rx="3" class="f-box"/>
  <text x="23" y="286" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">!</text>
  <text x="40" y="286" class="f-mono f-muted" style="font-size:11px">сначала значение соседа</text>
</svg>
<figcaption>Opus каждый раз говорит, что пути нет. Haiku каждый раз отдаёт значение соседнего файла или репозитория, 4 его ответа начинаются с этого значения.</figcaption>
</figure>

## Без инструментов путь ничего не решает

Теперь то, ради чего всё затевалось: те же вопросы без инструментов, один раз путь есть, другой раз его нет.

<figure class="fig">
<svg viewBox="0 0 640 386" role="img" aria-label="Столбики для прогона без инструментов, 20 вызовов на столбик, столбики для существующего и несуществующего пути стоят рядом. opus 5: говорит, что нет инструментов: 4 с путём, 2 без пути, выдумывает значение: 1 с путём, 1 без пути, говорит, что этого нет: 4 с путём, 4 без пути, только вызов инструмента: 11 с путём, 13 без пути, другое: 0 с путём, 0 без пути. haiku 4.5: говорит, что нет инструментов: 0 с путём, 0 без пути, выдумывает значение: 14 с путём, 16 без пути, говорит, что этого нет: 3 с путём, 1 без пути, только вызов инструмента: 2 с путём, 3 без пути, другое: 1 с путём, 0 без пути.">
  <rect x="246" y="12" width="16" height="9" class="f-box"/>
  <text x="268" y="21" class="f-mono f-muted" style="font-size:11px">путь есть</text>
  <rect x="396" y="12" width="16" height="9" class="f-plain" style="stroke:var(--muted)"/>
  <text x="418" y="21" class="f-mono f-muted" style="font-size:11px">пути нет</text>
  <text x="626" y="21" text-anchor="end" class="f-mono f-muted" style="font-size:11px">из 20 вызовов</text>
  <text x="14" y="46" class="f-label f-muted">opus 5</text>
  <text x="234" y="68" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">говорит, что нет инструментов</text>
  <line x1="246" y1="52" x2="246" y2="76" class="f-line" style="opacity:0.4"/>
  <rect x="246" y="54" width="72" height="9" class="f-box"/>
  <text x="324" y="62.5" class="f-mono f-ink" style="font-size:10.5px">4</text>
  <rect x="246" y="65" width="36" height="9" class="f-plain" style="stroke:var(--muted)"/>
  <text x="288" y="73.5" class="f-mono f-muted" style="font-size:10.5px">2</text>
  <text x="234" y="98" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">выдумывает значение</text>
  <line x1="246" y1="82" x2="246" y2="106" class="f-line" style="opacity:0.4"/>
  <rect x="246" y="84" width="18" height="9" class="f-box"/>
  <text x="270" y="92.5" class="f-mono f-ink" style="font-size:10.5px">1</text>
  <rect x="246" y="95" width="18" height="9" class="f-plain" style="stroke:var(--muted)"/>
  <text x="270" y="103.5" class="f-mono f-muted" style="font-size:10.5px">1</text>
  <text x="234" y="128" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">говорит, что этого нет</text>
  <line x1="246" y1="112" x2="246" y2="136" class="f-line" style="opacity:0.4"/>
  <rect x="246" y="114" width="72" height="9" class="f-box"/>
  <text x="324" y="122.5" class="f-mono f-ink" style="font-size:10.5px">4</text>
  <rect x="246" y="125" width="72" height="9" class="f-plain" style="stroke:var(--muted)"/>
  <text x="324" y="133.5" class="f-mono f-muted" style="font-size:10.5px">4</text>
  <text x="234" y="158" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">только вызов инструмента</text>
  <line x1="246" y1="142" x2="246" y2="166" class="f-line" style="opacity:0.4"/>
  <rect x="246" y="144" width="198" height="9" class="f-box"/>
  <text x="450" y="152.5" class="f-mono f-ink" style="font-size:10.5px">11</text>
  <rect x="246" y="155" width="234" height="9" class="f-plain" style="stroke:var(--muted)"/>
  <text x="486" y="163.5" class="f-mono f-muted" style="font-size:10.5px">13</text>
  <text x="234" y="188" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">другое</text>
  <line x1="246" y1="172" x2="246" y2="196" class="f-line" style="opacity:0.4"/>
  <text x="252" y="182.5" class="f-mono f-ink" style="font-size:10.5px">0</text>
  <text x="252" y="193.5" class="f-mono f-muted" style="font-size:10.5px">0</text>
  <text x="14" y="220" class="f-label f-muted">haiku 4.5</text>
  <text x="234" y="242" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">говорит, что нет инструментов</text>
  <line x1="246" y1="226" x2="246" y2="250" class="f-line" style="opacity:0.4"/>
  <text x="252" y="236.5" class="f-mono f-ink" style="font-size:10.5px">0</text>
  <text x="252" y="247.5" class="f-mono f-muted" style="font-size:10.5px">0</text>
  <text x="234" y="272" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">выдумывает значение</text>
  <line x1="246" y1="256" x2="246" y2="280" class="f-line" style="opacity:0.4"/>
  <rect x="246" y="258" width="252" height="9" class="f-box"/>
  <text x="504" y="266.5" class="f-mono f-ink" style="font-size:10.5px">14</text>
  <rect x="246" y="269" width="288" height="9" class="f-plain" style="stroke:var(--muted)"/>
  <text x="540" y="277.5" class="f-mono f-muted" style="font-size:10.5px">16</text>
  <text x="234" y="302" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">говорит, что этого нет</text>
  <line x1="246" y1="286" x2="246" y2="310" class="f-line" style="opacity:0.4"/>
  <rect x="246" y="288" width="54" height="9" class="f-box"/>
  <text x="306" y="296.5" class="f-mono f-ink" style="font-size:10.5px">3</text>
  <rect x="246" y="299" width="18" height="9" class="f-plain" style="stroke:var(--muted)"/>
  <text x="270" y="307.5" class="f-mono f-muted" style="font-size:10.5px">1</text>
  <text x="234" y="332" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">только вызов инструмента</text>
  <line x1="246" y1="316" x2="246" y2="340" class="f-line" style="opacity:0.4"/>
  <rect x="246" y="318" width="36" height="9" class="f-box"/>
  <text x="288" y="326.5" class="f-mono f-ink" style="font-size:10.5px">2</text>
  <rect x="246" y="329" width="54" height="9" class="f-plain" style="stroke:var(--muted)"/>
  <text x="306" y="337.5" class="f-mono f-muted" style="font-size:10.5px">3</text>
  <text x="234" y="362" text-anchor="end" class="f-mono f-ink" style="font-size:11.5px">другое</text>
  <line x1="246" y1="346" x2="246" y2="370" class="f-line" style="opacity:0.4"/>
  <rect x="246" y="348" width="18" height="9" class="f-box"/>
  <text x="270" y="356.5" class="f-mono f-ink" style="font-size:10.5px">1</text>
  <text x="252" y="367.5" class="f-mono f-muted" style="font-size:10.5px">0</text>
</svg>
<figcaption>Без инструментов. Столбики для существующего и несуществующего пути почти одинаковые, так что ответ от пути не зависит.</figcaption>
</figure>

Haiku выдумал значение 14 раз из 20, когда путь был. Когда его не было, выдумал 16 раз. При 20 вызовах с каждой стороны разница в 2 это шум. "Не существует" звучит примерно одинаково часто: у двух моделей вместе 7 ответов из 40, когда путь есть. Когда его нет, таких ответов 5 из 40. Часто это сообщение об ошибке, которое модель сочинила сама. Без инструментов эта фраза ничего не говорит о файле. В одном ответе opus написал, что существует только `probe-repo-a`, потом напечатал вызов git внутри него и хэш. Не было ни такой папки, ни вызова.

Одно изменилось по сравнению с августом. Opus сказал, что у него нет инструментов, 6 раз из 40, например "I don't have tool access in this conversation, so I can't run `git rev-parse HEAD`". В каждом августовском прогоне было 0 из 20. 2 из этих 6 мой судья пропустил, их я досчитал руками. Все 6 на вопросе про хэш, где в тексте вопроса названа команда. На вопросе про файл не было ни одного. В сломанном первом прогоне их тоже было 6 и тоже только на хэше, но там 5 были в открытой форме, а здесь все 6 в жёсткой строке. Haiku остался на 0 из 40. Между августом и сегодня поменялись версия CLI, ОС, машина и обёртка, поэтому сказать, что именно сдвинуло opus, я не могу.

## Чего я не проверял

- `claude-fable-5-1`, у него кончились кредиты. `claude-sonnet-5`, его я заново не гонял.
- Отрицательный контроль без похожего соседа. Нынешний смешивает "этого нет" с "есть что-то похожее".
- Почему opus признаётся в отсутствии инструмента на хэше и никогда на файле.
- Выборки побольше. 5 повторов на ячейку показывают направление, а разница в 1 или 2 ещё не результат.

В README `tool-honesty` контроль до сих пор описан только с одной стороны, той, где 4 из 4. Туда нужно добавить случай с несуществующим путём и пометку о том, где работает каждый инструмент.
