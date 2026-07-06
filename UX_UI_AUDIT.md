# Opsqora — UX/UI Audit

**Дата:** 2026-07-06
**Метод:** ревью исходного кода (`src/`), живой осмотр всех экранов в браузере (desktop 1280px, tablet ~900px, mobile 375px), инструментальный замер контраста реальных отрисованных цветов.
**Reference:** IBM Carbon Design System (паттерны, не визуальный стиль). **Ограничение:** WCAG 2.2 Level AA.
**Scope note:** бриф аудита описывает «support tickets + SLA risk»; фактический продукт — валидация recurring support-паттернов. Критерии смаплены на реальные сущности: ticket queue → Patterns table, priority/SLA risk → mention volume + trend, AI classification → pattern/evidence suggestions, low-confidence predictions → confidence vs 70% threshold, human review → evidence decisions + verdict.

**Осмотренные поверхности:** Patterns (feed + search + empty state), Review (switcher, summary, evidence cards, readiness rail, verdict, CTA), Brief (generated + blocked states), AI Eval (stats, metric tables, rules, charts), Case Study (`case-study.html`), toast, hover/focus/selected/disabled states, responsive поведение всех экранов. Modals в продукте отсутствуют (и не требуются). Loading/error states отсутствуют — для детерминированного локального прототипа это корректно.

---

## 1. Executive Summary

Opsqora — визуально дисциплинированный, цельный прототип: единый Swiss/International-язык, один accent, честная маркировка synthetic/mocked данных, прозрачный readiness-gate. Основа сильная; главные проблемы — не «редизайн», а точечные провалы accessibility и потерянная информация для принятия решений.

Главные проблемы (5–10):

