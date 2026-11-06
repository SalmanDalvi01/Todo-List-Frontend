
import { useState, useEffect, useRef } from "react";
import Style from "./App.module.css";

function App() {
  const [taskMessage, setTaskMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // GET API Call
  useEffect(() => {
    async function api_call() {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/tasks`);

        if (!resp.ok) {
          throw new Error("Something Went Wrong Get Request Failed");
        }

        const tasks = await resp.json();
        setTasks(tasks);
      } catch (err) {
      }
    }

    api_call();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (editId === null) {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: taskMessage }),
        });

        if (!resp.ok) {
          throw new Error("Something Went Wrong. Post Request Failed");
        }

        const task = await resp.json();
        setTasks([...tasks, task]);
        setTaskMessage("");

      } catch (err) {
      }

    } else {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: taskMessage }),
        });

        if (!resp.ok) {
          throw new Error("Something Went Wrong. Put Request Failed");
        }

        const newTask = tasks.map((task) => {
          if (task.id === editId) {
            return { ...task, message: taskMessage };
          }

          return task;
        });

        setTasks(newTask);
        setEditId(null);
        setTaskMessage("");

      } catch (err) {
      }
    }
  }

  function handleEdit(id, message) {
    setEditId(id);
    setTaskMessage(message);
    inputRef.current.focus();
  }

  async function handleDelete(id) {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        throw new Error("Something Went Wrong. Delete Request Failed");
      }

      const newTask = tasks.filter((task) => task.id !== id);
      setTasks(newTask);

    } catch (err) {
    }
  }

  return (
    <div className={Style.container}>
      <div className={Style.todoBox}>

        <h1 className={Style.heading}>Todo List</h1>

        <form onSubmit={handleSubmit} className={Style.form}>
          <input
            className={Style.input}
            type="text"
            placeholder="Enter your task..."
            ref={inputRef}
            value={taskMessage}
            required
            onChange={(e) => setTaskMessage(e.target.value)}
          />

          <button type="submit" className={Style.submitBtn}>
            {editId === null ? "Add Task" : "Update Task"}
          </button>
        </form>

        <ul className={Style.taskList}>
          {tasks.map((task) => (
            <li key={task.id} className={Style.taskItem}>
              <span className={Style.taskText}>
                {task.message}
              </span>

              <div className={Style.actions}>
                <button
                  className={Style.editBtn}
                  onClick={() => handleEdit(task.id, task.message)}
                >
                  Edit
                </button>

                <button
                  className={Style.deleteBtn}
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className={Style.emptyMessage}>
            No tasks available. Add your first task!
          </p>
        )}

      </div>
    </div>
  );
}

export default App;
