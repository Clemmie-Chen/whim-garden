# 在这里，您可以通过 'args'  获取节点中的输入变量，并通过 'ret' 输出结果
# 'args' 已经被正确地注入到环境中
# 下面是一个示例，首先获取节点的全部输入参数params，其次获取其中参数名为'input'的值：
# params = args.params;
# input = params['input'];
# 下面是一个示例，输出一个包含多种数据类型的 'ret' 对象：
# ret: Output =  { "name": '小明', "hobbies": ["看书", "旅游"] };

def format_duo_lines(duo_lines: list[dict], raw_sentence_list: list[str]) -> str:
    """
    将输入 JSON 数组转换为用户友好的字符串，每行中文和拼音分两行，中间空一行。
    输入示例:
    [
        {"chinese": "你好", "shanghai_pinyin": "ni hao"},
        {"chinese": "世界", "shanghai_pinyin": "shi jie"}
    ]
    """
    lines = []
    if len(duo_lines) == len(raw_sentence_list):
        for duo_line, raw_sentence in zip(duo_lines, raw_sentence_list):
            chinese = raw_sentence # duo_line.get("chinese_line", "")
            pinyin = duo_line.get("shanghainese_pinyin", "")
            if chinese or pinyin:
                lines.append(chinese)
                lines.append(pinyin)
                lines.append("")  # 空行分隔
        # 去掉最后多余空行
        if lines and lines[-1] == "":
            lines.pop()
    return "\n".join(lines)

async def main(args: Args) -> Output:
    duo_lines = args.params["duo_lines"]
    raw_sentence_list = args.params["raw_sentence_list"]
    output = format_duo_lines(duo_lines, raw_sentence_list)
    # 构建输出对象
    ret: Output = {
        "output": output
    }
    return ret
