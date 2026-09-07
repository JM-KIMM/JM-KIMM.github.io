import { educationRecords, awardRecords } from '../data/aboutRecords'

export default function AboutPage() {
  return (
    <section className="page page-pad about-page about-v2">
      <div className="about-profile-layout">
        <aside className="about-identity">
          <div className="about-monogram about-photo"><img src="./assets/jinmyung-profile.jpeg?v=20260904" alt="김진명 프로필 사진" /></div>
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
            <div><small>EDUCATION · 2026.08</small><b>인하대학교 인공지능공학과</b><span>졸업</span></div>
            <div><small>CURRENT · 2026.09.01 —</small><b>행정안전부 인턴</b><span>RAG · MCP 구축</span></div>
          </div>

          <div className="about-record-columns about-profile-records">
            <section className="about-record-section compact-record">
              <header><span>01</span><div><p className="eyebrow">EDUCATION</p><h2>Education</h2></div></header>
              <div className="simple-record-list dated-record-list">
                {educationRecords.map(({ period, name, detail }) => <div key={`${period}-${name}`}><time>{period}</time><b>{name}</b><p>{detail}</p></div>)}
              </div>
            </section>

            <section className="about-record-section compact-record">
              <header><span>02</span><div><p className="eyebrow">AWARDS</p><h2>Awards</h2></div></header>
              <div className="simple-record-list dated-record-list">
                {awardRecords.map(({ period, name, detail }) => <div key={`${period}-${name}`}><time>{period}</time><b>{name}</b><p>{detail}</p></div>)}
              </div>
            </section>
          </div>
        </div>
      </div>

    </section>
  )
}
