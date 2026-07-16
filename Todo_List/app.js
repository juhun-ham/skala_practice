const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const todoCount = document.querySelector("#todoCount");
const clearAllBtn = document.querySelector("#clearAllBtn");
const filterButtons = document.querySelectorAll(".filter-button");

// 현재 필터: all | active | done
let currentFilter = "all";

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  if (todoText === "") {
    alert("할 일을 입력하세요.");
    todoInput.focus();
    return;
  }

  addTodo(todoText);
  todoInput.value = "";
  todoInput.focus();
});

// 전체 삭제
clearAllBtn.addEventListener("click", function () {
  if (todoList.children.length === 0) {
    alert("삭제할 할 일이 없습니다.");
    return;
  }

  const ok = confirm("정말 모두 삭제할까요?");
  if (!ok) return;

  todoList.innerHTML = "";
  updateCount();
});

// 필터 버튼
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    applyFilter();
  });
});

function addTodo(todoText) {
  const todoItem = document.createElement("li");
  todoItem.className = "todo-item";

  const todoTextSpan = document.createElement("span");
  todoTextSpan.textContent = todoText;

  const actionBox = document.createElement("div");
  actionBox.className = "todo-actions";

  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.className = "done-button";
  doneButton.textContent = "완료";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-button";
  editButton.textContent = "수정";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "삭제";

  doneButton.addEventListener("click", function () {
    todoItem.classList.toggle("done");
    applyFilter();
    updateCount();
  });

  // 수정: prompt로 새 글자 받기
  editButton.addEventListener("click", function () {
    const next = prompt("할 일을 수정하세요", todoTextSpan.textContent);
    if (next === null) return; // 취소

    const trimmed = next.trim();
    if (trimmed === "") {
      alert("빈 내용은 저장할 수 없습니다.");
      return;
    }

    todoTextSpan.textContent = trimmed;
  });

  deleteButton.addEventListener("click", function () {
    todoItem.remove();
    updateCount();
  });

  actionBox.appendChild(doneButton);
  actionBox.appendChild(editButton);
  actionBox.appendChild(deleteButton);

  todoItem.appendChild(todoTextSpan);
  todoItem.appendChild(actionBox);
  todoList.appendChild(todoItem);

  applyFilter();
  updateCount();
}

// 1. 남은/전체 개수 표시
function updateCount() {
  const total = todoList.children.length;
  let done = 0;

  for (let i = 0; i < todoList.children.length; i++) {
    if (todoList.children[i].classList.contains("done")) {
      done++;
    }
  }

  const left = total - done;
  todoCount.textContent =
    "전체 " + total + "개 · 남은 일 " + left + "개 · 완료 " + done + "개";
}

// 4. 필터 적용
function applyFilter() {
  const items = todoList.children;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isDone = item.classList.contains("done");

    if (currentFilter === "all") {
      item.style.display = "flex";
    } else if (currentFilter === "active") {
      item.style.display = isDone ? "none" : "flex";
    } else if (currentFilter === "done") {
      item.style.display = isDone ? "flex" : "none";
    }
  }
}
