import { useState, useEffect, useRef, useCallback } from 'react'

export interface Category {
  id: string
  name: string
  folder: string
  imageCount: number
}

export const CATEGORIES: Category[] = [
  { id: 'residential', name: 'RESIDENTIAL', folder: 'residential', imageCount: 21 },
  { id: 'commercial', name: 'COMMERCIAL', folder: 'commercial', imageCount: 21 },
  { id: 'interior', name: 'INTERIOR', folder: 'interior', imageCount: 21 },
  { id: 'landscape', name: 'LANDSCAPE', folder: 'landscape', imageCount: 21 },
  { id: 'resorts', name: 'RESORTS', folder: 'resorts', imageCount: 21 },
]

// Asymmetric editorial layout rhythms matching the demo portfolio
const LAYOUT_VARIANTS = [
  'large-center',
  'small-left',
  'large-right',
  'medium-center',
  'large-left',
  'small-right',
  'full-center',
  'small-left',
  'large-right',
  'medium-left',
  'large-center',
  'small-right',
  'large-left',
  'medium-center',
  'full-center',
  'small-left',
  'large-right',
  'medium-right',
  'large-left',
  'small-right',
  'large-center',
]

export default function Projects() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('residential')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const activeCategory =
    CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0]

  // Generate list of all projects belonging to the selected category
  const categoryProjects = Array.from(
    { length: activeCategory.imageCount },
    (_, i) => {
      const num = String(i + 1).padStart(2, '0')
      return {
        number: `PROJECT ${num}`,
        rawNum: num,
        src: `/assets/images/projects/${activeCategory.folder}/${num}.jpeg`,
        layout: LAYOUT_VARIANTS[i % LAYOUT_VARIANTS.length],
        index: i,
      }
    }
  ).filter((item) => !failedImages[item.src])

  // Scroll reveal observer for project items
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const timer = setTimeout(() => {
      const items = galleryRef.current?.querySelectorAll<HTMLElement>(
        '.projects-gallery-item'
      )
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
          threshold: 0.08,
          rootMargin: '0px 0px -40px 0px',
        }
      )

      items.forEach((item) => observer.observe(item))

      return () => observer.disconnect()
    }, 60)

    return () => clearTimeout(timer)
  }, [activeCategoryId])

  // Handle category filter click
  const handleSelectCategory = (catId: string) => {
    if (catId === activeCategoryId) return
    setActiveCategoryId(catId)
    setLightboxIndex(null)

    // Smoothly align to portfolio section header if user is scrolled down
    if (sectionRef.current) {
      const headerHeight =
        document.querySelector('.site-header')?.getBoundingClientRect().height || 84
      const sectionTop =
        sectionRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - 10

      if (window.scrollY > sectionTop + 120) {
        window.scrollTo({ top: sectionTop, behavior: 'smooth' })
      }
    }
  }

  const handleImageError = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }))
  }

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') {
        setLightboxIndex(null)
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % categoryProjects.length : null
        )
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + categoryProjects.length) % categoryProjects.length
            : null
        )
      }
    },
    [lightboxIndex, categoryProjects.length]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="projects-section"
      aria-label="Selected Works Portfolio"
    >
      <div className="projects-container">
        {/* Portfolio Section Header */}
        <div className="projects-header">
          <div className="projects-header-top">
            <span className="projects-label">PORTFOLIO</span>
            <h2 className="projects-heading">SELECTED WORKS</h2>
          </div>

          {/* Editorial Category Filter Navigation */}
          <nav
            className="projects-category-nav"
            aria-label="Portfolio Category Filter"
          >
            <div className="projects-category-list" role="tablist">
              {CATEGORIES.map((category) => {
                const isActive = category.id === activeCategoryId
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${category.id}`}
                    id={`tab-${category.id}`}
                    className={`projects-category-btn ${
                      isActive ? 'projects-category-btn--active' : ''
                    }`}
                    onClick={() => handleSelectCategory(category.id)}
                  >
                    <span className="projects-category-text">
                      {category.name}
                    </span>
                    {isActive && (
                      <span
                        className="projects-category-indicator"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Selected Category Projects Stream — All projects visible immediately */}
        <div
          id={`panel-${activeCategory.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory.id}`}
          ref={galleryRef}
          className="projects-gallery-wrapper"
        >
          <div className="projects-gallery">
            {categoryProjects.map((item) => (
              <article
                key={item.src}
                className={`projects-gallery-item projects-gallery-item--${item.layout}`}
                aria-label={`${item.number} — ${activeCategory.name}`}
              >
                <div className="projects-card-inner">
                  {/* Large Architectural Image Frame */}
                  <div
                    className="projects-image-frame"
                    onClick={() => setLightboxIndex(item.index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setLightboxIndex(item.index)
                      }
                    }}
                    aria-label={`View ${item.number} in fullscreen`}
                  >
                    <img
                      src={item.src}
                      alt={`${item.number} ${activeCategory.name} architecture`}
                      loading={item.index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="projects-image"
                      onError={() => handleImageError(item.src)}
                    />

                    {/* Subtle hover prompt */}
                    <div className="projects-image-hover-cue" aria-hidden="true">
                      <span>VIEW ↗</span>
                    </div>
                  </div>

                  {/* Editorial Project Information underneath the image */}
                  <footer className="project-item-caption">
                    <span className="project-item-caption-number">
                      {item.number}
                    </span>
                    <span className="project-item-caption-category">
                      {activeCategory.name}
                    </span>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Minimalist Editorial Lightbox Modal */}
        {lightboxIndex !== null && categoryProjects[lightboxIndex] && (
          <div
            className="projects-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${categoryProjects[lightboxIndex].number} Lightbox`}
            onClick={() => setLightboxIndex(null)}
          >
            <div
              className="projects-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="projects-lightbox-close"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close Lightbox"
              >
                ✕
              </button>

              <button
                type="button"
                className="projects-lightbox-nav projects-lightbox-nav--prev"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + categoryProjects.length) %
                      categoryProjects.length
                  )
                }
                aria-label="Previous Project"
              >
                ←
              </button>

              <div className="projects-lightbox-image-wrap">
                <img
                  src={categoryProjects[lightboxIndex].src}
                  alt={`${categoryProjects[lightboxIndex].number} ${activeCategory.name}`}
                  className="projects-lightbox-img"
                />
                <div className="projects-lightbox-caption">
                  <span className="projects-lightbox-caption-title">
                    {categoryProjects[lightboxIndex].number} —{' '}
                    {activeCategory.name}
                  </span>
                  <span className="projects-lightbox-caption-count">
                    {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                    {String(categoryProjects.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="projects-lightbox-nav projects-lightbox-nav--next"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex + 1) % categoryProjects.length
                  )
                }
                aria-label="Next Project"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
