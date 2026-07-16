const STORAGE_KEY = "todo_list_app_v3";
const LEGACY_V2_KEY = "todo_list_app_v2";
const LEGACY_V1_KEY = "todo_list_app_v1";
const ALL_LISTS_ID = "all";
const XP_PER_COMPLETE = 10;
const XP_PER_LEVEL = 100;
const SIDE_QUEST_BONUS_XP = 20;
const QUEST_TEMPLATES = [
  { dailyGoal: 2, questTitle: "가볍게 2개 끝내기" },
  { dailyGoal: 3, questTitle: "기본 루틴 3개" },
  { dailyGoal: 5, questTitle: "집중 모드 5개" },
];
const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 };
const ACHIEVEMENT_DEFS = [
  { id: "first_done", title: "첫 완료", desc: "할 일 1개 완료" },
  { id: "ten_done", title: "10개 클리어", desc: "누적 10개 완료" },
  { id: "streak_3", title: "3일 연속", desc: "연속 3일 달성" },
  { id: "streak_7", title: "7일 연속", desc: "연속 7일 달성" },
  { id: "level_5", title: "Lv.5 도달", desc: "레벨 5 이상" },
  { id: "lists_3", title: "정리의 달인", desc: "리스트 3개 보유" },
];

const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const prioritySelect = document.querySelector("#prioritySelect");
const dueDateInput = document.querySelector("#dueDateInput");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const todoList = document.querySelector("#todoList");
const todoCount = document.querySelector("#todoCount");
const clearAllBtn = document.querySelector("#clearAllBtn");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = emptyState.querySelector(".empty-title");
const emptyDesc = emptyState.querySelector(".empty-desc");
const toastEl = document.querySelector("#toast");
const fxBurst = document.querySelector("#fxBurst");
const confirmModal = document.querySelector("#confirmModal");
const confirmTitle = document.querySelector("#confirmTitle");
const confirmMessage = document.querySelector("#confirmMessage");
const confirmCancel = document.querySelector("#confirmCancel");
const confirmOk = document.querySelector("#confirmOk");
const filterButtons = document.querySelectorAll(".filter-button");
const listNav = document.querySelector("#listNav");
const addListBtn = document.querySelector("#addListBtn");
const listForm = document.querySelector("#listForm");
const listInput = document.querySelector("#listInput");
const listFormCancel = document.querySelector("#listFormCancel");
const mainTitle = document.querySelector("#mainTitle");
const levelLabel = document.querySelector("#levelLabel");
const xpLabel = document.querySelector("#xpLabel");
const xpBarFill = document.querySelector("#xpBarFill");
const streakLabel = document.querySelector("#streakLabel");
const questTitle = document.querySelector("#questTitle");
const dailyGoalLabel = document.querySelector("#dailyGoalLabel");
const dailyBarFill = document.querySelector("#dailyBarFill");
const sideQuestList = document.querySelector("#sideQuestList");
const achievementList = document.querySelector("#achievementList");
const sidebar = document.querySelector("#sidebar");
const sidebarOpenBtn = document.querySelector("#sidebarOpenBtn");
const sidebarCloseBtn = document.querySelector("#sidebarCloseBtn");
const sidebarBackdrop = document.querySelector("#sidebarBackdrop");
const statusPanel = document.querySelector(".status-panel");
const plannerTabs = document.querySelectorAll(".planner-tab");
const plannerDaily = document.querySelector("#plannerDaily");
const plannerWeekly = document.querySelector("#plannerWeekly");
const plannerCalendar = document.querySelector("#plannerCalendar");
const dailyDateLabel = document.querySelector("#dailyDateLabel");
const dailySummary = document.querySelector("#dailySummary");
const dailyFocusList = document.querySelector("#dailyFocusList");
const dailyMorningList = document.querySelector("#dailyMorningList");
const dailyAfternoonList = document.querySelector("#dailyAfternoonList");
const dailyEveningList = document.querySelector("#dailyEveningList");
const dailyNoteInput = document.querySelector("#dailyNoteInput");
const weeklyRangeLabel = document.querySelector("#weeklyRangeLabel");
const weeklyGrid = document.querySelector("#weeklyGrid");
const calMonthLabel = document.querySelector("#calMonthLabel");
const calendarGrid = document.querySelector("#calendarGrid");
const dailyPrevBtn = document.querySelector("#dailyPrevBtn");
const dailyNextBtn = document.querySelector("#dailyNextBtn");
const dailyTodayBtn = document.querySelector("#dailyTodayBtn");
const weeklyPrevBtn = document.querySelector("#weeklyPrevBtn");
const weeklyNextBtn = document.querySelector("#weeklyNextBtn");
const weeklyTodayBtn = document.querySelector("#weeklyTodayBtn");
const calPrevBtn = document.querySelector("#calPrevBtn");
const calNextBtn = document.querySelector("#calNextBtn");
const calTodayBtn = document.querySelector("#calTodayBtn");

let lists = [];
let todos = [];
let statsByList = {};
let achievements = { unlocked: {}, lifetimeCompleted: 0 };
let currentListId = ALL_LISTS_ID;
let lastWritableListId = "";
let currentFilter = "all";
let currentSort = "manual";
let searchQuery = "";
let editingTodoId = null;
let renamingListId = null;
let toastTimer = null;
let pendingConfirmAction = null;
let animateEnterId = null;
let animateDoneId = null;
let dragTodoId = null;
let dayNotes = {};
let plannerView = "daily";
let selectedDate = "";
let weekAnchor = null;
let calendarCursor = null;

init();

function init() {
  const data = loadAppData();
  lists = data.lists;
  todos = data.todos;
  statsByList = data.statsByList;
  achievements = data.achievements;
  dayNotes = data.dayNotes || {};
  currentListId = data.currentListId;
  lastWritableListId = data.lastWritableListId;
  selectedDate = getLocalDateKey(new Date());
  weekAnchor = startOfWeek(new Date());
  calendarCursor = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );
  if (!achievements.lifetimeCompleted) {
    achievements.lifetimeCompleted = todos.filter(function (todo) {
      return todo.done;
    }).length;
  }
  ensureSideQuestsForAllLists();
  bindEvents();
  render();
}

