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
  { id: 'resorts', name: 'RESORTS', folder: 'resorts', imageCount: 21 },
  { id: 'landscape', name: 'LANDSCAPE', folder: 'landscape', imageCount: 21 },
  { id: 'interior', name: 'INTERIOR', folder: 'interior', imageCount: 21 },
]

// Asymmetric layout rhythms for category gallery photos
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
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const activeCategory =
    CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0]

  // Generate list of image paths for the active category (01.jpeg ... 21.jpeg)
  const categoryImages = Array.from({ length: activeCategory.imageCount }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      src: `/assets/images/projects/${activeCategory.folder}/${num}.jpeg`,
      layout: LAYOUT_VARIANTS[i % LAYOUT_VARIANTS.length],
      index: i,
    }
  }).filter((item) => !failedImages[item.src])

  const coverImageSrc = `/assets/images/projects/${activeCategory.folder}/01.jpeg`

  // Scroll reveal observer for gallery items
  useEffect(() => {
    if (!isGalleryOpen) return

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
    }, 50)

    return () => clearTimeout(timer)
  }, [isGalleryOpen, activeCategoryId])

  // Switching category ALWAYS closes any open gallery and shows ONLY the new category's main image
  const handleSelectCategory = (catId: string) => {
    setActiveCategoryId(catId)
    setIsGalleryOpen(false)
    setLightboxIndex(null)

    // Smooth scroll back to section top if user was scrolled down in a previous gallery
    if (sectionRef.current) {
      const headerHeight =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--header-height'
          ),
          10
        ) || 84
      const targetTop =
        sectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        headerHeight
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
  }

  // Open full category gallery only on main image click
  const handleOpenGallery = () => {
    setIsGalleryOpen(true)
    setTimeout(() => {
      if (sectionRef.current) {
        const headerHeight =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--header-height'
            ),
            10
          ) || 84
        const targetTop =
          sectionRef.current.getBoundingClientRect().top +
          window.scrollY -
          headerHeight
        window.scrollTo({ top: targetTop, behavior: 'smooth' })
      }
    }, 50)
  }

  // Close gallery view and return to overview showing ONLY the active category's main image
  const handleCloseGallery = () => {
    setIsGalleryOpen(false)
    setLightboxIndex(null)
    if (sectionRef.current) {
      const headerHeight =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--header-height'
          ),
          10
        ) || 84
      const targetTop =
        sectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        headerHeight
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
  }

  // Next category navigation helper — also closes gallery and shows next category's cover image only
  const handleNextCategory = () => {
    const currentIndex = CATEGORIES.findIndex((c) => c.id === activeCategoryId)
    const nextIndex = (currentIndex + 1) % CATEGORIES.length
    setActiveCategoryId(CATEGORIES[nextIndex].id)
    setIsGalleryOpen(false)
    setLightboxIndex(null)
    if (sectionRef.current) {
      const headerHeight =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--header-height'
          ),
          10
        ) || 84
      const targetTop =
        sectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        headerHeight
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
  }

  // Image error handling (allows replacing images in File Explorer with fewer files without breaking)
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
          prev !== null ? (prev + 1) % categoryImages.length : null
        )
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + categoryImages.length) % categoryImages.length
            : null
        )
      }
    },
    [lightboxIndex, categoryImages.length]
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
      aria-label="Projects Portfolio"
    >
      <div className="projects-container">
        {/* Top Header matching reference hierarchy */}
        <div className="projects-header">
          <div className="projects-header-top">
            <span className="projects-label">02 / PORTFOLIO</span>
            <h2 className="projects-heading">SELECTED WORKS</h2>
          </div>

          {/* Category Navigation Bar */}
          <nav
            className="projects-category-nav"
            aria-label="Portfolio Category Navigation"
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

        {/* OVERVIEW VIEW: Shows ONLY the Main/Cover Image of the currently active category */}
        {!isGalleryOpen ? (
          <div
            id={`panel-${activeCategory.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory.id}`}
            className="projects-cover-view"
          >
            <div
              className="projects-cover-frame"
              onClick={handleOpenGallery}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleOpenGallery()
                }
              }}
              aria-label={`Open ${activeCategory.name} gallery`}
            >
              <img
                src={coverImageSrc}
                alt={`${activeCategory.name} architecture showcase`}
                loading="eager"
                decoding="async"
                className="projects-cover-image"
                onError={() => handleImageError(coverImageSrc)}
              />

              {/* Refined editorial hover overlay & info */}
              <div className="projects-cover-overlay">
                <div className="projects-cover-meta">
                  <span className="projects-cover-meta-category">
                    {activeCategory.name}
                  </span>
                  <span className="projects-cover-meta-count">
                    {activeCategory.imageCount} PHOTOGRAPHS
                  </span>
                </div>
                <div className="projects-cover-action">
                  <span className="projects-cover-action-text">
                    EXPLORE COLLECTION
                  </span>
                  <span className="projects-cover-action-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom editorial footnote */}
            <div className="projects-cover-footer">
              <div className="projects-cover-footer-left">
                <span className="projects-cover-footer-label">
                  CATEGORY ARCHIVE
                </span>
                <span className="projects-cover-footer-name">
                  {activeCategory.name}
                </span>
              </div>
              <button
                type="button"
                className="projects-open-btn"
                onClick={handleOpenGallery}
              >
                VIEW FULL GALLERY ({activeCategory.imageCount}) →
              </button>
            </div>
          </div>
        ) : (
          /* EXPANDED CATEGORY GALLERY VIEW: Displays all category images in editorial layout */
          <div
            ref={galleryRef}
            className="projects-category-gallery-view"
            aria-label={`${activeCategory.name} Gallery`}
          >
            {/* Gallery Control Bar */}
            <div className="projects-gallery-toolbar">
              <button
                type="button"
                className="projects-back-btn"
                onClick={handleCloseGallery}
                aria-label="Back to Portfolio Categories"
              >
                <span className="projects-back-arrow" aria-hidden="true">
                  ←
                </span>
                <span>BACK TO PORTFOLIO</span>
              </button>

              <div className="projects-gallery-toolbar-meta">
                <span className="projects-gallery-toolbar-category">
                  {activeCategory.name}
                </span>
                <span className="projects-gallery-toolbar-divider">—</span>
                <span className="projects-gallery-toolbar-count">
                  {categoryImages.length} WORKS
                </span>
              </div>
            </div>

            {/* Asymmetric Gallery Flow */}
            <div className="projects-gallery">
              {categoryImages.map((item) => (
                <div
                  key={item.src}
                  className={`projects-gallery-item projects-gallery-item--${item.layout}`}
                >
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
                    aria-label={`View image ${item.index + 1} of ${categoryImages.length}`}
                  >
                    <img
                      src={item.src}
                      alt={`${activeCategory.name} project image ${item.index + 1}`}
                      loading={item.index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="projects-image"
                      onError={() => handleImageError(item.src)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Gallery Bottom Navigation */}
            <div className="projects-gallery-bottom-nav">
              <button
                type="button"
                className="projects-gallery-bottom-btn"
                onClick={handleCloseGallery}
              >
                ← BACK TO CATEGORIES
              </button>
              <button
                type="button"
                className="projects-gallery-bottom-btn projects-gallery-bottom-btn--next"
                onClick={handleNextCategory}
              >
                NEXT CATEGORY →
              </button>
            </div>
          </div>
        )}

        {/* Minimalist Lightbox Modal */}
        {lightboxIndex !== null && categoryImages[lightboxIndex] && (
          <div
            className="projects-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox view"
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
                    (lightboxIndex - 1 + categoryImages.length) %
                      categoryImages.length
                  )
                }
                aria-label="Previous Image"
              >
                ←
              </button>

              <div className="projects-lightbox-image-wrap">
                <img
                  src={categoryImages[lightboxIndex].src}
                  alt={`${activeCategory.name} image ${lightboxIndex + 1}`}
                  className="projects-lightbox-img"
                />
                <div className="projects-lightbox-caption">
                  <span>{activeCategory.name}</span>
                  <span>
                    {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                    {String(categoryImages.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="projects-lightbox-nav projects-lightbox-nav--next"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex + 1) % categoryImages.length
                  )
                }
                aria-label="Next Image"
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
