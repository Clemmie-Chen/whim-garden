// run: node tests/romanize.test.ts
import assert from "node:assert/strict"
import { ipaToHupin, ipaLineToHupin, cleanLine, onRequestPost } from "../functions/api/romanize.ts"

// examples from the 沪拼表 on the page
const cases: [string, string][] = [
  ["pɔʔ", "bɔʔ"],
  ["pʰəʔ", "pəʔ"],
  ["boʔ", "ɓoʔ"], // 北 潑 蔔
  ["təʔ", "dəʔ"],
  ["tʰəʔ", "təʔ"],
  ["dəʔ", "ɖəʔ"], // 得 脫 奪
  ["tsɿ", "dzy"],
  ["tsʰɿ", "cy"],
  ["ʦin", "dz'in"],
  ["ʦʰiɤ", "tsieu"], // 資 次 精 秋
  ["tɕi", "ji"],
  ["tɕʰi", "qi"],
  ["dʑi", "ʝi"],
  ["ȵi", "ȵi"],
  ["ʔȵi", "ȵi"],
  ["ɕiã", "xiaŋ"], // 几 欺 其 泥 日 想
  ["kəʔ", "gəʔ"],
  ["kʰəʔ", "kəʔ"],
  ["gəʔ", "ɠəʔ"],
  ["ɡəʔ", "ɠəʔ"],
  ["ʔŋᴀ", "nka"], // 葛 克 個 捱
  ["həʔ", "həʔ"],
  ["ʔᴀ", "a"], // 黑 阿
  ["ʔu", "wu"],
  ["i", "yi"],
  ["y", "yü"],
  ["ɦu", "wu"],
  ["ɦəʔ", "ɦəʔ"], // 乌 衣 淤 河 搿
  ["ʔiã", "yaŋ"],
  ["ɦuã", "waŋ"],
  ["ʔin", "yin"],
  ["ɦiɤ", "yeu"],
  ["ʔuən", "wən"], // 央 横 英 有 温
  ["lã", "laŋ"],
  ["ɦɑ̃", "ɦaon"],
  ["ʔuɑ̃", "waon"], // 冷 項 汪
  ["ŋ̍", "nɡ"],
  ["m̩", "m"],
  ["n̩", "n"], // 五 嘸 嗯
  ["ABC", "ABC"], // nothing matched: kept as-is
]
for (const [ipa, want] of cases) assert.equal(ipaToHupin(ipa), want, ipa)
assert.equal(ipaLineToHupin("zɑ̃  he ɦo "), "zaon he ɦʊ") // LLM double spaces
assert.equal(cleanLine("你好，world! 上海。"), "你好 上海")

// handler with DeepSeek mocked
globalThis.fetch = (async (_u: string, init: any) => {
  const sent = JSON.parse(init.body).messages[1].content
  assert.equal(sent, "上海话")
  return new Response(
    JSON.stringify({
      choices: [
        {
          message: {
            content: JSON.stringify({ duo_line: { chinese_line: sent, ipa_line: "zɑ̃ he ɦo" } }),
          },
        },
      ],
    }),
  )
}) as any
const call = (body: any) =>
  onRequestPost({
    request: new Request("http://x", { method: "POST", body: JSON.stringify(body) }),
    env: { DEEPSEEK_API_KEY: "k" },
  })
const ok = await call({ text: "上海话！\n\n123" })
assert.deepEqual(await ok.json(), [
  { rom: "zaon he ɦʊ", text: "上海话！" },
  { rom: "", text: "123" },
])
assert.equal((await call({ text: "" })).status, 400)
assert.equal((await call({ text: "字".repeat(1001) })).status, 400)
console.log("ok")
