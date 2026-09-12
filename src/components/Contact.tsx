import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from 'react'

// ── Validation helpers ────────────────────────────────────────────────────────

function isValidEmail(value: string): boolean {
  // RFC-ish but practical: local@domain.tld
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

function isValidPhone(value: string): boolean {
  // Accepts formats like:
  //   7025806797  /  +917025806797  /  +91 70258 06797
  //   +91-7025806797  /  091-7025806797  / 07025806797
  // Strip all spaces, dashes and parentheses, then check digit count.
  const digits = value.replace(/[\s\-().+]/g, '')
  // Indian numbers: 10 digits, or 11 digits starting with 0, or 12 digits starting with 91
  return /^(91\d{10}|0\d{10}|\d{10})$/.test(digits)
}

interface FieldErrors {
  name?: string
  email?: string
  phone?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const headingRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const [headingVisible, setHeadingVisible] = useState(false)
  const [formVisible, setFormVisible] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  // Errors shown only after first submit attempt
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState(false) // true once user has hit Submit once
  const [submitted, setSubmitted] = useState(false)

  // ── Scroll-reveal observers ──────────────────────────────────────────────
  useEffect(() => {
    const observe = (
      el: Element | null,
      setter: (v: boolean) => void,
      threshold = 0.1
    ) => {
      if (!el) return () => {}
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true)
            obs.disconnect()
          }
        },
        { threshold, rootMargin: '0px 0px -40px 0px' }
      )
      obs.observe(el)
      return () => obs.disconnect()
    }

    const c1 = observe(headingRef.current, setHeadingVisible, 0.1)
    const c2 = observe(formRef.current, setFormVisible, 0.05)
    return () => { c1(); c2() }
  }, [])

  // ── Validate and return errors object ───────────────────────────────────
  const validate = (data: typeof formData): FieldErrors => {
    const errs: FieldErrors = {}
    if (!data.name.trim()) {
      errs.name = 'Please enter your name.'
    }
    if (!data.email.trim()) {
      errs.email = 'Please enter your email address.'
    } else if (!isValidEmail(data.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!data.phone.trim()) {
      errs.phone = 'Please enter your phone number.'
    } else if (!isValidPhone(data.phone)) {
      errs.phone = 'Please enter a valid phone number.'
    }
    return errs
  }

  // ── Live re-validation after first submit attempt ────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value }
    setFormData(updated)
    if (touched) {
      setErrors(validate(updated))
    }
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const errs = validate(formData)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return // block submission
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      className="contact-section"
      aria-label="Contact VASTAV ARCHITECTS"
    >
      <div className="contact-container">

        {/* Top divider */}
        <div className="contact-top-divider" aria-hidden="true" />

        {/* Centered heading block */}
        <div
          ref={headingRef}
          className={`contact-hero-block${headingVisible ? ' contact-reveal--visible' : ''}`}
        >
          <span className="contact-section-label">CONTACT</span>
          <h2 className="contact-main-heading">
            LET'S CREATE<br />
            SOMETHING<br />
            CONSIDERED.
          </h2>
          <p className="contact-sub-copy">
            Have a project in mind?<br />
            We'd be glad to hear about it.
          </p>
        </div>

        {/* Centered form */}
        <div
          ref={formRef}
          className={`contact-form-wrap${formVisible ? ' contact-reveal--visible' : ''}`}
        >
          {submitted ? (
            <div className="contact-success" role="status">
              <span className="contact-success-label">ENQUIRY RECEIVED</span>
              <p className="contact-success-text">
                Thank you for reaching out. We'll be in touch shortly.
              </p>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Enquiry form"
            >

              {/* NAME */}
              <div className={`contact-field-group${errors.name ? ' contact-field-group--error' : ''}`}>
                <label className="contact-field-label" htmlFor="contact-name">
                  NAME
                </label>
                <input
                  id="contact-name"
                  className="contact-field-input"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                />
                {errors.name && (
                  <span id="error-name" className="contact-field-error" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* EMAIL */}
              <div className={`contact-field-group${errors.email ? ' contact-field-group--error' : ''}`}>
                <label className="contact-field-label" htmlFor="contact-email">
                  EMAIL
                </label>
                <input
                  id="contact-email"
                  className="contact-field-input"
                  type="email"
                  inputMode="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                />
                {errors.email && (
                  <span id="error-email" className="contact-field-error" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* PHONE */}
              <div className={`contact-field-group${errors.phone ? ' contact-field-group--error' : ''}`}>
                <label className="contact-field-label" htmlFor="contact-phone">
                  PHONE
                </label>
                <input
                  id="contact-phone"
                  className="contact-field-input"
                  type="tel"
                  inputMode="tel"
                  name="phone"
                  placeholder="+91 000 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'error-phone' : undefined}
                />
                {errors.phone && (
                  <span id="error-phone" className="contact-field-error" role="alert">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* MESSAGE — optional */}
              <div className="contact-field-group contact-field-group--message">
                <label className="contact-field-label" htmlFor="contact-message">
                  MESSAGE
                </label>
                <textarea
                  id="contact-message"
                  className="contact-field-input contact-field-textarea"
                  name="message"
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <div className="contact-form-footer">
                <button
                  id="contact-submit-btn"
                  className="contact-submit-btn"
                  type="submit"
                >
                  SEND ENQUIRY
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom footer strip */}
        <div className="contact-bottom-strip">
          <div className="contact-bottom-divider" aria-hidden="true" />
          <p className="contact-footer-note">© VASTAV ARCHITECTS</p>
        </div>

      </div>
    </section>
  )
}
