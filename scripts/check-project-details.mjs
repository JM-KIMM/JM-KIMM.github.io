import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { createServer } from 'vite'
import postcss from 'postcss'

// Non-browser smoke tests: data integrity, all detail routes, links and theme colors.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { caseStudies } = await vite.ssrLoadModule('/src/data/caseStudies.ts')
  const { projects } = await vite.ssrLoadModule('/src/data/projects.ts')
  const { default: ProjectPage } = await vite.ssrLoadModule('/src/pages/ProjectPage.tsx')
  const { default: ProjectCard } = await vite.ssrLoadModule('/src/components/ProjectCard.tsx')
  assert.equal(projects.length, 7)
  assert.deepEqual(Object.keys(caseStudies).sort(), projects.map(p => p.slug).sort())
  assert.deepEqual(projects.map(p => p.sortKey), projects.map(p => p.sortKey).sort().reverse())

  function checkResource(url) {
    if (/^https:\/\//.test(url)) { assert.equal(new URL(url).protocol, 'https:'); return }
    assert(!url.includes('..'), `Unexpected resource traversal: ${url}`)
    assert(existsSync(path.resolve('public', url.split('#')[0])), `Missing local resource: ${url}`)
  }
  function renderRoute(slug) {
    return renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [`/projects/${slug}`] },
      React.createElement(Routes, null, React.createElement(Route, { path: '/projects/:slug', element: React.createElement(ProjectPage) }))))
  }
  for (const [index, project] of projects.entries()) {
    const study = caseStudies[project.slug]
    assert(study.decisions.length >= 2)
    const figureIds = study.figures.map(f => f.id)
    assert.equal(new Set(figureIds).size, figureIds.length)
    const used = []
    if (study.overviewFigure) { assert(!project.videoId); used.push(study.overviewFigure) }
    for (const decision of study.decisions) {
      for (const field of ['title', 'situation', 'approach', 'expectation', 'outcome']) assert(decision[field]?.trim(), `${project.slug}: missing ${field}`)
      assert(['design', 'experiment'].includes(decision.basis))
      assert(decision.implementation.length > 0)
      checkResource(decision.source.url)
      if (decision.figure) used.push(decision.figure)
    }
    assert.equal(new Set(used).size, used.length, `${project.slug}: duplicated figure placement`)
    for (const id of used) assert(figureIds.includes(id), `${project.slug}: missing figure ${id}`)
    for (const figure of study.figures) {
      checkResource(figure.source.url)
      if (figure.kind === 'image') { checkResource(figure.image); assert(figure.alt) }
      else {
        assert(figure.note)
        for (const row of figure.rows) assert.equal(row.length, figure.columns.length)
      }
    }
    for (const resource of study.resources) checkResource(resource.url)
    const html = renderRoute(project.slug)
    assert.equal((html.match(/<h1\b/g) || []).length, 1)
    assert(html.includes(project.detailTitle))
    assert(html.includes('DECISION TRAIL'))
    assert.equal((html.match(/class="detail-decision"/g) || []).length, study.decisions.length)
    assert.equal((html.match(/<figure\b/g) || []).length, study.figures.length)
    assert.equal((html.match(/<details\b/g) || []).length, study.decisions.length)
    assert(!/NEXT PROJECT|CARRIED FORWARD|30초|정교하지만 틀린 계측기/.test(html))
    if (project.videoId) {
      assert.equal((html.match(/youtube-nocookie.com\/embed\//g) || []).length, 1)
      assert.equal((html.match(/id="detail-demo"/g) || []).length, 1)
      const videoPosition = html.indexOf('youtube-nocookie.com/embed/')
      if (study.followUp) {
        assert(videoPosition > html.indexOf('class="detail-flow"'), 'Follow-up service must come after the research process')
        assert(videoPosition > html.indexOf('class="detail-followup"'))
      } else assert(videoPosition < html.indexOf('class="detail-decisions"'))
    }
    for (const anchor of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert(anchor[0].includes('rel="noreferrer"'))
    const card = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(ProjectCard, { project, index })))
    assert(card.includes(study.cardLine))
    console.log(`PASS ${project.slug}: ${study.decisions.length} decisions, ${study.figures.length} figures`)
  }
  assert(renderRoute('unknown-project').includes('프로젝트를 찾을 수 없습니다.'))
  assert(caseStudies['cj-logistics-3d-box'].decisions[0].approach.includes('AnyLabeling'))
  assert(caseStudies['cj-logistics-3d-box'].decisions[0].implementation.some(s => s.includes('visibility=2')))
  assert(caseStudies['undergraduate-research-smishing'].decisions[1].approach.includes('GPT-4o'))
  assert.equal(caseStudies['undergraduate-research-smishing'].figures.find(f => f.id === 'benchmark').rows.length, 6)
  const research = caseStudies['undergraduate-research-smishing']
  assert(research.lede.includes('논문'))
  assert.equal(research.flow.at(-1).title, '논문 작성')
  assert(research.followUp.description.includes('5명이'))
  assert(!research.ownershipNote.includes('데모'))
  assert(renderRoute('undergraduate-research-smishing').includes('연구 진행'))
  const hansol = caseStudies['hansol-2pass']
  assert(hansol.decisions[0].approach.includes('Qwen2.5-14B-Instruct-1M'))
  assert(hansol.decisions[0].approach.includes('사고 입력과 RAG 문서도 함께'))
  assert(hansol.limitations.some(s => s.includes('실제 제출 입력이 100만 토큰이었다는 의미는 아닙니다')))
  assert(caseStudies['inha-world-model'].decisions[1].situation.includes('목적함수·샘플러·조건 표현·추론 설정을 유지'))

  const css = readFileSync('src/styles.css', 'utf8')
  const detailCss = readFileSync('src/styles/project-detail.css', 'utf8')
  const luminance = hex => {
    const rgb = hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
    return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2]
  }
  for (const selector of [':root', "[data-theme='dark']"]) {
    const block = css.slice(css.indexOf(selector)).split('}')[0]
    const color = name => block.match(new RegExp(`--${name}:\\s*(#[a-f\\d]{6})`, 'i'))[1]
    for (const text of ['ink', 'muted']) for (const background of ['bg', 'soft']) {
      const values = [luminance(color(text)), luminance(color(background))].sort((a, b) => b - a)
      const ratio = (values[0] + .05) / (values[1] + .05)
      assert(ratio >= 4.5, `${selector} ${text}/${background} contrast ${ratio}`)
    }
  }
  assert(detailCss.includes('@media (max-width: 760px)'))
  assert(detailCss.includes('@media (max-width: 440px)'))
  assert(detailCss.includes('white-space: normal'))
  assert(detailCss.includes('overflow-x: auto'))
  // CSS regression checks, not a browser layout test. Check effective base declarations
  // across the two style blocks in the standalone CJ document.
  const cjDocument = readFileSync('public/docs/cj-algorithm-note.html', 'utf8')
  const cjCss = postcss.parse([...cjDocument.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n'))
  const declarations = (root, selector) => {
    const result = {}
    root.walkRules(rule => {
      if (rule.parent.type === 'root' && rule.selector === selector) rule.walkDecls(decl => { result[decl.prop] = decl.value })
    })
    return result
  }
  assert.equal(declarations(cjCss, '.wrap')['max-width'], '1440px')
  assert.equal(declarations(cjCss, 'h1')['max-width'], 'none')
  assert.equal(declarations(cjCss, '.badge b')['white-space'], 'normal')
  assert(declarations(cjCss, '.badges')['grid-template-columns'].includes('auto-fit'))
  assert(!declarations(cjCss, '.hero-grid')['grid-template-columns'].includes('420px'))
  assert(!cjDocument.includes('min-width:590px'))
  assert(!cjDocument.includes('min-width:640px'))
  assert(cjDocument.includes('<b>50개 영상</b><span>총 435개 박스 분석</span>'))
  assert.equal(declarations(postcss.parse(css), ':root')['--max'], '1400px')
  assert.equal(declarations(postcss.parse(detailCss), '.detail-decision-body')['max-width'], '1040px')
  console.log('PASS research/service separation, Qwen long-context inputs and CJ layout regression checks')
  console.log('PASS missing route, card integration, labeling content, local resources and theme text contrast')
} finally {
  await vite.close()
}
