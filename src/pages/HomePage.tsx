import ProjectCarousel from '../components/ProjectCarousel'
import JourneyFlow from '../components/JourneyFlow'
import SocialLinks from '../components/SocialLinks'
import { codeProjects } from '../data/projects'

export default function HomePage() {
  return (
    <>
      <section className="compact-hero page-pad">
        <div className="compact-hero-grid">
          <div>
            <p className="eyebrow">KIM JINMYUNG · PORTFOLIO</p>
            <h1>김진명</h1>
          </div>
          <div className="compact-hero-side">
            <div className="profile-status">
              <div><small>CURRENT</small><b>인하대학교 인공지능공학과</b></div>
              <div><small>UPCOMING · 2026.09.01</small><b>행정안전부 인턴</b><span>RAG · MCP</span></div>
            </div>
          </div>
        </div>
        <div className="compact-meta">
          <span><small>EDUCATION</small>인하대학교 인공지능공학과</span>
          <span><small>FOCUS</small>RAG · LLM · NLP · AI Service</span>
          <span><small>BASED IN</small>Incheon, Korea</span>
        </div>
      </section>

      <section className="compact-section page-pad">
        <div className="compact-section-head">
          <div><span>01</span><p className="eyebrow">EXPERIENCE FLOW</p></div>
          <div><h2>Experience.</h2></div>
        </div>
        <JourneyFlow compact />
      </section>

      <section className="compact-section page-pad">
        <div className="compact-section-head">
          <div><span>02</span><p className="eyebrow">PROJECTS</p></div>
          <div><h2>Projects</h2></div>
        </div>
        <ProjectCarousel projects={codeProjects} />
      </section>

      <SocialLinks />
    </>
  )
}
