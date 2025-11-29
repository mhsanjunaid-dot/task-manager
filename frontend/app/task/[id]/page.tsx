"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { getTaskById, updateTask, deleteTask } from "@/lib/api/tasks";
import { useParams } from "next/navigation";

type TaskType = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  priority?: number;
  deadline?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  completed?: boolean;
};

export default function TaskDetails() {
  const { id } = useParams() as { id: string };


  const router = useRouter();

  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<string>("");
  const timerRef = useRef<number | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPriority, setEditPriority] = useState<number>(1);
  const [editDeadline, setEditDeadline] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    router.push("/login");
    return;
  }
}, [router]);


  const validate = () => {
    if (!editTitle.trim()) return "Title required";
    if (!editDescription.trim()) return "Description required";
    if (!editCategory.trim()) return "Category required";
    return null;
  };

 useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    router.push("/login");
    return;
  }

  if (!id) {
    setError("No task ID provided");
    setLoading(false);
    return;
  }

  const load = async () => {
    try {
      setLoading(true);
      const res = await getTaskById(id);
      setTask(res.data);

      setEditTitle(res.data.title || "");
      setEditDescription(res.data.description || "");
      setEditCategory(res.data.category || "");
      setEditPriority(res.data.priority ?? 1);
      setEditDeadline(
        res.data.deadline
          ? new Date(res.data.deadline).toISOString().slice(0, 16)
          : ""
      );
      setEditStatus(res.data.status || "pending");

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch task");
      setLoading(false);
    }
  };

  load();
}, [id]);


  useEffect(() => {
    const updateCountdown = () => {
      if (!task?.deadline) {
        setTimeLeft("No deadline set");
        return;
      }

      const now = Date.now();
      const deadlineMs = new Date(task.deadline).getTime();
      const diff = deadlineMs - now;

      if (diff <= 0) {
        setTimeLeft("Deadline passed");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(updateCountdown, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [task?.deadline]);

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;

    try {
      const payload = { ...task, status: newStatus };
      await updateTask(task.id, payload);

      setTask((prev) =>
        prev ? { ...prev, status: newStatus } : prev
      );

      setEditStatus(newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = async () => {
    if (!task) return;

    try {
      await deleteTask(task.id);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async () => {
    const v = validate();
    if (v) {
      alert(v);
      return;
    }
    if (!task) return;

    try {
      const payload = {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        priority: Number(editPriority),
        deadline: editDeadline ? new Date(editDeadline).toISOString() : null,
        status: editStatus,
        completed: task.completed ?? false,
      };

      await updateTask(task.id, payload);

      setTask({ ...task, ...payload });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar title="Task Details" />
        <div className="max-w-3xl mx-auto p-6">Loading...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar title="Task Details" />
        <div className="max-w-3xl mx-auto p-6">
          <p className="text-red-500">{error || "Task not found"}</p>
          <button
            className="mt-4 px-4 py-2 border rounded"
            onClick={() => router.push("/dashboard")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Task Details" />

      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">

            <div>
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{task.category}</p>
              <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 items-start md:items-end">

              <div className="text-sm">
                <div>
                  <span className="font-semibold">Priority:</span>{" "}
                  {task.priority}
                </div>

                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(e.target.value)
                    }
                    className="p-2 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <span className="font-semibold">Deadline:</span>{" "}
                  {task.deadline
                    ? new Date(task.deadline).toLocaleString()
                    : "None"}
                </div>

                <div className="mt-2 text-sm">
                  <span className="font-semibold">Time left:</span>{" "}
                  <span className="text-indigo-600">{timeLeft}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditMode((s) => !s)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded shadow"
                >
                  {editMode ? "Cancel Edit" : "Edit"}
                </button>

                <button
                  onClick={handleDeleteClick}
                  className="px-4 py-2 bg-red-500 text-white rounded shadow"
                >
                  Delete
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 border rounded"
                >
                  Back
                </button>
              </div>
            </div>
          </div>

          {editMode && (
            <div className="mt-6 border-t pt-4 space-y-4">

              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(Number(e.target.value))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Deadline</label>
                  <input
                    type="datetime-local"
                    value={editDeadline}
                    onChange={(e) =>
                      setEditDeadline(e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded shadow"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
