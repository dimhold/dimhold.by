---
title: "Самая танная мова на T5 тая, якую ён не ўмее чытаць"
description: "Тыя ж 5010 пар XNLI test на 15 мовах на токенізатарах студзеня 2020 года. GPT-2 бярэ за тайскую ў 7,99 раза больш, чым за англійскую. T5 робіць тайскую ў 3 разы таннейшай за англійскую, бо губляе 95% тэксту ў <unk>. На mBERT сцяг --max_seq_length=128 з README рэжа кожную чацвёртую тайскую пару і ніводнай англійскай."
date: 2020-01-15
lang: be
translationKey: token-tax-xnli
tags: ["llm", "machine-learning", "text"]
---
У README шматмоўнага BERT ёсць каманда для навучання на XNLI, тэставым наборы на 15 мовах. Адзін са сцягоў там `--max_seq_length=128`, тое ж значэнне стаіць па змаўчанні ў `run_classifier.py`. Я заўсёды чытаў "128 токенаў" як "доўгі сказ" на любой мове. Токен у маёй галаве гэта слова, плюс-мінус суфікс. Колькі гэта 128 па-тайску ці па-грэчаску, я ні разу не лічыў.

Таму я палічыў на 4 токенізатарах, якія змог дастаць у студзені, каб зразумець, чыя гэта праблема: BERT ці мовы.

## Як мераў

У XNLI test 5010 пар, кожная з пасылкі і гіпотэзы. Абедзве часткі спачатку былі англійскімі: пасылкі ўзятыя з гатовых тэкстаў, гіпотэзы напісалі краўдворкеры. Прафесійныя перакладчыкі пераклалі іх на 14 іншых моў, так што мяняецца толькі мова. Падаткам я далей называю колькасць токенаў мовы, падзеленая на колькасць токенаў англійскай на тым жа токенізатары. Лічыцца па ўсіх 5010 парах, без службовых токенаў.

Токенізатары:

- GPT-2, байтавы BPE на 50257 запісаў, з лютага мінулага года;
- T5, слоўнік SentencePiece на 32000 кавалкаў плюс 100 службовых, з кастрычніка. У артыкуле сказана, што слоўнік вучылі ў асноўным на англійскай, з дадаткам нямецкай, французскай і румынскай;
- шматмоўны BERT, cased, слоўнік WordPiece на 119547 запісаў для 104 моў;
- XLM-R, слоўнік SentencePiece на 250002 запісы для 100 моў, выйшаў у лістападзе.

Лічыў я кодам Hugging Face. Потым звярыў кожны лік на ўсіх 15 мовах з арыгінальным кодам. Для T5 і XLM-R гэта іх файлы мадэляў sentencepiece, для mBERT гэта `tokenization.py` з рэпазіторыя Google. У mBERT першая зверка не сышлася, да гэтага я вярнуся ніжэй.

Перад падлікам я запісаў, чаго чакаю. На GPT-2 руская павінна каштаваць ад 4 да 6 разоў даражэй за англійскую. Для тайскай і хіндзі я запісаў 8 і больш, бо іх літары займаюць 3 байты ў UTF-8. mBERT ад 1,1 да 1,8, XLM-R ад 1,0 да 1,4. T5 павінен выкідваць усё, што не лацінка, у `<unk>`.

## GPT-2

На GPT-2 англійскія пары займаюць 171534 токены. Руская ў 5,26 раза больш, грэчаская ў 5,77, хіндзі ў 6,86, тайская ў 7,99. 3 заходнееўрапейскія мовы трымаюцца паміж 1,77 і 2,00. Кітайская ўсяго 2,81. Яе іерогліф каштуе прыкладна 2 токены, але тым жа парам іх трэба прыкладна ў 3 разы менш, чым англійскай літар.

Англійская пара ў сярэднім 34 токены, тайская 273. Акно ў GPT-2 мае 1024 токены, таму ў яго ўлазіць каля 30 англійскіх пар і 3 тайскія. "We had a great talk." па-англійску гэта 6 токенаў, а яго тайскі пераклад 50.

