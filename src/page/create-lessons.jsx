import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import apiClient from "../axios";

function CreateLessons() {
  const navigate = useNavigate();
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

    setIsSubmitting(true);

    try {
      await apiClient.post("/", {
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

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow">
        <Card.Body>
          <h1 className="mb-4">Add New Lesson</h1>

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
                {isSubmitting ? "Creating..." : "Add Lesson"}
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

export default CreateLessons;
