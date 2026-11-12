# Аудит приглашения — 12 ноября 2026

## Найдено и исправлено

| Проблема | Изменение |
| --- | --- |
| Одинаковые буквы и типовые прямоугольники не передавали эстетику коллажа | Разные гарнитуры, кегли, оттенки бумаги, срезы и углы наклона. Плотные антиква, гротеск, машинописный и рукописный шрифты распределены по ролям. |
| Края крупных элементов и надписей могли срезать текст | Неровности текстовых вырезок ограничены пикселями; крупные буквенные вырезки имеют отдельные контуры и внутренние поля. |
| Не хватало материальности | Прозрачная композиция с кольцами, шёлком, цветами и сургучом; отдельная объёмная печать на анкете; контактные и рассеянные тени бумажных слоёв. |
| Служебная информация терялась среди декора | На обложке выделены дата, время, площадка и ссылка на анкету. |
| Декоративная типографика использовалась в длинном тексте | Основной текст и форма набраны спокойным гротеском; выразительные шрифты оставлены для вырезок. |
| Селектор по порядку div ломал положение фотографии | Заменён селектором класса. Заметка и фотография занимают независимые колонки. |
| Декор создавал горизонтальное переполнение | Уточнены размеры и отступы на телефоне. Боковые наклейки переходят в поток на узких экранах. |
| Палитра распадалась на несколько рядов | На телефоне пять образцов собраны в устойчивую сетку. |
| Внешняя загрузка шрифтов задерживала проверку страницы | Шрифты сохранены в проект, включён font-display: swap; лицензии находятся рядом. |
| Срок ответа «до 1 ноября» уже прошёл | Убрана просроченная дата без назначения нового срока. |
| Описание покрытия дорожек относилось к неподтверждённой площадке | Заменено нейтральной заметкой об удобной обуви и тёплой одежде. |
| Модальное окно не удерживало фокус | Добавлены удержание фокуса, закрытие Escape/кликом по фону и возврат к кнопке. |

## Проверка

Chromium / Playwright: ширины 320, 375, 768 и 1440 px. На всех четырёх ширинах ширина документа совпадает с viewport; изображения загружаются после прокрутки, шрифты имеют статус loaded. Проверены сохранение RSVP в localStorage, открытие окна, удержание фокуса по Tab и закрытие Escape. Ошибок JavaScript не получено. Проверены скриншоты мобильной и настольной версий. Это адресная проверка, а не полная сертификация WCAG.

## Оставшиеся ограничения

- Фотография пары и реальная фотография усадьбы отсутствуют; текущие SVG — иллюстрации.
- Анкета сохраняется только в браузере: доставка ответов организаторам не подключена.
- Дата 19 ноября 2026 года и существующий тайминг сохранены из исходной страницы; требуют подтверждения организаторами перед рассылкой.

## Генерация декора

Инструмент: встроенный imagegen. Результат: `assets/wedding-keepsakes.png` (RGBA, прозрачный фон).

Промпт:

> Use case: product-mockup. Asset type: decorative transparent PNG for a handmade Russian wedding invitation website. Primary request: one cohesive small still-life of tactile dimensional wedding keepsakes: two intertwined realistic warm gold wedding bands, an ivory silk ribbon with loose curved tails, one dark wine red wax seal with a simple embossed heart, tiny ivory wax flowers. Three-quarter overhead studio product photography, beautiful detailed materials, natural soft shadows falling lower right, restrained vintage romantic aesthetic. Objects clustered together, fully within frame with generous transparent margin. Absolutely transparent background, no paper backdrop, no text, no letters, no watermark. Warm ivory, antique gold and burgundy palette. This is a decorative object cluster, not a poster or website mockup.

## Обновление: бордовый коллаж и единый вид сверху

По уточнению владельца: внешнее поле белое, колонка бордовая (`#681427`), акцент нежно-голубой (`#bdd9ea`). Боковые наклейки удалены. Бумажное зерно ограничено вырезками и буквами; общий фон остаётся гладким. Предыдущая композиция с наклонной перспективой заменена двумя новыми изображениями с камерой строго сверху. Синтетическая наклонная печать на форме убрана.

Генератор: встроенный imagegen. Новые файлы: `assets/wedding-rings-topdown.png`, `assets/wedding-ribbon-topdown.png`. Предыдущий файл сохранён, но страница его не использует.

