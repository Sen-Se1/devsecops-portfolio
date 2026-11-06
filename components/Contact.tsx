"use client";

import { FormEvent, useState } from "react";
import { submitContact } from "@/lib/api";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setLoading(true);
    setFeedback("");
    setSuccess(false);

    try {
      const result = await submitContact(payload);

      setSuccess(true);
      setFeedback(result.message || "Message sent successfully.");
      form.reset();
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact">
      <h2>Contact</h2>

      <div className="contact">
        <div className="contact-item">
          <strong>Email</strong>
          <p>houssem.mbarki@email.com</p>
        </div>

        <div className="contact-item">
          <strong>Location</strong>
          <p>Tunisia</p>
        </div>

        <div className="contact-item">
          <strong>GitHub</strong>
          <p>github.com/yourusername</p>
        </div>

        <div className="contact-item">
          <strong>LinkedIn</strong>
          <p>linkedin.com/in/yourusername</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            maxLength={5000}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>

        {feedback && (
          <p
            role="status"
            aria-live="polite"
            style={{ color: success ? "green" : "crimson" }}
          >
            {feedback}
          </p>
        )}
      </form>
    </section>
  );
}
