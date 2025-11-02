import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  ListGroup,
  Button,
  Spinner,
  Alert,
  Badge,
  Toast,
  ToastContainer,
  Modal,
} from "react-bootstrap";
import apiClient from "../axios";

function AllLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await apiClient.get("/");
      const sortedLessons = response.data.sort((a, b) => b.id - a.id);
      setLessons(sortedLessons);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLessonClick = (lessonId) => {
    navigate(`/se180003/lessons/${lessonId}`);
  };

  const handleEdit = (e, lessonId) => {
    e.stopPropagation();
    navigate(`/se180003/edit-lesson/${lessonId}`);
  };

  const handleDelete = async (e, lessonId) => {
    e.stopPropagation();
    setLessonToDelete(lessonId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/${lessonToDelete}`);
      setShowModal(false);
      setShowToast(true);
      fetchLessons();
    } catch (err) {
      alert(`Error deleting lesson: ${err.message}`);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setLessonToDelete(null);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">All Lessons</h1>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this lesson?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Lesson deleted successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <ListGroup>
        {lessons.length === 0 ? (
          <ListGroup.Item>No lessons found.</ListGroup.Item>
        ) : (
          lessons.map((lesson) => (
            <ListGroup.Item
              key={lesson.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div
                className="flex-grow-1"
                onClick={() => handleLessonClick(lesson.id)}
                style={{ cursor: "pointer" }}
              >
                <h5 className="mb-1">{lesson.lessonTitle}</h5>
                <div className="d-flex gap-3">
                  <span>
                    <strong>Level:</strong>{" "}
                    <Badge bg="info">{lesson.level}</Badge>
                  </span>
                  <span>
                    <strong>Estimated Time:</strong> {lesson.estimatedTime}{" "}
                    minutes
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="warning"
                  size="sm"
                  onClick={(e) => handleEdit(e, lesson.id)}
                >
                  ✏️ Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => handleDelete(e, lesson.id)}
                >
                  🗑️ Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Container>
  );
}

export default AllLessons;
