# Opsqora — Layout, Composition and Element Placement Audit

**Дата:** 2026-07-06
**Предмет:** только пространственная организация — расположение, порядок, пропорции и соседство элементов. Общие UX/UI-проблемы (контраст, ARIA, словарь статусов и т.д.) покрыты `UX_UI_AUDIT.md` и здесь не повторяются.
**Метод:** живой рендер всех экранов (dev-сервер, инструментальный замер `getBoundingClientRect` каждой зоны) на viewport 1440×900, 1280×800, 375×812, плюс embedded-фреймы case study; исходники (`src/screens/*`, `styles.css`) — для системных причин.
**References:** Atlassian Design System (application layout, page structure, placement of tools/actions), IBM Carbon (grid, alignment, proportional allocation). Отличие от референсов само по себе не считалось проблемой.

Ключевые замеренные факты (desktop):

| Зона | Patterns | Review | Brief | Eval (embed 640px) |
|---|---|---|---|---|
| Topbar | 0–56 | 0–56 | 0–56 | 0–56 |
| Screen head (kicker+h1+lede) | 90–202 | 90–202 | 90–202 | 115–249 |
| Первый «рабочий» элемент | строка таблицы @314 | evidence card @799 | brief doc @226 | KPI band @376 |
| Высота страницы | 844 (без скролла) | 2326 | 844 | 2769 (внутри 640px фрейма) |

---

## 1. Executive Summary

Пространственная система Opsqora в целом дисциплинированна: один контейнер `max-width: 1080px`, повторяемый скелет «screen head → инструменты → контент», sticky-rail на Review с образцовым соседством «readiness → verdict → CTA». Serious-проблем, блокирующих workflow, нет — **P0 отсутствуют**.

Главные композиционные проблемы — три, и все они про **порядок и бюджет площади, а не про стиль**:

