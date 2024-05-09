const socket = io();

const input = document.getElementById('todo-input');
const typingStatus = document.getElementById('typing-status');

input.addEventListener('input', () => {
    const title = input.value.trim();
    socket.emit('typing', { title });
});

socket.on('typing', data => {
    typingStatus.textContent = `${data.username} is typing: ${data.title}`;
});


function addTodo() {
    const input = document.getElementById('todo-input');
    const title = input.value.trim();

    if (title !== '') {
        socket.emit('addTodo', { title });
        input.value = '';
    }
}

socket.on('todoAdded', todo => {
    const todoList = document.getElementById('todo-list');
    const item = document.createElement('li');
    item.textContent = todo.title;
    todoList.appendChild(item);
});

