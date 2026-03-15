"use client";
import { useState } from "react";

export default function CodeCardPage() {
  const [copied, setCopied] = useState(false);

  // This is the string representation of your code to be displayed/copied
  const codeString = `"use client";
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
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset status after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f9f9f9", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      {/* The Card Container */}
      <div style={{ 
        width: "100%", 
        maxWidth: "800px", 
        backgroundColor: "#1e1e1e", 
        borderRadius: "12px", 
        overflow: "hidden", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        position: "relative"
      }}>
        
        {/* Header with Title and Copy Button */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "12px 20px", 
          backgroundColor: "#2d2d2d",
          borderBottom: "1px solid #444"
        }}>
          <span style={{ color: "#aaa", fontSize: "14px", fontFamily: "monospace" }}>page.tsx</span>
          <button 
            onClick={handleCopy}
            style={{
              padding: "6px 12px",
              backgroundColor: copied ? "#28a745" : "#444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "background 0.2s"
            }}
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Code Block Area */}
        <pre style={{ 
          margin: 0, 
          padding: "20px", 
          overflowX: "auto", 
          color: "#d4d4d4", 
          fontSize: "14px", 
          lineHeight: "1.5",
          fontFamily: "'Courier New', Courier, monospace"
        }}>
          <code>{codeString}</code>
        </pre>
      </div>
    </div>
  );
}
