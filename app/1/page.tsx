"use client";

import { useState } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState<{ id: number; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  // --- Logic Functions ---
  const add = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput("");
  };

  const remove = (id: number) => setTodos(todos.filter((t) => t.id !== id));

  const copyToClipboard = () => {
    // This copies the current list of todos as text
    const todoListText = todos.map((t) => `- ${t.text}`).join("\n");
    navigator.clipboard.writeText(todoListText || "No todos to copy!");
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset button text after 2s
  };

  // --- UI Layout ---
  return (
    <main style={{ maxWidth: "450px", margin: "60px auto", padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "12px", backgroundColor: "#fff" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#333" }}>Task Manager</h2>
        {/* Copy Button */}
        <button 
          onClick={copyToClipboard}
          style={{ padding: "6px 12px", fontSize: "12px", cursor: "pointer", borderRadius: "20px", border: "1px solid #0070f3", backgroundColor: copied ? "#0070f3" : "transparent", color: copied ? "white" : "#0070f3", transition: "0.3s" }}
        >
          {copied ? "✓ Copied List!" : "Copy List"}
        </button>
      </div>
      
      {/* Input Area */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "16px", outline: "none" }}
          value={input} 
          placeholder="Type something..."
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && add()} 
        />
        <button onClick={add} style={{ padding: "12px 20px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.length === 0 && <p style={{ textAlign: "center", color: "#888" }}>No tasks yet!</p>}
        {todos.map((t) => (
          <li key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #f5f5f5", alignItems: "center", transition: "0.2s" }}>
            <span style={{ fontSize: "16px", color: "#444" }}>{t.text}</span>
            <button onClick={() => remove(t.id)} style={{ background: "#fff5f5", border: "1px solid #ffebeb", color: "#ff4444", cursor: "pointer", borderRadius: "4px", padding: "4px 8px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Footer Info */}
      {todos.length > 0 && (
        <p style={{ marginTop: "20px", fontSize: "14px", color: "#666", textAlign: "right" }}>
          Total Tasks: {todos.length}
        </p>
      )}
    </main>
  );
}
