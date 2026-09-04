const education = [
  ['재학', '인하대학교', '인공지능공학과'],
  ['2024-2', '인하-동동(同動)', '학습공동체 · 팀장 · 팀원 전원 A+'],
  ['2025-1', '인하-동동(同動)', '학습공동체 · 팀원 · 우수상'],
  ['2025.06—26.03', 'AIF.Lab 학부연구생', '한국어 스미싱 탐지 연구'],
  ['2025.06', 'INHA 코드트리 코딩 캠프', '코딩테스트 대비 전문 교육과정 수료'],
  ['2026', 'LG Aimers 8기', 'LG AI연구원 청년 AI 인재 교육 프로그램 수료'],
  ['2026.02', '제6회 Smart Semiconductor Academy', '생성형 AI, 반도체 AI 응용기술 과정 수료'],
  ['2026.06—09', 'LG Aimers 9기', 'AI Essential Course 이수 · LG AI 해커톤 완료'],
]

const awards = [
  ['군', '제6회 육군창업경진대회', '창의상'],
  ['2025.03', '건설공사 사고 예방 및 대응책 생성 : 한솔데코 시즌3 생성 AI 경진대회', 'Private 12위 / 24팀'],
  ['2025-1', '인하-동동(同動)', '우수상 · 팀원'],
  ['2025.08', '2025 SW중심대학 디지털 경진대회 · AI부문', '58위 / 271팀 · 팀장'],
  ['2025.09', '2025 금융 AI Challenge : 금융 AI 모델 경쟁', 'Private 6위 / 283팀 · 팀장'],
  ['2026.06', '인공지능 종합설계', '장려상'],
  ['2026.07', 'CJ대한통운 미래기술챌린지 2026', '최종 리더보드 4위'],
  ['2026.09', '2026 인하 인공지능 챌린지', '우수상 · 팀장'],
]

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
            <div><small>EDUCATION</small><b>인하대학교 인공지능공학과</b></div>
            <div><small>CURRENT · 2026.09.01 —</small><b>행정안전부 인턴</b><span>RAG · MCP 구축</span></div>
          </div>

          <div className="about-record-columns about-profile-records">
            <section className="about-record-section compact-record">
              <header><span>01</span><div><p className="eyebrow">EDUCATION</p><h2>Education</h2></div></header>
              <div className="simple-record-list dated-record-list">
                {education.map(([period, name, detail]) => <div key={`${period}-${name}`}><time>{period}</time><b>{name}</b><p>{detail}</p></div>)}
              </div>
            </section>

            <section className="about-record-section compact-record">
              <header><span>02</span><div><p className="eyebrow">AWARDS</p><h2>Awards</h2></div></header>
              <div className="simple-record-list dated-record-list">
                {awards.map(([year, name, result]) => <div key={name}><time>{year}</time><b>{name}</b><p>{result}</p></div>)}
              </div>
            </section>
          </div>
        </div>
      </div>

    </section>
  )
}
