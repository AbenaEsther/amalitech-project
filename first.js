// Define an empty array to hold our to-dos
let todos = [];

// Function to add a new to-do
function addTodo() {
  const newTodo = prompt("Enter a new to-do:");
  todos.push({ task: newTodo, completed: false });
  console.log(`Added a new to-do: ${newTodo}`);
}

// Function to mark a to-do as complete
function completeTodo() {
  console.log("Here are your incomplete to-dos:");
  const incompleteTodos = todos.filter((todo) => !todo.completed);
  incompleteTodos.forEach((todo, index) => console.log(`${index}: ${todo.task}`));
  const todoIndex = Number(prompt("Enter the number of the to-do you completed:"));
  incompleteTodos[todoIndex].completed = true;
  console.log(`Marked as complete: ${incompleteTodos[todoIndex].task}`);
}

// Function to delete a to-do
function deleteTodo() {
  console.log("Here are your to-dos:");
  todos.forEach((todo, index) =>
    console.log(`${index}: ${todo.task} ${todo.completed ? "(completed)" : ""}`)
  );
  const todoIndex = Number(prompt("Enter the number of the to-do you want to delete:"));
  todos.splice(todoIndex, 1);
  console.log("Deleted to-do.");
}

// Function to display the to-do list
function displayTodos() {
  console.log("Here are your to-dos:");
  todos.forEach((todo, index) =>
    console.log(`${index}: ${todo.task} ${todo.completed ? "(completed)" : ""}`)
  );
}

// Function to filter the to-do list by completed status
function filterTodos() {
  const filterOption = prompt(
    "Enter 'all' to see all to-dos, 'active' to see incomplete to-dos, or 'completed' to see completed to-dos:"
  );
  if (filterOption === "all") {
    displayTodos();
  } else if (filterOption === "active") {
    const incompleteTodos = todos.filter((todo) => !todo.completed);
    incompleteTodos.forEach((todo, index) => console.log(`${index}: ${todo.task}`));
  } else if (filterOption === "completed") {
    const completedTodos = todos.filter((todo) => todo.completed);
    completedTodos.forEach((todo, index) => console.log(`${index}: ${todo.task}`));
  } else {
    console.log("Invalid filter option.");
  }
}

// Main program loop
while (true) {
  console.log("\n\nWhat do you want to do?");
  console.log("Enter 'add' to add a new to-do");
  console.log("Enter 'complete' to mark a to-do as complete");
  console.log("Enter 'delete' to delete a to-do");
  console.log("Enter 'list' to display all to-dos");
  console.log("Enter 'filter' to filter to-dos by status");
  console.log("Enter 'quit' to exit");
  const choice = prompt("> ");

  if (choice === "add") {
    addTodo();
  } else if (choice === "complete") {
    completeTodo();
  } else if (choice === "delete") {
    deleteTodo();
  } else if (choice === "list") {
    displayTodos();
  } else if (choice === "filter") {
    filterTodos();
  } else if (choice === "quit") {
    break;
  } else {
    console.log("Invalid choice. Please try again.");
  }
}
  