<figure class="fig">
<svg viewBox="0 0 680 236" role="img" aria-label="&quot;We had a great talk.&quot; па-англійску і па-тайску, разрэзанае на токены. GPT-2, англійская: 6 токенаў. GPT-2, тайская: 50 токенаў. T5, англійская: 7 токенаў. T5, тайская: 2 токены. mBERT, англійская: 6 токенаў. mBERT, тайская: 21 токен. XLM-R, англійская: 6 токенаў. XLM-R, тайская: 7 токенаў.">
  <text x="10" y="33" class="f-mono f-ink" style="font-size:12px">GPT-2</text>
  <text x="142.0" y="33.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">англійская</text>
  <rect x="150.0" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="33.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="55.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тайская</text>
  <rect x="150.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="220.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="230.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="251.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="261.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="271.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="281.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="291.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="301.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="311.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="321.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="331.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="341.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="352.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="362.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="372.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="382.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="392.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="402.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="412.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="422.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="432.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="442.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="453.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="463.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="473.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="483.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="493.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="503.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="513.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="523.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="533.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="543.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="554.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="564.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="574.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="584.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="594.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="604.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="614.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="624.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="634.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="644.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="661.0" y="55.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">50</text>
  <text x="10" y="87" class="f-mono f-ink" style="font-size:12px">T5</text>
  <text x="142.0" y="87.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">англійская</text>
  <rect x="150.0" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="210.6" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="226.7" y="87.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">7</text>
  <text x="142.0" y="109.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тайская</text>
  <rect x="150.0" y="99" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="99" width="60" height="13" rx="1.5" class="f-accent" style="stroke:none"/>
  <text x="190.1" y="109" text-anchor="middle" class="f-mono" style="font-size:10px;fill:var(--surface)">&lt;unk&gt;</text>
  <text x="241.4" y="109.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2</text>
  <text x="10" y="141" class="f-mono f-ink" style="font-size:12px">mBERT</text>
  <text x="142.0" y="141.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">англійская</text>
  <rect x="150.0" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="141.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="163.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тайская</text>
  <rect x="150.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="220.7" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="230.8" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.9" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="251.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="261.1" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="271.2" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="281.3" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="291.4" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="301.5" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="311.6" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="321.7" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="331.8" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="341.9" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="352.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="368.1" y="163.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">21</text>
  <text x="10" y="195" class="f-mono f-ink" style="font-size:12px">XLM-R</text>
  <text x="142.0" y="195.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">англійская</text>
  <rect x="150.0" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="195.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="217.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тайская</text>
  <rect x="150.0" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="226.7" y="217.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">7</text>
</svg>
<figcaption>Адна і тая ж гіпотэза XNLI па-англійску і ў тайскім перакладзе. Кожная клетка гэта адзін токен. На T5 ад тайскага сказа застаюцца метка прабелу і адзін &lt;unk&gt;.</figcaption>
</figure>

## T5 і танная тайская

Потым T5 выдаў мне тайскую ў 0,31 ад англійскай і кітайскую ў 0,27. Я ж сам запісаў, што T5 губляе ўсё, што не лацінка. І ўсё роўна на секунду ўбачыў у гэтым ліку зніжку.

Тайская фраза пра размову на T5 займае 2 токены: метку прабелу і адзін `<unk>`. Невядомыя сімвалы, што ідуць запар, становяцца адным `<unk>`, таму тайскі сказ без прабелаў ператвараецца амаль у нішто. Я палічыў сімвалы, якія трапляюць унутр `<unk>`. У тайскай гэта 95,4% сімвалаў, у арабскай 96,5%, у хіндзі 93,5%, у грэчаскай 93,2%, у кітайскай 87,0%.

З рускай складаней. На T5 яна каштуе ў 3,24 раза даражэй за англійскую і пры гэтым 21,8% яе літар усё роўна знікаюць. У слоўніку 80 кавалкаў з кірыліцай, напрыклад "ре" ці "ра". Мабыць, яны прыйшлі з кірылічных абрыўкаў у англійскіх даных для навучання. Але п, ы, я і ь там няма. Так што за яе мадэль плаціць больш, чым за англійскую, але ўсё роўна не бачыць пятую частку літар. Іспанская губляе 0,9% сімвалаў. Гэта здзівіла мяне больш. У T5 няма "í", таму "aquí" даходзіць да мадэлі як "aqu" і дзірка.

