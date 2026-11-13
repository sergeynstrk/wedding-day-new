/** Entry envelope: open the wax seal to reveal the invitation. */
(() => {
  'use strict';
  const overlay = document.getElementById('envelopeScreen');
  const main = document.getElementById('invitation');
  const seal = document.getElementById('waxSealBtn');
  const box = document.getElementById('envelopeBox');
  const hint = document.getElementById('envelopeOpenHint');
  if (!overlay || !main || !seal || !box || !hint) {
    document.documentElement.classList.remove('envelope-active');
    return;
  }
  const params = new URLSearchParams(location.search);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const find = selector => overlay.querySelector(selector);
  const parts = ['.envelope-btn', '.envelope-flap', '.envelope-flap-liner', '.envelope-letter',
    '.envelope-back', '.envelope-liner', '.envelope-front', '.envelope-border', '.envelope-intro'].map(find);
  // Prepare the cover while the envelope is on screen, so it does not pop in later.
  const coverReady = Promise.allSettled([
    document.fonts.ready,
    ...[...main.querySelectorAll('.hero-section img')].map(image => {
      image.loading = 'eager';
      return image.decode();
    })
  ]);
  const stationery = ['.envelope-back', '.envelope-liner', '.envelope-front', '.envelope-flap', '.envelope-border'].map(find);
  let animation = null;
  let opening = false;
  let visible = false;
  const background = () => [main, document.querySelector('.layout-toolbar'), document.querySelector('.skip-link')].filter(Boolean);

  function cancelAnimation() {
    animation?.kill();
    animation = null;
    if (window.gsap) gsap.killTweensOf([main, overlay, ...parts]);
  }
  function reveal() {
    if (!visible) return;
    cancelAnimation();
    visible = false;
    opening = false;
    overlay.hidden = true;
    overlay.removeAttribute('aria-busy');
    document.documentElement.classList.remove('envelope-active', 'envelope-revealing');
    document.body.classList.remove('envelope-locked');
    background().forEach(element => { element.inert = false; });
    main.style.opacity = '1';
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }
  function celebrate() {
    if (reducedMotion.matches || typeof window.confetti !== 'function') return;
    confetti({ particleCount: 30, spread: 65, origin: { y: .65 },
      colors: ['#681427', '#bdd5e2', '#eee7db'], ticks: 110, gravity: .9,
      scalar: .85, disableForReducedMotion: true, zIndex: 100000 });
  }

  function show() {
    cancelAnimation();
    window.confetti?.reset?.();
    if (window.gsap) gsap.set([overlay, ...parts], { clearProps: 'all' });
    // These inline properties are owned only by this controller.
    else [overlay, ...parts].forEach(element => element.removeAttribute('style'));
    document.documentElement.classList.remove('envelope-revealing');
    visible = true;
    opening = false;
    seal.disabled = false;
    hint.textContent = 'Нажмите на печать — внутри приглашение';
    overlay.classList.remove('envelope-keyboard');
    overlay.hidden = false;
    overlay.removeAttribute('aria-busy');
    document.documentElement.classList.add('envelope-active');
    document.body.classList.add('envelope-locked');
    background().forEach(element => { element.inert = true; });
    // The editor is initialised after this script on first load.
    requestAnimationFrame(() => {
      if (!visible) return;
      background().forEach(element => { element.inert = true; });
      seal.focus({ preventScroll: true });
    });
  }
  function open() {
    if (opening || !visible) return;
    if (reducedMotion.matches || !window.gsap) { reveal(); return; }
    opening = true;
    seal.disabled = true;
    overlay.focus({ preventScroll: true });
    hint.textContent = 'Открываем приглашение…';
    overlay.setAttribute('aria-busy', 'true');
    const height = box.getBoundingClientRect().height;
    const flap = find('.envelope-flap');
    const letter = find('.envelope-letter');
    const timeline = gsap.timeline({ onComplete: reveal });
    animation = timeline;
    timeline
      .to(find('.envelope-btn'), { y: -12, scale: .9, opacity: 0, duration: .28, ease: 'power2.in' })
      .to(find('.envelope-intro'), { opacity: 0, duration: .2 }, 0)
      .to(flap, { rotationX: -90, duration: .36, ease: 'power2.in' }, '-=.03')
      .set(flap, { zIndex: 5 })
      .set(find('.envelope-flap-liner'), { opacity: 1 })
      .to(flap, { rotationX: -180, duration: .4, ease: 'power2.out' })
      .to(letter, { y: -height * .52, duration: .7, ease: 'power2.inOut' }, '-=.08')
      .to(stationery, { y: height * .9 + 60, opacity: 0, duration: .55, ease: 'power2.in' }, '+=.06')
      .set(letter, { zIndex: 40 })
      .to(letter, { y: -height * .06, rotation: -1, duration: .45, ease: 'power2.out' }, '-=.1')
      .addPause('+=.72', () => {
        // Keep the letter in place if its cover images still need a moment to decode.
        // Timeout protects the entrance if an asset is unavailable.
        let timeout;
        Promise.race([coverReady, new Promise(resolve => { timeout = setTimeout(resolve, 2500); })])
          .then(() => { clearTimeout(timeout); if (opening && animation === timeline) timeline.resume(); });
      })
      .addLabel('envelope-dissolve')
      .to(letter, { opacity: 0, y: -height * .1, scale: 1.025, duration: .55, ease: 'power1.inOut' })
      .to(find('.envelope-caption'), { opacity: 0, duration: .45, ease: 'power1.inOut' }, 'envelope-dissolve')
      .call(celebrate, [], 'envelope-dissolve+=0.275')
      .call(() => {
        document.documentElement.classList.add('envelope-revealing');
        window.scrollTo(0, 0);
      })
      .to(overlay, { opacity: 0, duration: 1.05, ease: 'power1.inOut' });
  }
  overlay.addEventListener('pointerdown', () => overlay.classList.remove('envelope-keyboard'));
  seal.addEventListener('click', open);
  document.addEventListener('keydown', event => {
    if (!visible) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      reveal();
      return;
    }
    if (event.key !== 'Tab') return;
    overlay.classList.add('envelope-keyboard');
    event.preventDefault();
    if (seal.disabled) overlay.focus({ preventScroll: true });
    else seal.focus({ preventScroll: true });
  }, true);
  reducedMotion.addEventListener('change', () => { if (opening && reducedMotion.matches) reveal(); });
  if (params.get('edit') === '1' && params.get('envelope') !== '1') {
    overlay.hidden = true;
    document.documentElement.classList.remove('envelope-active');
  } else show();
})();