function bindEvents() {
  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText === "") {
      showToast("할 일을 입력하세요.");
      todoInput.focus();
      return;
    }
    addTodo(todoText, prioritySelect.value, dueDateInput.value || null);
    todoInput.value = "";
    dueDateInput.value = "";
    prioritySelect.value = "medium";
    todoInput.focus();
  });

  searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderMain();
  });

  sortSelect.addEventListener("change", function () {
    currentSort = sortSelect.value;
    renderMain();
  });

  clearAllBtn.addEventListener("click", function () {
    const scoped = getTodosInCurrentList();
    if (scoped.length === 0) {
      showToast("삭제할 할 일이 없습니다.");
      return;
    }
    const message =
      currentListId === ALL_LISTS_ID
        ? "모든 리스트의 할 일을 삭제할까요?"
        : "이 리스트의 할 일을 모두 삭제할까요?";
    openConfirm("전체 삭제", message, function () {
      if (currentListId === ALL_LISTS_ID) {
        todos = [];
      } else {
        todos = todos.filter(function (todo) {
          return todo.listId !== currentListId;
        });
      }
      editingTodoId = null;
      saveAppData();
      render();
      showToast("할 일을 삭제했습니다.");
    });
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      currentFilter = button.dataset.filter;
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      renderMain();
    });
  });

  filterButtons.forEach(function (btn) {
    btn.setAttribute(
      "aria-pressed",
      btn.classList.contains("active") ? "true" : "false",
    );
  });

  addListBtn.addEventListener("click", function () {
    renamingListId = null;
    listForm.hidden = false;
    listInput.value = "";
    listInput.focus();
  });

  listForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = listInput.value.trim();
    if (name === "") {
      showToast("리스트 이름을 입력하세요.");
      listInput.focus();
      return;
    }
    if (renamingListId) renameList(renamingListId, name);
    else addList(name);
    listForm.hidden = true;
    listInput.value = "";
    renamingListId = null;
  });

  listFormCancel.addEventListener("click", function () {
    listForm.hidden = true;
    listInput.value = "";
    renamingListId = null;
  });

  sidebarOpenBtn.addEventListener("click", openSidebar);
  sidebarCloseBtn.addEventListener("click", closeSidebar);
  sidebarBackdrop.addEventListener("click", closeSidebar);

  confirmCancel.addEventListener("click", closeConfirm);
  confirmOk.addEventListener("click", function () {
    const action = pendingConfirmAction;
    closeConfirm();
    if (typeof action === "function") action();
  });
  confirmModal.addEventListener("click", function (event) {
    if (event.target.matches("[data-modal-close]")) closeConfirm();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (!confirmModal.hidden) closeConfirm();
      else if (document.body.classList.contains("sidebar-open")) closeSidebar();
    }
  });

  plannerTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      plannerView = tab.dataset.planner;
      plannerTabs.forEach(function (btn) {
        const active = btn === tab;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
      plannerDaily.hidden = plannerView !== "daily";
      plannerWeekly.hidden = plannerView !== "weekly";
      plannerCalendar.hidden = plannerView !== "calendar";
      renderPlanner();
    });
  });

  dailyPrevBtn.addEventListener("click", function () {
    selectedDate = shiftDateKey(selectedDate, -1);
    renderPlanner();
  });
  dailyNextBtn.addEventListener("click", function () {
    selectedDate = shiftDateKey(selectedDate, 1);
    renderPlanner();
  });
  dailyTodayBtn.addEventListener("click", function () {
    selectedDate = getLocalDateKey(new Date());
    renderPlanner();
  });

  weeklyPrevBtn.addEventListener("click", function () {
    weekAnchor = addDays(weekAnchor, -7);
    renderPlanner();
  });
  weeklyNextBtn.addEventListener("click", function () {
    weekAnchor = addDays(weekAnchor, 7);
    renderPlanner();
  });
  weeklyTodayBtn.addEventListener("click", function () {
    weekAnchor = startOfWeek(new Date());
    renderPlanner();
  });

  calPrevBtn.addEventListener("click", function () {
    calendarCursor = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth() - 1,
      1,
    );
    renderPlanner();
  });
  calNextBtn.addEventListener("click", function () {
    calendarCursor = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth() + 1,
      1,
    );
    renderPlanner();
  });
  calTodayBtn.addEventListener("click", function () {
    const now = new Date();
    calendarCursor = new Date(now.getFullYear(), now.getMonth(), 1);
    selectedDate = getLocalDateKey(now);
    renderPlanner();
  });

  let noteTimer = null;
  dailyNoteInput.addEventListener("input", function () {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () {
      dayNotes[selectedDate] = dailyNoteInput.value;
      saveAppData();
    }, 250);
  });
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function createDefaultLists() {
  return [{ id: createId(), name: "개인" }];
}

function createTodo(text, listId, priority, dueDate) {
  const maxOrder = todos.reduce(function (max, todo) {
    return Math.max(max, typeof todo.order === "number" ? todo.order : 0);
  }, 0);
  return {
    id: createId(),
    text: text,
    done: false,
    createdAt: Date.now(),
    completedAt: null,
    listId: listId,
    priority: priority || "medium",
    dueDate: dueDate || null,
    order: maxOrder + 1,
  };
}

function getWritableListId() {
  if (currentListId !== ALL_LISTS_ID && findList(currentListId)) {
    return currentListId;
  }
  if (lastWritableListId && findList(lastWritableListId)) {
    return lastWritableListId;
  }
  return lists[0] ? lists[0].id : "";
}

function addTodo(text, priority, dueDate) {
  const listId = getWritableListId();
  if (!listId) {
    showToast("리스트를 먼저 만들어 주세요.");
    return;
  }
  const todo = createTodo(text, listId, priority, dueDate);
  todos.push(todo);
  lastWritableListId = listId;
  animateEnterId = todo.id;
  animateDoneId = null;
  saveAppData();
  render();
}

function toggleDone(id) {
  const todo = findTodo(id);
  if (!todo) return;
  const wasDone = todo.done;
  todo.done = !todo.done;
  animateDoneId = todo.done ? id : null;
  animateEnterId = null;

  if (todo.done && !wasDone) {
    todo.completedAt = Date.now();
    applyCompleteReward(todo.listId);
  } else if (!todo.done && wasDone) {
    todo.completedAt = null;
    applyUncompletePenalty(todo.listId);
  }

  saveAppData();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
  if (editingTodoId === id) editingTodoId = null;
  animateEnterId = null;
  animateDoneId = null;
  saveAppData();
  render();
}

function startEditTodo(id) {
  editingTodoId = id;
  renderMain();
}

function cancelEditTodo() {
  editingTodoId = null;
  renderMain();
}

function saveEditTodo(id, nextText, priority, dueDate) {
  const trimmed = nextText.trim();
  if (trimmed === "") {
    showToast("빈 내용은 저장할 수 없습니다.");
    return;
  }
  const todo = findTodo(id);
  if (!todo) return;
  todo.text = trimmed;
  todo.priority = priority || "medium";
  todo.dueDate = dueDate || null;
  editingTodoId = null;
  saveAppData();
  render();
}

function addList(name) {
  const list = { id: createId(), name: name };
  lists.push(list);
  ensureListStats(list.id, lists.length - 1);
  ensureSideQuests(list.id);
  currentListId = list.id;
  lastWritableListId = list.id;
  checkAchievements();
  saveAppData();
  render();
  showToast("리스트를 추가했습니다.");
  closeSidebar();
}

function renameList(id, name) {
  const list = findList(id);
  if (!list) return;
  list.name = name;
  saveAppData();
  render();
  showToast("리스트 이름을 바꿨습니다.");
}

function startRenameList(id) {
  const list = findList(id);
  if (!list) return;
  renamingListId = id;
  listForm.hidden = false;
  listInput.value = list.name;
  listInput.focus();
  listInput.select();
}

function deleteList(id) {
  if (lists.length <= 1) {
    showToast("리스트는 최소 1개가 필요합니다.");
    return;
  }
  const list = findList(id);
  if (!list) return;
  openConfirm(
    "리스트 삭제",
    "'" + list.name + "' 리스트와 안의 할 일을 삭제할까요?",
    function () {
      lists = lists.filter(function (item) {
        return item.id !== id;
      });
      todos = todos.filter(function (todo) {
        return todo.listId !== id;
      });
      delete statsByList[id];
      if (currentListId === id) currentListId = ALL_LISTS_ID;
      if (lastWritableListId === id) {
        lastWritableListId = lists[0] ? lists[0].id : "";
      }
      saveAppData();
      render();
      showToast("리스트를 삭제했습니다.");
    },
  );
}

