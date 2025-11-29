"use client";

export default function Navbar({ title = "Task Manager" }) {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <div className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center border-b">
      <h1 className="text-2xl font-bold text-purple-600">
        {title}
      </h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
