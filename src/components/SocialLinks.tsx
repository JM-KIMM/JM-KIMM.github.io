const links = [
  { label: 'EMAIL', value: 'wlsahd1330@naver.com', href: 'mailto:wlsahd1330@naver.com', icon: 'mail' },
  { label: 'GITHUB', value: 'JM-KIMM', href: 'https://github.com/JM-KIMM', icon: 'github' },
  { label: 'HUGGING FACE', value: 'jmjmjm3', href: 'https://huggingface.co/jmjmjm3', icon: 'huggingface' },
  { label: 'DACON', value: 'JinM_KIM', href: 'https://dacon.io/myprofile/506325/competition', icon: 'dacon' },
]

function SocialIcon({ name }: { name: string }) {
  if (name === 'huggingface') return <span className="social-symbol" aria-hidden="true">🤗</span>
  if (name === 'dacon') return <span className="social-symbol social-dacon" aria-hidden="true">D</span>

  if (name === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84a9.6 9.6 0 0 1 2.5.34c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

export default function SocialLinks() {
  return (
    <section className="home-socials page-pad" aria-label="외부 링크">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
        >
          <span className="social-icon"><SocialIcon name={link.icon} /></span>
          <span className="social-copy"><small>{link.label}</small><b>{link.value}</b></span>
          <i aria-hidden="true">↗</i>
        </a>
      ))}
    </section>
  )
}
