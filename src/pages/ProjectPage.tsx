import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import VideoEmbed from '../components/VideoEmbed'
import ProjectFigure, { contentHref } from '../components/ProjectFigure'
import { caseStudies } from '../data/caseStudies'
import { projects } from '../data/projects'

function SectionHeading({ number, label, title }: { number: string; label: string; title: string }) {
  return <header className="detail-section-heading"><p><span>{number}</span>{label}</p><h2>{title}</h2></header>
}

export default function ProjectPage() {
  const { slug } = useParams()
  const projectIndex = projects.findIndex((item) => item.slug === slug)
  const project = projects[projectIndex]
  const study = slug ? caseStudies[slug] : undefined
  if (!project || !study) return <div className="page page-pad"><h1>프로젝트를 찾을 수 없습니다.</h1><Link to="/projects">프로젝트 목록으로</Link></div>

  const titleUnits = [...project.detailTitle].reduce((sum, char) => sum + (/\s/.test(char) ? .3 : /[\x00-\x7F]/.test(char) ? .62 : 1), 0)
  const overview = study.figures.find((figure) => figure.id === study.overviewFigure)
  const inlineIds = new Set(study.decisions.map((decision) => decision.figure).filter(Boolean))
  const remainingFigures = study.figures.filter((figure) => figure.id !== overview?.id && !inlineIds.has(figure.id))
  const showDemo = () => document.getElementById('detail-demo')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })

  return (
    <article className="case-detail page-pad" data-project={project.slug}>
      <header className="detail-hero">
        <div className="detail-topline"><Link to="/projects">← Projects</Link><span>{String(projectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></div>
        <div className="detail-title-wrap" style={{ '--title-units': titleUnits } as CSSProperties}>
          <p className="detail-eyebrow">{project.type === 'Research' ? 'RESEARCH' : 'PROJECT'} · {project.shortTitle}</p>
          <h1>{project.detailTitle}</h1>
        </div>
        <p className="detail-lede">{study.lede}</p>
        <div className="detail-links" aria-label="프로젝트 관련 자료">
          <a href={project.github} target="_blank" rel="noreferrer">{project.hasImplementation ? 'GitHub' : '연구 소개'} ↗</a>
          {study.resources.map((resource) => <a key={resource.url} href={contentHref(resource.url)} target="_blank" rel="noreferrer">{resource.title} ↗</a>)}
          {project.videoId && <button type="button" onClick={showDemo}>시연 영상 ↓</button>}
        </div>
        <dl className="detail-meta">
          <div><dt>기간</dt><dd>{project.period}</dd></div>
          {project.team && <div><dt>팀 구성</dt><dd>{project.team}</dd></div>}
          {project.role && <div><dt>역할</dt><dd>{project.role}</dd></div>}
        </dl>
        <div className="detail-ownership"><span>담당 업무</span><p>{study.ownershipNote}</p></div>
      </header>

      <section className="detail-section detail-overview" aria-label="프로젝트 개요">
        <SectionHeading number="01" label="OVERVIEW" title="프로젝트 개요" />
        <p className="detail-problem">{study.problem}</p>
        <div className="detail-result-strip"><span>결과</span><p>{study.result}</p></div>
        {project.videoId ? <div className="detail-preview" id="detail-demo"><h3>실행 화면</h3><VideoEmbed videoId={project.videoId} title={`${project.shortTitle} 실행 시연`} /></div> : overview ? <div className="detail-preview"><ProjectFigure figure={overview} eager /></div> : null}
      </section>

      <section className="detail-section" aria-label="선택과 근거">
        <SectionHeading number="02" label="DECISION TRAIL" title="선택과 근거" />
        <div className="detail-decisions">
          {study.decisions.map((decision, index) => {
            const figure = study.figures.find((item) => item.id === decision.figure && item.id !== overview?.id)
            return (
              <article className="detail-decision" key={decision.title}>
                <header><span>{String(index + 1).padStart(2, '0')}</span><h3>{decision.title}</h3></header>
                <div className="detail-decision-body">
                  <div className="detail-situation"><h4>{decision.basis === 'experiment' ? '실험에서 확인한 문제' : '설계 배경'}</h4><p>{decision.situation}</p></div>
                  <div><h4>접근 방법</h4><p>{decision.approach}</p></div>
                  <div className="detail-expectation"><h4>기대한 효과</h4><p>{decision.expectation}</p></div>
                  <div className="detail-outcome"><h4>결과</h4><p>{decision.outcome}</p></div>
                  <details className="detail-implementation"><summary>세부 구현 내용</summary><ul>{decision.implementation.map((item) => <li key={item}>{item}</li>)}</ul></details>
                  <a className="detail-source" href={contentHref(decision.source.url)} target="_blank" rel="noreferrer">{decision.source.title} ↗</a>
                  {figure && <ProjectFigure figure={figure} />}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="detail-section" aria-label="구현 구조">
        <SectionHeading number="03" label="IMPLEMENTATION" title="구현 구조" />
        <ol className="detail-flow">{study.flow.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></li>)}</ol>
        {remainingFigures.map((figure) => <ProjectFigure key={figure.id} figure={figure} />)}
      </section>

      <section className="detail-section detail-retrospective" aria-label="결과와 회고">
        <SectionHeading number="04" label="RETROSPECTIVE" title="결과와 회고" />
        <div className="detail-review-grid">
          <div><h3>작업을 통해 정리한 점</h3><p>{study.reflection}</p></div>
          <div><h3>한계와 후속 검증</h3><ul>{study.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
        {study.scopeNote && <p className="detail-scope"><span>공개 자료 범위</span>{study.scopeNote}</p>}
      </section>
    </article>
  )
}