1. **Провал контраста текста app-wide.** Токен `--ink-3` (#8a8a93) даёт 3.42:1 на белом и используется для мелкого (10.5–13px) текста везде: заголовки таблиц, лейблы, метаданные evidence, статусы в Eval, футер. Это системный WCAG AA fail (норма 4.5:1). `--warn` на `--warn-wash` = 4.44:1 — статус-чип «Needs validation» тоже на грани провала.
2. **Состояние ключевых контролов не передаётся assistive technologies.** Segmented-кнопки решений по evidence не имеют `aria-pressed`; verdict-«радио» и pattern-«табы» объявлены ARIA-ролями, но не реализуют клавиатурный паттерн этих ролей.
3. **AI-обоснования есть в данных, но скрыты в UI.** `ai_reason` каждого сниппета и `why_suggested` паттерна не отображаются (CSS `.evidence-reason` — мёртвый). Пользователь не может «понять AI classification» — центральную задачу продукта.
4. **Low-confidence и trend не видны в очереди.** PAT-004 с 69% (ниже порога 70%) выглядит в feed так же, как 86%. Поле `trend` (рост жалоб — ближайший аналог SLA risk) вообще не выводится. CSS `.meter`/`.meter-tick`/`.trend` — мёртвый код от удалённых индикаторов.
5. **AI-дефолты неотличимы от человеческих решений.** Решения по evidence предзаполнены `default_decision` от «AI», отображаются как подтверждённые, засчитываются в «15 snippets reviewed» и могут удовлетворить readiness-gate без участия человека — вразрез с тезисом продукта «human validates evidence».
6. **Readiness rule невыполнимо для 3 из 4 паттернов.** Правило требует 5+ «Belongs», а у PAT-002/003/004 всего по 3 сниппета. Пользователь может пометить все 3 как Belongs и остаться заблокированным с чеком «5+ snippets belong — 3/3 confirmed», который читается как выполненный.
7. **Toast об ошибке выглядит как success.** «Readiness rule is not met yet» показывается с иконкой CheckCircle и в том же стиле, что и подтверждение успеха.
8. **Несогласованный словарь статусов.** Одно и то же состояние называется Ready / Ready for PM decision / Needs validation / Not ready / Blocked, причём «Blocked» — в accent-синем, а «Not ready» — в amber.
9. **Кликабельные строки таблицы не являются ссылками/кнопками семантически**, а pattern switcher на Review подписан криптографичными ID (PAT-001) вместо названий.
10. **Mobile Review:** verdict и главный CTA спрятаны под семью evidence-карточками (~2/3 высоты прокрутки); в feed на mobile исчезают и mentions, и confidence.

---

## 2. Prioritized Findings

### P0

---

**OPS-001 — Системный провал контраста вторичного текста**
- **Status:** RESOLVED — `--ink-3` затемнен до `#6e6e78`, `--warn` до `#8a520a`; дизайн-токены обновлены в `docs/design-direction.md`.
- **Priority:** P0
- **Page/component:** все экраны; токены `--ink-3`, `--warn`
- **Problem:** `--ink-3` #8a8a93 на `--surface` #ffffff = **3.42:1**, на `--bg` #fbfbfa = **3.30:1** — при том, что им набран мелкий текст (10.5–13px): все заголовки таблиц, kicker-лейблы, stat-labels, метаданные evidence (segment, дата), колонка Status в Eval-таблицах, подписи осей, футер, notes. `--warn` #a2600c на `--warn-wash` #f9f1e3 = **4.44:1** на 10.5px чипе «Needs validation». WCAG 2.2 AA требует 4.5:1 для normal text (large text — от 18.66px bold / 24px, чего здесь нет).
- **Why it matters:** это не полишинг — статусы, заголовки колонок и метаданные evidence — операционная информация, по которой принимаются решения.
- **User impact:** пользователи со сниженным зрением и любой пользователь на плохом экране/ярком свете не читают половину интерфейса; юридический/комплаенс-риск для B2B.
- **Recommended change:** затемнить токен `--ink-3` до ≥4.5:1 (ориентир: #6e6e78 ≈ 4.9:1 — сохраняет «muted» характер); `--warn` затемнить до ~#8a520a. Один token-fix чинит всё приложение. Проверить итог инструментально.
- **Expected benefit:** WCAG AA по тексту закрыт одним изменением; читаемость всех таблиц и лейблов.
- **Complexity:** Low
- **Carbon reference:** Carbon использует Gray 60 (#6f6f6f, 4.95:1) как минимальный secondary-text на белом; принцип «type must meet 4.5:1».

### P1

---

**OPS-002 — Состояние evidence-решений и verdict не определяется программно**
- **Status:** RESOLVED — evidence segmented buttons получили `aria-pressed`; pattern switcher больше не объявляется tablist; verdict переведен на нативные radio inputs.
- **Priority:** P1
- **Page/component:** Review — `.segmented` (решения по evidence), `.verdict-list`, `.review-switch`
- **Problem:** активная кнопка segmented-контрола помечена только классом `is-active` — нет `aria-pressed`/`aria-checked` (WCAG 4.1.2 Name, Role, Value). Verdict использует `role="radiogroup"/"radio"`, switcher — `role="tablist"/"tab"`, но ни один не реализует обязательный для этих ролей клавиатурный паттерн (arrow keys, roving tabindex), нет `aria-controls`/tabpanel.
- **Why it matters:** разметка решений по evidence — основное действие продукта; для screen reader текущее решение не озвучивается на самом контроле (только в соседнем чипе).
- **User impact:** пользователи AT не могут уверенно выполнить главную задачу; keyboard-пользователи получают поведение, противоречащее объявленным ролям.
- **Recommended change:** segmented — `aria-pressed` на кнопках (или `radiogroup` с полным паттерном); verdict — нативные `<input type="radio">` со стилизацией либо корректный roving tabindex; switcher — заменить `tablist` на простую группу кнопок с `aria-current`, т.к. это селектор записи, а не табы контента.
- **Expected benefit:** соответствие WCAG 4.1.2/2.1.1; предсказуемое поведение для AT.
- **Complexity:** Medium
- **Carbon reference:** Content Switcher и Radio Button — у обоих задокументирован keyboard/ARIA-контракт.

---

**OPS-003 — Кликабельные строки таблицы без семантики действия**
- **Status:** RESOLVED — интерактивность перенесена со строки `<tr>` на явную кнопку открытия паттерна; строка больше не получает `tabIndex`, chevron остается визуальным affordance.
- **Priority:** P1
- **Page/component:** Patterns — `.feed-table tbody tr`
- **Problem:** строки — `<tr tabIndex={0} onClick>` без `role` и accessible name действия; стрелка в последней колонке декоративная; на mobile (≤620px) стрелка скрыта, и визуального признака кликабельности нет вовсе.
- **Why it matters:** переход в Review — единственный способ начать работу; screen reader объявляет строку как текст, не как действие.
- **User impact:** AT-пользователь не понимает, что строка открывает паттерн; тач-пользователь не видит affordance.
- **Recommended change:** сделать название паттерна ссылкой/кнопкой (click-target можно растянуть на строку CSS-ом), убрать `tabIndex` со строки; на mobile сохранить стрелку или chevron.
- **Expected benefit:** корректная семантика, один tab-stop на строку, явный affordance.
- **Complexity:** Low–Medium
- **Carbon reference:** Data table — expandable/clickable rows всегда содержат явный интерактивный элемент.

---

**OPS-004 — Ошибка показывается success-тостом**
- **Status:** RESOLVED — toast теперь имеет severity `success`/`warning`, warning использует `AlertTriangle`, `role="alert"` и отдельный warning-стиль.
- **Priority:** P1
- **Page/component:** App shell — `.toast` (App.tsx:151)
- **Problem:** единственный вариант toast — тёмный со значком CheckCircle2. Блокирующее сообщение «Readiness rule is not met yet» выглядит идентично success-сообщению «Product brief generated…».
- **Why it matters:** feedback state обязан различать успех и отказ; иконка «галочка» при отказе прямо дезинформирует.
- **User impact:** пользователь может решить, что brief сгенерирован, хотя действие отклонено; 2.6s auto-dismiss усугубляет.
- **Recommended change:** ввести вариант toast с severity (icon + цветовой маркер: ok/warn), для блокировки — warn-иконка и, желательно, чуть более длинный timeout или inline-подсказка у кнопки.
- **Expected benefit:** однозначный feedback, меньше ложных ожиданий.
- **Complexity:** Low
- **Carbon reference:** Notification — обязательные severity-варианты (success/warning/error) с разными иконками.

---

**OPS-005 — AI-обоснования не выведены в UI**
- **Status:** RESOLVED — в Review добавлены `Why suggested` для паттерна и `AI reason` на каждой evidence card.
- **Priority:** P1
- **Page/component:** Review — evidence cards, pattern summary
- **Problem:** в данных есть `evidence.ai_reason` (почему сниппет отнесён к паттерну) и `pattern.why_suggested` (почему AI предложил паттерн), но ни то, ни другое не рендерится. CSS `.evidence-reason` и `.feed-featured-why` — мёртвый код от удалённых блоков.
- **Why it matters:** «понимать AI classification» — заявленная ключевая задача; без rationale пользователь оценивает сниппет вслепую и не может калибровать доверие к модели.
- **User impact:** медленнее и менее качественная валидация; решения о Belongs/Does not belong принимаются без контекста, повышая automation bias.
- **Recommended change:** вернуть строку «AI reason: …» в evidence card (стиль `.evidence-reason` уже существует) и блок «Why suggested» (3 пункта) в review summary или разворачиваемо.
- **Expected benefit:** прямое покрытие задачи «understand AI classification»; быстрее и точнее решения; почти нулевая стоимость — данные и стили уже есть.
- **Complexity:** Low
- **Carbon reference:** Carbon for AI — AI transparency / explainability patterns (показывать источник и обоснование AI-вывода рядом с ним).

---

**OPS-006 — Low-confidence не флагуется в очереди**
- **Status:** RESOLVED — в Patterns возвращен confidence meter с 70% tick; значения ниже rule получают текстовый маркер `Below rule` и warning-индикатор.
- **Priority:** P1
- **Page/component:** Patterns — колонка Signal
- **Problem:** confidence выводится как голое число «31 mentions · 69%». PAT-004 (69%, ниже порога readiness 70%) визуально неотличим от PAT-001 (86%). Дизайн-документ описывает «confidence meters carry an accent tick at the 70% threshold» — CSS `.meter`/`.meter-tick` есть, но компонент удалён.
- **Why it matters:** «замечать low-confidence predictions» — ключевая задача; порог 70% — часть продуктовой логики, но в очереди он невидим.
- **User impact:** пользователь тратит клик и переключение контекста, чтобы узнать, что паттерн заведомо ниже порога; риск неверной приоритизации очереди.
- **Recommended change:** вернуть мини-meter с tick на 70% (стили готовы) либо warn-обработку значений ниже порога (цвет + текстовый маркер, не только цвет).
- **Expected benefit:** low-confidence сканируется мгновенно; согласованность UI с задокументированным дизайном.
- **Complexity:** Low
- **Carbon reference:** Data table + inline data visualization; статус — «icon + text, never color alone».

---

**OPS-007 — AI-дефолты неотличимы от человеческих решений**
- **Status:** RESOLVED — добавлено состояние confirmations: readiness и счетчики считают только confirmed evidence; AI defaults показываются как `AI suggested`; PAT-001 оставлен demo-предподтвержденным и маркируется как `Demo confirmed`.
- **Priority:** P1
- **Page/component:** Review, Patterns toolbar, readiness-логика
- **Problem:** решения по evidence инициализируются `default_decision` от AI и рендерятся так же, как решения человека; toolbar считает их в «15 snippets reviewed»; readiness-gate PAT-001 выполнен «из коробки» без единого действия пользователя.
- **Why it matters:** тезис продукта — «AI suggests, human validates». UI, в котором AI-предложение выглядит как выполненная человеком валидация, подрывает этот тезис и провоцирует automation bias — критерий «может привести к неправильному решению».
- **User impact:** ревьюер видит «6/7 belongs» и «Ready» и склонен согласиться, не проверяя; счётчик «reviewed» лжёт о проделанной работе.
- **Recommended change:** ввести два состояния решения: «AI-suggested (unconfirmed)» (например, outline-чип «AI: Belongs») и «Confirmed» (текущий заполненный стиль после клика человека); в счётчики и readiness включать только подтверждённые. Для demo-целей допустимо оставить PAT-001 предподтверждённым, но пометить это явно.
- **Expected benefit:** UI перестаёт противоречить核 продуктовому принципу; честная метрика ревью.
- **Complexity:** Medium–High (модель состояния + инициализация + стили)
- **Carbon reference:** Carbon for AI — AI label / явная маркировка AI-generated контента до человеческого подтверждения.

---

**OPS-008 — Readiness rule невыполнимо для 3 из 4 паттернов**
- **Status:** RESOLVED — readiness copy теперь объясняет insufficient evidence: `0/3 marked · 5 required, need more evidence`; mock-данные не расширялись, чтобы не менять демо-набор.
- **Priority:** P1
- **Page/component:** Review rail, Brief blocked state; данные `src/mock`
- **Problem:** правило требует ≥5 «Belongs», у PAT-002/003/004 всего по 3 evidence. Все действия пользователя не могут привести к Ready. RuleCheck при этом показывает «5+ snippets belong — 3/3 confirmed»: «3/3» читается как выполненное условие рядом с failing-маркером.
- **Why it matters:** workflow-тупик без объяснения; противоречивая микрокопия повышает cognitive load и подрывает доверие к «прозрачному правилу».
- **User impact:** пользователь, добросовестно разметивший все сниппеты, застревает и не понимает почему; в demo-сценарии это выглядит как баг.
- **Recommended change:** (а) в RuleCheck писать «3/3 marked — 5 required, need more evidence» когда порог недостижим; (б) либо добавить сниппетов в mock, либо параметризовать порог от объёма evidence. Копирайт-фикс — минимум.
- **Expected benefit:** тупик превращается в понятное состояние «нужно больше evidence».
- **Complexity:** Low (копирайт) / Medium (данные или правило)
- **Carbon reference:** принцип progressive disclosure для empty/insufficient-data состояний; Notification inline для объяснения блокировки.

---

**OPS-009 — Pattern switcher подписан ID вместо названий**
- **Status:** RESOLVED — Review switcher теперь показывает human-readable `short_name` как основной label, а PAT id + area как вторичную строку.
- **Priority:** P1
- **Page/component:** Review — `.review-switch`
- **Problem:** переключатель паттернов показывает «PAT-001 / PLANNING»; на mobile остаются только «PAT-001…PAT-004». Названия паттернов («Timeline import shifts dates») нигде в контроле нет.
- **Why it matters:** пользователь должен держать маппинг ID→смысл в голове — классическая лишняя когнитивная нагрузка; ID — машинный идентификатор, а не человеческий label.
- **User impact:** переключение между паттернами требует «угадай или прокликай»; на mobile — полностью криптографично.
- **Recommended change:** основной подписью сделать `short_name` (ID — вторичной строкой или убрать); на mobile — компактный select/dropdown с названиями.
- **Expected benefit:** мгновенная ориентация, меньше ошибочных переключений.
- **Complexity:** Low
- **Carbon reference:** «Use clear, human-readable labels»; Content switcher label guidance.

---

**OPS-010 — Несогласованный словарь и цветовой маппинг статусов**
- **Status:** RESOLVED — статусный словарь нормализован до `Ready` / `Needs validation`; blocked label в Brief переведен в warning mapping.
- **Priority:** P1
- **Page/component:** все экраны
- **Problem:** одно состояние готовности называется по-разному: «Ready» (feed), «Ready / Not ready» (review head), «Ready for PM decision / Not ready yet» (rail), «Needs validation» (feed), «Not ready» (brief rail), «Blocked» (brief). При этом «Blocked» набран accent-синим (`.mono-id`), а «Not ready» — amber warn: два разных цвета для одного состояния на одном экране.
- **Why it matters:** статус — главный сканируемый сигнал; каждая новая формулировка заставляет пользователя проверять, не другое ли это состояние. Accent зарезервирован под selection/emphasis, а не под статус (по собственному дизайн-доку).
- **User impact:** замедленное сканирование, ложное ощущение большего числа состояний, чем есть (их два: ready / not ready).
- **Recommended change:** зафиксировать таксономию: `Ready` (ok) / `Needs validation` (warn) — и использовать её дословно во всех местах; «Blocked»-плашку перевести в warn-тон; уточнения («for PM decision») — во вторичный текст, не в label.
- **Expected benefit:** статус читается за секунду на любом экране.
- **Complexity:** Low–Medium
- **Carbon reference:** Status indicator pattern — единый словарь и однозначный цветовой маппинг severity.

---

**OPS-011 — Колонка Status в Eval-таблицах не сканируется**
- **Status:** RESOLVED — Eval status cells получили severity chips (`Healthy`, `Watchlist`, `Needs review`, `Context`) плюс исходный поясняющий текст.
- **Priority:** P1
- **Page/component:** AI Eval — `.metric-table .cell-status`
- **Problem:** статусы метрик («Below target; missed clusters need review» vs «Healthy…» vs «Watchlist») — одинаковый серый mono-текст (к тому же 11px, `--ink-3`, см. OPS-001). Проблемные метрики визуально не отличаются от здоровых.
- **Why it matters:** назначение eval-дашборда — быстро увидеть, где модель проседает; сейчас это требует чтения каждой ячейки.
- **User impact:** «can we trust the model?» не отвечается сканированием; риск пропустить деградацию (recall 64% ниже цели — визуально ничем не выделен).
- **Recommended change:** статусные теги (существующий `Chip` c ok/warn/bad + краткий текст), детальный комментарий — вторичной строкой. Дополнительно: `is-emphasis` уже подсвечивает строки — согласовать с severity.
- **Expected benefit:** одна секунда на оценку здоровья модели вместо чтения 13 строк.
- **Complexity:** Low
- **Carbon reference:** Tag component в data table для статусов.

---

**OPS-012 — Колонка «Signal» смешивает две метрики без объяснения**
- **Status:** RESOLVED — Patterns table разделена на `Mentions`, `Confidence`, `Trend`; confidence получил meter, trend — текст+иконку.
- **Priority:** P1
- **Page/component:** Patterns — `.cell-signal`
- **Problem:** «42 mentions · 86%» — процент не подписан (86% чего?); заголовок «Signal» не объясняет состав; сортировки/сравнения по одной из метрик нет; mono-строка сравнивается глазами хуже, чем выровненные числа.
- **Why it matters:** mention volume и confidence — разные оси решения (важность vs доверие к AI); склейка мешает сравнивать паттерны — базовая функция очереди.
- **User impact:** новый пользователь не понимает 86%; сравнение четырёх строк требует парсинга каждой ячейки.
- **Recommended change:** разнести на «Mentions» (число, tabular, выравнивание вправо) и «Confidence» (число + meter из OPS-006); при желании оставить компактный режим на узких брейкпоинтах.
- **Expected benefit:** прямое сравнение по колонкам, самодокументируемые заголовки.
- **Complexity:** Low
- **Carbon reference:** Data table — «one data point per column», выравнивание числовых колонок.

---

**OPS-013 — Mobile Review: verdict и CTA похоронены под evidence**
- **Status:** RESOLVED — на ≤920px добавлен sticky `.mobile-readiness-bar` с текущим readiness, belongs/verdict/confidence summary и brief CTA.
- **Priority:** P1
- **Page/component:** Review, ≤920px
- **Problem:** rail (Readiness, Verdict, «Generate/Open product brief») перемещается под все evidence-карточки: на PAT-001 это ~2200px прокрутки из 3350. Readiness-статус не виден во время разметки сниппетов.
- **Why it matters:** пользователь размечает evidence именно ради readiness — а прогресс гейта на mobile невидим до конца прокрутки; финальное действие screen'а требует пролистать всё.
- **User impact:** потеря контекста «сколько ещё до Ready», лишняя прокрутка к CTA, riesgo бросить flow.
- **Recommended change:** на mobile — компактная sticky-строка прогресса readiness (например «4/5 belongs · Valid · 86%») сверху или снизу экрана; verdict-блок можно оставить внизу как финальный шаг.
- **Expected benefit:** непрерывная обратная связь по гейту, меньше прокрутки.
- **Complexity:** Medium
- **Carbon reference:** progress indicator / sticky summary в длинных формах.

---

**OPS-014 — Trend (динамика жалоб) не отображается**
- **Status:** RESOLVED — trend добавлен в Patterns и Review summary как иконка+текст (`Up`, `Flat`, `Down`) с функциональным цветом.
- **Priority:** P1
- **Page/component:** Patterns
- **Problem:** в данных есть `trend: up/flat/down` (у PAT-001 — up при 42 mentions), в дизайн-доке — семантика «rising complaints = --bad», CSS `.trend--up/--down` существует, но в feed поле не выводится.
- **Why it matters:** растущий паттерн — ближайший аналог «SLA risk»: сигнал срочности, влияющий на порядок разбора очереди.
- **User impact:** приоритизация только по абсолютному объёму; растущая проблема с меньшим счётчиком проигрывает затухающей с большим.
- **Recommended change:** добавить trend-индикатор (иконка-стрелка + текст «up/down/flat», не только цвет) в feed и review summary.
- **Expected benefit:** очередь сортируется глазами по срочности, а не только по объёму.
- **Complexity:** Low
- **Carbon reference:** data visualization guidance — направление тренда кодируется формой+текстом, цвет вторичен.

### P2

---

**OPS-015 — Segmented-контрол рвётся на mobile**
- **Status:** RESOLVED — на ≤620px segmented-контрол переведен в стабильную 2-column grid с ровными border rules.
- **Priority:** P2
- **Page/component:** Review — `.segmented`, ≤375px
- **Problem:** четыре кнопки переносятся в неровную сетку (2+пустота / 2) с обрывками рамок.
- **Why it matters / impact:** неаккуратность в самом частотном контроле экрана; снижает perceived maturity.
- **Recommended change:** на узких экранах — `grid-template-columns: 1fr 1fr` или вертикальный стек с полной шириной.
- **Expected benefit:** опрятный контрол на любых ширинах.
- **Complexity:** Low
- **Carbon reference:** Content switcher responsive guidance.

---

**OPS-016 — Feed на mobile теряет mentions и confidence полностью**
- **Status:** RESOLVED — исправлено естественно вместе с OPS-003/006/012: на mobile под названием паттерна показывается компактная метастрока с mentions, confidence и area; chevron сохранен.
- **Priority:** P2
- **Page/component:** Patterns, ≤620px
- **Problem:** скрываются и summary, и area, и signal — остаются только название и статус; данных для приоритизации нет.
- **Recommended change:** вместо скрытия колонок — компактная метастрока под названием («42 mentions · 86% · Planning»).
- **Expected benefit:** мобильная очередь остаётся рабочей, не только «списком имён».
- **Complexity:** Low–Medium
- **Carbon reference:** responsive data table → list-item трансформация.

---

**OPS-017 — Case study: навигация исчезает ≤920px без замены**
- **Status:** RESOLVED — на ≤920px case-study header переносит nav в горизонтальный scroll-row вместо `display:none`.
- **Priority:** P2
- **Page/component:** case-study.html — `.case-top nav`
- **Problem:** anchor-навигация скрывается `display:none` без бургера/альтернативы; длинная страница остаётся без оглавления.
- **Recommended change:** компактное меню или горизонтальный скролл-ряд якорей.
- **Complexity:** Medium
- **Carbon reference:** UI shell — responsive header patterns.

---

**OPS-018 — Нет skip link / bypass block**
- **Status:** RESOLVED — добавлен focus-visible `Skip to content` в основной app shell и case study entry point.
- **Priority:** P2
- **Page/component:** оба entry points
- **Problem:** keyboard-пользователь проходит topbar на каждом экране; WCAG 2.4.1 (Bypass Blocks) формально требует механизм пропуска.
- **Recommended change:** «Skip to content» перед topbar (появляется по фокусу).
- **Complexity:** Low
- **Carbon reference:** UI shell включает skip-to-content по умолчанию.

---

**OPS-019 — Дублирование состояния решения в evidence card**
- **Priority:** P2
- **Page/component:** Review — чип в header карточки + segmented ниже
- **Problem:** чип «BELONGS» дублирует активную кнопку «Belongs» в той же карточке — два индикатора одного состояния в 60px друг от друга.
- **Recommended change:** решается вместе с OPS-007: чип становится индикатором «AI suggested», segmented — человеческим решением; иначе — убрать чип.
- **Expected benefit:** минус одна избыточная сущность на карточку × 7 карточек.
- **Complexity:** Low
- **Carbon reference:** принцип «одно состояние — один индикатор».

---

**OPS-020 — Brief: неподписанные метаданные и дубли**
- **Priority:** P2
- **Page/component:** Brief — `.brief-doc-head`, rail
- **Problem:** шапка дока — четыре немаркированных значения («Product brief · PAT-001 · Planning · Planning PM»); «Planning PM» затем повторяется в строке Owner; rail «Status» повторяет readiness с Review.
- **Recommended change:** подписать мета-значения (dt/dd или title), убрать дубль owner; rail-дубль допустим как контекст, но можно свернуть до одной строки.
- **Complexity:** Low
- **Carbon reference:** structured list для метаданных документа.

---

**OPS-021 — 10.5px uppercase mono как основной лейбл-стиль**
- **Priority:** P2
- **Page/component:** все экраны
- **Problem:** мелкий uppercase-моно с трекингом 0.07em используется для несущих лейблов (заголовки колонок, dt-подписи, статусы). После фикса контраста (OPS-001) размер останется на грани читаемости.
- **Recommended change:** поднять floor до 11.5–12px для табличных заголовков и статусов; 10.5px оставить декоративным кикерам.
- **Complexity:** Low
- **Carbon reference:** Carbon label/caption минимум 12px.

---

**OPS-022 — Нет типографической и spacing-шкалы**
- **Priority:** P2
- **Page/component:** styles.css
- **Problem:** ~15 уникальных font-size (10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 17, 20…) и ad-hoc отступы (36/44/32/28/24/22/18/16/14…) заданы литералами; полушаговые размеры плодят почти-одинаковые стили.
- **Why it matters:** consistency поддерживается только дисциплиной; каждый новый экран умножает разнобой.
- **Recommended change:** ввести токены type-scale (например 12/13/14/16/20/25/32) и spacing-scale (4/8/12/16/24/32/48), смигрировать литералы. Визуально почти ничего не изменится — изменится поддерживаемость.
- **Complexity:** Medium
- **Carbon reference:** Carbon type tokens + 8px spacing scale.

---

**OPS-023 — Нет URL-состояния (роутинга) в приложении**
- **Priority:** P2
- **Page/component:** App shell
- **Problem:** экран и выбранный паттерн живут только в React-state: refresh сбрасывает на Patterns, ссылку на конкретный паттерн/экран передать нельзя; Eval-экран не имеет адреса вовсе (по докам он вне основного пути — это осознанно, но и на него нельзя сослаться).
- **Recommended change:** hash-параметры (`#review/PAT-002`) без роутер-библиотеки.
- **Complexity:** Medium
- **Carbon reference:** —

---

**OPS-024 — `prefers-reduced-motion` не учитывается**
- **Priority:** P2
- **Page/component:** smooth scroll, toast-анимация, блинкер «Live» в demo-frame
- **Problem:** анимации не гейтятся media query.
- **Recommended change:** `@media (prefers-reduced-motion: reduce)` — отключить smooth-scroll и блинк.
- **Complexity:** Low
- **Carbon reference:** motion guidance — respect reduced motion.

---

**OPS-025 — Вложенный скролл в demo-frames case study**
- **Priority:** P2
- **Page/component:** case-study.html — `.demo-frame-body`
- **Problem:** живое приложение в фрейме 640px создаёт scroll-trap: колесо мыши «залипает» во внутреннем контейнере при прокрутке страницы.
- **Recommended change:** оставить как осознанный трейд-офф (живое демо ценнее), но добавить визуальный признак прокручиваемости фрейма; высоту подобрать под первый экран без внутреннего скролла.
- **Complexity:** Low–Medium
- **Carbon reference:** избегать nested scrolling regions.

---

**OPS-026 — Search без кнопки очистки и live-фидбека**
- **Priority:** P2
- **Page/component:** Patterns — `.search-field`
- **Problem:** нет «×» для сброса; количество найденного не анонсируется AT (empty state с `role="status"` — анонсируется, а смена «4→2 результата» — нет).
- **Recommended change:** clear-кнопка + visually-hidden `aria-live` со счётчиком результатов.
- **Complexity:** Low
- **Carbon reference:** Search component (включает clear action).

---

**OPS-027 — Непоследовательный цвет в Cost-барах**
- **Priority:** P2
- **Page/component:** AI Eval — `.costbar`
- **Problem:** первый бар — accent, остальные — ink: выделение по позиции в списке, а не по смыслу; accent здесь ничего не значит.
- **Recommended change:** один цвет для всех баров (accent осмысленно уже занят в trend-чарте).
- **Complexity:** Low
- **Carbon reference:** data-viz palette — цвет кодирует категорию/смысл, не порядок.

---

**OPS-028 — Разнотипные notes в stat-band**
- **Priority:** P2
- **Page/component:** AI Eval — `.stat-band`
- **Problem:** notes смешивают жанры: «Target ≥ 70%», «Precision + recall», «Key value metric» — цель, определение и ярлык в одном ряду; статус vs цель (76% vs ≥70% — хорошо? плохо?) не показан.
- **Recommended change:** единый формат «Target ≥ X» + мини-индикатор выполнения (ok/warn-квадрат уже в системе).
- **Complexity:** Low
- **Carbon reference:** KPI tile pattern (значение + цель + статус).

---

**OPS-029 — Ось Y trend-чарта без единиц**
- **Priority:** P2
- **Page/component:** AI Eval — TrendChart
- **Problem:** тики «60–90» без «%»; у SVG хороший aria-label, но визуально единица не указана.
- **Recommended change:** добавить «%» к тикам или подпись оси.
- **Complexity:** Low

---

**OPS-030 — «15 snippets reviewed» в toolbar вводит в заблуждение**
- **Priority:** P2 (следствие OPS-007, самостоятельный копирайт-фикс)
- **Page/component:** Patterns — `.feed-toolbar`
- **Problem:** счётчик считает все не-Unsure решения, включая AI-дефолты, которых человек не касался.
- **Recommended change:** до внедрения OPS-007 переименовать в «15 snippets classified»; после — считать только подтверждённые человеком.
- **Complexity:** Low

---

## 3. Top Recommended Changes

| # | Finding | Change | Impact |
|---|---------|--------|--------|
| 1 | OPS-001 | Затемнить `--ink-3` и `--warn` до ≥4.5:1 | Чинит контраст всего продукта одним токен-фиксом |
| 2 | OPS-005 | Вывести `ai_reason` / `why_suggested` в Review | Закрывает задачу «understand AI classification» |
| 3 | OPS-006 + OPS-014 | Confidence-meter с порогом 70% и trend-индикатор в feed | Очередь начинает показывать риск и срочность |
| 4 | OPS-007 + OPS-019 + OPS-030 | Разделить «AI-suggested» и «human-confirmed» состояния | UI перестаёт противоречить тезису продукта |
| 5 | OPS-002 | ARIA-состояния и клавиатурные паттерны контролов Review | Главная задача становится выполнимой с AT |
| 6 | OPS-010 | Единая таксономия статусов (Ready / Needs validation) + фиксированный цветовой маппинг | Статус читается одинаково на всех экранах |
| 7 | OPS-004 | Severity-варианты toast | Отказ перестаёт выглядеть успехом |
| 8 | OPS-011 | Статус-теги в Eval-таблицах | Дашборд отвечает на «can we trust the model» сканированием |
| 9 | OPS-009 | Названия паттернов в switcher | Минус постоянный маппинг ID→смысл |
| 10 | OPS-003 | Семантические ссылки в строках feed-таблицы | Корректный вход в основной workflow для всех способов ввода |

## 4. Quick Wins

Высокая UX-ценность при Low complexity:

- **OPS-001** — два значения токенов в `:root`.
- **OPS-004** — иконка/тон toast по severity.
- **OPS-005** — данные и CSS уже существуют, только рендер.
- **OPS-006** — CSS `.meter`/`.meter-tick` уже написан.
- **OPS-009** — заменить label на `short_name`.
- **OPS-011** — переиспользовать существующий `Chip`.
- **OPS-012** — разнести колонку Signal.
- **OPS-014** — CSS `.trend--up/--down` уже написан.
- **OPS-008 (копирайт-часть)** — честная формулировка RuleCheck при недостижимом пороге.
- **OPS-015, OPS-024, OPS-026, OPS-027, OPS-029, OPS-030** — точечные однострочные правки.

## 5. Structural Issues

Не решаются косметикой:

1. **Модель состояния решений (OPS-007).** Требует различения «AI default» vs «human confirmed» в state, инициализации, счётчиках и readiness — сквозная правка данных и UI.
2. **Семантика контролов Review (OPS-002).** Не «добавить атрибут», а выбрать целевые паттерны (native inputs vs ARIA widgets) и реализовать клавиатурное поведение.
3. **Readiness rule vs объём данных (OPS-008).** Продуктовое решение: параметризовать правило, добавить данных или явно проектировать состояние «недостаточно evidence».
4. **Mobile-раскладка Review (OPS-013).** Нужен sticky-механизм прогресса — новая компоновка, не медиа-твик.
5. **Type/spacing-токены (OPS-022).** Рефакторинг styles.css; визуально нейтрален, но объёмен.
6. **URL-состояние (OPS-023).** Меняет модель навигации приложения.

## 6. Do Not Change

Работает хорошо — не трогать без причины:

- **Единая Swiss-система**: один ultramarine-accent, hairline-сетка, квадратные маркеры, ink-on-paper. Целостна на обоих поверхностях, соответствует дизайн-доку; borders — плотные, но системные, «карточной избыточности» нет.
- **Readiness rail с RuleCheck** — образцовая прозрачность AI-гейта: три проверяемых условия с фактами. Менять только копирайт (OPS-008).
- **Blocked-state Brief** — объясняет причины блокировки конкретными числами и даёт правильную пару действий (primary «Review evidence» + disabled «Generate brief»). Правильная action hierarchy.
- **Честная маркировка**: «Synthetic data» в topbar, «Mocked / Illustrative» в Eval, футер-дисклеймер. Это фича продукта.
- **Иерархия кнопок** (`btn--primary` ink / `btn--ghost` outline) — последовательна, конкурирующих CTA нет.
- **Чипы со статусом = цвет + текст** — статусы нигде не передаются только цветом (нужно лишь дочинить контраст и словарь).
- **`:focus-visible` outline** — глобально настроен и виден; `aria-current` на навигации; `aria-label` у поиска и SVG-чарта; empty state поиска с `role="status"`.
- **Плотность данных** в целом откалибрована: и не перегруз, и не пустота (кроме отмеченных потерь на mobile).
- **Screen-head паттерн** (kicker → h1 → lede → 2px rule) — сильный, узнаваемый скелет каждого экрана.
- **Eval: plain-language definitions** у метрик и связка «threshold → action» — редкий по качеству паттерн для AI-дашбордов.
- **Case study** целиком: структура, живые embed'ы, readiness playground. Только responsive-навигация (OPS-017) и nested scroll (OPS-025).
- **Отсутствие Eval в основной навигации** — задокументированное продуктовое решение (design-direction.md: «secondary case-study surface»), не баг.

## 7. Implementation Plan

### Phase 1 — Accessibility & correctness (быстрые, безопасные правки)
1. OPS-001 — токены контраста (`--ink-3`, `--warn`).
2. OPS-004 — severity toast.
3. OPS-002 — ARIA-состояния/клавиатура контролов Review.
4. OPS-003 — семантика строк feed-таблицы.
5. OPS-018, OPS-024 — skip link, reduced motion.
6. OPS-008 (копирайт), OPS-030 — честные формулировки счётчиков и правила.

*Результат: WCAG 2.2 AA закрыт по тексту, состояниям и клавиатуре; feedback перестаёт дезинформировать.*

### Phase 2 — Decision support (ценность для основной задачи)
1. OPS-005 — AI rationale в Review.
2. OPS-006 + OPS-014 — confidence-meter с порогом и trend в feed.
3. OPS-012 — разнесение колонки Signal.
4. OPS-010 — единая таксономия статусов.
5. OPS-011, OPS-028, OPS-029 — статус-теги и KPI-формат в Eval.
6. OPS-009 — названия в pattern switcher.
7. OPS-007 — разделение AI-suggested / confirmed (крупнейшая правка фазы; включает OPS-019).

*Результат: очередь показывает риск, доверие и срочность; ревью объясняет AI; статусы согласованы.*

### Phase 3 — Structure & polish
1. OPS-013 — sticky readiness на mobile Review.
2. OPS-015, OPS-016 — mobile-раскладки segmented и feed.
3. OPS-017 — responsive-навигация case study.
4. OPS-022 — type/spacing-токены.
5. OPS-023 — hash-роутинг.
6. OPS-020, OPS-021, OPS-025, OPS-026, OPS-027 — остаточный полишинг.

*Результат: продукт устойчив на всех брейкпоинтах, система токенов защищает consistency дальше.*

---

*Каждую фазу завершать `npm run verify` и повторным замером контраста изменённых пар. Изменения в этом аудите не внесены — файл описывает план, реализация не начата.*