function selectList(id) {
  currentListId = id;
  if (id !== ALL_LISTS_ID) lastWritableListId = id;
  editingTodoId = null;
  saveAppData();
  render();
  closeSidebar();
}

function findTodo(id) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) return todos[i];
  }
  return null;
}

function findList(id) {
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].id === id) return lists[i];
  }
  return null;
}

function getTodosInCurrentList() {
  if (currentListId === ALL_LISTS_ID) return todos.slice();
  return todos.filter(function (todo) {
    return todo.listId === currentListId;
  });
}

function getVisibleTodos() {
  let result = getTodosInCurrentList().filter(function (todo) {
    if (currentFilter === "active") return !todo.done;
    if (currentFilter === "done") return todo.done;
    return true;
  });

  if (searchQuery) {
    result = result.filter(function (todo) {
      return todo.text.toLowerCase().indexOf(searchQuery) !== -1;
    });
  }

  result = sortTodos(result);
  return result;
}

function sortTodos(items) {
  const copy = items.slice();
  if (currentSort === "newest") {
    copy.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
  } else if (currentSort === "due") {
    copy.sort(function (a, b) {
      if (!a.dueDate && !b.dueDate) return a.order - b.order;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      if (a.dueDate === b.dueDate) return a.order - b.order;
      return a.dueDate < b.dueDate ? -1 : 1;
    });
  } else if (currentSort === "priority") {
    copy.sort(function (a, b) {
      const wa =
        typeof PRIORITY_WEIGHT[a.priority] === "number"
          ? PRIORITY_WEIGHT[a.priority]
          : 1;
      const wb =
        typeof PRIORITY_WEIGHT[b.priority] === "number"
          ? PRIORITY_WEIGHT[b.priority]
          : 1;
      if (wa !== wb) return wa - wb;
      return a.order - b.order;
    });
  } else {
    copy.sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
  }
  return copy;
}

function countActiveInList(listId) {
  let count = 0;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].listId === listId && !todos[i].done) count++;
  }
  return count;
}

function countAllActive() {
  let count = 0;
  for (let i = 0; i < todos.length; i++) {
    if (!todos[i].done) count++;
  }
  return count;
}

function render() {
  if (refreshDayState()) saveAppData();
  ensureSideQuestsForAllLists();
  renderSidebar();
  renderMain();
  renderStatusPanel();
  renderSideQuests();
  renderAchievements();
  renderPlanner();
}

function renderSidebar() {
  listNav.innerHTML = "";
  listNav.appendChild(
    createListNavItem({
      id: ALL_LISTS_ID,
      name: "모든 리스트",
      count: countAllActive(),
      isAll: true,
    }),
  );
  lists.forEach(function (list) {
    listNav.appendChild(
      createListNavItem({
        id: list.id,
        name: list.name,
        count: countActiveInList(list.id),
        isAll: false,
      }),
    );
  });
}

