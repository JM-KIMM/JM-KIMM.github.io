export type JourneyChapter = {
  period: string
  stage: string
  title: string
  body: string
  handoff: string
  current?: boolean
}

export const journeyChapters: JourneyChapter[] = [
  {
    period: '2024-2',
    stage: '01 · COLLABORATE',
    title: '인하-동동(同動) · 팀장',
    body: '학습공동체 팀장으로 목표와 역할을 정하고 일정, 주차별 활동과 회고를 관리했습니다. 팀이 같은 기준으로 학습 과정을 이어간 결과 팀원 전원이 A+를 받았습니다.',
    handoff: '팀 운영에서 만든 기록 방식을 이후 프로젝트와 다음 학기의 팀원 경험에 이어갔습니다.',
  },
  {
    period: '2025.02 — 03',
    stage: '02 · COMPRESS CONTEXT',
    title: '한솔데코 시즌3 생성 AI 경진대회',
    body: '한 번에 전달할 수 있는 컨텍스트가 제한된 환경에서 유사 사례 3건을 검색하고, VARCO-8B가 근거를 요약·압축한 뒤 Qwen2.5-14B가 최종 대응책을 생성하도록 두 LLM을 연결했습니다.',
    handoff: '검색과 생성을 분리한 경험을 더 정교한 검색 품질과 재정렬 문제로 확장했습니다.',
  },
  {
    period: '2025-1',
    stage: '03 · EXPLAIN TOGETHER',
    title: '인하-동동(同動) · 팀원',
    body: '두 번째 학기에는 팀원으로 참여해 학습 내용을 서로 설명하고 풀이를 피드백하는 협업 방식에 집중했으며 우수상을 받았습니다.',
    handoff: '운영자와 참여자 두 역할에서 익힌 협업 방식을 이후 알고리즘 학습과 팀 프로젝트에 이어갔습니다.',
  },
  {
    period: '2025.06 — 2026.03',
    stage: '04 · STRUCTURE EVIDENCE',
    title: '한국어 스미싱 탐지 연구',
    body: '18,270개 한국어 메시지를 대상으로 위험 여부만 분류하지 않고 판단 근거까지 함께 학습할 수 있는 데이터 구조와 평가 절차를 설계했습니다.',
    handoff: '정답뿐 아니라 판단의 근거를 다루는 관점이 금융 문서 검색과 XAI 설계로 이어졌습니다.',
  },
  {
    period: '2025.06.22 — 07.06',
    stage: '05 · BUILD BASICS',
    title: 'INHA 코드트리 코딩 캠프',
    body: '자료구조와 알고리즘을 문제 유형별로 반복하며 풀이 근거, 시간복잡도와 예외 케이스를 구현 전에 확인하는 순서를 익혔습니다.',
    handoff: '복잡한 시스템을 단계로 나누고 각 단계의 실패 조건을 확인하는 구현 방식의 기초가 됐습니다.',
  },
  {
    period: '2025.07.01 — 08.12',
    stage: '06 · VALIDATE AS A TEAM',
    title: '2025 SW중심대학 디지털 경진대회',
    body: '생성 AI 텍스트와 사람이 작성한 텍스트를 구분하는 과제에서 데이터 분포와 오류 사례를 분석하고, 팀 단위로 실험 조건과 제출 결과를 관리했습니다.',
    handoff: '여러 실험을 같은 기준으로 비교한 경험을 이후 경진대회의 평가 설계에 적용했습니다.',
  },
  {
    period: '2025.07 — 09',
    stage: '07 · RERANK EVIDENCE',
    title: '2025 금융 AI Challenge',
    body: '10,913개 법률 문서 청크를 FAISS로 넓게 검색한 뒤 BGE Cross-Encoder 리랭커로 다시 정렬했습니다. 모델이 기억한 답보다 최신 근거를 찾아 제시하는 구조에 집중해 283팀 중 Private 6위를 기록했습니다.',
    handoff: '검색 정확도와 근거 제시를 사용자가 이해할 수 있는 설명으로 연결하기 시작했습니다.',
  },
  {
    period: '2026',
    stage: '08 · OPTIMIZE DELIVERY',
    title: 'LG Aimers 8기',
    body: 'EXAONE 4.0 1.2B 기반 경량화 과제를 중심으로 정확도, 모델 크기와 추론 비용 사이의 trade-off를 학습했습니다.',
    handoff: '제한된 자원에서 모델을 운용하는 기준이 실제 추론 파이프라인 설계의 기반이 됐습니다.',
  },
  {
    period: '2026.02.23 — 02.24',
    stage: '09 · SEE THE HARDWARE',
    title: '제6회 Smart Semiconductor Academy',
    body: '생성형 AI와 반도체 AI 응용기술 과정을 통해 모델을 실제로 구동하는 메모리, 연산량과 하드웨어 제약을 함께 살펴봤습니다.',
    handoff: '성능과 실행 비용을 함께 보는 관점을 모델 경량화와 제한된 GPU 환경에 적용했습니다.',
  },
  {
    period: '2026.03 — 05',
    stage: '10 · EXPLAIN THE RESULT',
    title: '성남시 공공데이터 활용 시각화 경진대회',
    body: '50개 행정동의 수치와 유형을 대시보드에서 비교하고, 처음 보는 사람도 의미를 이해할 수 있도록 로컬 LLM이 분석 근거를 쉬운 문장으로 설명하게 했습니다.',
    handoff: '분석 결과를 사람이 행동할 수 있는 설명으로 바꾸는 경험을 도구 실행형 AI로 확장했습니다.',
  },
  {
    period: '2026.03 — 06',
    stage: '11 · CONTROL ACTIONS',
    title: 'VisionChef · 인공지능 종합설계',
    body: '조리 상황을 검색 결과와 연결하고 LLM이 허용된 다섯 개 도구만 호출하도록 실행 범위를 제한한 RAG 에이전트를 구현해 장려상을 받았습니다.',
    handoff: '설명 생성에 머물지 않고 안전한 도구 호출과 실행 경계를 설계하는 단계로 나아갔습니다.',
  },
  {
    period: '2026.06 — 07',
    stage: '12 · MEASURE THE PHYSICAL',
    title: 'CJ대한통운 미래기술챌린지 2026',
    body: '팀으로 직접 라벨링한 영상 데이터에서 박스와 팔레트를 분리하고 Tracking, Pose, 치수 보정을 잇는 단계형 CV 파이프라인을 구축해 최종 리더보드 4위를 기록했습니다.',
    handoff: '데이터 품질과 단계별 오차를 추적하는 경험이 복합 AI 시스템을 점검하는 방식으로 이어졌습니다.',
  },
  {
    period: '2026.06.22 — 09.02',
    stage: '13 · TEST ON INDUSTRY DATA',
    title: 'LG Aimers 9기',
    body: 'AI Essential Course와 산업 데이터 기반 온라인 해커톤을 끝까지 수행하며 모델 선택, 검증과 제출 과정을 실제 문제 흐름에 맞춰 운영했습니다.',
    handoff: '정해진 평가 환경에서 실험을 재현하고 결과를 관리하는 기준을 강화했습니다.',
  },
  {
    period: '2026.07 — 08',
    stage: '14 · PREDICT THE NEXT STATE',
    title: '2026 인하 인공지능 챌린지 · INHA World Model',
    body: '16개 관절 명령으로 로봇의 미래 영상을 생성하는 action-conditioned world model을 16GB 환경에 맞춰 학습·추론하고 우수상을 받았습니다.',
    handoff: '불완전한 평가지표와 제한된 자원 안에서 시스템 전체를 검증하는 경험을 얻었습니다.',
  },
  {
    period: '2026.09.01 —',
    stage: '15 · APPLY IN THE FIELD',
    title: '행정안전부 인턴',
    body: '공공 업무를 위한 RAG와 MCP 구축을 담당하고 있습니다.',
    handoff: '문서 검색, 근거 제시와 업무 도구 연결을 실제 행정 환경에서 다루고 있습니다.',
    current: true,
  },
]
