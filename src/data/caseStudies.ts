export type CaseProof = {
  value: string
  label: string
  note: string
}

export type CaseDecision = {
  label: string
  title: string
  trigger: string
  options: string[]
  choice: string
  rationale: string
  implementation: string[]
  proof?: string
}

export type CaseEvidence = {
  label: string
  image: string
  alt: string
  title: string
  body: string
  source: string
}

export type CaseStudy = {
  cardLine: string
  lede: string
  ownershipNote: string
  brief: {
    problem: string
    response: string
    outcome: string
  }
  proofs: CaseProof[]
  constraints: string[]
  decisions: CaseDecision[]
  system: {
    label: string
    title: string
    body: string
    tech: string
  }[]
  evidence: CaseEvidence[]
  validation: {
    verified: string[]
    boundary: string[]
    next: string[]
  }
  handoff: {
    from: string
    to: string
  }
  resources: {
    label: string
    title: string
    url: string
    external?: boolean
  }[]
}

export const caseStudies: Record<string, CaseStudy> = {
  'undergraduate-research-smishing': {
    cardLine: '한국어 메시지 18,270건에 탐지 라벨과 판단 근거를 함께 설계했습니다.',
    lede: '공개 한국어 데이터의 부족을 채우는 데서 시작해, 모델이 결과뿐 아니라 위험하다고 판단한 이유까지 학습할 수 있는 데이터 구조를 만들었습니다.',
    ownershipNote: '데이터 구조 정의, 벤치마크 설계, EXAONE 학습과 설명형 탐지 데모를 담당했습니다. 공개 GitHub에는 논문 소개와 데이터 링크가 있으며 서비스 구현 코드는 포함돼 있지 않습니다.',
    brief: {
      problem: '정상·스미싱 라벨만 있는 데이터로는 새로운 공격 유형에 대한 판단 근거를 설명하기 어려웠습니다.',
      response: '실제 메시지를 공격 의도와 유도 방식으로 분류하고, 각 문장에 위험 신호를 서술한 explanation 필드를 붙였습니다.',
      outcome: '18,270건 말뭉치에서 ML·DL·생성형 LLM을 같은 기준으로 비교했고, CNN Accuracy 0.9908을 확인했습니다.',
    },
    proofs: [
      { value: '18,270', label: 'KOREAN MESSAGES', note: '정상·스미싱 메시지와 설명 데이터' },
      { value: '0.9908', label: 'CNN ACCURACY', note: '논문 Table 2 기준' },
      { value: '6 families', label: 'BENCHMARK', note: 'CNN부터 생성형 LLM까지 비교' },
      { value: 'Public', label: 'DATASET', note: 'Hugging Face CC BY-NC-SA 4.0' },
    ],
    constraints: [
      '실제 공격 문자는 개인정보와 민감한 URL을 포함할 수 있어 연구 목적의 수집·비식별화 범위를 먼저 정해야 했습니다.',
      '공격 문구가 반복되기 때문에 무작위 분할만 사용하면 유사 문장이 학습과 평가에 함께 들어가 성능이 부풀 수 있습니다.',
      '생성된 설명은 자연스럽더라도 사실과 다른 위험 근거를 덧붙일 수 있어 라벨과 설명을 별도 검수해야 했습니다.',
    ],
    decisions: [
      {
        label: '01 · DATA SCOPE',
        title: '키워드 목록이 아니라 공격이 사용자를 움직이는 방식을 수집 단위로 삼았습니다.',
        trigger: 'URL 유무나 “대출” 같은 단어만으로 분류하면 정상 알림과 새로운 변형 공격을 구분하기 어려웠습니다.',
        options: ['공개 스팸 데이터만 재가공', '키워드 규칙으로 합성 데이터 생성', '실제 사례를 공격 의도별로 구조화'],
        choice: '실제 사례를 수집하고 금융·택배·공공기관·지인 사칭 등 공격 맥락과 유도 방식을 함께 기록했습니다.',
        rationale: '모델이 표면 단어가 아니라 결제 압박, 기관 사칭, 링크 이동 같은 행동 유도 패턴을 학습해야 신규 표현에도 대응할 수 있다고 봤습니다.',
        implementation: ['KISA 연구 목적 이용 절차 확인', '개인정보·식별 정보 마스킹', '정상 메시지와 공격 메시지의 유형 분포 점검'],
      },
      {
        label: '02 · EXPLANATION DATA',
        title: '설명 기능을 UI 문구가 아니라 학습 데이터의 필드로 먼저 설계했습니다.',
        trigger: '분류 점수가 높아도 사용자가 왜 위험한지 이해하지 못하면 링크를 누르지 말아야 할 이유를 전달할 수 없었습니다.',
        options: ['예측 후 규칙 문구 표시', '모델 attention을 근거로 표시', '문장별 판단 근거를 데이터로 구축'],
        choice: 'label 옆에 위험 표현, 사칭 방식, 요구 행동을 자연어로 정리한 explanation을 추가했습니다.',
        rationale: '탐지와 설명을 같은 입력에서 학습하면 서비스마다 임의의 안내 문구를 붙이는 것보다 일관된 판단 단위를 유지할 수 있습니다.',
        implementation: ['라벨·설명 출력 형식 고정', '공격 의도와 사용자 행동 요구를 분리해 서술', '정상 문자에도 정상으로 판단한 근거 기록'],
      },
      {
        label: '03 · BENCHMARK',
        title: '하나의 최고 점수보다 모델 계열별 강점과 비용을 같은 표에서 비교했습니다.',
        trigger: '작은 분류 모델과 설명을 생성하는 LLM은 목적과 계산 비용이 다르기 때문에 Accuracy 하나로 우열을 정하기 어려웠습니다.',
        options: ['LLM만 평가', '기존 분류기만 평가', '전통 모델·딥러닝·생성 모델을 동일 분할에서 비교'],
        choice: 'FastText, CNN, KcELECTRA, EXAONE, Gemini, ChatGPT 계열을 동일 데이터에서 비교했습니다.',
        rationale: '빠른 1차 탐지는 작은 모델, 설명 생성은 LLM처럼 역할을 나눌 가능성을 확인하기 위해서였습니다.',
        implementation: ['Accuracy와 Macro F1 병행', '정상·스미싱 클래스별 Precision·Recall 확인', 'EXAONE은 제한된 자원에서 SFT·QLoRA 적용'],
        proof: '논문 Table 2: CNN 0.9908, EXAONE 0.9261, ChatGPT 0.7079 Accuracy',
      },
    ],
    system: [
      { label: 'COLLECT', title: '실제 메시지 정제', body: '연구 범위를 확인하고 개인정보와 식별 가능한 문자열을 정리했습니다.', tech: 'KISA procedure · masking' },
      { label: 'ANNOTATE', title: '라벨과 설명 결합', body: '정상·스미싱 여부와 함께 공격 의도, 위험 표현, 요구 행동을 기록했습니다.', tech: 'label · explanation · type' },
      { label: 'BENCHMARK', title: '모델 계열 교차 비교', body: '작은 분류기부터 생성형 모델까지 같은 분할과 지표로 평가했습니다.', tech: 'CNN · KcELECTRA · EXAONE' },
      { label: 'DEMO', title: '설명형 탐지 화면', body: '입력 문자의 예측 결과와 위험 근거를 한 응답으로 확인하는 흐름을 검증했습니다.', tech: 'classification · explanation' },
    ],
    evidence: [
      {
        label: 'DATASET DESIGN',
        image: 'assets/project-evidence/smishing-dataset-v2.jpg',
        alt: '스미싱 논문의 explanation data 생성 구조와 메시지 유형 분석',
        title: '메시지를 수집한 뒤 바로 학습시키지 않고, 공격 맥락과 설명 구조를 먼저 정의했습니다.',
        body: '논문은 실제 공격 사례를 도메인 지식과 함께 검토하고 label·explanation·type으로 정리하는 과정을 보여줍니다. 이 구조가 이후 벤치마크와 설명형 탐지 데모의 공통 계약이 됐습니다.',
        source: '첨부 논문 p.3 · Explanation Data 생성 및 데이터셋 분석',
      },
      {
        label: 'BENCHMARK',
        image: 'assets/project-evidence/smishing-benchmark-v2.jpg',
        alt: 'CNN FastText KcELECTRA EXAONE Gemini ChatGPT 벤치마크 표',
        title: '모델 규모가 커질수록 분류 성능이 자동으로 좋아지지는 않았습니다.',
        body: '동일 데이터에서 CNN이 가장 높은 Accuracy를 기록했고, 별도 학습 없는 생성형 모델은 상대적으로 낮았습니다. 이 결과는 빠른 탐지와 설명 생성을 서로 다른 모델에 맡기는 후속 설계의 근거가 됐습니다.',
        source: '첨부 논문 p.4 · Table 2 Performance across Metrics',
      },
    ],
    validation: {
      verified: ['18,270건 데이터셋과 모델별 지표를 논문 표로 공개했습니다.', 'Hugging Face에 한국어 text-classification 데이터셋을 배포했습니다.', '분류 결과와 설명을 함께 보여주는 데모 흐름을 발표 자료로 검증했습니다.'],
      boundary: ['공개 GitHub 저장소에는 실행 가능한 서비스 코드가 아니라 논문 소개와 데이터 링크만 있습니다.', '현재 Hugging Face Dataset Viewer는 일부 열의 형식 불일치로 전체 미리보기가 실패합니다.', '무작위 분할 성능만으로 신규 공격 캠페인에 대한 일반화를 보장할 수 없습니다.'],
      next: ['시점·공격 캠페인 단위 분할로 데이터 누수를 다시 측정합니다.', '설명 문장을 사람 검수하고 근거 span과 연결합니다.', '확신도가 낮은 메시지는 단정하지 않고 보류하는 정책을 추가합니다.'],
    },
    handoff: {
      from: '금융 RAG에서 “답보다 근거 선택이 먼저”라는 문제를 경험했습니다.',
      to: '설명 필드를 직접 설계한 경험은 성남 XAI의 근거 payload와 공공 문서 RAG의 인용 구조로 이어졌습니다.',
    },
    resources: [
      { label: 'PAPER', title: '한국어 스미싱 데이터셋 및 벤치마크 논문', url: 'docs/smishing-paper.pdf' },
      { label: 'DATASET', title: 'Korean Smishing Message Dataset', url: 'https://huggingface.co/datasets/jmjmjm3/kor-smishing-message', external: true },
      { label: 'REPOSITORY', title: 'Research introduction repository', url: 'https://github.com/JM-KIMM/K-smishing_Introduce', external: true },
    ],
  },

  'cj-logistics-3d-box': {
    cardLine: '카메라 정보 없이 레일 62.3cm를 기준으로 박스의 수량과 3D 크기를 복원했습니다.',
    lede: '단일 CCTV의 픽셀을 곧바로 센티미터로 회귀하지 않고, 화면 안에서 확인할 수 있는 기하 단서를 측정·보정·추적하는 파이프라인으로 문제를 다시 구성했습니다.',
    ownershipNote: '1인 개발로 학습·추론 파이프라인, 모델 변환, 오프라인 평가 패키지를 설계하고 구현했습니다.',
    brief: {
      problem: '카메라 파라미터가 없고 박스가 겹치며, 같은 물체도 화면 위치에 따라 픽셀 크기가 달라졌습니다.',
      response: '레일 기반 위치별 스케일, 시간축 추적, 8-corner pose, 기하·회귀 앙상블을 단계별로 분리했습니다.',
      outcome: '오프라인 ONNX 평가 환경에서 전체 파이프라인을 실행해 최종 리더보드 4위를 기록했습니다.',
    },
    proofs: [
      { value: '4th', label: 'FINAL LEADERBOARD', note: 'CJ대한통운 미래기술챌린지 2026' },
      { value: '62.3cm', label: 'SCENE REFERENCE', note: '컨베이어 레일의 실제 폭' },
      { value: '31D', label: 'COUNT FEATURES', note: '시간축·줌·역방향 추적 통계' },
      { value: '27D', label: 'SIZE FEATURES', note: '기하 17 + pose 7 + 수평 3' },
    ],
    constraints: [
      '추론 시 카메라 intrinsic·extrinsic과 별도 3D 센서를 사용할 수 없었습니다.',
      '가림, 원거리 소실, 컨베이어 속도 변화 때문에 프레임별 검출 수가 실제 박스 수와 달랐습니다.',
      '네트워크가 차단된 A100 평가 환경에서 제한된 패키지와 ONNX 모델만으로 끝까지 실행돼야 했습니다.',
    ],
    decisions: [
      {
        label: '01 · CALIBRATION',
        title: '카메라를 추정하는 대신 모든 영상에 보이는 레일을 이동식 기준자로 사용했습니다.',
        trigger: '전역 px/cm 비율은 원근 때문에 가까운 박스를 작게, 먼 박스를 크게 측정하는 구조적 오차를 만들었습니다.',
        options: ['단일 전역 스케일', '카메라 파라미터 추정', '레일 폭으로 위치별 스케일 복원'],
        choice: '실제 폭 62.3cm인 레일의 양쪽 경계를 누적 마스크에서 찾고 loc_scale(x, y)를 계산했습니다.',
        rationale: '평가 영상마다 공통으로 등장하고 실제 크기를 아는 물체를 사용하면 카메라 정보 없이도 화면 위치별 단위를 복원할 수 있었습니다.',
        implementation: ['YOLO11l-seg로 box·rail 분할', 'Huber line fitting으로 레일 경계 안정화', '화면 좌표별 rail pixel width를 cm로 변환'],
      },
      {
        label: '02 · COUNTING',
        title: '검출 개수와 실제 통과 개수를 분리했습니다.',
        trigger: '가림으로 트랙이 끊기거나 원거리 박스를 놓치면 프레임별 검출 합계가 실제 개수와 크게 달라졌습니다.',
        options: ['최대 검출 수 사용', 'tracking ID 수 사용', '시간축 통계를 회귀해 보정'],
        choice: 'stride-5 통계, 원거리 2배 확대, 역방향 추적을 31차원 특징으로 만들고 Ridge로 최종 수량을 보정했습니다.',
        rationale: '어느 한 트래커의 ID를 정답으로 두기보다 서로 다른 실패 양상을 가진 관측값을 결합하는 편이 가림에 안정적이었습니다.',
        implementation: ['constant-velocity IoU tracking', '진행 방향·거리·크기 변화 기반 fallback', 'forward·reverse track 통계 결합'],
        proof: '학습 스크립트에 GroupKFold 5 count MAE와 ONNX parity < 0.01 검증 게이트를 정의했습니다.',
      },
      {
        label: '03 · 3D SIZE',
        title: '단안 깊이를 한 번에 맞히지 않고 서로 다른 관측 단서를 조립했습니다.',
        trigger: '바운딩 박스만으로는 회전과 가림, 깊이축 길이를 구분하기 어려웠습니다.',
        options: ['bbox 3변 회귀', '단일 pose 모델', '실루엣·pose·시간 변화 결합'],
        choice: '마스크 기하, 8개 꼭짓점, temporal parallax, DIRD 깊이 보정을 27차원 특징으로 구성했습니다.',
        rationale: '각 단서가 실패하는 조건이 달라 중간 측정값을 남기고 결합하면 오차의 원인을 추적할 수 있었습니다.',
        implementation: ['YOLO11l-pose 8-corner 측정', '가려진 꼭짓점 제외와 여러 프레임 중앙값', '방향 분해 깊이 보정 DIRD'],
      },
      {
        label: '04 · DELIVERY',
        title: '학습과 제출 추론이 같은 특징 계산을 사용하도록 재현 경계를 고정했습니다.',
        trigger: '노트북에서 좋은 결과가 나와도 제출 main.py에서 전처리 순서나 dtype이 달라지면 오프라인 평가가 실패했습니다.',
        options: ['Python 모델 그대로 제출', '단일 end-to-end 모델', '단계별 모델을 ONNX로 고정'],
        choice: 'Segmentation·Pose·Count·Size 모델을 ONNX로 변환하고 학습 스크립트가 main.py의 공통 함수를 재사용하게 했습니다.',
        rationale: '복잡한 파이프라인일수록 모델 성능보다 학습–추론 parity와 장애 시 fallback이 최종 제출의 신뢰도를 좌우했습니다.',
        implementation: ['ONNX opset 17 export', '원본 모델과 ONNX 출력 parity gate', '모델 누락 시 기하 기반 fallback'],
      },
    ],
    system: [
      { label: '01', title: 'Segment', body: '박스와 레일 마스크를 분리합니다.', tech: 'YOLO11l-seg · ONNX' },
      { label: '02', title: 'Calibrate', body: '레일 폭으로 위치별 px/cm를 복원합니다.', tech: 'Huber line · loc_scale' },
      { label: '03', title: 'Track', body: '가림 전후의 동일 박스를 시간축으로 연결합니다.', tech: 'IoU · velocity · fallback' },
      { label: '04', title: 'Count', body: '추적 통계를 31차원으로 모아 실제 수량을 보정합니다.', tech: 'Ridge · reverse track' },
      { label: '05', title: 'Measure', body: '실루엣과 꼭짓점으로 27차원 크기 특징을 만듭니다.', tech: 'Pose · parallax · DIRD' },
      { label: '06', title: 'Assemble', body: '선형·비선형 분기를 shape-volume 공간에서 결합합니다.', tech: 'Huber · GBR · TabM' },
    ],
    evidence: [
      {
        label: 'CALIBRATION',
        image: 'assets/project-evidence/cj-calibration-v2.jpg',
        alt: '컨베이어 레일을 이용한 위치별 픽셀 센티미터 보정',
        title: '같은 레일도 화면 위치마다 다른 폭으로 보인다는 사실을 보정식의 출발점으로 삼았습니다.',
        body: '원거리와 근거리의 레일 폭 차이를 확인한 뒤 양쪽 레일 경계를 함수로 만들었습니다. 박스의 중심 좌표를 넣으면 해당 위치의 px/cm가 반환되므로 모든 후속 측정이 같은 실제 단위를 사용합니다.',
        source: '첨부 알고리즘 해설 · Rail-based metric calibration',
      },
      {
        label: 'FRAME INSPECTION',
        image: 'assets/project-evidence/cj-size-inference.jpg',
        alt: '박스 분할과 8개 꼭짓점 기반 실제 크기 측정 결과',
        title: '분할·레일·꼭짓점 결과를 실제 프레임에 겹쳐 중간 측정값을 검증했습니다.',
        body: '왼쪽은 박스와 레일 분할 및 원거리 재탐지 구간, 오른쪽은 8-corner pose에서 계산한 W·D·H입니다. 최종 점수만 보는 대신 어떤 관측이 잘못됐는지 프레임 단위로 확인했습니다.',
        source: 'GitHub inference artifact · segmentation, rail scale, 8-corner measurement',
      },
      {
        label: 'ASSEMBLY',
        image: 'assets/project-evidence/cj-scoring-v2.jpg',
        alt: '기하 측정과 회귀 앙상블을 결합한 크기 추정 구조',
        title: '절대 크기와 박스 형태를 분리한 뒤 서로 다른 회귀 분기를 결합했습니다.',
        body: '세 변을 직접 독립 회귀하지 않고 부피 스케일과 두 비율로 재매개변수화했습니다. Huber+GBR 분기와 TabM 분기를 50:50으로 결합해 선형적인 기하 관계와 잔여 비선형 오차를 나눠 처리했습니다.',
        source: '첨부 알고리즘 해설 · shape-volume encoding and ensemble',
      },
    ],
    validation: {
      verified: ['오프라인 ONNX 평가 환경에서 end-to-end 추론을 완료했습니다.', '학습 스크립트에 count·size 교차검증과 ONNX parity 기준을 남겼습니다.', '최종 리더보드 4위로 파이프라인의 상대 성능을 확인했습니다.'],
      boundary: ['레일이 충분히 보이고 카메라가 고정돼 있다는 가정에 의존합니다.', '학습 데이터에서 적합한 DIRD 상수는 새로운 카메라 시점에서 다시 검증해야 합니다.', '최종 순위는 전체 시스템 성능이며 각 단계의 독립적인 현장 정확도를 의미하지 않습니다.'],
      next: ['새 카메라에서 레일 보정만 재수행하는 전이 실험을 설계합니다.', '단계별 오차 기여도와 불확실성을 기록해 품질 게이트를 만듭니다.', '레일 소실·카메라 흔들림을 자동 감지해 측정을 보류하는 정책을 추가합니다.'],
    },
    handoff: {
      from: '코드트리와 생성형 AI 프로젝트에서 익힌 “문제를 단계로 나누고 중간 결과를 남기는 방식”을 물리 측정 문제로 확장했습니다.',
      to: '관측·보정·추론·조립의 경계를 나눈 경험은 이후 RAG·MCP에서도 검색 오류와 도구 실행 오류를 분리하는 기준이 됐습니다.',
    },
    resources: [
      { label: 'REPOSITORY', title: 'CJ Challenge CCTV', url: 'https://github.com/JM-KIMM/CJ-Challenge-CCTV', external: true },
      { label: 'ALGORITHM NOTE', title: '알고리즘 해설 문서', url: 'docs/cj-algorithm-note.html' },
      { label: 'OFFICIAL', title: 'CJ대한통운 미래기술챌린지 2026', url: 'https://www.cjlogistics.com/ko/newsroom/news/NR_00001351', external: true },
    ],
  },

  'financial-rag': {
    cardLine: '10,913개 금융·보안 문서 청크를 두 단계 검색으로 좁혀 283팀 중 6위를 기록했습니다.',
    lede: '생성 모델을 더 크게 만드는 대신, 서로 다른 형식의 금융 문서가 질문에 도달하는 경로를 먼저 고정하고 검색 실패 사례를 기준으로 개선했습니다.',
    ownershipNote: '4인 팀의 팀장으로 데이터 수집·정규화와 검색 파이프라인을 총괄했습니다. 대회 제출 자료와 공개 저장소의 재현용 코드 범위를 구분해 설명합니다.',
    brief: {
      problem: '법률·판례·보안 지식은 계속 바뀌고 문서 형식도 달라 모델의 파라미터만으로 최신성과 출처를 보장하기 어려웠습니다.',
      response: '질문 증강, 넓은 벡터 검색, 임계값 필터, Cross-Encoder 재정렬을 분리해 recall과 precision을 따로 조정했습니다.',
      outcome: '515개 평가 질문을 처리하는 오프라인 파이프라인으로 Private 6위 / 283팀을 기록했습니다.',
    },
    proofs: [
      { value: '6 / 283', label: 'PRIVATE RANK', note: '2025 금융 AI Challenge' },
      { value: '10,913', label: 'DOCUMENT CHUNKS', note: '법률·판례·Wikipedia 통합 코퍼스' },
      { value: 'Top 50 → 5', label: 'RETRIEVAL', note: '후보 회수 후 정밀 재정렬' },
      { value: '515', label: 'TEST QUESTIONS', note: '공개 저장소 test.csv 기준' },
    ],
    constraints: [
      '원격 API 없이 RTX 4090 24GB 환경에서 제한 시간 안에 전체 질문을 재현해야 했습니다.',
      'TIFF 판례, 법률 PDF, Wikipedia 문서가 서로 다른 노이즈와 메타데이터 구조를 가졌습니다.',
      '객관식·주관식의 출력 형식이 달라 검색이 맞아도 생성 형식 오류로 점수를 잃을 수 있었습니다.',
    ],
    decisions: [
      {
        label: '01 · RAG OVER SFT',
        title: '지식을 외우게 하지 않고 답변 시점에 근거를 찾게 했습니다.',
        trigger: '새 법률과 문서를 반영할 때마다 재학습하면 비용이 크고 어떤 문서를 근거로 답했는지 추적하기 어려웠습니다.',
        options: ['도메인 SFT', '긴 프롬프트에 전체 문서 입력', '외부 코퍼스 기반 RAG'],
        choice: 'A.X-4.0-Light를 생성기로 고정하고 품질 개선 예산을 문서 처리와 검색 계층에 집중했습니다.',
        rationale: '대회 제약 안에서 최신 문서를 교체할 수 있고, 검색 결과를 별도로 검사할 수 있는 구조가 더 재현 가능했습니다.',
        implementation: ['생성 모델 단일화', '검색 청크와 source 메타데이터 분리', '16,384 토큰 한도에 맞춘 컨텍스트 조립'],
      },
      {
        label: '02 · CORPUS',
        title: '문서 형식을 없애되 출처와 조항 맥락은 남겼습니다.',
        trigger: 'OCR 노이즈, PDF 페이지 머리말, 짧게 잘린 조항이 검색 결과 상단을 차지했습니다.',
        options: ['원문 전체를 그대로 청킹', '문서별 별도 인덱스', '공통 스키마로 정규화 후 통합'],
        choice: 'TIFF OCR, PDF 정제, Wikipedia 필터링을 거쳐 10,913개 청크로 통합했습니다.',
        rationale: '검색 모델이 파일 형식의 차이가 아니라 질문과 내용의 관련성을 비교하도록 만들되, 답변 검증에 필요한 source는 유지했습니다.',
        implementation: ['법률 9,889개 청크', '판례 의미 단위 청크', '금융보안 Wikipedia 914개 청크'],
      },
      {
        label: '03 · TWO-STAGE RETRIEVAL',
        title: '넓게 찾는 단계와 정확하게 고르는 단계를 같은 모델에 맡기지 않았습니다.',
        trigger: '짧고 모호한 질문은 특정 단어가 검색을 지배해 정답 문서가 후보에 들어오지 않거나, 비슷한 조항이 너무 많이 남았습니다.',
        options: ['벡터 Top-K만 사용', 'BM25만 사용', '질문 증강 + vector recall + Cross-Encoder precision'],
        choice: '원문과 증강 질문으로 최대 50개를 회수한 뒤 질문–문단 쌍을 재정렬해 5개 이하만 생성기에 전달했습니다.',
        rationale: '1차 검색은 정답 누락을 줄이고, 2차 검색은 의미가 비슷하지만 답이 아닌 문단을 제거하도록 목표를 분리했습니다.',
        implementation: ['Arctic Embed 한국어 임베딩', 'FAISS IndexFlatIP', 'BGE Cross-Encoder reranker'],
        proof: '대회 발표 자료 기준 cosine 0.5, reranker 0.85, final Top-N ≤ 5를 실험 설정으로 사용했습니다.',
      },
      {
        label: '04 · OUTPUT CONTRACT',
        title: '검색 컨텍스트와 답변 형식을 별도의 계약으로 관리했습니다.',
        trigger: '관련 문서를 찾았어도 객관식 번호 외 문장을 덧붙이거나 주관식 답변이 장황해 평가 포맷을 벗어났습니다.',
        options: ['하나의 범용 프롬프트', '후처리 정규식만 사용', '질문 유형별 템플릿 분리'],
        choice: '객관식은 선택지 번호, 주관식은 근거 기반 단문으로 출력 계약을 나눴습니다.',
        rationale: '생성 모델의 자유도를 줄여 검색 실험과 출력 형식 실험이 서로 영향을 덜 주도록 했습니다.',
        implementation: ['질문 유형 감지', '역할·금지 문구·출력 길이 명시', '중복 청크 제거 후 컨텍스트 조립'],
      },
    ],
    system: [
      { label: '01', title: 'Normalize', body: 'TIFF·PDF·웹 문서를 공통 청크 스키마로 변환합니다.', tech: 'OCR · PDF parse · metadata' },
      { label: '02', title: 'Augment', body: '원문 질문과 같은 지식을 묻는 보강 질문을 함께 만듭니다.', tech: 'A.X-4.0-Light' },
      { label: '03', title: 'Retrieve', body: '두 질문으로 넓은 후보군을 회수하고 낮은 유사도를 제거합니다.', tech: 'Arctic Embed · FAISS' },
      { label: '04', title: 'Rerank', body: '질문–문단을 함께 읽어 관련성이 높은 5개 이하로 좁힙니다.', tech: 'BGE Cross-Encoder' },
      { label: '05', title: 'Generate', body: '질문 유형별 출력 계약에 맞춰 답변을 생성합니다.', tech: '16K context · typed prompt' },
    ],
    evidence: [
      {
        label: 'SYSTEM ARCHITECTURE',
        image: 'assets/project-evidence/financial-architecture-v2.jpg',
        alt: '질문 증강과 문서 검색을 포함한 금융 RAG 구조',
        title: '질문과 문서가 생성 모델에 도달하는 경로를 먼저 그렸습니다.',
        body: '질문 증강, 청킹, 임베딩, 후보 검색, 답변 생성이 분리돼 있어 어느 단계에서 정답 근거가 사라졌는지 추적할 수 있습니다. 생성 모델을 교체하기 전에 검색 입력과 컨텍스트를 먼저 고정한 이유입니다.',
        source: '첨부 FIN_ai 발표 자료 p.7 · 생성형 AI 모델 구조',
      },
      {
        label: 'RETRIEVAL POLICY',
        image: 'assets/project-evidence/financial-retrieval-v2.jpg',
        alt: '금융 RAG의 질문 증강과 2단계 검색 설정',
        title: 'Recall과 precision을 하나의 Top-K로 동시에 해결하지 않았습니다.',
        body: '원문과 보강 질문으로 후보를 넓게 찾고 cosine 임계값으로 1차 필터링한 뒤, Cross-Encoder가 질문과 문단을 함께 읽어 최종 컨텍스트를 결정합니다. 숫자는 발표 자료에 기록된 대회 제출 설정입니다.',
        source: '첨부 FIN_ai 발표 자료 p.8 · 입력 프롬프팅 및 이중 단계 검색',
      },
      {
        label: 'IMPLEMENTATION EVIDENCE',
        image: 'assets/project-evidence/financial-implementation-v2.jpg',
        alt: '질문 증강 함수와 검색 임계값 코드 스크린샷',
        title: '실험 설정을 코드 상수로 남겨 팀원이 같은 조건을 비교하도록 했습니다.',
        body: '질문 증강 프롬프트와 similarity·reranker 임계값, Top-N을 분리했습니다. 다만 이 이미지는 대회 제출 자료의 코드이며 공개 저장소의 리팩터링된 rag_pipeline.py와 완전히 동일하지 않습니다.',
        source: '첨부 FIN_ai 발표 자료 p.11–12 · 대회 제출 코드 일부',
      },
    ],
    validation: {
      verified: ['공개 저장소에 10,913개 통합 청크와 515개 평가 질문이 남아 있습니다.', '발표 자료에 질문 증강·임계값·리랭킹 설정과 제출 코드 일부가 기록돼 있습니다.', '4인 팀의 팀장으로 Private 6위 / 283팀을 기록했습니다.'],
      boundary: ['공개 src/rag_pipeline.py는 재현용 스캐폴드이며 발표 자료의 Cross-Encoder 구현과 일부 다릅니다.', 'FAISS IndexFlatIP는 정확 검색이며 저장소 README의 O(log n) 표기는 정확하지 않습니다.', '대회 점수만으로 실제 금융 업무의 최신성·인용 검증·권한 통제를 보장할 수 없습니다.'],
      next: ['질문 유형별 동적 Top-K와 임계값을 검증합니다.', '답변 문장과 근거 청크의 대응 관계를 자동 평가합니다.', '문서 버전과 접근 권한을 메타데이터에 포함해 공공 업무 환경으로 확장합니다.'],
    },
    handoff: {
      from: '한솔 프로젝트에서 긴 문맥을 한 번에 생성할 때 근거가 희석되는 문제를 경험했습니다.',
      to: '검색을 recall과 precision 단계로 나눈 경험은 VisionChef의 레시피 검색과 행정안전부 공공 문서 RAG의 직접적인 기반이 됐습니다.',
    },
    resources: [
      { label: 'REPOSITORY', title: 'RAG-based Financial Security LLM', url: 'https://github.com/JM-KIMM/RAG-based-Financial-Security-LLM', external: true },
      { label: 'REPORT', title: '금융 보안 AI 발표 자료', url: 'docs/financial-rag.pdf' },
      { label: 'OFFICIAL', title: '2025 금융 AI Challenge', url: 'https://www.dacon.io/competitions/official/236527/overview/description', external: true },
    ],
  },

  visionchef: {
    cardLine: '요리 흐름 안에서 RAG와 5개 도구를 실행하는 음성 에이전트를 구현했습니다.',
    lede: 'AI 기능을 나열하기보다 손과 시선을 쓰기 어려운 요리 상황을 먼저 정의하고, 재료 인식부터 검색·조리 안내·도구 실행까지 하나의 상태 흐름으로 연결했습니다.',
    ownershipNote: '4인 팀에서 LLM·RAG 모듈을 담당했습니다. CV와 프론트엔드는 팀 결과물이며, 이 페이지에서는 직접 구현한 검색·에이전트 경계를 중심으로 설명합니다.',
    brief: {
      problem: '기존 레시피 서비스는 재료 입력, 검색, 단계 확인을 위해 요리 중 계속 화면을 조작해야 했습니다.',
      response: '탐지 재료를 정규화해 레시피를 검색하고, A.X가 허용된 5개 도구만 최대 3단계 안에서 실행하도록 제한했습니다.',
      outcome: '재료 인식부터 음성 도구 실행까지 5단계 데모를 완성하고 인공지능 종합설계 장려상을 받았습니다.',
    },
    proofs: [
      { value: '5 tools', label: 'AGENT ACTIONS', note: 'timer · video · transcript · recipe · step' },
      { value: '3 max', label: 'AGENT STEPS', note: '무한 호출 방지' },
      { value: '4', label: 'RECIPE OPTIONS', note: 'RAG 결과와 생성 후보 조합' },
      { value: 'Award', label: 'CAPSTONE', note: '인공지능 종합설계 장려상' },
    ],
    constraints: [
      '요리 중에는 손이 젖거나 점유돼 있어 화면 터치와 긴 텍스트 확인을 최소화해야 했습니다.',
      'CV 오검출이 검색 조건으로 전달되면 관련 없는 레시피가 추천되는 연쇄 오류가 발생했습니다.',
      'YouTube·STT·TTS 같은 외부 기능이 실패해도 핵심 조리 흐름이 중단되지 않아야 했습니다.',
    ],
    decisions: [
      {
        label: '01 · EXPERIENCE FIRST',
        title: '모델 목록보다 사용자가 요리를 끝내는 5단계 흐름을 먼저 고정했습니다.',
        trigger: 'CV·RAG·LLM·음성을 각각 구현해도 화면 전환이 끊기면 하나의 서비스로 느껴지지 않았습니다.',
        options: ['AI 기능별 메뉴', '대화형 챗봇 하나', '체크–인식–추천–조리–에이전트 상태 흐름'],
        choice: '재료 체크부터 조리 중 음성 에이전트까지 5단계 앱 상태를 먼저 정의했습니다.',
        rationale: '각 AI 기능이 사용자의 다음 행동을 명확히 만들 때만 화면에 배치해 기능의 수보다 흐름의 완결성을 우선했습니다.',
        implementation: ['React 화면 상태와 FastAPI 응답 형식 분리', '현재 재료·레시피·조리 단계 상태 유지', 'TTS와 도구 action을 응답에 함께 반환'],
      },
      {
        label: '02 · RECIPE RETRIEVAL',
        title: '탐지된 재료를 바로 생성 모델에 넣지 않고 검색 가능한 후보로 바꿨습니다.',
        trigger: '“계란/달걀” 같은 표현 차이와 보유 재료의 부분집합 관계 때문에 단순 cosine 순위가 실제 조리 가능성과 달랐습니다.',
        options: ['LLM이 레시피를 전부 생성', '벡터 유사도만 사용', '재료 정규화 + 벡터 후보 + 집합 관계 재정렬'],
        choice: 'bge-m3와 ChromaDB로 넓은 후보를 찾고 정규화한 재료 집합의 포함 관계로 다시 정렬했습니다.',
        rationale: '검색 결과의 출처를 유지하면서 사용자가 실제로 가진 재료를 더 많이 활용하는 레시피를 우선하기 위해서였습니다.',
        implementation: ['동의어 map으로 재료 정규화', 'top_k의 5배 이상 후보 회수', '내 재료 활용 수와 vector similarity로 재정렬'],
      },
      {
        label: '03 · BOUNDED AGENT',
        title: 'LLM의 자유 행동을 다섯 개 도구와 최대 세 번의 호출로 제한했습니다.',
        trigger: '자연어 답변만으로는 타이머나 화면 이동을 실행할 수 없고, 자유로운 코드를 허용하면 예측하지 못한 행동이 생깁니다.',
        options: ['답변만 생성', '자유 형식 function 이름 생성', 'allowlist 도구 + 구조화된 tool_call'],
        choice: 'set_timer, search_youtube_video, read_video_transcript, search_recipe, goto_step만 허용했습니다.',
        rationale: '실행 가능한 행동의 표면을 작게 유지하면 입력 검증, 실패 처리, UI 상태 변경을 도구별로 통제할 수 있습니다.',
        implementation: ['JSON tool_call parser와 allowlist 검사', 'MAX_AGENT_STEPS=3', '잘못된 시간·단계는 실행하지 않고 재질문'],
        proof: 'Web/Backend/server.py에 5개 도구, allowlist 검사, 최대 3단계 루프가 구현돼 있습니다.',
      },
      {
        label: '04 · FALLBACK',
        title: '모델이 도구를 놓치거나 외부 서비스가 실패하는 경로를 별도로 만들었습니다.',
        trigger: '사용자가 명시적으로 영상을 요청해도 LLM이 도구를 호출하지 않거나 API 키가 없는 경우가 있었습니다.',
        options: ['실패를 그대로 반환', '모든 요청을 규칙으로 처리', 'LLM 판단 + 제한된 규칙 fallback'],
        choice: '명시적인 영상 요청에는 rule fallback을 두고, 검색·TTS가 없으면 로컬 대체 경로를 사용했습니다.',
        rationale: '에이전트의 유연성을 유지하면서 사용자가 기대한 핵심 행동은 예측 가능한 경로로 보장하려는 선택입니다.',
        implementation: ['video intent rule fallback', '벡터 DB 부재 시 재료 집합 검색', 'VARCO/gTTS 조건부 경로'],
      },
    ],
    system: [
      { label: '01', title: 'Detect', body: '카메라에서 재료 후보를 받아 현재 재료 상태를 갱신합니다.', tech: 'YOLO · FastAPI state' },
      { label: '02', title: 'Normalize', body: '동의어와 기본 재료를 검색 가능한 표현으로 통일합니다.', tech: 'synonym map · set logic' },
      { label: '03', title: 'Retrieve', body: '레시피 후보를 찾고 실제 보유 재료 기준으로 재정렬합니다.', tech: 'bge-m3 · ChromaDB' },
      { label: '04', title: 'Guide', body: '선택한 레시피를 단계별 화면과 음성으로 전달합니다.', tech: 'A.X · VARCO TTS' },
      { label: '05', title: 'Act', body: '사용자의 말을 구조화된 도구 호출로 바꿔 화면 상태를 변경합니다.', tech: '5 tools · 3-step loop' },
    ],
    evidence: [
      {
        label: 'RAG PIPELINE',
        image: 'assets/project-evidence/visionchef-rag-v2.jpg',
        alt: '레시피 DB 임베딩 ChromaDB 검색 A.X 생성 흐름',
        title: '탐지 결과가 곧바로 생성 답변이 되지 않도록 검색 계층을 사이에 뒀습니다.',
        body: '레시피 문서를 bge-m3로 임베딩하고 ChromaDB에서 후보를 찾은 뒤 A.X가 조리 단계로 변환합니다. 검색 가능한 지식과 생성 문장을 분리해 레시피 데이터가 바뀌어도 모델을 다시 학습하지 않게 했습니다.',
        source: '첨부 VisionChef 발표 자료 · RAG + LLM + 음성',
      },
      {
        label: 'TOOL BOUNDARY',
        image: 'assets/project-evidence/visionchef-tools-v2.jpg',
        alt: 'A.X가 호출할 수 있는 다섯 개의 조리 도구',
        title: '에이전트가 할 수 있는 일을 화면에서 검증 가능한 다섯 개 행동으로 제한했습니다.',
        body: '질문 → 도구 판단 → 실행 → 결과를 반영한 자연어 응답으로 루프를 구성했습니다. timer와 step 이동은 UI action으로, 영상·레시피 검색은 결과 payload로 반환돼 프론트엔드가 명시적으로 처리합니다.',
        source: '첨부 VisionChef 발표 자료 · LLM 에이전트 도구 호출',
      },
      {
        label: 'LIVE FLOW',
        image: 'assets/project-evidence/visionchef-agent-ui-v2.jpg',
        alt: '음성 질문이 유튜브 검색 도구 호출과 화면 응답으로 이어지는 시연',
        title: '도구 호출이 로그에만 남지 않고 실제 조리 화면의 상태 변화로 이어지는지 확인했습니다.',
        body: '“사과 써는 법 영상 보여줘”라는 음성 요청이 구조화된 검색 도구 호출, YouTube 결과, 사용자 안내 문장으로 이어집니다. 발표 화면과 저장소 코드를 함께 확인할 수 있는 대표 시나리오입니다.',
        source: '첨부 VisionChef 발표 자료 · 음성 LLM 에이전트 시연',
      },
    ],
    validation: {
      verified: ['저장소 코드에서 5개 도구와 최대 3단계 에이전트 루프를 확인할 수 있습니다.', '재료 기반 RAG, 4개 레시피 제안, 음성 질문과 UI action을 최종 시연으로 연결했습니다.', '인공지능 종합설계 장려상을 받았습니다.'],
      boundary: ['개인 기여는 LLM·RAG 모듈이며 CV·프론트엔드는 팀 기여입니다.', 'CV 오검출과 외부 API 장애가 후속 단계로 전파될 수 있습니다.', '위험한 조리 조언과 도구 실행 전 사용자 승인 정책은 아직 포함돼 있지 않습니다.'],
      next: ['모듈별 latency·오류·fallback 사용률을 관측 로그로 남깁니다.', '재료 인식 확신도가 낮으면 검색 전에 재질문합니다.', '타이머 외 상태 변경 도구에 승인 단계와 안전 정책을 추가합니다.'],
    },
    handoff: {
      from: '금융 RAG의 근거 검색과 성남 XAI의 자연어 해설을 실제 사용 흐름 안에서 결합했습니다.',
      to: 'LLM이 정해진 도구를 선택하고 결과를 다시 설명하는 구조는 MCP 기반 업무 도구 연결을 이해하는 기반이 됐습니다.',
    },
    resources: [
      { label: 'REPOSITORY', title: 'VisionChef', url: 'https://github.com/JM-KIMM/VisionChef', external: true },
      { label: 'PRESENTATION', title: 'VisionChef 발표 자료', url: 'docs/visionchef-presentation.pdf' },
    ],
  },

  'seongnam-xai': {
    cardLine: '24개월·50개 행정동 데이터를 5개 관점과 로컬 LLM 해설로 번역했습니다.',
    lede: '현재 매출 순위를 다시 보여주는 대신 생활상권이 성장할 조건을 다섯 관점으로 나누고, 통계 점수와 자연어 해설의 역할을 분리했습니다.',
    ownershipNote: '팀장으로 분석 구조를 정리하고 A.X 로컬 해설 연동을 담당했습니다. 점수 산출과 웹 애플리케이션은 팀 저장소의 단계별 결과를 기준으로 설명합니다.',
    brief: {
      problem: '현재 규모가 큰 상권과 앞으로 성장할 조건이 있는 상권을 같은 매출 순위로는 구분하기 어려웠습니다.',
      response: '생활수요·유동체류·소비활성·공급접근·소비여력을 표준화하고 PCA와 엔트로피를 비교한 뒤 지도와 근거 해설로 연결했습니다.',
      outcome: '24개월 1,199개 행정동–월 관측치를 5개 유형으로 탐색하는 FastAPI 대시보드를 구현했습니다.',
    },
    proofs: [
      { value: '24 months', label: 'TIME RANGE', note: '2024.01 — 2025.12' },
      { value: '1,199', label: 'DONG-MONTH ROWS', note: '50개 행정동, 첫 달 49개' },
      { value: '0.6444', label: 'PCA SILHOUETTE', note: '엔트로피 0.3858과 비교, k=4 실험' },
      { value: '5 groups', label: 'SERVICE TYPES', note: '현재 공개 산출물 기준' },
    ],
    constraints: [
      '인구·유동·카드·사업체·교통 데이터의 단위와 갱신 시점이 달라 직접 합산할 수 없었습니다.',
      'PCA 기반 상대 점수는 미래 매출을 예측하는 값이나 인과 효과가 아닙니다.',
      'LLM이 점수의 단위나 상·하위 의미를 다시 해석하면 통계 결과와 다른 설명을 만들 수 있었습니다.',
    ],
    decisions: [
      {
        label: '01 · TARGET',
        title: '“좋은 상권” 순위가 아니라 성장 조건의 조합을 정의했습니다.',
        trigger: '현재 매출만 정렬하면 이미 큰 상권이 반복해서 선택되고 작은 지역의 변화 가능성은 보이지 않았습니다.',
        options: ['매출 단일 순위', '전문가 임의 배점', '다섯 관점의 상대 조건 지수'],
        choice: '생활수요, 유동·체류, 소비활성, 공급접근, 소비·신용여력의 다섯 관점으로 목표를 나눴습니다.',
        rationale: '사용자가 하나의 점수보다 어떤 조건이 강하고 약한지 비교할 수 있어야 정책·창업 목적에 맞게 해석할 수 있다고 봤습니다.',
        implementation: ['원천 데이터 월·행정동 키 통합', '23개 파생지표 생성', '관점별 표준화 점수 산출'],
      },
      {
        label: '02 · WEIGHTING',
        title: 'PCA와 엔트로피를 결합하지 않고 대안으로 비교한 뒤 PCA를 선택했습니다.',
        trigger: '임의 가중치는 설명하기 쉽지만 분석자의 선호가 점수에 그대로 들어가고, 엔트로피와 PCA도 서로 다른 분포를 만들었습니다.',
        options: ['동일 가중치', '엔트로피 가중치', 'PCA 기반 가중치'],
        choice: '같은 다섯 점수로 K-means를 수행해 silhouette을 비교하고 PCA 경로를 사용했습니다.',
        rationale: 'k=4 비교 실험에서 PCA 0.6444, 엔트로피 0.3858로 PCA가 지역 간 구조를 더 뚜렷하게 나눴습니다.',
        implementation: ['표준화·상관분석', 'PCA·엔트로피 산출물을 별도 CSV로 저장', 'PCA 점수 재표준화 후 유형화'],
        proof: 'analysis/notebooks/02_commercial_area_clustering.ipynb의 실행 출력에 비교 점수가 남아 있습니다.',
      },
      {
        label: '03 · SCORE VS TYPE',
        title: '최종 점수와 지역 유형을 서로 다른 질문에 답하는 값으로 분리했습니다.',
        trigger: '1등부터 줄 세우면 비슷한 점수의 지역도 차이가 큰 것처럼 보이고, 왜 다른지 설명하기 어렵습니다.',
        options: ['순위만 표시', '군집만 표시', '상대 점수 + 유형 프로필 병행'],
        choice: 'final_index는 같은 월의 상대 위치, cluster는 다섯 조건의 조합을 보여주도록 화면에서 병행했습니다.',
        rationale: '점수는 높고 낮음을, 유형은 어떤 관점이 그 결과를 만드는지 탐색하게 해 서로의 한계를 보완합니다.',
        implementation: ['GeoJSON choropleth', '행정동 검색·상하위 비교', 'cluster summary 프로필'],
      },
      {
        label: '04 · GROUNDED EXPLANATION',
        title: 'A.X가 점수를 계산하지 않고 계산된 payload만 설명하도록 경계를 닫았습니다.',
        trigger: 'LLM이 표준화 점수를 0–100 점수처럼 말하거나 일부 좋은 지표만 보고 전체 성장 잠재력이 높다고 오해했습니다.',
        options: ['점수 계산까지 LLM에 맡김', '정적 템플릿만 표시', '계산 코드 + 제한된 LLM 해설'],
        choice: '서버가 final_index, 신호 수준, 상대 위치, 세부 근거를 JSON으로 만들고 A.X는 그 범위 안에서만 설명하게 했습니다.',
        rationale: '수치는 결정론적으로 계산하고 LLM은 사용자가 이해할 수 있는 문장으로 번역하는 역할만 맡기면 재현성과 가독성을 함께 확보할 수 있습니다.',
        implementation: ['A.X-4.0-Light 로컬 실행', '단위·상하위 판단 금지 규칙', '50개 행정동 해설 batch 저장'],
      },
    ],
    system: [
      { label: '01', title: 'Merge', body: '월·행정동 키로 인구, 유동, 카드, 이동, 교통 데이터를 통합합니다.', tech: '1,199 rows · 24 months' },
      { label: '02', title: 'Derive', body: '원천 규모를 비율과 밀도 중심의 23개 파생지표로 바꿉니다.', tech: 'pandas · standardization' },
      { label: '03', title: 'Weight', body: 'PCA와 엔트로피를 비교하고 PCA 기반 다섯 점수를 사용합니다.', tech: 'PCA · silhouette' },
      { label: '04', title: 'Cluster', body: '다섯 조건이 비슷한 행정동–월을 유형으로 묶습니다.', tech: 'K-means · 5 groups' },
      { label: '05', title: 'Explain', body: '계산된 근거 payload를 지도와 로컬 LLM 문장으로 전달합니다.', tech: 'FastAPI · GeoJSON · A.X' },
    ],
    evidence: [
      {
        label: 'WORKING PRODUCT',
        image: 'assets/project-previews/seongnam-xai.jpg',
        alt: '성남시 행정동 성장 잠재력 지도와 근거 패널',
        title: '지도·상대 점수·유형 프로필·근거 해설을 한 화면에서 비교하도록 구성했습니다.',
        body: '행정동을 선택하면 같은 월의 상대 위치, 다섯 핵심 신호, 유형 프로필과 A.X 해설이 함께 바뀝니다. LLM은 화면의 점수를 다시 계산하지 않고 서버가 만든 근거 payload를 읽어 설명합니다.',
        source: 'GitHub 실행 화면 · FastAPI dashboard with local A.X explanation',
      },
    ],
    validation: {
      verified: ['공개 저장소에 24개월 1,199개 행정동–월 산출물과 단계별 CSV가 남아 있습니다.', '노트북 출력에서 PCA와 엔트로피 silhouette 비교를 확인할 수 있습니다.', '50개 행정동에 대한 A.X 해설을 batch 결과로 저장했습니다.'],
      boundary: ['성장 잠재력은 미래 매출 예측값이나 인과 추정치가 아닌 상대 지수입니다.', '실루엣 기준 최적 k와 서비스가 사용하는 5개 유형 사이의 선택 근거가 저장소 문서에 충분히 남아 있지 않습니다.', '2024년 1월은 49개 행정동으로 다른 월보다 한 개 관측치가 적습니다.'],
      next: ['후속 시점 데이터로 지수 순위의 안정성과 실제 변화 방향을 검증합니다.', 'k 선택 기준과 군집별 정책 해석을 문서화합니다.', '지표 출처·기준 시점·민감도 분석을 화면에 함께 제공합니다.'],
    },
    handoff: {
      from: '스미싱 연구에서 판단 결과와 이유를 함께 보여주는 데이터 구조를 만들었습니다.',
      to: '정량 근거를 행정동 단위 설명으로 바꾼 경험은 공공 데이터를 근거로 업무 판단을 돕는 RAG 설계로 이어집니다.',
    },
    resources: [
      { label: 'REPOSITORY', title: 'Seongnam Commercial District XAI', url: 'https://github.com/JM-KIMM/seongnam', external: true },
      { label: 'DATA PORTAL', title: '성남시 데이터 포털', url: 'https://data.seongnam.go.kr', external: true },
    ],
  },

  'hansol-2pass': {
    cardLine: '건설 사고 대응 생성을 검색·초안·검수 단계로 분리하고 구현 경계를 확인했습니다.',
    lede: '한 번의 생성에 검색, 내용 선택, 문장 작성, 형식 준수를 모두 맡길 때 생기는 실패를 분해했습니다. 공개 저장소에는 검색과 VARCO 초안 경로가 실행되며 Qwen 검수는 로더까지 구현된 설계 단계입니다.',
    ownershipNote: '1인 프로젝트로 데이터 로딩, QA retriever, VARCO 생성 체인과 Qwen 8-bit 로더를 구현했습니다. “2-pass 완성”으로 과장하지 않고 현재 main.py의 실행 범위를 명시합니다.',
    brief: {
      problem: '긴 사고 문맥을 한 번에 넣으면 핵심 대책을 놓치고 요구 형식 밖의 설명을 덧붙였습니다.',
      response: '유사 사고 검색, 실행 가능한 대책만 쓰는 초안, 별도 검수라는 역할을 설계하고 모듈 경계를 나눴습니다.',
      outcome: '공개 코드는 QA 검색 + VARCO 1-pass를 실행하며 Private 12위 / 24팀을 기록했습니다. 2-pass 통합은 후속 과제로 남았습니다.',
    },
    proofs: [
      { value: '12 / 24', label: 'PRIVATE RANK', note: '한솔데코 시즌3' },
      { value: 'Top 3', label: 'QA RETRIEVAL', note: 'ko-sbert + FAISS similarity' },
      { value: '8B', label: 'DRAFT MODEL', note: 'Llama-VARCO-8B-Instruct' },
      { value: '14B int8', label: 'REFINE DESIGN', note: 'Qwen2.5 loader, main 미연결' },
    ],
    constraints: [
      '사고 원인과 공사 종류가 긴 문장으로 주어져 관련 없는 표현이 컨텍스트를 쉽게 채웠습니다.',
      '정답은 재발방지대책과 향후조치만 포함해야 해 내용뿐 아니라 출력 형식이 평가에 직접 영향을 줬습니다.',
      '두 대형 모델을 연속 실행하는 설계는 GPU 메모리와 추론 지연을 크게 늘렸습니다.',
    ],
    decisions: [
      {
        label: '01 · RETRIEVE FIRST',
        title: '전체 자료를 넣지 않고 과거 유사 사고의 질문–대응 쌍을 먼저 찾았습니다.',
        trigger: '긴 안전 지침과 사고 문장을 모두 넣으면 모델이 일반적인 문구를 반복하고 구체적인 조치를 놓쳤습니다.',
        options: ['전체 문서 stuff', '사고 원문만 생성', '유사 QA 검색 후 생성'],
        choice: 'train 질문·답변을 문서로 만들고 ko-sbert 임베딩과 FAISS로 상위 3개를 검색했습니다.',
        rationale: '과거 사고와 대응책을 작은 근거 집합으로 줄이면 생성 모델이 대책 작성에 사용할 문장을 더 쉽게 고를 수 있었습니다.',
        implementation: ['jhgan/ko-sbert-nli', 'LangChain FAISS retriever k=3', 'RetrievalQA source document 반환'],
      },
      {
        label: '02 · OUTPUT CONTRACT',
        title: '프롬프트를 역할 설명이 아니라 제출 형식 계약으로 사용했습니다.',
        trigger: '모델이 서론, 사고 원인 분석, “제안합니다” 같은 불필요한 문구를 생성했습니다.',
        options: ['자유 생성 후 수작업 정리', '정규식 후처리', '금지 문구와 출력 범위를 프롬프트에 고정'],
        choice: '재발방지대책과 향후조치만 작성하도록 허용·금지 범위를 명시했습니다.',
        rationale: '형식 오류와 내용 오류를 분리해야 모델과 검색 중 어느 부분을 고쳐야 하는지 판단할 수 있었습니다.',
        implementation: ['서론·배경·원인 분석 금지', '대책과 계획만 출력', 'max_new_tokens 128, 낮은 temperature'],
      },
      {
        label: '03 · TWO-PASS DESIGN',
        title: '초안 생성과 검수를 다른 책임으로 나누되, 공개 실행 경로의 미완성도 함께 남았습니다.',
        trigger: '한 모델이 내용 누락과 문장 정리를 동시에 해결하도록 하면 프롬프트 변경의 효과를 구분하기 어려웠습니다.',
        options: ['VARCO 1-pass 유지', '더 큰 모델 하나로 교체', 'VARCO draft + Qwen refine'],
        choice: 'VARCO-8B 초안과 Qwen2.5-14B 검수 역할을 정의하고 Qwen 로더에 8-bit 양자화를 적용했습니다.',
        rationale: '초안은 필요한 대책의 recall, 검수는 중복 제거와 형식 준수에 집중시키려는 설계였습니다.',
        implementation: ['load_initial_model_and_tokenizer', 'load_refine_model_and_tokenizer', 'Qwen BitsAndBytesConfig 8-bit'],
        proof: '현재 main.py는 load_initial_model_and_tokenizer만 호출하므로 refine 단계는 실행되지 않습니다.',
      },
    ],
    system: [
      { label: 'IMPLEMENTED', title: 'Load & retrieve', body: 'train QA를 문서로 만들고 질문과 유사한 상위 3개 사례를 찾습니다.', tech: 'pandas · ko-sbert · FAISS' },
      { label: 'IMPLEMENTED', title: 'Draft', body: '검색 문맥과 출력 계약으로 VARCO가 대응책 초안을 생성합니다.', tech: 'VARCO-8B · RetrievalQA' },
      { label: 'PREPARED', title: 'Refine model', body: 'Qwen2.5-14B를 8-bit로 불러오는 로더가 구현돼 있습니다.', tech: 'Qwen2.5 · bitsandbytes' },
      { label: 'NOT WIRED', title: 'Draft → refine', body: '초안과 근거를 검수 모델에 전달하는 실행 체인은 main.py에 연결되지 않았습니다.', tech: 'integration gap' },
    ],
    evidence: [
      {
        label: 'IMPLEMENTATION BOUNDARY',
        image: 'assets/project-previews/hansol-2pass-flow.svg',
        alt: '건설 사고 검색 VARCO 초안 Qwen 검수 흐름과 구현 경계',
        title: '설계한 2-pass 구조와 공개 저장소에서 실제 실행되는 범위를 구분했습니다.',
        body: '검색과 VARCO 초안은 main.py에서 연결돼 있고 Qwen 검수 모델 로더는 별도 모듈로 준비돼 있습니다. 초안을 검수 입력으로 넘기는 orchestration은 남은 통합 과제이며, 이 구분이 이후 금융 RAG에서 실행 경로를 먼저 고정하게 된 계기였습니다.',
        source: 'GitHub audit · main.py, model_loader.py, rag_chain.py',
      },
    ],
    validation: {
      verified: ['QA 기반 FAISS retriever와 VARCO RetrievalQA 실행 경로가 공개돼 있습니다.', 'Qwen2.5-14B 8-bit 로더와 모듈 분리가 코드에 남아 있습니다.', '대회 Private 12위 / 24팀을 기록했습니다.'],
      boundary: ['공개 main.py는 Qwen refine 모델을 호출하지 않아 완전한 2-pass가 아닙니다.', 'PDF IndexHNSW 코드가 있지만 현재 실행 경로는 train QA retriever를 사용합니다.', '두 단계 모델을 연결해도 사실성과 근거 일치가 자동으로 보장되지는 않습니다.'],
      next: ['초안·근거·평가 기준을 refine 입력 계약으로 정의하고 실행 경로를 연결합니다.', '1-pass와 2-pass의 품질·latency·메모리를 같은 평가셋에서 비교합니다.', '큰 검수 모델 대신 규칙·소형 모델 품질 게이트와 비용을 비교합니다.'],
    },
    handoff: {
      from: '알고리즘 훈련에서 익힌 단계 분해를 처음으로 생성형 AI 파이프라인에 적용했습니다.',
      to: '미완성 통합 경계를 확인한 경험은 금융 RAG에서 발표 설정과 공개 실행 코드를 구분하고 검색 계층을 먼저 검증하는 방식으로 이어졌습니다.',
    },
    resources: [
      { label: 'REPOSITORY', title: 'Construction Safety AI', url: 'https://github.com/JM-KIMM/Construction-Safety-AI-2-Pass-Generation', external: true },
      { label: 'OFFICIAL', title: '한솔데코 시즌3 생성 AI 경진대회', url: 'https://dacon.io/competitions/official/236455/overview/description', external: true },
    ],
  },
}
