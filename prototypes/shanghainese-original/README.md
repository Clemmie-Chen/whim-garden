# 上海言话 · 原始工作流存档

原样保存，未改动。来自之前的工作流平台（代码节点用 `args` / `ret`）。

流程（我的理解，待确认）：

1. `1_split_sentences.py` —— 输入文本按行拆句。输出 `raw_sentence_list`（原句，用于最终展示）和 `sentence_list`（只留汉字、标点变空格，送给 LLM）。
2. `2_llm_prompt.md` —— 对 `sentence_list` 里每一句调用 DeepSeek，`{{sentence}}` 为当前句，返回 `{"duo_line":{"chinese_line","ipa_line"}}`。
3. `3_ipa_to_hupin.py` —— 每个 `duo_line` 的 IPA 按空格切分，逐字映射声母/韵母成沪拼，加上 `shanghainese_pinyin`。
4. `4_format_output.py` —— 把所有 `duo_lines` 和 `raw_sentence_list` 按行配对，输出「原句 / 沪拼 / 空行」。两者句数不一致时输出为空。
