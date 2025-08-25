const form = document.getElementById('form');
const input = document.getElementById('input');
const todosUL = document.getElementById('todos');
const prioritySelect = document.getElementById('priority');
const progressBar = document.getElementById('progress-bar');
const filters = document.querySelectorAll('.filter');

let filter = "all";

const todos = JSON.parse(localStorage.getItem('todos')) || [];

todos.forEach(todo => addTodo(todo));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo();
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTodos();
  });
});

function addTodo(todo) {
  let todoText = input.value;
  let todoPriority = prioritySelect.value;

  if(todo) {
    todoText = todo.text;
    todoPriority = todo.priority;
  }

  if(todoText) {
    const todoObj = {
      text: todoText,
      completed: todo?.completed || false,
      priority: todoPriority
    };
    todos.push(todoObj);
    updateLS();
    renderTodos();
    input.value = '';
  }
}

function renderTodos() {
  todosUL.innerHTML = "";
  
  const filtered = todos.filter(todo => {
    if(filter === "active") return !todo.completed;
    if(filter === "completed") return todo.completed;
    return true;
  });

  filtered.forEach((todo, idx) => {
    const li = document.createElement('li');
    if(todo.completed) li.classList.add('completed');
    li.innerHTML = `
      <span>${todo.text}</span>
      <span class="priority ${todo.priority}">${todo.priority}</span>
    `;

    li.addEventListener('click', () => {
      todo.completed = !todo.completed;
      updateLS();
      renderTodos();
    });

    li.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      todos.splice(idx, 1);
      updateLS();
      renderTodos();
    });

    todosUL.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const completed = todos.filter(t => t.completed).length;
  const percent = todos.length ? (completed / todos.length) * 100 : 0;
  progressBar.style.width = percent + "%";
}

function updateLS() {
  localStorage.setItem('todos', JSON.stringify(todos));
}