Калі б я ранжыраваў толькі па падатку, T5 паказаў бы тайскую і кітайскую сваімі лепшымі мовамі. Таму на малюнку адзначана, дзе большая частка тэксту сышла ў `<unk>`.

<figure class="fig">
<svg viewBox="0 0 680 382" role="img" aria-label="У колькі разоў токенаў мовы больш, чым у англійскай, XNLI test, 5010 пар, лагарыфмічная шкала. англійская: GPT-2 1,00, T5 1,00, mBERT 1,00, XLM-R 1,00. іспанская: GPT-2 1,77, T5 1,96, mBERT 1,14, XLM-R 1,07. французская: GPT-2 1,86, T5 1,52, mBERT 1,28, XLM-R 1,25. суахілі: GPT-2 1,93, T5 2,40, mBERT 1,39, XLM-R 1,07. нямецкая: GPT-2 2,00, T5 1,27, mBERT 1,19, XLM-R 1,11. турэцкая: GPT-2 2,24, T5 2,44, mBERT 1,31, XLM-R 0,99. кітайская: GPT-2 2,81, T5 0,27 &lt;unk&gt;, mBERT 1,26, XLM-R 0,86. арабская: GPT-2 3,99, T5 1,32 &lt;unk&gt;, mBERT 1,38, XLM-R 1,08. в'етнамская: GPT-2 4,31, T5 3,50, mBERT 1,24, XLM-R 1,15. балгарская: GPT-2 5,20, T5 3,17, mBERT 1,50, XLM-R 1,13. руская: GPT-2 5,26, T5 3,24, mBERT 1,38, XLM-R 1,11. урду: GPT-2 5,65, T5 1,82 &lt;unk&gt;, mBERT 1,56, XLM-R 1,16. грэчаская: GPT-2 5,77, T5 1,58 &lt;unk&gt;, mBERT 2,00, XLM-R 1,31. хіндзі: GPT-2 6,86, T5 1,74 &lt;unk&gt;, mBERT 1,67, XLM-R 1,20. тайская: GPT-2 7,99, T5 0,31 &lt;unk&gt;, mBERT 2,67, XLM-R 0,99.">
  <line x1="150.8" y1="16" x2="150.8" y2="318" class="f-plain" />
  <text x="150.8" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,25</text>
  <line x1="246.5" y1="16" x2="246.5" y2="318" class="f-plain" />
  <text x="246.5" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,5</text>
  <line x1="342.2" y1="16" x2="342.2" y2="318" class="f-plain" style="stroke:var(--muted)"/>
  <text x="342.2" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="437.8" y1="16" x2="437.8" y2="318" class="f-plain" />
  <text x="437.8" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="533.5" y1="16" x2="533.5" y2="318" class="f-plain" />
  <text x="533.5" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="629.2" y1="16" x2="629.2" y2="318" class="f-plain" />
  <text x="629.2" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="110.0" y="28.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">англійская</text>
  <circle cx="342.2" cy="24" r="4" style="fill:var(--muted)"/>
  <circle cx="342.2" cy="24" r="4" class="f-accent"/>
  <rect x="338.2" y="20" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="342.2" cy="24" r="4" class="f-ink"/>
  <text x="110.0" y="48.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">іспанская</text>
  <circle cx="360.2" cy="44" r="4" style="fill:var(--muted)"/>
  <circle cx="351.8" cy="44" r="4" class="f-accent"/>
  <rect x="431.1" y="40" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="420.8" cy="44" r="4" class="f-ink"/>
  <text x="110.0" y="68.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">французская</text>
  <circle cx="376.6" cy="64" r="4" style="fill:var(--muted)"/>
  <circle cx="372.6" cy="64" r="4" class="f-accent"/>
  <rect x="395.8" y="60" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="427.8" cy="64" r="4" class="f-ink"/>
  <text x="110.0" y="88.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">суахілі</text>
  <circle cx="388.0" cy="84" r="4" style="fill:var(--muted)"/>
  <circle cx="351.4" cy="84" r="4" class="f-accent"/>
  <rect x="459.0" y="80" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="433.2" cy="84" r="4" class="f-ink"/>
  <text x="110.0" y="108.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">нямецкая</text>
  <circle cx="365.8" cy="104" r="4" style="fill:var(--muted)"/>
  <circle cx="355.9" cy="104" r="4" class="f-accent"/>
  <rect x="371.1" y="100" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="438.0" cy="104" r="4" class="f-ink"/>
  <text x="110.0" y="128.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">турэцкая</text>
  <circle cx="379.3" cy="124" r="4" style="fill:var(--muted)"/>
  <circle cx="341.0" cy="124" r="4" class="f-accent"/>
  <rect x="461.1" y="120" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="453.3" cy="124" r="4" class="f-ink"/>
  <text x="110.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">кітайская</text>
  <circle cx="373.7" cy="144" r="4" style="fill:var(--muted)"/>
  <circle cx="321.8" cy="144" r="4" class="f-accent"/>
  <rect x="159.2" y="140" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M159.2,140l8,8M167.2,140l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="484.6" cy="144" r="4" class="f-ink"/>
  <text x="110.0" y="168.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">арабская</text>
  <circle cx="386.5" cy="164" r="4" style="fill:var(--muted)"/>
  <circle cx="352.1" cy="164" r="4" class="f-accent"/>
  <rect x="376.9" y="160" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M376.9,160l8,8M384.9,160l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="533.0" cy="164" r="4" class="f-ink"/>
  <text x="110.0" y="188.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">в'етнамская</text>
  <circle cx="372.1" cy="184" r="4" style="fill:var(--muted)"/>
  <circle cx="361.9" cy="184" r="4" class="f-accent"/>
  <rect x="511.0" y="180" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="543.8" cy="184" r="4" class="f-ink"/>
  <text x="110.0" y="208.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">балгарская</text>
  <circle cx="398.2" cy="204" r="4" style="fill:var(--muted)"/>
  <circle cx="358.6" cy="204" r="4" class="f-accent"/>
  <rect x="497.4" y="200" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="569.8" cy="204" r="4" class="f-ink"/>
  <text x="110.0" y="228.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">руская</text>
  <circle cx="386.4" cy="224" r="4" style="fill:var(--muted)"/>
  <circle cx="356.3" cy="224" r="4" class="f-accent"/>
  <rect x="500.3" y="220" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="571.2" cy="224" r="4" class="f-ink"/>
  <text x="110.0" y="248.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">урду</text>
  <circle cx="403.2" cy="244" r="4" style="fill:var(--muted)"/>
  <circle cx="362.9" cy="244" r="4" class="f-accent"/>
  <rect x="421.1" y="240" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M421.1,240l8,8M429.1,240l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="581.2" cy="244" r="4" class="f-ink"/>
  <text x="110.0" y="268.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">грэчаская</text>
  <circle cx="437.6" cy="264" r="4" style="fill:var(--muted)"/>
  <circle cx="379.7" cy="264" r="4" class="f-accent"/>
  <rect x="401.2" y="260" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M401.2,260l8,8M409.2,260l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="584.2" cy="264" r="4" class="f-ink"/>
  <text x="110.0" y="288.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">хіндзі</text>
  <circle cx="412.8" cy="284" r="4" style="fill:var(--muted)"/>
  <circle cx="367.0" cy="284" r="4" class="f-accent"/>
  <rect x="415.0" y="280" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M415.0,280l8,8M423.0,280l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="608.0" cy="284" r="4" class="f-ink"/>
  <text x="110.0" y="308.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">тайская</text>
  <circle cx="477.6" cy="304" r="4" style="fill:var(--muted)"/>
  <circle cx="340.2" cy="304" r="4" class="f-accent"/>
  <rect x="175.4" y="300" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M175.4,300l8,8M183.4,300l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="629.0" cy="304" r="4" class="f-ink"/>
  <text x="390" y="350" text-anchor="middle" class="f-label f-muted" style="font-size:10px">у колькі разоў больш за англійскую, лагарыфмічная шкала</text>
  <circle cx="24" cy="368" r="4" class="f-ink"/>
  <text x="34.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">GPT-2</text>
  <rect x="120" y="364" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="134.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">T5</text>
  <rect x="200" y="364" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/><path d="M200,364l8,8M208,364l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <text x="214.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">T5, пераважна &lt;unk&gt;</text>
  <circle cx="439" cy="368" r="4" style="fill:var(--muted)"/>
  <text x="449.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">mBERT</text>
  <circle cx="539" cy="368" r="4" class="f-accent"/>
  <text x="549.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">XLM-R</text>
