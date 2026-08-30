import JourneyFlow from '../components/JourneyFlow'

const education = [
  ['인하대학교', '인공지능공학과'],
  ['LG Aimers 9기', 'AI Essential Course · LG AI 해커톤'],
  ['LG Aimers 8기', 'LG AI연구원 청년 AI 인재 교육 프로그램 수료'],
  ['제6회 Smart Semiconductor Academy', '생성형 AI, 반도체 AI 응용기술 과정 수료'],
  ['INHA 코드트리 코딩 캠프', '코딩테스트 대비 전문 교육과정 수료'],
]

const awards = [
  ['2026', 'CJ대한통운 미래기술챌린지 2026', '최종 리더보드 4위'],
  ['2026', '인공지능 종합설계', '장려상'],
  ['2025', '2025 금융 AI Challenge : 금융 AI 모델 경쟁', 'Private 6위 / 283팀 · 팀장'],
  ['2025', '2025 SW중심대학 디지털 경진대회 · AI부문', '58위 / 271팀 · 팀장'],
  ['2025', '건설공사 사고 예방 및 대응책 생성 : 한솔데코 시즌3 생성 AI 경진대회', 'Private 12위 / 24팀'],
  ['교내', '인하-동동(同動)', '우수상 · 팀장'],
  ['군', '제6회 육군창업경진대회', '창의상'],
]

export default function AboutPage() {
  return (
    <section className="page page-pad about-page about-v2">
      <div className="about-profile-layout">
        <aside className="about-identity">
          <div className="about-monogram about-photo"><img src="./assets/jinmyung-profile.jpeg" alt="김진명 프로필 사진" /></div>
          <div className="about-person"><h1>김진명</h1><p>Jinmyung Kim</p></div>
          <dl className="identity-facts">
            <div><dt>MAJOR</dt><dd>인공지능공학과</dd></div>
            <div><dt>BASED</dt><dd>Incheon, Korea</dd></div>
            <div><dt>FOCUS</dt><dd>RAG · LLM · NLP</dd></div>
          </dl>
        </aside>

        <div className="about-main-copy">
          <p className="eyebrow">ABOUT ME</p>
          <div className="about-status">
            <div><small>CURRENT</small><b>인하대학교 인공지능공학과</b></div>
            <div><small>UPCOMING · 2026.09.01</small><b>행정안전부 인턴</b><span>RAG · MCP 구축</span></div>
          </div>
        </div>
      </div>

      <section className="about-record-section about-journey-section">
        <header><span>01</span><div><p className="eyebrow">STORYLINE</p><h2>How each step connected</h2></div></header>
        <JourneyFlow />
      </section>

      <div className="about-record-columns">
        <section className="about-record-section compact-record">
          <header><span>02</span><div><p className="eyebrow">EDUCATION</p><h2>Education</h2></div></header>
          <div className="simple-record-list">
            {education.map(([name, detail]) => <div key={name}><b>{name}</b><p>{detail}</p></div>)}
          </div>
        </section>

        <section className="about-record-section compact-record">
          <header><span>03</span><div><p className="eyebrow">AWARDS</p><h2>Awards</h2></div></header>
          <div className="simple-record-list award-record-list">
            {awards.map(([year, name, result]) => <div key={name}><time>{year}</time><b>{name}</b><p>{result}</p></div>)}
          </div>
        </section>
      </div>
    </section>
  )
}
