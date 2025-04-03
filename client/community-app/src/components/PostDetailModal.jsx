import React from "react";
import { Modal } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import "../App.css";

const PostDetailModal = ({ show, handleClose, post }) => {
  if (!post) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="village-modal"
      dialogClassName="village-dialog"
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#fdf6e3",
          borderRadius: "0.75rem",
          padding: "1rem 1.5rem",
        }}
      >
        <button
          onClick={handleClose}
          className="btn btn-sm btn-outline-secondary village-modal-button"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            borderRadius: "50%",
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "1px solid #ccc",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#e8d2a6";
            e.currentTarget.style.borderColor = "#c4b499";
            e.currentTarget.style.transform = "scale(1.2)";
            e.currentTarget.style.transition = "all 0.15s ease-in-out";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.borderColor = "#ccc";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.transition = "all 0.15s ease-in-out";
          }}
          aria-label="Close"
        >
          <FaTimes style={{ color: "#4b3f2f" }} />
        </button>
        <h5
          className="fw-bold mb-3"
          style={{
            fontSize: "1.5rem",
            color: "#4b3f2f",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            paddingTop: "0.5rem",
          }}
        >
          📌 {post.title}
        </h5>

        <Modal.Body style={{ backgroundColor: "#fdf6e3" }}>
          <p
            className="mb-2"
            style={{
              fontSize: "0.85rem",
              color: "#5c5c5c",
              fontStyle: "italic",
            }}
          >
            Posted by:{" "}
            <strong style={{ color: "#3e3e3e" }}>{post.author.username}</strong>
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              whiteSpace: "pre-line",
              lineHeight: "1.6",
              color: "#333",
            }}
          >
            {post.content}
          </p>
        </Modal.Body>
        <div className="text-end mt-4">
          <small style={{ color: "#888", fontSize: "0.75rem" }}>
            {new Date(Number(post.createdAt)).toLocaleDateString()} at{" "}
            {new Date(Number(post.createdAt)).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailModal;
