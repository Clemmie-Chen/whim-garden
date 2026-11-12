# 在这里，您可以通过 'args'  获取节点中的输入变量，并通过 'ret' 输出结果
# 'args' 已经被正确地注入到环境中
# 下面是一个示例，首先获取节点的全部输入参数params，其次获取其中参数名为'input'的值：
# params = args.params;
# input = params['input'];
# 下面是一个示例，输出一个包含多种数据类型的 'ret' 对象：
# ret: Output =  { "name": '小明', "hobbies": ["看书", "旅游"] };

import re, json

initials = {"b":"ɓ","p":"b","pʰ":"p","m":"m","ʔm":"ʔm","v":"v","f":"f","ʦ":"dz'","ʦʰ":"ts","ts":"dz","tsʰ":"c","z":"z","s":"s","l":"l","ʔl":"ʔl","d":"ɖ","t":"d","tʰ":"t","n":"n","ʔn":"ʔn","ɠ":"g","g":"k","kʰ":"k","ŋ":"ng","ŋ̍":"ng","ʔŋ":"nk","dʑ":"ʝ","tɕ":"j","tɕʰ":"q","ȵ":"gn","ʔȵ":"kn","ʑ":"ʑ","ɕ":"x","ʔ":"ʔ","ɦ":"h","h":"h","j":"y"}
finals = {"ɿ":"y","i":"i","u":"u","y":"ü","ᴀ":"a","iᴀ":"ia","uᴀ":"ua","o":"ʊ","ɔ":"ɔ","iɔ":"iɔ","ɤ":"eu","iɤ":"ieu","ᴇ":"e","iᴇ":"ie","uᴇ":"ue","ei":"ei","ø":"ø","uø":"uø","ã":"aŋ","iã":"iaŋ","uã":"uaŋ","ɑ̃":"aŋ","iɑ̃":"iaŋ","uɑ̃":"uaŋ","ən":"ɘn","in":"in","uən":"uən","yn":"iun","oŋ":"oŋ","ioŋ":"ioŋ","ᴀʔ":"aʔ","iᴀʔ":"iaʔ","uᴀʔ":"uaʔ","oʔ":"oʔ","ioʔ":"ioʔ","əʔ":"əʔ","iɪʔ":"iʔ","uəʔ":"ueʔ","yɪʔ":"iuʔ","əl":"er","m̩":"m","n̩":"n","ŋ̍":"nɡ"}

def ipa_to_shanghainese(ipa: str) -> str:
    ipa = ipa.strip()
    ini_pattern = re.compile(rf"^({'|'.join(sorted(initials.keys(), key=len, reverse=True))})")
    fin_pattern = re.compile(rf"({'|'.join(sorted(finals.keys(), key=len, reverse=True))})$")

    ini_match = ini_pattern.match(ipa)
    fin_match = fin_pattern.search(ipa)

    ini_pinyin = initials[ini_match.group()] if ini_match else ""
    fin_pinyin = finals[fin_match.group()] if fin_match else ""

    ini_end = ini_match.end() if ini_match else 0
    fin_start = fin_match.start() if fin_match else len(ipa)
    middle = ipa[ini_end:fin_start]

    result = ini_pinyin + middle + fin_pinyin
    return result if (ini_pinyin or fin_pinyin) else ipa


def convert_duo_line(data: dict) -> dict:
    """
    Convert a single JSON object with 'chinese_line' and 'ipa_line'
    to add 'shanghainese_pinyin'.
    """
    # chinese_line = data.get("chinese_line", "")
    ipa_line = data.get("ipa_line", "")

    # 按空格拆分 ipa
    ipa_units = ipa_line.strip().split(" ")
    sh_units = [ipa_to_shanghainese(unit) for unit in ipa_units]

    # 拼回字符串
    data["shanghainese_pinyin"] = " ".join(sh_units)
    return data


async def main(args: Args) -> Output:
    duo_line = args.params['duo_line'] # 例如 {"chinese_line": ..., "ipa_line": ...}
    result = convert_duo_line(duo_line)

    # 构建输出对象
    ret: Output = {
        'sh_duo_line': result
    }
    return ret