</svg>
<figcaption>Колькасць токенаў мовы, падзеленая на колькасць токенаў англійскай на тым жа токенізатары, 5010 пар XNLI test. Перакрэслены квадрат T5 значыць, што больш за палову сімвалаў пайшло ў &lt;unk&gt;.</figcaption>
</figure>

## mBERT і 128

mBERT у большасці моў трапіў у чаканы дыяпазон: іспанская 1,14, руская 1,38, хіндзі 1,67. Грэчаская 2,00, тайская 2,67.

З `[CLS]` і 2 `[SEP]` ніводная англійская пара не выходзіць за 128 токенаў, самая доўгая займае 92. У тайскай за 128 выходзяць 1222 пары з 5010. Гэта 24,4%. У такіх парах `_truncate_seq_pair` адразае токены ад даўжэйшага сказа, пакуль пара не ўлезе. Усяго 6,5% токенаў тайскага тэксту да мадэлі не даходзяць. У грэчаскай такіх пар 213, у хіндзі 24, ва ўрду 7, у рускай 1. Для тайскай сцяг пакідае тэкст цэлым у 3 парах з 4.

Мае першыя лікі для тайскай былі іншымі. Порт Hugging Face даў 2,47 і 7,7% тайскіх сімвалаў у `[UNK]`. Я ледзь не запісаў гэта як факт пра mBERT. У тайскай няма прабелаў паміж словамі, а базавы токенізатар BERT рэжа па прабелах і пунктуацыі. Таму тайскае "слова" тут часта гэта доўгі кавалак сказа. Порт пазначае любое слова, даўжэйшае за 100 сімвалаў, як `[UNK]`. У `tokenization.py` ад Google стаіць 200, да лістапада 2018 года там таксама было 100. З мяжой 200 доля `[UNK]` у тайскай падае да 0,23%. Лік пры гэтым супадае з кодам Google радок у радок. У порце па змаўчанні дагэтуль 100, у тым ліку ў версіі 2.3.0 са снежня. Хто токенізуе тайскую праз яго, губляе гэтыя кавалкі моўчкі, без паведамлення пра памылку. І лік у яго выходзіць таннейшы, чым дае ўласны код Google.

