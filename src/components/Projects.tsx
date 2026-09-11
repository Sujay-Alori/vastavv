import { useEffect, useRef } from 'react'

const PROJECT_IMAGES: Array<{
  src: string
  layout:
    | 'large-center'
    | 'small-left'
    | 'large-right'
    | 'medium-center'
    | 'large-left'
    | 'small-right'
    | 'full-center'
    | 'medium-left'
    | 'medium-right'
}> = [
  { src: '/assets/images/projects/project-01.jpeg', layout: 'large-center' },
  { src: '/assets/images/projects/project-02.jpeg', layout: 'small-left' },
  { src: '/assets/images/projects/project-03.jpeg', layout: 'large-right' },
  { src: '/assets/images/projects/project-04.jpeg', layout: 'medium-center' },
  { src: '/assets/images/projects/project-05.jpeg', layout: 'large-left' },
  { src: '/assets/images/projects/project-06.jpeg', layout: 'small-right' },
  { src: '/assets/images/projects/project-07.jpeg', layout: 'full-center' },
  { src: '/assets/images/projects/project-08.jpeg', layout: 'small-left' },
  { src: '/assets/images/projects/project-09.jpeg', layout: 'large-right' },
  { src: '/assets/images/projects/project-10.jpeg', layout: 'medium-left' },
  { src: '/assets/images/projects/project-11.jpeg', layout: 'large-center' },
  { src: '/assets/images/projects/project-12.jpeg', layout: 'small-right' },
  { src: '/assets/images/projects/project-13.jpeg', layout: 'large-left' },
  { src: '/assets/images/projects/project-14.jpeg', layout: 'medium-center' },
  { src: '/assets/images/projects/project-15.jpeg', layout: 'full-center' },
  { src: '/assets/images/projects/project-16.jpeg', layout: 'small-left' },
  { src: '/assets/images/projects/project-17.jpeg', layout: 'large-right' },
  { src: '/assets/images/projects/project-18.jpeg', layout: 'medium-right' },
  { src: '/assets/images/projects/project-19.jpeg', layout: 'large-left' },
  { src: '/assets/images/projects/project-20.jpeg', layout: 'small-right' },
  { src: '/assets/images/projects/project-21.jpeg', layout: 'large-center' },
]

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const items = containerRef.current?.querySelectorAll<HTMLElement>('.projects-gallery-item')
    if (!items || items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('projects-gallery-item--visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    )

    items.forEach((item) => observer.observe(item))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      id="projects"
      ref={containerRef}
      className="projects-section"
      aria-label="Projects"
    >
      <div className="projects-container">
        <div className="projects-header">
          <h2 className="projects-heading">PROJECTS</h2>
        </div>

        <div className="projects-gallery">
          {PROJECT_IMAGES.map((item, index) => (
            <div
              key={item.src}
              className={`projects-gallery-item projects-gallery-item--${item.layout}`}
            >
              <div className="projects-image-frame">
                <img
                  src={item.src}
                  alt=""
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="projects-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
