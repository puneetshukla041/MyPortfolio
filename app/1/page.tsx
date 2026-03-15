"use client";
import { useState } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState<{ id: number; text: string }[]>([]);
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput("");
  };

  const remove = (id: number) => setTodos(todos.filter((t) => t.id !== id));

  return (
    <main style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", fontFamily: "Arial", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>Todo App</h2>
      
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input 
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
          value={input} 
          placeholder="Add a task..."
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && add()} 
        />
        <button onClick={add} style={{ padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee", alignItems: "center" }}>
            <span>{t.text}</span>
            <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: "#ff4444", cursor: "pointer", fontWeight: "bold" }}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