function createListNavItem(options) {
  const item = document.createElement("li");
  item.className =
    "list-nav-item" + (currentListId === options.id ? " is-active" : "");

  const selectBtn = document.createElement("button");
  selectBtn.type = "button";
  selectBtn.className = "list-nav-select";
  selectBtn.setAttribute(
    "aria-current",
    currentListId === options.id ? "page" : "false",
  );
  selectBtn.addEventListener("click", function () {
    selectList(options.id);
  });

  const nameSpan = document.createElement("span");
  nameSpan.className = "list-nav-name";
  nameSpan.textContent = options.name;

  const badge = document.createElement("span");
  badge.className = "list-badge";
  badge.textContent = String(options.count);

  selectBtn.appendChild(nameSpan);
  selectBtn.appendChild(badge);
  item.appendChild(selectBtn);

  if (!options.isAll) {
    const actions = document.createElement("div");
    actions.className = "list-nav-actions";

    const renameBtn = document.createElement("button");
    renameBtn.type = "button";
    renameBtn.className = "list-mini-btn";
    renameBtn.textContent = "이름";
    renameBtn.setAttribute("aria-label", options.name + " 이름 변경");
    renameBtn.addEventListener("click", function () {
      startRenameList(options.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "list-mini-btn danger";
    deleteBtn.textContent = "삭제";
    deleteBtn.setAttribute("aria-label", options.name + " 삭제");
    deleteBtn.addEventListener("click", function () {
      deleteList(options.id);
    });

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(actions);
  }

  return item;
}

function renderMain() {
  todoList.innerHTML = "";
  const scoped = getTodosInCurrentList();
  const visible = getVisibleTodos();
  const isEmpty = scoped.length === 0;

  const currentList = findList(currentListId);
  mainTitle.textContent =
    currentListId === ALL_LISTS_ID
      ? "모든 리스트"
      : currentList
        ? currentList.name
        : "TodoList";

  if (isEmpty) {
    emptyTitle.textContent = "아직 할 일이 없어요";
    emptyDesc.textContent = "위에서 할 일을 입력하고 추가해 보세요.";
  } else if (visible.length === 0) {
    emptyTitle.textContent = "표시할 할 일이 없어요";
    emptyDesc.textContent = "검색어나 필터를 바꿔 보세요.";
  }

  emptyState.hidden = !(isEmpty || visible.length === 0);
  todoList.hidden = visible.length === 0;

  visible.forEach(function (todo) {
    todoList.appendChild(createTodoElement(todo));
  });

  updateCount(scoped);

  const enterId = animateEnterId;
  const doneId = animateDoneId;
  animateEnterId = null;
  animateDoneId = null;
  if (enterId || doneId) {
    window.setTimeout(function () {
      const enterEl = enterId
        ? todoList.querySelector('[data-id="' + enterId + '"]')
        : null;
      const doneEl = doneId
        ? todoList.querySelector('[data-id="' + doneId + '"]')
        : null;
      if (enterEl) enterEl.classList.remove("is-entering");
      if (doneEl) doneEl.classList.remove("is-completing");
    }, 450);
  }
}

function createTodoElement(todo) {
  const todoItem = document.createElement("li");
  todoItem.className = "todo-item" + (todo.done ? " done" : "");
  todoItem.dataset.id = todo.id;
  todoItem.draggable = currentSort === "manual" && editingTodoId !== todo.id;
  if (todo.id === animateEnterId) todoItem.classList.add("is-entering");
  if (todo.id === animateDoneId && todo.done) {
    todoItem.classList.add("is-completing");
  }

  if (todoItem.draggable) {
    todoItem.addEventListener("dragstart", function (event) {
      dragTodoId = todo.id;
      todoItem.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", todo.id);
    });
    todoItem.addEventListener("dragend", function () {
      dragTodoId = null;
      todoItem.classList.remove("is-dragging");
    });
    todoItem.addEventListener("dragover", function (event) {
      event.preventDefault();
      todoItem.classList.add("is-drag-over");
    });
    todoItem.addEventListener("dragleave", function () {
      todoItem.classList.remove("is-drag-over");
    });
    todoItem.addEventListener("drop", function (event) {
      event.preventDefault();
      todoItem.classList.remove("is-drag-over");
      const fromId = event.dataTransfer.getData("text/plain") || dragTodoId;
      if (fromId && fromId !== todo.id) reorderTodos(fromId, todo.id);
    });
  }

  if (editingTodoId === todo.id) {
    return createEditingTodoElement(todo, todoItem);
  }

  const handle = document.createElement("span");
  handle.className = "drag-handle";
  handle.textContent = "⋮⋮";
  handle.setAttribute("aria-hidden", "true");

  const checkLabel = document.createElement("label");
  checkLabel.className = "todo-check";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todo.done;
  checkbox.setAttribute("aria-label", todo.text + " 완료 표시");
  const checkMark = document.createElement("span");
  checkMark.className = "check-mark";
  checkMark.setAttribute("aria-hidden", "true");
  checkbox.addEventListener("change", function () {
    toggleDone(todo.id);
  });
  checkLabel.appendChild(checkbox);
  checkLabel.appendChild(checkMark);

  const content = document.createElement("div");
  content.className = "todo-content";
  const todoTextSpan = document.createElement("span");
  todoTextSpan.className = "todo-text";
  todoTextSpan.textContent = todo.text;
  content.appendChild(todoTextSpan);

  const metaRow = document.createElement("div");
  metaRow.className = "todo-meta-row";

  const priorityBadge = document.createElement("span");
  priorityBadge.className = "todo-meta priority-" + (todo.priority || "medium");
  priorityBadge.textContent = priorityLabel(todo.priority);
  metaRow.appendChild(priorityBadge);

  if (todo.dueDate) {
    const dueMeta = document.createElement("span");
    dueMeta.className = "todo-meta todo-due" + dueClass(todo.dueDate, todo.done);
    dueMeta.textContent = "마감 " + formatDueDate(todo.dueDate);
    metaRow.appendChild(dueMeta);
  }

  if (currentListId === ALL_LISTS_ID) {
    const list = findList(todo.listId);
    if (list) {
      const listMeta = document.createElement("span");
      listMeta.className = "todo-meta";
      listMeta.textContent = list.name;
      metaRow.appendChild(listMeta);
    }
  }

  if (todo.done && todo.completedAt) {
    const timeMeta = document.createElement("span");
    timeMeta.className = "todo-meta todo-time";
    timeMeta.textContent = "완료 " + formatCompletedAt(todo.completedAt);
    metaRow.appendChild(timeMeta);
  }

  content.appendChild(metaRow);

  const actionBox = document.createElement("div");
  actionBox.className = "todo-actions";
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "action-button edit-button";
  editButton.textContent = "수정";
  editButton.setAttribute("aria-label", todo.text + " 수정");
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "action-button delete-button";
  deleteButton.textContent = "삭제";
  deleteButton.setAttribute("aria-label", todo.text + " 삭제");
  editButton.addEventListener("click", function () {
    startEditTodo(todo.id);
  });
  deleteButton.addEventListener("click", function () {
    deleteTodo(todo.id);
  });
  actionBox.appendChild(editButton);
  actionBox.appendChild(deleteButton);

  if (currentSort === "manual") todoItem.appendChild(handle);
  todoItem.appendChild(checkLabel);
  todoItem.appendChild(content);
  todoItem.appendChild(actionBox);
  return todoItem;
}

function createEditingTodoElement(todo, todoItem) {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-edit-input";
  editInput.value = todo.text;
  editInput.setAttribute("aria-label", "할 일 수정");

  const editPriority = document.createElement("select");
  editPriority.className = "priority-select";
  editPriority.setAttribute("aria-label", "우선순위 수정");
  ["high", "medium", "low"].forEach(function (value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = priorityLabel(value);
    if ((todo.priority || "medium") === value) option.selected = true;
    editPriority.appendChild(option);
  });

  const editDue = document.createElement("input");
  editDue.type = "date";
  editDue.className = "due-date-input";
  editDue.value = todo.dueDate || "";
  editDue.setAttribute("aria-label", "마감일 수정");

  const actionBox = document.createElement("div");
  actionBox.className = "todo-actions";
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "action-button save-button";
  saveButton.textContent = "저장";
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "action-button cancel-button";
  cancelButton.textContent = "취소";

  saveButton.addEventListener("click", function () {
    saveEditTodo(todo.id, editInput.value, editPriority.value, editDue.value);
  });
  cancelButton.addEventListener("click", cancelEditTodo);
  editInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEditTodo(
        todo.id,
        editInput.value,
        editPriority.value,
        editDue.value,
      );
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditTodo();
    }
  });

  actionBox.appendChild(saveButton);
  actionBox.appendChild(cancelButton);
  todoItem.appendChild(editInput);
  todoItem.appendChild(editPriority);
  todoItem.appendChild(editDue);
  todoItem.appendChild(actionBox);

  requestAnimationFrame(function () {
    editInput.focus();
    editInput.select();
  });
  return todoItem;
}

function reorderTodos(fromId, toId) {
  const fromTodo = findTodo(fromId);
  const toTodo = findTodo(toId);
  if (!fromTodo || !toTodo) return;

  const scoped = getTodosInCurrentList().sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });
  const fromIndex = scoped.findIndex(function (todo) {
    return todo.id === fromId;
  });
  const toIndex = scoped.findIndex(function (todo) {
    return todo.id === toId;
  });
  if (fromIndex < 0 || toIndex < 0) return;

  const moved = scoped.splice(fromIndex, 1)[0];
  scoped.splice(toIndex, 0, moved);
  scoped.forEach(function (todo, index) {
    todo.order = index + 1;
  });
  currentSort = "manual";
  sortSelect.value = "manual";
  saveAppData();
  renderMain();
}

function updateCount(scopedTodos) {
  const total = scopedTodos.length;
  let done = 0;
  for (let i = 0; i < scopedTodos.length; i++) {
    if (scopedTodos[i].done) done++;
  }
  const left = total - done;
  if (total === 0) {
    todoCount.textContent = "할 일 0개";
    return;
  }
  todoCount.textContent =
    "전체 " + total + "개 · 남은 일 " + left + "개 · 완료 " + done + "개";
}

function priorityLabel(priority) {
  if (priority === "high") return "높음";
  if (priority === "low") return "낮음";
  return "보통";
}

function dueClass(dueDate, done) {
  if (done) return "";
  const today = getLocalDateKey(new Date());
  if (dueDate < today) return " is-overdue";
  if (dueDate === today) return " is-today";
  return "";
}

function formatDueDate(dueDate) {
  const parts = dueDate.split("-");
  return Number(parts[1]) + "/" + Number(parts[2]);
}

function pickQuestTemplate(index) {
  return QUEST_TEMPLATES[Math.abs(index) % QUEST_TEMPLATES.length];
}

function createListStats(templateIndex) {
  const template = pickQuestTemplate(templateIndex);
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    todayCompleted: 0,
    todayDate: getLocalDateKey(new Date()),
    weeklyCompleted: 0,
    weekKey: getWeekKey(new Date()),
    dailyGoal: template.dailyGoal,
    questTitle: template.questTitle,
    sideQuests: [],
  };
}

