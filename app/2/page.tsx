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
      minHeight: "100vh", 
      backgroundColor: "#ffffff",
      position: "relative" 
    }}>
      <button 
        onClick={handleCopy}
        title="Close" 
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          fontSize: "24px",
          color: "#333333", 
          cursor: "pointer",
          padding: "10px",
        }}
      >
        {copied ? "✕" : "✕"}
      </button>
    </div>
  );
}
