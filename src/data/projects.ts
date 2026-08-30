export type WorkType = 'Research' | 'Project'

export type Project = {
  slug: string
  type: WorkType
  title: string
  shortTitle: string
  eyebrow: string
  period: string
  role?: string
  ownership: string
  team?: string
  rank?: string
  metric: string
  metricLabel: string
  previewImage: string
  previewAlt: string
  previewLabel: string
  videoId?: string
  github: string
  hasImplementation: boolean
}

export const projects: Project[] = [
  {
    slug: 'cj-logistics-3d-box',
    type: 'Project',
    title: 'CJ대한통운 · CCTV 기반 박스 수량 및 3D 크기 추정',
    shortTitle: 'CJ Logistics',
    eyebrow: 'COMPUTER VISION · GEOMETRY · OFFLINE INFERENCE',
    period: '2026.06.22 — 2026.07.16',
    role: '1인 개발',
    ownership: '학습·추론 파이프라인 설계 및 구현',
    rank: '최종 리더보드 4위',
    metric: '62.3cm',
    metricLabel: 'Rail-based calibration',
    previewImage: 'assets/project-evidence/cj-size-inference.jpg',
    previewAlt: '박스 분할, 컨베이어 레일 보정, 8개 꼭짓점 기반 실제 크기 측정 결과',
    previewLabel: 'SEGMENT · CALIBRATE · MEASURE',
    github: 'https://github.com/JM-KIMM/CJ-Challenge-CCTV',
    hasImplementation: true,
  },
  {
    slug: 'financial-rag',
    type: 'Project',
    title: '금융보안 RAG 검색·질의응답',
    shortTitle: 'Financial RAG',
    eyebrow: 'RETRIEVAL · RERANKING · LOCAL LLM',
    period: '2025.07 — 2025.09',
    role: '팀장 · 파이프라인 총괄',
    ownership: '데이터 수집 · 검색 파이프라인 총괄',
    team: '4인 팀',
    rank: 'Private 6위 / 283팀',
    metric: '10,913',
    metricLabel: 'Document chunks',
    previewImage: 'assets/project-previews/financial-rag-flow.svg',
    previewAlt: '질문 증강, FAISS 후보 검색, 필터, BGE 재정렬, 답변으로 이어지는 금융 RAG 흐름',
    previewLabel: 'AUGMENT · RETRIEVE · RERANK',
    github: 'https://github.com/JM-KIMM/RAG-based-Financial-Security-LLM',
    hasImplementation: true,
  },
  {
    slug: 'visionchef',
    type: 'Project',
    title: 'VisionChef · Interactive Cooking Copilot',
    shortTitle: 'VisionChef',
    eyebrow: 'RAG · TOOL-CALLING AGENT · VOICE UX',
    period: '2026.03 — 2026.06',
    role: 'LLM · RAG 담당',
    ownership: '레시피 검색 · 도구 호출 · 음성 응답 흐름 구현',
    team: '4인 팀',
    rank: '인공지능 종합설계 장려상',
    metric: '5 tools',
    metricLabel: 'Bounded agent actions',
    previewImage: 'assets/project-evidence/visionchef-agent-ui-v2.jpg',
    previewAlt: 'VisionChef에서 음성 질문이 YouTube 검색 도구 호출과 화면 응답으로 이어지는 시연',
    previewLabel: 'SEARCH · ACT · RESPOND',
    videoId: 'O-4TdGWXBEg',
    github: 'https://github.com/JM-KIMM/VisionChef',
    hasImplementation: true,
  },
  {
    slug: 'undergraduate-research-smishing',
    type: 'Research',
    title: '학부연구생 · 한국어 스미싱 탐지 연구',
    shortTitle: 'Smishing Research',
    eyebrow: 'DATASET · NLP · EXPLAINABLE AI',
    period: '2025.06 — 2026.03',
    role: '제1저자',
    ownership: '데이터 구조 · 모델 벤치마크 · 탐지 데모',
    team: '2인 연구',
    metric: '18,270',
    metricLabel: 'Korean messages',
    previewImage: 'assets/project-evidence/smishing-benchmark-v2.jpg',
    previewAlt: 'CNN, FastText, KcELECTRA, EXAONE, Gemini, ChatGPT 모델의 스미싱 탐지 벤치마크 표',
    previewLabel: 'DATASET · BENCHMARK · EXPLANATION',
    videoId: '7vtg7ikFyKc',
    github: 'https://github.com/JM-KIMM/K-smishing_Introduce',
    hasImplementation: false,
  },
  {
    slug: 'seongnam-xai',
    type: 'Project',
    title: '성남 생활상권 성장 잠재력 XAI',
    shortTitle: 'Seongnam XAI',
    eyebrow: 'PUBLIC DATA · CLUSTERING · LOCAL LLM',
    period: '2026.03 — 2026.05',
    role: '팀장 · LLM 연동',
    ownership: '분석 구조 정리 · 근거 payload · LLM 해설 연동',
    metric: '1,199',
    metricLabel: 'Dong-month observations',
    previewImage: 'assets/project-previews/seongnam-xai.jpg',
    previewAlt: '성남시 행정동별 성장 잠재력 지도, 유형 프로필, A.X 근거 해설 화면',
    previewLabel: '24 MONTHS · 50 DONGS · 5 SIGNALS',
    videoId: 'Kw9XliKYkd4',
    github: 'https://github.com/JM-KIMM/seongnam',
    hasImplementation: true,
  },
  {
    slug: 'hansol-2pass',
    type: 'Project',
    title: '건설 안전 대응 생성 RAG',
    shortTitle: 'Construction Safety RAG',
    eyebrow: 'QA RETRIEVAL · GENERATION · IMPLEMENTATION AUDIT',
    period: '2025.02 — 2025.03',
    role: '1인 개발',
    ownership: 'QA 검색 · VARCO 생성 · Qwen 검수 설계',
    rank: 'Private 12위 / 24팀',
    metric: 'Top 3',
    metricLabel: 'Similar QA retrieval',
    previewImage: 'assets/project-previews/hansol-2pass-flow.svg',
    previewAlt: '유사 QA 검색과 VARCO 초안은 구현되고 Qwen 검수는 로더만 준비된 실행 경계',
    previewLabel: 'IMPLEMENTED · PREPARED · NOT WIRED',
    github: 'https://github.com/JM-KIMM/Construction-Safety-AI-2-Pass-Generation',
    hasImplementation: true,
  },
]

export const portfolioProjects = projects
export const codeProjects = portfolioProjects