function ensureListStats(listId, templateIndex) {
  if (!statsByList[listId]) {
    statsByList[listId] = createListStats(
      typeof templateIndex === "number" ? templateIndex : 0,
    );
  }
  return statsByList[listId];
}

function ensureSideQuestsForAllLists() {
  lists.forEach(function (list, index) {
    ensureListStats(list.id, index);
    ensureSideQuests(list.id);
  });
}

function ensureSideQuests(listId) {
  const listStats = ensureListStats(listId);
  const today = getLocalDateKey(new Date());
  const weekKey = getWeekKey(new Date());
  refreshListDayState(listStats);
  refreshListWeekState(listStats);

  if (!Array.isArray(listStats.sideQuests) || listStats.sideQuests.length === 0) {
    listStats.sideQuests = buildSideQuests(listStats, today, weekKey);
    return;
  }

  listStats.sideQuests = listStats.sideQuests.map(function (quest) {
    if (quest.type === "streak_3") {
      return {
        id: quest.id || "streak_3",
        type: "streak_3",
        title: "연속 3일 유지",
        target: 3,
        progress: Math.min(3, listStats.streak),
        rewardXp: SIDE_QUEST_BONUS_XP,
        claimed: Boolean(quest.claimed) && quest.periodKey === today,
        periodKey: today,
      };
    }
    if (quest.type === "weekly_10") {
      return {
        id: quest.id || "weekly_10",
        type: "weekly_10",
        title: "이번 주 10개 완료",
        target: 10,
        progress: Math.min(10, listStats.weeklyCompleted || 0),
        rewardXp: SIDE_QUEST_BONUS_XP,
        claimed: Boolean(quest.claimed) && quest.periodKey === weekKey,
        periodKey: weekKey,
      };
    }
    return quest;
  });

  // Reset claimed flags when period changes
  listStats.sideQuests.forEach(function (quest) {
    if (quest.type === "streak_3" && quest.periodKey !== today) {
      quest.claimed = false;
      quest.periodKey = today;
    }
    if (quest.type === "weekly_10" && quest.periodKey !== weekKey) {
      quest.claimed = false;
      quest.periodKey = weekKey;
      quest.progress = Math.min(10, listStats.weeklyCompleted || 0);
    }
    if (quest.type === "streak_3") {
      quest.progress = Math.min(3, listStats.streak);
    }
  });
}

function buildSideQuests(listStats, today, weekKey) {
  return [
    {
      id: "streak_3",
      type: "streak_3",
      title: "연속 3일 유지",
      target: 3,
      progress: Math.min(3, listStats.streak),
      rewardXp: SIDE_QUEST_BONUS_XP,
      claimed: false,
      periodKey: today,
    },
    {
      id: "weekly_10",
      type: "weekly_10",
      title: "이번 주 10개 완료",
      target: 10,
      progress: Math.min(10, listStats.weeklyCompleted || 0),
      rewardXp: SIDE_QUEST_BONUS_XP,
      claimed: false,
      periodKey: weekKey,
    },
  ];
}

function updateSideQuestsAfterComplete(listId) {
  const listStats = ensureListStats(listId);
  ensureSideQuests(listId);
  listStats.sideQuests.forEach(function (quest) {
    if (quest.claimed) return;
    if (quest.progress >= quest.target) {
      quest.claimed = true;
      listStats.xp += quest.rewardXp;
      showToast("사이드 퀘스트 완료! +" + quest.rewardXp + " XP");
      playFx();
    }
  });
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function getWeekKey(date) {
  const tmp = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNum = (tmp.getDay() + 6) % 7;
  tmp.setDate(tmp.getDate() - dayNum + 3);
  const firstThursday = new Date(tmp.getFullYear(), 0, 4);
  const week =
    1 +
    Math.round(
      ((tmp.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getDay() + 6) % 7)) /
        7,
    );
  return tmp.getFullYear() + "-W" + String(week).padStart(2, "0");
}

function shiftDateKey(dateKey, dayOffset) {
  const parts = dateKey.split("-");
  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
  );
  date.setDate(date.getDate() + dayOffset);
  return getLocalDateKey(date);
}

function formatCompletedAt(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = hours + ":" + minutes;
  const today = getLocalDateKey(new Date());
  const key = getLocalDateKey(date);
  if (key === today) return "오늘 " + time;
  if (key === shiftDateKey(today, -1)) return "어제 " + time;
  return date.getMonth() + 1 + "/" + date.getDate() + " " + time;
}

function refreshListDayState(listStats) {
  const today = getLocalDateKey(new Date());
  if (listStats.todayDate === today) return false;
  const yesterday = shiftDateKey(today, -1);
  if (listStats.lastActiveDate && listStats.lastActiveDate < yesterday) {
    listStats.streak = 0;
  }
  listStats.todayCompleted = 0;
  listStats.todayDate = today;
  return true;
}

function refreshListWeekState(listStats) {
  const weekKey = getWeekKey(new Date());
  if (listStats.weekKey === weekKey) return false;
  listStats.weeklyCompleted = 0;
  listStats.weekKey = weekKey;
  return true;
}

function refreshDayState() {
  let changed = false;
  Object.keys(statsByList).forEach(function (listId) {
    if (refreshListDayState(statsByList[listId])) changed = true;
    if (refreshListWeekState(statsByList[listId])) changed = true;
  });
  return changed;
}

function getLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function getXpIntoLevel(xp) {
  return xp % XP_PER_LEVEL;
}

function applyCompleteReward(listId) {
  const listStats = ensureListStats(listId);
  refreshListDayState(listStats);
  refreshListWeekState(listStats);

  const prevLevel = getLevel(listStats.xp);
  listStats.xp += XP_PER_COMPLETE;
  listStats.todayCompleted += 1;
  listStats.weeklyCompleted = (listStats.weeklyCompleted || 0) + 1;
  achievements.lifetimeCompleted += 1;

  const today = getLocalDateKey(new Date());
  const yesterday = shiftDateKey(today, -1);
  if (listStats.lastActiveDate === today) {
    // already counted
  } else if (listStats.lastActiveDate === yesterday) {
    listStats.streak += 1;
  } else {
    listStats.streak = 1;
  }
  listStats.lastActiveDate = today;

  updateSideQuestsAfterComplete(listId);
  const unlocked = checkAchievements();

  const nextLevel = getLevel(listStats.xp);
  if (nextLevel > prevLevel) {
    showToast("레벨업! Lv." + nextLevel);
    playFx();
    statusPanel.classList.add("is-celebrating");
    window.setTimeout(function () {
      statusPanel.classList.remove("is-celebrating");
    }, 700);
  } else if (unlocked) {
    // achievement toast already shown
  } else if (listStats.todayCompleted === listStats.dailyGoal) {
    showToast("퀘스트 달성: " + listStats.questTitle);
    playFx();
  } else {
    showToast("+" + XP_PER_COMPLETE + " XP");
  }
}

function applyUncompletePenalty(listId) {
  const listStats = ensureListStats(listId);
  refreshListDayState(listStats);
  refreshListWeekState(listStats);
  listStats.xp = Math.max(0, listStats.xp - XP_PER_COMPLETE);
  listStats.todayCompleted = Math.max(0, listStats.todayCompleted - 1);
  listStats.weeklyCompleted = Math.max(0, (listStats.weeklyCompleted || 0) - 1);
  achievements.lifetimeCompleted = Math.max(
    0,
    achievements.lifetimeCompleted - 1,
  );
  ensureSideQuests(listId);
  showToast("-" + XP_PER_COMPLETE + " XP");
}

