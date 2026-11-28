(() => {
  'use strict';
  const STORAGE_KEY = 'wedding-decor-layout-v6';
  const defaults = window.WEDDING_LAYOUT_DEFAULTS?.layouts || {};
  const editing = new URLSearchParams(location.search).get('edit') === '1';
  const canvas = document.querySelector('.magazine-canvas');
  const profile = () => innerWidth >= 781 ? 'desktop' : 'mobile';

  const STICKER_CATALOG = [
    { src: './assets/wedding-rings-topdown.webp', name: 'Кольца' },
    { src: './assets/keepsakes/envelope.webp', name: 'Конверт' },
    { src: './assets/keepsakes/hearts.webp', name: 'Сердечки' },
    { src: './assets/keepsakes/pearls.webp', name: 'Жемчуг' },
    { src: './assets/keepsakes/flowers.webp', name: 'Цветы' },
    { src: './assets/keepsakes/key.webp', name: 'Ключик' },
    { src: './assets/keepsakes/bow.webp', name: 'Бант' },
    { src: './assets/keepsakes/lace.webp', name: 'Кружево' },
    { src: './assets/keepsakes/lace-corner.webp', name: 'Кружевной уголок' },
    { src: './assets/keepsakes/lace-strip.webp', name: 'Кружевная лента' },
    { src: './assets/keepsakes/lace-oval.webp', name: 'Ажурный овал' },
    { src: './assets/keepsakes/lace-bow-corner.webp', name: 'Уголок с бантом' },
    { src: './assets/keepsakes/lace-edge-vertical.webp', name: 'Вертикальная кайма' },
    { src: './assets/keepsakes/spool.webp', name: 'Катушка' },
    { src: './assets/wedding-ribbon-topdown.webp', name: 'Цветы с печатью' },
    { src: './assets/keepsakes/fountain-pen.webp', name: 'Перьевая ручка' },
    { src: './assets/keepsakes/inkwell.webp', name: 'Чернильница' },
    { src: './assets/keepsakes/reply-card.webp', name: 'Карточка ответа' },
    { src: './assets/keepsakes/binder-clips.webp', name: 'Зажимы' },
    { src: './assets/keepsakes/wax-seal.webp', name: 'Сургучная печать' },
    { src: './assets/keepsakes/paper-pin.webp', name: 'Скрепка' },
    { src: './assets/cat-sticker.webp', name: 'Кот в шляпе' }
  ];

  let layouts = {};
  if (editing) {
    try { layouts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch {}
    if (!layouts || typeof layouts !== 'object' || Array.isArray(layouts)) layouts = {};
  }

  let customLayer = canvas?.querySelector('.custom-decor-layer') || null;
  function ensureCustomLayer() {
    if (!customLayer && canvas) {
      customLayer = document.createElement('div');
      customLayer.className = 'custom-decor-layer';
      customLayer.setAttribute('aria-hidden', 'true');
      canvas.append(customLayer);
    }
    return customLayer;
  }

  const items = [...document.querySelectorAll('.decor-object, .flatlay-bouquet')];
  let selected = null;
  let drag = null;
  let undoState = null;

  const names = {
    rings: 'Кольца', envelope: 'Конверт', flowers: 'Цветы', key: 'Ключик', bow: 'Бант',
    hearts: 'Сердечки', lace: 'Кружево', 'lace-corner': 'Кружевной уголок с розами',
    'lace-strip': 'Кружевная лента', 'lace-oval': 'Ажурный овал',
    'lace-bow-corner': 'Уголок кружева с бантом', 'lace-vertical': 'Вертикальная кружевная кайма',
    pearls: 'Жемчуг', spool: 'Катушка', 'fountain-pen': 'Перьевая ручка',
    inkwell: 'Чернильница', 'reply-card': 'Карточка ответа', 'binder-clips': 'Зажимы',
    cat: 'Кот в шляпе'
  };

  items.forEach((item, i) => {
    item.dataset.layoutId ||= 'decoration-' + String(i + 1).padStart(2, '0');
    const name = Object.keys(names).find(key => item.classList.contains('decor-' + key));
    let label = names[name] || 'Цветы с печатью';
    if (item.dataset.layoutId === 'decoration-11') label = 'Кружево (левое)';
    if (item.dataset.layoutId === 'decoration-12') label = 'Кружево (правое)';
    if (item.dataset.layoutId === 'decoration-16' || item.classList.contains('decor-cat')) label = 'Кот в шляпе (стикер)';
    item.dataset.layoutName = label;
  });

  const itemThumbSrc = it => (it.tagName === 'IMG' ? it.getAttribute('src') : it.querySelector('img')?.getAttribute('src')) || '';

  function getRawState(id) {
    return layouts[profile()]?.[id] || defaults[profile()]?.[id] || {};
  }

  function getState(item) {
    const raw = getRawState(item.dataset.layoutId);
    const number = (value, fallback, min, max) => typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
    const state = {
      x: number(raw.x, 0, -10000, 10000),
      y: number(raw.y, 0, -20000, 20000),
      scale: number(raw.scale, 1, .4, 2.5),
      rotation: number(raw.rotation, 0, -180, 180),
      flipX: Boolean(raw.flipX),
      flipY: Boolean(raw.flipY),
      hidden: Boolean(raw.hidden)
    };
    if (item.dataset.layoutCustom === '1') {
      state.src = raw.src || item.getAttribute('src') || '';
      state.name = raw.name || item.dataset.layoutName || 'Стикер';
    }
    return state;
  }

  function render(item) {
    const id = item.dataset.layoutId;
    if (item.dataset.layoutCustom === '1') {
      const existsInProfile = Boolean(layouts[profile()]?.[id] || defaults[profile()]?.[id]);
      if (!existsInProfile) {
        item.style.display = 'none';
        return;
      }
    }
    const state = getState(item);
    item.style.display = state.hidden ? 'none' : '';
    item.style.translate = `${state.x}px ${state.y}px`;
    const sx = (state.flipX ? -1 : 1) * state.scale;
    const sy = (state.flipY ? -1 : 1) * state.scale;
    if (state.flipX || state.flipY) {
      item.style.scale = `${sx} ${sy}`;
    } else {
      item.style.scale = state.scale;
    }
    item.style.rotate = `${state.rotation}deg`;
  }

  function update(item, next) {
    layouts[profile()] ||= {};
    layouts[profile()][item.dataset.layoutId] = { ...getState(item), ...next };
    render(item);
  }

  function bindItemEvents(item) {
    if (!editing || item.dataset.layoutBound === '1') return;
    item.dataset.layoutBound = '1';
    const hiddenParent = item.closest('[aria-hidden="true"]');
    hiddenParent?.removeAttribute('aria-hidden');
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Переместить: ${item.dataset.layoutName}`);
    item.setAttribute('draggable', 'false');
    item.addEventListener('dragstart', event => event.preventDefault());
    item.addEventListener('contextmenu', event => event.preventDefault());
    item.addEventListener('focus', () => select(item));

    item.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      startDrag(item, event.clientX, event.clientY, event.pointerId);
    });

    item.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      event.preventDefault();
      event.stopPropagation();
      startDrag(item, touch.clientX, touch.clientY, touch.identifier);
    }, { passive: false });
  }

  function createCustomElement(id, entry) {
    const existing = items.find(el => el.dataset.layoutId === id);
    if (existing) return existing;
    const layer = ensureCustomLayer();
    if (!layer || !entry?.src) return null;
    const img = document.createElement('img');
    img.className = 'decor-object decor-custom';
    img.src = entry.src;
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.dataset.layoutId = id;
    img.dataset.layoutName = entry.name || 'Стикер';
    img.dataset.layoutCustom = '1';
    layer.append(img);
    items.push(img);
    bindItemEvents(img);
    return img;
  }

  function syncCustomElements() {
    const combined = { ...(defaults[profile()] || {}), ...(layouts[profile()] || {}) };
    Object.entries(combined).forEach(([id, entry]) => {
      if (entry && typeof entry === 'object' && entry.src && !items.some(el => el.dataset.layoutId === id)) {
        createCustomElement(id, entry);
      }
    });
  }

  syncCustomElements();
  items.forEach(render);

  if (!editing) {
    addEventListener('resize', () => {
      syncCustomElements();
      items.forEach(render);
    });
    return;
  }

  if (!document.querySelector('link[href="layout-editor.css"]')) {
    const editorStyles = document.createElement('link');
    editorStyles.rel = 'stylesheet';
    editorStyles.href = 'layout-editor.css';
    document.head.append(editorStyles);
  }
  document.documentElement.classList.add('layout-editing');

  const toolbar = document.createElement('section');
  toolbar.className = 'layout-toolbar layout-catalog-collapsed';
  toolbar.setAttribute('aria-label', 'Редактор расстановки декора');
  toolbar.innerHTML = `
    <div class="layout-heading">
      <strong>Расстановка декора</strong>
      <span id="layoutStatus" role="status">Потяните предмет или добавьте новый</span>
      <button type="button" id="layoutToggleCatalog" class="layout-btn-mini" aria-expanded="false">+ Добавить стикер ▼</button>
      <button type="button" id="layoutToggleGallery" class="layout-btn-mini" aria-expanded="true">На странице ▲</button>
      <button type="button" id="layoutTogglePanel" class="layout-btn-mini" aria-expanded="true">Свернуть ▼</button>
      <a href="./">Без редактора ↗</a>
    </div>
    <div class="layout-body" id="layoutToolbarBody">
      <div class="layout-controls">
        <select id="layoutItemSelect" aria-label="Выбрать предмет"></select>
        <div class="layout-nudge-group">
          <button type="button" id="nudgeUp" title="Вверх (10px)" aria-label="Сдвинуть вверх на 10px" disabled>↑</button>
          <button type="button" id="nudgeDown" title="Вниз (10px)" aria-label="Сдвинуть вниз на 10px" disabled>↓</button>
          <button type="button" id="nudgeLeft" title="Влево (10px)" aria-label="Сдвинуть влево на 10px" disabled>←</button>
          <button type="button" id="nudgeRight" title="Вправо (10px)" aria-label="Сдвинуть вправо на 10px" disabled>→</button>
        </div>
        <label>Размер <input id="layoutScale" type="range" min="40" max="250" value="100" step="5" disabled><output id="layoutScaleValue">100%</output></label>
        <label>Поворот <input id="layoutRotation" type="range" min="-180" max="180" value="0" step="1" disabled><output id="layoutRotationValue">0°</output></label>
        <button type="button" id="layoutFlipX" disabled title="Отразить слева направо (клавиша H)">↔ Отразить</button>
        <button type="button" id="layoutFlipY" disabled title="Отразить сверху вниз (клавиша V)">↕ По вертикали</button>
        <button type="button" id="layoutDuplicate" disabled title="Создать копию выбранного стикера">⧉ Дублировать</button>
        <button type="button" id="layoutDelete" disabled title="Удалить или вернуть стикер (Delete)">🗑 Удалить</button>
        <button type="button" id="layoutReset" disabled>Вернуть предмет</button>
        <button type="button" id="layoutUndo" disabled>Отменить</button>
        <button type="button" id="layoutResetAll">Сбросить экран</button>
        <button type="button" id="layoutExport">Скачать расстановку</button>
      </div>
      <div class="layout-catalog" id="layoutCatalog" role="list" aria-label="Библиотека стикеров для добавления">
        ${STICKER_CATALOG.map((st, idx) => `
          <div class="layout-catalog-card" role="listitem" title="Добавить: ${st.name}">
            <button type="button" class="layout-catalog-add" data-catalog-index="${idx}" aria-label="Добавить стикер: ${st.name}">
              <img src="${st.src}" alt="" width="48" height="44" loading="lazy" decoding="async">
              <span>${st.name}</span>
            </button>
            <span class="layout-catalog-plus" aria-hidden="true">+</span>
          </div>
        `).join('')}
      </div>
      <div class="layout-gallery" id="layoutGallery" role="list" aria-label="Стикеры на странице"></div>
      <p>Нажмите «+ Добавить стикер», чтобы добавить новый или повторный стикер, либо «⧉ Дублировать» для копии выбранного. Положение сохраняется в браузере автоматически.</p>
    </div>`;
  document.body.append(toolbar);
  const field = id => toolbar.querySelector('#' + id);

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts)); field('layoutStatus').textContent = 'Сохранено в браузере'; }
    catch { field('layoutStatus').textContent = 'Браузер не разрешил сохранение — скачайте расстановку'; }
  }
  function remember() { undoState = JSON.stringify(layouts); field('layoutUndo').disabled = false; }

  function visibleItemsForProfile() {
    const combined = { ...(defaults[profile()] || {}), ...(layouts[profile()] || {}) };
    return items.filter(it => it.dataset.layoutCustom !== '1' || Boolean(combined[it.dataset.layoutId]));
  }

  function rebuildItemLists() {
    const activeItems = visibleItemsForProfile();
    const selectEl = field('layoutItemSelect');
    if (selectEl) {
      selectEl.innerHTML = `<option value="">-- Выберите предмет --</option>` +
        activeItems.map(it => `<option value="${it.dataset.layoutId}">${it.dataset.layoutName}</option>`).join('');
      selectEl.value = selected ? selected.dataset.layoutId : '';
    }
    const galleryEl = field('layoutGallery');
    if (galleryEl) {
      galleryEl.innerHTML = activeItems.map(it => `
        <div class="layout-thumb" role="listitem" data-thumb-id="${it.dataset.layoutId}" title="${it.dataset.layoutName}">
          <button type="button" class="layout-thumb-pick" aria-label="Выбрать: ${it.dataset.layoutName}">
            <img src="${itemThumbSrc(it)}" alt="" width="48" height="44" loading="lazy" decoding="async">
            <span>${it.dataset.layoutName}</span>
          </button>
          <button type="button" class="layout-thumb-action" aria-label="Удалить: ${it.dataset.layoutName}" title="Удалить стикер">×</button>
        </div>
      `).join('');
    }
  }

  function controls() {
    const state = selected ? getState(selected) : { scale: 1, rotation: 0, flipX: false, flipY: false, hidden: false };
    if (field('layoutItemSelect')) field('layoutItemSelect').value = selected ? selected.dataset.layoutId : '';
    ['nudgeUp', 'nudgeDown', 'nudgeLeft', 'nudgeRight'].forEach(id => { if (field(id)) field(id).disabled = !selected; });
    field('layoutScale').disabled = field('layoutRotation').disabled = field('layoutReset').disabled =
      field('layoutFlipX').disabled = field('layoutFlipY').disabled = field('layoutDelete').disabled =
      field('layoutDuplicate').disabled = !selected;
    field('layoutDelete').textContent = state.hidden ? '↩ Вернуть' : '🗑 Удалить';
    field('layoutDelete').classList.toggle('layout-btn-active', Boolean(selected && state.hidden));
    field('layoutScale').value = state.scale * 100;
    field('layoutScaleValue').textContent = Math.round(state.scale * 100) + '%';
    field('layoutRotation').value = state.rotation;
    field('layoutRotationValue').textContent = state.rotation + '°';
    field('layoutFlipX').classList.toggle('layout-btn-active', Boolean(state.flipX));
    field('layoutFlipY').classList.toggle('layout-btn-active', Boolean(state.flipY));
    toolbar.querySelectorAll('.layout-thumb').forEach(card => {
      const it = items.find(el => el.dataset.layoutId === card.dataset.thumbId);
      if (!it) return;
      const st = getState(it);
      card.classList.toggle('is-selected', it === selected);
      card.classList.toggle('is-hidden', st.hidden);
      const act = card.querySelector('.layout-thumb-action');
      if (act) {
        act.textContent = st.hidden ? '↩' : '×';
        act.title = st.hidden ? 'Вернуть стикер' : 'Удалить стикер';
        act.setAttribute('aria-label', `${st.hidden ? 'Вернуть' : 'Удалить'}: ${it.dataset.layoutName}`);
      }
    });
  }

  function select(item) {
    selected?.classList.remove('layout-selected');
    selected = item;
    selected?.classList.add('layout-selected');
    controls();
  }

  function nextCustomId() {
    let maxNum = 0;
    const allIds = new Set([
      ...items.map(it => it.dataset.layoutId),
      ...Object.keys(layouts.desktop || {}),
      ...Object.keys(layouts.mobile || {}),
      ...Object.keys(defaults.desktop || {}),
      ...Object.keys(defaults.mobile || {})
    ]);
    allIds.forEach(id => {
      const m = /^custom-(\d+)$/.exec(id);
      if (m) maxNum = Math.max(maxNum, Number(m[1]));
    });
    return 'custom-' + String(maxNum + 1).padStart(2, '0');
  }

  function spawnSticker(src, baseName, initialState) {
    if (!canvas || !src) return;
    remember();
    const id = nextCustomId();
    const sameCount = visibleItemsForProfile().filter(it => itemThumbSrc(it) === src).length;
    const label = sameCount > 0 ? `${baseName} #${sameCount + 1}` : baseName;
    const canvasRect = canvas.getBoundingClientRect();
    const size = profile() === 'desktop' ? 220 : 90;
    const defaultX = Math.round(Math.max(16, (canvasRect.width - size) / 2));
    const defaultY = Math.round(Math.max(40, -canvasRect.top + window.innerHeight * 0.35));
    const entry = {
      x: initialState?.x ?? defaultX,
      y: initialState?.y ?? defaultY,
      scale: initialState?.scale ?? 0.9,
      rotation: initialState?.rotation ?? 0,
      flipX: Boolean(initialState?.flipX),
      flipY: Boolean(initialState?.flipY),
      hidden: false,
      src,
      name: label
    };
    const el = createCustomElement(id, entry);
    if (!el) return;
    layouts[profile()] ||= {};
    layouts[profile()][id] = entry;
    render(el);
    rebuildItemLists();
    select(el);
    field('layoutStatus').textContent = 'Добавлен: ' + label;
    save();
  }

  function startDrag(item, clientX, clientY, identifier) {
    select(item);
    remember();
    const rect = item.getBoundingClientRect();
    drag = {
      item,
      state: getState(item),
      rect,
      pageTop: rect.top + window.scrollY,
      startX: clientX + window.scrollX,
      startY: clientY + window.scrollY,
      identifier
    };
    item.classList.add('layout-dragging');
    field('layoutStatus').textContent = 'Перемещаем: ' + item.dataset.layoutName;
  }

  function doMove(clientX, clientY) {
    if (!drag) return;
    const x = clientX + window.scrollX - drag.startX;
    const y = clientY + window.scrollY - drag.startY;
    const dx = Math.max(8 - drag.rect.left, Math.min(window.innerWidth - 8 - drag.rect.right, x));
    const dy = Math.max(8 - drag.pageTop, y);
    update(drag.item, { x: Math.round(drag.state.x + dx), y: Math.round(drag.state.y + dy) });
  }

  function finishDrag() {
    if (!drag) return;
    const item = drag.item;
    drag = null;
    item.classList.remove('layout-dragging');
    field('layoutStatus').textContent = 'Сохранено';
    save();
  }

  items.forEach(bindItemEvents);

  window.addEventListener('pointermove', event => {
    if (!drag || drag.identifier !== event.pointerId) return;
    doMove(event.clientX, event.clientY);
  });
  window.addEventListener('pointerup', event => {
    if (!drag || drag.identifier !== event.pointerId) return;
    finishDrag();
  });
  window.addEventListener('pointercancel', event => {
    if (!drag || drag.identifier !== event.pointerId) return;
    finishDrag();
  });
  window.addEventListener('touchmove', event => {
    if (!drag) return;
    const touch = [...event.touches].find(t => t.identifier === drag.identifier);
    if (!touch) return;
    event.preventDefault();
    doMove(touch.clientX, touch.clientY);
  }, { passive: false });
  window.addEventListener('touchend', event => {
    if (!drag) return;
    const stillTouching = [...event.touches].some(t => t.identifier === drag.identifier);
    if (!stillTouching) finishDrag();
  });
  window.addEventListener('touchcancel', () => {
    if (drag) finishDrag();
  });

  field('layoutToggleCatalog')?.addEventListener('click', () => {
    const collapsed = toolbar.classList.toggle('layout-catalog-collapsed');
    field('layoutToggleCatalog').textContent = collapsed ? '+ Добавить стикер ▼' : '+ Добавить стикер ▲';
    field('layoutToggleCatalog').setAttribute('aria-expanded', String(!collapsed));
  });
  field('layoutToggleGallery')?.addEventListener('click', () => {
    const hidden = toolbar.classList.toggle('layout-gallery-collapsed');
    field('layoutToggleGallery').textContent = hidden ? 'На странице ▼' : 'На странице ▲';
    field('layoutToggleGallery').setAttribute('aria-expanded', String(!hidden));
  });
  field('layoutTogglePanel')?.addEventListener('click', () => {
    const isCollapsed = toolbar.classList.toggle('layout-toolbar-collapsed');
    field('layoutTogglePanel').textContent = isCollapsed ? 'Развернуть ▲' : 'Свернуть ▼';
    field('layoutTogglePanel').setAttribute('aria-expanded', String(!isCollapsed));
  });

  field('layoutCatalog')?.addEventListener('click', event => {
    const btn = event.target.closest('.layout-catalog-add');
    if (!btn) return;
    const entry = STICKER_CATALOG[Number(btn.dataset.catalogIndex)];
    if (entry) spawnSticker(entry.src, entry.name);
  });

  field('layoutDuplicate')?.addEventListener('click', () => {
    if (!selected || !canvas) return;
    const src = itemThumbSrc(selected);
    const baseName = (selected.dataset.layoutName || 'Стикер').replace(/\s*#\d+$/, '');
    const st = getState(selected);
    const canvasRect = canvas.getBoundingClientRect();
    const selRect = selected.getBoundingClientRect();
    const size = profile() === 'desktop' ? 220 : 90;
    const x = selected.dataset.layoutCustom === '1'
      ? Math.round(st.x + 28)
      : Math.round((selRect.left - canvasRect.left) + (selRect.width - size) / 2 + 28);
    const y = selected.dataset.layoutCustom === '1'
      ? Math.round(st.y + 28)
      : Math.round((selRect.top - canvasRect.top) + (selRect.height - size) / 2 + 28);
    spawnSticker(src, baseName, {
      x, y, scale: st.scale, rotation: st.rotation, flipX: st.flipX, flipY: st.flipY
    });
  });

  function toggleHidden(item, forceHidden) {
    if (!item) return;
    remember();
    const state = getState(item);
    const nextHidden = typeof forceHidden === 'boolean' ? forceHidden : !state.hidden;
    update(item, { hidden: nextHidden });
    if (nextHidden && selected === item) {
      field('layoutStatus').textContent = 'Удалён: ' + item.dataset.layoutName;
    } else if (!nextHidden) {
      select(item);
      field('layoutStatus').textContent = 'Возвращён: ' + item.dataset.layoutName;
    }
    controls();
    save();
  }

  field('layoutGallery')?.addEventListener('click', event => {
    const card = event.target.closest('.layout-thumb');
    if (!card) return;
    const targetItem = items.find(it => it.dataset.layoutId === card.dataset.thumbId);
    if (!targetItem) return;
    if (event.target.closest('.layout-thumb-action')) {
      toggleHidden(targetItem);
      return;
    }
    if (getState(targetItem).hidden) {
      toggleHidden(targetItem, false);
    } else {
      select(targetItem);
    }
    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  field('layoutDelete')?.addEventListener('click', () => {
    toggleHidden(selected);
  });

  field('layoutItemSelect')?.addEventListener('change', event => {
    const id = event.target.value;
    const targetItem = items.find(it => it.dataset.layoutId === id);
    if (targetItem) {
      select(targetItem);
      targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      select(null);
    }
  });

  const nudge = (dx, dy) => {
    if (!selected) return;
    remember();
    const state = getState(selected);
    update(selected, { x: state.x + dx, y: state.y + dy });
    save();
  };
  field('nudgeUp')?.addEventListener('click', () => nudge(0, -10));
  field('nudgeDown')?.addEventListener('click', () => nudge(0, 10));
  field('nudgeLeft')?.addEventListener('click', () => nudge(-10, 0));
  field('nudgeRight')?.addEventListener('click', () => nudge(10, 0));

  for (const [id, key, divisor] of [['layoutScale', 'scale', 100], ['layoutRotation', 'rotation', 1]]) {
    field(id).addEventListener('pointerdown', remember);
    field(id).addEventListener('keydown', event => { if (event.key.startsWith('Arrow')) remember(); });
    field(id).addEventListener('input', event => {
      if (!selected) return;
      update(selected, { [key]: Number(event.target.value) / divisor });
      controls();
      save();
    });
  }

  field('layoutFlipX').addEventListener('click', () => {
    if (!selected) return;
    remember();
    const state = getState(selected);
    update(selected, { flipX: !state.flipX });
    controls();
    save();
  });
  field('layoutFlipY').addEventListener('click', () => {
    if (!selected) return;
    remember();
    const state = getState(selected);
    update(selected, { flipY: !state.flipY });
    controls();
    save();
  });

  field('layoutReset').addEventListener('click', () => {
    if (!selected) return;
    remember();
    delete layouts[profile()]?.[selected.dataset.layoutId];
    render(selected);
    rebuildItemLists();
    if (selected.dataset.layoutCustom === '1' && !defaults[profile()]?.[selected.dataset.layoutId]) {
      select(null);
    } else {
      controls();
    }
    save();
  });

  field('layoutResetAll').addEventListener('click', () => {
    if (!window.confirm('Сбросить расстановку всех элементов на этом экране?')) return;
    remember();
    delete layouts[profile()];
    items.forEach(render);
    rebuildItemLists();
    select(null);
    save();
  });

  field('layoutUndo').addEventListener('click', () => {
    if (!undoState) return;
    const current = JSON.stringify(layouts);
    layouts = JSON.parse(undoState);
    undoState = current;
    syncCustomElements();
    items.forEach(render);
    rebuildItemLists();
    controls();
    save();
  });

  field('layoutExport').addEventListener('click', () => {
    const mergedLayouts = Object.fromEntries(
      [...new Set([...Object.keys(defaults), ...Object.keys(layouts)])].map(key => [
        key,
        { ...defaults[key], ...layouts[key] }
      ])
    );
    const blob = new Blob([JSON.stringify({ version: 2, layouts: mergedLayouts }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding-decor-layout.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    field('layoutStatus').textContent = 'Файл скачан — его можно передать для переноса на сайт';
  });

  addEventListener('keydown', event => {
    if (!selected || /INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName)) return;
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (directions[event.key]) {
      event.preventDefault();
      remember();
      const [dx, dy] = directions[event.key];
      const state = getState(selected);
      const step = event.shiftKey ? 10 : 1;
      update(selected, { x: state.x + dx * step, y: state.y + dy * step });
      save();
    } else if (event.key === 'Escape') {
      finishDrag();
      select(null);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      toggleHidden(selected, true);
    } else if (event.key === 'h' || event.key === 'H' || event.key === 'р' || event.key === 'Р') {
      event.preventDefault();
      remember();
      const state = getState(selected);
      update(selected, { flipX: !state.flipX });
      controls();
      save();
    } else if (event.key === 'v' || event.key === 'V' || event.key === 'м' || event.key === 'М') {
      event.preventDefault();
      remember();
      const state = getState(selected);
      update(selected, { flipY: !state.flipY });
      controls();
      save();
    }
  });

  addEventListener('resize', () => {
    finishDrag();
    syncCustomElements();
    items.forEach(render);
    rebuildItemLists();
    controls();
  });

  rebuildItemLists();
  controls();
})();
