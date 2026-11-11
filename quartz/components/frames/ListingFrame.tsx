import { PageFrame, PageFrameProps } from "./types"
import { FullSlug, resolveRelative } from "../../util/path"
import { chronicle, Days, Nav, sharedCss, tagsOf } from "./chronicle"

/**
 * Folder and tag pages in the homepage's look: a header, then the matching notes grouped by day.
 * Set as the `template` of the `folder` and `tag` page types.
 */
function Listing({ componentData, left, footer: Footer }: PageFrameProps) {
  const here = componentData.fileData.slug!
  const c = chronicle(componentData.allFiles)
  const link = (slug: string, text: string) => (
    <a href={resolveRelative(here, slug as FullSlug)} class="internal">
      {text}
    </a>
  )
  const count = (n: number) => `${n} note${n === 1 ? "" : "s"}`
  const allTags = [...new Set(c.notes.flatMap(tagsOf))].sort()
  const tagged = (t: string) =>
    c.notes.filter((n) => tagsOf(n).some((x) => x === t || x.startsWith(t + "/")))

  let head, list
  if (here.startsWith("tags/")) {
    const tag = here.slice("tags/".length)
    if (tag === "index") {
      head = (
        <>
          <div class="kicker">
            {link("index", "Home")} / {allTags.length} tags
          </div>
          <h1>Tags</h1>
        </>
      )
      list = (
        <section class="day">
          <div class="date">
            <span class="label">All tags</span>
          </div>
          <div class="seclinks">
            {allTags.map((t) => (
              <a href={resolveRelative(here, `tags/${t}` as FullSlug)} class="internal">
                #{t} <b>{tagged(t).length}</b>
              </a>
            ))}
          </div>
        </section>
      )
    } else {
      list = tagged(tag)
      const others = allTags.filter((t) => t !== tag)
      head = (
        <>
          <div class="kicker">
            {link("index", "Home")} / Tag · {count(list.length)}
          </div>
          <h1>#{tag}</h1>
          {others.length > 0 && (
            <p class="holes">
              Also: {others.map((t, j) => [j > 0 && " · ", link(`tags/${t}`, `#${t}`)])}
            </p>
          )}
        </>
      )
    }
  } else {
    const folder = here.replace(/\/?index$/, "")
    const key = folder.split("/")[0]
    const i = c.keys.indexOf(key)
    const sub = folder.includes("/")
    list = c.inFolder(folder)
    head = (
      <div class={`sec-${i % 6}`}>
        <div class="kicker">
          <i class="dot" />
          {sub ? link(`${key}/index`, c.section(key).name) : link("index", "Home")} /{" "}
          {sub ? "Folder" : "Section"} · {count(list.length)}
        </div>
        <h1>{componentData.fileData.frontmatter?.title ?? c.section(key).name}</h1>
        {!sub && c.section(key).desc && <p class="deck">{c.section(key).desc}</p>}
      </div>
    )
  }

  const otherSections = here.startsWith("tags/")
    ? []
    : c.keys.filter((k) => k !== here.split("/")[0])

  return (
    <>
      <Nav left={left} componentData={componentData} />
      <main class="center chron">
        <header class="top">{head}</header>
        {Array.isArray(list) ? <Days here={here} list={list} c={c} /> : list}
        {otherSections.length > 0 && (
          <section class="day">
            <div class="date">
              <span class="label">Other sections</span>
            </div>
            <div class="seclinks">
              {otherSections.map((k) => (
                <a
                  href={resolveRelative(here, `${k}/index` as FullSlug)}
                  class={`internal sec-${c.keys.indexOf(k) % 6}`}
                >
                  <i class="dot" />
                  {c.section(k).name} <b>{c.inFolder(k).length}</b>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer {...componentData} />
    </>
  )
}

export const ListingFrame: PageFrame = {
  name: "listing",
  render: Listing,
  css: sharedCss,
}
