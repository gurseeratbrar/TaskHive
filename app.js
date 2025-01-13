document.getElementById("addTaskButton").addEventListener("click", addTask);

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const taskList = document.getElementById("taskList");

        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;

        // Create a checkbox to mark as completed
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", toggleCompletion);
        taskItem.appendChild(checkbox);

        // Create a delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", deleteTask);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
        taskInput.value = ""; // Clears the input field
    }
}

function toggleCompletion(event) {
    const taskItem = event.target.parentElement;
    taskItem.classList.toggle("completed");
}

function deleteTask(event) {
    const taskItem = event.target.parentElement;
    taskItem.remove();
}