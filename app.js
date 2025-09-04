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
  const body = el("div", { className: "body" }, [
    el("div", { innerHTML: `<strong>なぜ:</strong> ${it.why}` }),
    el("div", { innerHTML: `<strong>何を:</strong> ${it.what}` }),
    el("div", { innerHTML: `<strong>コツ:</strong> ${it.tips}` }),
    el("div", { innerHTML: `<strong>練習:</strong> ${it.practice}` }),
    meta
  ]);

  const toggleBtn = el("button", { className: done ? "secondary" : "", textContent: done ? "学習済みを解除" : "学習済みにする" });
  toggleBtn.addEventListener('click', () => {
    state.progress[it.id] = !state.progress[it.id];
    saveProgress(state.progress);
    renderItems();
    renderProgress();
  });

  const foot = el("div", { className: "foot" }, [toggleBtn]);
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
  input.addEventListener('input', () => { state.query = input.value; renderItems(); });
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
  renderCategories();
  renderLevelChips();
  renderTimeChips();
  setupSearch();
  setupReset();
  renderItems();
  renderProgress();
}

document.addEventListener('DOMContentLoaded', init);

