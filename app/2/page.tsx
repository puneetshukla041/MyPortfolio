"use client";
import { useState } from "react";

export default function CounterCodeCard() {
  const [copied, setCopied] = useState(false);

  // The code to be displayed and copied
  const codeString = `"use client";
import { useState } from "react";

export default function Counter() {
  const [n, setN] = useState(0);

  return (
    <div style={{
      width: 200,
      margin: "60px auto",
      textAlign: "center",
      fontFamily: "Arial",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{marginBottom:20}}>{n}</h2>

      <div style={{display:"flex",justifyContent:"center",gap:10}}>
        <button 
          onClick={()=>setN(n-1)} 
          style={{padding:"8px 14px",fontSize:18,cursor:"pointer"}}
        >
          -
        </button>

        <button 
          onClick={()=>setN(n+1)} 
          style={{padding:"8px 14px",fontSize:18,cursor:"pointer"}}
        >
          +
        </button>
      </div>
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
      flexDirection: "column",
      alignItems: "center", 
      minHeight: "100vh", 
      backgroundColor: "#f0f2f5",
      padding: "40px 20px" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "550px", 
        backgroundColor: "#1e1e1e", 
        borderRadius: "12px", 
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        overflow: "hidden"
      }}>
        {/* Card Toolbar */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "12px 20px", 
          backgroundColor: "#2d2d2d",
          borderBottom: "1px solid #3c3c3c"
        }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27c93f" }} />
          </div>
          
          <button 
            onClick={handleCopy}
            style={{
              padding: "6px 14px",
              backgroundColor: copied ? "#2ecc71" : "#3498db",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.3s ease"
            }}
          >
            {copied ? "✓ Copied" : "Copy Code"}
          </button>
        </div>

        {/* Code Display Area */}
        <pre style={{ 
          margin: 0, 
          padding: "24px", 
          color: "#d4d4d4", 
          fontSize: "14px", 
          overflowX: "auto",
          fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
          lineHeight: "1.7"
        }}>
          <code>{codeString}</code>
        </pre>
      </div>
    </div>
  );
}
