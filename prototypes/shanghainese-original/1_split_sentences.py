# 在这里，您可以通过 'args'  获取节点中的输入变量，并通过 'ret' 输出结果
# 'args' 已经被正确地注入到环境中
# 下面是一个示例，首先获取节点的全部输入参数params，其次获取其中参数名为'input'的值：
# params = args.params;
# input = params['input'];
# 下面是一个示例，输出一个包含多种数据类型的 'ret' 对象：
# ret: Output =  { "name": '小明', "hobbies": ["看书", "旅游"] };
import re
async def main(args: Args) -> Output:
    input = args.params['input']
    raw_sentences = [
        line.strip()
        for line in input.split("\n")
        if line.strip() != '']

    # 删除非中文字符（仅保留汉字和空格）
    clean_input = re.sub(r"[^一-鿿 \n]+", "", input)
    # 所有标点变成空格
    punctuation = r"[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~，。！？；：“”‘’（）《》【】—…·～]+"
    sentences = re.sub(punctuation, " ", clean_input)
    sentence_list = [
        line.strip()
        for line in sentences.split("\n")
        if line.strip() != '']


    ret: Output = {
        "raw_sentence_list": raw_sentences,
        "sentence_list": sentence_list
        }
    return ret
