(function () {
  document.documentElement.classList.add('js');
  var KEY = 'before-the-ships-v1';
  var tabs = [].slice.call(document.querySelectorAll('[role=tab]'));
  var names = ['opener', 'read', 'ask', 'decide', 'sleuth'];
  var aliases = { case: 'read', finding: 'decide', 'my-finding': 'decide', supersleuths: 'sleuth', 'super-sleuths': 'sleuth', teacher: 'sleuth', 'teacher-note': 'sleuth' };
  function show(name, scroll) {
    name = aliases[name] || name;
    if (names.indexOf(name) < 0) name = 'opener';
    names.forEach(function (k) { document.getElementById(k).classList.toggle('active', k === name); });
    tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.tab === name)); });
    if (scroll !== undefined && history.replaceState) history.replaceState(null, '', '#' + name);
    grow();
    if (scroll) { var t = document.querySelector('.tabs'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.tab, true); }); });
  [].forEach.call(document.querySelectorAll('[data-goto]'), function (b) { b.addEventListener('click', function (e) { e.preventDefault(); show(b.dataset.goto, true); }); });
  function fromHash() {
    var h = (location.hash || '').replace('#', '');
    if (h === 'teacher-note') { show('sleuth'); var tn = document.getElementById('teacher-note'); if (tn) { tn.open = true; tn.scrollIntoView(); } return; }
    show(h);
  }
  window.addEventListener('hashchange', fromHash); fromHash();
  var fields = [].slice.call(document.querySelectorAll('textarea[data-key]'));
  var radios = [].slice.call(document.querySelectorAll('input[type=radio][name]'));
  var data = {}; try { data = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }
  function size(f) { f.style.height = 'auto'; f.style.height = (f.scrollHeight + 2) + 'px'; }
  function grow() { if (fields) fields.forEach(size); }
  fields.forEach(function (f) { if (data[f.dataset.key]) f.value = data[f.dataset.key]; f.addEventListener('input', function () { data[f.dataset.key] = f.value; save(); size(f); }); });
  radios.forEach(function (r) { if (data[r.name] === r.value) r.checked = true; r.addEventListener('change', function () { data[r.name] = r.value; save(); }); });
  var clear = document.getElementById('clear');
  if (clear) clear.addEventListener('click', function () {
    if (!confirm('Clear everything you have written on this device?')) return;
    data = {}; save(); fields.forEach(function (f) { f.value = ''; size(f); }); radios.forEach(function (r) { r.checked = false; });
  });
  [].forEach.call(document.querySelectorAll('button[data-print]'), function (b) { b.addEventListener('click', function () { show(b.dataset.print); setTimeout(function () { window.print(); }, 50); }); });
  var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img'), lbClose = lb.querySelector('.lightbox-close'), last = null;
  function open(src, alt) { last = document.activeElement; lbImg.src = src; lbImg.alt = alt || ''; lb.removeAttribute('hidden'); lbClose.focus(); }
  function close() { lb.setAttribute('hidden', ''); lbImg.src = ''; if (last) last.focus(); }
  [].forEach.call(document.querySelectorAll('.zoom, .portrait-zoom'), function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); var i = b.querySelector('img'); open(b.dataset.full || i.currentSrc || i.src, i.alt); });
  });
  lbClose.addEventListener('click', close);
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hasAttribute('hidden')) close(); });
})();
