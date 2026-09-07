// 상세 문구·실험 기록·이미지·표를 이 파일에서 관리합니다.
export type CaseSource = { title: string; url: string }
export type CaseDecision = {
  title: string
  basis: 'experiment' | 'design'
  situation: string
  approach: string
  expectation: string
  outcome: string
  implementation: string[]
  source: CaseSource
  figure?: string
}
export type CaseFigure = {
  id: string
  title: string
  caption: string
  source: CaseSource
} & (
  | { kind: 'image'; image: string; alt: string; presentation?: 'diagram' | 'document' | 'frame' }
  | { kind: 'table'; columns: string[]; rows: string[][]; note: string }
)
export type CaseStudy = {
  cardLine: string
  lede: string
  ownershipNote: string
  problem: string
  result: string
  decisions: CaseDecision[]
  flow: { title: string; detail: string }[]
  figures: CaseFigure[]
  overviewFigure?: string
  limitations: string[]
  reflection: string
  scopeNote?: string
  resources: CaseSource[]
}

const inha = 'https://github.com/JM-KIMM/inha_worldmodel'
const cj = 'https://github.com/JM-KIMM/CJ-Challenge-CCTV'
const finance = 'https://github.com/JM-KIMM/RAG-based-Financial-Security-LLM'
const chef = 'https://github.com/JM-KIMM/VisionChef'
const seongnam = 'https://github.com/JM-KIMM/seongnam'
const hansol = 'https://github.com/JM-KIMM/Construction-Safety-AI-2-Pass-Generation'
const experiments = { title: '실험 기록', url: `${inha}/blob/main/docs/EXPERIMENTS.md` }
const solution = { title: '최종 학습·추론 구성', url: `${inha}/blob/main/SOLUTION.md` }
const cjTraining = { title: '라벨링·학습 과정', url: `${cj}/blob/main/train_src/README.md` }
const paper = { title: '연구 논문', url: 'docs/smishing-paper.pdf' }
const report = { title: '대회 제출 자료', url: 'docs/financial-rag.pdf' }
const chefServer = { title: '에이전트 코드', url: `${chef}/blob/main/Web/Backend/server.py` }
const weighting = { title: '가중치·군집 비교 실험', url: `${seongnam}/blob/main/analysis/notebooks/02_commercial_area_clustering.ipynb` }

