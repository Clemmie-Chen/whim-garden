import { PageFrame, PageFrameProps } from "./types"
import { FullSlug, resolveRelative, simplifySlug } from "../../util/path"
import { getDate } from "../Date"
import { chronicle, Days, MONTHS, minutes, Nav, sharedCss, tagsOf } from "./chronicle"

// Homepage copy. Everything else on the page comes from the notes themselves.
const INTRO = "I read, think, take notes, and share my braindumps here."
const BRAIN_SLUG = "what-i-learn/the-human-brain-(mit-9.13)/index" as FullSlug
const ABOUT = [
  "I'm Clemmentine — AI Agent PM at a startup; before that Pine AI, Syft AI and Toki AI.",
  "A master's in Linguistic Data Science and a bachelor's in Hindi. My mother tongue is Chinese, so the language here is a mixture.",
]

function Home({ componentData, left, footer: Footer }: PageFrameProps) {
  const here = componentData.fileData.slug!
  const c = chronicle(componentData.allFiles)
  const { notes, keys, section } = c

  // the section filter is pure CSS (radio + :has), so it survives SPA navigation without a script
  const filterCss = keys
    .map(
      (_, i) => `.chron:has(input[value="${i}"]:checked) .entry:not([data-sec="${i}"]),
.chron:has(input[value="${i}"]:checked) .day:not(:has(.entry[data-sec="${i}"])) { display: none; }
.chron:has(input[value="${i}"]:checked) .secdesc[data-sec="${i}"] { display: block; }`,
    )
    .join("\n")

  return (
    <>
      <Nav left={left} componentData={componentData} />
      <main class="center chron">
        <style dangerouslySetInnerHTML={{ __html: filterCss }} />
        <header class="top">
          <h1>{INTRO}</h1>
          <p class="holes">
            Rabbit holes:{" "}
            <a href={resolveRelative(here, BRAIN_SLUG)} class="internal">
              the brain
            </a>
            , LLM interpretability, Kant, and the phonology of Shanghainese.
          </p>
          <div class="chips" role="radiogroup" aria-label="按栏目筛选">
            <label class="chip">
              <input type="radio" name="home-sec" value="all" checked />
              All <b>{notes.length}</b>
            </label>
            {keys.map((k, i) => (
              <label class={`chip sec-${i % 6}`}>
                <input type="radio" name="home-sec" value={String(i)} />
                <i class="dot" />
                {section(k).short} <b>{c.inFolder(k).length}</b>
              </label>
            ))}
          </div>
          {keys.map((k, i) =>
            section(k).desc ? (
              <p class="secdesc" data-sec={String(i)}>
                {section(k).name} — {section(k).desc}
              </p>
            ) : null,
          )}
        </header>
        <Days here={here} list={notes} c={c} />
        <section class="about">
          <span class="label">About</span>
          <div>
            {ABOUT.map((line) => (
              <p>{line}</p>
            ))}
          </div>
        </section>
      </main>
      <Footer {...componentData} />
    </>
  )
}

type TocEntry = { depth: number; text: string; slug: string }

