export type Activity = {
  title: string
  subtitle: string
  period: string
  role: string
  summary: string
  points: string[]
  purpose: string
  carriedForward: string
  result?: string
  url?: string
}

export const learningActivities: Activity[] = [
  {
    title: 'LG Aimers 9기',
    subtitle: 'LG AI연구원 청년 AI 인재 교육 프로그램',
    period: '2026.06.22 — 09.02',
    role: 'AI 교육 · 온라인 해커톤 진행 중',
    summary: 'AI Essential Course를 이수하고 LG 산업 데이터 기반 온라인 해커톤을 진행 중입니다.',
    points: [
      'Tabular ML · 시계열 · LLM Agent 교육',
      'LLM Application & Evaluation 학습',
      'LG 산업 데이터 기반 온라인 해커톤 참여',
    ],
    purpose: 'RAG와 에이전트 구현 경험을 개별 프로젝트 수준에서 산업 데이터 문제로 확장하기 위해 참여했습니다.',
    carriedForward: '평가 설계와 산업 데이터 실험 경험을 행정안전부 RAG·MCP 업무에서 사용할 검증 기준으로 연결할 예정입니다.',
    url: 'https://www.lgaimers.ai/',
  },
  {
    title: 'LG Aimers 8기',
    subtitle: 'LG AI연구원 청년 AI 인재 교육 프로그램',
    period: '2026 · 8기',
    role: '교육과정 수료',
    summary: 'EXAONE 경량화 과제를 중심으로 모델의 정확도뿐 아니라 크기와 추론 효율을 함께 다루는 실전형 AI 최적화 과정을 이수했습니다.',
    points: [
      'EXAONE 4.0 1.2B 기반 LLM 경량화 문제 이해',
      '온디바이스 환경에서 성능과 추론 비용 사이의 trade-off 학습',
      '산업 문제를 평가 지표와 실험 단위로 전환하는 과정 경험',
    ],
    purpose: '큰 모델을 쓰는 것만으로 해결되지 않는 메모리·지연·배포 제약을 직접 다루기 위해 이수했습니다.',
    carriedForward: '모델 성능과 실행 비용을 함께 보는 관점이 CJ의 ONNX 오프라인 추론과 서비스별 모델 선택 기준을 보강했습니다.',
    url: 'https://www.lgresearch.ai/news/view?seq=638',
  },
  {
    title: '제6회 Smart Semiconductor Academy',
    subtitle: '생성형 AI, 반도체 AI 응용기술',
    period: '2026.02.23 — 02.24',
    role: '교육과정 수료',
    summary: '생성형 AI와 반도체 AI 응용기술을 산업 관점에서 살펴보며, 소프트웨어 모델과 실제 연산 환경을 함께 보는 시야를 넓혔습니다.',
    points: [
      '생성형 AI와 반도체 AI 응용 사례 학습',
      'AI 연산을 지탱하는 하드웨어·패키징 관점 탐색',
      '모델 설계와 실제 구동 환경의 연결 이해',
    ],
    purpose: 'AI 모델이 실제로 실행되는 하드웨어와 연산 환경을 이해해 소프트웨어 관점의 편향을 보완하고자 했습니다.',
    carriedForward: '평가 장비와 메모리·연산 제약을 설계 초기에 확인하는 습관으로 이어져 LG Aimers와 CJ 제출 환경 구성에 도움이 됐습니다.',
    url: 'https://ssakorea.kr/sub/conference/history',
  },
  {
    title: 'INHA 코드트리 코딩 캠프',
    subtitle: '인하대학교 SW중심대학사업단 코딩테스트 대비 전문 교육과정',
    period: '2025 · 수료',
    role: '교육생',
    summary: '자료구조와 알고리즘을 문제 유형별로 반복하며 구현 정확도와 풀이 속도를 함께 높이는 훈련을 진행했습니다.',
    points: [
      '코딩테스트 핵심 자료구조와 알고리즘 반복 학습',
      '풀이 근거를 먼저 세우고 구현으로 옮기는 습관 강화',
      '시간복잡도와 예외 케이스를 포함한 제출 전 검증 루틴 정립',
    ],
    purpose: '모델과 라이브러리에 의존하기 전에 문제 조건을 읽고 직접 구현하는 기본기를 보강하고자 했습니다.',
    carriedForward: '풀이를 단계로 나누고 예외를 먼저 확인하는 방식이 한솔 2-pass와 CJ 측정 파이프라인의 기본 설계 습관이 됐습니다.',
    url: 'https://www.codetree.ai/blog/ko/%EC%BD%94%EB%93%9C%ED%8A%B8%EB%A6%AC-%EC%9D%B8%ED%95%98%EB%8C%80-%EC%BD%94%EB%94%A9-%EC%BA%A0%ED%94%84-%EC%84%B1%EB%A3%8C2%EC%A3%BC%EA%B0%84-%EC%BD%94%EC%9D%B5-%EC%A0%90%EC%88%98-%ED%8F%89',
  },
  {
    title: '인하-동동(同動)',
    subtitle: '인하대학교 교수학습개발센터 학습공동체 프로그램',
    period: '2024-2 · 2025-1',
    role: '팀장 1회 · 팀원 1회',
    summary: '같은 교과목을 수강하는 학생들과 학습공동체를 운영하며 학습 목표, 주차별 활동, 회고를 문서화했습니다.',
    points: [
      '2024-2학기 팀장으로 일정·역할·주차별 학습 기록 관리',
      '2025-1학기 팀원으로 참여해 설명과 피드백 중심의 협업 학습 수행',
      '학습 결과보다 과정과 팀 운영을 꾸준히 기록하는 습관 형성',
    ],
    purpose: '혼자 공부할 때 빠지기 쉬운 설명 부족과 기록 누락을 보완하고, 팀의 학습 과정을 운영하는 경험을 만들고자 했습니다.',
    carriedForward: '목표·역할·회고를 문서화한 경험이 금융 AI Challenge와 SW 경진대회에서 팀 실험을 관리하는 방식으로 이어졌습니다.',
    result: '우수상 · 팀장',
    url: 'https://ctlt.inha.ac.kr/',
  },
]

