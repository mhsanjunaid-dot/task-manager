"use client";

import { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "@/lib/api/tasks";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import api from "@/lib/api/api";

export default function Dashboard() {
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("pending");
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setEditErrors] = useState<Record<string, string>>({});
  const [aiSummary, setAiSummary] = useState("");

const extractError = (err: any) => {
  const detail = err?.response?.data?.detail;

  if (!detail) return "Something went wrong";

  // detail is array of FastAPI error objects
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join(", ");
  }

  // detail is single object
  if (typeof detail === "object") {
    return detail.msg || JSON.stringify(detail);
  }

  // detail is a plain string
  return String(detail);
};



  const fetchSummary = async () => {
    try {
      const res = await api.get("/ai/weekly-summary");
      setAiSummary(res.data.summary);
    } catch (err) {
      setAiSummary("Could not fetch summary.");
    }
  };

 const loadTasks = async () => {
  try {
    const res = await getTasks();
    setTasks(res.data);
  } catch (err: any) {
    console.error(extractError(err));
  }
};


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  const validateTask = (data: any) => {
    const newErrors = { title: "", description: "", category: "" };

    if (!data.title.trim()) newErrors.title = "Title is required";
    if (!data.description.trim()) newErrors.description = "Description is required";
    if (!data.category.trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return !newErrors.title && !newErrors.description && !newErrors.category;
  };

  const handleCreate = async () => {
  const data = { title, description, category };
  if (!validateTask(data)) return;

  try {
    await createTask({
      title,
      description,
      category,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      status,
    });
  } catch (err: any) {

    // keep previous field errors + add general error
    setErrors((prev) => ({
      ...prev,
      general: extractError(err),
    }));

    return;
  }

  // reset inputs
  setTitle("");
  setDescription("");
  setCategory("");
  setPriority(1);
  setDeadline("");
  setStatus("pending");

  loadTasks();
};


 const handleDelete = async (id: number) => {
  try {
    await deleteTask(id);
  } catch (err: any) {
    alert(extractError(err));
    return;
  }

  loadTasks();
};


  useEffect(() => {
    loadTasks();
  }, []);

  const openEdit = (task: any) => {
    setEditingTask({
      ...task,
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().slice(0, 16)
        : "",
    });
  };

  const closeEdit = () => setEditingTask(null);

  const editSet = (field: string, value: any) => {
    setEditingTask((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
  if (!editingTask) return;

  setSaving(true);

  try {
    await updateTask(editingTask.id, {
      title: editingTask.title,
      description: editingTask.description,
      category: editingTask.category,
      priority: Number(editingTask.priority),
      deadline: editingTask.deadline
        ? new Date(editingTask.deadline).toISOString()
        : null,
      status: editingTask.status,
      completed: editingTask.completed ?? false,
    });
  } catch (err: any) {
    alert(extractError(err));
    setSaving(false);
    return;
  }

    setSaving(false);
    closeEdit();
    loadTasks();
  };

  let filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      (t.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (t.description?.toLowerCase() || "").includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "" ||
      t.category?.toLowerCase() === filterCategory.toLowerCase();

    const matchesPriority =
      filterPriority === "" || String(t.priority) === filterPriority;

    const matchesStatus =
      filterStatus === "" || t.status === filterStatus;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesStatus
    );
  });

  if (sortOption === "deadline-asc") {
    filteredTasks = filteredTasks.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  }

  if (sortOption === "deadline-desc") {
    filteredTasks = filteredTasks.sort(
      (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    );
  }

  if (sortOption === "priority-asc") {
    filteredTasks = filteredTasks.sort((a, b) => a.priority - b.priority);
  }

  if (sortOption === "priority-desc") {
    filteredTasks = filteredTasks.sort((a, b) => b.priority - a.priority);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Create Task Form */}
      <div className="max-w-xl mx-auto bg-white p-6 mt-10 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Create New Task</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}

          <input
            type="text"
            placeholder="Category (Work, Personal, Study...)"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}

          <select
            value={priority ?? ""}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full p-3 border rounded-lg"
          >
            <option value="" disabled>
              Priority
            </option>
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>

          <input
            type="datetime-local"
            placeholder="Deadline"
            value={deadline ? deadline.slice(0, 16) : ""}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <select
            value={status || "pending"}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={handleCreate}
            className="w-full py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border rounded-lg shadow-sm w-64"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-3 border rounded-lg shadow-sm w-40"
          >
            <option value="">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="study">Study</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-3 border rounded-lg shadow-sm w-36"
          >
            <option value="">All Priorities</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 border rounded-lg shadow-sm w-36"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-3 border rounded-lg shadow-sm w-40"
          >
            <option value="">Sort</option>
            <option value="deadline-asc">Deadline ↑</option>
            <option value="deadline-desc">Deadline ↓</option>
            <option value="priority-asc">Low → High</option>
            <option value="priority-desc">High → Low</option>
          </select>

        </div>
      </div>

      {/* AI Summary */}
      <div className="max-w-3xl mx-auto mt-8 text-center">
        <button
          onClick={fetchSummary}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700"
        >
          Generate Weekly AI Summary
        </button>

        {aiSummary && (
          <p className="mt-4 bg-white p-4 rounded-xl shadow text-gray-700">
            {aiSummary}
          </p>
        )}
      </div>

      {/* Task List */}
      <div className="max-w-3xl mx-auto mt-10 space-y-4 pb-20">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => router.push(`/task/${task.id}`)}
            className="bg-white p-5 rounded-xl shadow border flex justify-between items-start cursor-pointer hover:bg-gray-50 transition"
          >
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-500">{task.description}</p>

              <p className="text-sm mt-2">
                <span className="font-semibold">Category:</span>{" "}
                {task.category || "None"}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Priority:</span>{" "}
                {task.priority}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Status:</span>{" "}
                {task.status}
              </p>

              {task.deadline && (
                <p className="text-sm">
                  <span className="font-semibold">Deadline:</span>{" "}
                  {new Date(task.deadline).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(task);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task.id);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 overflow-y-auto py-10 flex justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[95%] sm:w-[85%] md:w-[70%] lg:w-[550px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

            <div className="space-y-4">

              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => {
                  editSet("title", e.target.value);
                  setEditErrors((prev) => ({ ...prev, title: "" }));
                }}
                className="w-full p-3 border rounded-lg"
              />

              <textarea
                value={editingTask.description || ""}
                onChange={(e) => {
                  editSet("description", e.target.value);
                  setEditErrors((prev) => ({ ...prev, description: "" }));
                }}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="text"
                value={editingTask.category || ""}
                onChange={(e) => {
                  editSet("category", e.target.value);
                  setEditErrors((prev) => ({ ...prev, category: "" }));
                }}
                className="w-full p-3 border rounded-lg"
              />

              <select
                value={editingTask.priority}
                onChange={(e) => {
                  editSet("priority", Number(e.target.value));
                  setEditErrors((prev) => ({ ...prev, priority: "" }));
                }}
                className="w-full p-3 border rounded-lg"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>

              <input
                type="datetime-local"
                value={editingTask.deadline}
                onChange={(e) => {
                  editSet("deadline", e.target.value);
                  setEditErrors((prev) => ({ ...prev, deadline: "" }));
                }}
                className="w-full p-3 border rounded-lg"
              />

              <select
                value={editingTask.status}
                onChange={(e) => editSet("status", e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={handleUpdate}
                className="w-full py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={closeEdit}
                className="w-full py-3 mt-2 border rounded-lg"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
