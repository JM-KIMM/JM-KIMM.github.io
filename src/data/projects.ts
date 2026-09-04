export type WorkType = 'Research' | 'Project'

export type Project = {
  sortKey: string
  slug: string
  type: WorkType
  title: string
  detailTitle: string
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

const projectEntries: Project[] = [
  {
    sortKey: '2026-07-16',
    slug: 'inha-world-model',
    type: 'Project',
    title: '로봇 미래 행동 영상 생성 · World Model',
    detailTitle: '2026 인하 인공지능 챌린지',
    shortTitle: 'INHA World Model',
    eyebrow: 'WORLD MODEL · VIDEO DIFFUSION · ROBOTICS',
    period: '2026.07.16 — 2026.08.20',
    role: '팀장 · World Model 학습·추론',
    ownership: '학습·추론 및 재현 파이프라인',
    team: '3인 팀',
    rank: '2026 인하 인공지능 챌린지 우수상',
    metric: '0.21395',
    metricLabel: 'Private score · lower is better',
    previewImage: 'assets/project-previews/inha-world-model-flow.svg',
    previewAlt: '초기 로봇 이미지와 16단계 관절 명령을 Cosmos 기반 월드 모델에 입력해 16프레임 액션 조건부 영상을 생성하는 구조',
    previewLabel: 'ACTION · PREDICT · GENERATE',
    github: 'https://github.com/JM-KIMM/inha_worldmodel',
    hasImplementation: true,
  },
  {
    sortKey: '2026-06-22',
    slug: 'cj-logistics-3d-box',
    type: 'Project',
    title: 'CJ대한통운 · CCTV 기반 박스 수량 및 3D 크기 추정',
    detailTitle: 'CJ대한통운 미래기술챌린지 2026',
    shortTitle: 'CJ Logistics',
    eyebrow: 'COMPUTER VISION · GEOMETRY · OFFLINE INFERENCE',
    period: '2026.06.22 — 2026.07.16',
    role: 'CV 파이프라인 담당',
    ownership: '학습 데이터 직접 라벨링 · 학습·추론 파이프라인',
    team: '팀 프로젝트',
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
    sortKey: '2025-07-14',
    slug: 'financial-rag',
    type: 'Project',
    title: '금융보안 RAG · BGE 리랭커 기반 질의응답',
    detailTitle: '2025 금융 AI Challenge : 금융 AI 모델 경쟁',
    shortTitle: 'Financial RAG',
    eyebrow: 'RETRIEVAL · RERANKING · LOCAL LLM',
    period: '2025.07 — 2025.09',
    role: '팀장 · 파이프라인 총괄',
    ownership: '데이터 수집 · 검색·리랭킹 파이프라인 총괄',
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
    sortKey: '2026-03-01',
    slug: 'visionchef',
    type: 'Project',
    title: 'VisionChef · Interactive Cooking Copilot',
    detailTitle: 'VisionChef',
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
    sortKey: '2025-06-01',
    slug: 'undergraduate-research-smishing',
    type: 'Research',
    title: '한국어 스미싱 탐지 연구',
    detailTitle: 'AIF.Lab 학부연구생',
    shortTitle: 'Smishing Research',
    eyebrow: 'DATASET · NLP · EXPLAINABLE AI',
    period: '2025.06 — 2026.03',
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
    sortKey: '2026-03-01',
    slug: 'seongnam-xai',
    type: 'Project',
    title: '성남 생활상권 성장 잠재력 대시보드 · XAI',
    detailTitle: '2026년 성남시 공공데이터 활용 시각화 경진대회',
    shortTitle: 'Seongnam XAI',
    eyebrow: 'PUBLIC DATA · CLUSTERING · LOCAL LLM',
    period: '2026.03 — 2026.05',
    role: '팀장 · LLM 연동',
    ownership: '분석 구조 · 대시보드 근거 payload · LLM 해설',
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
    sortKey: '2025-02-01',
    slug: 'hansol-2pass',
    type: 'Project',
    title: '건설 안전 대응 생성 RAG',
    detailTitle: '건설공사 사고 예방 및 대응책 생성 : 한솔데코 시즌3 생성 AI 경진대회',
    shortTitle: 'Construction Safety RAG',
    eyebrow: 'QA RETRIEVAL · CONTEXT COMPRESSION · TWO-LLM',
    period: '2025.02 — 2025.03',
    role: '1인 개발',
    ownership: 'QA 검색 · VARCO 컨텍스트 압축 · Qwen 최종 생성',
    rank: 'Private 12위 / 24팀',
    metric: 'Top 3',
    metricLabel: 'Similar QA retrieval',
    previewImage: 'assets/project-previews/hansol-2pass-flow.svg',
    previewAlt: '유사 QA 검색 결과를 VARCO가 핵심 근거로 압축하고 Qwen이 최종 안전 대응책을 생성하는 두 단계 구조',
    previewLabel: 'RETRIEVE · COMPRESS · GENERATE',
    github: 'https://github.com/JM-KIMM/Construction-Safety-AI-2-Pass-Generation',
    hasImplementation: true,
  },
]

export const projects = [...projectEntries].sort((a, b) => a.sortKey.localeCompare(b.sortKey))
export const portfolioProjects = projects
export const codeProjects = portfolioProjects