export const competitionActivities: Activity[] = [
  {
    title: 'CJ대한통운 미래기술챌린지 2026',
    subtitle: 'CCTV 영상 기반 화물 객체 분석',
    period: '2026.06 — 07',
    role: '추론 파이프라인 설계·구현',
    summary: '카메라 파라미터 없는 단일 CCTV에서 박스 개수와 3D 크기를 복원하는 문제를 단계별 측정 파이프라인으로 해결했습니다.',
    points: ['Segmentation·Tracking·Pose 결합', '컨베이어 레일 기반 실제 단위 보정', 'ONNX 평가 환경 구성'],
    purpose: '생성형 AI 중심 경험에서 벗어나 실제 영상과 물리 단위를 다루는 측정 문제로 문제 해결 범위를 넓혔습니다.',
    carriedForward: '관측값·보정·추론·조립을 분리한 경험은 이후 RAG·MCP 시스템에서도 실패 단계를 격리하는 설계 기준이 됐습니다.',
    result: '최종 리더보드 4위',
    url: 'https://www.cjlogistics.com/ko/newsroom/news/NR_00001351',
  },
  {
    title: '2025 금융 AI Challenge : 금융 AI 모델 경쟁',
    subtitle: '금융 분야 생성형 AI 모델 성능 경진',
    period: '2025.07 — 09',
    role: '팀장 · 검색 파이프라인 총괄',
    summary: '최신성과 근거가 중요한 금융 보안 질의응답에서 SFT 대신 RAG를 선택하고 검색 실패 중심으로 파이프라인을 개선했습니다.',
    points: ['Query Augmentation', '2-stage retrieval & re-ranking', '실험 이력과 설계 의도 문서화'],
    purpose: '한솔 프로젝트에서 확인한 긴 문맥의 노이즈를 생성 모델이 아니라 검색 품질 관점에서 다시 해결하고자 했습니다.',
    carriedForward: '질문 증강과 재정렬 경험이 VisionChef의 레시피 검색과 공공 문서 RAG의 검색 평가 기반으로 이어졌습니다.',
    result: 'Private 6위 / 283팀',
    url: 'https://www.dacon.io/competitions/official/236527/overview/description',
  },
  {
    title: '2025 SW중심대학 디지털 경진대회',
    subtitle: 'AI부문 · 생성형 AI(LLM)와 인간: 텍스트 판별 챌린지',
    period: '2025',
    role: '팀장',
    summary: '생성형 AI 텍스트와 인간 작성 텍스트를 구분하는 문제에서 데이터 분석과 검증 구조를 팀 단위로 운영했습니다.',
    points: ['텍스트 분포와 오류 사례 분석', '모델 검증 기준 정리', '팀 실험 일정과 제출 관리'],
    purpose: '개인 구현을 넘어 여러 실험을 같은 기준으로 비교하고 팀 단위로 제출하는 경험을 보강했습니다.',
    carriedForward: '오류 사례와 실험 일정을 함께 관리한 경험을 금융 AI Challenge 팀장 역할과 스미싱 벤치마크 설계에 적용했습니다.',
    result: '58위 / 271팀',
    url: 'https://www.swuniv.kr/60/?bmode=view&idx=142839360',
  },
  {
    title: '한솔데코 시즌3 생성 AI 경진대회',
    subtitle: '건설공사 사고 예방 및 대응책 생성',
    period: '2025.02 — 03',
    role: '1인 개발',
    summary: '긴 사고 문맥을 유사 QA 검색과 VARCO 초안 생성으로 분리하고, Qwen 검수 모델을 후속 통합 경계로 설계했습니다.',
    points: ['ko-sbert·FAISS 상위 3개 유사 QA 검색', 'VARCO-8B RetrievalQA 실행', 'Qwen2.5-14B 8-bit 로더 구현 · main 미연결'],
    purpose: '생성형 AI를 처음부터 완성된 답변기로 보지 않고, 실패 원인을 추적할 수 있는 소프트웨어 파이프라인으로 다뤄보고자 했습니다.',
    carriedForward: '공개 실행 경로와 설계 의도를 구분한 경험이 금융 RAG에서 검색 단계별 검증 기준을 세우는 계기가 됐습니다.',
    result: 'Private 12위 / 24팀',
    url: 'https://dacon.io/competitions/official/236455/overview/description',
  },
  {
    title: '2026 성남시 공공데이터 활용 시각화 경진대회',
    subtitle: '성남시 생활상권 성장 잠재력 분석 및 XAI',
    period: '2026.03 — 05',
    role: '팀장 · LLM 연동',
    summary: '현재 활성도가 아닌 미래 성장 조건을 다섯 관점으로 정의하고 지도와 로컬 LLM 해설을 제공했습니다.',
    points: ['PCA·엔트로피 가중치 비교 후 PCA 선택', 'K-means 지역 유형화', 'GeoJSON 지도와 근거 제한형 로컬 LLM 설명'],
    purpose: '스미싱 연구에서 만든 설명 가능성의 원칙을 공공 데이터 분석과 의사결정 화면에 적용하고자 했습니다.',
    carriedForward: '지표의 출처와 의미를 자연어로 번역한 경험이 행정 문서를 근거로 설명하는 공공 RAG의 문제의식으로 이어졌습니다.',
    url: 'https://data.seongnam.go.kr',
  },
]
