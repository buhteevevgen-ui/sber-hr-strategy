(() => {
  'use strict';
  const groups = document.querySelectorAll('[data-tabs]');
  document.documentElement.classList.add('js-enabled');

  groups.forEach(group => {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const panels = Array.from(group.querySelectorAll('[role="tabpanel"]'));
    const tablist = group.querySelector('[role="tablist"]');
    const labels = {'hiring-segments':'Сегмент найма','roadmap-years':'Год роадмапа'};
    tablist.setAttribute('aria-label', labels[group.dataset.tabs] || 'Представление');

    function select(index, focus = false) {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
    });
    select(Number(group.dataset.selected) || 0);
  });

  document.querySelectorAll('[data-period-detail]').forEach(button => {
    button.addEventListener('click', () => {
      const detail = document.getElementById(button.dataset.periodDetail);
      if (!detail) return;
      detail.open = true;
      detail.scrollIntoView({block: 'start'});
      detail.querySelector('summary').focus({preventScroll: true});
    });
  });
  document.querySelectorAll('.period-detail').forEach(detail => {
    detail.addEventListener('toggle', () => {
      document.querySelectorAll('[data-period-detail]').forEach(button => {
        if (button.dataset.periodDetail === detail.id) button.setAttribute('aria-expanded', String(detail.open));
      });
    });
  });

  const links = Array.from(document.querySelectorAll('.section-nav a'));
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  let scheduled = false;
  function highlight() {
    let current = sections[0];
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 140) current = section; });
    links.forEach(link => {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(highlight); }
  }, {passive:true});
  highlight();
})();
