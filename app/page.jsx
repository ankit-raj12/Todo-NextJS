"use client";

import { useEffect, useRef, useState } from "react";
import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const { theme = "dark", setTheme } = useTheme();

  //fetchTodo & fetchUser
  useEffect(() => {
    const fetchTodo = async () => {
      const todosData = await fetch("/api/todos").then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      });

      if (!todosData) return;
      setTodos(todosData.reverse());
    };

    const fetchUser = async () => {
      const user = await fetch("api/user").then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      });
      setUser({
        name: user?.name,
        email: user?.email,
      });
    };

    fetchTodo();
    fetchUser();
  }, [router]);

  // Add new todo
  const addTodo = async (text) => {
    const newTodo = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }).then((res) => res.json());

    setTodos([newTodo, ...todos]);
  };

  // Delete todo
  const deleteTodo = async (id) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    if (response.status == 204)
      setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    const todo = todos.find((todo) => id == todo.id);
    const response = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (response.status === 200)
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
  };

  // Update todo text
  const updateTodo = async (id, newText) => {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ text: newText }),
    });
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  //logout
  const logout = async () => {
    await fetch(`/api/logout`, {
      method: "POST",
    });
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 bg-background">
      <div className="w-full max-w-2xl">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-600">
            Todo App
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-muted transition-all duration-200 cursor-pointer border border-transparent hover:border-border"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-slate-700" />
              )}
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-lg hover:bg-muted transition-all duration-200 cursor-pointer border border-transparent hover:border-border"
                aria-label="User menu"
              >
                <UserIcon className="h-5 w-5" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-border">
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {user.name}
                    </div>
                    <div
                      className="text-xs text-muted-foreground truncate"
                      title={user.email}
                    >
                      {user.email}
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <TodoForm addTodo={addTodo} />

        <main className="mt-8">
          <TodoList
            todos={todos}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
            updateTodo={updateTodo}
          />
        </main>
      </div>
    </div>
  );
}
