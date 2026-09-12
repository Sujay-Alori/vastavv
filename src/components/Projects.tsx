import { useState, useEffect, useRef, useCallback } from 'react'

export interface ProjectItem {
  id: string
  number: string
  title: string
  category: 'residential' | 'commercial' | 'interior' | 'landscape' | 'resorts'
  categoryLabel: string
  image: string
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
  location: string
  year: string
  discipline: string
  practice: string
  description: string
}

export const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'residential', label: 'RESIDENTIAL' },
  { id: 'commercial', label: 'COMMERCIAL' },
  { id: 'interior', label: 'INTERIOR' },
  { id: 'landscape', label: 'LANDSCAPE' },
  { id: 'resorts', label: 'RESORTS' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

// Data-driven project items across the 5 VASTAV categories
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'res-01',
    number: '01',
    title: 'PROJECT 01',
    category: 'residential',
    categoryLabel: 'RESIDENTIAL',
    image: '/assets/images/projects/residential/01.jpeg',
    layout: 'large-center',
    location: 'HYDERABAD, INDIA',
    year: '2024',
    discipline: 'RESIDENTIAL ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'A contemporary residence defined by monolithic masonry, strategic volumetric subtractions, and deep shading verandas tailored for warm climate living.',
  },
  {
    id: 'com-01',
    number: '02',
    title: 'PROJECT 02',
    category: 'commercial',
    categoryLabel: 'COMMERCIAL',
    image: '/assets/images/projects/commercial/01.jpeg',
    layout: 'large-right',
    location: 'BANGALORE, INDIA',
    year: '2024',
    discipline: 'COMMERCIAL ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'An expressive workplace structure that weaves natural ventilation, floor-to-ceiling daylighting, and raw architectural concrete.',
  },
  {
    id: 'int-01',
    number: '03',
    title: 'PROJECT 03',
    category: 'interior',
    categoryLabel: 'INTERIOR',
    image: '/assets/images/projects/interior/01.jpeg',
    layout: 'large-left',
    location: 'MUMBAI, INDIA',
    year: '2024',
    discipline: 'INTERIOR ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Curated interior spaces celebrating bespoke teak millwork, custom bronze details, and quiet stone textures.',
  },
  {
    id: 'lnd-01',
    number: '04',
    title: 'PROJECT 04',
    category: 'landscape',
    categoryLabel: 'LANDSCAPE',
    image: '/assets/images/projects/landscape/01.jpeg',
    layout: 'medium-center',
    location: 'GOA, INDIA',
    year: '2023',
    discipline: 'LANDSCAPE ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Harmonious integration of indigenous flora, cascading water features, and porous paved courtyards.',
  },
  {
    id: 'resort-01',
    number: '05',
    title: 'PROJECT 05',
    category: 'resorts',
    categoryLabel: 'RESORTS',
    image: '/assets/images/projects/resorts/01.jpeg',
    layout: 'large-right',
    location: 'KODAGU, INDIA',
    year: '2024',
    discipline: 'HOSPITALITY ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'A hillside hospitality retreat sculpted into the natural terrain, oriented to frame panoramic valley vistas.',
  },
  {
    id: 'res-02',
    number: '06',
    title: 'PROJECT 06',
    category: 'residential',
    categoryLabel: 'RESIDENTIAL',
    image: '/assets/images/projects/residential/02.jpeg',
    layout: 'small-left',
    location: 'HYDERABAD, INDIA',
    year: '2023',
    discipline: 'RESIDENTIAL ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Private urban sanctuary articulated through perforated terracotta jali screens and double-height landscaped courts.',
  },
  {
    id: 'com-02',
    number: '07',
    title: 'PROJECT 07',
    category: 'commercial',
    categoryLabel: 'COMMERCIAL',
    image: '/assets/images/projects/commercial/02.jpeg',
    layout: 'full-center',
    location: 'CHENNAI, INDIA',
    year: '2024',
    discipline: 'COMMERCIAL ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'High-performance commercial pavilion integrating solar shading louvers with an open-plan central atrium.',
  },
  {
    id: 'int-02',
    number: '08',
    title: 'PROJECT 08',
    category: 'interior',
    categoryLabel: 'INTERIOR',
    image: '/assets/images/projects/interior/02.jpeg',
    layout: 'small-right',
    location: 'HYDERABAD, INDIA',
    year: '2024',
    discipline: 'INTERIOR ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Sculptural interior environment where indirect ambient illumination highlights limestone finishes and refined bronze profiles.',
  },
  {
    id: 'lnd-02',
    number: '09',
    title: 'PROJECT 09',
    category: 'landscape',
    categoryLabel: 'LANDSCAPE',
    image: '/assets/images/projects/landscape/02.jpeg',
    layout: 'medium-left',
    location: 'PUNE, INDIA',
    year: '2023',
    discipline: 'LANDSCAPE ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Terraced botanical intervention designed around existing mature trees and native bioswales.',
  },
  {
    id: 'resort-02',
    number: '10',
    title: 'PROJECT 10',
    category: 'resorts',
    categoryLabel: 'RESORTS',
    image: '/assets/images/projects/resorts/02.jpeg',
    layout: 'large-left',
    location: 'UDAIPUR, INDIA',
    year: '2024',
    discipline: 'HOSPITALITY ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Boutique lakeside destination blending traditional regional stone carving with modern minimalist structural lines.',
  },
  {
    id: 'res-03',
    number: '11',
    title: 'PROJECT 11',
    category: 'residential',
    categoryLabel: 'RESIDENTIAL',
    image: '/assets/images/projects/residential/03.jpeg',
    layout: 'medium-center',
    location: 'BENGALURU, INDIA',
    year: '2024',
    discipline: 'RESIDENTIAL ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Cantilevered dwelling with expansive glass facades that dissolve boundaries between interior living and garden spaces.',
  },
  {
    id: 'com-03',
    number: '12',
    title: 'PROJECT 12',
    category: 'commercial',
    categoryLabel: 'COMMERCIAL',
    image: '/assets/images/projects/commercial/03.jpeg',
    layout: 'large-right',
    location: 'HYDERABAD, INDIA',
    year: '2023',
    discipline: 'COMMERCIAL ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Flagship commercial tower utilizing low-e glazing and an innovative kinetic facade system for energy efficiency.',
  },
  {
    id: 'int-03',
    number: '13',
    title: 'PROJECT 13',
    category: 'interior',
    categoryLabel: 'INTERIOR',
    image: '/assets/images/projects/interior/03.jpeg',
    layout: 'small-left',
    location: 'DELHI, INDIA',
    year: '2024',
    discipline: 'INTERIOR ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Sophisticated penthouse interior featuring acoustic timber slatting, seamless micro-cement, and custom art installations.',
  },
  {
    id: 'lnd-03',
    number: '14',
    title: 'PROJECT 14',
    category: 'landscape',
    categoryLabel: 'LANDSCAPE',
    image: '/assets/images/projects/landscape/03.jpeg',
    layout: 'large-left',
    location: 'HYDERABAD, INDIA',
    year: '2024',
    discipline: 'LANDSCAPE ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Civic botanical parkway featuring shaded pedestrian walkways, rain gardens, and integrated stone seating nodes.',
  },
  {
    id: 'resort-03',
    number: '15',
    title: 'PROJECT 15',
    category: 'resorts',
    categoryLabel: 'RESORTS',
    image: '/assets/images/projects/resorts/03.jpeg',
    layout: 'full-center',
    location: 'WAYANAD, INDIA',
    year: '2024',
    discipline: 'HOSPITALITY ARCHITECTURE',
    practice: 'VASTAV ARCHITECTS',
    description:
      'Eco-luxury resort villas elevated above the forest floor, crafted with renewable timber and rammed earth.',
  },
]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Filtered project list based on category
  const filteredProjects = PROJECTS_DATA.filter((project) => {
    if (activeCategory === 'all') return true
    return project.category === activeCategory
  }).filter((project) => !failedImages[project.image])

  // Scroll reveal observer for filtered project items
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
    }, 50)

    return () => clearTimeout(timer)
  }, [activeCategory])

  // Lock body scroll when project modal is open
  useEffect(() => {
    if (selectedProjectIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedProjectIndex])

  // Category selection handler
  const handleSelectCategory = (catId: CategoryId) => {
    if (catId === activeCategory) return
    setActiveCategory(catId)
    setSelectedProjectIndex(null)

    if (sectionRef.current) {
      const headerHeight =
        document.querySelector('.site-header')?.getBoundingClientRect().height || 84
      const sectionTop =
        sectionRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - 12

      if (window.scrollY > sectionTop + 100) {
        window.scrollTo({ top: sectionTop, behavior: 'smooth' })
      }
    }
  }

  // Modal navigation
  const activeModalProject =
    selectedProjectIndex !== null ? filteredProjects[selectedProjectIndex] : null

  const handleNextProject = useCallback(() => {
    setSelectedProjectIndex((prev) => {
      if (prev === null) return null
      return (prev + 1) % filteredProjects.length
    })
  }, [filteredProjects.length])

  const handlePrevProject = useCallback(() => {
    setSelectedProjectIndex((prev) => {
      if (prev === null) return null
      return (prev - 1 + filteredProjects.length) % filteredProjects.length
    })
  }, [filteredProjects.length])

  const handleCloseModal = useCallback(() => {
    setSelectedProjectIndex(null)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedProjectIndex === null) return

      if (e.key === 'Escape') {
        handleCloseModal()
      } else if (e.key === 'ArrowRight') {
        handleNextProject()
      } else if (e.key === 'ArrowLeft') {
        handlePrevProject()
      }
    },
    [selectedProjectIndex, handleCloseModal, handleNextProject, handlePrevProject]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleImageError = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }))
  }

  const handleInquireClick = () => {
    handleCloseModal()
    setTimeout(() => {
      const contactEl = document.getElementById('contact')
      if (contactEl) {
        const headerHeight =
          document.querySelector('.site-header')?.getBoundingClientRect().height || 84
        const targetTop =
          contactEl.getBoundingClientRect().top + window.scrollY - headerHeight
        window.scrollTo({ top: targetTop, behavior: 'smooth' })
      }
    }, 150)
  }

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

          {/* Category Filter Navigation */}
          <nav
            className="projects-category-nav"
            aria-label="Portfolio Category Filters"
          >
            <div className="projects-category-list" role="tablist">
              {CATEGORIES.map((category) => {
                const isActive = category.id === activeCategory
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
                      {category.label}
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

        {/* Filtered Project Grid — Editorial Asymmetric Composition */}
        <div
          id={`panel-${activeCategory}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory}`}
          ref={galleryRef}
          className="projects-gallery-wrapper"
        >
          <div className="projects-gallery">
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                className={`projects-gallery-item projects-gallery-item--${project.layout}`}
                aria-label={`${project.title} — ${project.categoryLabel}`}
              >
                <div className="projects-card-inner">
                  {/* Large Architectural Image Frame */}
                  <div
                    className="projects-image-frame"
                    onClick={() => setSelectedProjectIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedProjectIndex(index)
                      }
                    }}
                    aria-label={`Open project details for ${project.title}`}
                  >
                    <img
                      src={project.image}
                      alt={`${project.title} — ${project.categoryLabel}`}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="projects-image"
                      onError={() => handleImageError(project.image)}
                    />

                    {/* Subtle hover prompt */}
                    <div className="projects-image-hover-cue" aria-hidden="true">
                      <span>EXPLORE PROJECT ↗</span>
                    </div>
                  </div>

                  {/* Editorial Project Caption Underneath Image */}
                  <footer className="project-item-caption">
                    <span className="project-item-caption-number">
                      {project.number}
                    </span>
                    <h3 className="project-item-caption-category">
                      {project.categoryLabel}
                    </h3>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Project Detail Modal */}
        {activeModalProject && selectedProjectIndex !== null && (
          <div
            className="project-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeModalProject.title} Detail Modal`}
            onClick={handleCloseModal}
          >
            <div
              className="project-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="project-modal-topbar">
                <div className="project-modal-topbar-meta">
                  <span className="project-modal-meta-num">
                    PROJECT {activeModalProject.number}
                  </span>
                  <span className="project-modal-meta-sep">—</span>
                  <span className="project-modal-meta-cat">
                    {activeModalProject.categoryLabel}
                  </span>
                </div>

                <button
                  type="button"
                  className="project-modal-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Close Project Details"
                >
                  <span className="project-modal-close-icon" aria-hidden="true">
                    ✕
                  </span>
                  <span className="project-modal-close-text">ESC</span>
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="project-modal-body">
                {/* Large Architectural Photography Focus */}
                <div className="project-modal-image-wrap">
                  <img
                    src={activeModalProject.image}
                    alt={`${activeModalProject.title} detail`}
                    className="project-modal-image"
                  />
                </div>

                {/* Project Information & Meta Area */}
                <div className="project-modal-info">
                  <div className="project-modal-info-header">
                    <span className="project-modal-info-cat">
                      {activeModalProject.categoryLabel}
                    </span>
                    <h2 className="project-modal-info-title">
                      {activeModalProject.title}
                    </h2>
                  </div>

                  <p className="project-modal-info-desc">
                    {activeModalProject.description}
                  </p>

                  <div className="project-modal-meta-grid">
                    <div className="project-modal-meta-item">
                      <span className="project-modal-meta-label">DISCIPLINE</span>
                      <span className="project-modal-meta-val">
                        {activeModalProject.discipline}
                      </span>
                    </div>

                    <div className="project-modal-meta-item">
                      <span className="project-modal-meta-label">PRACTICE</span>
                      <span className="project-modal-meta-val">
                        {activeModalProject.practice}
                      </span>
                    </div>

                    <div className="project-modal-meta-item">
                      <span className="project-modal-meta-label">LOCATION</span>
                      <span className="project-modal-meta-val">
                        {activeModalProject.location}
                      </span>
                    </div>

                    <div className="project-modal-meta-item">
                      <span className="project-modal-meta-label">YEAR</span>
                      <span className="project-modal-meta-val">
                        {activeModalProject.year}
                      </span>
                    </div>
                  </div>

                  <div className="project-modal-actions">
                    <button
                      type="button"
                      className="project-modal-inquire-btn"
                      onClick={handleInquireClick}
                    >
                      INQUIRE ABOUT THIS PROJECT →
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Navigation Bar */}
              <div className="project-modal-bottom-nav">
                <button
                  type="button"
                  className="project-modal-nav-btn project-modal-nav-btn--prev"
                  onClick={handlePrevProject}
                  aria-label="Previous Project"
                >
                  <span className="project-modal-nav-arrow" aria-hidden="true">
                    ←
                  </span>
                  <span>PREVIOUS</span>
                </button>

                <div className="project-modal-counter">
                  <span>
                    {String(selectedProjectIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="project-modal-counter-sep">/</span>
                  <span>
                    {String(filteredProjects.length).padStart(2, '0')}
                  </span>
                </div>

                <button
                  type="button"
                  className="project-modal-nav-btn project-modal-nav-btn--next"
                  onClick={handleNextProject}
                  aria-label="Next Project"
                >
                  <span>NEXT</span>
                  <span className="project-modal-nav-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
