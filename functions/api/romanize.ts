// Cloudflare Pages Function: POST /api/romanize {text} -> [{rom, text}] per input line.
// Port of prototypes/shanghainese-original/ (steps 1-3; step 4 formatting lives in the page).
// Needs the secret DEEPSEEK_API_KEY in the Pages project settings (or .dev.vars locally).

const MAX_CHARS = 1000
const MAX_LINES = 20

const PROMPT = `# 背景

你是一个上海话语言学、语音学大师。
你最擅长的就是为上海话注音。


# 任务

1. 将 {{sentence}} 逐字拆开，数字转成中文字，做 text normalization.
2. 将每个字转成上海话宽式的 IPA 音标。参考新式的上海话发音，而不是老式的发音体系。
3. 仔细思考，好好检查。确保每个输出的上海话字都要和上海话音标一一对应。
4. 如果是地道的上海话里不存在的字，借鉴普通话发音给出一个文读的上海话注音；如果是拉丁字母的外语或其他不可注音的部分，不注音但是保留保留原文。


# 输出内容：

对于每个句子，输出正字上海话句子 和 相应匹配的 IPA 串（用空格连接）
格式按要求输出json对象
格式示例：
{"duo_line":{"chinese_line":"中文原句","ipa_line":"对应的 IPA 注音"}}


# 限制:

- 只处理与上海话 IPA 音标标注相关的内容，拒绝回答无关话题。
- 输出内容必须严格按照给定格式组织，不得偏离要求。
- 每个字的音标必须只包含 IPA 音标，不许包含音调等附加信息。
- 采用新派上海话音系
- 必须只能使用在以下符号范围内的宽式上海话 IPA 音系
  - 声母  \`initials = ["b", "p", "pʰ", "m", "ʔm", "v", "f", "ʦ", "ʦʰ", "ts", "tsʰ", "z", "s", "l", "ʔl", "d", "t", "tʰ", "n", "ʔn", "g", "k", "kʰ", "ŋ", "ʔŋ", "dʑ", "tɕ", "tɕʰ", "ȵ", "ʑ", "ɕ", "ʔ", "ɦ", "h", "j"]\`
  - 韵母  \`finals = ["ɿ", "i", "u", "y", "ᴀ", "iᴀ", "uᴀ", "o", "ɔ", "iɔ", "ɤ", "iɤ", "ᴇ", "iᴇ", "uᴇ", "ei", "ø", "uø", "ã", "iã", "uã", "ən", "in", "uən", "yn", "oŋ", "ioŋ", "ᴀʔ", "iᴀʔ", "uᴀʔ", "oʔ", "ioʔ", "əʔ", "iɪʔ", "uəʔ", "yɪʔ", "əl", "m̩", "n̩", "ŋ̍"]\`
- 不可使用以上声母韵母范围以外的 IPA 音位
`

// Tables follow the 沪拼表 on quartz/static/shanghainese/index.html (IPA -> 沪拼).
// ʦ/ʦʰ are how the tables mark 尖音 (精 dz', 秋 ts); ʔ is the zero initial (阿); ʔȵ and ȵ are not told apart.
const INITIALS: Record<string, string> = {"p":"b","pʰ":"p","b":"ɓ","m":"m","ʔm":"ʔm","f":"f","v":"v","t":"d","tʰ":"t","d":"ɖ","n":"n","ʔn":"ʔn","l":"l","ʔl":"ʔl","ts":"dz","tsʰ":"c","s":"s","z":"z","ʦ":"dz'","ʦʰ":"ts","tɕ":"j","tɕʰ":"q","dʑ":"ʝ","ȵ":"ȵ","ʔȵ":"ȵ","ɕ":"x","ʑ":"ʑ","k":"g","kʰ":"k","g":"ɠ","ɡ":"ɠ","ŋ":"ng","ʔŋ":"nk","ʔ":"","h":"h","ɦ":"ɦ","j":"y"} // prettier-ignore
const FINALS: Record<string, string> = {"ɿ":"y","i":"i","u":"u","y":"ü","ᴀ":"a","iᴀ":"ia","uᴀ":"ua","o":"ʊ","ɔ":"ɔ","iɔ":"iɔ","ɤ":"eu","iɤ":"ieu","ᴇ":"e","iᴇ":"ie","uᴇ":"ue","ei":"ei","ø":"ø","uø":"uø","ã":"aŋ","iã":"iaŋ","uã":"uaŋ","ɑ̃":"aon","iɑ̃":"iaon","uɑ̃":"uaon","ən":"ɘn","in":"in","uən":"uən","yn":"iun","oŋ":"oŋ","ioŋ":"ioŋ","ᴀʔ":"aʔ","iᴀʔ":"iaʔ","uᴀʔ":"uaʔ","oʔ":"oʔ","ioʔ":"ioʔ","əʔ":"əʔ","iɪʔ":"iʔ","uəʔ":"ueʔ","yɪʔ":"iuʔ","əl":"er","m̩":"m","n̩":"n","ŋ̍":"nɡ"} // prettier-ignore

