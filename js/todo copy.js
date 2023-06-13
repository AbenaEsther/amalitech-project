// Getting necessary DOM elements
var todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo-input');
const itemsLeftButton = document.getElementById('items-left');
const clearCompletedButton = document.getElementById('clear-completed');
const filterButtons = document.getElementsByClassName('filter-button');
const secondUl = document.getElementById('second-ul');

const savedData = localStorage.getItem('todoData');
if (savedData) {
    todoList.innerHTML = savedData;
}

// Save the todo list data in the local storage
function saveData() {
    //ne = document.getElementById('todo-list');
    console.log("saved", todoList.innerHTML)
    localStorage.setItem('todoData', todoList.innerHTML);
}

function showList() {
    alert(localStorage.getItem('todoData'))
    saveData = localStorage.getItem('todoData');
    if (savedData) {
        todoList.innerHTML = savedData;
}
}

// Add event listeners to save data when the list changes
todoList.addEventListener('click', saveData);
todoList.addEventListener('dragend', saveData);

// Add event listener to save data when the page is unloaded
window.addEventListener('load', showList);


//dark and light mode
const body = document.body;
const themeStyle = document.getElementById('theme-style');
const toggleIcon = document.getElementById('theme-toggle-icon');

function toggleTheme() {
    if (body.classList.contains('dark-theme')) { 
        body.classList.add('light-theme'); // Adding 'light-theme' class
        body.classList.remove('dark-theme');
        themeStyle.href = 'css/light-theme.css'; // Path to light theme CSS file
        toggleIcon.src = 'images/icon-moon.svg'; // Path to moon icon
    } else {
        body.classList.remove('light-theme'); // Removing 'light-theme' class
        body.classList.add('dark-theme');
        themeStyle.href = 'css/dark-theme.css'; // Path to dark theme CSS file
        toggleIcon.src = 'images/icon-sun.svg'; // Path to sun icon

    }
}

// Creating a counter for keeping track of items left
let itemsLeftCount = todoList.children.length;

// Adding event listener for the new todo input
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
        <button class="delete"><img src="images/icon-cross.svg" alt="cross icon"></button>
    `;
    todoItem.classList.add('todo-item');
    todoList.insertBefore(todoItem, todoList.lastElementChild);
    itemsLeftCount++;
    updateItemsLeftCount();

    // Adding event listener to the delete button of the newly added todo item
    const deleteButton = todoItem.querySelector('.delete');
    deleteButton.addEventListener('click', function() {
        todoItem.remove();
        itemsLeftCount--;
        updateItemsLeftCount();
    });
    saveData();
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
        saveData();
    }
});

// Add event listener for the clear completed button
clearCompletedButton.addEventListener('click', function() {
    const completedItems = todoList.getElementsByClassName('completed');
    while (completedItems.length > 0) {
        completedItems[0].remove();
        itemsLeftCount--;
    }
    updateItemsLeftCount();
    saveData();
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
            secondUl.style.display = 'block';
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

// Function to update the items left count
function updateItemsLeftCount() {
    const todoItems = document.querySelectorAll('.list > li:not(#lower-div)');
    const itemsLeftButton = document.getElementById('items-left');
    const itemsLeft = Array.from(todoItems).filter(item => !item.classList.contains('completed')).length;
    itemsLeftButton.textContent = `${itemsLeft} items left`;
}

// Add event listener for the new todo input
newTodoInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && newTodoInput.value.trim() !== '') {
      event.preventDefault();
      addTodoItem(newTodoInput.value.trim());
      newTodoInput.value = '';
    }
  });
  
  // Add event listener for the form checkbox
  const formCheckbox = document.getElementById('form-checkbox');
  formCheckbox.addEventListener('change', function () {
    if (formCheckbox.checked && newTodoInput.value.trim() !== '') {
      addTodoItem(newTodoInput.value.trim());
      newTodoInput.value = '';
    }
  });
  