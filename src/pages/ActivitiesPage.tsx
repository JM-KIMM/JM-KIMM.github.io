import { competitionActivities, learningActivities, type Activity } from '../data/activities'

function ActivityList({ activities }: { activities: Activity[] }) {
  return (
    <div className="activity-list">
      {activities.map((activity, index) => (
        <article className="activity-item" key={activity.title}>
          <div className="activity-index">{String(index + 1).padStart(2, '0')}</div>
          <div className="activity-heading">
            <small>{activity.period}</small>
            <h3>{activity.title}</h3>
            <p>{activity.subtitle}</p>
          </div>
          <div className="activity-detail">
            <b>{activity.role}</b>
            <p>{activity.summary}</p>
            <p className="activity-purpose"><small>FOCUS</small>{activity.purpose}</p>
            <ul>{activity.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <div className="activity-bridge"><span>→</span><div><small>NEXT</small><p>{activity.carriedForward}</p></div></div>
          </div>
          <div className="activity-result">
            {activity.result && <strong>{activity.result}</strong>}
            {activity.url && <a href={activity.url} target="_blank" rel="noreferrer">OFFICIAL ↗</a>}
          </div>
        </article>
      ))}
    </div>
  )
}

export default function ActivitiesPage() {
  return (
    <section className="page page-pad activities-page">
      <header className="activities-intro">
        <p className="eyebrow">ACTIVITIES</p>
        <h1>Activities.</h1>
      </header>

      <section className="activities-section">
        <header><span>01</span><div><small>LEARNING PROGRAMS</small><h2>Education & Community</h2></div></header>
        <ActivityList activities={learningActivities} />
      </section>

      <section className="activities-section">
        <header><span>02</span><div><small>COMPETITIONS</small><h2>Challenges & Awards</h2></div></header>
        <ActivityList activities={competitionActivities} />
      </section>
    </section>
  )
}
