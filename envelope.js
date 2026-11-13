/**
 * ========================================================
 * ИНТЕРАКТИВНЫЙ 3D КОНВЕРТ (INTERACTIVE ENVELOPE)
 * 1-в-1 реализация из оригинального репозитория sergeynstrk/wedding-day
 * ========================================================
 * - Сам НЕ открывается: ждёт клика пользователя на сургучную печать
 * - Основной сайт скрыт (display: none) во время показа конверта,
 *   поэтому 3D-анимация работает абсолютно плавно без микрофризов и лагов
 * - После раскрытия карточки сайт плавно появляется через GSAP fade-in
 * - Есть плавающая кнопка «✉ Конверт» для повторного просмотра
 * - Есть кнопка «Сразу к сайту ➔» и клавиша Escape для мгновенного пропуска
 */
(function initInteractiveEnvelope() {
  const overlay = document.getElementById('envelopeScreen');
  const mainSite = document.getElementById('invitation');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const skipBtn = document.getElementById('envelopeSkipBtn');
  const replayBtn = document.getElementById('envelopeReplayBtn');

  if (!overlay || !mainSite) return;

  const urlParams = new URLSearchParams(window.location.search);
  const isEditMode = urlParams.get('edit') === '1';
  const forceEnvelope = urlParams.get('envelope') === '1';

  // В режиме визуального редактора (?edit=1) конверт скрывается, если явно не задан ?envelope=1
  if (isEditMode && !forceEnvelope) {
    document.documentElement.classList.remove('envelope-active');
    overlay.style.display = 'none';
    mainSite.style.display = 'block';
    mainSite.style.opacity = '1';
    if (replayBtn) replayBtn.style.display = 'inline-flex';
    return;
  }

  let isOpening = false;
  let activeTimeline = null;

  // Исходное состояние: сайт скрыт (display: none), чтобы браузер не рендерил
  // тяжёлый коллаж и фильтры под конвертом — анимация работает ровно в 60 FPS
  document.documentElement.classList.add('envelope-active');
  document.body.classList.add('envelope-locked');
  mainSite.style.display = 'none';
  mainSite.style.opacity = '0';
  window.scrollTo(0, 0);

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

  function onOpenComplete() {
    // 1. Полностью убираем оверлей конверта
    overlay.style.display = 'none';

    // 2. Открываем основной сайт и запускаем мягкий fade-in как в оригинальном App.jsx
    document.documentElement.classList.remove('envelope-active');
    mainSite.style.display = 'block';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(mainSite, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.2, ease: "power2.out" }
      );
    } else {
      mainSite.style.opacity = '1';
    }

    // 3. Разблокируем прокрутку
    document.body.classList.remove('envelope-locked');

    // 4. Показываем плавающую кнопку повтора
    if (replayBtn) replayBtn.style.display = 'inline-flex';

    isOpening = false;
    activeTimeline = null;
  }

  function handleOpenEnvelope() {
    if (isOpening) return;
    isOpening = true;

    triggerConfetti();

    if (typeof gsap === 'undefined') {
      onOpenComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onOpenComplete();
      }
    });
    activeTimeline = tl;

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

    // 5. Раскрытие карточки приглашения на весь экран (оригинальная задержка +=1.1s)
    .to(".envelope-letter", {
      scale: 2.2,
      opacity: 0,
      duration: 0.85,
      ease: "power2.inOut"
    }, "+=1.1") 
    
    // 6. Плавный переход к главному сайту
    .to(overlay, {
      opacity: 0,
      duration: 0.6,
      ease: "linear"
    }, "-=0.3");
  }

  function instantSkip() {
    if (activeTimeline) {
      activeTimeline.kill();
      activeTimeline = null;
    }
    overlay.style.display = 'none';
    document.documentElement.classList.remove('envelope-active');
    mainSite.style.display = 'block';
    mainSite.style.opacity = '1';
    document.body.classList.remove('envelope-locked');
    if (replayBtn) replayBtn.style.display = 'inline-flex';
    isOpening = false;
  }

  function replayEnvelope() {
    if (replayBtn) replayBtn.style.display = 'none';
    isOpening = false;

    // Скрываем сайт
    document.documentElement.classList.add('envelope-active');
    mainSite.style.display = 'none';
    mainSite.style.opacity = '0';

    // Сбрасываем стили GSAP
    if (typeof gsap !== 'undefined') {
      gsap.set(".envelope-btn", { clearProps: "all" });
      gsap.set(".envelope-flap", { clearProps: "all" });
      gsap.set(".envelope-letter", { clearProps: "all" });
      gsap.set([".envelope-back", ".envelope-liner", ".envelope-front", ".envelope-flap", ".envelope-border"], { clearProps: "all" });
      gsap.set(overlay, { clearProps: "all" });
    }

    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
    document.body.classList.add('envelope-locked');
    window.scrollTo(0, 0);
  }

  // Клик ТОЛЬКО по сургучной печати (как в оригинале EnvelopeScreen)
  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleOpenEnvelope();
    });
  }

  // Быстрый пропуск «Сразу к сайту ➔»
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      instantSkip();
    });
  }

  // Повторный просмотр по кнопке «✉ Конверт»
  if (replayBtn) {
    replayBtn.addEventListener('click', replayEnvelope);
  }

  // Пропуск по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display !== 'none') {
      instantSkip();
    }
  });
})();
