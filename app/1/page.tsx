"use client";
import { useState } from "react";

export default function CodeCardPage() {
  const [copied, setCopied] = useState(false);

  const codeString = `"use client";
import { useState } from "react";

export default function Todo() {
  const [t, setT] = useState<string[]>([]);
  const [i, setI] = useState("");

  const add = () => i && (setT([...t, i]), setI(""));

  return (
    <div style={{width:300,margin:"40px auto",fontFamily:"Arial"}}>
      <h3>Todo</h3>

      <input
        value={i}
        placeholder="task..."
        onChange={e=>setI(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&add()}
      />
      <button onClick={add}>Add</button>

      {t.map((x,k)=>(
        <p key={k} style={{cursor:"pointer"}} onClick={()=>setT(t.filter((_,j)=>j!==k))}>
          {x} x
        </p>
      ))}
    </div>
  );
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh", 
      backgroundColor: "#f4f7f6",
      padding: "20px" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "600px", 
        backgroundColor: "#282c34", 
        borderRadius: "10px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        overflow: "hidden"
      }}>
        {/* Card Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "10px 20px", 
          backgroundColor: "#21252b",
          borderBottom: "1px solid #3e4451"
        }}>
          <span style={{ color: "#abb2bf", fontSize: "13px", fontFamily: "monospace" }}>
            TodoApp.tsx
          </span>
          <button 
            onClick={handleCopy}
            style={{
              padding: "5px 12px",
              backgroundColor: copied ? "#98c379" : "#61afef",
              color: "#282c34",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
              transition: "all 0.2s ease"
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Code Content */}
        <pre style={{ 
          margin: 0, 
          padding: "20px", 
          color: "#abb2bf", 
          fontSize: "14px", 
          overflowX: "auto",
          fontFamily: "'Fira Code', 'Courier New', monospace",
          lineHeight: "1.6"
        }}>
          <code>{codeString}</code>
        </pre>
      </div>
    </div>
  );
}
