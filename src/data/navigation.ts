export type PageCategory = {
  id: 'home' | 'about' | 'projects' | 'activities' | 'contact'
  label: string
  path: string
  description: string
}

export const pageCategories: PageCategory[] = [
  { id: 'home', label: 'Home', path: '/', description: '소개와 경험 흐름' },
  { id: 'about', label: 'About', path: '/about', description: '스토리, 교육과 역량' },
  { id: 'projects', label: 'Projects', path: '/projects', description: '프로젝트와 연구' },
  { id: 'activities', label: 'Activities', path: '/activities', description: '교육, 대회와 활동' },
  { id: 'contact', label: 'Contact', path: '/contact', description: '연락처와 외부 채널' },
]

export function getPageTitle(pathname: string) {
  if (pathname.startsWith('/projects/')) return 'Project · 김진명'
  const category = pageCategories.find((item) => item.path === pathname)
  return category ? `${category.label} · 김진명` : '김진명 · AI Engineer'
}
