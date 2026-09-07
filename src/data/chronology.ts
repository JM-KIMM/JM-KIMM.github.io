// 종료 시점이 확인된 활동은 종료일, 학기 단위 기록은 해당 학기 종료 월로 정렬합니다.
// sortKey는 정렬용이며 화면에는 확인된 기간만 표시합니다. 날짜 미상은 마지막에 둡니다.
export function newestFirst<T extends { sortKey: string }>(records: readonly T[]): T[] {
  return [...records].sort((a, b) => b.sortKey.localeCompare(a.sortKey))
}
