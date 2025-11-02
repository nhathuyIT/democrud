import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import apiClient from "../axios";

function LessionDetail() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const response = await apiClient.get(`/${lessonId}`);
        setLesson(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetail();
  }, [lessonId]);

  const formatEstimatedTime = (time) => {
    return time.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Lesson not found</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Card className="shadow-lg">
        <Card.Img
          variant="top"
          src={lesson.lessonImage}
          alt={lesson.lessonTitle}
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title className="display-5 mb-3">
            {lesson.lessonTitle}
          </Card.Title>

          <div className="mb-4">
            <h5 className="text-muted mb-3">Lesson Information</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block">Level</small>
                  <h6 className="mb-0">
                    <Badge bg="info" className="fs-6">
                      {lesson.level}
                    </Badge>
                  </h6>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block">Estimated Time</small>
                  <h6 className="mb-0">
                    {formatEstimatedTime(lesson.estimatedTime)} minutes
                  </h6>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block">Status</small>
                  <h6 className="mb-0">
                    {lesson.isCompleted ? (
                      <Badge bg="success" className="fs-6">
                        Completed
                      </Badge>
                    ) : (
                      <Badge bg="warning" className="fs-6">
                        Incomplete
                      </Badge>
                    )}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LessionDetail;
