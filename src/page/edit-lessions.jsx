import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import apiClient from "../axios";

function EditLession() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [formData, setFormData] = useState({
    lessonTitle: "",
    lessonImage: "",
    level: "",
    estimatedTime: "",
    isCompleted: false,
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await apiClient.get(`/${lessonId}`);
        setFormData({
          lessonTitle: response.data.lessonTitle,
          lessonImage: response.data.lessonImage,
          level: response.data.level,
          estimatedTime: response.data.estimatedTime,
          isCompleted: response.data.isCompleted,
        });
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.lessonTitle.trim()) {
      newErrors.lessonTitle = "Lesson title is required.";
    } else if (formData.lessonTitle.trim().split(/\s+/).length < 2) {
      newErrors.lessonTitle =
        "Lesson title must contain more than 1 word (e.g., 'Kanji Master').";
    }

    if (!formData.lessonImage.trim()) {
      newErrors.lessonImage = "Lesson image URL is required.";
    } else {
      try {
        new URL(formData.lessonImage);
      } catch {
        newErrors.lessonImage = "Lesson image must be a valid URL.";
      }
    }

    if (!formData.level) {
      newErrors.level = "Level is required.";
    }

    if (!formData.estimatedTime) {
      newErrors.estimatedTime = "Estimated time is required.";
    } else if (
      isNaN(formData.estimatedTime) ||
      Number(formData.estimatedTime) <= 0
    ) {
      newErrors.estimatedTime =
        "Estimated time must be a valid positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }
    setShowToast(true);
    setIsSubmitting(true);

    try {
      await apiClient.put(`/${lessonId}`, {
        ...formData,
        estimatedTime: Number(formData.estimatedTime),
      });

      navigate("/se180003/all-lessons");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Container className="mt-4 mb-5">
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
            Lesson edited successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Card className="shadow">
        <Card.Body>
          <h1 className="mb-4">Edit Lesson</h1>

          {submitError && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setSubmitError(null)}
            >
              {submitError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Lesson Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="lessonTitle"
                value={formData.lessonTitle}
                onChange={handleChange}
                isInvalid={!!errors.lessonTitle}
                placeholder="e.g., Kanji Master"
              />
              <Form.Control.Feedback type="invalid">
                {errors.lessonTitle}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Lesson Image URL <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="lessonImage"
                value={formData.lessonImage}
                onChange={handleChange}
                isInvalid={!!errors.lessonImage}
                placeholder="https://example.com/image.jpg"
              />
              <Form.Control.Feedback type="invalid">
                {errors.lessonImage}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Level <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="level"
                value={formData.level}
                onChange={handleChange}
                isInvalid={!!errors.level}
              >
                <option value="">Select a level</option>
                <option value="N1">N1</option>
                <option value="N2">N2</option>
                <option value="N3">N3</option>
                <option value="N4">N4</option>
                <option value="N5">N5</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.level}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Estimated Time (minutes) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleChange}
                isInvalid={!!errors.estimatedTime}
                placeholder="e.g., 60"
              />
              <Form.Control.Feedback type="invalid">
                {errors.estimatedTime}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="switch"
                name="isCompleted"
                label="Is Completed"
                checked={formData.isCompleted}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Lesson"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/se180003/all-lessons")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditLession;
