# 김진명 포트폴리오

프로젝트와 활동을 문제 정의, 설계 판단, 구현, 검증의 흐름으로 정리한 반응형 포트폴리오입니다.

## 로컬 실행

```bash
npm ci
npm run dev
```

프로덕션 빌드는 `npm run build`로 생성하며 결과물은 `dist/`에 저장됩니다.

## GitHub Pages 배포

이 저장소는 `main` 브랜치에 변경 사항이 올라오면 GitHub Actions가 자동으로 빌드하고 Pages에 배포합니다.

1. GitHub에 `JM-KIMM.github.io`라는 public 저장소를 생성합니다.
2. 이 프로젝트를 해당 저장소의 `main` 브랜치에 push합니다.
3. 저장소의 `Settings → Pages → Build and deployment → Source`를 `GitHub Actions`로 설정합니다.
4. Actions의 `Deploy portfolio to GitHub Pages`가 완료되면 `https://jm-kimm.github.io/`에서 확인합니다.

라우팅은 GitHub Pages 새로고침 오류를 피하도록 `HashRouter`를 사용합니다.
