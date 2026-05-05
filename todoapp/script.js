const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const currentDateDisplay = document.getElementById('currentDate');

// Display Today's Date
const options = { weekday: 'long', month: 'long', day: 'numeric' };
currentDateDisplay.innerText = new Date().toLocaleDateString(undefined, options);

// Load data
let tasks = JSON.parse(localStorage.getItem('novaTasks')) || [];

function saveAndRender() {
    localStorage.setItem('novaTasks', JSON.stringify(tasks));
    render();
}

function calculateStatus(dueDate) {
    if (!dueDate) return { label: "", class: "" };
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(dueDate);
    target.setHours(0,0,0,0);
    
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return { label: "Overdue", class: "urgent" };
    if (diff === 0) return { label: "Due Today", class: "urgent" };
    if (diff <= 2) return { label: `${diff} days left`, class: "soon" };
    return { label: `${diff} days left`, class: "normal" };
}

function addTask() {
    const text = todoInput.value.trim();
    const date = dateInput.value;

    if (!text) return;

    tasks.push({
        id: Date.now(),
        text: text,
        date: date,
        completed: false
    });

    todoInput.value = "";
    dateInput.value = "";
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function render() {
    todoList.innerHTML = "";
    let remaining = 0;

    tasks.sort((a, b) => a.completed - b.completed).forEach(task => {
        if (!task.completed) remaining++;
        
        const status = calculateStatus(task.date);
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="check-btn ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">
                ${task.completed ? '✓' : ''}
            </div>
            <div class="todo-content" onclick="toggleTask(${task.id})">
                <p>${task.text}</p>
                <small>${task.date ? '📅 ' + task.date : 'No Deadline'}</small>
            </div>
            ${task.date && !task.completed ? `<span class="badge ${status.class}">${status.label}</span>` : ''}
            <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
        `;
        todoList.appendChild(li);
    });

    taskCount.innerText = `${remaining} Tasks Remaining`;
}

addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

// Initial call
render();