Промпт колец:

> Product photography asset for a wedding paper collage website. STRICT 90-degree overhead flat lay, camera exactly perpendicular to table, orthographic looking straight down. Two polished antique gold wedding rings lying FLAT on their sides on the same horizontal surface so their round holes appear circular, not upright or tilted; softly looped ivory satin ribbon with a delicate pale powder blue silk bow beside them. A few tiny ivory wax flowers. One cohesive modest cluster with ample transparent margin, all objects fully visible. Genuine transparent background, no table surface or paper rectangle. Soft diffused upper-left light with very short contact shadows only, no long floating shadow. Photoreal tactile silk, gold, petals. Camera has no tilt, no horizon, no three-quarter perspective. No wax seal, no text, no letters, no watermark. Ivory, gold and delicate powder blue. Horizontal composition.

Промпт ленты и печати:

> Photoreal wedding keepsake composition for a handmade paper collage website. STRICT 90-degree overhead flat lay: camera exactly perpendicular to the table, looking directly DOWN, all objects lying flat in a single horizontal plane. Small folded ivory silk ribbon bow with pale powder blue loose tails, dried ivory rose and tiny cream blossom sprig, one deep burgundy circular wax seal stamped with a simple heart and a short cream pearl strand gently curved. Seal seen as a circle from directly above, not an ellipse. One cohesive small flat arrangement, fully in frame, generous transparent margin. Genuine transparent background, no table texture or colored rectangle. Soft diffused lighting from upper-left, small short contact shadows. No camera tilt, no three-quarter perspective, no raised upright flowers. Restrained elegant tactile silk and real wax. No text or letters, no watermark. Vertical composition.

Повторная проверка после смены палитры: Chromium, 320/375/768/1440 px; горизонтального переполнения нет, все изображения и шрифты загружены, ошибок JavaScript нет. Повторно проверены сохранение анкеты, фокус модального окна и Escape. Новые PNG имеют прозрачный альфа-канал; обе композиции осмотрены перед добавлением.

## Изображения из предоставленной папки reference

В дресс-код добавлены фотографии бордового платья women-02.webp и костюма men-03.webp. Четыре простые иконки расписания заменены детальными SVG из того же источника. Рабочие копии и описание происхождения лежат в `assets/reference/`. Фотографии посторонней пары и условная фотография площадки не используются как фотографии Сергея, Юли или Братцево. Повторная проверка Chromium на четырёх ширинах пройдена: отсутствуют переполнение, битые изображения и ошибки JavaScript.

## Иконка реальной усадьбы Братцево

По фотографии пользователя создана чёрно-белая контурная иллюстрация в стиле предоставленных иконок тайминга. Файл `assets/bratsevo-icon.png`, промпт и происхождение — `assets/bratsevo-icon-prompt.md`. Иллюстрация используется в блоке площадки и вместо часовни у сбора гостей. Сохранены купол, фронтон, арка, балкон, колонны и протяжённые крылья. Проверены загрузка изображения и отсутствие горизонтального переполнения на 320/375/768/1440 px; блок площадки осмотрен на мобильном скриншоте.

## Плотная композиция со свадебными предметами

По просьбе увеличить количество и масштаб декора созданы девять отдельных прозрачных изображений: конверт с сургучом, голубой бант, белые цветы и лепестки, жемчужная нить, старинный ключик, кружево, бумажные сердца, винтажные ножницы и катушка голубой ленты. Генератор — встроенный imagegen; точные промпты и файлы в `assets/keepsakes/README.md`.

С учётом ранее созданных колец и цветочной композиции на широком экране размещено 19 декоративных элементов. Для них предусмотрены боковые поля; кружево частично уходит под лист дресс-кода. На экранах до 1100 px убраны дополнительные повторы, а основные предметы переходят в отдельные композиции между блоками. На телефоне предметы крупные и частично перекрывают друг друга внутри специально выделенных областей.

Chromium / Playwright: 320, 375, 768, 1440 px — без горизонтального переполнения, битых видимых изображений и ошибок JavaScript; шрифты загружены. Проверены сохранение анкеты, фокус модального окна и Escape. Девять новых PNG имеют альфа-канал. Декор осмотрен на бордовом фоне, затем проверены полные скриншоты мобильной и настольной версий.
