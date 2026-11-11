import { PageFrame, PageFrameProps } from "./types"
import { DefaultFrame } from "./DefaultFrame"
import { QuartzPluginData } from "../../plugins/vfile"
import { FullSlug, resolveRelative } from "../../util/path"
import { byDateAndAlphabetical } from "../PageList"
import { getDate } from "../Date"

// Homepage copy. Everything else on the page comes from the notes themselves.
const INTRO = "I read, think, take notes, and share my braindumps here."
const BRAIN_SLUG = "what-i-learn/the-human-brain-(mit-9.13)/index" as FullSlug
const ABOUT = [
  "I'm Clemmentine — AI Agent PM at a startup; before that Pine AI, Syft AI and Toki AI.",
  "A master's in Linguistic Data Science and a bachelor's in Hindi. My mother tongue is Chinese, so the language here is a mixture.",
]

// Top-level folders (by slug), in display order. A folder not listed here still shows up, after these.
const SECTIONS: Record<string, { name: string; short: string; desc: string }> = {
  "how-i-do": { name: "How I do", short: "Do", desc: "动手做的东西：工具、教程、这座花园本身" },
  "what-i-learn": { name: "What I learn", short: "Learn", desc: "在上的课和配套阅读" },
  "what-i-read": { name: "What I read", short: "Read", desc: "读书笔记" },
  "what-i-write": { name: "What I write", short: "Write", desc: "自己写的长文" },
  "what-i‘m-thinking-about": {
    name: "What I‘m thinking about",
    short: "Thinking",
    desc: "正在想、还没想完的问题",
  },
  braindump: { name: "Braindump", short: "Braindump", desc: "随手倒出来的念头" },
}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const unslug = (s: string) => s.replace(/-/g, " ")
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
// CJK characters count one each, everything else by whitespace-separated words
const minutes = (text = "") => {
  const cjk = (text.match(/[㐀-鿿]/g) ?? []).length
  const words = (text.replace(/[㐀-鿿]/g, " ").match(/\S+/g) ?? []).length
  return Math.max(1, Math.round((cjk + words) / 400))
}

