const contacts = [
  { label: 'EMAIL', value: 'wlsahd1330@naver.com', href: 'mailto:wlsahd1330@naver.com' },
  { label: 'GITHUB', value: 'github.com/JM-KIMM', href: 'https://github.com/JM-KIMM' },
  { label: 'HUGGING FACE', value: 'huggingface.co/jmjmjm3', href: 'https://huggingface.co/jmjmjm3' },
  { label: 'DACON', value: 'JinM_KIM', href: 'https://dacon.io/myprofile/506325/competition' },
]

export default function ContactPage() {
  return (
    <section className="page page-pad contact-page">
      <div className="contact-hero">
        <p className="eyebrow">CONTACT</p>
        <h1>Contact.</h1>
      </div>

      <div className="contact-grid">
        {contacts.map((contact) => (
          <a key={contact.label} href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
            <small>{contact.label}</small>
            <b>{contact.value}</b>
            <i aria-hidden="true">↗</i>
          </a>
        ))}
      </div>
    </section>
  )
}
