 // Get necessary DOM elements
const todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo-input');
const itemsLeftButton = document.getElementById('items-left');
const clearCompletedButton = document.getElementById('clear-completed');
const filterButtons = document.getElementsByClassName('filter-button');

function toggleTheme() {
    const body = document.body;
    const themeStyle = document.getElementById('theme-style');

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeStyle.href = './light-theme.css'; // Path to your light theme CSS file
    } else {
        body.classList.add('dark-theme');
        themeStyle.href = './dark-theme.css'; // Path to your dark theme CSS file
    }
}

// Create a counter for keeping track of items left
let itemsLeftCount = todoList.children.length;

// Add event listener for the new todo input
newTodoInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && newTodoInput.value.trim() !== '') {
        event.preventDefault();
        addTodoItem(newTodoInput.value.trim());
        newTodoInput.value = '';
    }
});

// Function to add a new todo item
function addTodoItem(todoText) {
    const todoItem = document.createElement('li');
    todoItem.innerHTML = `
        <input type="checkbox">
        <span>${todoText}</span>
        <button class="delete"><img src="file:///C:/Users/ADMIN/Desktop/amalitech%20project/images/icon-cross.svg" alt="cross icon"></button>
    `;
    todoItem.classList.add('todo-item');
    todoList.appendChild(todoItem, todoList.lastElementChild);
    itemsLeftCount++;
    updateItemsLeftCount();

    // Add event listener to the delete button of the newly added todo item
    const deleteButton = todoItem.querySelector('.delete');
    deleteButton.addEventListener('click', function() {
        todoItem.remove();
        itemsLeftCount--;
        updateItemsLeftCount();
    });
}

// Add event listener for the todo list
todoList.addEventListener('click', function(event) {
    const target = event.target;
    if (target.tagName === 'INPUT') {
        target.parentNode.classList.toggle('completed');
        if (target.checked) {
            itemsLeftCount--;
        } else {
            itemsLeftCount++;
        }
        updateItemsLeftCount();
    } else if (target.tagName === 'IMG') {
        target.parentNode.parentNode.remove();
        itemsLeftCount--;
        updateItemsLeftCount();
    }
});

// Function to update the items left count
function updateItemsLeftCount() {
    itemsLeftButton.textContent = `${itemsLeftCount} items left`;
}

// Add event listener for the clear completed button
clearCompletedButton.addEventListener('click', function() {
    const completedItems = todoList.getElementsByClassName('completed');
    while (completedItems.length > 0) {
        completedItems[0].remove();
        itemsLeftCount--;
    }
    updateItemsLeftCount();
});

// Add event listeners for the filter buttons
Array.from(filterButtons).forEach(function(button) {
    button.addEventListener('click', function() {
        const filter = button.getAttribute('data-filter');
        filterTodoList(filter);
    });
});

// Function to filter the todo list
function filterTodoList(filter) {
    const todoItems = todoList.children;
    Array.from(todoItems).forEach(function(item) {
        item.style.display = 'list-item';
        if (filter === 'active' && item.classList.contains('completed')) {
            item.style.display = 'none';
        } else if (filter === 'completed' && !item.classList.contains('completed')) {
            item.style.display = 'none';
        }
    });
}

// Add drag and drop functionality to reorder items
let dragItem = null;

todoList.addEventListener('dragstart', function(event) {
    dragItem = event.target;
    setTimeout(function() {
        dragItem.style.display = 'none';
    }, 0);
});

todoList.addEventListener('dragover', function(event) {
    event.preventDefault();
    const targetItem = getDragAfterElement(todoList, event.clientY);
    if (targetItem === null) {
        todoList.appendChild(dragItem);
    } else {
        todoList.insertBefore(dragItem, targetItem);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

todoList.addEventListener('dragend', function(event) {
    event.preventDefault();
    dragItem.style.display = 'flex';
    dragItem = null;
});

// Initial filtering of the todo list
filterTodoList('all');

//begin
// Get the cross-icon buttons
// const deleteButtons = document.getElementsByClassName('delete');
// Add event listeners to the delete buttons
// Array.from(deleteButtons).forEach(function(button) {
    // button.addEventListener('click', function() {
        // const listItem = button.parentElement;
        // listItem.remove();
    // });
// });
//end