<figure class="fig">
<svg viewBox="0 0 680 358" role="img" aria-label="Пары XNLI test, даўжэйшыя за 128 токенаў mBERT разам з [CLS] і 2 [SEP], з 5010. тайская 1222, тайская, порт, мяжа 100: 939, грэчаская 213, хіндзі 24, урду 7, балгарская 1, суахілі 1, арабская 1, руская 1, французская 1, турэцкая 0, кітайская 0, в'етнамская 0, нямецкая 0, іспанская 0, англійская 0.">
  <line x1="160.0" y1="12" x2="160.0" y2="300" class="f-plain"/>
  <text x="160.0" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="313.3" y1="12" x2="313.3" y2="300" class="f-plain"/>
  <text x="313.3" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="466.7" y1="12" x2="466.7" y2="300" class="f-plain"/>
  <text x="466.7" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="620.0" y1="12" x2="620.0" y2="300" class="f-plain"/>
  <text x="620.0" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <text x="150.0" y="30.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">тайская</text>
  <rect x="160" y="22" width="374.0" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="540.0" y="31.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1222</text>
  <text x="150.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">порт, мяжа 100</text>
  <rect x="160" y="40" width="287.4" height="11" style="fill:var(--muted);stroke:none;opacity:0.5"/>
  <text x="453.4" y="49.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">939</text>
  <text x="150.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">грэчаская</text>
  <rect x="160" y="58" width="65.2" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="231.2" y="67.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">213</text>
  <text x="150.0" y="84.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">хіндзі</text>
  <rect x="160" y="76" width="7.3" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="173.3" y="85.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">24</text>
  <text x="150.0" y="102.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">урду</text>
  <rect x="160" y="94" width="2.1" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="168.1" y="103.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="150.0" y="120.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">балгарская</text>
  <rect x="160" y="112" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="121.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">суахілі</text>
  <rect x="160" y="130" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="139.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="156.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">арабская</text>
  <rect x="160" y="148" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="174.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">руская</text>
  <rect x="160" y="166" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="175.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="192.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">французская</text>
  <rect x="160" y="184" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="193.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="210.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">турэцкая</text>
  <rect x="160" y="202" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="211.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="228.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">кітайская</text>
  <rect x="160" y="220" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="246.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">в'етнамская</text>
  <rect x="160" y="238" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="247.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="264.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">нямецкая</text>
  <rect x="160" y="256" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="265.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="282.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">іспанская</text>
  <rect x="160" y="274" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="283.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="300.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">англійская</text>
  <rect x="160" y="292" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="301.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="390" y="348" text-anchor="middle" class="f-label f-muted" style="font-size:10px">пары даўжэйшыя за 128 токенаў, % ад 5010</text>
