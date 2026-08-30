import ProjectCarousel from '../components/ProjectCarousel'
import { codeProjects } from '../data/projects'

export default function ProjectsPage() {
  return (
    <section className="page page-pad projects-page">
      <header className="projects-intro">
        <div>
          <p className="eyebrow">PROJECTS · {String(codeProjects.length).padStart(2, '0')}</p>
          <h1>Projects.</h1>
        </div>
        <div className="projects-intro-copy">
          <dl>
            <div><dt>TOTAL</dt><dd>{String(codeProjects.length).padStart(2, '0')}</dd></div>
            <div><dt>TYPE</dt><dd>RESEARCH · BUILD</dd></div>
            <div><dt>PERIOD</dt><dd>2025 — 2026</dd></div>
          </dl>
        </div>
      </header>

      <section className="project-collection">
        <div className="collection-heading">
          <span>01</span>
          <div><small>ALL WORK</small><h2>All Projects</h2></div>
        </div>
        <ProjectCarousel projects={codeProjects} />
      </section>
    </section>
  )
}
