/**
 * ========================================================
 * ИНТЕРАКТИВНЫЙ КОНВЕРТ (INTERACTIVE ENVELOPE)
 * ========================================================
 * - Показывается при первом визите гостя на сайт
 * - Запоминает статус в localStorage (wedding_envelope_opened_v1)
 * - Повторный просмотр доступен по плавающей кнопке «✉ Конверт»
 * - Поддерживает пропуск «Сразу к сайту ➔» и клавишу Escape
 * - Параметр ?envelope=1 принудительно открывает конверт для теста
 */
(function initInteractiveEnvelope() {
  const STORAGE_KEY = 'wedding_envelope_opened_v1';
  const overlay = document.getElementById('envelopeOverlay');
  const replayBtn = document.getElementById('envelopeReplayBtn');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const envelopeCard = document.getElementById('envelopeCard');
  const skipBtn = document.getElementById('envelopeSkipBtn');

  if (!overlay) return;

  const urlParams = new URLSearchParams(window.location.search);
  const forceEnvelope = urlParams.get('envelope') === '1';
  const isEditMode = urlParams.get('edit') === '1';

  function showReplayBtn() {
    if (replayBtn) replayBtn.style.display = 'inline-flex';
  }

  function hideReplayBtn() {
    if (replayBtn) replayBtn.style.display = 'none';
  }

  function unlockPage() {
    document.body.classList.remove('envelope-locked');
    overlay.classList.add('is-hidden');
    overlay.classList.remove('is-opening');
    showReplayBtn();
  }

  function openEnvelope(fast = false) {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      /* ignore storage quota/security errors in private mode */
    }

    if (fast) {
      overlay.style.transition = 'opacity 0.25s ease, visibility 0.25s ease';
      unlockPage();
      return;
    }

    overlay.classList.add('is-opening');
    setTimeout(() => {
      unlockPage();
    }, 850);
  }

  function resetAndOpen() {
    hideReplayBtn();
    overlay.style.transition = '';
    overlay.classList.remove('is-hidden', 'is-opening');
    document.body.classList.add('envelope-locked');
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (waxSealBtn) waxSealBtn.focus();
  }

  // Проверка первого визита
  let alreadyOpened = false;
  try {
    alreadyOpened = localStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {}

  // В режиме редактора (?edit=1) скрываем конверт, если явно не запрошен ?envelope=1
  if (isEditMode && !forceEnvelope) {
    alreadyOpened = true;
  }

  if (forceEnvelope) {
    alreadyOpened = false;
  }

  if (alreadyOpened) {
    overlay.classList.add('is-hidden');
    showReplayBtn();
  } else {
    document.body.classList.add('envelope-locked');
  }

  // Слушатели событий
  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope(false);
    });
  }

  if (envelopeCard) {
    envelopeCard.addEventListener('click', () => {
      openEnvelope(false);
    });
    envelopeCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope(false);
      }
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope(true);
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', resetAndOpen);
  }

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('is-hidden')) {
      openEnvelope(true);
    }
  });
})();