const alt = (o: Record<string, string>) =>
  Object.keys(o)
    .sort((a, b) => b.length - a.length)
    .join("|")
const INI_RE = new RegExp(`^(${alt(INITIALS)})`)
const FIN_RE = new RegExp(`(${alt(FINALS)})$`)

// 零声母: 乌 wu, 衣 yi, 淤 yü, the pinyin way; ɦ before u/i/ü is written the same (河 [ɦu] -> wu), else kept (搿 ɦəʔ)
function zeroInitial(f: string): string | undefined {
  if (f === "u") return "wu"
  if (f.startsWith("u")) return "w" + f.slice(1)
  if (f.startsWith("ü")) return "y" + f
  if (f === "i" || f === "in" || f === "iʔ") return "y" + f
  if (f.startsWith("i")) return "y" + f.slice(1)
}

export function ipaToHupin(raw: string): string {
  const ipa = raw.trim()
  let ini = ipa.match(INI_RE)?.[0] ?? ""
  const fin = ipa.match(FIN_RE)?.[0] ?? ""
  const finStart = ipa.length - fin.length
  // syllabic m̩ n̩ ŋ̍: the final covers the whole unit, so it has no initial (the .py gave 五 -> "ngnɡ")
  if (finStart < ini.length) ini = ""
  if (!ini && !fin) return ipa
  const middle = ipa.slice(ini.length, finStart)
  const f = FINALS[fin] ?? ""
  if ((ini === "" || ini === "ʔ" || ini === "ɦ") && !middle) {
    const z = zeroInitial(f)
    if (z) return z
  }
  return (INITIALS[ini] ?? "") + middle + f
}

export const ipaLineToHupin = (line: string) => line.trim().split(/\s+/).map(ipaToHupin).join(" ")

// step 1: keep only Han chars and spaces (the .py's punctuation->space pass ran after this and was a no-op)
export const cleanLine = (line: string) => line.replace(/[^一-鿿 ]+/g, "").trim()

async function askDeepSeek(sentence: string, key: string): Promise<string> {
  const r = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 1000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: PROMPT.replace("{{sentence}}", sentence) },
        { role: "user", content: sentence },
      ],
    }),
  })
  if (!r.ok) throw new Error(`deepseek ${r.status}`)
  const data: any = await r.json()
  const ipa = JSON.parse(data.choices[0].message.content)?.duo_line?.ipa_line
  if (typeof ipa !== "string") throw new Error("deepseek: no ipa_line")
  return ipa
}

async function turnstileOk(token: string, secret: string, request: Request): Promise<boolean> {
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: request.headers.get("CF-Connecting-IP") ?? "",
    }),
  })
  return ((await r.json()) as any).success === true
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request
  env: { DEEPSEEK_API_KEY: string; TURNSTILE_SECRET: string }
}) {
  let text: unknown, token: unknown
  try {
    ;({ text, token } = (await request.json()) as any)
  } catch {}
  if (typeof text !== "string" || !text.trim() || text.length > MAX_CHARS)
    return Response.json({ error: `text must be 1-${MAX_CHARS} chars` }, { status: 400 })
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length > MAX_LINES)
    return Response.json({ error: `at most ${MAX_LINES} lines` }, { status: 400 })

  if (!env.DEEPSEEK_API_KEY || !env.TURNSTILE_SECRET)
    return Response.json({ error: "DEEPSEEK_API_KEY or TURNSTILE_SECRET not set" }, { status: 503 })
  // only a real browser that passed Turnstile on the page gets a token; scripts hitting the API directly stop here
  if (typeof token !== "string" || !(await turnstileOk(token, env.TURNSTILE_SECRET, request)))
    return Response.json({ error: "人机验证没通过，刷新页面再试" }, { status: 403 })

  try {
    // one call per line, so each result stays paired with its own line (the .py dropped everything on a count mismatch)
    const out = await Promise.all(
      lines.map(async (l) => {
        const clean = cleanLine(l)
        return {
          rom: clean ? ipaLineToHupin(await askDeepSeek(clean, env.DEEPSEEK_API_KEY)) : "",
          text: l,
        }
      }),
    )
    return Response.json(out)
  } catch (e) {
    // 503 not 502: Cloudflare swaps a 502 from Pages on the custom domain for its own "error code: 502" page
    console.error(e)
    // the message is only a status or parse error ("deepseek 401"), safe to show and needed to debug from the page
    return Response.json({ error: String((e as Error).message) }, { status: 503 })
  }
}
