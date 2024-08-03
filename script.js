// Select elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task
addTaskButton.addEventListener('click', addTask);

// Function to add a task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskPriority = document.getElementById('prioritySelect').value;
    const dueDate = document.getElementById('dueDate').value;
    const taskCategory = document.getElementById('categorySelect').value;

    if (taskText === '') {
        alert('Task cannot be empty');
        return;
    }

    const dateAdded = new Date().toLocaleString();

    const taskItem = createTaskElement(taskText, taskPriority, dueDate, taskCategory, dateAdded);
    taskList.appendChild(taskItem);

    saveTasks();
    taskInput.value = '';
    document.getElementById('dueDate').value = '';
}

// Function to create a task element
function createTaskElement(taskText, taskPriority, dueDate, taskCategory, dateAdded) {
    const li = document.createElement('li');
    li.classList.add(`${taskPriority}-priority`);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed');
        saveTasks();
    });

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = `${taskText} (Due: ${dueDate}, Category: ${taskCategory})`;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'date-added';
    dateSpan.textContent = `Added: ${dateAdded}`;

    const editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(li, span, dateSpan));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(li);
        saveTasks();
    });

    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';
    infoDiv.appendChild(checkbox);
    infoDiv.appendChild(span);
    infoDiv.appendChild(actions);

    li.appendChild(infoDiv);
    li.appendChild(dateSpan);

    return li;
}

// Function to edit a task
function editTask(taskItem, taskSpan, dateSpan) {
    const [taskText, rest] = taskSpan.textContent.split(' (Due: ');
    const [dueDatePart, categoryPart] = rest.split(', Category: ');
    const newText = prompt('Edit task:', taskText);
    const newDueDate = prompt('Edit due date:', dueDatePart.replace(')', ''));
    const newCategory = prompt('Edit category:', categoryPart.replace(')', ''));

    if (newText !== null && newText.trim() !== '') {
        taskSpan.textContent = `${newText.trim()} (Due: ${newDueDate}, Category: ${newCategory})`;
        dateSpan.textContent = `Edited: ${new Date().toLocaleString()}`;
        saveTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskText = taskItem.querySelector('.task-text').textContent;
        const completed = taskItem.querySelector('input').checked;
        const priority = taskItem.classList.contains('low-priority') ? 'low' :
                         taskItem.classList.contains('medium-priority') ? 'medium' :
                         'high';
        const dueDate = taskText.match(/\(Due: (.*?),/)[1];
        const category = taskText.match(/, Category: (.*?)\)$/)[1];
        const dateAdded = taskItem.querySelector('.date-added').textContent.replace(/Added: |Edited: /, '');
        tasks.push({ text: taskText.replace(` (Due: ${dueDate}, Category: ${category})`, ''), completed, priority, dueDate, category, dateAdded });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.priority, task.dueDate, task.category, task.dateAdded);
        if (task.completed) {
            taskItem.querySelector('input').checked = true;
            taskItem.classList.add('completed');
        }
        taskList.appendChild(taskItem);
    });
}
