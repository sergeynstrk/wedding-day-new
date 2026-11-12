/**
 * ========================================================
 * ИНТЕРАКТИВНЫЙ 3D КОНВЕРТ (INTERACTIVE ENVELOPE)
 * Перенесён из оригинального репозитория sergeynstrk/wedding-day
 * ========================================================
 * - Показывается при первом визите гостя на сайт
 * - Запоминает статус в localStorage (wedding_envelope_opened_v1)
 * - Повторный просмотр доступен по плавающей кнопке «✉ Конверт»
 * - По клику на сургуч: салют конфетти, печать исчезает,
 *   клапан откидывается назад на 180°, карточка выезжает вверх,
 *   конверт опускается вниз, а карточка распахивается на весь экран.
 */
(function initInteractiveEnvelope() {
  const STORAGE_KEY = 'wedding_envelope_opened_v1';
  const overlay = document.getElementById('envelopeScreen');
  const replayBtn = document.getElementById('envelopeReplayBtn');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const envelopeBox = document.getElementById('envelopeBox');
  const skipBtn = document.getElementById('envelopeSkipBtn');

  if (!overlay) return;

  const urlParams = new URLSearchParams(window.location.search);
  const forceEnvelope = urlParams.get('envelope') === '1';
  const isEditMode = urlParams.get('edit') === '1';

  let isOpening = false;

  function showReplayBtn() {
    if (replayBtn) replayBtn.style.display = 'inline-flex';
  }

  function hideReplayBtn() {
    if (replayBtn) replayBtn.style.display = 'none';
  }

  function unlockPage() {
    isOpening = false;
    document.body.classList.remove('envelope-locked');
    overlay.classList.add('is-hidden');
    showReplayBtn();
  }

  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#B57E78', '#D8A7A0', '#C5A059', '#E4C88A', '#ffffff'],
        ticks: 220,
        gravity: 0.75,
        scalar: 1.15
      });
    }
  }

  function handleOpenEnvelope(fast = false) {
    if (isOpening) return;
    isOpening = true;

    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      /* ignore storage quota/security errors in private mode */
    }

    if (fast || typeof gsap === 'undefined') {
      overlay.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
      unlockPage();
      return;
    }

    triggerConfetti();

    const tl = gsap.timeline({
      onComplete: () => {
        unlockPage();
      }
    });

    // 1. Исчезновение сургучной печати (z-50)
    tl.to(".envelope-btn", { 
      opacity: 0, 
      scale: 0.45, 
      duration: 0.4, 
      ease: "back.in(1.8)" 
    })

    // 2. Откидывание верхнего клапана назад (180deg)
    .to(".envelope-flap", {
      rotateX: 180,
      duration: 0.75,
      ease: "power3.inOut"
    })
    .set(".envelope-flap", { zIndex: 5 })

    // 3. Выезд пригласительной карточки вверх из кармана (z-10)
    .to(".envelope-letter", {
      y: -135,
      duration: 0.85,
      ease: "power2.out"
    })
    
    // 4. Плавное опускание ВСЕХ элементов конверта и рамочного контура
    .to([".envelope-back", ".envelope-liner", ".envelope-front", ".envelope-flap", ".envelope-border"], {
      y: 480,
      opacity: 0,
      duration: 0.75,
      ease: "power2.in"
    }, "+=0.1")
    
    .set(".envelope-letter", { zIndex: 40 })

    // 5. Раскрытие карточки приглашения на весь экран
    .to(".envelope-letter", {
      scale: 2.2,
      opacity: 0,
      duration: 0.85,
      ease: "power2.inOut"
    }, "+=0.9") 
    
    // 6. Плавный переход к главному сайту
    .to(overlay, {
      opacity: 0,
      duration: 0.6,
      ease: "linear"
    }, "-=0.3");
  }

  function resetAndOpen() {
    hideReplayBtn();
    isOpening = false;

    if (typeof gsap !== 'undefined') {
      gsap.set(".envelope-btn", { clearProps: "all" });
      gsap.set(".envelope-flap", { clearProps: "all" });
      gsap.set(".envelope-letter", { clearProps: "all" });
      gsap.set([".envelope-back", ".envelope-liner", ".envelope-front", ".envelope-flap", ".envelope-border"], { clearProps: "all" });
      gsap.set(overlay, { clearProps: "all" });
    }

    overlay.style.transition = '';
    overlay.classList.remove('is-hidden');
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
      handleOpenEnvelope(false);
    });
  }

  if (envelopeBox) {
    envelopeBox.addEventListener('click', (e) => {
      if (!isOpening) {
        handleOpenEnvelope(false);
      }
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleOpenEnvelope(true);
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', resetAndOpen);
  }

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('is-hidden')) {
      handleOpenEnvelope(true);
    }
  });
})();
