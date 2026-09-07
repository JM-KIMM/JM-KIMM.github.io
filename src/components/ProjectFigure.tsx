import { useId } from 'react'
import type { CaseFigure } from '../data/caseStudies'

export const contentHref = (url: string) => /^https?:\/\//.test(url) ? url : `${import.meta.env.BASE_URL}${url}`

export default function ProjectFigure({ figure, eager = false }: { figure: CaseFigure; eager?: boolean }) {
  const captionId = useId()
  return (
    <figure className={`detail-figure ${figure.kind === 'image' ? `detail-figure--${figure.presentation ?? 'frame'}` : 'detail-figure--table'}`} aria-labelledby={captionId}>
      {figure.kind === 'image' ? (
        <a className="detail-figure-image" href={contentHref(figure.image)} target="_blank" rel="noreferrer" aria-label={`${figure.title} 이미지 확대 (새 탭)`}>
          <img src={contentHref(figure.image)} alt={figure.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
          <span className="detail-image-open">이미지 확대 <span aria-hidden="true">↗</span></span>
        </a>
      ) : (
        <>
          <div className="detail-table-scroll" tabIndex={0} role="region" aria-label={`${figure.title} 표`}>
            <table>
              <caption>{figure.title}</caption>
              <thead><tr>{figure.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
              <tbody>{figure.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="detail-table-note">{figure.note}</p>
        </>
      )}
      <figcaption id={captionId}>
        <div>{figure.kind === 'image' && <strong>{figure.title}</strong>}<p>{figure.caption}</p></div>
        <a href={contentHref(figure.source.url)} target="_blank" rel="noreferrer">{figure.source.title} <span aria-hidden="true">↗</span></a>
      </figcaption>
    </figure>
  )
}