export const caseStudies: Record<string, CaseStudy> = {
  'inha-world-model': {
    cardLine: '로봇의 관절 명령에 따른 영상을 생성하고 학습·추론 설정을 비교해 우수상을 받았습니다.',
    lede: '초기 이미지 한 장과 로봇 관절 명령으로 이후 16프레임을 생성하는 World Model을 학습했습니다.',
    ownershipNote: '3인 팀의 팀장으로 액션 조건부 모델의 학습·추론과 재현 파이프라인을 담당했습니다.',
    problem: '사전학습 모델의 액션 입력 구조가 대회 로봇과 달랐습니다. 16GB GPU에서 학습하고, 기준 장비의 학습 4일·216개 영상 추론 1시간 제한을 고려해야 했습니다.',
    result: '2026 인하 인공지능 챌린지 우수상. 최종 Public 0.187244, Private 0.21395를 기록했습니다. 점수는 낮을수록 좋습니다.',
    decisions: [
      {
        title: '액션 입력 구조와 학습 범위 조정', basis: 'design',
        situation: '사전학습 액션 임베더는 7축 입력을 받지만 SO-100 로봇은 6축입니다. 16개의 관절 명령도 영상의 4개 잠재 시점에 대응시켜야 했습니다.',
        approach: '첫 액션 레이어를 6축에 맞춰 초기화하고 16×6 명령을 4×24로 재배열했습니다. Cosmos-Predict2.5-2B는 동결하고 액션 임베더와 LoRA만 학습했습니다.',
        expectation: '연속된 네 명령을 각 잠재 시점에 전달해 동작 순서를 반영하고, 전체 모델 학습에 필요한 메모리를 줄이고자 했습니다.',
        outcome: '학습 대상을 113.4M 파라미터로 구성해 16GB 환경에서 학습했습니다. 이 입력 구조와 LoRA를 최종 제출 모델에도 사용했습니다.',
        implementation: ['첫 액션 레이어 재초기화·두 번째 레이어 가중치 재사용', 'LoRA rank 32 · attention·MLP에 적용', 'VAE 잠재값 104,828개 사전 계산'], source: solution,
      },
      {
        title: '학습을 늘렸지만 점수가 악화된 실험', basis: 'experiment',
        situation: '학습을 더 하면 성능이 나아지는지 확인하기 위해 95,500회에서 115,500회 샘플 노출까지 연장했습니다. 목적함수·샘플러·조건 표현·추론 설정을 유지했지만 Public 점수는 0.187244에서 0.216628로 악화됐습니다.',
        approach: '연장한 체크포인트를 제외하고 95,500회 시점으로 되돌렸습니다. 별도로 진행한 균등 샘플링 실험도 개선되지 않아 최종 구성에서 제외했습니다.',
        expectation: '추가 학습의 효과를 다른 변경과 분리하고, 검증 손실 감소만으로 최종 모델을 선택하지 않으려 했습니다.',
        outcome: '최종 모델은 95,500회 시점으로 확정했습니다. 학습 길이만 늘린 실험과 샘플링을 변경한 실험을 서로 다른 사례로 기록했습니다.',
        implementation: ['체크포인트별 동일 추론 설정 비교', '학습 길이와 샘플링 변경 실험 분리', '점수 악화 시 이전 체크포인트 채택'], source: experiments, figure: 'training',
      },
      {
        title: '후보 선택과 자체 평가 지표의 한계', basis: 'experiment',
        situation: '영상 두 개를 생성하고 자체 액션 판독기로 후보를 고르는 Best-of-N을 실험했습니다. 검증 데이터에서는 가능성이 있었지만 제출 점수는 기준 0.1925에서 0.212616으로 나빠졌습니다. 자체 시각 지표도 공식 평가 순서를 재현하지 못했습니다.',
        approach: '후보 선택을 최종 추론에서 제거했습니다. 자체 지표를 공식 점수 대신 사용하지 않고, 점수를 아는 구성끼리 비교해 지표가 모델 선택에 유효한지 먼저 확인했습니다.',
        expectation: '검증 데이터에 유리했던 기준이 제출 데이터에서도 통하는지 확인하고, 잘못된 지표에 맞춘 추가 실험을 줄이려 했습니다.',
        outcome: '최종 추론은 후보 판독기 없이 단일 시드로 실행합니다. 후보 선택 실패를 생성 모델 자체의 학습 효과와 구분했습니다.',
        implementation: ['2개 후보 생성·자체 판독기 선택', '공식 점수와 자체 지표의 순위 대조', 'Best-of-N 제외·단일 시드 추론'], source: experiments,
      },
      {
        title: '추론 횟수와 가이던스 선택', basis: 'experiment',
        situation: '액션 CFG는 일부 설정에서 점수를 낮췄지만 강도를 높이거나 다른 가이던스와 결합한다고 계속 개선되지는 않았습니다. 추가 순전파와 샘플링은 추론 시간도 늘렸습니다.',
        approach: '설정별 점수와 시간을 비교해 오토가이던스 0.6과 30-step FlowUniPC를 선택했습니다. 액션 CFG와 후보 평균은 최종 구성에서 제외했습니다.',
        expectation: '명령에 따른 움직임을 반영하면서도 216개 영상을 제한 시간 안에 생성할 수 있는 설정을 찾고자 했습니다.',
        outcome: '오토가이던스 0.6에서 20→30스텝 변경 시 Public 점수가 0.189244에서 0.187244로 낮아졌습니다. 최종 구성의 로컬 영상 생성 시간은 216개 기준 57.9분입니다.',
        implementation: ['오토가이던스 0.6·FlowUniPC 30스텝', '첫 잠재 프레임을 입력 이미지로 고정', '단일 시드·yuv420p·6fps'], source: solution,
      },
    ],
    flow: [{ title: '입력 정리', detail: '이미지·16×6 관절 명령' }, { title: '잠재 표현', detail: 'VAE·4×24 액션 대응' }, { title: '모델 학습', detail: 'Cosmos·LoRA·액션 임베더' }, { title: '영상 생성', detail: '오토가이던스·30스텝' }],
    overviewFigure: 'architecture',
    figures: [
      { id: 'architecture', kind: 'image', image: 'assets/project-previews/inha-world-model-flow.svg', alt: '초기 이미지와 관절 명령이 액션 임베더와 Cosmos LoRA를 거쳐 영상이 되는 구조', presentation: 'diagram', title: '입력과 모델 구성', caption: '관절 명령을 잠재 시점에 대응시키고 첫 프레임은 입력 이미지로 고정합니다.', source: solution },
      { id: 'training', kind: 'table', title: '학습 길이만 변경한 비교', columns: ['샘플 노출', 'Public 점수', '선택'], rows: [['95,500회', '0.187244', '최종 채택'], ['115,500회', '0.216628', '제외']], note: '낮을수록 좋음. 목적함수·샘플러·조건 표현·추론 설정을 유지한 비교입니다.', caption: '추가 학습이 평가 성능 향상으로 이어지지 않아 이전 체크포인트를 선택했습니다.', source: experiments },
    ],
    limitations: ['데이터 정제·움직임 가중·보조손실을 함께 바꾼 구간은 각 요소의 독립적인 효과를 분리할 수 없습니다.', 'Public과 Private 점수에 차이가 있어 특정 검증 구간의 개선을 일반화 성능으로 단정하지 않았습니다.'],
    reflection: '이 프로젝트에서는 학습량보다 모델을 고르는 기준이 중요했습니다. 실패한 실험도 비교 조건과 함께 남겨 다음 변경을 채택할지 판단하는 데 사용했습니다.', resources: [solution, experiments],
  },
  'cj-logistics-3d-box': {
    cardLine: '박스·레일 데이터를 직접 라벨링하고 CCTV 영상에서 박스 수량과 실제 크기를 추정했습니다.',
    lede: '카메라 정보가 없는 컨베이어 CCTV에서 박스의 개수와 가로·세로·높이를 추정했습니다.',
    ownershipNote: '팀 프로젝트에서 AnyLabeling을 이용한 박스·레일 윤곽과 꼭짓점 라벨링, 학습·추론 파이프라인, ONNX 평가 패키지를 담당했습니다.',
    problem: '영상별 크기 정답은 있었지만 픽셀 라벨과 카메라 파라미터는 없었습니다. 원근과 가림 때문에 화면의 픽셀 크기나 검출 개수를 그대로 사용할 수 없었습니다.',
    result: '최종 리더보드 4위를 기록했습니다. 분할·꼭짓점·수량·크기 모델을 ONNX로 변환해 오프라인 평가 환경에서 실행했습니다.',
    decisions: [
      {
        title: '직접 라벨링한 윤곽과 꼭짓점', basis: 'design',
        situation: '영상별 크기 목록만으로는 어느 픽셀이 박스·레일인지, 어느 점이 꼭짓점인지 학습시킬 수 없었습니다. 사각형 검출 영역만으로도 실제 변의 길이를 구분하기 어려웠습니다.',
        approach: 'AnyLabeling에서 box·rail 두 클래스의 polygon을 자동 사전 라벨링한 뒤 수동 보정했습니다. 꼭짓점은 윗면·밑면, 앞·뒤, 좌·우의 8개 위치를 고정하고 보이는 점을 직접 클릭했습니다. 박스 ID로 윤곽과 꼭짓점 라벨을 연결했습니다.',
        expectation: '윤곽으로 레일 경계와 실루엣을, 꼭짓점으로 각 변의 위치를 학습시키려 했습니다. 가려진 점에 임의의 정답 좌표를 넣지 않는 것도 중요했습니다.',
        outcome: 'YOLO11l-seg와 YOLO11l-pose용 라벨을 구축했습니다. 검출에서 놓친 프레임은 영상 검수로 찾아 학습셋에 추가한 뒤 재학습했습니다.',
        implementation: ['윤곽 자동 초안 → 수동 보정 → YOLO 형식 변환', '박스 ID로 polygon·keypoint 연결', '보이는 점 visibility=2·미라벨 점=0으로 손실 계산에서 제외', '라벨링한 꼭짓점이 3개 미만인 박스는 pose 학습셋에서 제외'], source: { title: '꼭짓점 라벨 변환 코드', url: `${cj}/blob/main/train_src/convert_v2_boxid_bbox.py` },
      },
      {
        title: '원근과 가림을 나누어 처리', basis: 'design',
        situation: '고정 픽셀–cm 비율은 화면 위치에 따른 원근 차이를 반영하지 못합니다. 가림으로 추적 ID가 끊기거나 먼 박스를 놓치면 검출·추적 개수도 실제 통과 개수와 달라질 수 있습니다.',
        approach: '실제 폭 62.3cm인 레일의 양쪽 경계로 위치별 단위 비율을 계산했습니다. 크기에는 실루엣·꼭짓점·시간에 따른 변화를 사용하고, 개수는 검출 시계열·원거리 확대·역방향 추적 통계로 별도 회귀했습니다.',
        expectation: '크기 오차와 개수 오차를 구분하고, 한 프레임에서 보이지 않는 박스를 다른 시점의 관측으로 보완하려 했습니다.',
        outcome: '31차원 특징의 Ridge 수량 모델과 27차원 특징의 크기 추정 경로를 구현했습니다. 두 경로의 출력을 결합해 박스별 크기 목록을 생성했습니다.',
        implementation: ['Huber 직선 적합·loc_scale(x, y)', '정·역방향 추적·원거리 2배 확대 검출', '실루엣·8-corner pose·깊이축 보정'], source: { title: '측정 알고리즘', url: cj }, figure: 'calibration',
      },
      {
        title: '학습과 제출 코드의 계산 일치', basis: 'design',
        situation: '여러 모델을 연결하면 학습 때의 특징과 제출 코드의 특징이 달라질 위험이 있습니다. 같은 측정값도 전처리나 변환이 다르면 최종 결과가 달라질 수 있습니다.',
        approach: '학습 스크립트가 추론 main.py의 특징 함수를 재사용하게 했습니다. 크기를 부피 스케일과 형태 비율로 분리하고, 원본 모델과 ONNX 출력의 차이를 검증했습니다.',
        expectation: '학습–추론 불일치를 줄이고 제출 환경에서도 검증한 계산 과정을 유지하려 했습니다.',
        outcome: '공개 재현 문서에 교차검증과 ONNX 출력 비교 통과가 기록돼 있습니다. 최종 추론은 인터넷 연결 없이 평가용 모델 파일만 사용합니다.',
        implementation: ['수량·크기 회귀의 GroupKFold 검증', 'Huber+GBR·TabM 크기 추정 결합', '공통 특징 함수·shape-volume 변환', 'ONNX opset 17·출력 비교'], source: cjTraining,
      },
    ],
    flow: [{ title: '라벨링·학습', detail: '박스·레일 윤곽 / 꼭짓점' }, { title: '측정·추적', detail: '단위 보정 / 시간축 연결' }, { title: '수량·크기', detail: 'Ridge / 기하 특징·앙상블' }, { title: '결과 결합', detail: '크기 목록 / ONNX 추론' }],
    overviewFigure: 'measurement',
    figures: [
      { id: 'measurement', kind: 'image', image: 'assets/project-evidence/cj-size-inference.jpg', alt: '박스·레일 분할과 꼭짓점으로 계산한 가로·세로·높이 추론 결과', presentation: 'frame', title: '분할과 꼭짓점 기반 크기 측정', caption: '왼쪽은 분할·원거리 재탐지 영역, 오른쪽은 꼭짓점으로 계산한 변 길이입니다. 학습용 정답 라벨이 아니라 모델의 추론 결과입니다.', source: { title: '알고리즘 해설', url: 'docs/cj-algorithm-note.html#s5' } },
      { id: 'calibration', kind: 'image', image: 'assets/project-evidence/cj-calibration-v2.jpg', alt: '레일 실제 폭으로 화면 위치별 픽셀 단위를 보정하는 과정', presentation: 'document', title: '화면 위치에 따른 길이 보정', caption: '레일 양쪽 경계의 픽셀 폭과 실제 폭 62.3cm로 해당 위치의 변환 비율을 계산합니다.', source: { title: '알고리즘 해설 · 길이 환산', url: 'docs/cj-algorithm-note.html#s2' } },
    ],
    limitations: ['카메라가 고정되고 레일이 충분히 보이는 조건을 가정합니다. 새 시점에서는 보정값을 다시 검증해야 합니다.', '검출 단계별 변경 전후 개선 수치는 공개 자료만으로 확인되지 않아 전체 순위와 구분했습니다.'],
    reflection: '라벨링에서 측정값과 최종 출력까지 연결하면서, 모델을 바꾸기 전에 어느 단계에서 오차가 생기는지 확인할 수 있어야 한다는 기준을 세웠습니다.', resources: [cjTraining, { title: '알고리즘 해설', url: 'docs/cj-algorithm-note.html' }],
  },
  'undergraduate-research-smishing': {
    cardLine: '한국어 메시지를 라벨링하고 판단 근거를 추가해 스미싱 탐지 모델을 비교했습니다.',
    lede: '한국어 메시지 18,270건으로 스미싱 탐지 데이터셋을 구축하고, 분류 성능과 판단 근거 제공을 연구했습니다.',
    ownershipNote: '메시지 라벨링·데이터 구조 정의, GPT-4o 판단 근거 생성, 벤치마크, EXAONE 학습과 설명형 탐지 데모를 담당했습니다.',
    problem: '정상·스미싱 라벨만으로는 판단 이유까지 학습하기 어렵습니다. 실제 정상 알림과 사칭 문자의 표현이 겹친다는 점도 데이터 구성에서 고려해야 했습니다.',
    result: '18,270건의 말뭉치를 구성해 데이터셋을 공개했습니다. 논문 벤치마크에서 CNN Accuracy 0.9908, EXAONE 0.9261을 기록했습니다.',
    decisions: [
      {
        title: '정상 문자와 사칭 문자를 구분하는 라벨링', basis: 'design',
        situation: '정상 결제·배송 알림에도 URL과 금액이 들어갑니다. 특정 단어만 기준으로 삼거나 스팸·광고를 스미싱과 묶으면 정상 문자를 잘못 차단할 수 있습니다.',
        approach: 'KISA에서 실제 공격 사례로 분류된 문자와 개인 모바일 기기·공공자료 등에서 수집한 정상 문자를 구분했습니다. 광고·마케팅을 스미싱과 구별하고, 분류 라벨과 별도로 8개 메시지 유형을 정리했습니다.',
        expectation: '같은 유형의 정상·스미싱을 대조해 단어뿐 아니라 사칭 맥락과 요구 행동을 학습할 수 있는 데이터를 만들고자 했습니다.',
        outcome: '정상·스미싱을 포함한 18,270건의 말뭉치를 구성했습니다. 결제·공공기관·택배 등 유형별 사례 비교는 논문 Table 1에 정리했습니다.',
        implementation: ['KISA 연구 목적 승인 후 최근 5개년 공격 사례 수집', '실제 문자·일상 대화에서 정상 데이터 확보', '정상·스미싱 label과 메시지 type 구분', '정상 안내와 사칭 문자의 표현·요구 행동 대조'], source: { ...paper, url: `${paper.url}#page=2` },
      },
      {
        title: '분류 라벨에 판단 근거를 추가', basis: 'design',
        situation: '이진 분류만 출력하면 어느 표현 때문에 위험하다고 판단했는지 전달하기 어렵습니다. 이를 설명하는 모델을 학습시키려면 메시지별 설명 데이터가 필요했습니다.',
        approach: 'GPT-4o 시스템 프롬프트에 금융 보안 전문가 역할, 스미싱 정의, 기관·자녀 사칭과 미납 벌금 사례, 예방 수칙을 넣었습니다. 생성한 판단 근거는 explanation 필드로 저장했습니다.',
        expectation: '일반적인 경고 문구가 아니라 원문에 대응하는 이유를 생성하고, EXAONE이 분류와 설명을 함께 학습하게 하려 했습니다.',
        outcome: '원문·라벨·유형·설명을 함께 구성해 EXAONE 학습에 사용했습니다. 메시지 라벨링과 GPT-4o 설명 생성을 별도 작업으로 구분했습니다.',
        implementation: ['도메인 정의·공격 사례·예방 수칙을 프롬프트에 제공', 'GPT-4o로 explanation 생성', '분류 결과와 설명을 포함한 EXAONE 학습 데이터 구성'], source: { ...paper, url: `${paper.url}#page=3` }, figure: 'annotation',
      },
      {
        title: '생성형 모델이 분류에서도 더 좋은가', basis: 'experiment',
        situation: '판단 근거를 생성하는 기능과 정확히 분류하는 성능은 별개입니다. 생성형 모델이 작은 분류 모델보다 분류까지 잘하는지 벤치마크로 비교했습니다.',
        approach: 'CNN, FastText, KcELECTRA, EXAONE, Gemini, ChatGPT를 평가하고 Accuracy와 Macro F1을 함께 확인했습니다.',
        expectation: '설명 기능만 보고 모델을 선택하지 않고 탐지 성능과 설명 제공의 역할을 구분할 근거를 얻고자 했습니다.',
        outcome: 'CNN Accuracy는 0.9908, EXAONE은 0.9261로 CNN이 더 높았습니다. 생성형 모델의 설명 기능이 더 높은 분류 정확도를 보장하지는 않았습니다.',
        implementation: ['Accuracy·Macro F1·클래스별 Precision/Recall 비교', '모델별 학습·평가 조건 확인', '분류 지표와 설명 정확성을 별도 평가 대상으로 정리'], source: { ...paper, url: `${paper.url}#page=4` }, figure: 'benchmark',
      },
    ],
    flow: [{ title: '수집·라벨링', detail: '정상 / 스미싱 / 메시지 유형' }, { title: '설명 생성', detail: '도메인 프롬프트·GPT-4o' }, { title: '학습·비교', detail: '분류 모델·EXAONE' }, { title: '데모', detail: '분류 결과와 판단 이유' }],
    figures: [
      { id: 'annotation', kind: 'image', image: 'assets/project-evidence/smishing-dataset-v2.jpg', alt: 'GPT-4o 설명 생성 구조와 정상·스미싱 사례 비교표', presentation: 'document', title: '라벨링 기준과 설명 생성', caption: 'Fig. 2는 도메인 지식을 포함한 설명 생성 과정, Table 1은 같은 유형의 정상·스미싱 사례 비교입니다.', source: { ...paper, url: `${paper.url}#page=3` } },
      { id: 'benchmark', kind: 'table', title: '모델별 분류 결과', columns: ['모델', 'Accuracy', 'Macro F1'], rows: [['CNN', '0.9908', '0.9900'], ['FastText', '0.9378', '0.9368'], ['KcELECTRA', '0.9289', '0.9247'], ['EXAONE', '0.9261', '0.9217'], ['Gemini', '0.8950', '0.8944'], ['ChatGPT', '0.7079', '0.6786']], note: '높을수록 좋음. 논문 Table 2를 옮긴 표이며 모델별 학습·평가 조건은 원문을 따릅니다.', caption: '분류 성능을 비교한 표입니다. 생성된 설명의 정확성이나 사용자 이해도 평가 결과는 아닙니다.', source: { ...paper, url: `${paper.url}#page=4` } },
    ],
    limitations: ['유사 문장 변형이 포함된 데이터의 분할 성능만으로 새로운 공격 유형에 대한 성능을 보장할 수 없습니다.', '생성된 설명의 정확성과 사용자 이해도는 분류 지표와 별도로 검증해야 합니다.'],
    reflection: '데이터를 만들면서 정답 라벨과 판단 근거가 서로 다른 학습 정보라는 점을 다뤘습니다. 모델을 선택할 때도 분류 성능과 설명 기능을 같은 성과로 취급하지 않게 됐습니다.',
    scopeNote: '공개 GitHub는 연구 소개와 데이터셋 링크를 제공합니다. 전체 학습·서비스 코드가 공개된 저장소는 아닙니다.', resources: [paper, { title: '공개 데이터셋', url: 'https://huggingface.co/datasets/jmjmjm3/kor-smishing-message' }],
  },
  'financial-rag': {
    cardLine: '질문 증강·FAISS 검색·BGE 리랭킹을 연결해 금융보안 질의응답 대회 6위를 기록했습니다.',
    lede: '금융·보안 문서에서 답변 근거를 찾고, BGE 리랭커로 선별한 문서를 사용해 답하는 RAG 시스템을 구성했습니다.',
    ownershipNote: '4인 팀의 팀장으로 데이터 수집·정규화와 검색·리랭킹 파이프라인을 총괄했습니다.',
    problem: '법률·판례·보안 지식이 여러 형식의 문서에 나뉘어 있고 질문과 문서의 표현도 달랐습니다. 근거 검색과 질문 유형별 답변 형식을 함께 다뤄야 했습니다.',
    result: '2025 금융 AI Challenge에서 Private 6위 / 283팀을 기록했습니다. 문서 처리·검색·리랭킹·생성을 합친 시스템 결과입니다.',
    decisions: [
      {
        title: '문서를 검색 가능한 형태로 정리', basis: 'design',
        situation: '지식을 모델에 학습시키는 방식만 사용하면 문서 변경 때 재학습이 필요합니다. 원문을 그대로 검색해도 OCR 오류, 반복 머리말, 조항 분할 방식의 영향을 받을 수 있습니다.',
        approach: '생성 모델을 고정하고 TIFF OCR, PDF 정제, Wikipedia 필터링을 거쳐 공통 청크 형태로 통합했습니다. 출처 정보를 남겨 검색된 문서를 따로 확인할 수 있게 했습니다.',
        expectation: '모델 재학습 대신 문서 교체가 가능하고, 답변 오류를 살필 때 검색 근거부터 확인할 수 있는 구조를 만들려 했습니다.',
        outcome: '법률 9,889개와 Wikipedia 914개 등을 포함한 10,913개 청크를 구성하고 FAISS 검색 인덱스로 통합했습니다.',
        implementation: ['TIFF OCR·PDF 정제', '청크·출처 메타데이터 구성', 'Arctic Embed·FAISS IndexFlatIP'], source: report,
      },
      {
        title: '검색 후보 확보와 리랭킹 분리', basis: 'design',
        situation: '질문 표현 하나로만 검색하면 다른 용어로 쓰인 근거를 놓칠 수 있습니다. 검색 개수만 늘리면 답변과 무관한 문단까지 컨텍스트에 들어갈 수 있습니다.',
        approach: '원문과 같은 지식을 묻는 질문을 추가 생성했습니다. 각 질문에서 최대 50개 후보를 회수하고 유사도 필터와 BGE Cross-Encoder 리랭킹을 거쳐 최종 5개 이하를 선택했습니다.',
        expectation: '질문 증강은 근거 누락을 줄이는 데, 리랭킹은 후보 중 필요한 문서를 고르는 데 사용하고 두 단계의 설정을 따로 조정하려 했습니다.',
        outcome: '최종 제출에는 cosine 0.5와 reranker 0.85의 임계값을 적용하고, 통과한 후보 중 최대 5개를 답변 근거로 사용했습니다.',
        implementation: ['원문·증강 질문 임베딩', 'FAISS 후보 검색·중복 제거·유사도 필터', '질문–문단 쌍을 BGE Cross-Encoder로 재정렬'], source: { ...report, url: `${report.url}#page=11` },
      },
      {
        title: '질문 유형에 맞춘 답변 형식', basis: 'design',
        situation: '객관식에는 선택지 번호가, 주관식에는 간결한 답변이 필요합니다. 근거를 찾았더라도 모델이 서론이나 불필요한 설명을 덧붙이면 제출 형식에 맞지 않을 수 있습니다.',
        approach: '객관식과 주관식 프롬프트를 분리하고 유형별 허용 출력과 길이를 지정했습니다. 검색 결과 조립과 답변 작성을 별도 단계로 구성했습니다.',
        expectation: '문서 검색의 문제와 출력 형식의 문제를 구분하고, 유형별로 답변 형식을 조정하려 했습니다.',
        outcome: '515개 평가 질문을 유형별 프롬프트로 처리하는 제출 파이프라인을 구성했습니다.',
        implementation: ['객관식 선택지 번호·주관식 단문 출력', '16,384 토큰 한도 내 컨텍스트 구성', '역할·제외 문구·출력 길이 명시'], source: report,
      },
    ],
    flow: [{ title: '문서 준비', detail: 'OCR·정제·10,913개 청크' }, { title: '후보 검색', detail: '원문·증강 질문·FAISS' }, { title: '근거 선별', detail: '필터·BGE Cross-Encoder' }, { title: '답변 생성', detail: 'A.X·유형별 프롬프트' }],
    overviewFigure: 'retrieval',
    figures: [{ id: 'retrieval', kind: 'image', image: 'assets/project-previews/financial-rag-flow.svg', alt: '질문 증강·FAISS 검색·필터·BGE 리랭킹·답변 생성 흐름', presentation: 'diagram', title: '질문에서 최종 답변까지', caption: '후보 검색과 질문–문단 재평가를 분리했습니다. 도식은 대회 제출 자료 기준입니다.', source: report }],
    limitations: ['전체 순위만으로 리랭커·질문 증강 각각의 효과를 분리할 수 없습니다. 구성요소별 비교가 추가로 필요합니다.', '검색 근거를 사용하는 구조가 답변의 최신성이나 사실성을 자동 보장하지는 않습니다.'],
    reflection: '한솔에서 컨텍스트를 줄이는 문제를 다뤘다면, 여기서는 필요한 근거가 검색 후보에 들어왔는지를 다뤘습니다. 검색 누락과 생성 오류를 나눠 확인하는 방식으로 작업 범위를 넓혔습니다.',
    scopeNote: '리랭커 설명은 대회 제출 자료 기준입니다. 공개 src/rag_pipeline.py에는 임시 리랭킹 계산이 있어 당시 Cross-Encoder 구현과 차이가 있습니다.', resources: [report],
  },
  visionchef: {
    cardLine: '재료 기반 레시피 검색과 타이머·영상 검색·단계 이동을 음성 에이전트로 연결했습니다.',
    lede: '보유 재료로 레시피를 찾고, 요리 중 음성으로 타이머와 조리 단계를 조작하는 서비스를 개발했습니다.',
    ownershipNote: '4인 팀에서 LLM·RAG를 담당했습니다. 레시피 검색, 도구 호출과 음성 응답 흐름을 구현했으며 CV·프론트엔드는 팀 결과물입니다.',
    problem: '요리 중에는 손을 쓰기 어려워 검색·타이머·단계 확인을 위해 화면을 반복 조작하기 불편합니다. 자연어 답변만으로는 이런 기능을 실제 실행할 수도 없습니다.',
    result: '재료 인식·추천·조리 안내·음성 도구 실행을 연결한 데모를 완성하고 인공지능 종합설계 장려상을 받았습니다.',
    decisions: [
      {
        title: '유사한 레시피와 만들 수 있는 레시피 구분', basis: 'design',
        situation: '“계란”과 “달걀”처럼 같은 재료의 표현이 다를 수 있습니다. 벡터 유사도가 높아도 보유하지 않은 재료가 많이 필요하면 적절한 추천이 아닐 수 있습니다.',
        approach: '동의어 맵으로 재료명을 정규화하고 bge-m3·ChromaDB로 후보를 검색했습니다. 정규화한 재료 집합의 포함 관계와 활용 수로 재정렬했습니다.',
        expectation: '문장 유사도와 실제 재료 조건을 함께 고려해 보유 재료로 만들 수 있는 후보를 우선하려 했습니다.',
        outcome: '벡터 후보 검색 후 재료 조건을 적용하는 경로를 구현해 레시피 추천에 연결했습니다.',
        implementation: ['동의어 정규화', '요청 개수보다 넓은 벡터 후보 검색', '재료 포함 관계·활용 수·유사도 반영'], source: { title: '레시피 검색 코드', url: `${chef}/blob/main/LLM/RAG/rag.py` },
      },
      {
        title: '모델의 답변을 실제 기능 실행에 연결', basis: 'design',
        situation: '“타이머를 설정했습니다”라는 답변만으로 타이머가 실행되지는 않습니다. 자유 형식 출력으로 화면을 바꾸면 잘못된 도구명이나 인자가 전달될 위험도 있습니다.',
        approach: '타이머, 영상 검색, 자막 읽기, 레시피 검색, 단계 이동의 다섯 도구만 허용했습니다. 구조화된 tool_call을 파싱하고 서버가 실행 결과와 화면 변경 정보를 반환하도록 구성했습니다.',
        expectation: '답변과 실행을 구분하고 서버가 검증할 수 있는 범위에서만 기능을 호출하게 하려 했습니다.',
        outcome: '최대 3단계의 실행 루프를 구현했습니다. 발표에서 “사과 써는 법 영상 보여줘” 요청이 영상 검색과 화면 표시로 이어지는 동작을 시연했습니다.',
        implementation: ['도구 allowlist·JSON 파싱·MAX_AGENT_STEPS=3', '타이머·단계 이동을 UI action으로 반환', '양수가 아닌 시간·단계 번호는 재질문', '범위를 넘는 단계 번호는 유효 범위로 보정'], source: chefServer, figure: 'tools',
      },
      {
        title: '도구 호출 누락과 검색 실패 처리', basis: 'design',
        situation: '명시적인 영상 요청에도 모델이 도구를 선택하지 않을 수 있습니다. 벡터 DB나 외부 음성 기능을 사용할 수 없는 상황도 고려했습니다.',
        approach: '명확한 영상 요청인데 첫 응답에 도구 호출이 없으면 규칙 기반 검색을 사용했습니다. 벡터 DB 부재 시 재료 집합 검색, 음성 출력에는 서비스 설정에 따른 대체 경로를 구성했습니다.',
        expectation: '일반 대화는 모델이 처리하되 명확한 기능 요청과 외부 의존성 문제는 별도로 처리해 중단을 줄이고자 했습니다.',
        outcome: '영상 요청의 도구 호출을 보완하고, 벡터 DB 없이도 재료 조건으로 레시피를 찾을 수 있게 했습니다. 음성 기능에도 설정별 대체 경로를 구현했습니다.',
        implementation: ['첫 응답의 영상 의도·도구 호출 검사', '벡터 DB 부재 시 재료 기반 검색', '음성 서비스별 대체 처리'], source: chefServer,
      },
    ],
    flow: [{ title: '재료 확인', detail: '인식 결과·사용자 재료 상태' }, { title: '레시피 검색', detail: '정규화·검색·재료 조건' }, { title: '조리 안내', detail: '레시피·현재 단계·음성' }, { title: '도구 실행', detail: '타이머·영상·자막·단계 이동' }],
    figures: [{ id: 'tools', kind: 'image', image: 'assets/project-evidence/visionchef-agent-ui-v2.jpg', alt: '음성으로 사과 써는 영상을 요청하고 검색 결과를 표시하는 발표 화면', presentation: 'document', title: '음성 요청과 도구 실행', caption: '사용자 요청 → 영상 검색 도구 선택 → 결과 반환 → 화면 표시. 모델 답변뿐 아니라 기능 실행까지 확인한 시연입니다.', source: { title: 'VisionChef 발표 자료', url: 'docs/visionchef-presentation.pdf' } }],
    limitations: ['도구 선택 정확도, 응답 지연, 대체 경로 사용률의 정량 평가가 필요합니다.', '추천 적합도와 실제 사용자 평가는 측정하지 않았습니다. CV 오인식이나 외부 API 실패도 남아 있는 과제입니다.'],
    reflection: '검색 결과를 답변에 사용하는 데서 나아가 모델 출력을 서버 동작과 화면 상태에 연결했습니다. 자연어 응답과 실행 성공을 따로 확인해야 한다는 점을 다뤘습니다.', resources: [{ title: '발표 자료', url: 'docs/visionchef-presentation.pdf' }],
  },
  'seongnam-xai': {
    cardLine: '행정동별 상권 지표를 비교하는 대시보드에 로컬 LLM 해설을 연결했습니다.',
    lede: '성남시 생활상권 지표를 지도와 대시보드로 비교하고, 선택 지역의 결과를 로컬 LLM이 설명하도록 구현했습니다.',
    ownershipNote: '팀장으로 분석 구조를 정리하고 대시보드 근거 데이터 구성과 A.X 로컬 해설 연동을 담당했습니다.',
    problem: '매출 순위만으로는 지역별 조건 차이를 설명하기 어렵습니다. 표준화 점수나 군집 번호도 처음 보는 사용자가 바로 해석하기에는 정보가 부족합니다.',
    result: '24개월의 1,199개 행정동–월 관측치를 탐색하는 FastAPI 대시보드와 로컬 LLM 해설 기능을 구현했습니다.',
    decisions: [
      {
        title: '하나의 순위로 설명하기 어려운 지역 차이', basis: 'design',
        situation: '매출이 크다는 사실만으로 생활수요, 접근성, 소비여력까지 설명할 수는 없습니다. 종합점수가 같아도 세부 조건은 다를 수 있습니다.',
        approach: '월·행정동별 데이터를 통합해 23개 파생지표를 만들고 다섯 관점으로 구성했습니다. 상대 지수와 군집별 특성을 대시보드에 함께 표시했습니다.',
        expectation: '순위뿐 아니라 어떤 지표가 강점·약점에 기여했는지 사용자가 비교할 수 있게 하려 했습니다.',
        outcome: '행정동 검색, 지도, 상·하위 비교와 유형 프로필을 구현했습니다. 첫 달은 49개, 이후는 50개 행정동으로 총 1,199개 관측치를 구성했습니다.',
        implementation: ['월·행정동 키 통합', '비율·밀도 파생지표와 표준화', 'final_index·cluster·세부 지표 병행'], source: { title: '분석 산출물·대시보드', url: seongnam }, figure: 'dashboard',
      },
      {
        title: '엔트로피와 PCA 가중치 비교', basis: 'experiment',
        situation: '가중치 방식에 따라 지표와 군집 결과가 달라졌습니다. 엔트로피 결과만으로 결정하지 않고 PCA 방식과 동일한 k=4 조건에서 비교했습니다.',
        approach: '각 방식의 점수를 K-means에 사용하고 실루엣 점수를 비교했습니다. 군집 내부 유사성과 군집 간 분리를 비교하는 이 실험에서 PCA 점수가 더 높았습니다.',
        expectation: '임의 판단만으로 가중치를 선택하지 않고 같은 군집 조건의 비교 결과를 선택 근거로 삼으려 했습니다.',
        outcome: 'PCA 0.6444, 엔트로피 0.3858을 확인하고 PCA 경로를 사용했습니다. 이 비교는 k=4 실험이며 최종 서비스의 5개 유형과는 구분합니다.',
        implementation: ['PCA·엔트로피 점수 별도 산출', '동일 k=4의 실루엣 비교', '가중치·재표준화 결과를 CSV로 저장'], source: weighting, figure: 'weighting',
      },
      {
        title: '계산은 코드로, 설명은 LLM으로', basis: 'design',
        situation: '군집 번호와 표준화 점수만으로는 비전문가가 의미를 이해하기 어렵습니다. LLM에 계산과 설명을 모두 맡기면 수치나 상대 위치를 잘못 해석할 수도 있습니다.',
        approach: '서버에서 계산한 지수, 상대 위치, 세부 근거를 구조화해 A.X-4.0-Light에 전달했습니다. 모델은 새 수치를 계산하지 않고 지역의 강점·약점과 주의점을 설명하도록 구성했습니다.',
        expectation: '분석 과정을 유지하면서 통계 용어를 직접 해석하지 않아도 수치의 의미를 이해할 수 있게 돕고자 했습니다.',
        outcome: '지도·지표 비교와 로컬 LLM 해설을 한 대시보드에 연결해, 선택 지역의 수치와 해석을 함께 확인할 수 있게 했습니다.',
        implementation: ['FastAPI의 근거 JSON 구성', '단위·상대 위치를 계산 결과에 맞춰 전달', '로컬 A.X·행정동별 자연어 해설'], source: { title: '근거 구성·LLM 해설 코드', url: `${seongnam}/blob/main/server.py` },
      },
    ],
    flow: [{ title: '데이터 통합', detail: '월·행정동·1,199개 관측치' }, { title: '지표 산출', detail: '23개 파생지표·PCA' }, { title: '지도·비교', detail: '상대 지수·5개 유형' }, { title: '해설 생성', detail: '계산된 근거·로컬 A.X' }],
    figures: [
      { id: 'dashboard', kind: 'image', image: 'assets/project-previews/seongnam-xai.jpg', alt: '성남시 행정동 지도와 선택 지역의 지표 비교 화면', presentation: 'frame', title: '선택 지역의 분석 지표 비교', caption: '지역을 선택하면 수치와 유형을 확인합니다. 이 캡처는 해설 생성 전 화면이며 LLM 동작은 상단 시연 영상에서 볼 수 있습니다.', source: { title: '대시보드 코드', url: seongnam } },
      { id: 'weighting', kind: 'table', title: '가중치 방식별 군집 비교', columns: ['가중치 방식', '군집 수', 'Silhouette'], rows: [['PCA', 'k=4', '0.6444'], ['엔트로피', 'k=4', '0.3858']], note: '높을수록 좋음. k=4 비교 결과이며 최종 서비스의 5개 군집 점수는 아닙니다.', caption: '동일 조건에서 PCA가 더 높은 점수를 기록했습니다. 미래 매출이나 사용자 이해도를 평가한 수치는 아닙니다.', source: weighting },
    ],
    limitations: ['지수는 지역 비교용 상대 값이며 미래 매출 예측이나 인과 효과가 아닙니다.', 'k=4 비교와 최종 5개 유형 선택의 근거를 더 명확히 문서화할 필요가 있습니다.', 'LLM 해설이 실제 사용자 이해도를 높였는지는 별도 평가가 필요합니다.'],
    reflection: '스미싱 연구의 판단 근거 문제를 이번에는 수치 해석에 적용했습니다. 설명을 길게 생성하기보다 어떤 계산 결과를 설명해야 하는지 먼저 정리하는 일이 중요했습니다.', resources: [weighting],
  },
  'hansol-2pass': {
    cardLine: '제한된 컨텍스트를 다루기 위해 검색·요약 압축·최종 생성을 두 LLM으로 나눴습니다.',
    lede: '건설 사고와 유사한 사례를 검색하고 두 LLM을 연결해 재발방지대책과 향후조치를 생성했습니다.',
    ownershipNote: '1인 프로젝트로 유사 QA 검색과 VARCO–Qwen 연결 흐름을 구성했습니다. 당시 컨텍스트 입력 제약에 맞춰 중간 내용을 요약·압축했습니다.',
    problem: '사고 정보와 검색 사례를 한 번에 전달할 수 있는 길이에 제한이 있었습니다. 최종 답변에는 배경 설명이 아니라 재발방지대책과 향후조치가 필요했습니다.',
    result: '한솔데코 시즌3 생성 AI 경진대회에서 Private 12위 / 24팀을 기록했습니다.',
    decisions: [
      {
        title: '검색한 사례를 그대로 모두 전달하지 않은 이유', basis: 'design',
        situation: '사고 설명에 유사 사례를 그대로 붙이면 입력이 길어집니다. 앞에서부터 단순히 자르면 현재 사고의 조건이나 필요한 조치를 누락할 수 있다는 문제도 있었습니다.',
        approach: 'ko-sbert·FAISS로 유사 QA 3개를 찾고 VARCO-8B로 필요한 내용을 중간 출력으로 정리했습니다. 이 요약·압축 결과를 Qwen의 최종 생성에 활용했습니다.',
        expectation: '입력 제약 안에서 필요한 사고 조건과 조치를 전달하고 최종 모델이 대책 작성에 사용할 정보를 정리하려 했습니다.',
        outcome: '유사 QA 검색, 중간 정보 요약·압축, 최종 답변 생성을 연결한 구성으로 대회에 제출했습니다.',
        implementation: ['jhgan/ko-sbert-nli·LangChain·FAISS Top 3', 'VARCO 중간 출력·요약 압축', 'Qwen2.5-14B 최종 생성'], source: { title: '2-pass 구성 설명', url: hansol },
      },
      {
        title: '최종 답변의 내용과 형식 제한', basis: 'design',
        situation: '생성 모델은 대책 외에 서론·배경·원인 분석을 덧붙일 수 있습니다. 제출에 필요한 것은 대책과 향후조치였기 때문에 출력 범위를 정해야 했습니다.',
        approach: '포함할 내용과 제외할 문구를 프롬프트에 명시했습니다. 중간 정보를 정리하는 단계와 제출 답변을 작성하는 단계를 분리했습니다.',
        expectation: '중간 출력에서는 근거를, 최종 출력에서는 내용과 형식을 확인하도록 점검 대상을 나누려 했습니다.',
        outcome: '대책·향후조치만 작성하도록 출력 지침을 적용했습니다. 최종 답변의 형식 지침은 공개 rag_chain.py에서도 확인할 수 있습니다.',
        implementation: ['서론·배경·원인 분석 제외 지침', '불필요한 도입 문구 제한', 'Qwen 로더의 8-bit 양자화'], source: { title: '답변 형식 프롬프트', url: `${hansol}/blob/main/src/rag_chain.py` },
      },
    ],
    flow: [{ title: '사례 검색', detail: '현재 사고·유사 QA 3개' }, { title: '중간 정보 정리', detail: 'VARCO·요약 압축' }, { title: '최종 생성', detail: 'Qwen·대책과 향후조치' }],
    overviewFigure: 'two-pass',
    figures: [{ id: 'two-pass', kind: 'image', image: 'assets/project-previews/hansol-2pass-flow.svg', alt: '유사 사례 검색 후 VARCO 중간 출력을 Qwen 최종 생성에 사용하는 구조', presentation: 'diagram', title: '검색부터 최종 생성까지', caption: '당시 두 모델을 연결한 작업 구성입니다. 입력 길이 제한에 맞춰 중간 내용을 요약·압축했습니다.', source: { title: '프로젝트 구성 설명', url: hansol } }],
    limitations: ['압축에서 중요한 조건이 빠지면 최종 모델이 복구하기 어려워 근거 보존율 검증이 필요합니다.', '두 모델의 품질·지연·메모리를 1-pass와 같은 조건에서 비교한 기록은 없습니다.'],
    reflection: '생성 모델의 크기뿐 아니라 전달하는 정보의 양과 구성을 다뤘습니다. 이후 금융 RAG에서는 그 앞 단계인 검색 후보 확보와 근거 선별을 더 세분화했습니다.',
    scopeNote: '두 모델 구성은 당시 작업 경험과 README 기준입니다. 현재 공개 main.py는 첫 모델 결과를 저장하며 Qwen 로더는 있지만 두 번째 호출까지 연결되어 있지 않습니다.', resources: [],
  },
}
