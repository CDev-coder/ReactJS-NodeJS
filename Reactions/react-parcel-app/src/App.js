import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>React Parcel App</h1>
      <p>Welcome to your React application built with Parcel!</p>

      <div style={{ margin: "2rem 0" }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Count: {count}
        </button>
        <p style={{ marginTop: "1rem" }}>
          You've clicked {count} time{count !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <h3>Features:</h3>
        <ul>
          <li>✅ Zero-config setup with Parcel</li>
          <li>✅ Hot reloading</li>
          <li>✅ JSX support</li>
          <li>✅ Fast builds</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
