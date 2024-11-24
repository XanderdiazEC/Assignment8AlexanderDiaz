// Initialize the app
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentId = 1;
        console.log('%cTodoApp initialized', 'color: #4CAF50; font-weight: bold');
        console.log('---------------------');
    }

    addTask(description, priority) {
        try {
            const validPriorities = ['high', 'medium', 'low'];
            if (!validPriorities.includes(priority.toLowerCase())) {
                throw new Error('Invalid priority');
            }

            const newTask = {
                id: this.currentId++,
                description: description,
                priority: priority.toLowerCase(),
                createdAt: new Date().toLocaleString()
            };

            this.tasks.push(newTask);
            console.log('\n%cNew Task Added:', 'color: #4CAF50; font-weight: bold');
            console.log('%cID:', 'font-weight: bold', newTask.id);
            console.log('%cDescription:', 'font-weight: bold', newTask.description);
            console.log('%cPriority:', 'font-weight: bold', newTask.priority);
            console.log('%cCreated:', 'font-weight: bold', newTask.createdAt);
            console.log('---------------------');
            this.displayTasks(); // Update display after adding
            return newTask;
        } catch (error) {
            console.error('%cError adding task:', 'color: #dc3545', error.message);
            throw error;
        }
    }

    getAllTasks() {
        console.log('\n%cAll Tasks:', 'color: #4CAF50; font-weight: bold');
        if (this.tasks.length === 0) {
            console.log('No tasks found');
        } else {
            this.tasks.forEach(task => {
                console.log(`\n%cID: ${task.id}`, 'font-weight: bold');
                console.log(`Description: ${task.description}`);
                console.log(`Priority: ${task.priority}`);
                console.log(`Created: ${task.createdAt}`);
                console.log('---------------------');
            });
        }
        this.displayTasks(); // Update display
        return [...this.tasks];
    }

    deleteTask(taskId) {
        console.log(`\n%cAttempting to delete task with ID: ${taskId}`, 'color: #dc3545');
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        const deleted = initialLength !== this.tasks.length;
        
        if (deleted) {
            console.log('%cTask successfully deleted', 'color: #4CAF50');
        } else {
            console.log('%cTask not found', 'color: #dc3545');
        }
        console.log('---------------------');
        this.displayTasks(); // Update display after deleting
        return deleted;
    }

    getTasksByPriority(priority) {
        console.log(`\n%cTasks with ${priority} priority:`, 'color: #4CAF50; font-weight: bold');
        const filteredTasks = this.tasks.filter(task => 
            task.priority === priority.toLowerCase()
        );

        if (filteredTasks.length === 0) {
            console.log('No tasks found with this priority');
            this.displayTasks(); // Show empty state
        } else {
            filteredTasks.forEach(task => {
                console.log(`\n%cID: ${task.id}`, 'font-weight: bold');
                console.log(`Description: ${task.description}`);
                console.log(`Priority: ${task.priority}`);
                console.log(`Created: ${task.createdAt}`);
                console.log('---------------------');
            });
            // Display only filtered tasks
            this.displayFilteredTasks(filteredTasks);
        }
        return filteredTasks;
    }

    displayFilteredTasks(tasksToDisplay) {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;

        taskList.innerHTML = '';
        
        if (tasksToDisplay.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks to display</p>';
            return;
        }

        tasksToDisplay.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="task-info">
                <h3>${task.description}</h3>
                <p class="task-priority">Priority: ${task.priority}</p>
                <p class="task-date">Created: ${task.createdAt}</p>
            </div>
            <button onclick="window.deleteTaskHandler(${task.id})" class="btn-delete">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
            </button>
        `;
        return taskElement;
    }

    displayTasks() {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;

        taskList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks to display</p>';
            return;
        }

        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });

        // Also log to console for debugging
        console.log('\n%cCurrent Tasks List:', 'color: #4CAF50; font-weight: bold');
        console.table(this.tasks.map(task => ({
            ID: task.id,
            Description: task.description,
            Priority: task.priority,
            Created: task.createdAt
        })));
    }
}

// Initialize the app
const todoApp = new TodoApp();

// Event Handlers
function addTaskHandler(event) {
    try {
        event.preventDefault();
        const descriptionInput = document.getElementById('taskDescription');
        const priorityInput = document.getElementById('taskPriority');

        if (!descriptionInput || !priorityInput) {
            throw new Error('Form inputs not found');
        }

        const description = descriptionInput.value.trim();
        const priority = priorityInput.value;

        if (!description) {
            alert('Please enter a task description');
            return;
        }

        todoApp.addTask(description, priority);
        event.target.reset();
        console.log('%cTask added successfully', 'color: #4CAF50');
    } catch (error) {
        console.error('%cError in add task handler:', 'color: #dc3545', error.message);
        alert('Error adding task: ' + error.message);
    }
}

// Delete task handler
window.deleteTaskHandler = function(taskId) {
    try {
        if (confirm('Are you sure you want to delete this task?')) {
            todoApp.deleteTask(taskId);
        }
    } catch (error) {
        console.error('%cError deleting task:', 'color: #dc3545', error.message);
        alert('Error deleting task: ' + error.message);
    }
};

window.showAllTasks = function() {
    try {
        todoApp.getAllTasks();
    } catch (error) {
        console.error('%cError showing all tasks:', 'color: #dc3545', error.message);
        alert('Error displaying tasks: ' + error.message);
    }
};

window.filterTasks = function(priority) {
    try {
        todoApp.getTasksByPriority(priority);
    } catch (error) {
        console.error('%cError filtering tasks:', 'color: #dc3545', error.message);
        alert('Error filtering tasks: ' + error.message);
    }
};

// Set up event listeners
window.onload = function() {
    try {
        const form = document.getElementById('taskForm');
        if (!form) {
            throw new Error('Task form not found');
        }
        form.addEventListener('submit', addTaskHandler);
        console.log('%cEvent listeners set up', 'color: #4CAF50');

    } catch (error) {
        console.error('%cError setting up event listeners:', 'color: #dc3545', error.message);
        alert('Error initializing the application. Please refresh the page.');
    }

    // Initial console message
    console.log('%cWelcome to Todo App!', 'color: #4CAF50; font-size: 16px; font-weight: bold');
    console.log('Use the interface to manage your tasks. All operations will be logged here.');
    console.log('To delete a task, use the delete button next to each task');
    console.log('---------------------');
};