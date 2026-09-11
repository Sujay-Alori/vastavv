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
              With over 15 years of experience in architectural and interior design, Principal Architect Ar. Shinu Nandanan holds a Bachelor of Architecture (B.Arch.) degree from TKM College of Engineering, Kollam. Since 2012, he has been registered with the Council of Architecture (COA) and is affiliated with the Indian Institute of Architects (IIA), Cochin Chapter. His work spans numerous architectural and interior projects across Kerala and the Gulf countries, bringing together local insight and international experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
