import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Spinner, Alert, Badge } from "react-bootstrap";
import apiClient from "../axios";

function CompletedLessions() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await apiClient.get("/");
      const completedLessons = response.data.filter(
        (lesson) => lesson.isCompleted === true
      );
      const sortedLessons = completedLessons.sort((a, b) => b.id - a.id);
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
      <h1 className="mb-4">Completed Lessons</h1>
      <ListGroup>
        {lessons.length === 0 ? (
          <ListGroup.Item>No completed lessons found.</ListGroup.Item>
        ) : (
          lessons.map((lesson) => (
            <ListGroup.Item
              key={lesson.id}
              action
              onClick={() => handleLessonClick(lesson.id)}
              className="d-flex align-items-center gap-3"
              style={{ cursor: "pointer" }}
            >
              <img
                src={lesson.lessonImage}
                alt={lesson.lessonTitle}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div className="flex-grow-1">
                <h5 className="mb-1">{lesson.lessonTitle}</h5>
                <div>
                  <strong>Level:</strong>{" "}
                  <Badge bg="success">{lesson.level}</Badge>
                </div>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Container>
  );
}

export default CompletedLessions;