function Chronicle({ componentData, left, footer: Footer }: PageFrameProps) {
  const here = componentData.fileData.slug!
  const notes = componentData.allFiles
    .filter((f) => f.slug && f.slug !== "index" && f.dates)
    .filter((f) => !f.frontmatter?.unlisted)
    .sort(byDateAndAlphabetical())

  // folders not in SECTIONS keep their name as written in the vault (slugs are lowercased)
  const folderName = (key: string) => {
    const f = notes.find((n) => n.slug!.startsWith(key + "/"))
    const parts = f?.filePath?.split("/")
    return parts ? parts[parts.length - f!.slug!.split("/").length] : unslug(key)
  }
  const section = (key: string) =>
    SECTIONS[key] ?? { name: folderName(key), short: folderName(key), desc: "" }

  const keys = [...new Set(notes.map((f) => f.slug!.split("/")[0]))].sort((a, b) => {
    const order = Object.keys(SECTIONS)
    const ia = order.indexOf(a),
      ib = order.indexOf(b)
    return (ia < 0 ? order.length : ia) - (ib < 0 ? order.length : ib)
  })

  const days: { date: Date; notes: QuartzPluginData[] }[] = []
  for (const f of notes) {
    const d = getDate(f)!
    const last = days[days.length - 1]
    if (last && dayKey(last.date) === dayKey(d)) last.notes.push(f)
    else days.push({ date: d, notes: [f] })
  }

  const meta = (f: QuartzPluginData) => {
    const parts = f.slug!.split("/")
    const dir = parts.slice(0, -1).join("/") + "/"
    // a subfolder's index note (Obsidian folder note) stands for the whole folder
    const isFolderNote = parts.length > 2 && parts[parts.length - 1] === "index"
    const folderNote = parts.length > 2 ? notes.find((n) => n.slug === dir + "index") : undefined
    const tag = f.frontmatter?.tags?.[0]
    return [
      section(parts[0]).name,
      !isFolderNote && parts.length > 2
        ? (folderNote?.frontmatter?.title ??
          f.filePath?.split("/").at(-2) ??
          unslug(parts[parts.length - 2]))
        : undefined,
      isFolderNote
        ? `${notes.filter((n) => n !== f && n.slug!.startsWith(dir)).length} 篇`
        : `${minutes(f.text)} min`,
      tag ? `#${tag}` : undefined,
    ].filter(Boolean)
  }

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
      <header class="home-nav">
        {left.map((C) => (
          <C {...componentData} />
        ))}
      </header>
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
                {section(k).short} <b>{notes.filter((f) => f.slug!.startsWith(k + "/")).length}</b>
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
        {days.map(({ date, notes: dayNotes }) => (
          <section class="day">
            <div class="date">
              <b>
                {MONTHS[date.getMonth()]} {date.getDate()}
              </b>
              {date.getFullYear()}
            </div>
            <div>
              {dayNotes.map((f) => {
                const i = keys.indexOf(f.slug!.split("/")[0])
                const description = f.frontmatter?.description as string | undefined
                return (
                  <a
                    class={`entry internal sec-${i % 6}`}
                    data-sec={String(i)}
                    href={resolveRelative(here, f.slug!)}
                  >
                    <span class="k">
                      <i class="dot" />
                      {meta(f).join(" · ")}
                    </span>
                    <h3>{f.frontmatter?.title}</h3>
                    {description && <p>{description}</p>}
                  </a>
                )
              })}
            </div>
          </section>
        ))}
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

/**
 * Homepage frame — a reverse-chronological "chronicle" of every note, grouped by day,
 * with a CSS-only section filter. Every page other than the index falls back to the
 * default three-column layout, so this can be set as the `content` page type's template.
 */
export const HomeFrame: PageFrame = {
  name: "home",
  render(props: PageFrameProps) {
    return props.componentData.fileData.slug === "index"
      ? Chronicle(props)
      : DefaultFrame.render(props)
  },
  css: `
body[data-slug="index"] #quartz-body { display: block; max-width: 860px; margin: 0 auto; padding: 0 2rem; }
.home-nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.1rem 0; }
.home-nav .page-title { margin: 0; font-size: 1.15rem; }
body[data-slug="index"] .home-nav > .page-title { display: block; } /* the theme hides it on phones; here it is the only way home */
.home-nav .explorer, .home-nav .readermode, .home-nav .mobile-only { display: none; }
.home-nav .flex-component { flex: 0 1 260px; }

.home-nav, .chron { --hf: "Schibsted Grotesk", system-ui, sans-serif; --bf: "Source Sans Pro", "Source Sans 3", system-ui, sans-serif; --mf: "IBM Plex Mono", ui-monospace, monospace; }
.home-nav .page-title { font-family: var(--hf); font-weight: 700; letter-spacing: -0.01em; }
.chron { font-family: var(--bf); --c0: #6f9a8f; --c1: #284b63; --c2: #a8743f; --c3: #84638a; --c4: #8f7f3e; --c5: #a35f5f; --quiet: color-mix(in srgb, var(--darkgray) 78%, var(--light)); }
:root[saved-theme="dark"] .chron { --c0: #84a59d; --c1: #7b97aa; --c2: #c9995f; --c3: #b08fb3; --c4: #c2b36e; --c5: #cf8e8e; }
.chron .sec-0 { --c: var(--c0); } .chron .sec-1 { --c: var(--c1); } .chron .sec-2 { --c: var(--c2); } .chron .sec-3 { --c: var(--c3); } .chron .sec-4 { --c: var(--c4); } .chron .sec-5 { --c: var(--c5); }
.chron .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--c, var(--gray)); flex: none; }
.chron .top { padding: 1.9rem 0 1.6rem; }
.chron h1 { font-family: var(--hf); font-weight: 600; font-size: clamp(26px, 3.6vw, 36px); line-height: 1.15; letter-spacing: -0.02em; margin: 0 0 10px; }
.chron .holes, .chron .secdesc { margin: 0 0 20px; color: var(--quiet); font-family: var(--mf); font-size: 12px; max-width: 64ch; }
.chron .holes { line-height: 1.5; }
.chron .holes a { color: inherit; background: none; padding: 0; border-bottom: 1px solid var(--lightgray); font-weight: inherit; transition: color 150ms ease-out; }
.chron .holes a:hover { color: var(--darkgray); }
.chron .secdesc { display: none; margin: 12px 0 0; }
.chron .chips { display: flex; flex-wrap: wrap; gap: 6px; font-family: var(--mf); font-size: 12px; }
.chron .chip { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--lightgray); color: var(--dark); cursor: pointer; user-select: none; transition: background-color 150ms ease-out, border-color 150ms ease-out; }
.chron .chip:hover { border-color: var(--gray); }
.chron .chip:active { transform: scale(0.97); }
.chron .chip input { position: absolute; opacity: 0; pointer-events: none; }
.chron .chip:has(input:checked) { background: var(--dark); border-color: var(--dark); color: var(--light); }
.chron .chip:has(input:focus-visible) { outline: 2px solid var(--secondary); outline-offset: 2px; }
.chron .chip b { font-weight: 500; opacity: 0.7; }
.chron .day { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 28px; border-top: 1px solid var(--dark); }
.chron .date { position: sticky; top: 0; align-self: start; padding: 14px 0; font-family: var(--mf); font-size: 12px; color: var(--darkgray); }
.chron .date b { display: block; font-family: var(--hf); font-weight: 600; font-size: 22px; color: var(--dark); letter-spacing: -0.01em; }
.chron a.entry { display: block; padding: 16px 0 18px; border-bottom: 1px solid var(--lightgray); color: inherit; background: none; font-weight: inherit; border-radius: 0; }
.chron a.entry:last-child { border-bottom: 0; }
.chron .entry .k { display: flex; align-items: center; gap: 8px; font-family: var(--mf); font-size: 11px; color: var(--gray); }
.chron .entry h3 { margin: 4px 0; font-family: var(--hf); font-weight: 600; font-size: 19px; line-height: 1.3; letter-spacing: -0.01em; color: var(--dark); transition: color 150ms ease-out; }
.chron .entry:hover h3 { color: var(--secondary); }
.chron .entry p { margin: 2px 0 0; color: var(--quiet); font-size: 14px; line-height: 1.5; max-width: 60ch; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.chron .about { margin-top: 56px; display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 24px; border-top: 1px solid var(--dark); padding-top: 16px; }
.chron .about .label { font-family: var(--mf); font-size: 11px; letter-spacing: 0.08em; color: var(--gray); text-transform: uppercase; }
.chron .about p { margin: 0 0 10px; color: var(--darkgray); max-width: 62ch; }
@media (max-width: 800px) {
  body[data-slug="index"] #quartz-body { padding: 0 1rem; }
  .home-nav { flex-wrap: wrap; }
  .chron .day { grid-template-columns: minmax(0, 1fr); gap: 0; }
  .chron .date { position: relative; padding-bottom: 0; }
  .chron .date b { display: inline; font-size: 16px; margin-right: 8px; }
  .chron .about { grid-template-columns: minmax(0, 1fr); gap: 8px; }
}
@media (prefers-reduced-motion: reduce) { .chron * { transition: none !important; } }
`,
}
