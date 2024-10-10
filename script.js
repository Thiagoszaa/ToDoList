document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById('task-list');

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = task;
            taskList.appendChild(taskItem);
        });
    };

   
    const createTaskInput = () => {
        const inputTask = document.createElement('input');
        inputTask.type = 'text';
        inputTask.placeholder = 'Digite sua tarefa';
        inputTask.id = 'new-task-input';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Adicionar';
        confirmButton.addEventListener('click', () => {
            const taskValue = inputTask.value.trim();
            if (taskValue) {
                const taskItem = document.createElement('li');
                taskItem.textContent = taskValue;
                taskList.appendChild(taskItem);
                saveTaskToLocalStorage(taskValue);
                inputTask.remove();
                confirmButton.remove();
            }
        });

        const container = document.querySelector('.container');
        container.appendChild(inputTask);
        container.appendChild(confirmButton);
    };

    const saveTaskToLocalStorage = (task) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const removeTask = () => {
        const tasks = taskList.getElementsByTagName('li');
        if (tasks.length > 0) {
            const select = document.createElement('select');
            select.id = 'task-to-remove';
            Array.from(tasks).forEach((task, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = task.textContent;
                select.appendChild(option);
            });

            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Remover';
            confirmButton.addEventListener('click', () => {
                const selectedIndex = select.value;
                if (selectedIndex !== "") {
                    taskList.removeChild(tasks[selectedIndex]);
                    removeTaskFromLocalStorage(selectedIndex);
                    select.remove();
                    confirmButton.remove();
                }
            });

            const container = document.querySelector('.container');
            container.appendChild(select);
            container.appendChild(confirmButton);
        }
    };

    const removeTaskFromLocalStorage = (index) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateTask = () => {
        const tasks = taskList.getElementsByTagName('li');
        if (tasks.length > 0) {
            const select = document.createElement('select');
            select.id = 'task-to-update';
            Array.from(tasks).forEach((task, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = task.textContent;
                select.appendChild(option);
            });

            const inputUpdate = document.createElement('input');
            inputUpdate.type = 'text';
            inputUpdate.placeholder = 'Nova descrição';

            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Atualizar';
            confirmButton.addEventListener('click', () => {
                const selectedIndex = select.value;
                const newValue = inputUpdate.value.trim();
                if (selectedIndex !== "" && newValue) {
                    tasks[selectedIndex].textContent = newValue;
                    updateTaskInLocalStorage(selectedIndex, newValue);
                    select.remove();
                    inputUpdate.remove();
                    confirmButton.remove();
                }
            });

            const container = document.querySelector('.container');
            container.appendChild(select);
            container.appendChild(inputUpdate);
            container.appendChild(confirmButton);
        }
    };

    const updateTaskInLocalStorage = (index, newValue) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks[index] = newValue;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Carregar tarefas ao iniciar a aplicação
    loadTasks();

    // Adicionar eventos aos botões
    document.getElementById('add-task-button').addEventListener('click', createTaskInput);
    document.getElementById('remove-task-button').addEventListener('click', removeTask);
    document.getElementById('att-task-button').addEventListener('click', updateTask);
});

const toggleButton = document.getElementById('toggle-mode');
const body = document.body;

toggleButton.addEventListener('click', () => {
  body.classList.toggle('light-mode');
});

