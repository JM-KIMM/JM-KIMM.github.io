import { journeyChapters } from '../data/journey'

export default function JourneyFlow({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`journey-flow ${compact ? 'is-compact' : ''}`}>
      {journeyChapters.map((chapter, index) => (
        <article className={chapter.upcoming ? 'is-upcoming' : ''} key={chapter.stage}>
          <div className="journey-index">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <time>{chapter.period}</time>
          </div>
          <div className="journey-copy">
            <small>{chapter.stage}</small>
            <h3>{chapter.title}</h3>
            <p>{chapter.body}</p>
          </div>
          <div className="journey-handoff">
            <small>{index === journeyChapters.length - 1 ? 'CURRENT FOCUS' : 'NEXT HANDOFF'}</small>
            <p>{chapter.handoff}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
