document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  const firebaseConfig = {
    apiKey: "AIzaSyC4gg6-hYzGT4TeMH--zfRep-B5b1Ymzj0",
    authDomain: "todo-list-4f2ed.firebaseapp.com",
    projectId: "todo-list-4f2ed",
    storageBucket: "todo-list-4f2ed.appspot.com",
    messagingSenderId: "152652830007",
    appId: "1:152652830007:web:3a68aa89a68ed3c29236b2",
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

  // Handle form submission
  document.getElementById("todo-form").addEventListener("submit", addTask);

  function addTask(e) {
    e.preventDefault();

    var taskInput = document.getElementById("todo-input").value;

    db.collection("todos")
      .add({
        task: taskInput,
        completed: false,
      })
      .then(() => {
        document.getElementById("todo-form").reset();
        console.log("Task added successfully");
      })
      .catch((error) => {
        console.error("Error adding task: ", error);
      });
  }

  // Fetch and display tasks
  db.collection("todos").onSnapshot((snapshot) => {
    let tasks = document.getElementById("todo-list");
    tasks.innerHTML = "";
    snapshot.forEach((doc) => {
      let task = doc.data();
      let li = document.createElement("li");
      let input = document.createElement("input");
      input.type = "text";
      input.value = task.task;
      input.disabled = true;

      let editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.onclick = () => {
        input.disabled = !input.disabled;
        if (!input.disabled) {
          editButton.textContent = "Save";
        } else {
          editTask(doc.id, input.value);
          editButton.textContent = "Edit";
        }
      };

      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => deleteTask(doc.id);

      li.appendChild(input);
      li.appendChild(editButton);
      li.appendChild(deleteButton);
      tasks.appendChild(li);
    });
  });

  // Edit a task
  function editTask(id, newValue) {
    db.collection("todos")
      .doc(id)
      .update({
        task: newValue,
      })
      .then(() => {
        console.log("Task successfully updated");
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
      });
  }

  // Delete a task
  function deleteTask(id) {
    db.collection("todos")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Task successfully deleted");
      })
      .catch((error) => {
        console.error("Error deleting task: ", error);
      });
  }
});
