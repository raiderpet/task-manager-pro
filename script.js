class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // DOM Elements
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.taskList = document.getElementById('task-list');
        this.taskCount = document.getElementById('task-count');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clear-completed');

        // Event Listeners
        this.taskForm.addEventListener('submit', (e) => this.addTask(e));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterTasks(btn.dataset.filter));
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

        // Initial render
        this.renderTasks();
    }

    addTask(e) {
        e.preventDefault();
        const taskText = this.taskInput.value.trim();
        
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };

            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
        }
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed} : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="taskManager.toggleTask(${task.id})"
                >
                <span class="task-text">${task.text}</span>
                <button 
                    class="delete-btn"
                    onclick="taskManager.deleteTask(${task.id})"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');

        const activeTasks = this.tasks.filter(task => !task.completed).length;
        this.taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize Task Manager
const taskManager = new TaskManager();
