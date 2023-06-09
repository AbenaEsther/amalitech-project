// Getting necessary DOM elements
var todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo-input');
const itemsLeftButton = document.getElementById('items-left');
const clearCompletedButton = document.getElementById('clear-completed');
const filterButtons = document.getElementsByClassName('filter-button');
const secondUl = document.getElementById('second-ul');

var todos = []

const savedData = localStorage.getItem('todos');

if (savedData) {
    todos = JSON.parse(savedData||[]);
    
}

// Save the todo list data in the local storage
function saveData() {
    //ne = document.getElementById('todo-list');
    localStorage.setItem('todos', JSON.stringify(todos));
    showList()
    updateItemsCount()
}

function toggleCompleted(id){
    todos = todos.map((todoItem)=>{
        return todoItem?.id === id ? {
            ...todoItem,
            completed: !todoItem.completed
        } : todoItem
    })
    saveData()
}

function deleteItem(id){
    todos = todos.filter((todoItem)=>{
        return todoItem?.id !== id
    })
    
    saveData()
}

function showList() {
    todoList.innerHTML= todos.map((todo)=>`
        <li id="item-${todo.id}" class="li ${todo.completed ? 'completed' : ''}" draggable="true">
            <input onclick="toggleCompleted(${todo.id})" ${todo.completed ? 'checked':''} type="checkbox">
            <span  onclick="toggleCompleted(${todo.id})">${todo.title}</span>
            <button  onclick="deleteItem(${todo.id})" class="delete"><img src="images/icon-cross.svg" alt="cross icon"></button>
        </li>   
    `).join("")
}

// Add event listeners to save data when the list changes
todoList.addEventListener('click', saveData);
todoList.addEventListener('dragend', saveData);

// Add event listener to save data when the page is unloaded
window.addEventListener('load', function(){
    const savedTheme = localStorage.getItem('theme')
    if(savedTheme){
        setTheme(savedTheme)
    }
    updateItemsCount()
    showList()
});


//dark and light mode
const body = document.body;
const themeStyle = document.getElementById('theme-style');
const toggleIcon = document.getElementById('theme-toggle-icon');

function setTheme(name){
    if (name === "light-theme") { 
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
    localStorage.setItem("theme", name)
}

function toggleTheme() {
    if (body.classList.contains('dark-theme')) { 
        setTheme('light-theme');
    } else {
        setTheme("dark-theme")
    }
}

// Creating a counter for keeping track of items left

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
    todos.push({
        id: Date.now(),
        title: todoText,
        completed: false
    })

    ;
    saveData();
}

// Add event listener for the clear completed button
clearCompletedButton.addEventListener('click', function() {
    todos = todos.filter(function(todoItem){
        return todoItem.completed === false
    }) 
    ;
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
let draggedIndex = null
console.log("start")
// Add drag and drop functionality to reorder items
// 

// Add dragstart event listener to each todo item
todoList.addEventListener('dragstart', function(event) {
    draggedIndex = Array.from(todoList.children).findIndex((el, i)=>el.id === event.target.id)
});

// Add dragover event listener to the todo list
todoList.addEventListener('dragover', function(event) {
    event.preventDefault();
});

// Add dragend event listener to each todo item
todoList.addEventListener('drop', function(event) {
    event.preventDefault();
    var targetIndex = Array.from(todoList.children).findIndex((el, i)=>el.id === event.target.id)
    targetIndex = targetIndex<0 ? (todos.length-1) : targetIndex;
    // Swap the positions of todos in the array
    const temp = todos[draggedIndex];
    todos[draggedIndex] = todos[targetIndex];
    todos[targetIndex] = temp;

    // Re-render the todo list
    saveData();

    // Clear the dragged index
    draggedIndex = null;
});

// Function to get the element after which the dragged item should be inserted
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce(function(closest, child) {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset > 0 && offset < closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// Initial filtering of the todo list
filterTodoList('all');

// Function to update the items left count
function  updateItemsCount(){
    let total = 0
    todos.forEach(function(todoItem){
        if(todoItem.completed===false){
            total++;
        }
    })
    itemsLeftButton.textContent = `${total} items left`;
}

// Add event listener for the new todo input
newTodoInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && newTodoInput.value.trim() !== '') {
      //event.preventDefault();
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

// Get all the filter buttons
// Add click event listener to each filter button
for(let i=0; i<filterButtons.length; i++){
    button = filterButtons[i]
    button.addEventListener('click', (e) => {
        // Remove blue color from all filter buttons
        console.log(button.getAttribute("id"))
        for(let j=0; j<filterButtons.length; j++){
            btn = filterButtons[j];
            btn.style.color = "";
        }
        // Set blue color to the clicked filter button
        e.target.style.color = 'hsl(220, 98%, 61%)';
    })
}

  