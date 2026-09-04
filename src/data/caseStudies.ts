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
  'inha-world-model': {
    cardLine: '액션 조건부 로봇 영상을 생성하는 World Model을 최적화해 우수상을 받았습니다.',
    lede: '초기 이미지 한 장과 16단계 관절 명령으로 16프레임 액션 조건부 영상을 생성했습니다. 모델을 오래 학습하는 대신, 액션 조건을 잠재 시점에 맞게 주입하고 실패한 대리지표를 반증하며 데이터 신호와 추론 비용을 함께 최적화했습니다.',
    ownershipNote: '3인 팀의 팀장으로 World Model 학습·추론과 재현 파이프라인을 담당했습니다. 공개 저장소에 최종 설정뿐 아니라 실패한 가설, 폐기한 실험과 규정 판단까지 기록했습니다.',
    brief: {
      problem: '한 장면에서 시작해 로봇 관절 명령을 따르는 미래 영상을 만들어야 했지만, 평가 결과는 시각·행동 오차가 합쳐진 점수 하나뿐이라 무엇을 개선해야 하는지 알기 어려웠습니다.',
      response: 'Cosmos-Predict2.5-2B를 동결한 채 SO-100용 액션 임베더와 LoRA를 학습했습니다. 데이터 정제·움직임 가중·액션 보조손실을 조합하고, DRaFT와 오토가이던스를 이어 검증했습니다.',
      outcome: 'Public 0.187244, Private 0.21395를 기록하고 2026 인하 인공지능 챌린지 우수상을 받았습니다.',
    },
    proofs: [
      { value: '우수상', label: 'AWARD', note: '2026 인하 인공지능 챌린지' },
      { value: '0.21395', label: 'PRIVATE SCORE', note: '최종 리더보드 · lower is better' },
      { value: '0.187244', label: 'PUBLIC SCORE', note: '정지영상 기준선 0.3032 대비 38% 감소' },
      { value: '16 × 6', label: 'ACTION INPUT', note: 'SO-100 6축 관절 명령 16단계' },
    ],
    constraints: [
      '외부 데이터 없이 대회 제공 로봇 영상만 사용해야 했고, 기준 장비 1대에서 학습 4일·216개 영상 추론 1시간 제한을 지켜야 했습니다.',
      '입력은 640×480 초기 이미지 한 장과 16-step 6축 action이며, 출력은 16프레임 액션 조건부 영상이어야 했습니다.',
      '리더보드는 DINO·video feature·Action MAE를 합친 단일 점수만 제공해 직접 만든 오프라인 지표부터 검증해야 했습니다.',
      '로컬 RTX 5070 Ti 16GB에서 학습해야 해 전체 모델 fine-tuning이나 큰 batch를 사용할 수 없었습니다.',
    ],
    decisions: [
      {
        label: '01 · ACTION CONDITIONING',
        title: '범용 영상 모델에 액션을 붙이는 대신 잠재 시간축과 로봇 관절 구조를 먼저 맞췄습니다.',
        trigger: '사전학습 모델의 action embedder는 7축 입력용이고, SO-100 데이터는 6축이라 차원이 맞지 않았습니다. 16개 action도 4개 잠재 프레임과 직접 대응하지 않았습니다.',
        options: ['action을 텍스트로 변환', '7축 입력에 0 padding', '6축 embedder와 잠재 시간축 매핑 재설계'],
        choice: '첫 action layer를 6축에 맞게 다시 초기화하고, 16×6 action을 temporal compression ratio 4에 따라 4×24로 재배열했습니다.',
        rationale: '각 잠재 프레임이 연속된 네 동작을 직접 받게 해야 장면의 그럴듯함뿐 아니라 명령 순서에 따른 움직임을 학습할 수 있었습니다.',
        implementation: ['action fc1 재초기화 · fc2 사전학습 가중치 재사용', '16×6 → 4×24 action conditioning', 'timestep embedding + 28개 block adaLN에 주입'],
      },
      {
        label: '02 · MEMORY BUDGET',
        title: '2B backbone은 동결하고 바뀌어야 할 경로에만 113.4M 파라미터를 열었습니다.',
        trigger: '16GB VRAM에서 video diffusion backbone 전체를 학습하면 메모리 한도를 넘고, VAE 인코딩까지 매 step 반복하면 제한 시간 안에 실험하기 어려웠습니다.',
        options: ['전체 fine-tuning', 'action embedder만 학습', 'LoRA + action embedder 학습'],
        choice: 'Cosmos-Predict2.5-2B를 동결하고 attention·MLP에 LoRA r32를 넣어 action embedder와 함께 학습했습니다.',
        rationale: '영상 생성 prior는 유지하면서 관절 명령에 반응해야 하는 경로만 바꿔 메모리와 학습 시간을 통제했습니다.',
        implementation: ['LoRA r32 · alpha 32', 'q/k/v/output projection + MLP 280개 모듈', '104,828개 latent window 사전 계산'],
      },
      {
        label: '03 · SIGNAL OVER VOLUME',
        title: '더 오래 학습하는 대신 어떤 장면을 어떤 손실로 보여줄지 바꿨습니다.',
        trigger: 'validation loss가 낮아져도 리더보드가 악화됐고, 균등 sampling으로 남은 저움직임 window까지 학습하자 생성 움직임이 줄었습니다.',
        options: ['학습 횟수 계속 증가', '균등 sampling으로 전체 window 소진', '노이즈 정제 + 움직임 가중 + action 보조손실'],
        choice: '품질이 낮은 episode 322개의 가중치를 낮추거나 제외하고, 움직임이 큰 구간을 더 자주 학습하며 action L1 보조손실을 추가했습니다.',
        rationale: '95,500 노출 시점에 training episode의 98.7%를 이미 봤고, 이후 남은 window는 저움직임 비중이 높았습니다. 추가 학습보다 움직임 신호를 유지하는 편이 더 나았습니다.',
        implementation: ['episode quality weighting', 'motion-weighted sampling', 'flow-matching MSE + action L1 auxiliary', 'model soup 후 3-step DRaFT'],
        proof: '학습 연장은 0.1872에서 0.2166으로 악화됐고, 가장 큰 개선 구간은 정제·가중·보조손실을 함께 적용한 단계였습니다.',
      },
      {
        label: '04 · FALSIFY THE METRIC',
        title: '좋아 보이는 대리지표를 최적화하기 전에 공식 점수를 아는 사례로 반증했습니다.',
        trigger: '자체 DINO·video proxy, 픽셀 움직임 상관, inverse-dynamics ranking, validation loss가 서로 다른 방향을 가리켰습니다.',
        options: ['오프라인 지표 하나를 선택해 끝까지 최적화', '리더보드만 반복 확인', '알려진 구성으로 대리지표의 방향부터 검증'],
        choice: '공식 점수를 아는 두세 구성의 순서를 맞히지 못한 지표는 폐기하고, 한 번에 하나의 추론 변수만 바꿨습니다.',
        rationale: '정교하지만 틀린 계측기는 무계측보다 위험했습니다. 실제 순위를 재현하지 못하는 지표를 일찍 버려 잘못된 방향의 장기 학습을 막았습니다.',
        implementation: ['32개 visual preprocessing 조합 반증', 'inverse-dynamics MAE를 episode 단위로 재측정', '실험 전 예측·채택 문턱 −0.003 기록'],
      },
      {
        label: '05 · INFERENCE TRADE-OFF',
        title: '움직임을 키우되 떨림과 1시간 추론 한도를 함께 봤습니다.',
        trigger: 'action CFG는 움직임을 늘렸지만 오토가이던스와 결합하면 같은 성분을 이중 증폭해 점수가 악화됐습니다.',
        options: ['action CFG 강화', '샘플링 step 계속 증가', '오토가이던스 단독 + step 포화점 탐색'],
        choice: 'LoRA를 끈 base branch를 사용하는 오토가이던스 0.6과 30-step FlowUniPC를 선택했습니다.',
        rationale: '오토가이던스는 미세조정이 배운 방향을 더 낮은 jitter로 증폭했고, 45-step은 이득 없이 추론 시간만 늘어 30-step이 품질과 비용의 포화점이었습니다.',
        implementation: ['auto-guidance 0.6', 'FlowUniPC 30 steps · shift 5', 'first latent frame hard anchor', 'yuv420p · 6fps output'],
        proof: '추론 설정만으로 Public 점수를 0.2023에서 0.1872로 0.0151 낮췄습니다.',
      },
    ],
    system: [
      { label: '01', title: 'Index', body: '10,971개 episode를 train 10,735·validation 236으로 나누고 17-frame window를 만듭니다.', tech: 'episode split · motion score' },
      { label: '02', title: 'Encode', body: '영상을 320×512로 letterbox하고 VAE latent 104,828개를 미리 계산합니다.', tech: 'VAE · latent cache' },
      { label: '03', title: 'Condition', body: '16×6 관절 명령을 4×24 action conditioning으로 바꿔 각 생성 block에 주입합니다.', tech: 'action embedder · adaLN' },
      { label: '04', title: 'Adapt', body: '동결된 Cosmos 위에서 LoRA와 action embedder를 흐름정합·action 보조손실로 학습합니다.', tech: 'LoRA r32 · auxiliary IDM' },
      { label: '05', title: 'Refine', body: '정제·움직임 가중·model soup 뒤 DRaFT로 행동 일치 보상을 미세조정합니다.', tech: 'model soup · DRaFT' },
      { label: '06', title: 'Generate', body: '초기 latent를 고정하고 오토가이던스 0.6으로 16프레임 액션 조건부 영상을 생성합니다.', tech: 'FlowUniPC · 30 steps' },
    ],
    evidence: [
      {
        label: 'MODEL PIPELINE',
        image: 'assets/project-previews/inha-world-model-flow.svg',
        alt: '초기 이미지와 16단계 6축 관절 명령이 action conditioning과 Cosmos LoRA를 거쳐 16프레임 영상으로 생성되는 구조',
        title: '행동 순서를 잠재 시간축에 맞춘 뒤 생성 모델 전체에 주입했습니다.',
        body: '16개의 6축 action을 네 잠재 시점으로 재배열하고, timestep embedding과 28개 block의 adaLN에 함께 전달했습니다. 첫 latent frame은 입력 이미지로 고정해 출발 장면이 흔들리지 않게 했습니다.',
        source: 'Implementation diagram · Cosmos action conditioning and LoRA adaptation',
      },
      {
        label: 'EXPERIMENT LOGIC',
        image: 'assets/project-evidence/inha-world-model-experiments.svg',
        alt: '정지영상 기준선과 Public·Private 점수, 학습 중단 시점, 수상 모델 확정 뒤의 OOD 사후 분석을 구분한 실험 요약',
        title: '모델 선택 근거와 수상 이후의 사후 분석을 분리해 기록했습니다.',
        body: '균등 sampling으로 학습을 연장했을 때 Public 점수가 0.1872에서 0.2166으로 후퇴해 95,500 노출에서 멈췄습니다. 수상 모델 확정 뒤에는 Public–Private 차이와 장기 학습 후퇴를 시작 자세 분포 차이와 연결해 사후 분석했습니다. 이 통계로 설계한 augmentation branch는 평가하지 않고 폐기했습니다.',
        source: 'Experiment summary · score path, stopping point and post-hoc OOD analysis',
      },
    ],
    validation: {
      verified: ['3인 팀의 팀장으로 2026 인하 인공지능 챌린지 우수상을 받았습니다.', 'Public 0.187244와 최종 Private 0.21395를 구분해 기록했습니다.', '로컬 16GB 환경에서 약 2일 학습하고 216개 영상을 57.9분에 생성했습니다.', '최종 학습·추론 설정과 실패 실험을 재현 문서로 공개했습니다.'],
      boundary: ['Public 0.187244와 Private 0.21395 사이에 0.026706의 점수 차이가 나타났습니다.', '가장 큰 개선 구간에서 데이터 정제·움직임 가중·판독기 보조손실을 함께 바꿔 각각의 기여도를 분리할 수 없습니다.', '초기 판독기 validation은 겹치는 window 단위 분할로 5.6% 낙관적이었고, episode 단위 재측정에서 MAE가 0.1069에서 0.1129로 높아졌습니다.'],
      next: ['대회 규정을 벗어나지 않는 episode-level validation을 먼저 설계합니다.', '정제·sampling·보조손실을 한 변수씩 분리해 ablation합니다.', '생성 영상의 불확실성과 action 충실도를 함께 보여주는 현장용 품질 게이트를 만듭니다.'],
    },
    handoff: {
      from: 'CJ에서 영상 관측과 오프라인 실행 환경을 단계별로 나눈 경험을 행동 조건부 영상 생성 문제로 확장했습니다.',
      to: '대리지표를 먼저 반증하고 비용·일반화·규정을 함께 본 경험은 행정안전부에서 RAG·MCP 시스템을 평가하는 기준으로 이어졌습니다.',
    },
    resources: [
      { label: 'REPOSITORY', title: 'INHA World Model', url: 'https://github.com/JM-KIMM/inha_worldmodel', external: true },
      { label: 'SOLUTION', title: '최종 해법과 재현 절차', url: 'https://github.com/JM-KIMM/inha_worldmodel/blob/main/SOLUTION.md', external: true },
      { label: 'OFFICIAL', title: '2026 인하 인공지능 챌린지', url: 'https://dacon.io/competitions/official/236736/overview/description', external: true },
      { label: 'LEADERBOARD', title: '최종 리더보드', url: 'https://dacon.io/competitions/official/236736/leaderboard', external: true },
    ],
  },

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
    ownershipNote: '팀 프로젝트에서 박스·레일 segmentation polygon과 박스 8-corner pose 학습 데이터를 직접 라벨링하고, 학습·추론 파이프라인과 ONNX 평가 패키지를 담당했습니다.',
    brief: {
      problem: '카메라 파라미터가 없고 박스가 겹치며, 같은 물체도 화면 위치에 따라 픽셀 크기가 달라졌습니다.',
      response: '픽셀 라벨이 없는 영상에서 segmentation·8-corner 데이터를 직접 만들고, 레일 기반 위치별 스케일, 시간축 추적, 기하·회귀 앙상블을 단계별로 분리했습니다.',
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
      '대회 데이터에는 크기 단위의 정답만 있고 box·rail pixel annotation이 없어 검출 학습 데이터를 직접 구축해야 했습니다.',
      '가림, 원거리 소실, 컨베이어 속도 변화 때문에 프레임별 검출 수가 실제 박스 수와 달랐습니다.',
      '네트워크가 차단된 A100 평가 환경에서 제한된 패키지와 ONNX 모델만으로 끝까지 실행돼야 했습니다.',
    ],
    decisions: [
      {
        label: '01 · DATA LABELING',
        title: '측정에 필요한 중간 표현부터 직접 라벨링했습니다.',
        trigger: '영상별 박스 크기 정답만으로는 레일 경계, 박스 실루엣, 가려지지 않은 꼭짓점을 학습할 수 없었습니다.',
        options: ['크기 정답만으로 end-to-end 회귀', '범용 검출 모델 그대로 사용', '측정 단계에 맞춘 pixel annotation 구축'],
        choice: 'box·rail 2-class polygon은 프리라벨 후 수동 보정하고, 박스의 보이는 8개 꼭짓점을 직접 클릭해 pose 데이터셋을 만들었습니다.',
        rationale: '최종 크기만 맞히는 모델보다 어떤 픽셀을 기준으로 측정했는지 확인할 수 있어 가림과 원근 오차를 단계별로 고칠 수 있었습니다.',
        implementation: ['box·rail segmentation polygon 라벨', '박스 8-corner keypoint 라벨', '영상 단위 train·validation 분리'],
        proof: 'pose 학습셋은 427프레임·2,542개 박스로 구성하고, segmentation과 pose 모델을 각각 YOLO11l로 fine-tuning했습니다.',
      },
      {
        label: '02 · CALIBRATION',
        title: '카메라를 추정하는 대신 모든 영상에 보이는 레일을 이동식 기준자로 사용했습니다.',
        trigger: '전역 px/cm 비율은 원근 때문에 가까운 박스를 작게, 먼 박스를 크게 측정하는 구조적 오차를 만들었습니다.',
        options: ['단일 전역 스케일', '카메라 파라미터 추정', '레일 폭으로 위치별 스케일 복원'],
        choice: '실제 폭 62.3cm인 레일의 양쪽 경계를 누적 마스크에서 찾고 loc_scale(x, y)를 계산했습니다.',
        rationale: '평가 영상마다 공통으로 등장하고 실제 크기를 아는 물체를 사용하면 카메라 정보 없이도 화면 위치별 단위를 복원할 수 있었습니다.',
        implementation: ['YOLO11l-seg로 box·rail 분할', 'Huber line fitting으로 레일 경계 안정화', '화면 좌표별 rail pixel width를 cm로 변환'],
      },
      {
        label: '03 · COUNTING',
        title: '검출 개수와 실제 통과 개수를 분리했습니다.',
        trigger: '가림으로 트랙이 끊기거나 원거리 박스를 놓치면 프레임별 검출 합계가 실제 개수와 크게 달라졌습니다.',
        options: ['최대 검출 수 사용', 'tracking ID 수 사용', '시간축 통계를 회귀해 보정'],
        choice: 'stride-5 통계, 원거리 2배 확대, 역방향 추적을 31차원 특징으로 만들고 Ridge로 최종 수량을 보정했습니다.',
        rationale: '어느 한 트래커의 ID를 정답으로 두기보다 서로 다른 실패 양상을 가진 관측값을 결합하는 편이 가림에 안정적이었습니다.',
        implementation: ['constant-velocity IoU tracking', '진행 방향·거리·크기 변화 기반 fallback', 'forward·reverse track 통계 결합'],
        proof: '학습 스크립트에 GroupKFold 5 count MAE와 ONNX parity < 0.01 검증 게이트를 정의했습니다.',
      },
      {
        label: '04 · 3D SIZE',
        title: '단안 깊이를 한 번에 맞히지 않고 서로 다른 관측 단서를 조립했습니다.',
        trigger: '바운딩 박스만으로는 회전과 가림, 깊이축 길이를 구분하기 어려웠습니다.',
        options: ['bbox 3변 회귀', '단일 pose 모델', '실루엣·pose·시간 변화 결합'],
        choice: '마스크 기하, 8개 꼭짓점, temporal parallax, DIRD 깊이 보정을 27차원 특징으로 구성했습니다.',
        rationale: '각 단서가 실패하는 조건이 달라 중간 측정값을 남기고 결합하면 오차의 원인을 추적할 수 있었습니다.',
        implementation: ['YOLO11l-pose 8-corner 측정', '가려진 꼭짓점 제외와 여러 프레임 중앙값', '방향 분해 깊이 보정 DIRD'],
      },
      {
        label: '05 · DELIVERY',
        title: '학습과 제출 추론이 같은 특징 계산을 사용하도록 재현 경계를 고정했습니다.',
        trigger: '노트북에서 좋은 결과가 나와도 제출 main.py에서 전처리 순서나 dtype이 달라지면 오프라인 평가가 실패했습니다.',
        options: ['Python 모델 그대로 제출', '단일 end-to-end 모델', '단계별 모델을 ONNX로 고정'],
        choice: 'Segmentation·Pose·Count·Size 모델을 ONNX로 변환하고 학습 스크립트가 main.py의 공통 함수를 재사용하게 했습니다.',
        rationale: '복잡한 파이프라인일수록 모델 성능보다 학습–추론 parity와 장애 시 fallback이 최종 제출의 신뢰도를 좌우했습니다.',
        implementation: ['ONNX opset 17 export', '원본 모델과 ONNX 출력 parity gate', '모델 누락 시 기하 기반 fallback'],
      },
    ],
    system: [
      { label: '01', title: 'Annotate', body: '영상에서 박스·레일 polygon과 보이는 8개 꼭짓점을 직접 라벨링합니다.', tech: 'AnyLabeling · YOLO format' },
      { label: '02', title: 'Segment', body: '박스와 레일 마스크를 분리합니다.', tech: 'YOLO11l-seg · ONNX' },
      { label: '03', title: 'Calibrate', body: '레일 폭으로 위치별 px/cm를 복원합니다.', tech: 'Huber line · loc_scale' },
      { label: '04', title: 'Track', body: '가림 전후의 동일 박스를 시간축으로 연결합니다.', tech: 'IoU · velocity · fallback' },
      { label: '05', title: 'Count', body: '추적 통계를 31차원으로 모아 실제 수량을 보정합니다.', tech: 'Ridge · reverse track' },
      { label: '06', title: 'Measure', body: '실루엣과 꼭짓점으로 27차원 크기 특징을 만듭니다.', tech: 'Pose · parallax · DIRD' },
      { label: '07', title: 'Assemble', body: '선형·비선형 분기를 shape-volume 공간에서 결합합니다.', tech: 'Huber · GBR · TabM' },
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
      verified: ['box·rail polygon과 박스 8-corner pose 학습 데이터를 직접 구축했습니다.', '오프라인 ONNX 평가 환경에서 end-to-end 추론을 완료했습니다.', '학습 스크립트에 count·size 교차검증과 ONNX parity 기준을 남겼습니다.', '최종 리더보드 4위로 파이프라인의 상대 성능을 확인했습니다.'],
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
    cardLine: 'FAISS로 넓게 찾고 BGE Cross-Encoder 리랭커로 좁혀 283팀 중 6위를 기록했습니다.',
    lede: '생성 모델을 더 크게 만드는 대신, 10,913개 금융·보안 청크를 FAISS로 회수하고 BGE Cross-Encoder 리랭커가 질문과 문단을 함께 읽어 최종 근거를 고르게 했습니다.',
    ownershipNote: '4인 팀의 팀장으로 데이터 수집·정규화와 검색 파이프라인을 총괄했습니다. 대회 제출 자료와 공개 저장소의 재현용 코드 범위를 구분해 설명합니다.',
    brief: {
      problem: '법률·판례·보안 지식은 계속 바뀌고 문서 형식도 달라 모델의 파라미터만으로 최신성과 출처를 보장하기 어려웠습니다.',
      response: '질문 증강과 FAISS 검색으로 후보 recall을 확보하고 BGE Cross-Encoder 리랭커로 precision을 높여 두 단계를 따로 조정했습니다.',
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
    cardLine: '상권 수치를 대시보드로 비교하고 로컬 LLM이 처음 보는 사람도 이해할 설명으로 바꿨습니다.',
    lede: '점수와 군집 번호만으로는 비전문가가 지역의 강점과 약점을 이해하기 어렵습니다. 대시보드에서 지역별 수치를 비교하고, 로컬 LLM이 계산된 근거를 쉬운 설명으로 바꾸게 했습니다.',
    ownershipNote: '팀장으로 분석 구조를 정리하고 A.X 로컬 해설 연동을 담당했습니다. 점수 산출과 웹 애플리케이션은 팀 저장소의 단계별 결과를 기준으로 설명합니다.',
    brief: {
      problem: '현재 규모와 성장 조건을 매출 순위만으로 구분하기 어려웠고, 표준화 점수와 군집 번호만 제시하면 처음 보는 사용자가 수치의 의미를 해석하기 어려웠습니다.',
      response: '다섯 관점의 지수와 지역 유형을 지도 대시보드로 비교하고, 로컬 LLM이 선택한 행정동의 강점·약점과 수치의 의미를 자연어로 설명하게 했습니다.',
      outcome: '24개월 1,199개 행정동–월 관측치를 5개 유형으로 탐색하고 정량 결과와 XAI 해설을 함께 읽는 FastAPI 대시보드를 구현했습니다.',
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
        title: 'LLM을 계산기가 아니라 사람을 위한 해석 계층으로 사용했습니다.',
        trigger: '처음 보는 사용자는 표준화 점수, 상대 위치, 군집 번호만으로 지역의 상태와 이유를 이해하기 어렵고, LLM이 직접 계산하면 수치까지 왜곡할 수 있었습니다.',
        options: ['점수 계산까지 LLM에 맡김', '정적 템플릿만 표시', '계산 코드 + 제한된 LLM 해설'],
        choice: '서버가 final_index, 신호 수준, 상대 위치, 세부 근거를 JSON으로 확정하고 A.X는 강점·약점·주의점을 쉬운 문장으로 풀어쓰게 했습니다.',
        rationale: '대시보드는 수치를 비교 가능하게 만들고 LLM은 그 수치가 사람에게 무엇을 의미하는지 번역합니다. 계산과 설명을 분리해 분석의 재현성을 지키면서도 비전문가의 이해 비용을 낮췄습니다.',
        implementation: ['A.X-4.0-Light 로컬 실행', '결정론적 evidence payload', '단위·상하위 판단 금지 규칙', '50개 행정동 해설 batch 저장'],
      },
    ],
    system: [
      { label: '01', title: 'Merge', body: '월·행정동 키로 인구, 유동, 카드, 이동, 교통 데이터를 통합합니다.', tech: '1,199 rows · 24 months' },
      { label: '02', title: 'Derive', body: '원천 규모를 비율과 밀도 중심의 23개 파생지표로 바꿉니다.', tech: 'pandas · standardization' },
      { label: '03', title: 'Weight', body: 'PCA와 엔트로피를 비교하고 PCA 기반 다섯 점수를 사용합니다.', tech: 'PCA · silhouette' },
      { label: '04', title: 'Cluster', body: '다섯 조건이 비슷한 행정동–월을 유형으로 묶습니다.', tech: 'K-means · 5 groups' },
      { label: '05', title: 'Present & explain', body: '대시보드가 수치를 비교하고 로컬 LLM이 선택 지역의 의미를 쉬운 문장으로 설명합니다.', tech: 'FastAPI · GeoJSON · A.X' },
    ],
    evidence: [
      {
        label: 'WORKING PRODUCT',
        image: 'assets/project-previews/seongnam-xai.jpg',
        alt: '성남시 행정동 성장 잠재력 지도와 근거 패널',
        title: '숫자를 보는 화면과 숫자를 이해하는 설명을 한 대시보드에 연결했습니다.',
        body: '행정동을 선택하면 같은 월의 상대 위치, 다섯 핵심 신호와 유형 프로필이 먼저 갱신되고 A.X가 “왜 이런 결과가 나왔는지”를 쉬운 문장으로 설명합니다. 사용자는 군집 번호를 해석할 필요 없이 강점·약점과 판단 근거를 함께 확인할 수 있습니다.',
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
    cardLine: '검색한 근거를 VARCO로 압축한 뒤 Qwen이 최종 답변을 생성하도록 연결했습니다.',
    lede: '한 번에 받을 수 있는 컨텍스트가 제한된 환경에서 검색 문서를 그대로 밀어 넣지 않았습니다. 첫 번째 LLM이 사고 원인과 대응 근거를 요약·압축하고, 두 번째 LLM이 압축된 컨텍스트로 최종 재발방지대책을 작성하도록 역할을 나눴습니다.',
    ownershipNote: '1인 프로젝트로 QA retriever와 두 LLM의 실행 흐름을 구성했습니다. VARCO-8B는 검색 근거를 작업 중심 컨텍스트로 압축하고 Qwen2.5-14B는 그 결과를 받아 최종 답변 형식으로 정리합니다.',
    brief: {
      problem: '사고 설명과 유사 사례를 한 번에 넣으면 컨텍스트 한도를 빠르게 채우고, 핵심 안전 조치보다 반복 문구와 배경 설명이 답변을 지배했습니다.',
      response: '상위 3개 유사 QA를 검색한 뒤 VARCO가 필요한 원인·대책만 요약해 컨텍스트를 압축하고, Qwen이 압축본으로 최종 답변을 생성하게 했습니다.',
      outcome: '검색·압축·최종 생성을 연결한 2-pass 파이프라인으로 Private 12위 / 24팀을 기록했습니다.',
    },
    proofs: [
      { value: '12 / 24', label: 'PRIVATE RANK', note: '한솔데코 시즌3' },
      { value: 'Top 3', label: 'QA RETRIEVAL', note: 'ko-sbert + FAISS similarity' },
      { value: '8B → 14B', label: 'TWO LLMS', note: 'VARCO 압축 후 Qwen 최종 생성' },
      { value: '2 passes', label: 'CONTEXT FLOW', note: '근거 선택과 답변 작성을 분리' },
    ],
    constraints: [
      '사고 원인과 공사 종류, 검색된 유사 사례를 한 번에 넣기에는 사용할 수 있는 컨텍스트 길이가 제한돼 있었습니다.',
      '정답은 재발방지대책과 향후조치만 포함해야 해 내용뿐 아니라 출력 형식이 평가에 직접 영향을 줬습니다.',
      '두 LLM을 순차 실행하면 컨텍스트는 줄일 수 있지만 GPU 메모리 전환과 추론 시간이 늘어났습니다.',
    ],
    decisions: [
      {
        label: '01 · RETRIEVE FIRST',
        title: '전체 자료를 넣지 않고 과거 유사 사고의 질문–대응 쌍을 먼저 찾았습니다.',
        trigger: '긴 안전 지침과 사고 문장을 모두 넣으면 모델이 일반적인 문구를 반복하고 구체적인 조치를 놓쳤습니다.',
        options: ['전체 문서 입력', '사고 원문만 입력', '유사 QA 검색 후 생성'],
        choice: '학습 데이터의 질문·답변을 문서화하고, ko-sbert와 FAISS로 유사 사례 3개를 검색했습니다.',
        rationale: '과거 사고와 대응책을 작은 근거 집합으로 줄이면 생성 모델이 대책 작성에 사용할 문장을 더 쉽게 고를 수 있었습니다.',
        implementation: ['jhgan/ko-sbert-nli', 'LangChain FAISS retriever k=3', '근거 문서 반환'],
      },
      {
        label: '02 · CONTEXT COMPRESSION',
        title: '첫 번째 LLM의 출력 자체를 두 번째 LLM의 컨텍스트로 사용했습니다.',
        trigger: '검색된 세 사례를 원문 그대로 이어 붙이면 토큰을 많이 쓰면서도 공통 대책과 현재 사고에 필요한 정보가 섞였습니다.',
        options: ['검색 원문 전체 전달', '문자 수 기준 단순 절단', '첫 번째 LLM이 핵심 근거를 요약·압축'],
        choice: 'VARCO-8B가 사고 원인, 재발 방지 조치, 향후 조치에 필요한 내용만 남긴 압축 컨텍스트를 만들게 했습니다.',
        rationale: '단순 절단은 문장 끝의 중요한 안전 정보를 잃을 수 있지만, 작업 목적을 알려 준 요약은 제한된 토큰을 최종 답변에 필요한 근거에 집중할 수 있었습니다.',
        implementation: ['검색 Top 3 근거 결합', 'VARCO-8B task-aware summary', '압축 결과를 다음 pass의 입력으로 전달'],
      },
      {
        label: '03 · TWO-PASS DESIGN',
        title: '요약하는 모델과 최종 답변을 쓰는 모델의 책임을 분리했습니다.',
        trigger: '한 모델이 긴 근거 선택과 형식에 맞는 답변 작성을 동시에 수행하면 누락 원인이 검색인지 생성인지 구분하기 어려웠습니다.',
        options: ['VARCO 단일 생성', '더 큰 모델 하나로 교체', 'VARCO context pass + Qwen answer pass'],
        choice: 'VARCO는 컨텍스트 압축, Qwen2.5-14B는 압축 근거를 이용한 최종 생성에 집중시켰습니다.',
        rationale: '첫 단계는 정보 보존, 두 번째 단계는 중복 제거와 형식 준수라는 서로 다른 평가 기준으로 확인할 수 있었습니다.',
        implementation: ['Llama-VARCO-8B-Instruct first pass', 'Qwen2.5-14B-Instruct second pass', 'Qwen 8-bit 양자화'],
      },
      {
        label: '04 · OUTPUT CONTRACT',
        title: '최종 프롬프트를 제출 형식 계약으로 사용했습니다.',
        trigger: '근거가 맞아도 서론, 사고 원인 분석, “제안합니다” 같은 문장이 붙으면 요구된 출력 범위를 벗어났습니다.',
        options: ['자유 생성 후 수작업 정리', '정규식 후처리', '허용 내용과 금지 문구를 프롬프트에 고정'],
        choice: 'Qwen이 재발방지대책과 향후조치만 작성하도록 허용 범위와 출력 길이를 제한했습니다.',
        rationale: '내용 선택은 첫 pass에서, 형식 준수는 둘째 pass에서 확인해 오류가 생긴 단계를 분리할 수 있었습니다.',
        implementation: ['서론·배경·원인 분석 금지', '대책과 계획만 출력', '낮은 temperature와 길이 제한'],
      },
    ],
    system: [
      { label: '01', title: 'Retrieve', body: 'train QA에서 현재 사고와 유사한 상위 3개 사례를 찾습니다.', tech: 'ko-sbert · FAISS' },
      { label: '02', title: 'Compress', body: 'VARCO가 세 사례에서 현재 사고에 필요한 원인과 대응 근거만 요약합니다.', tech: 'VARCO-8B · first pass' },
      { label: '03', title: 'Transfer', body: '압축된 컨텍스트를 두 번째 모델의 입력 계약에 맞춰 전달합니다.', tech: 'context handoff' },
      { label: '04', title: 'Generate', body: 'Qwen이 압축 근거를 바탕으로 최종 재발방지대책과 향후조치를 생성합니다.', tech: 'Qwen2.5-14B · int8' },
    ],
    evidence: [
      {
        label: 'TWO-LLM CONTEXT FLOW',
        image: 'assets/project-previews/hansol-2pass-flow.svg',
        alt: '유사 QA 검색 결과를 VARCO가 압축하고 Qwen이 최종 건설 안전 대응책을 만드는 연결 구조',
        title: '컨텍스트 한도를 모델 간 역할 분리로 해결했습니다.',
        body: 'FAISS가 관련 근거를 좁히고 VARCO가 세 사례를 짧은 작업 컨텍스트로 압축합니다. Qwen은 원문 전체가 아니라 이 압축본을 받아 최종 답변에 집중하므로, 제한된 토큰을 중복 문장보다 안전 조치에 사용할 수 있습니다.',
        source: '2-pass generation architecture · VARCO context pass → Qwen answer pass',
      },
    ],
    validation: {
      verified: ['ko-sbert와 FAISS로 상위 3개 유사 QA를 검색했습니다.', 'VARCO 컨텍스트 pass와 Qwen 최종 answer pass를 순차 연결했습니다.', '두 번째 모델은 8-bit로 로드해 메모리 부담을 줄였습니다.', '대회 Private 12위 / 24팀을 기록했습니다.'],
      boundary: ['요약 단계가 사고 조건이나 핵심 안전 정보를 빠뜨리면 두 번째 모델이 이를 복구하기 어렵습니다.', '두 LLM의 순차 실행은 단일 모델보다 지연과 메모리 전환 비용이 큽니다.', '대회 점수만으로 실제 현장의 법규 적합성이나 안전성을 보장할 수 없습니다.'],
      next: ['압축 전후 핵심 근거 보존율과 토큰 절감률을 같은 평가셋에서 측정합니다.', '1-pass와 2-pass의 품질·latency·GPU 메모리를 함께 비교합니다.', '최종 문장마다 어떤 검색 사례에서 나온 내용인지 추적 가능한 인용을 붙입니다.'],
    },
    handoff: {
      from: '알고리즘 훈련에서 익힌 단계 분해를 처음으로 생성형 AI 파이프라인에 적용했습니다.',
      to: '검색·압축·최종 생성의 책임을 나눈 경험은 금융 RAG에서 후보 검색과 BGE 리랭킹을 별도 품질 단계로 설계하는 기반이 됐습니다.',
    },
    resources: [
      { label: 'REPOSITORY', title: 'Construction Safety AI', url: 'https://github.com/JM-KIMM/Construction-Safety-AI-2-Pass-Generation', external: true },
      { label: 'OFFICIAL', title: '한솔데코 시즌3 생성 AI 경진대회', url: 'https://dacon.io/competitions/official/236455/overview/description', external: true },
    ],
  },
}
