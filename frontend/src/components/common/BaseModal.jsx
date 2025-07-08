import React from "react";

export default function BaseModal({ title, children, footer, onClose }) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          width: "500px",
          maxWidth: "90vw",
          zIndex: 1050,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            backgroundColor: "#0d6efd",
            color: "white",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <h5 style={{ margin: 0, fontWeight: "500" }}>{title}</h5>
          <button
            onClick={onClose}
            style={{
              fontSize: "24px",
              border: "none",
              background: "none",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
              color: "white",
              fontWeight: "bold",
              userSelect: "none",
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div style={{ flex: 1, padding: "20px" }}>{children}</div>

        {footer && (
          <div
            style={{
              marginTop: "auto",
              padding: "12px 20px",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              borderTop: "1px solid #dee2e6",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );
}