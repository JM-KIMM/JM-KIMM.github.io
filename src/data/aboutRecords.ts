import { learningActivities } from './activities'
import { newestFirst } from './chronology'
import { projects } from './projects'

export type AboutRecord = { sortKey: string; period: string; name: string; detail: string }

const research = projects.find(project => project.slug === 'undergraduate-research-smishing')!

// 교육 프로그램의 명칭·기간은 Activities와 같은 원본을 사용합니다.
export const educationRecords: AboutRecord[] = newestFirst([
  { sortKey: '2026-08', period: '2026.08', name: '인하대학교', detail: '인공지능공학과 졸업' },
  { sortKey: research.sortKey, period: research.period, name: research.detailTitle, detail: research.title },
  ...learningActivities.map(activity => ({
    sortKey: activity.sortKey,
    period: activity.period,
    name: activity.title.replace(/ · \d{4}-[12]$/, ''),
    detail: activity.aboutDetail ?? activity.role,
  })),
])

export const awardRecords: AboutRecord[] = newestFirst([
  { sortKey: '', period: '군', name: '제6회 육군창업경진대회', detail: '창의상' },
  { sortKey: '2025-03', period: '2025.03', name: '건설공사 사고 예방 및 대응책 생성 : 한솔데코 시즌3 생성 AI 경진대회', detail: 'Private 12위 / 24팀' },
  { sortKey: '2025-06', period: '2025-1', name: '인하-동동(同動)', detail: '우수상 · 팀원' },
  { sortKey: '2025-08', period: '2025.08', name: '2025 SW중심대학 디지털 경진대회 · AI부문', detail: '58위 / 271팀 · 팀장' },
  { sortKey: '2025-09', period: '2025.09', name: '2025 금융 AI Challenge : 금융 AI 모델 경쟁', detail: 'Private 6위 / 283팀 · 팀장' },
  { sortKey: '2026-06', period: '2026.06', name: '인공지능 종합설계', detail: '장려상' },
  { sortKey: '2026-07', period: '2026.07', name: 'CJ대한통운 미래기술챌린지 2026', detail: '최종 리더보드 4위' },
  { sortKey: '2026-09', period: '2026.09', name: '2026 인하 인공지능 챌린지', detail: '우수상 · 팀장' },
])
