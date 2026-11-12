import { QuartzComponent, QuartzComponentProps } from "../types"
import { QuartzPluginData } from "../../plugins/vfile"
import { FullSlug, resolveRelative } from "../../util/path"
import { byDateAndAlphabetical } from "../PageList"
import { getDate } from "../Date"
import { componentRegistry } from "../registry"

// Shared pieces of the "chronicle" look: the homepage, note pages, and section/tag listings.

// Top-level folders (by slug), in display order. A folder not listed here still shows up, after these.
export const SECTIONS: Record<string, { name: string; short: string; desc: string }> = {
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
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const unslug = (s: string) => s.replace(/-/g, " ")
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
// CJK characters count one each, everything else by whitespace-separated words
export const minutes = (text = "") => {
  const cjk = (text.match(/[㐀-鿿]/g) ?? []).length
  const words = (text.replace(/[㐀-鿿]/g, " ").match(/\S+/g) ?? []).length
  return Math.max(1, Math.round((cjk + words) / 400))
}
export const tagsOf = (f: QuartzPluginData): string[] => f.frontmatter?.tags ?? []

/** Everything the chronicle pages need to know about the site, computed once per render. */
export function chronicle(allFiles: QuartzPluginData[]) {
  // newest first
  const notes = allFiles
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

  const order = Object.keys(SECTIONS)
  const rank = (k: string) => (order.indexOf(k) < 0 ? order.length : order.indexOf(k))
  const keys = [...new Set(notes.map((f) => f.slug!.split("/")[0]))].sort(
    (a, b) => rank(a) - rank(b),
  )
  const secIndex = (slug: string) => keys.indexOf(slug.split("/")[0])
  const inFolder = (prefix: string) => notes.filter((n) => n.slug!.startsWith(prefix + "/"))

  const meta = (f: QuartzPluginData) => {
    const parts = f.slug!.split("/")
    const dir = parts.slice(0, -1).join("/") + "/"
    // a subfolder's index note (Obsidian folder note) stands for the whole folder
    const isFolderNote = parts.length > 2 && parts[parts.length - 1] === "index"
    const folderNote = parts.length > 2 ? notes.find((n) => n.slug === dir + "index") : undefined
    const tag = tagsOf(f)[0]
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

  return { notes, keys, section, secIndex, inFolder, meta }
}
export type Chronicle = ReturnType<typeof chronicle>

/** Notes grouped by day, newest first: the list used on the homepage, section and tag pages. */
export function Days({
  here,
  list,
  c,
}: {
  here: FullSlug
  list: QuartzPluginData[]
  c: Chronicle
}) {
  const days: { date: Date; notes: QuartzPluginData[] }[] = []
  for (const f of list) {
    const d = getDate(f)!
    const last = days[days.length - 1]
    if (last && dayKey(last.date) === dayKey(d)) last.notes.push(f)
    else days.push({ date: d, notes: [f] })
  }
  return (
    <>
      {days.map(({ date, notes }) => (
        <section class="day">
          <div class="date">
            <b>
              {MONTHS[date.getMonth()]} {date.getDate()}
            </b>
            {date.getFullYear()}
          </div>
          <div>
            {notes.map((f) => {
              const i = c.secIndex(f.slug!)
              const description = f.frontmatter?.description as string | undefined
              return (
                <a
                  class={`entry internal sec-${i % 6}`}
                  data-sec={String(i)}
                  href={resolveRelative(here, f.slug!)}
                  style={`--i:${list.indexOf(f)}`}
                >
                  <span class="k">
                    <i class="dot" />
                    {c.meta(f).join(" · ")}
                  </span>
                  <h3>{f.frontmatter?.title}</h3>
                  {description && <p>{description}</p>}
                </a>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}

/** Top bar: the left-sidebar components (title, search, dark mode) laid out in a row. */
export function Nav({
  left,
  componentData,
}: {
  left: QuartzComponent[]
  componentData: QuartzComponentProps
}) {
  return (
    <header class="home-nav">
      {left.map((C) => (
        <C {...componentData} />
      ))}
    </header>
  )
}

// Frames can't ship scripts, so a script-only component is registered to get them into the bundle.
// Runs on every SPA "nav"; each part no-ops on pages without its markup.
const ChronicleScripts: QuartzComponent = () => null
ChronicleScripts.afterDOMLoaded = `
document.addEventListener("nav", () => {
  // table of contents: highlight the heading currently in view
  const links = [...document.querySelectorAll(".note-toc a")]
  if (links.length) {
    const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    const spy = () => {
      let i = 0
      heads.forEach((h, j) => { if (h && h.getBoundingClientRect().top < 120) i = j })
      // headings near the end can never reach the top; at the bottom, the last one wins
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) i = heads.length - 1
      links.forEach((a, j) => a.classList.toggle("cur", j === i))
    }
    spy()
    addEventListener("scroll", spy, { passive: true })
    window.addCleanup(() => removeEventListener("scroll", spy))
  }

  // click an image in a note to see it full screen; click or Esc closes it
  for (const img of document.querySelectorAll(".note-body article img")) {
    if (img.closest("a")) continue
    const open = () => {
      const z = document.createElement("div")
      z.className = "img-zoom"
      const big = document.createElement("img")
      big.src = img.currentSrc || img.src
      big.alt = img.alt
      z.append(big)
      const close = () => { z.remove(); removeEventListener("keydown", esc) }
      const esc = (e) => e.key === "Escape" && close()
      z.onclick = close
      addEventListener("keydown", esc)
      document.body.append(z)
      requestAnimationFrame(() => z.classList.add("on"))
      window.addCleanup(close)
    }
    img.addEventListener("click", open)
    window.addCleanup(() => img.removeEventListener("click", open))
  }
})
`
// the registry treats every function as a constructor, so register one that returns the component
componentRegistry.register("chronicle-scripts", () => ChronicleScripts, "frames/chronicle")

export const sharedCss = `
#quartz-body { display: block; max-width: 860px; margin: 0 auto; padding: 0 2rem; }
.home-nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.1rem 0; }
.home-nav .page-title { margin: 0; font-size: 1.15rem; }
.home-nav > .page-title { display: block; } /* the theme hides it on phones; here it is the only way home */
.home-nav .explorer, .home-nav .readermode, .home-nav .mobile-only { display: none; }
.home-nav .flex-component { flex: 0 1 260px; }

.home-nav, .chron { --hf: "Schibsted Grotesk", system-ui, sans-serif; --bf: "Source Sans 3", "Source Sans Pro", system-ui, sans-serif; --mf: "IBM Plex Mono", ui-monospace, monospace; }
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.chron { line-height: 1.65; }
.home-nav .page-title { font-family: var(--hf); font-weight: 700; letter-spacing: -0.01em; }
.home-nav .page-title a { color: var(--dark); }
.chron { font-family: var(--bf); --c0: #6f9a8f; --c1: #284b63; --c2: #a8743f; --c3: #84638a; --c4: #8f7f3e; --c5: #a35f5f; --quiet: color-mix(in srgb, var(--darkgray) 78%, var(--light)); }
:root[saved-theme="dark"] .chron { --c0: #84a59d; --c1: #7b97aa; --c2: #c9995f; --c3: #b08fb3; --c4: #c2b36e; --c5: #cf8e8e; }
.chron .sec-0 { --c: var(--c0); } .chron .sec-1 { --c: var(--c1); } .chron .sec-2 { --c: var(--c2); } .chron .sec-3 { --c: var(--c3); } .chron .sec-4 { --c: var(--c4); } .chron .sec-5 { --c: var(--c5); }
.chron .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--c, var(--gray)); flex: none; }
.chron .top { padding: 1.9rem 0 1.6rem; }
.chron h1 { font-family: var(--hf); font-weight: 600; font-size: clamp(26px, 3.6vw, 36px); line-height: 1.15; letter-spacing: -0.02em; margin: 0 0 10px; color: var(--dark); }
.chron .holes, .chron .secdesc { margin: 0 0 20px; color: var(--quiet); font-family: var(--mf); font-size: 12px; max-width: 64ch; }
.chron .holes { line-height: 1.5; }
.chron .holes a { color: inherit; background: none; padding: 0; border-bottom: 1px solid var(--lightgray); font-weight: inherit; transition: color 150ms ease-out; }
.chron .holes a:hover { color: var(--darkgray); }
.chron .kicker { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 10px; font-family: var(--mf); font-size: 12px; color: var(--gray); }
.chron .kicker a { color: var(--darkgray); background: none; padding: 0; font-weight: inherit; border-bottom: 1px solid var(--lightgray); transition: color 150ms ease-out; }
.chron .kicker a:hover { color: var(--secondary); }
.chron .deck { margin: 0; color: var(--quiet); font-size: 17px; max-width: 60ch; }
.chron .day { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 28px; border-top: 1px solid var(--dark); }
.chron .date { position: sticky; top: 0; align-self: start; padding: 14px 0; font-family: var(--mf); font-size: 12px; color: var(--darkgray); }
.chron .date b { display: block; font-family: var(--hf); font-weight: 600; font-size: 22px; color: var(--dark); letter-spacing: -0.01em; }
.chron .label { font-family: var(--mf); font-size: 11px; letter-spacing: 0.08em; color: var(--gray); text-transform: uppercase; }
.chron a.entry { display: block; padding: 16px 0 18px; border-bottom: 1px solid var(--lightgray); color: inherit; background: none; font-weight: inherit; border-radius: 0; }
.chron a.entry:last-child { border-bottom: 0; }
.chron .entry .k { display: flex; align-items: flex-start; gap: 8px; font-family: var(--mf); font-size: 11px; line-height: 1.6; color: var(--gray); }
.chron .entry .k .dot { margin-top: 5px; } /* sits on the first line when the meta wraps */
.chron .entry h3 { margin: 4px 0; font-family: var(--hf); font-weight: 600; font-size: 19px; line-height: 1.3; letter-spacing: -0.01em; color: var(--dark); transition: color 150ms ease-out; }
.chron .entry:hover h3 { color: var(--secondary); }
/* entries rise in one after another; the delay is capped so long lists don't wait */
.chron a.entry { animation: chron-rise 240ms cubic-bezier(0.23, 1, 0.32, 1) both; animation-delay: min(calc(var(--i, 0) * 24ms), 300ms); }
@keyframes chron-rise { from { opacity: 0; transform: translateY(6px); } }

/* search box from the prototype: white field, mono placeholder, shortcut hint */
.home-nav { --surface: #fff; }
:root[saved-theme="dark"] .home-nav { --surface: #1d1d20; }
.home-nav .search > .search-button { height: 32px; padding: 0 8px 0 0; border-radius: 6px; background: var(--surface); font-family: var(--mf); font-size: 13px; transition: border-color 150ms ease-out; }
.home-nav .search > .search-button:hover { border-color: var(--gray); }
.home-nav .search > .search-button svg { width: 14px; min-width: 14px; margin: 0 8px 0 10px; }
.home-nav .search > .search-button p { flex: 1; margin: 0; }
.home-nav .search > .search-button::after { content: "⌘K"; font-family: var(--mf); font-size: 11px; color: var(--gray); border: 1px solid var(--lightgray); border-radius: 4px; padding: 0 4px; line-height: 18px; }
.chron .entry p { margin: 4px 0 0; color: var(--quiet); font-size: 14px; font-weight: 400; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.chron .seclinks { display: flex; flex-wrap: wrap; gap: 8px 16px; padding: 14px 0; font-family: var(--mf); font-size: 12px; }
.chron .seclinks a { display: inline-flex; align-items: center; gap: 6px; color: var(--darkgray); background: none; padding: 0; font-weight: inherit; transition: color 150ms ease-out; }
.chron .seclinks a:hover { color: var(--secondary); }
.chron .seclinks b { font-weight: 400; color: var(--gray); }
/* long underscore titles (Week_1_Reading_…) have no break points */
.chron :is(h1, h3, .pn strong) { overflow-wrap: anywhere; }
@media (max-width: 800px) {
  #quartz-body { padding: 0 1rem; }
  /* the theme sizes the footer to 100dvw - 3rem plus its own padding, which ignores the padding above */
  html .page > #quartz-body footer { min-width: 0; max-width: none; padding: 0; }
  .home-nav { flex-wrap: wrap; }
  .home-nav .search > .search-button::after { display: none; }
  .chron .day { grid-template-columns: minmax(0, 1fr); gap: 0; }
  .chron .date { position: relative; padding-bottom: 0; }
  .chron .date b { display: inline; font-size: 16px; margin-right: 8px; }

  /* phones: one weight lighter and a size smaller everywhere, with more air between entries */
  .home-nav { padding: 14px 0 6px; row-gap: 10px; }
  .home-nav .page-title { font-size: 16px; font-weight: 600; }
  .chron .top { padding: 1.6rem 0 1.4rem; }
  .chron h1 { font-size: 22px; font-weight: 500; line-height: 1.3; letter-spacing: -0.015em; margin-bottom: 12px; }
  .chron .holes { line-height: 1.7; }
  .chron .chips { gap: 8px 6px; }
  .chron .date { padding-top: 18px; }
  .chron .date b { font-size: 14px; font-weight: 500; }
  .chron a.entry { padding: 14px 0 20px; }
  .chron .entry h3 { font-size: 16.5px; font-weight: 500; line-height: 1.45; letter-spacing: 0; margin: 6px 0 2px; }
  .chron .entry p { font-size: 13.5px; }
}
@media (prefers-reduced-motion: reduce) { .chron * { transition: none !important; animation: none !important; } }
`
