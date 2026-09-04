import { Link, useParams } from 'react-router-dom'
import VideoEmbed from '../components/VideoEmbed'
import { caseStudies } from '../data/caseStudies'
import { projects } from '../data/projects'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export default function ProjectPage() {
  const { slug } = useParams()
  const projectIndex = projects.findIndex((item) => item.slug === slug)
  const project = projects[projectIndex]
  const caseStudy = slug ? caseStudies[slug] : undefined

  if (!project || !caseStudy) {
    return <div className="page page-pad">프로젝트를 찾을 수 없습니다.</div>
  }

  const previewSrc = project.previewImage ? assetUrl(project.previewImage) : undefined

  return (
    <article className={`case-page case-${project.type.toLowerCase()}`} data-project={project.slug}>
      <header className="case-hero page-pad" id="overview">
        <div className="case-hero-topline">
          <Link to="/projects" className="back-link">← Projects</Link>
          <span>{String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        </div>

        <div className="case-hero-heading">
          <div>
            <p className="eyebrow">{project.type.toUpperCase()} · {project.period}</p>
            <h1>{project.title}</h1>
          </div>
          <p className="case-lede">{caseStudy.lede}</p>
        </div>

        {previewSrc && (
          <figure className="case-cover">
            <img src={previewSrc} alt={project.previewAlt ?? `${project.title} 대표 이미지`} />
            <figcaption>
              <span>{project.previewLabel}</span>
              <span>{project.shortTitle}</span>
            </figcaption>
          </figure>
        )}

        <div className="case-meta">
          <dl>
            <div><dt>PERIOD</dt><dd>{project.period}</dd></div>
            {project.role && <div><dt>ROLE</dt><dd>{project.role}</dd></div>}
            <div><dt>MY PART</dt><dd>{project.ownership}</dd></div>
            {project.team && <div><dt>TEAM</dt><dd>{project.team}</dd></div>}
            {project.rank && <div><dt>RESULT</dt><dd>{project.rank}</dd></div>}
          </dl>
          <p>{caseStudy.ownershipNote}</p>
        </div>

      </header>

      <section className="case-brief page-pad" id="brief">
        <div className="case-section-heading">
          <span>01</span>
          <div><p className="eyebrow">CASE BRIEF</p><h2>프로젝트 요약</h2></div>
        </div>

        <div className="case-brief-grid">
          <article><small>PROBLEM</small><p>{caseStudy.brief.problem}</p></article>
          <article><small>RESPONSE</small><p>{caseStudy.brief.response}</p></article>
          <article><small>OUTCOME</small><p>{caseStudy.brief.outcome}</p></article>
        </div>

        <div className="case-proof-grid">
          {caseStudy.proofs.map((proof) => (
            <article key={proof.label}>
              <strong>{proof.value}</strong>
              <small>{proof.label}</small>
              <p>{proof.note}</p>
            </article>
          ))}
        </div>

        <div className="case-constraints">
          <div><p className="eyebrow">CONSTRAINTS</p><h3>먼저 고정한 현실 조건</h3></div>
          <ol>{caseStudy.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ol>
        </div>
      </section>

      <section className="case-decisions page-pad" id="decisions">
        <div className="case-section-heading">
          <span>02</span>
          <div><p className="eyebrow">DECISION TRAIL</p><h2>선택과 근거</h2></div>
        </div>

        <div className="case-decision-list">
          {caseStudy.decisions.map((decision) => (
            <article key={decision.label}>
              <header>
                <small>{decision.label}</small>
                <h3>{decision.title}</h3>
              </header>

              <div className="case-decision-trigger">
                <small>TRIGGER</small>
                <p>{decision.trigger}</p>
              </div>

              <div className="case-decision-options">
                <small>CONSIDERED</small>
                <ul>{decision.options.map((option) => <li key={option}>{option}</li>)}</ul>
              </div>

              <div className="case-decision-choice">
                <small>CHOICE</small>
                <p>{decision.choice}</p>
              </div>

              <div className="case-decision-rationale">
                <small>WHY</small>
                <p>{decision.rationale}</p>
              </div>

              <div className="case-decision-build">
                <small>IMPLEMENTATION</small>
                <ul>{decision.implementation.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>

              {decision.proof && <p className="case-decision-proof"><b>PROOF</b>{decision.proof}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="case-system page-pad" id="system">
        <div className="case-section-heading">
          <span>03</span>
          <div><p className="eyebrow">SYSTEM</p><h2>구현 구조</h2></div>
        </div>

        <div className="case-system-grid">
          {caseStudy.system.map((step, index) => (
            <article key={`${step.label}-${step.title}`}>
              <div><span>{String(index + 1).padStart(2, '0')}</span><small>{step.label}</small></div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <b>{step.tech}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="case-evidence page-pad" id="evidence">
        <div className="case-section-heading">
          <span>04</span>
          <div><p className="eyebrow">IMPLEMENTATION DETAILS</p><h2>세부 구현 내용</h2></div>
        </div>

        <div className="case-evidence-list">
          {caseStudy.evidence.map((evidence, index) => (
            <article key={evidence.image}>
              <figure>
                <img src={assetUrl(evidence.image)} alt={evidence.alt} loading="lazy" />
                <figcaption>{evidence.source}</figcaption>
              </figure>
              <div>
                <span>{String(index + 1).padStart(2, '0')} · {evidence.label}</span>
                <h3>{evidence.title}</h3>
                <p>{evidence.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="case-validation page-pad" id="validation">
        <div className="case-section-heading">
          <span>05</span>
          <div><p className="eyebrow">VALIDATION</p><h2>확인한 것과 남은 것</h2></div>
        </div>

        <div className="case-validation-grid">
          <article>
            <small>VERIFIED</small>
            <h3>근거로 확인한 결과</h3>
            <ul>{caseStudy.validation.verified.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <small>BOUNDARY</small>
            <h3>현재 구현의 경계</h3>
            <ul>{caseStudy.validation.boundary.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <small>NEXT TEST</small>
            <h3>다음 검증</h3>
            <ul>{caseStudy.validation.next.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
      </section>

      <section className="case-handoff page-pad">
        <div><small>FROM</small><p>{caseStudy.handoff.from}</p></div>
        <div><small>CARRIED FORWARD</small><p>{caseStudy.handoff.to}</p></div>
      </section>

      {project.videoId && (
        <section className="case-demo page-pad" id="demo">
          <div className="case-section-heading">
            <span>▶</span>
            <div><p className="eyebrow">DEMO</p><h2>실행 화면</h2></div>
          </div>
          <VideoEmbed videoId={project.videoId} title={`${project.title} demo`} />
        </section>
      )}

    </article>
  )
}
