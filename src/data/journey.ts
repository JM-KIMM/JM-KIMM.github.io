export type JourneyLink = {
  label: string
  path: string
}

export type JourneyChapter = {
  period: string
  stage: string
  title: string
  body: string
  handoff: string
  links: JourneyLink[]
  upcoming?: boolean
}

export const journeyChapters: JourneyChapter[] = [
  {
    period: '2024 — 2025.03',
    stage: '01 · BREAK DOWN',
    title: '복잡한 문제를 작게 나누는 법부터 배웠습니다.',
    body: '인하-동동에서 목표·역할·회고를 기록했고 코드트리 캠프에서는 풀이 근거와 예외 케이스를 먼저 확인했습니다. 한솔 대회에서는 제한된 컨텍스트를 그대로 넣지 않고 유사 사례 검색, 첫 번째 LLM의 요약·압축, 두 번째 LLM의 최종 생성으로 나눴습니다.',
    handoff: '긴 문맥을 단계로 나눈 경험을 다음 프로젝트에서는 검색 품질과 리랭킹 문제로 확장했습니다.',
    links: [
      { label: '인하-동동', path: '/activities' },
      { label: '코드트리 캠프', path: '/activities' },
      { label: 'Construction Safety RAG', path: '/projects/hansol-2pass' },
    ],
  },
  {
    period: '2025.06 — 2026.03',
    stage: '02 · FIND EVIDENCE',
    title: '좋은 답보다 답을 지탱하는 근거를 먼저 봤습니다.',
    body: '금융 AI Challenge에서는 법률을 모델에 외우게 하지 않고 10,913개 문서 청크를 FAISS로 넓게 찾은 뒤 BGE Cross-Encoder 리랭커로 다시 정렬했습니다. 스미싱 연구에서는 근거를 찾는 단계를 넘어, 위험하다고 판단한 이유 자체를 18,270개 메시지의 데이터 구조로 만들었습니다.',
    handoff: '검색된 근거를 점수에 남기지 않고 사용자가 이해할 수 있는 설명으로 옮겼습니다.',
    links: [
      { label: 'Financial RAG', path: '/projects/financial-rag' },
      { label: 'Smishing Research', path: '/projects/undergraduate-research-smishing' },
    ],
  },
  {
    period: '2026.03 — 06',
    stage: '03 · TURN INTO ACTION',
    title: '설명하는 AI에서 상태를 바꾸는 AI로 확장했습니다.',
    body: '성남 XAI에서는 50개 행정동의 수치와 유형을 대시보드로 비교하고, 처음 보는 사람도 의미를 이해하도록 LLM이 근거를 쉬운 문장으로 바꾸게 했습니다. VisionChef에서는 같은 원칙으로 검색 결과를 조리 안내에 연결하고, LLM이 허용된 다섯 개 도구만 실행하도록 행동 범위를 설계했습니다.',
    handoff: '근거를 읽는 모델이 화면과 도구를 안전하게 바꾸려면 실행 경계가 필요하다는 기준을 얻었습니다.',
    links: [
      { label: 'Seongnam XAI', path: '/projects/seongnam-xai' },
      { label: 'VisionChef', path: '/projects/visionchef' },
    ],
  },
  {
    period: '2026.02 — 09',
    stage: '04 · WORK WITH CONSTRAINTS',
    title: '현실의 제약을 모델 밖의 설계 문제로 다뤘습니다.',
    body: 'Smart Semiconductor Academy와 LG Aimers에서 메모리·추론 비용·배포 환경을 함께 봤습니다. CJ에서는 직접 라벨링한 데이터와 단계형 CV 파이프라인으로 4위를 기록했고, INHA World Model에서는 16GB 환경과 불완전한 평가지표 안에서 학습·추론을 최적화해 우수상을 받았습니다.',
    handoff: '모델 성능만큼 데이터, 평가 기준, 실행 환경을 함께 설계해야 한다는 기준을 얻었습니다.',
    links: [
      { label: 'LG Aimers', path: '/activities' },
      { label: 'CJ Logistics', path: '/projects/cj-logistics-3d-box' },
      { label: 'INHA World Model', path: '/projects/inha-world-model' },
    ],
  },
  {
    period: '2026.09.01 —',
    stage: '05 · APPLY IN THE FIELD',
    title: '행정안전부 인턴 · RAG 및 MCP 구축',
    body: '공공 문서 검색과 업무 도구 연결을 실제 행정 환경에서 다루고 있습니다.',
    handoff: '검색 품질, 근거 제시, 도구 호출, 실행 추적을 하나의 업무 시스템에서 검증합니다.',
    links: [],
  },
]