function checkAchievements() {
  let newlyUnlocked = null;
  const maxStreak = lists.reduce(function (max, list) {
    const streak = ensureListStats(list.id).streak;
    return Math.max(max, streak);
  }, 0);
  const maxLevel = lists.reduce(function (max, list) {
    return Math.max(max, getLevel(ensureListStats(list.id).xp));
  }, 1);

  const conditions = {
    first_done: achievements.lifetimeCompleted >= 1,
    ten_done: achievements.lifetimeCompleted >= 10,
    streak_3: maxStreak >= 3,
    streak_7: maxStreak >= 7,
    level_5: maxLevel >= 5,
    lists_3: lists.length >= 3,
  };

  ACHIEVEMENT_DEFS.forEach(function (def) {
    if (conditions[def.id] && !achievements.unlocked[def.id]) {
      achievements.unlocked[def.id] = Date.now();
      newlyUnlocked = def;
    }
  });

  if (newlyUnlocked) {
    showToast("업적 해제: " + newlyUnlocked.title);
    playFx();
  }
  return newlyUnlocked;
}

function getDisplayStats() {
  if (currentListId !== ALL_LISTS_ID) {
    return ensureListStats(currentListId);
  }

  let xp = 0;
  let streak = 0;
  let todayCompleted = 0;
  let dailyGoal = 0;
  lists.forEach(function (list) {
    const listStats = ensureListStats(list.id);
    xp += listStats.xp;
    todayCompleted += listStats.todayCompleted;
    dailyGoal += listStats.dailyGoal;
    if (listStats.streak > streak) streak = listStats.streak;
  });
  return {
    xp: xp,
    streak: streak,
    todayCompleted: todayCompleted,
    dailyGoal: dailyGoal || 3,
    questTitle: "모든 리스트 합산",
  };
}

function renderStatusPanel() {
  const viewStats = getDisplayStats();
  const level = getLevel(viewStats.xp);
  const intoLevel = getXpIntoLevel(viewStats.xp);
  const xpPercent = Math.min(100, (intoLevel / XP_PER_LEVEL) * 100);
  const cappedToday = Math.min(
    viewStats.todayCompleted,
    viewStats.dailyGoal,
  );
  const dailyPercent = Math.min(
    100,
    (cappedToday / viewStats.dailyGoal) * 100,
  );
  const overflow = viewStats.todayCompleted - viewStats.dailyGoal;

  levelLabel.textContent = "Lv." + level;
  xpLabel.textContent =
    viewStats.xp + " XP · " + intoLevel + "/" + XP_PER_LEVEL;
  xpBarFill.style.width = xpPercent + "%";
  streakLabel.textContent = "연속 " + viewStats.streak + "일";
  questTitle.textContent = viewStats.questTitle;
  dailyGoalLabel.textContent =
    cappedToday +
    " / " +
    viewStats.dailyGoal +
    (overflow > 0 ? " · +" + overflow : "");
  dailyBarFill.style.width = dailyPercent + "%";
}

function renderSideQuests() {
  sideQuestList.innerHTML = "";
  const targetListId =
    currentListId === ALL_LISTS_ID
      ? lastWritableListId || (lists[0] && lists[0].id)
      : currentListId;
  if (!targetListId) return;

  ensureSideQuests(targetListId);
  const listStats = ensureListStats(targetListId);
  listStats.sideQuests.forEach(function (quest) {
    const item = document.createElement("li");
    item.className =
      "side-quest-item" + (quest.claimed || quest.progress >= quest.target
        ? " is-done"
        : "");

    const title = document.createElement("p");
    title.className = "side-quest-title";
    title.textContent = quest.title;

    const progress = document.createElement("p");
    progress.className = "side-quest-progress";
    progress.textContent =
      Math.min(quest.progress, quest.target) +
      " / " +
      quest.target +
      (quest.claimed ? " · 보상 +" + quest.rewardXp + "XP" : "");

    item.appendChild(title);
    item.appendChild(progress);
    sideQuestList.appendChild(item);
  });
}

function renderAchievements() {
  achievementList.innerHTML = "";
  ACHIEVEMENT_DEFS.forEach(function (def) {
    const unlocked = Boolean(achievements.unlocked[def.id]);
    const item = document.createElement("li");
    item.className = "achievement-item" + (unlocked ? " is-unlocked" : "");
    item.title = def.desc;

    const mark = document.createElement("span");
    mark.className = "achievement-mark";
    mark.textContent = unlocked ? "✓" : "·";

    const title = document.createElement("span");
    title.className = "achievement-title";
    title.textContent = def.title;

    item.appendChild(mark);
    item.appendChild(title);
    achievementList.appendChild(item);
  });
}

function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
}

function addDays(date, amount) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + amount);
  return d;
}

