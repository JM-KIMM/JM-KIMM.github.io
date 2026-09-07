# 김진명 포트폴리오

프로젝트와 활동을 문제 정의, 설계 판단, 구현, 검증의 흐름으로 정리한 반응형 포트폴리오입니다.

## 로컬 실행

```bash
npm ci
npm run dev
```

프로덕션 빌드는 `npm run build`로 생성하며 결과물은 `dist/`에 저장됩니다.

## 내용 수정

- `src/data/caseStudies.ts`: 프로젝트 상세 문구, 시도와 선택, 결과, 그림·표, 출처 링크
- `src/data/projects.ts`: 프로젝트 이름, 기간, 역할, 정렬 날짜, 카드 이미지
- `src/data/activities.ts`: Activities 내용과 About에 함께 표시하는 교육·활동 기간
- `src/data/aboutRecords.ts`: About의 학력·연구·수상 기록
- `src/pages/ProjectPage.tsx`: 상세 페이지의 배치와 섹션 구성
- `src/styles/project-detail.css`: 상세 페이지 글자 크기, 간격, 반응형·테마 스타일
- `src/styles.css`의 `--max`: 사이트 공통 최대 가로 폭
- `public/docs/cj-algorithm-note.html`: CJ 알고리즘 해설 문서의 내용과 별도 스타일

실험 기록이 있는 항목은 `basis: 'experiment'`, 설계상 고려한 문제는 `basis: 'design'`으로 구분합니다.
비교 조건과 결과가 확인되지 않는 실패 횟수나 성능 개선 수치는 추가하지 않습니다.
이미지는 `figures`에 한 번 등록하고 `overviewFigure` 또는 각 선택의 `figure`로 연결합니다.
연구 이후 서비스 구현처럼 본 작업과 구분할 내용은 `followUp`에 작성하며, 해당 프로젝트의 시연 영상도 그 아래에 표시합니다.
`npm run test:details`는 7개 상세 경로, 데이터·자료 링크, 중복 이미지, 테마 텍스트 대비를 점검합니다.
이 검사는 실제 브라우저의 레이아웃·사용자 상호작용 검사를 대체하지 않습니다.
About과 Activities는 `sortKey` 기준 최근순으로 표시합니다. 활동은 확인된 종료 시점을 사용하고, 학기 단위 기록은 정렬용 종료 월만 지정합니다. 정확한 날짜를 모르는 기록에 임의 날짜를 표시하지 않으며, 날짜 미상 수상은 마지막에 둡니다.

## GitHub Pages 배포

이 저장소는 `main` 브랜치에 변경 사항이 올라오면 GitHub Actions가 자동으로 빌드하고 Pages에 배포합니다.

1. GitHub에 `JM-KIMM.github.io`라는 public 저장소를 생성합니다.
2. 이 프로젝트를 해당 저장소의 `main` 브랜치에 push합니다.
3. 저장소의 `Settings → Pages → Build and deployment → Source`를 `GitHub Actions`로 설정합니다.
4. Actions의 `Deploy portfolio to GitHub Pages`가 완료되면 `https://jm-kimm.github.io/`에서 확인합니다.

라우팅은 GitHub Pages 새로고침 오류를 피하도록 `HashRouter`를 사용합니다.
