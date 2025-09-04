// LocalStorage keys
const STORAGE_KEY = "eng_learning_progress_v1";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch (_) {
    return {};
  }
}

function saveProgress(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

const state = {
  progress: loadProgress(), // { itemId: true }
  activeCategory: null,
  activeLevels: new Set(),
  activeTime: new Set(),
  query: "",
};

function $(sel) { return document.querySelector(sel); }
function el(tag, props = {}, children = []) {
  const e = document.createElement(tag);
  Object.assign(e, props);
  for (const c of children) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return e;
}

function allItems() {
  return CURRICULUM.flatMap(c => c.items.map(it => ({ ...it, category: c.category })));
}

function renderCategories() {
  const list = $("#categoryList");
  list.innerHTML = "";
  const cats = CURRICULUM.map(c => c.category);

  const makeLi = (name) => {
    const li = el("li", {}, [document.createTextNode(name)]);
    li.addEventListener('click', () => {
      state.activeCategory = state.activeCategory === name ? null : name;
      renderCategories();
      renderItems();
    });
    if (state.activeCategory === name) li.classList.add('active');
    return li;
  };

  list.appendChild(makeLi("すべて"));
  if (state.activeCategory === null) list.firstChild.classList.add('active');
  for (const c of cats) list.appendChild(makeLi(c));
}

function renderLevelChips() {
  const box = $("#levelChips");
  box.innerHTML = "";
  LEVELS.forEach(lv => {
    const chip = el("div", { className: "chip", textContent: lv });
    if (state.activeLevels.has(lv)) chip.classList.add('active');
    chip.addEventListener('click', () => {
      if (state.activeLevels.has(lv)) state.activeLevels.delete(lv); else state.activeLevels.add(lv);
      renderLevelChips();
      renderItems();
    });
    box.appendChild(chip);
  });
}

function renderTimeChips() {
  const box = $("#timeChips");
  box.innerHTML = "";
  TIME_BUCKETS.forEach(tb => {
    const chip = el("div", { className: "chip", textContent: tb.label });
    chip.dataset.key = tb.key;
    if (state.activeTime.has(tb.key)) chip.classList.add('active');
    chip.addEventListener('click', () => {
      if (state.activeTime.has(tb.key)) state.activeTime.delete(tb.key); else state.activeTime.add(tb.key);
      renderTimeChips();
      renderItems();
    });
    box.appendChild(chip);
  });
}

function timeBucketKey(min) {
  for (const tb of TIME_BUCKETS) if (min <= tb.max) return tb.key;
  return TIME_BUCKETS[TIME_BUCKETS.length - 1].key;
}

function filterItems(items) {
  const q = state.query.trim().toLowerCase();
  return items.filter(it => {
    if (state.activeCategory && it.category !== state.activeCategory) return false;
    if (state.activeLevels.size && !state.activeLevels.has(it.level)) return false;
    if (state.activeTime.size && !state.activeTime.has(timeBucketKey(it.minutes))) return false;
    if (q) {
      const hay = [it.title, it.category, it.level, ...(it.tags || []), it.what, it.why, it.tips].join("\n").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const total = allItems().length;
  const done = Object.values(state.progress).filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("#progressCount").textContent = String(done);
  $("#progressTotal").textContent = String(total);
  $("#progressPct").textContent = `${pct}%`;
  $("#progress .fill").style.width = `${pct}%`;
}

function itemCard(it) {
  const done = !!state.progress[it.id];
  const card = el("div", { className: `card${done ? ' done' : ''}` });
  const head = el("div", { className: "head" });
  head.append(
    el("h3", { textContent: it.title }),
    el("span", { className: "badge", textContent: `${it.category} · ${it.level} · ${it.minutes}分` })
  );

  const meta = el("div", { className: "meta" }, (it.tags || []).map(t => el("span", { className: "pill", textContent: t })));

  // どう使うか(例) の簡易サマリー
  const exampleText = getExampleSummary(it);

  const body = el("div", { className: "body" }, [
    el("div", { innerHTML: `<strong>よく使うもの:</strong> ${it.title}` }),
    el("div", { innerHTML: `<strong>なぜ使うか:</strong> ${it.why}` }),
    el("div", { innerHTML: `<strong>どう使うか(例):</strong> ${exampleText}` }),
    el("div", { innerHTML: `<strong>一言:</strong> ${it.tips}` }),
    meta
  ]);

  const toggleBtn = el("button", { 
    className: done ? "secondary" : "", 
    textContent: done ? "✅ 学習済み" : "📝 学習する" 
  });
  
  toggleBtn.addEventListener('click', (e) => {
    const btn = e.target;
    const originalText = btn.textContent;
    
    btn.disabled = true;
    btn.textContent = done ? "解除中..." : "完了中...";
    
    setTimeout(() => {
      state.progress[it.id] = !state.progress[it.id];
      saveProgress(state.progress);
      renderItems();
      renderProgress();
    }, 300);
  });

  const exampleBtn = el("button", { className: "ghost", textContent: "📖 例題を見る" });
  exampleBtn.addEventListener('click', () => openExample(it));

  const foot = el("div", { className: "foot" }, [toggleBtn, exampleBtn]);
  card.append(head, body, foot);
  return card;
}

function renderItems() {
  const host = $("#items");
  host.innerHTML = "";
  const items = filterItems(allItems());
  if (items.length === 0) {
    host.append(el("div", { className: "tiny", textContent: "該当する項目がありません。フィルタを調整してください。" }));
    return;
  }
  items.forEach(it => host.appendChild(itemCard(it)));
}

function setupSearch() {
  const input = $("#search");
  const results = $("#searchResults");
  let debounceTimer;

  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();
    
    debounceTimer = setTimeout(() => {
      state.query = query;
      renderItems();
      
      if (query.length > 1) {
        showSearchSuggestions(query);
      } else {
        hideSearchSuggestions();
      }
    }, 300);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length > 1) {
      showSearchSuggestions(input.value.trim());
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      hideSearchSuggestions();
    }
  });

  let selectedIndex = -1;

  input.addEventListener('keydown', (e) => {
    const suggestions = results.querySelectorAll('.search-result-item');
    
    if (e.key === 'Escape') {
      hideSearchSuggestions();
      input.blur();
      selectedIndex = -1;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
      updateSelection(suggestions);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updateSelection(suggestions);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && suggestions[selectedIndex]) {
      e.preventDefault();
      suggestions[selectedIndex].click();
      selectedIndex = -1;
    }
  });

  function updateSelection(suggestions) {
    suggestions.forEach((item, index) => {
      item.classList.toggle('selected', index === selectedIndex);
    });
  }
}

function showSearchSuggestions(query) {
  const results = $("#searchResults");
  const items = allItems();
  const matches = items.filter(item => {
    const searchText = [item.title, item.category, ...(item.tags || [])].join(' ').toLowerCase();
    return searchText.includes(query.toLowerCase());
  }).slice(0, 5);

  if (matches.length === 0) {
    hideSearchSuggestions();
    return;
  }

  results.innerHTML = '';
  matches.forEach(item => {
    const div = el('div', { className: 'search-result-item' });
    div.innerHTML = `
      <div class="title">${item.title}</div>
      <div class="category">${item.category} · ${item.level}</div>
    `;
    div.addEventListener('click', () => {
      $("#search").value = item.title;
      state.query = item.title;
      renderItems();
      hideSearchSuggestions();
    });
    results.appendChild(div);
  });
  
  results.classList.add('show');
}

function hideSearchSuggestions() {
  const results = $("#searchResults");
  results.classList.remove('show');
}

function setupReset() {
  $("#resetProgress").addEventListener('click', () => {
    if (!confirm("全ての学習済みフラグをリセットしますか？")) return;
    state.progress = {};
    saveProgress(state.progress);
    renderItems();
    renderProgress();
  });
}

function init() {
  ensureOverlay();
  renderCategories();
  renderLevelChips();
  renderTimeChips();
  setupSearch();
  setupReset();
  renderItems();
  renderProgress();
}

document.addEventListener('DOMContentLoaded', init);

// ---------- Example overlay ----------
let overlayEl = null;

function ensureOverlay() {
  if (overlayEl) return;
  overlayEl = document.createElement('div');
  overlayEl.className = 'overlay';
  overlayEl.innerHTML = `
    <div class="sheet">
      <div class="sheet-head">
        <h3 class="sheet-title">例題</h3>
        <div style="display:flex; gap:8px; align-items:center;">
          <button class="secondary" id="exCopy">内容をコピー</button>
          <button class="danger" id="exClose">閉じる</button>
        </div>
      </div>
      <div class="sheet-body" id="exBody"></div>
    </div>`;
  document.body.appendChild(overlayEl);
  overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) hideOverlay(); });
  overlayEl.querySelector('#exClose').addEventListener('click', hideOverlay);
  overlayEl.querySelector('#exCopy').addEventListener('click', copyOverlayText);
}

