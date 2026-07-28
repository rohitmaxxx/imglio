"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/about/Reveal";
import { useRipple } from "@/hooks/useRipple";
import buttonStyles from "@/components/Button.module.css";
import styles from "@/components/contact/Contact.module.css";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const EMPTY_VALUES: FormValues = { name: "", email: "", phone: "", subject: "", message: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;

const FIELD_ORDER: (keyof FormErrors)[] = ["name", "email", "phone", "message"];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your full name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please enter a contact phone number.";
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.message.trim()) {
    errors.message = "Let us know what you need help with.";
  }

  return errors;
}

type Status = "idle" | "submitting" | "success";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const { onPointerDown, rippleElements } = useRipple();
  const { onPointerDown: onResetPointerDown, rippleElements: resetRippleElements } = useRipple();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const fieldRefs = { name: nameRef, email: emailRef, phone: phoneRef, message: messageRef };

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalid) fieldRefs[firstInvalid].current?.focus();
      return;
    }

    // Frontend-only for now — nothing is sent anywhere. Backend wiring comes later.
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 600);
  }

  function handleSendAnother() {
    setValues(EMPTY_VALUES);
    setErrors({});
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <Reveal className={styles["contact-form-card"]}>
        <div className={styles["contact-success"]} role="status">
          <span className={styles["contact-success-icon"]} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <h2>Frontend only — backend integration coming soon.</h2>
          <p>This form isn&apos;t wired up to anything yet, so nothing was actually sent. Once the backend lands, messages here will reach us for real.</p>
          <button
            type="button"
            className={`${buttonStyles["btn-resize"]} ${styles["contact-success-btn"]}`}
            onClick={handleSendAnother}
            onPointerDown={onResetPointerDown}
          >
            {resetRippleElements}
            Fill Out Another Message
          </button>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal className={styles["contact-form-card"]}>
      <form className={styles["contact-form"]} onSubmit={handleSubmit} noValidate>
        <div className={styles["contact-field-grid"]}>
          <div className={`${styles["contact-field"]}${errors.name ? ` ${styles["has-error"]}` : ""}`}>
            <label htmlFor="contact-name">Full Name</label>
            <input
              id="contact-name"
              type="text"
              ref={nameRef}
              value={values.name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name && (
              <p className={styles["contact-field-error"]} id="contact-name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className={`${styles["contact-field"]}${errors.email ? ` ${styles["has-error"]}` : ""}`}>
            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              type="email"
              ref={emailRef}
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {errors.email && (
              <p className={styles["contact-field-error"]} id="contact-email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className={`${styles["contact-field"]}${errors.phone ? ` ${styles["has-error"]}` : ""}`}>
            <label htmlFor="contact-phone">Contact Phone Number</label>
            <input
              id="contact-phone"
              type="tel"
              ref={phoneRef}
              value={values.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            />
            {errors.phone && (
              <p className={styles["contact-field-error"]} id="contact-phone-error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className={styles["contact-field"]}>
            <label htmlFor="contact-subject">
              Subject <span className={styles["optional"]}>(optional)</span>
            </label>
            <input id="contact-subject" type="text" value={values.subject} onChange={(e) => updateField("subject", e.target.value)} />
          </div>
        </div>

        <div className={`${styles["contact-field"]}${errors.message ? ` ${styles["has-error"]}` : ""}`}>
          <label htmlFor="contact-message">Description</label>
          <textarea
            id="contact-message"
            rows={6}
            ref={messageRef}
            placeholder="Tell us your requirements..."
            value={values.message}
            onChange={(e) => updateField("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && (
            <p className={styles["contact-field-error"]} id="contact-message-error">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`${buttonStyles["btn-resize"]} ${styles["contact-submit-btn"]}`}
          disabled={status === "submitting"}
          onPointerDown={onPointerDown}
        >
          {rippleElements}
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </Reveal>
  );
}
