import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { Project } from '../data/projects'
import ProjectCard from './ProjectCard'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const location = useLocation()
  const storageKey = `project-carousel:${location.pathname}`
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const pointerStartRef = useRef<number | null>(null)
  const dragStartScrollRef = useRef(0)
  const dragStartIndexRef = useRef(0)
  const isDraggingRef = useRef(false)
  const suppressClickUntilRef = useRef(0)
  const [active, setActive] = useState(() => {
    const saved = Number(window.sessionStorage.getItem(storageKey))
    return Number.isInteger(saved) ? clamp(saved, 0, Math.max(0, projects.length - 1)) : 0
  })
  const currentIndexRef = useRef(active)

  const setCurrentItem = useCallback((index: number) => {
    const next = clamp(index, 0, Math.max(0, projects.length - 1))
    currentIndexRef.current = next
    setActive(next)
    window.sessionStorage.setItem(storageKey, String(next))
  }, [projects.length, storageKey])

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current
    const next = clamp(index, 0, Math.max(0, projects.length - 1))
    const item = track?.querySelectorAll<HTMLElement>('.project-carousel-item').item(next)
    if (!track || !item) return
    track.scrollTo({ left: item.offsetLeft, behavior })
    setCurrentItem(next)
  }, [projects.length, setCurrentItem])

  const move = (direction: -1 | 1) => {
    const next = clamp(currentIndexRef.current + direction, 0, projects.length - 1)
    if (next !== currentIndexRef.current) scrollToIndex(next)
  }

  const syncActiveItem = () => {
    const track = trackRef.current
    if (!track) return
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)

    frameRef.current = requestAnimationFrame(() => {
      const items = Array.from(track.querySelectorAll<HTMLElement>('.project-carousel-item'))
      if (items.length === 0) return

      const closest = items.reduce((best, item, index) => (
        Math.abs(item.offsetLeft - track.scrollLeft) < Math.abs(items[best].offsetLeft - track.scrollLeft)
          ? index
          : best
      ), 0)

      setCurrentItem(closest)
    })
  }

  useEffect(() => {
    if (projects.length === 0) return

    const initialFrame = requestAnimationFrame(() => scrollToIndex(currentIndexRef.current, 'auto'))
    const keepCurrentItem = () => scrollToIndex(currentIndexRef.current, 'auto')
    window.addEventListener('resize', keepCurrentItem)

    return () => {
      cancelAnimationFrame(initialFrame)
      window.removeEventListener('resize', keepCurrentItem)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [projects.length, scrollToIndex])

  return (
    <div className="project-carousel" role="region" aria-roledescription="carousel" aria-label="프로젝트 목록">
      <div className="project-carousel-toolbar">
        <span>{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        <div className="project-carousel-pagination" aria-label="프로젝트 바로 이동">
          {projects.map((project, index) => (
            <button
              type="button"
              className={index === active ? 'is-active' : ''}
              key={project.slug}
              onClick={() => scrollToIndex(index)}
              aria-label={`${index + 1}번 프로젝트로 이동`}
              aria-current={index === active ? 'true' : undefined}
            />
          ))}
        </div>
        <div className="project-carousel-arrows">
          <button type="button" onClick={() => move(-1)} aria-label="이전 프로젝트" disabled={active === 0}>←</button>
          <button type="button" onClick={() => move(1)} aria-label="다음 프로젝트" disabled={active === projects.length - 1}>→</button>
        </div>
      </div>
      <div
        className="project-carousel-track"
        ref={trackRef}
        onScroll={syncActiveItem}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return
          pointerStartRef.current = event.clientX
          dragStartScrollRef.current = event.currentTarget.scrollLeft
          dragStartIndexRef.current = currentIndexRef.current
          isDraggingRef.current = false
        }}
        onPointerMove={(event) => {
          if (pointerStartRef.current === null) return
          const distance = event.clientX - pointerStartRef.current

          if (!isDraggingRef.current && Math.abs(distance) >= 6) {
            isDraggingRef.current = true
            event.currentTarget.classList.add('is-dragging')
            event.currentTarget.setPointerCapture(event.pointerId)
          }

          if (isDraggingRef.current) {
            event.preventDefault()
            event.currentTarget.scrollLeft = dragStartScrollRef.current - distance
          }
        }}
        onPointerUp={(event) => {
          if (pointerStartRef.current === null) return
          const distance = event.clientX - pointerStartRef.current
          pointerStartRef.current = null

          if (isDraggingRef.current) {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
            event.currentTarget.classList.remove('is-dragging')
            isDraggingRef.current = false
            suppressClickUntilRef.current = performance.now() + 250

            let target = dragStartIndexRef.current
            if (distance <= -32) target += 1
            if (distance >= 32) target -= 1
            scrollToIndex(target)
          }
        }}
        onPointerCancel={(event) => {
          pointerStartRef.current = null
          event.currentTarget.classList.remove('is-dragging')
          isDraggingRef.current = false
          scrollToIndex(dragStartIndexRef.current)
        }}
        onClickCapture={(event) => {
          if (performance.now() < suppressClickUntilRef.current) {
            event.preventDefault()
            event.stopPropagation()
          }
        }}
        onDragStart={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            move(-1)
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            move(1)
          }
        }}
        tabIndex={0}
      >
        {projects.map((project, index) => (
          <div
            className="project-carousel-item"
            key={project.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${projects.length}`}
          >
            <ProjectCard project={project} index={index} compact />
          </div>
        ))}
        <span className="project-carousel-end" aria-hidden="true" />
      </div>
    </div>
  )
}