function hideOverlay() { overlayEl?.classList.remove('show'); }

function copyOverlayText() {
  const text = overlayEl.querySelector('#exBody').innerText;
  navigator.clipboard?.writeText(text).then(() => {
    const btn = overlayEl.querySelector('#exCopy');
    const old = btn.textContent; btn.textContent = 'コピーしました';
    setTimeout(() => btn.textContent = old, 1200);
  }).catch(() => {});
}

function renderBlocks(host, example) {
  if (example.intro) host.appendChild(el('div', { className: 'block', textContent: example.intro }));
  (example.blocks || []).forEach(b => {
    const wrap = el('div', { className: 'block' });
    if (b.title) wrap.appendChild(el('h4', { textContent: b.title }));
    if (b.kind === 'text') {
      wrap.appendChild(el('div', { textContent: b.content }));
    } else if (b.kind === 'code') {
      const pre = el('pre');
      const code = el('code', { textContent: b.content });
      pre.appendChild(code); wrap.appendChild(pre);
    }
    host.appendChild(wrap);
  });
}

function fallbackExample(it) {
  return {
    intro: `${it.title} の実践ポイントを要約します。` ,
    blocks: [
      { kind: 'text', title: 'なぜ', content: it.why },
      { kind: 'text', title: '何を', content: it.what },
      { kind: 'text', title: 'コツ', content: it.tips },
      { kind: 'text', title: '演習', content: it.practice }
    ]
  };
}

function openExample(it) {
  ensureOverlay();
  const ex = (typeof EXAMPLES !== 'undefined' && EXAMPLES[it.id]) ? EXAMPLES[it.id] : fallbackExample(it);
  overlayEl.querySelector('.sheet-title').textContent = `例題: ${it.title}`;
  const body = overlayEl.querySelector('#exBody');
  body.innerHTML = '';
  renderBlocks(body, ex);
  overlayEl.classList.add('show');
}

// どう使うか(例)の短い要約を生成
function getExampleSummary(it) {
  try {
    if (typeof EXAMPLES !== 'undefined' && EXAMPLES[it.id]) {
      const ex = EXAMPLES[it.id];
      if (ex.intro) return ex.intro;
      const b = (ex.blocks || [])[0];
      if (!b) return it.practice || it.what || '';
      if (b.kind === 'text') return truncate(b.content, 140);
      if (b.kind === 'code') return 'コード例あり（「例題を見る」を押してください）';
    }
  } catch (_) {}
  return it.practice || it.what || '';
}

function truncate(str, n) { return (str && str.length > n) ? (str.slice(0, n) + '…') : str; }
