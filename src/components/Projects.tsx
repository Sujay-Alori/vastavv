import { useState, useEffect, useRef, useCallback } from 'react'

export interface ProjectItem {
  id: string
  number: string
  title: string
  folder: string
  coverLayout: 'large-center' | 'large-right' | 'large-left' | 'medium-center' | 'full-center'
  imageCount: number
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'residential',
    number: '01',
    title: 'RESIDENTIAL',
    folder: 'residential',
    coverLayout: 'large-center',
    imageCount: 21,
  },
  {
    id: 'commercial',
    number: '02',
    title: 'COMMERCIAL',
    folder: 'commercial',
    coverLayout: 'large-right',
    imageCount: 21,
  },
  {
    id: 'interior',
    number: '03',
    title: 'INTERIOR',
    folder: 'interior',
    coverLayout: 'large-left',
    imageCount: 21,
  },
  {
    id: 'landscape',
    number: '04',
    title: 'LANDSCAPE',
    folder: 'landscape',
    coverLayout: 'large-center',
    imageCount: 21,
  },
  {
    id: 'resorts',
    number: '05',
    title: 'RESORTS',
    folder: 'resorts',
    coverLayout: 'large-right',
    imageCount: 21,
  },
]

// Asymmetric editorial layout rhythms for additional gallery photos within an expanded project
const ADDITIONAL_LAYOUT_VARIANTS = [
  'large-right',
  'small-left',
  'large-left',
  'small-right',
  'medium-center',
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
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)
  const [lightboxState, setLightboxState] = useState<{
    projectId: string
    imageIndex: number
  } | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const projectRefs = useRef<Record<string, HTMLElement | null>>({})
  const expandedGalleryRef = useRef<HTMLDivElement | null>(null)

  // Scroll reveal observer for expanded gallery items
  useEffect(() => {
    if (!expandedProjectId) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const timer = setTimeout(() => {
      const items = expandedGalleryRef.current?.querySelectorAll<HTMLElement>(
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
  }, [expandedProjectId])

  // Handle clicking a project's main image or expand trigger
  const handleToggleProject = (projectId: string) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null)
    } else {
      setExpandedProjectId(projectId)
      // Smoothly bring the newly expanded project into view
      setTimeout(() => {
        const el = projectRefs.current[projectId]
        if (el) {
          const headerHeight =
            document.querySelector('.site-header')?.getBoundingClientRect().height || 84
          const targetTop =
            el.getBoundingClientRect().top + window.scrollY - headerHeight - 16
          window.scrollTo({ top: targetTop, behavior: 'smooth' })
        }
      }, 50)
    }
  }

  // Handle cover image click:
  // If collapsed -> expands the project gallery.
  // If already expanded -> opens full-screen lightbox for cover image (index 0).
  const handleCoverClick = (project: ProjectItem) => {
    if (expandedProjectId === project.id) {
      setLightboxState({ projectId: project.id, imageIndex: 0 })
    } else {
      handleToggleProject(project.id)
    }
  }

  const handleCloseExpanded = (projectId: string) => {
    setExpandedProjectId(null)
    const el = projectRefs.current[projectId]
    if (el) {
      const headerHeight =
        document.querySelector('.site-header')?.getBoundingClientRect().height || 84
      const targetTop =
        el.getBoundingClientRect().top + window.scrollY - headerHeight - 16
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
  }

  const handleImageError = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }))
  }

  // Active project data for lightbox
  const currentLightboxProject = PROJECTS.find(
    (p) => p.id === lightboxState?.projectId
  )
  const currentLightboxTotal = currentLightboxProject?.imageCount || 21

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxState || !currentLightboxProject) return
      if (e.key === 'Escape') {
        setLightboxState(null)
      } else if (e.key === 'ArrowRight') {
        setLightboxState((prev) =>
          prev
            ? {
                ...prev,
                imageIndex: (prev.imageIndex + 1) % currentLightboxTotal,
              }
            : null
        )
      } else if (e.key === 'ArrowLeft') {
        setLightboxState((prev) =>
          prev
            ? {
                ...prev,
                imageIndex:
                  (prev.imageIndex - 1 + currentLightboxTotal) %
                  currentLightboxTotal,
              }
            : null
        )
      }
    },
    [lightboxState, currentLightboxProject, currentLightboxTotal]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <section
      id="projects"
      className="projects-section"
      aria-label="Selected Projects Portfolio"
    >
      <div className="projects-container">
        {/* Section Header */}
        <div className="projects-header">
          <span className="projects-label">PORTFOLIO</span>
          <h2 className="projects-heading">SELECTED WORKS</h2>
        </div>

        {/* Editorial Project Stream */}
        <div className="projects-list">
          {PROJECTS.map((project) => {
            const isExpanded = expandedProjectId === project.id
            const coverSrc = `/assets/images/projects/${project.folder}/01.jpeg`

            // Additional photographs (02.jpeg to 21.jpeg)
            const additionalImages = Array.from(
              { length: project.imageCount - 1 },
              (_, idx) => {
                const imageNum = String(idx + 2).padStart(2, '0')
                return {
                  src: `/assets/images/projects/${project.folder}/${imageNum}.jpeg`,
                  layout:
                    ADDITIONAL_LAYOUT_VARIANTS[
                      idx % ADDITIONAL_LAYOUT_VARIANTS.length
                    ],
                  globalIndex: idx + 1, // 0 is cover, 1..20 are additional
                }
              }
            ).filter((item) => !failedImages[item.src])

            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
                ref={(el) => (projectRefs.current[project.id] = el)}
                className={`project-entry ${
                  isExpanded ? 'project-entry--expanded' : ''
                }`}
                aria-label={`Project ${project.number}: ${project.title}`}
              >
                {/* Project Header Info */}
                <header className="project-entry-header">
                  <div className="project-entry-meta">
                    <span className="project-entry-number">
                      PROJECT {project.number}
                    </span>
                    <h3 className="project-entry-title">{project.title}</h3>
                  </div>

                  <button
                    type="button"
                    className="project-entry-toggle-btn"
                    onClick={() => handleToggleProject(project.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`gallery-${project.id}`}
                  >
                    <span className="project-entry-toggle-text">
                      {isExpanded
                        ? 'CLOSE PROJECT'
                        : `EXPLORE COLLECTION (${project.imageCount})`}
                    </span>
                    <span
                      className={`project-entry-toggle-icon ${
                        isExpanded ? 'project-entry-toggle-icon--open' : ''
                      }`}
                      aria-hidden="true"
                    >
                      {isExpanded ? '—' : '+'}
                    </span>
                  </button>
                </header>

                {/* Main / Cover Image Presentation */}
                <div
                  className={`project-cover-container project-cover-container--${project.coverLayout}`}
                >
                  <div
                    className="project-cover-frame"
                    onClick={() => handleCoverClick(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCoverClick(project)
                      }
                    }}
                    aria-label={
                      isExpanded
                        ? `View ${project.title} cover image in full size`
                        : `Open ${project.title} project gallery`
                    }
                  >
                    {!failedImages[coverSrc] ? (
                      <img
                        src={coverSrc}
                        alt={`${project.title} architecture showcase`}
                        loading="lazy"
                        decoding="async"
                        className="project-cover-image"
                        onError={() => handleImageError(coverSrc)}
                      />
                    ) : (
                      <div className="project-image-fallback">
                        <span>{project.title}</span>
                      </div>
                    )}

                    {/* Editorial hover hint overlay */}
                    <div className="project-cover-overlay">
                      <div className="project-cover-overlay-info">
                        <span className="project-cover-overlay-num">
                          {project.number}
                        </span>
                        <span className="project-cover-overlay-title">
                          {project.title}
                        </span>
                      </div>
                      <div className="project-cover-overlay-action">
                        <span>
                          {isExpanded
                            ? 'FULLSCREEN VIEW ↗'
                            : 'EXPLORE COLLECTION ↗'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDED GALLERY: Shown ONLY when this project is active */}
                {isExpanded && (
                  <div
                    id={`gallery-${project.id}`}
                    ref={expandedGalleryRef}
                    className="project-expanded-gallery-section"
                    role="region"
                    aria-label={`${project.title} Additional Works`}
                  >
                    {/* Editorial Divider & Gallery Subheader */}
                    <div className="project-expanded-divider">
                      <span className="project-expanded-divider-label">
                        {project.title} — PHOTOGRAPHIC ARCHIVE
                      </span>
                      <span className="project-expanded-divider-count">
                        {additionalImages.length + 1} PHOTOGRAPHS
                      </span>
                    </div>

                    {/* Asymmetric Gallery Flow for Additional Images */}
                    <div className="projects-gallery">
                      {additionalImages.map((item) => (
                        <div
                          key={item.src}
                          className={`projects-gallery-item projects-gallery-item--${item.layout}`}
                        >
                          <div
                            className="projects-image-frame"
                            onClick={() =>
                              setLightboxState({
                                projectId: project.id,
                                imageIndex: item.globalIndex,
                              })
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setLightboxState({
                                  projectId: project.id,
                                  imageIndex: item.globalIndex,
                                })
                              }
                            }}
                            aria-label={`View ${project.title} photo ${item.globalIndex + 1}`}
                          >
                            <img
                              src={item.src}
                              alt={`${project.title} photo ${item.globalIndex + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="projects-image"
                              onError={() => handleImageError(item.src)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Collapse Action */}
                    <div className="project-expanded-footer">
                      <button
                        type="button"
                        className="project-collapse-btn"
                        onClick={() => handleCloseExpanded(project.id)}
                        aria-label={`Collapse ${project.title} gallery`}
                      >
                        <span className="project-collapse-arrow" aria-hidden="true">
                          ↑
                        </span>
                        <span>CLOSE {project.title} GALLERY</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {/* Minimalist Editorial Lightbox Modal */}
        {lightboxState && currentLightboxProject && (
          <div
            className="projects-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${currentLightboxProject.title} Lightbox`}
            onClick={() => setLightboxState(null)}
          >
            <div
              className="projects-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="projects-lightbox-close"
                onClick={() => setLightboxState(null)}
                aria-label="Close Lightbox"
              >
                ✕
              </button>

              <button
                type="button"
                className="projects-lightbox-nav projects-lightbox-nav--prev"
                onClick={() =>
                  setLightboxState((prev) =>
                    prev
                      ? {
                          ...prev,
                          imageIndex:
                            (prev.imageIndex - 1 + currentLightboxTotal) %
                            currentLightboxTotal,
                        }
                      : null
                  )
                }
                aria-label="Previous Photograph"
              >
                ←
              </button>

              <div className="projects-lightbox-image-wrap">
                <img
                  src={`/assets/images/projects/${
                    currentLightboxProject.folder
                  }/${String(lightboxState.imageIndex + 1).padStart(2, '0')}.jpeg`}
                  alt={`${currentLightboxProject.title} photograph ${
                    lightboxState.imageIndex + 1
                  }`}
                  className="projects-lightbox-img"
                />
                <div className="projects-lightbox-caption">
                  <span className="projects-lightbox-caption-title">
                    PROJECT {currentLightboxProject.number} —{' '}
                    {currentLightboxProject.title}
                  </span>
                  <span className="projects-lightbox-caption-count">
                    {String(lightboxState.imageIndex + 1).padStart(2, '0')} /{' '}
                    {String(currentLightboxTotal).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="projects-lightbox-nav projects-lightbox-nav--next"
                onClick={() =>
                  setLightboxState((prev) =>
                    prev
                      ? {
                          ...prev,
                          imageIndex:
                            (prev.imageIndex + 1) % currentLightboxTotal,
                        }
                      : null
                  )
                }
                aria-label="Next Photograph"
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
