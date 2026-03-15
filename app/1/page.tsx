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
      minHeight: "100vh", 
      backgroundColor: "#ffffff",
      position: "relative" // Allows absolute positioning of the button
    }}>
      <button 
        onClick={handleCopy}
        title="Close" // Adds a tooltip to sell the illusion
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          fontSize: "24px",
          color: "#333333", // Dark grey so it's visible on white
          cursor: "pointer",
          padding: "10px",
        }}
      >
        {copied ? "✕" : "✕"}
      </button>
    </div>
  );
}
