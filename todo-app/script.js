class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.renderTodos();
        this.updateStats();
    }

    setupEventListeners() {
        // Add todo button
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        
        // Enter key in input
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear buttons
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('todoDate').value = today;
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const dateInput = document.getElementById('todoDate');
        const text = input.value.trim();
        const date = dateInput.value;

        if (!text) {
            this.showNotification('할일을 입력해주세요!', 'error');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            date: date,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();

        input.value = '';
        this.showNotification('할일이 추가되었습니다!', 'success');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
        }
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const newText = prompt('할일을 수정하세요:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            this.saveTodos();
            this.renderTodos();
            this.showNotification('할일이 수정되었습니다!', 'success');
        }
    }

    deleteTodo(id) {
        if (confirm('정말로 이 할일을 삭제하시겠습니까?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.showNotification('할일이 삭제되었습니다!', 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTodos();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.style.display = 'none';
            emptyState.style.display = 'block';
            
            // Update empty state message based on filter
            const emptyMessages = {
                all: ['아직 할일이 없습니다.', '새로운 할일을 추가해보세요!'],
                pending: ['진행중인 할일이 없습니다.', '새로운 할일을 추가하거나 완료된 할일을 확인해보세요!'],
                completed: ['완료된 할일이 없습니다.', '할일을 완료해보세요!']
            };
            
            const messages = emptyMessages[this.currentFilter];
            emptyState.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <p>${messages[0]}</p>
                <p>${messages[1]}</p>
            `;
        } else {
            todoList.style.display = 'block';
            emptyState.style.display = 'none';
            
            todoList.innerHTML = filteredTodos.map(todo => this.createTodoElement(todo)).join('');
        }
    }

    createTodoElement(todo) {
        const date = new Date(todo.date);
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const isOverdue = !todo.completed && date < new Date().setHours(0, 0, 0, 0);
        const overdueClass = isOverdue ? 'overdue' : '';

        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''} ${overdueClass}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-date">
                        <i class="fas fa-calendar"></i> ${formattedDate}
                        ${isOverdue ? '<span class="overdue-badge">마감일 지남</span>' : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-icon edit-icon" title="수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon delete-icon" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('completedCount').textContent = completed;
    }

    clearCompleted() {
        if (confirm('완료된 모든 할일을 삭제하시겠습니까?')) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.showNotification('완료된 할일이 모두 삭제되었습니다!', 'success');
        }
    }

    clearAll() {
        if (confirm('모든 할일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            this.todos = [];
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.showNotification('모든 할일이 삭제되었습니다!', 'success');
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            animation: slideInRight 0.3s ease;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Event delegation for todo items
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();

    // Event delegation for todo interactions
    document.addEventListener('click', (e) => {
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;

        const todoId = parseInt(todoItem.dataset.id);

        if (e.target.classList.contains('todo-checkbox')) {
            app.toggleTodo(todoId);
        } else if (e.target.closest('.edit-icon')) {
            app.editTodo(todoId);
        } else if (e.target.closest('.delete-icon')) {
            app.deleteTodo(todoId);
        }
    });
});

// Add slideOutRight animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(slideOutStyle); 