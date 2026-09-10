import { useEffect, useRef, useState } from 'react'

export default function Studio() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`studio-section ${isVisible ? 'studio-section--visible' : ''}`}
      aria-label="Studio Introduction"
    >
      <div className="studio-container">
        <div className="studio-divider" aria-hidden="true" />
        <div className="studio-grid">
          <div className="studio-left">
            <span className="studio-label">VASTAV ARCHITECTS</span>
            <h2 className="studio-heading">
              ARCHITECTURE,<br />
              SHAPED BY PLACE.
            </h2>
          </div>
          <div className="studio-right">
            <p className="studio-description">
              VASTAV ARCHITECTS is an architectural and interior consultancy firm led by Principal Architect Ar. Shinu Nandanan, creating thoughtful spaces across Kerala and beyond.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
