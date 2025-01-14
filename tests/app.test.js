const { JSDOM } = require("jsdom");
const expect = require("chai").expect;


describe("TaskHive App", function() {
    
    let dom;
    let document;
    let addTaskButton;
    let taskInput;
    let taskList;

    beforeEach(function() {
        dom = new JSDOM(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TaskHive App</title>
        </head>
        <body>
            <div class="container">
                <h1>TaskHive</h1>
                <input type="text" id="taskInput" placeholder="Enter a task">
                <button id="addTaskButton">Add Task</button>
                <ul id="taskList"></ul>
            </div>
        </body>
        </html>`);
    
        document = dom.window.document;
        addTaskButton = document.getElementById("addTaskButton");
        taskInput = document.getElementById("taskInput");
        taskList = document.getElementById("taskList");
        
        function toggleCompletion(event) {
            const taskItem = event.target.parentElement;
            taskItem.classList.toggle("completed");
        }
    
        function deleteTask(event) {
            const taskItem = event.target.parentElement;
            taskItem.remove();
        }
    
        function addTask() {
            const taskText = taskInput.value.trim();
            if (taskText !== "") {
                const taskItem = document.createElement("li");
                taskItem.textContent = taskText;
    
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", toggleCompletion);
                taskItem.appendChild(checkbox);
    
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", deleteTask);
                taskItem.appendChild(deleteButton);
    
                taskList.appendChild(taskItem);
                taskInput.value = "";
            }
        }
        addTaskButton.addEventListener("click", addTask);
    });
    

    it("should add a task to the task list", function() {
        taskInput.value = "Test Task1";
        addTaskButton.click();
    
        const taskText = taskList.children[0].childNodes[0].nodeValue;
        expect(taskText).to.equal("Test Task1");
    });
    
    it("should add multiple tasks to the task list", function() {
        taskInput.value = "Task 1";
        addTaskButton.click();
        taskInput.value = "Task 2";
        addTaskButton.click();
    
        expect(taskList.children.length).to.equal(2);
        expect(taskList.children[0].textContent).to.include("Task 1");
        expect(taskList.children[1].textContent).to.include("Task 2");
    });

    it("should mark a task as completed", function() {
        taskInput.value = "Task 1";
        addTaskButton.click();
    
        const checkbox = taskList.children[0].querySelector("input[type='checkbox']");
        checkbox.click();
    
        expect(taskList.children[0].classList.contains("completed")).to.be.true;
    });
    
    it("should delete a task from the task list", function() {
        taskInput.value = "Task to Delete";
        addTaskButton.click();
    
        const deleteButton = taskList.children[0].querySelector("button");
        deleteButton.click();
    
        expect(taskList.children.length).to.equal(0);
    });
    
    it("should not add an empty task", function() {
        taskInput.value = "";
        addTaskButton.click();
    
        expect(taskList.children.length).to.equal(0);
    });

    it("should allow marking and unmarking a task as completed", function() {
        taskInput.value = "Task to Toggle";
        addTaskButton.click();
    
        const checkbox = taskList.children[0].querySelector("input[type='checkbox']");
        checkbox.click(); // Mark as completed
        expect(taskList.children[0].classList.contains("completed")).to.be.true;
    
        checkbox.click(); // Unmark as completed
        expect(taskList.children[0].classList.contains("completed")).to.be.false;
    });
    
    it("should clear the input field after adding a task", function() {
        taskInput.value = "Task to Clear Input";
        addTaskButton.click();
    
        expect(taskInput.value).to.equal("");
    });

    it("should handle adding and deleting multiple tasks", function() {
        taskInput.value = "Task 1";
        addTaskButton.click();
        taskInput.value = "Task 2";
        addTaskButton.click();
    
        expect(taskList.children.length).to.equal(2);
    
        // Delete the first task
        const deleteButton1 = taskList.children[0].querySelector("button");
        deleteButton1.click();
    
        expect(taskList.children.length).to.equal(1);
        expect(taskList.children[0].textContent).to.include("Task 2");
    
        // Delete the second task
        const deleteButton2 = taskList.children[0].querySelector("button");
        deleteButton2.click();
    
        expect(taskList.children.length).to.equal(0);
    });
    
    it("should preserve tasks' state after marking one as completed", function() {
        taskInput.value = "Task 1";
        addTaskButton.click();
        taskInput.value = "Task 2";
        addTaskButton.click();
    
        const checkbox1 = taskList.children[0].querySelector("input[type='checkbox']");
        checkbox1.click(); // Mark first task as completed
    
        expect(taskList.children[0].classList.contains("completed")).to.be.true;
        expect(taskList.children[1].classList.contains("completed")).to.be.false;
    });
    
    it("should handle duplicate task names", function() {
        taskInput.value = "Duplicate Task";
        addTaskButton.click();
        taskInput.value = "Duplicate Task";
        addTaskButton.click();
    
        expect(taskList.children.length).to.equal(2);
        expect(taskList.children[0].textContent).to.include("Duplicate Task");
        expect(taskList.children[1].textContent).to.include("Duplicate Task");
    });

    it("should not affect other tasks when deleting one", function() {
        taskInput.value = "Task 1";
        addTaskButton.click();
        taskInput.value = "Task 2";
        addTaskButton.click();
    
        const deleteButton = taskList.children[0].querySelector("button");
        deleteButton.click(); // Delete the first task
    
        expect(taskList.children.length).to.equal(1);
        expect(taskList.children[0].textContent).to.include("Task 2");
    });
});
