import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import apiClient from "../axios";

function Home() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await apiClient.get("/");
        const incompleteLessons = response.data.filter(
          (lesson) => lesson.isCompleted === false
        );
        setLessons(incompleteLessons);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

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
      <h1 className="mb-4">Incomplete Lessons</h1>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {lessons.length === 0 ? (
          <Col>
            <p>No incomplete lessons found.</p>
          </Col>
        ) : (
          lessons.map((lesson) => (
            <Col key={lesson.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={lesson.lessonImage}
                  alt={lesson.lessonTitle}
                  onClick={() => handleLessonClick(lesson.id)}
                  style={{
                    cursor: "pointer",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <Card.Body>
                  <Card.Title>{lesson.lessonTitle}</Card.Title>
                  <Card.Text>
                    <strong>Level:</strong> {lesson.level}
                    <br />
                    <strong>Estimated Time:</strong> {lesson.estimatedTime}{" "}
                    minutes
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default Home;