1. **Review — единственный экран, где primary work area полностью вытеснена за fold.** Задача экрана — размечать evidence, но при 1280×800 первая evidence-карточка начинается на y=799 (ровно на границе видимости), при 1440×900 виден только её верхний край. Первый viewport на 100% занят вводным контекстом (summary + why-suggested + figures), причём часть этого контекста дублирует sticky-rail, стоящий рядом.
2. **AI Eval собран в неверном порядке: графики оторваны от своих таблиц и KPI.** «Quality trend» — визуальное подтверждение KPI «Pattern precision 76%» — находится на ~1930px ниже KPI-band и ниже блока выводов («How I'd evaluate…»), который логически должен идти после данных, а не между ними.
3. **Systemic viewport-налог: editorial screen-head (~146–170px с отступами) повторяется на каждом экране** и дублирует подпись активного пункта навигации, стоящего в 40px выше. На operational-экранах это откладывает контент без функциональной отдачи.

Инструменты и действия при этом расставлены почти образцово: search у таблицы, decision-контролы внутри карточек, CTA рядом с гейтом, который он проверяет. Основная работа аудита — переупорядочивание и уплотнение, не перенос инструментов.

---

## 2. Page-by-Page Spatial Assessment

### Patterns (queue)

- **Primary task:** просканировать очередь паттернов, выбрать, какой валидировать следующим.
- **Secondary:** поиск, оценка объёма/уверенности/тренда, статус готовности.
- **Primary information:** строки таблицы (name, mentions, confidence, trend, status). **Primary action:** открыть паттерн.
- **Typical attention:** toolbar-счётчики → сканирование строк сверху вниз → клик по имени.

**Current composition:** head (90–202) → toolbar со статистикой слева и search справа (226–256) → таблица (274–682). Всё помещается в один viewport; таблица получает полную ширину контейнера (1024px); Pattern-колонка 365px, meter 192px.

**Assessment: композиционно лучший экран продукта.** Порядок блоков соответствует workflow, search стоит на dataset-уровне вплотную к таблице, ни один secondary-виджет не стоит выше очереди. Проблемы локальные: 39% высоты viewport расходуется до первой строки данных (в основном screen-head, см. LC-04), и affordance открытия (стрелка в последней колонке) на ~600px правее фактического click-target (имя паттерна) — см. LC-08.

### Review (ticket detail / human review) — критический экран

- **Primary task:** решить по каждому evidence-сниппету Belongs / Does not belong.
- **Secondary:** понять, что за паттерн и почему AI его предложил; выставить verdict; сгенерировать brief.
- **Последовательность решения:** что за паттерн → что говорит AI и почему → сниппеты (решения) → readiness → verdict → CTA.
- **Primary action:** segmented-кнопки в карточках; финальное — Generate brief.

**Current composition (1280×800):** head (90–202) → pattern switcher, полная ширина, 2 строки текста (226–287) → grid `1fr/300px`: слева summary-зона 382px (chips → h2 → ai_summary → Why suggested 122px → figures-band 67px) → заголовок Evidence (729–783) → **первая карточка @799, т.е. за fold**; справа sticky rail 705px (Readiness 332 → Verdict+CTA 358, CTA обрезан на первом экране, но виден после любого скролла).

**Assessment:** внутреннее устройство карточки и rail — правильные (quote → AI reason → decision-контрол; readiness рядом с местом работы). Провалена только **вертикальная экономика верхней трети**: три стековых блока контекста, частично дублирующих rail, выталкивают целевой контент экрана целиком за пределы первого viewport. См. LC-01, LC-03, LC-09.

**Recommended direction:** сжать summary-зону до одного компактного band (chips + ключевые цифры в одной строке, why-suggested — в disclosure), чтобы первая evidence-карточка появлялась на ~55–65% высоты первого viewport.

### Brief

- **Primary task:** прочитать сгенерированный кандидат (или понять, почему он заблокирован).
- **Primary action:** generated — чтение; blocked — «Review evidence».

**Current composition:** grid `1fr/280px`; документ 712px слева начинается на y=226 и почти целиком виден above the fold; rail Status справа. Blocked-state: объяснение и пара действий в одном блоке, действия сразу под текстом причины.

**Assessment: композиция корректна.** Документ доминирует, действие стоит рядом с объяснением блокировки. Единственный spatial-дефект — дублирование перехода «назад в review» в двух зонах blocked-состояния (LC-07).

### AI Eval (dashboard)

- **Primary task:** «можно ли доверять модели и что стоит validated signal» — быстрый вертикальный скан.
- **Primary information:** KPI band, статусы метрик. **Secondary:** определения, правила, графики.

**Current composition (сверху вниз):** head 134px → eval-note (дисклеймер, 72px) → KPI band 117px → Quality metrics table 784px → Cost metrics table 533px → «How I'd evaluate this in production» 333px → два графика бок о бок (Quality trend | Cost by task) → eval-foot.

**Assessment:** вертикальный skeleton «KPI → детали» верен, но **пары «таблица ↔ её график» разорваны**: оба графика сосланы в подвал, ниже блока правил-выводов. Дисклеймер занимает полосу приоритетнее KPI и дублирует чип «Mocked» в head-aside. Два стековых metric-table имеют разную ширину одноимённых колонок, что ломает вертикальный скан. См. LC-02, LC-05, LC-06. В embedded-фрейме case study (640px) до KPI band расходуется 59% высоты фрейма — LC-10.

### Case study (`case-study.html`)

Нарративная страница; композиция «hero → продукт → проблема → loop → boundary → eval» соответствует чтению сверху вниз, demo-фреймы стоят у соответствующих секций. Spatial-замечаний, кроме уже покрытых общим аудитом (nested scroll, responsive nav), нет — кроме внутренней экономики eval-фрейма (LC-10).

---

## 3. Findings

### P0

Нет. Ни одна проблема размещения не блокирует workflow и не отделяет обязательное решение от необходимого контекста: sticky-rail держит readiness/verdict/CTA рядом с работой, blocked-state объясняет себя на месте.

### P1

---

#### [LC-01] Review: primary work area (evidence) целиком за fold

- **Priority:** P1
- **Confidence:** High (замерено: первая карточка top=799 при viewport 800 и 900)
- **Page:** Review
- **Element(s):** `.review-summary` (382px), `.why-suggested` (122px), `.review-figures` (67px), `.evidence-card`
- **Placement category:** vertical placement / viewport economics

**Current arrangement:** в главной колонке до первой evidence-карточки стоят четыре стековых блока: chips-строка → h2 (pattern summary) → абзац ai_summary → список «Why suggested» (3 пункта) → band из 4 цифр (Mentions / Evidence / Confidence / Trend) → заголовок «Evidence» с helper-текстом.

**Evidence:** при 1280×800 карточка №1 начинается на y=799 — в первом viewport видно 0 сниппетов; при 1440×900 — ~100px первой карточки. Marking 7 карточек PAT-001 требует 2326px общей прокрутки, из которых первые ~780px — однократно читаемый контекст.

**Why suboptimal:** lede экрана прямо говорит «Mark the snippets that actually belong to this pattern», но ни один сниппет не виден без прокрутки. Контекст полезен при первом заходе, но занимает постоянную площадь при каждом возврате (а reviewer возвращается на этот экран чаще всех остальных). Половина band'a figures дублирует sticky-rail (см. LC-03), т.е. площадь тратится на информацию, уже присутствующую в 32px правее.

**Workflow impact:** каждый вход в review любого паттерна начинается с прокрутки мимо известного контекста; при переключении паттернов через switcher скролл сбрасывается — налог повторяется 4 раза за сессию.

**Current attention path:** head → switcher → summary → why-suggested → figures → *scroll* → card 1.
**Recommended attention path:** head → switcher → compact summary band → card 1 (без скролла).

**Recommended arrangement:**
- слить `review-summary-head` и `review-figures` в одну строку: `[PAT-001] [Planning] [Ready] · 42 mentions · 86% · Up` (chips и цифры уже одноуровневые по важности);
- h2 оставить; абзац `ai_summary` ограничить одной-двумя строками;
- «Why suggested» перевести в свёрнутый по умолчанию disclosure (`<details>`/toggle) на том же месте — объяснение остаётся смежным с AI-выводом, но перестаёт занимать 122px постоянной площади;
- цель: top первой карточки ≤ ~480px при 1280×800.

**Expected benefit:** первый viewport показывает и контекст, и 1–1.5 карточки; повторные входы начинаются с работы, а не с прокрутки.
**Implementation complexity:** Medium
**Relevant reference:** Atlassian (page header keeps context compact, work objects above the fold); Carbon (progressive disclosure для secondary-контекста).

---

#### [LC-02] AI Eval: графики оторваны от своих таблиц и KPI; выводы стоят раньше данных

- **Priority:** P1
- **Confidence:** High (замерено: KPI band @376, Quality trend @2311 внутри страницы высотой 2769)
- **Page:** AI Eval
- **Element(s):** `.stat-band`, `.metric-block` ×2, `.eval-rules`, `.eval-charts`
- **Placement category:** block order / proximity of related elements

**Current arrangement:** KPI band → Quality metrics table → Cost metrics table → «How I'd evaluate this in production» (rules) → grid из двух графиков (Quality trend | Cost by AI task).

**Evidence:** «Quality trend» (динамика precision — тех же величин, что в KPI band и Quality table) отрисован на ~1930px ниже KPI и на ~1550px ниже конца Quality table. «Cost by AI task» так же отделён от Cost metrics блоком rules. Пара KPI ↔ underlying trend требует полного прохода страницы туда-обратно.

**Why suboptimal:** это классический разрыв «KPI ↔ trend» и «table ↔ chart». Блок rules — интерпретация/политика («если метрика ниже порога — действие»), т.е. вывод, который читается после данных; сейчас он вклинен между данными и их визуализацией. Соседство двух графиков друг с другом (side-by-side) ничего не даёт — их никто не сравнивает между собой: каждый сравнивают со «своей» таблицей.

**Workflow impact:** ответ на главный вопрос экрана («можно ли доверять модели») требует собирать quality-историю из трёх зон, разнесённых на 2000px.

**Current order:**
KPI band → Quality table → Cost table → Rules → [Quality chart | Cost chart]

**Recommended order:**
KPI band → Quality table → Quality trend chart → Cost table → Cost by task chart → Rules

**Recommended arrangement:** переместить `TrendChart` сразу под Quality metrics table (full-width или 2/3 ширины), `CostBars` — сразу под Cost metrics table; `eval-rules` перенести в конец контента (перед eval-foot). Расстановка side-by-side для графиков не нужна — они относятся к разным темам и читаются последовательно.

**Expected benefit:** каждая тема (quality, cost) становится непрерывной зоной «числа → динамика»; выводы читаются после доказательств.
**Implementation complexity:** Low (перестановка JSX-блоков)
**Relevant reference:** Both — Atlassian (group related content into sections), Carbon dashboards (chart adjacent to its data table).

---

#### [LC-03] Review: readiness-данные продублированы в двух смежных зонах

- **Priority:** P1
- **Confidence:** High
- **Page:** Review
- **Element(s):** `.review-figures` (main column) ↔ `.review-rail` RuleChecks; статус-чип в `.review-summary-head` ↔ чип в `.rail-verdict-line`
- **Placement category:** proximity / redundant spatial allocation

**Current arrangement:** band figures в главной колонке показывает «Evidence 6/5 confirmed» и «Confidence 86%»; в 32px правее sticky-rail показывает те же факты как RuleCheck-строки («5+ snippets belong — 6 confirmed», «70%+ confidence — 86% current»). Статус «Ready/Needs validation» отображается чипом и в summary-head, и внизу Readiness-блока rail — оба одновременно видимы.

**Evidence:** на первом экране Review одна и та же пара значений (confirmed count, confidence) присутствует в двух зонах на одной горизонтали; статус — в двух зонах.

**Why suboptimal:** rail — каноническое место гейта (он sticky и следует за работой); дубли в главной колонке не добавляют информации, но добавляют 67px высоты ровно там, где её не хватает evidence-карточкам (LC-01). Два одинаковых чипа статуса заставляют проверять, не разные ли это статусы.

**Workflow impact:** усиливает вытеснение primary-контента за fold; при сканировании возникает лишний вопрос «это одно и то же или нет?».

**Recommended arrangement:** в объединённой summary-строке (LC-01) оставить только факты паттерна, которых нет в rail: Mentions и Trend (+ confidence как свойство паттерна — допустимо, это вход для решения, а в rail — проверка правила; но счётчик «Evidence x/y confirmed» из main-колонки убрать однозначно). Статус-чип оставить один — в summary-head; в rail статус уже выражен состоянием RuleCheck-строк и итоговой строкой.

**Expected benefit:** −60–80px в критической зоне; один источник правды по гейту (rail).
**Implementation complexity:** Low
**Relevant reference:** Carbon — один индикатор на одно состояние в одной области видимости.

### P2

---

#### [LC-04] Editorial screen-head расходует ~150px на каждом операционном экране и дублирует активный nav-пункт

- **Priority:** P2
- **Confidence:** High
- **Page:** все экраны приложения
- **Element(s):** `.screen-head` (kicker с индексом «01…04», h1, lede) + `.topnav`
- **Placement category:** vertical placement / viewport economics

**Current arrangement:** под topbar на каждом экране стоит трёхъярусный блок: kicker («01 SUPPORT FEEDBACK VALIDATION»), h1 (24–34px) и lede-строка; суммарно 112px + 34px верхнего паддинга + 24px нижнего отступа ≈ 170px до первого инструмента.

**Evidence:** h1 «Patterns» стоит в 40px под активной nav-кнопкой «Patterns»; то же на Review/Brief. На Patterns первая строка данных появляется на 39% высоты viewport; на Review head — первый из трёх факторов вытеснения evidence (LC-01).

**Why suboptimal:** для одноразовой посадочной страницы такой заголовок оправдан; для экранов, между которыми оператор переключается десятки раз, повторная крупная самоидентификация экрана — чистый вертикальный налог: название уже сообщено выделенным пунктом навигации.

**Workflow impact:** умеренный, но системный — каждый переход начинается с 20% пустого (в рабочем смысле) экрана.

**Recommended arrangement:** сжать `screen-head` до одной-двух строк: kicker и h1 в одну строку (или h1 меньшего кегля с lede справа от него в той же строке на desktop). Полный editorial-вариант можно сохранить для case-study поверхности, где он и уместен. Это structural-изменение высоты и порядка, не типографики: сами стили kicker/lede могут не меняться.

**Expected benefit:** +60–90px рабочего пространства на каждом экране; частично закрывает LC-01 и viewport-экономику Patterns.
**Implementation complexity:** Medium (общий компонент, четыре экрана)
**Relevant reference:** Atlassian page header — compact header для work-management экранов, заголовок не конкурирует с контентом.

---

#### [LC-05] AI Eval: дисклеймер стоит выше KPI и дублирует «Mocked»-маркер из head

- **Priority:** P2
- **Confidence:** High
- **Page:** AI Eval
- **Element(s):** `.eval-note` (72px, между head и `.stat-band`); чип `MOCK_LABEL` в `.screen-head-aside`
- **Placement category:** text placement / block order

**Current arrangement:** абзац «All values are mocked and illustrative…» занимает полосу шириной 860px непосредственно над KPI band. В head-aside того же экрана уже стоит чип с mock-маркировкой.

**Why suboptimal:** это meta-текст о природе данных, а не рабочая информация; он получает позицию приоритетнее primary-контента (KPI) и повторяет сообщение, уже размещённое в head в 100px выше. Сам дисклеймер продукту нужен (честность synthetic-данных — фича), вопрос только в позиции.

**Recommended arrangement:** move `.eval-note` below `.stat-band` (после KPI, перед первой таблицей) — или сократить до одной строки под head-rule. Should this text be: **moved below + spatially shortened** (не удалять и не переписывать).

**Expected benefit:** KPI band поднимается на ~100px; в embedded-фрейме case study KPI попадают в первый экран фрейма (см. LC-10).
**Implementation complexity:** Low
**Relevant reference:** Atlassian — section messages ставятся у контента, к которому относятся, не выше page-level контента.

---

#### [LC-06] AI Eval: колонки двух стековых metric-таблиц не выровнены между собой

- **Priority:** P2
- **Confidence:** High (замерено: Metric 238 vs 257px, Value 73 vs 98px, Definition 525 vs 490px)
- **Page:** AI Eval
- **Element(s):** `.metric-table` в «Quality metrics» и «Cost metrics»
- **Placement category:** alignment / grid

**Current arrangement:** две таблицы одинаковой структуры стоят друг под другом, но ширины одноимённых колонок различаются на 20–25px (auto-layout по контенту).

**Why suboptimal:** таблицы читаются как единый вертикальный скан («пробежать все Value, пробежать все Status»); смещение колонок ломает вертикальную ось сканирования на границе таблиц.

**Recommended arrangement:** зафиксировать общую сетку колонок для обеих таблиц (`table-layout: fixed` + одинаковые проценты, или общие width на col).

**Expected benefit:** непрерывный вертикальный скан значений и статусов через обе таблицы.
**Implementation complexity:** Low
**Relevant reference:** Carbon — data tables on one page share column rhythm; alignment as scanning device.

---

#### [LC-07] Brief (blocked): переход «назад в review» продублирован в двух зонах

- **Priority:** P2
- **Confidence:** High
- **Page:** Brief, blocked state
- **Element(s):** «Review evidence» (primary, `.brief-blocked-actions`) ↔ «Back to review» (`.brief-rail`)
- **Placement category:** placement of actions / duplication across zones

**Current arrangement:** главная зона blocked-карточки содержит primary-кнопку «Review evidence»; rail справа содержит «Back to review» — то же действие в другой формулировке и другом стиле, на одной высоте экрана.

**Why suboptimal:** одно действие в двух зонах с разными подписями читается как два разных действия; scope действия — page-level переход, ему достаточно одного места, и правильное — рядом с объяснением блокировки (где он уже есть).

**Recommended arrangement:** в blocked-состоянии убрать «Back to review» из rail (rail остаётся статусной сводкой); в generated-состоянии, где main-зона не содержит перехода, кнопку в rail — оставить.

**Expected benefit:** одна точка входа на одно действие; rail стабильно читается как «статус», не как вторая панель действий.
**Implementation complexity:** Low
**Relevant reference:** Atlassian — single primary path per page; duplicate actions only across scroll distances (здесь её нет).

---

#### [LC-08] Patterns: affordance открытия отделён от click-target шириной всей таблицы

- **Priority:** P2
- **Confidence:** High
- **Page:** Patterns
- **Element(s):** `.pattern-open` (кликабельно только имя, левая колонка 365px) ↔ `.cell-arrow` (стрелка в последней колонке)
- **Placement category:** proximity / action placement

**Current arrangement:** после фикса семантики (OPS-003) интерактивен только блок имени в первой колонке; визуальный индикатор действия (→) стоит в последней колонке, на ~600px правее.

**Why suboptimal:** индикатор действия и зона действия пространственно разъединены: пользователь, ведущий курсор к стрелке (естественная цель), попадает в некликабельную ячейку.

**Recommended arrangement:** растянуть hit-area кнопки на всю строку (CSS `::after` overlay на `tr`, приём из рекомендаций OPS-003) — тогда стрелка оказывается внутри target; либо перенести стрелку вплотную к имени. Первое предпочтительнее: строка целиком — привычный target очереди.

**Expected benefit:** совпадение визуальной цели и реальной интерактивной зоны на самом частом действии продукта.
**Implementation complexity:** Low
**Relevant reference:** Atlassian — table row as a single navigational target с явным интерактивным элементом внутри.

---

#### [LC-09] Review: инструкция задачи размещена дважды — в lede и в заголовке Evidence

- **Priority:** P2
- **Confidence:** High
- **Page:** Review
- **Element(s):** lede «Mark the snippets that actually belong to this pattern» (`.screen-head`) ↔ «Decide whether each quote belongs to the pattern» (`.evidence-block .block-head`)
- **Placement category:** text placement / duplication across zones

**Current arrangement:** две формулировки одной инструкции стоят в 530px друг от друга; вторая — непосредственно над картами, где инструкция и нужна.

**Why suboptimal:** объяснение до момента, когда оно нужно (в lede), плюс повтор в правильном месте — площадь head расходуется на текст, который всё равно повторят у точки действия.

**Recommended arrangement:** оставить инструкцию только у evidence-блока (правильная позиция — рядом с контролами); lede заменить кратким описанием контекста экрана или убрать (синергия с LC-04). Should this text be: **removed from primary layout (lede), kept adjacent to controls**.

**Expected benefit:** −1 строка в head; инструкция читается ровно в момент начала разметки.
**Implementation complexity:** Low
**Relevant reference:** Carbon — helper text at the point of need.

---

#### [LC-10] Case study: в eval-фрейме (640px) 59% высоты уходит до KPI

- **Priority:** P2
- **Confidence:** High (замерено: внутри фрейма KPI band начинается на 376px из 640px видимых)
- **Page:** case-study.html, секция Eval (embedded `App initialPage="eval"`)
- **Element(s):** `.demo-frame-body` (640px) → topbar 56 + screen-head 134 + eval-note 72 + отступы
- **Placement category:** viewport economics (embedded)

**Current arrangement:** внутри демонстрационного фрейма читатель case study видит по умолчанию только шапку Eval и дисклеймер; KPI band — на нижней кромке, таблицы недостижимы без вложенного скролла.

**Why suboptimal:** фрейм существует, чтобы показать eval-дисциплину, но его первый экран показывает заголовок и meta-текст. Это прямое следствие LC-04/LC-05, усиленное малой высотой фрейма.

**Recommended arrangement:** реализация LC-05 (note ниже KPI) уже поднимает KPI band в видимую зону фрейма; дополнительно в embedded-режиме (`shell--embedded`) сжать screen-head сильнее (сейчас embedded уменьшает только паддинги экрана). Альтернатива — увеличить высоту этого фрейма до ~800px.

**Expected benefit:** демо-фрейм показывает KPI и начало таблицы без вложенной прокрутки.
**Implementation complexity:** Low–Medium
**Relevant reference:** None (специфика embed).

---

#### [LC-11] Review: pattern switcher занимает полноширинную двухэтажную полосу

- **Priority:** P2
- **Confidence:** Medium (полезность быстрого переключения подтверждена workflow; спорна только высота)
- **Page:** Review
- **Element(s):** `.review-switch` (1024×61px + 32px отступ)
- **Placement category:** page composition / proportion

**Current arrangement:** четыре равношироких кнопки с двумя строками текста (название + «PAT-00x · Area») занимают ~93px вертикали между head и summary.

**Why suboptimal:** switcher — вторичная навигация (выбор объекта уже сделан на Patterns); он полезен, но его площадь равна почти половине evidence-карточки — при том, что вторая строка (ID + area) для переключения не обязательна: название уже уникально идентифицирует паттерн. Это второй по величине вклад в вытеснение evidence за fold после summary-зоны.

**Recommended arrangement:** оставить на том же месте (позиция правильная — до контента, который он переключает), но в одну строку: название паттерна + компактный статус-маркер; ID и area показывать в summary-head, где они уже есть. Экономия ~30–35px.

**Expected benefit:** вместе с LC-01/LC-03/LC-04 гарантирует первую карточку above the fold.
**Implementation complexity:** Low
**Relevant reference:** Atlassian — content switcher / breadcrumb-level селекторы компактнее контента, которым управляют.

---

## 4. Block Reordering Recommendations

### AI Eval (главное переупорядочивание)

Current:
`KPI band → Quality table → Cost table → Rules (выводы) → [Quality chart | Cost chart]`

Recommended:
`KPI band → Quality table → Quality trend chart → Cost table → Cost by task chart → Rules`

Почему: график — продолжение своей таблицы (те же величины во времени); правила — интерпретация, читаемая после всех данных. Side-by-side графиков распадается без потерь: их никто не сравнивает между собой. Дополнительно: `eval-note` перемещается из позиции «выше KPI» в позицию «ниже KPI» (LC-05).

### Review, главная колонка

Current:
`Switcher (2 строки) → Chips → H2 → AI summary → Why suggested (открытый список) → Figures band → Evidence`

Recommended:
`Switcher (1 строка) → [Chips + Mentions/Trend/Confidence inline] → H2 → AI summary (сжатый) → Why suggested (collapsed disclosure) → Evidence`

Почему: контекст сохраняет прежний порядок (он правильный: идентификация → суть → обоснование → работа), но перестаёт занимать полный viewport; дубли rail-данных удалены.

### Порядок, который менять НЕ нужно

- Patterns: `head → toolbar/search → table` — верен.
- Review rail: `Readiness (статус) → Verdict (решение) → CTA (действие)` — точно повторяет последовательность принятия решения.
- Brief: `документ → rail-статус`, blocked: `причины → действия` — верны.

---

## 5. Tool and Action Relocation Map

| Element | Current location | Recommended location | Reason |
|---|---|---|---|
| Quality trend chart | Подвал Eval, ниже Rules | Сразу после Quality metrics table | Пара «таблица ↔ график» разорвана на ~1550px (LC-02) |
| Cost by AI task chart | Подвал Eval, рядом с trend | Сразу после Cost metrics table | Относится к cost-данным, не к quality-графику (LC-02) |
| «How I'd evaluate…» rules | Между таблицами и графиками | Последний контентный блок Eval | Выводы после данных (LC-02) |
| `eval-note` (дисклеймер) | Над KPI band | Под KPI band (и короче) | Meta-текст не должен стоять приоритетнее primary-контента (LC-05) |
| `review-figures` band | Отдельная полоса под why-suggested | Inline в строку summary-head (Mentions, Trend; без дублей rail) | −67px в критической зоне; дубли гейта убраны (LC-01, LC-03) |
| «Why suggested» список | Открытый блок 122px в summary | То же место, collapsed disclosure | Объяснение остаётся смежным с AI-выводом, но освобождает fold (LC-01) |
| «Back to review» (rail Brief, blocked) | Rail, дубль main-действия | Убрать в blocked (оставить в generated) | Одно действие — одна зона (LC-07) |
| Row-open affordance (→) в feed | Последняя колонка, вне click-target | Hit-area строки растянуть до стрелки | Индикатор и зона действия должны совпадать (LC-08) |
| Инструкция «Mark the snippets…» | Lede screen-head Review | Только у evidence-блока | Текст в точке действия, не до неё (LC-09) |

Инструменты, которые **не переносятся**: search (dataset-уровень, вплотную к таблице), segmented decision-контролы (внутри карточек), Generate brief CTA (в rail под verdict), verdict radio (rail), пара действий blocked-state.

---

## 6. Text Placement Findings

1. **Review lede ↔ evidence block-head** — одна инструкция в двух зонах (LC-09). Verdict: remove from lede, keep adjacent to controls.
2. **`eval-note`** — дисклеймер выше KPI + дубль mock-чипа в head-aside (LC-05). Verdict: move below KPI band + spatially shorten.
3. **«Why suggested»** — позиция верна (рядом с AI-выводом, до evidence), неверен способ занятия площади: 122px постоянной высоты для однократно читаемого объяснения. Verdict: place into contextual disclosure на том же месте (LC-01).
4. **`rail-blocked-note`** («Blocked until the transparent readiness rule passes») — размещён правильно: вплотную под CTA, который объясняет. Не трогать.
5. **Блок-описания в rail** («Visible gate before…», «Reviewer-owned…») — helper-строки при своих блоках; позиция верна. При дефиците высоты на коротких экранах они — первый кандидат в title/tooltip, но обязательным это не считаю.
6. **`eval-foot`** (о выборе моделей в продакшене) — комментарий-послесловие, стоит после всего контента; позиция верна.

---

## 7. Viewport Economics

Первый viewport, 1280×800 (сравнительная оценка, не пиксельная математика):

| Зона | Patterns | Review | Brief (generated) | Eval (embed 640px) |
|---|---|---|---|---|
| Chrome (topbar) | 7% | 7% | 7% | 9% |
| Head (kicker/h1/lede + отступы) | ~21% | ~21% | ~21% | ~28% |
| Tools (toolbar/switcher) | ~6% | ~12% | — | — |
| Meta-текст (eval-note) | — | — | — | ~13% |
| Secondary context (summary/why/figures) | — | ~51% | — | — |
| **Primary content** | **~61%** | **~0%** | **~72%** | **~28%** (KPI band частично + начало) |

- **Patterns:** здоровая экономика; резерв — только head (LC-04).
- **Review:** первый viewport на 100% состоит из chrome, навигации и контекста; primary task не представлена. Целевая картина после LC-01/03/04/11: context ~35–40%, evidence ~40–45%.
- **Brief:** образцовая: документ доминирует с y=226.
- **Eval (embed):** до KPI — 59% фрейма; после LC-05 KPI и часть таблицы попадают в первый экран фрейма.

---

## 8. Eye-Travel Problems

1. **Eval: KPI → trend.**
   Current: `KPI band → scroll 1900px → Quality trend → scroll назад к таблице для деталей`
   Recommended: `KPI band → Quality table → Quality trend` (непрерывная вертикаль без возвратов). Это единственный существенный «inspect top → verify bottom» разрыв продукта.
2. **Review: вход в работу.**
   Current: `head → switcher → summary → why → figures → scroll → card 1`
   Recommended: `head → switcher → summary band → card 1`. Разрыв не горизонтальный, а вертикально-временной: контекст и работа не видны одновременно.
3. **Feed: имя → стрелка.**
   Current: взгляд ведёт к → в конце строки, курсор должен вернуться к имени.
   Recommended: строка = единый target (LC-08); путь взгляда не меняется, исчезает промах курсора.

**Хорошие пути, которые нельзя ломать:** при разметке evidence взгляд ходит «карточка (левая колонка) ↔ readiness (sticky rail справа)» — короткая, постоянная, предсказуемая петля; финальный переход «последняя карточка → verdict → CTA» происходит внутри одного видимого rail без прокрутки.

---

## 9. Top 10 Relocation / Recomposition Changes

1. **LC-02** — переставить оба графика Eval к своим таблицам, rules — в конец (чистая перестановка JSX, максимальный эффект/стоимость).
2. **LC-01** — сжать summary-зону Review: figures inline, why-suggested в disclosure; первая карточка above the fold.
3. **LC-03** — убрать из main-колонки Review дубли rail-данных (confirmed count, второй статус-чип).
4. **LC-04** — компактный screen-head на всех операционных экранах (одна строка вместо трёх ярусов).
5. **LC-05** — `eval-note` под KPI band и короче.
6. **LC-11** — одноэтажный pattern switcher на Review.
7. **LC-08** — hit-area строки feed до стрелки.
8. **LC-06** — общая сетка колонок двух metric-таблиц Eval.
9. **LC-09** — инструкция разметки только у evidence-блока.
10. **LC-07** — убрать дубль «Back to review» из rail в blocked-состоянии Brief.

---

## 10. Proposed Page Composition Sketches

### Review (критический экран)

CURRENT (1280×800: fold проходит перед первой карточкой)

```
[01 EVIDENCE VALIDATION                                    ]
[Review                                                    ]
[Mark the snippets that actually belong…                   ]
[Pattern A | Pattern B | Pattern C | Pattern D  (2 строки) ]
[PAT-001][Planning][Ready]                    | Readiness  |
[H2: Imported timeline dependencies shift…    |  ✓ 5+ …    |
[AI summary paragraph                         |  ✓ Verdict |
[Why suggested                                |  ✓ 70%+ …  |
[ • reason 1                                  |  [Ready]   |
[ • reason 2                                  | Verdict    |
[ • reason 3                                  |  ◉ Valid   |
[Mentions 42 | Evidence 6/5 | Conf 86% | Up]  |  ○ …       |
[Evidence — Decide whether each quote…        | [Generate  |
------------------------------- fold ----------------------
[card 1 …                                     |   brief]   |
```

RECOMMENDED

```
[01 · Review — evidence validation             (одна строка)]
[Pattern A | Pattern B | Pattern C | Pattern D (одна строка)]
[PAT-001][Planning][Ready] · 42 mentions · 86% · Up         ]
[H2: Imported timeline dependencies shift…    | Readiness   |
[AI summary (1–2 строки)  [▸ Why suggested]   |  ✓ 5+ …     |
[Evidence — decide whether each quote belongs |  ✓ Verdict  |
[card 1: quote                                |  ✓ 70%+ …   |
[        AI reason                            | Verdict     |
[        [Belongs][Does not][Unsure][Skip]    |  ◉ Valid    |
------------------------------- fold -----------------------
[card 2 …                                     | [Generate]  |
```

### AI Eval

CURRENT

```
[Head + MOCK chip]
[Disclaimer: all values are mocked…            ]
[KPI][KPI][KPI][KPI]
[Quality metrics table                         ]
[Cost metrics table                            ]
[How I'd evaluate this in production (rules)   ]
[Quality trend chart      ][Cost by task chart ]
```

RECOMMENDED

```
[Head + MOCK chip]
[KPI][KPI][KPI][KPI]
[compact disclaimer line                       ]
[Quality metrics table                         ]
[Quality trend chart                           ]
[Cost metrics table                            ]
[Cost by task chart                            ]
[How I'd evaluate this in production (rules)   ]
```

Patterns и Brief в схемах не нуждаются: их композицию менять не требуется (кроме компактного head).

---

## 11. Do Not Move

Расположено правильно — не трогать при реализации:

- **Sticky review rail целиком** (Readiness → Verdict → CTA, 300px справа): decision context и действие соседствуют и следуют за прокруткой; порядок внутри rail повторяет последовательность решения. Это сильнейшее композиционное решение продукта.
- **Segmented decision-контрол внутри evidence-карточки**, под quote и AI reason: источник → объяснение → действие в одной рамке, нулевой eye travel.
- **Search** — правый край dataset-toolbar, вплотную к таблице: корректный dataset-scope.
- **Статистика очереди** («4 patterns · 1 ready · …») слева в том же toolbar — сводка при своём датасете.
- **Порядок колонок feed-таблицы**: identity → context (Area) → числа (Mentions, Confidence) → срочность (Trend) → Status → affordance; ширина Pattern-колонки (365px) оправдана двухстрочным содержимым.
- **KPI band выше таблиц в Eval** — сводка перед деталями.
- **Blocked-state Brief**: причины и пара действий в одном блоке.
- **`rail-blocked-note`** под CTA, который объясняет.
- **Sticky mobile-readiness-bar** на Review ≤920px; verdict внизу мобильной страницы — соответствует моменту workflow (после чтения evidence).
- **Контейнер `max-width: 1080px`**: при 4 паттернах и текущей плотности данных таблица и evidence-колонка не испытывают дефицита ширины; centering — легитимный выбор. Пересматривать только если датасет вырастет (больше колонок/плотности).
- **Отсутствие Eval в основной навигации** — задокументированное решение, не placement-дефект.

---

## 12. Implementation Order

Последовательность будущих изменений (реализация в этом аудите не начата):

1. **LC-02 + LC-05** — переупорядочивание Eval (перестановка блоков, нулевой риск, самый крупный выигрыш по adjacency).
2. **LC-03** — удаление дублей из review-figures (готовит LC-01).
3. **LC-01 + LC-11** — рекомпозиция верха Review (inline figures, disclosure для why-suggested, одноэтажный switcher); проверить fold на 1280×800.
4. **LC-04 + LC-09** — компактный screen-head и перенос инструкции; повторно замерить viewport-экономику всех экранов.
5. **LC-06, LC-07, LC-08** — точечные правки (сетка таблиц Eval, дубль действия в Brief, hit-area строки).
6. **LC-10** — проверка eval-фрейма case study после шагов 1 и 4; при необходимости поднять высоту фрейма.

После каждого шага: `npm run verify` + контрольный замер позиций fold-критичных элементов (первая evidence-карточка, KPI band) на 1280×800.

---

*Аудит только описывает изменения — код, стили и порядок компонентов не менялись. Общие UX/UI-проблемы см. в `UX_UI_AUDIT.md`; пересечения (OPS-003 hit-area, OPS-019/020 дубли индикаторов) отмечены кросс-ссылками, spatial-составляющая вынесена сюда.*
