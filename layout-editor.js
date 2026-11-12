(() => {
  'use strict';
  const STORAGE_KEY = 'wedding-decor-layout-v2';
  const defaults = window.WEDDING_LAYOUT_DEFAULTS?.layouts || {};
  const editing = new URLSearchParams(location.search).get('edit') === '1';
  const items = [...document.querySelectorAll('.decor-object, .flatlay-bouquet')];
  const profile = () => innerWidth >= 1400 ? 'desktop' : innerWidth >= 781 ? 'tablet' : 'mobile';
  let layouts = {};
  try { layouts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch {}
  if (!layouts || typeof layouts !== 'object' || Array.isArray(layouts)) layouts = {};
  let selected = null;
  let drag = null;
  let undoState = null;
  const names = {rings:'Кольца',envelope:'Конверт',flowers:'Цветы',key:'Ключик',bow:'Бант',hearts:'Сердечки','lace-tr':'Кружево (правый угол)','lace-br':'Кружево (нижний угол)',lace:'Кружево',scissors:'Ножницы',pearls:'Жемчуг',spool:'Катушка','fountain-pen':'Перьевая ручка',inkwell:'Чернильница','reply-card':'Карточка ответа','binder-clips':'Зажимы'};
  items.forEach((item, i) => {
    item.dataset.layoutId ||= 'decoration-' + String(i + 1).padStart(2, '0');
    const name = Object.keys(names).find(key => item.classList.contains('decor-' + key));
    let label = names[name] || 'Цветы с печатью';
    if (item.dataset.layoutId === 'decoration-11') label = 'Кружево (левое)';
    if (item.dataset.layoutId === 'decoration-12') label = 'Кружево (правое)';
    item.dataset.layoutName = label;
  });
  function getState(item) {
    const raw = layouts[profile()]?.[item.dataset.layoutId] || defaults[profile()]?.[item.dataset.layoutId] || {};
    const number = (value, fallback, min, max) => typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
    return {
      x: number(raw.x, 0, -10000, 10000),
      y: number(raw.y, 0, -20000, 20000),
      scale: number(raw.scale, 1, .4, 2.5),
      rotation: number(raw.rotation, 0, -180, 180),
      flipX: Boolean(raw.flipX),
      flipY: Boolean(raw.flipY)
    };
  }
  function render(item) {
    const state = getState(item);
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
    layouts[profile()][item.dataset.layoutId] = {...getState(item), ...next};
    render(item);
  }
  items.forEach(render);
  if (!editing) {
    addEventListener('resize', () => items.forEach(render));
    return;
  }
  document.documentElement.classList.add('layout-editing');
  const toolbar = document.createElement('section');
  toolbar.className = 'layout-toolbar';
  toolbar.setAttribute('aria-label', 'Редактор расстановки декора');
  toolbar.innerHTML = `
    <div class="layout-heading"><strong>Расстановка декора</strong><span id="layoutStatus" role="status">Потяните картинку мышкой</span><a href="./">Посмотреть без редактора ↗</a></div>
    <div class="layout-controls">
      <span id="layoutSelected">Выберите предмет</span>
      <label>Размер <input id="layoutScale" type="range" min="40" max="250" value="100" step="5" disabled><output id="layoutScaleValue">100%</output></label>
      <label>Поворот <input id="layoutRotation" type="range" min="-180" max="180" value="0" step="1" disabled><output id="layoutRotationValue">0°</output></label>
      <button type="button" id="layoutFlipX" disabled title="Отразить слева направо (клавиша H)">↔ Отразить</button>
      <button type="button" id="layoutFlipY" disabled title="Отразить сверху вниз (клавиша V)">↕ По вертикали</button>
      <button type="button" id="layoutReset" disabled>Вернуть предмет</button>
      <button type="button" id="layoutUndo" disabled>Отменить</button>
      <button type="button" id="layoutResetAll">Сбросить экран</button>
      <button type="button" id="layoutExport">Скачать расстановку</button>
    </div>
    <p>Положение сохраняется автоматически в этом браузере. Для телефона, планшета и компьютера — отдельные расстановки. Стрелки двигают выбранный предмет (Shift — шаг 10 px). Кнопки «↔ Отразить» (H) и «↕ По вертикали» (V) зеркалят предмет.</p>`;
  document.body.append(toolbar);
  const field = id => toolbar.querySelector('#' + id);
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts)); field('layoutStatus').textContent = 'Сохранено в браузере'; }
    catch { field('layoutStatus').textContent = 'Браузер не разрешил сохранение — скачайте расстановку'; }
  }
  function remember() { undoState = JSON.stringify(layouts); field('layoutUndo').disabled = false; }
  function controls() {
    const state = selected ? getState(selected) : {scale:1, rotation:0, flipX:false, flipY:false};
    field('layoutSelected').textContent = selected ? selected.dataset.layoutName : 'Выберите предмет';
    field('layoutScale').disabled = field('layoutRotation').disabled = field('layoutReset').disabled = field('layoutFlipX').disabled = field('layoutFlipY').disabled = !selected;
    field('layoutScale').value = state.scale * 100;
    field('layoutScaleValue').textContent = Math.round(state.scale * 100) + '%';
    field('layoutRotation').value = state.rotation;
    field('layoutRotationValue').textContent = state.rotation + '°';
    field('layoutFlipX').classList.toggle('layout-btn-active', Boolean(state.flipX));
    field('layoutFlipY').classList.toggle('layout-btn-active', Boolean(state.flipY));
  }
  function select(item) {
    selected?.classList.remove('layout-selected');
    selected = item;
    selected?.classList.add('layout-selected');
    controls();
  }
  function move(event) {
    if (!drag) return;
    drag.clientX = event.clientX; drag.clientY = event.clientY;
    const x = event.clientX + scrollX - drag.startX;
    const y = event.clientY + scrollY - drag.startY;
    const dx = Math.max(8 - drag.rect.left, Math.min(innerWidth - 8 - drag.rect.right, x));
    const dy = Math.max(8 - drag.pageTop, y);
    update(drag.item, {x:drag.state.x + dx, y:drag.state.y + dy});
  }
  function endDrag(event) {
    if (!drag || (event && event.pointerId !== drag.pointerId)) return;
    const item = drag.item;
    drag = null;
    item.classList.remove('layout-dragging');
    if (event && item.hasPointerCapture(event.pointerId)) item.releasePointerCapture(event.pointerId);
    save();
  }
  items.forEach(item => {
    const hiddenParent = item.closest('[aria-hidden="true"]');
    hiddenParent?.removeAttribute('aria-hidden');
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Переместить: ${item.dataset.layoutName}`);
    item.setAttribute('draggable', 'false');
    item.addEventListener('dragstart', event => event.preventDefault());
    item.addEventListener('focus', () => select(item));
    item.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      select(item); remember();
      item.focus({preventScroll:true});
      const rect = item.getBoundingClientRect();
      drag = {item, state:getState(item), rect, pageTop:rect.top + scrollY, startX:event.clientX + scrollX, startY:event.clientY + scrollY, pointerId:event.pointerId, clientX:event.clientX, clientY:event.clientY};
      item.classList.add('layout-dragging');
      item.setPointerCapture(event.pointerId);
      field('layoutStatus').textContent = 'Перемещаем…';
    });
    item.addEventListener('pointermove', move);
    item.addEventListener('pointerup', endDrag);
    item.addEventListener('pointercancel', endDrag);
    item.addEventListener('lostpointercapture', () => endDrag());
  });
  addEventListener('scroll', () => { if (drag) move(drag); }, {passive:true});
  for (const [id, key, divisor] of [['layoutScale','scale',100],['layoutRotation','rotation',1]]) {
    field(id).addEventListener('pointerdown', remember);
    field(id).addEventListener('keydown', event => {if(event.key.startsWith('Arrow')) remember();});
    field(id).addEventListener('input', event => {
      if (!selected) return;
      update(selected, {[key]:Number(event.target.value) / divisor}); controls(); save();
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
    remember(); delete layouts[profile()]?.[selected.dataset.layoutId]; render(selected); controls(); save();
  });
  field('layoutResetAll').addEventListener('click', () => {
    remember(); delete layouts[profile()]; items.forEach(render); controls(); save();
  });
  field('layoutUndo').addEventListener('click', () => {
    if (!undoState) return;
    const current = JSON.stringify(layouts);
    layouts = JSON.parse(undoState); undoState = current;
    items.forEach(render); controls(); save();
  });
  field('layoutExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({version:2, layouts:Object.fromEntries([...new Set([...Object.keys(defaults), ...Object.keys(layouts)])].map(key => [key, {...defaults[key], ...layouts[key]}]))}, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'wedding-decor-layout.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    field('layoutStatus').textContent = 'Файл скачан — его можно передать для переноса на сайт';
  });
  addEventListener('keydown', event => {
    if (!selected || /INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName)) return;
    const directions = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if (directions[event.key]) {
      event.preventDefault(); remember(); const [dx,dy] = directions[event.key]; const state=getState(selected); const step=event.shiftKey?10:1;
      update(selected, {x:state.x+dx*step,y:state.y+dy*step}); save();
    } else if (event.key === 'Escape') {
      endDrag(); select(null);
    } else if (event.key === 'h' || event.key === 'H' || event.key === 'р' || event.key === 'Р') {
      event.preventDefault(); remember(); const state = getState(selected);
      update(selected, { flipX: !state.flipX }); controls(); save();
    } else if (event.key === 'v' || event.key === 'V' || event.key === 'м' || event.key === 'М') {
      event.preventDefault(); remember(); const state = getState(selected);
      update(selected, { flipY: !state.flipY }); controls(); save();
    }
  });
  addEventListener('resize', () => {endDrag(); items.forEach(render); controls();});
})();