function dateFromKey(dateKey) {
  const parts = dateKey.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function formatKoreanDate(dateKey) {
  const date = dateFromKey(dateKey);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const today = getLocalDateKey(new Date());
  const label =
    date.getFullYear() +
    "." +
    (date.getMonth() + 1) +
    "." +
    date.getDate() +
    " (" +
    weekdays[date.getDay()] +
    ")";
  if (dateKey === today) return "오늘 · " + label;
  if (dateKey === shiftDateKey(today, -1)) return "어제 · " + label;
  if (dateKey === shiftDateKey(today, 1)) return "내일 · " + label;
  return label;
}

function getTodosForDate(dateKey) {
  return getTodosInCurrentList().filter(function (todo) {
    if (todo.dueDate === dateKey) return true;
    if (todo.completedAt && getLocalDateKey(new Date(todo.completedAt)) === dateKey) {
      return true;
    }
    if (
      dateKey === getLocalDateKey(new Date()) &&
      !todo.dueDate &&
      !todo.done
    ) {
      return true;
    }
    return false;
  });
}

function getTimeBlock(todo) {
  if (todo.timeBlock === "morning" || todo.timeBlock === "afternoon" || todo.timeBlock === "evening") {
    return todo.timeBlock;
  }
  if (todo.priority === "high") return "morning";
  if (todo.priority === "low") return "evening";
  return "afternoon";
}

function renderPlannerMiniItem(todo) {
  const item = document.createElement("li");
  item.className = "planner-mini-item" + (todo.done ? " is-done" : "");

  const check = document.createElement("button");
  check.type = "button";
  check.className = "planner-check";
  check.textContent = todo.done ? "✓" : "○";
  check.setAttribute(
    "aria-label",
    todo.done ? todo.text + " 완료 취소" : todo.text + " 완료",
  );
  check.addEventListener("click", function () {
    toggleDone(todo.id);
  });

  const text = document.createElement("span");
  text.className = "planner-mini-text";
  text.textContent = todo.text;

  const meta = document.createElement("span");
  meta.className = "planner-mini-meta";
  meta.textContent = priorityLabel(todo.priority);

  item.appendChild(check);
  item.appendChild(text);
  item.appendChild(meta);
  return item;
}

function fillPlannerList(element, todosForList, emptyText) {
  element.innerHTML = "";
  if (todosForList.length === 0) {
    const empty = document.createElement("li");
    empty.className = "planner-empty";
    empty.textContent = emptyText;
    element.appendChild(empty);
    return;
  }
  todosForList.forEach(function (todo) {
    element.appendChild(renderPlannerMiniItem(todo));
  });
}

function renderDailyPlan() {
  dailyDateLabel.textContent = formatKoreanDate(selectedDate);
  dailyNoteInput.value = dayNotes[selectedDate] || "";

  const dayTodos = getTodosForDate(selectedDate);
  const remaining = dayTodos.filter(function (todo) {
    return !todo.done;
  });
  const done = dayTodos.filter(function (todo) {
    return todo.done;
  });

  dailySummary.textContent =
    "할 일 " +
    dayTodos.length +
    "개 · 남음 " +
    remaining.length +
    "개 · 완료 " +
    done.length +
    "개";

  const focus = remaining
    .slice()
    .sort(function (a, b) {
      const wa =
        typeof PRIORITY_WEIGHT[a.priority] === "number"
          ? PRIORITY_WEIGHT[a.priority]
          : 1;
      const wb =
        typeof PRIORITY_WEIGHT[b.priority] === "number"
          ? PRIORITY_WEIGHT[b.priority]
          : 1;
      if (wa !== wb) return wa - wb;
      return (a.order || 0) - (b.order || 0);
    })
    .slice(0, 3);

  fillPlannerList(dailyFocusList, focus, "포커스할 할 일이 없어요.");
  fillPlannerList(
    dailyMorningList,
    dayTodos.filter(function (todo) {
      return getTimeBlock(todo) === "morning";
    }),
    "오전 일정 없음",
  );
  fillPlannerList(
    dailyAfternoonList,
    dayTodos.filter(function (todo) {
      return getTimeBlock(todo) === "afternoon";
    }),
    "오후 일정 없음",
  );
  fillPlannerList(
    dailyEveningList,
    dayTodos.filter(function (todo) {
      return getTimeBlock(todo) === "evening";
    }),
    "저녁 일정 없음",
  );
}

function renderWeeklyPlan() {
  weeklyGrid.innerHTML = "";
  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];
  const start = weekAnchor;
  const end = addDays(start, 6);
  weeklyRangeLabel.textContent =
    start.getMonth() +
    1 +
    "/" +
    start.getDate() +
    " – " +
    (end.getMonth() + 1) +
    "/" +
    end.getDate();

  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(start, i);
    const key = getLocalDateKey(dayDate);
    const dayTodos = getTodosForDate(key);
    const doneCount = dayTodos.filter(function (todo) {
      return todo.done;
    }).length;

    const col = document.createElement("div");
    col.className =
      "weekly-day" +
      (key === getLocalDateKey(new Date()) ? " is-today" : "") +
      (key === selectedDate ? " is-selected" : "");

    const head = document.createElement("button");
    head.type = "button";
    head.className = "weekly-day-head";
    head.innerHTML =
      "<strong>" +
      weekdays[i] +
      "</strong><span>" +
      dayDate.getDate() +
      "</span>";
    head.addEventListener("click", function () {
      selectedDate = key;
      plannerView = "daily";
      plannerTabs.forEach(function (btn) {
        const active = btn.dataset.planner === "daily";
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
      plannerDaily.hidden = false;
      plannerWeekly.hidden = true;
      plannerCalendar.hidden = true;
      renderPlanner();
    });

    const count = document.createElement("p");
    count.className = "weekly-day-count";
    count.textContent = doneCount + "/" + dayTodos.length;

    const list = document.createElement("ul");
    list.className = "weekly-day-list";
    dayTodos.slice(0, 4).forEach(function (todo) {
      const li = document.createElement("li");
      li.className = todo.done ? "is-done" : "";
      li.textContent = todo.text;
      list.appendChild(li);
    });
    if (dayTodos.length === 0) {
      const empty = document.createElement("li");
      empty.className = "planner-empty";
      empty.textContent = "-";
      list.appendChild(empty);
    } else if (dayTodos.length > 4) {
      const more = document.createElement("li");
      more.className = "planner-empty";
      more.textContent = "+" + (dayTodos.length - 4);
      list.appendChild(more);
    }

    col.appendChild(head);
    col.appendChild(count);
    col.appendChild(list);
    weeklyGrid.appendChild(col);
  }
}

function renderCalendar() {
  calendarGrid.innerHTML = "";
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  calMonthLabel.textContent = year + "." + (month + 1);

  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];
  weekdays.forEach(function (label) {
    const cell = document.createElement("div");
    cell.className = "calendar-weekday";
    cell.textContent = label;
    calendarGrid.appendChild(cell);
  });

  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = getLocalDateKey(new Date());

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day is-outside";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = getLocalDateKey(date);
    const dayTodos = getTodosForDate(key);
    const dueCount = dayTodos.filter(function (todo) {
      return todo.dueDate === key;
    }).length;
    const doneCount = dayTodos.filter(function (todo) {
      return todo.done;
    }).length;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "calendar-day" +
      (key === todayKey ? " is-today" : "") +
      (key === selectedDate ? " is-selected" : "");
    btn.innerHTML =
      "<span class='calendar-day-num'>" +
      day +
      "</span>" +
      (dayTodos.length
        ? "<span class='calendar-day-dot'>" +
          doneCount +
          "/" +
          dayTodos.length +
          "</span>"
        : "");
    if (dueCount > 0) btn.classList.add("has-due");
    btn.addEventListener("click", function () {
      selectedDate = key;
      plannerView = "daily";
      plannerTabs.forEach(function (tab) {
        const active = tab.dataset.planner === "daily";
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      plannerDaily.hidden = false;
      plannerWeekly.hidden = true;
      plannerCalendar.hidden = true;
      renderPlanner();
    });
    calendarGrid.appendChild(btn);
  }
}

function renderPlanner() {
  if (plannerView === "daily") renderDailyPlan();
  else if (plannerView === "weekly") renderWeeklyPlan();
  else renderCalendar();
}

function openSidebar() {
  document.body.classList.add("sidebar-open");
  sidebarBackdrop.hidden = false;
  sidebarCloseBtn.focus();
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
  sidebarBackdrop.hidden = true;
}

function playFx() {
  fxBurst.classList.remove("is-active");
  void fxBurst.offsetWidth;
  fxBurst.classList.add("is-active");
  window.setTimeout(function () {
    fxBurst.classList.remove("is-active");
  }, 650);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toastEl.classList.remove("is-visible");
    toastEl.hidden = true;
  }, 2200);
}

function openConfirm(title, message, onConfirm) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  pendingConfirmAction = onConfirm;
  confirmModal.hidden = false;
  confirmOk.focus();
}

function closeConfirm() {
  confirmModal.hidden = true;
  pendingConfirmAction = null;
}

