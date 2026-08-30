import { Link } from 'react-router-dom'
import { caseStudies } from '../data/caseStudies'
import type { Project } from '../data/projects'

export default function ProjectCard({ project, index, compact = false, tabIndex }: { project: Project; index: number; compact?: boolean; tabIndex?: number }) {
  const previewSrc = project.previewImage ? `${import.meta.env.BASE_URL}${project.previewImage}` : undefined
  const caseStudy = caseStudies[project.slug]

  return (
    <Link tabIndex={tabIndex} aria-label={`${project.title} 상세 보기`} to={`/projects/${project.slug}`} data-project={project.slug} className={`project-card ${compact ? 'compact' : ''} ${project.type.toLowerCase()}`}>
      <div className="project-card-top">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <small>{project.type.toUpperCase()} · {project.period}</small>
        <i aria-hidden="true">CASE STUDY ↗</i>
      </div>
      <div className={`project-card-preview ${previewSrc ? '' : 'is-pipeline'}`}>
        <span className="project-card-preview-label">{project.previewLabel ?? `CASE ${String(index + 1).padStart(2, '0')} · ${project.shortTitle}`}</span>
        <div className="project-card-preview-canvas">
          {previewSrc
            ? <img src={previewSrc} alt={project.previewAlt ?? `${project.shortTitle} 프로젝트 자료 미리보기`} />
            : <div className="pipeline-diagram"><small>2-PASS PIPELINE</small><b>DRAFT <i>→</i> REFINE</b><span>RETRIEVE · GENERATE · VERIFY</span></div>}
        </div>
      </div>
      <div className="project-card-body">
        <p className="eyebrow">{project.eyebrow}</p>
        <h3>{project.shortTitle}</h3>
        {caseStudy && <p className="project-card-line">{caseStudy.cardLine}</p>}
        <div className="project-card-info">
          <div><small>MY PART</small><b>{project.ownership}</b></div>
          <div><small>{project.rank ? 'RESULT' : project.metricLabel}</small><b>{project.rank ?? project.metric}</b></div>
        </div>
      </div>
    </Link>
  )
}