</svg>
<figcaption>mBERT cased. Цёмныя палосы: мяжа слова 200 сімвалаў, як у tokenization.py ад Google. Светлая паласа ў тайскай: мяжа 100, як у порце Hugging Face, дзе доўгія тайскія словы становяцца адным [UNK].</figcaption>
</figure>

## XLM-R

У XLM-R мовы амаль не адрозніваюцца. Усё ляжыць паміж 0,86 і 1,31 ад англійскай. Турэцкая і тайская 0,99. Ніжэй за ўсіх кітайская, 0,86, то бок яна таннейшая за англійскую. За 128 выходзяць толькі 1 французская і 1 грэчаская пара. У `<unk>` не трапляе нічога, акрамя 16 кітайскіх токенаў. Тайская фраза пра размову займае 7 токенаў, на 1 больш за англійскую.

З 4 токенізатараў толькі ў яго кожная мова трымаецца ў межах трэці ад англійскай. Плаціць за гэта даводзіцца слоўнікам у 5 разоў большым, чым у GPT-2. Разам з ім расце матрыца эмбедынгаў. Колькі гэта каштуе, я не мераў.

## Хіндзі лацінкай

Яшчэ адна рэч зрушыла мае лікі. Яна ў саміх даных XNLI. Частка радкоў хіндзі ў тэставым наборы напісана лацінкай, напрыклад "Wo thoda deri se aaya". У 319 пар хіндзі і 517 пар урду хаця б адзін радок без дэванагары ці арабскага пісьма. Без іх падатак хіндзі на GPT-2 расце з 6,86 да 7,05, урду з 5,65 да 5,85. Лікі вышэй палічаныя па поўным наборы.

## Чаго я не правяраў

- Я лічыў толькі колькасць токенаў і абрэзку, а не дакладнасць. Ці становіцца mBERT горшым на XNLI праз абрэзаныя тайскія пары, я не мераў.
- XNLI гэта кароткія сказы, перакладзеныя з англійскай. Доўгія тэксты, з самага пачатку напісаныя на мове, могуць токенізавацца інакш.
- T5, навучаны на большай колькасці моў, я не правяраў, бо такога не апублікавана.
- Доля `<unk>` лічыць сімвалы, а не сэнс. Рускае слова без 2 літар мадэль, магчыма, усё роўна адгадае. Як часта, я не правяраў.