function saveAppData() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lists: lists,
        todos: todos,
        statsByList: statsByList,
        achievements: achievements,
        dayNotes: dayNotes,
        currentListId: currentListId,
        lastWritableListId: lastWritableListId,
      }),
    );
  } catch (error) {
    showToast("저장에 실패했습니다.");
  }
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeAppData(JSON.parse(raw));

    const v2 = localStorage.getItem(LEGACY_V2_KEY);
    if (v2) {
      const migrated = normalizeAppData(JSON.parse(v2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    const v1 = localStorage.getItem(LEGACY_V1_KEY);
    if (v1) {
      const legacyTodos = JSON.parse(v1);
      const defaultLists = createDefaultLists();
      const migratedTodos = Array.isArray(legacyTodos)
        ? legacyTodos
            .filter(function (item) {
              return item && typeof item.text === "string";
            })
            .map(function (item, index) {
              return {
                id: typeof item.id === "string" ? item.id : createId(),
                text: item.text,
                done: Boolean(item.done),
                createdAt:
                  typeof item.createdAt === "number"
                    ? item.createdAt
                    : Date.now(),
                completedAt: null,
                listId: defaultLists[0].id,
                priority: "medium",
                dueDate: null,
                order: index + 1,
              };
            })
        : [];
      const stats = {};
      stats[defaultLists[0].id] = createListStats(0);
      const migrated = {
        lists: defaultLists,
        todos: migratedTodos,
        statsByList: stats,
        achievements: { unlocked: {}, lifetimeCompleted: 0 },
        dayNotes: {},
        currentListId: ALL_LISTS_ID,
        lastWritableListId: defaultLists[0].id,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (error) {
    // defaults
  }

  const defaults = createDefaultLists();
  const stats = {};
  stats[defaults[0].id] = createListStats(0);
  return {
    lists: defaults,
    todos: [],
    statsByList: stats,
    achievements: { unlocked: {}, lifetimeCompleted: 0 },
    dayNotes: {},
    currentListId: ALL_LISTS_ID,
    lastWritableListId: defaults[0].id,
  };
}

function normalizeAppData(parsed) {
  const defaults = createDefaultLists();
  let nextLists =
    parsed && Array.isArray(parsed.lists) && parsed.lists.length > 0
      ? parsed.lists
          .filter(function (item) {
            return item && typeof item.name === "string";
          })
          .map(function (item) {
            return {
              id: typeof item.id === "string" ? item.id : createId(),
              name: item.name.trim() || "이름 없음",
            };
          })
      : defaults;
  if (nextLists.length === 0) nextLists = defaults;

  const validListIds = {};
  nextLists.forEach(function (list) {
    validListIds[list.id] = true;
  });

  const nextTodos =
    parsed && Array.isArray(parsed.todos)
      ? parsed.todos
          .filter(function (item) {
            return item && typeof item.text === "string";
          })
          .map(function (item, index) {
            const listId =
              typeof item.listId === "string" && validListIds[item.listId]
                ? item.listId
                : nextLists[0].id;
            const priority =
              item.priority === "high" || item.priority === "low"
                ? item.priority
                : "medium";
            return {
              id: typeof item.id === "string" ? item.id : createId(),
              text: item.text,
              done: Boolean(item.done),
              createdAt:
                typeof item.createdAt === "number"
                  ? item.createdAt
                  : Date.now(),
              completedAt:
                typeof item.completedAt === "number" ? item.completedAt : null,
              listId: listId,
              priority: priority,
              dueDate:
                typeof item.dueDate === "string" && item.dueDate
                  ? item.dueDate
                  : null,
              order: typeof item.order === "number" ? item.order : index + 1,
            };
          })
      : [];

  let nextCurrent =
    parsed && typeof parsed.currentListId === "string"
      ? parsed.currentListId
      : ALL_LISTS_ID;
  if (nextCurrent !== ALL_LISTS_ID && !validListIds[nextCurrent]) {
    nextCurrent = ALL_LISTS_ID;
  }

  let nextWritable =
    parsed && typeof parsed.lastWritableListId === "string"
      ? parsed.lastWritableListId
      : nextLists[0].id;
  if (!validListIds[nextWritable]) nextWritable = nextLists[0].id;

  return {
    lists: nextLists,
    todos: nextTodos,
    statsByList: normalizeStatsByList(
      parsed && (parsed.statsByList || parsed.stats),
      nextLists,
    ),
    achievements: normalizeAchievements(parsed && parsed.achievements),
    dayNotes: normalizeDayNotes(parsed && parsed.dayNotes),
    currentListId: nextCurrent,
    lastWritableListId: nextWritable,
  };
}

function normalizeDayNotes(raw) {
  if (!raw || typeof raw !== "object") return {};
  const result = {};
  Object.keys(raw).forEach(function (key) {
    if (typeof raw[key] === "string") result[key] = raw[key];
  });
  return result;
}

function normalizeAchievements(raw) {
  const result = { unlocked: {}, lifetimeCompleted: 0 };
  if (!raw || typeof raw !== "object") return result;
  if (typeof raw.lifetimeCompleted === "number" && raw.lifetimeCompleted >= 0) {
    result.lifetimeCompleted = Math.floor(raw.lifetimeCompleted);
  }
  if (raw.unlocked && typeof raw.unlocked === "object") {
    Object.keys(raw.unlocked).forEach(function (key) {
      result.unlocked[key] = raw.unlocked[key];
    });
  }
  return result;
}

function normalizeListStats(raw, templateIndex) {
  const defaults = createListStats(templateIndex);
  if (!raw || typeof raw !== "object") return defaults;
  return {
    xp: typeof raw.xp === "number" && raw.xp >= 0 ? Math.floor(raw.xp) : 0,
    streak:
      typeof raw.streak === "number" && raw.streak >= 0
        ? Math.floor(raw.streak)
        : 0,
    lastActiveDate:
      typeof raw.lastActiveDate === "string" ? raw.lastActiveDate : null,
    todayCompleted:
      typeof raw.todayCompleted === "number" && raw.todayCompleted >= 0
        ? Math.floor(raw.todayCompleted)
        : 0,
    todayDate:
      typeof raw.todayDate === "string" ? raw.todayDate : defaults.todayDate,
    weeklyCompleted:
      typeof raw.weeklyCompleted === "number" && raw.weeklyCompleted >= 0
        ? Math.floor(raw.weeklyCompleted)
        : 0,
    weekKey: typeof raw.weekKey === "string" ? raw.weekKey : defaults.weekKey,
    dailyGoal:
      typeof raw.dailyGoal === "number" && raw.dailyGoal > 0
        ? Math.floor(raw.dailyGoal)
        : defaults.dailyGoal,
    questTitle:
      typeof raw.questTitle === "string" && raw.questTitle.trim()
        ? raw.questTitle
        : defaults.questTitle,
    sideQuests: Array.isArray(raw.sideQuests) ? raw.sideQuests : [],
  };
}

function normalizeStatsByList(raw, nextLists) {
  const result = {};
  const isMap =
    raw &&
    typeof raw === "object" &&
    Object.keys(raw).some(function (key) {
      return (
        raw[key] &&
        typeof raw[key] === "object" &&
        typeof raw[key].xp === "number"
      );
    });
  const isLegacyGlobal =
    raw && typeof raw === "object" && typeof raw.xp === "number" && !isMap;

  nextLists.forEach(function (list, index) {
    if (isLegacyGlobal && index === 0) {
      result[list.id] = normalizeListStats(raw, index);
      return;
    }
    const source = isMap && raw[list.id] ? raw[list.id] : null;
    result[list.id] = normalizeListStats(source, index);
  });
  return result;
}