function Note({
  componentData,
  left,
  pageBody: Content,
  afterBody,
  footer: Footer,
}: PageFrameProps) {
  const f = componentData.fileData
  const here = f.slug!
  const c = chronicle(componentData.allFiles)
  const key = here.split("/")[0]
  const i = c.secIndex(here)
  const date = getDate(f)
  const tags = tagsOf(f)
  const toc = (f.toc as TocEntry[] | undefined) ?? []
  const link = (slug: string, text: string) => (
    <a href={resolveRelative(here, slug as FullSlug)} class="internal">
      {text}
    </a>
  )

  const linkedFrom = c.notes.filter((n) => n !== f && n.links?.includes(simplifySlug(here)))
  const sameTag = c.notes
    .filter((n) => n.slug !== here && !linkedFrom.includes(n))
    .filter((n) => tagsOf(n).some((t) => tags.includes(t)))
    .slice(0, 3)
  // prev/next walk the whole chronicle by date, the same order as the homepage
  const pos = c.notes.findIndex((n) => n.slug === here)
  const newer = pos > 0 ? c.notes[pos - 1] : undefined
  const older = pos >= 0 ? c.notes[pos + 1] : undefined
  const short = (n: typeof f) => {
    const d = getDate(n)
    return d ? `${MONTHS[d.getMonth()]} ${d.getDate()}` : ""
  }
  const list = (ns: typeof c.notes) =>
    ns.map((n, j) => [j > 0 && ", ", link(n.slug!, n.frontmatter?.title ?? n.slug!)])

  return (
    <>
      <Nav left={left} componentData={componentData} />
      <main class="center chron note">
        <header class={`top sec-${i % 6}`}>
          <div class="kicker">
            {i >= 0 && <i class="dot" />}
            {[
              here.includes("/") && link(`${key}/index`, c.section(key).name),
              <span>{minutes(f.text)} min</span>,
              ...tags.map((t) => link(`tags/${t}`, `#${t}`)),
            ]
              .filter(Boolean)
              .flatMap((el, j) => (j > 0 ? [<span aria-hidden="true">·</span>, el] : [el]))}
          </div>
          <h1>{f.frontmatter?.title}</h1>
          {f.frontmatter?.description && <p class="deck">{f.frontmatter.description as string}</p>}
        </header>

        <section class="day">
          <aside class="date">
            {date && (
              <>
                <b>
                  {MONTHS[date.getMonth()]} {date.getDate()}
                </b>
                {date.getFullYear()}
              </>
            )}
            {toc.length > 0 && (
              <nav class="note-toc" aria-label="Contents">
                <span class="label">Contents</span>
                <ul>
                  {toc.map((t) => (
                    <li class={`d${t.depth}`}>
                      <a href={`#${t.slug}`}>{t.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
          <div class="note-body">
            <Content {...componentData} />
          </div>
        </section>

        {(linkedFrom.length > 0 || sameTag.length > 0) && (
          <p class="holes related">
            {linkedFrom.length > 0 && <>Linked from {list(linkedFrom)}. </>}
            {sameTag.length > 0 && (
              <>
                More in {tags.map((t, j) => [j > 0 && " ", link(`tags/${t}`, `#${t}`)])}:{" "}
                {list(sameTag)}.
              </>
            )}
          </p>
        )}

        <nav class="pn" aria-label="Newer and older notes">
          {newer ? (
            <a href={resolveRelative(here, newer.slug!)} class="internal">
              <span>← Newer · {short(newer)}</span>
              <strong>{newer.frontmatter?.title}</strong>
            </a>
          ) : (
            <span class="none">
              <span>← Newer</span>
              <strong>This is the latest note</strong>
            </span>
          )}
          {older ? (
            <a href={resolveRelative(here, older.slug!)} class="internal">
              <span>Older · {short(older)} →</span>
              <strong>{older.frontmatter?.title}</strong>
            </a>
          ) : (
            <span class="none">
              <span>Older →</span>
              <strong>This is the first note</strong>
            </span>
          )}
        </nav>

        <div class="page-footer">
          {afterBody.map((C) => (
            <C {...componentData} />
          ))}
        </div>
      </main>
      <Footer {...componentData} />
    </>
  )
}

/**
 * Content-page frame. The index renders as the homepage chronicle (every note, grouped by
 * day, with a CSS-only section filter); every other note renders in the same look, with the
 * date and table of contents in the left column.
 */
export const HomeFrame: PageFrame = {
  name: "home",
  render(props: PageFrameProps) {
    return props.componentData.fileData.slug === "index" ? Home(props) : Note(props)
  },
  css:
    sharedCss +
    `
.chron .chips { display: flex; flex-wrap: wrap; gap: 6px; font-family: var(--mf); font-size: 12px; }
.chron .secdesc { display: none; margin: 12px 0 0; }
.chron .chip { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--lightgray); color: var(--dark); cursor: pointer; user-select: none; transition: background-color 150ms ease-out, border-color 150ms ease-out; }
.chron .chip:hover { border-color: var(--gray); }
.chron .chip:active { transform: scale(0.97); }
.chron .chip input { position: absolute; opacity: 0; pointer-events: none; }
.chron .chip:has(input:checked) { background: var(--dark); border-color: var(--dark); color: var(--light); }
.chron .chip:has(input:focus-visible) { outline: 2px solid var(--secondary); outline-offset: 2px; }
.chron .chip b { font-weight: 500; opacity: 0.7; }
.chron .about { margin-top: 56px; display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 24px; border-top: 1px solid var(--dark); padding-top: 16px; }
.chron .about p { margin: 0 0 10px; color: var(--darkgray); max-width: 62ch; }

/* note page */
.note .date { top: 12px; }
.note-toc { margin-top: 22px; }
.note-toc ul { list-style: none; margin: 6px 0 0; padding: 0; max-height: calc(100vh - 180px); overflow: auto; font-size: 11.5px; line-height: 1.45; }
.note-toc li { margin: 0; line-height: 1.45; } /* the theme sets li line-height in rem */
.note-toc a { display: block; padding: 3px 0 3px 8px; border-left: 1px solid var(--lightgray); color: var(--gray); background: none; font-weight: inherit; border-radius: 0; transition: color 150ms ease-out, border-color 150ms ease-out; }
.note-toc .d1 a { padding-left: 16px; font-size: 11px; } .note-toc .d2 a { padding-left: 24px; font-size: 11px; }
.note-toc a:hover { color: var(--dark); }
.note-toc a.cur { border-color: var(--dark); color: var(--dark); }
.note-body { padding: 14px 0 40px; min-width: 0; }
.note-body article > * > :not(figure, table, .table-container, img, pre) { max-width: 66ch; }
.note-body article :is(h1, h2, h3, h4) { scroll-margin-top: 16px; }
.note-body article img { display: block; max-width: 100%; height: auto; border: 1px solid var(--lightgray); border-radius: 6px; cursor: zoom-in; }
.note-body article a > img { cursor: pointer; }
.note-body article table { border-collapse: collapse; font-size: 14px; }
.note-body article :is(th, td) { border: 0; border-bottom: 1px solid var(--lightgray); padding: 8px 16px 8px 0; text-align: left; vertical-align: top; }
.note-body article th { font-family: var(--mf); font-size: 11px; font-weight: 500; color: var(--gray); border-bottom-color: var(--dark); }
.img-zoom { position: fixed; inset: 0; z-index: 999; display: grid; place-items: center; padding: 24px; background: color-mix(in srgb, var(--light) 92%, transparent); cursor: zoom-out; opacity: 0; transition: opacity 150ms ease-out; }
.img-zoom.on { opacity: 1; }
.img-zoom img { max-width: 100%; max-height: 100%; border-radius: 6px; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18); }
.chron .related { margin: 0 0 28px 140px; }
.chron .pn { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--lightgray); }
.chron .pn > * { display: block; padding: 16px 0; border-bottom: 1px solid var(--lightgray); background: none; font-weight: inherit; border-radius: 0; }
.chron .pn > * + * { text-align: right; border-left: 1px solid var(--lightgray); padding-left: 16px; }
.chron .pn span { display: block; font-family: var(--mf); font-size: 11px; color: var(--gray); }
.chron .pn strong { font-family: var(--hf); font-weight: 600; font-size: 16px; color: var(--dark); transition: color 150ms ease-out; }
.chron .pn a:hover strong { color: var(--secondary); }
.chron .pn .none strong { color: var(--gray); font-weight: 500; }
.note .page-footer { margin-top: 40px; }
@media (max-width: 800px) {
  .chron .about { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .note-toc { display: none; }
  .chron .related { margin-left: 0; }
  .chron .pn { grid-template-columns: minmax(0, 1fr); }
  .chron .pn > * + * { border-left: 0; padding-left: 0; }
}
@media (prefers-reduced-motion: reduce) { .img-zoom { transition: none; } }
`,
}
