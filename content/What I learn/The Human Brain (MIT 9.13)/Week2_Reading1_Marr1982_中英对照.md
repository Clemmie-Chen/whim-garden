---
publish: true
title: Reading Note (中英对照)：Marr (1982) Vision — General Introduction & Ch.1
created: 2026-06-02T14:47:36.128+08:00
modified: 2026-06-02T14:58:32.271+08:00
tags:
  - cog-neuro-sci
---

# Reading Note · 中英对照 | Marr (1982) _Vision_ — General Introduction & Ch.1 "The Philosophy and Approach"

> **Source / 出处**：Marr, D. (1982). _Vision: A Computational Investigation into the Human Representation and Processing of Visual Information_. W.H. Freeman. Covers the **General Introduction** and **Chapter 1** (1.1 Background / 1.2 Understanding Complex Information-Processing Systems / 1.3 A Representational Framework for Vision).
>
> **课程定位 / Course role**
> Week 2 (Neuroanatomy) assigned reading for 9.13. Where Lecture 2 teaches the _names of the brain's parts_ and _how to decide whether a patch of cortex is "an area,"_ Marr sits one level above and gives the framework for understanding what those parts are actually computing. It is the methodological constitution of the whole course — and of cognitive science.
> 9.13 第二周（Neuroanatomy）指定 reading。Lecture 2 教你脑的「零件名字」和「怎么判定一块皮层算不算一个区」；Marr 在更高一层给出理解「这些零件在算什么」的框架。它是整门课、乃至整个认知科学的方法论宪法。
>
> **人物 / The author**
> David Marr, a British neuroscientist who worked at the MIT AI Lab with Tomaso Poggio and others. This book is his **posthumous work**: he died of leukemia in 1980 at just 35; the book appeared in 1982. You can feel the urgency of a man laying out his entire method at once.
> David Marr，英国神经科学家，在 MIT AI Lab 与 Tomaso Poggio 等合作。本书是他 **1980 年因白血病去世（年仅 35 岁）后于 1982 年出版的遗著**。读时能感到一种「把毕生方法论一次说清」的紧迫感。

---

## 一句话主旨 | Thesis in One Sentence

> To understand any **information-processing system** (vision, the brain, even a computer), **looking only at the hardware / neurons is nowhere near enough**. You must first work, at a **separate, abstract "computational" level**, on what problem the system is actually solving and why solving it that way is correct. Marr decomposes this understanding into **three levels**, and argues the **topmost one (computational theory) is the most important — and the most neglected**.
>
> 要理解任何一个**信息加工系统**（视觉、大脑、乃至一台计算机），**只看硬件/神经元远远不够**。必须先在一个**独立的、抽象的「计算」层面**上问清楚：这个系统到底在解决什么问题、为什么这么解是对的。Marr 把这种理解拆成**三个层次**，并主张**最上面那层（计算理论）最重要、也最被忽视**。

> **Marr's most famous line / 全书最著名的比喻**
> Trying to understand perception by studying only neurons is like trying to understand bird flight by studying only feathers: it just cannot be done.
> 想靠只研究神经元来理解知觉，就像想靠只研究羽毛来理解鸟怎么飞——根本做不到。

---

## 0. What Is Vision? | 视觉是什么？

> _Vision is the process of discovering from images what is present in the world, and where it is._
> 视觉 = 从图像中发现「世界上有什么、它在哪里」的过程。

The load-bearing words are **process** and **discovering (inferring)**. What the retina receives is just an array of **intensity values**; the fact that "there is a cat, two meters away" is **not written directly into the image** — it has to be **computed**.
关键词是 **process（过程）** 和 **discovering（发现/推断）**：视网膜拿到的只是一堆**亮度数值（intensity array）**，「外面有一只猫、在两米处」这件事**并不直接写在图像里**，必须**算出来**。

So vision is fundamentally an **information-processing task** — which is exactly why it can, and must, be studied in the language of _computation_.
所以视觉本质上是一个 **information-processing task（信息加工任务）**——这正是为什么可以、也必须用「计算」的语言来研究它。

This definition already plants the book's whole logic: if it is "information processing," then ask "what is the input, what is the output, what transformation happens in between" — rather than starting from "which neuron lights up."
这一步定义已经埋好了全书逻辑：既然是「信息加工」，就该问「输入是什么、输出是什么、中间做了什么变换」——而不是一上来就问「哪个神经元亮」。

---

## 1. Background: Why "Just Watching Neurons" Fails (1.1) | 为什么只盯神经元走不通

Marr first reviews the triumphs and frustrations of 1950s–70s neurophysiology, and draws a sharp conclusion.
Marr 先复盘了 1950–70 年代神经生理学的辉煌与困境，得出一个尖锐结论。

### 1.1 The exciting discoveries | 那些激动人心的发现

- **Receptive fields and center–surround structure** (Hartline, Kuffler) — see Lecture 2 §7.2.

- **Hubel & Wiesel**: orientation-selective cells in V1, simple/complex cells, ocular dominance columns (Nobel Prize).

- The **"feature detector"** paradigm, with two star cases:
  - The **frog's "bug detector"** (Lettvin et al. 1959, _What the frog's eye tells the frog's brain_): retinal cells that fire specifically for "small, dark, moving spots."
  - The **fly's visual system** (Reichardt & Poggio): studied so thoroughly that the actual motion-detection circuitry was worked out.

- **感受野与中心–周边结构**（Hartline、Kuffler）——见 Lecture 2 §7.2。

- **Hubel & Wiesel**：V1 的**朝向选择性**细胞、简单/复杂细胞、眼优势柱（诺奖）。

- **「特征探测器（feature detector）」范式**，两个明星案例：
  - **青蛙的「捕虫探测器」**（Lettvin et al. 1959）：视网膜里专门对「小、黑、移动的点」放电的细胞。
  - **苍蝇的视觉系统**（Reichardt & Poggio）：被研究得极透，连具体的运动检测电路都摸清了。

### 1.2 And yet — "So what?" | 然而——「然后呢？」

Marr's key insight: **even once you've catalogued what every neuron fires for, you still don't understand how vision works.**
Marr 的关键洞察：**就算你把每个神经元对什么放电都查清楚了，你依然不懂视觉是怎么工作的。**

- Knowing "this cell fires for a 45° edge" ≠ knowing "how the brain recognizes a cat from an image."

- The fly's circuit was the best understood of all, yet it **never generalized into a theory of "the problem of motion detection itself"** — you learn nothing transferable to other systems.

- The root cause: **a level is missing.** People kept ping-ponging between "mechanism (neurons)" and "behavior (psychophysics)," but **nobody analyzed the logical structure of the computational problem the system has to solve.**

- 知道「这个细胞对 45° 边缘放电」≠ 知道「大脑如何从一张图里认出一只猫」。

- 苍蝇电路被研究得最透，但**它没有推广成一套关于「运动检测这个问题本身」的理论**——你学不到任何能迁移到别的系统的东西。

- 病根：**缺了一个层次。** 大家在「机制（神经元）」和「行为（心理物理）」之间反复横跳，**唯独没人去分析「这个系统要解决的计算问题，其本身的逻辑结构是什么」**。

> Marr names and criticizes **Barlow's "neuron doctrine"** — the program of reducing every percept to the activity of single neurons. The point is not that neurons don't matter, but that **without a computational theory, no amount of neural data adds up to understanding.** The same critique applies to early AI: a program that merely "runs" but can't say what problem it solves accumulates no real knowledge.
> Marr 点名批评 **Barlow 的「神经元学说（neuron doctrine）」**——那种「把每个知觉都还原到单个神经元活动」的纲领。不是说神经元不重要，而是**没有计算理论时，再多的神经元数据也拼不出理解**。同样的批评也适用于早期 AI：只会「能跑」却说不清在解什么问题的程序，无法积累真正的知识。

---

## 2. ==The Three Levels of Understanding (1.2) | 理解的三个层次==

This is the single most important table in the book — and arguably in cognitive science. **Any complex information-processing system must be understood, separately, at three independent levels:**
这是全书、也是整个认知科学最重要的一张表。**任何复杂信息加工系统，都必须在三个相互独立的层次上分别理解：**

| Level / 层次 | The question it answers / 回答的问题 | Plain version / 通俗说法 | Vision example / 视觉例子 |
|---|---|---|---|
| **① Computational theory 计算理论** | What is the **goal** of the computation, why is it **appropriate**, and what is the **logic** of the strategy? / 这个计算的**目标**是什么？为什么**恰当**？完成它的**策略逻辑**是什么？ | **What & Why** 在算什么、为什么 | Why recovering depth from the two eyes' disparity is geometrically possible, and what constraints make it work / 「从两眼图像差异恢复深度」在几何上为何可行、约束是什么 |
| **② Representation & algorithm 表征与算法** | How is the theory implemented? What **representation** for input/output, what **algorithm** for the transformation? / 怎么实现？输入/输出用**什么表征**？用**什么算法**做变换？ | **How (abstractly)** 用什么数据结构、按什么步骤 | How disparity is encoded; the specific matching algorithm / 用什么编码视差、具体的匹配算法 |
| **③ Hardware implementation 硬件实现** | How are the representation and algorithm realized **physically**? / 这套表征和算法在**物理上**如何实现？ | **Physically** 用什么物料搭出来 | Specific neurons & synapses, or silicon chips / 具体的神经元、突触，还是硅芯片 |

### 2.1 Key property: the levels are **loosely coupled** | 关键性质：三层松耦合

- One **computational theory** can be implemented by **many different algorithms**; one **algorithm** can run on **many different hardwares**.

- Conversely, some phenomena only make sense at one level: a hardware quirk (e.g., a visual illusion) need not have a "reason" at the computational level.

- **Diagnostic value**: when researchers argue, it's often because they are **talking past each other across levels** while believing they discuss the same thing. Asking "which level is your explanation at?" dissolves much of the confusion.

- 同一个**计算理论**可由**很多不同算法**实现；同一个**算法**又可跑在**很多不同硬件**上。

- 反过来，某些现象只在某一层才解释得通：硬件层的怪癖（如视错觉）未必能在计算层找到「理由」。

- **诊断价值**：研究者吵架，常常是因为他们**在不同层次上各说各话**还以为在谈同一件事。先问「你这个解释是哪一层的？」能化解一大半混乱。

### 2.2 The cash-register / addition example | 经典范例：收银机 / 加法

Marr uses "a supermarket cash register doing addition" to nail all three levels:
Marr 用「超市收银机做加法」把三层讲透：

| Level / 层次 | What it is, for "addition" / 对「加法」而言是什么 |
|---|---|
| **① Computational theory 计算理论** | The **theory of addition itself**: it maps a pair of numbers to a number, obeys commutativity, associativity, has an identity element 0, has inverses… and why "total = sum of items" is the right checkout logic. **Independent of which number system or machine you use.** / **加法这个运算本身的理论**：把一对数映射到一个数，满足交换律、结合律、有单位元 0、有逆元……「总价 = 各项之和」为何是合理的结账逻辑。**与你用什么数字系统、什么机器无关**。 |
| **② Representation & algorithm 表征与算法** | **Arabic** vs **Roman** vs **binary** numerals? Which carry-and-add procedure? (Same addition, very different algorithm/representation.) / 用**阿拉伯**、**罗马**还是**二进制**表示数？采用**哪套进位相加步骤**？（同一个加法，算法/表征可截然不同） |
| **③ Hardware implementation 硬件实现** | Does the algorithm run on **gears**, **silicon transistors**, or **neurons**? / 这套算法跑在**齿轮**、**硅晶体管**，还是**神经元**上？ |

The crucial claim: **to understand the algorithm (②), thinking through "the problem itself (①)" is usually faster than taking apart "the machine (③)."** _An algorithm is likely to be understood more readily by understanding the nature of the problem being solved than by examining the mechanism in which it is embodied._
**最关键的论点**：**要理解算法（②），想清楚「问题本身（①）」往往比拆解「机器（③）」更快。**

Corollary: **the nature of a computation depends more on the problem to be solved than on the hardware that implements it.** This is why Marr says the computational level is the most important, yet the most neglected.
推论：**计算的性质，更多取决于「要解决的计算问题」，而非「实现它的硬件」。** 这就是为什么 Marr 说**计算层最重要、却最被忽视**。

### 2.3 What is a "representation"? An underrated core concept | 表征是什么？一个被低估的核心概念

Marr gives a precise definition:
Marr 给了精确定义：

> ==A representation is a \*\*formal system for making explicit certain types of information\*\*==, together with ==a specification of how the system does this.== The result of using a representation to describe a given entity is a **description** of that entity in that representation.
> 表征 = 一套用来把某类信息「**显式化（make explicit）**」的形式系统，外加一份「这套系统怎么做到的」说明书。用某个表征去描述一个对象，得到的就是该对象在这个表征下的**描述（description）**。

- Example: the number 37 can be written as Arabic `37`, Roman `XXXVII`, or binary `100101` — **same number, different representations.**

- **The core trade-off: every representation makes some information obvious while hiding other information.**
  - Arabic numerals make **hand arithmetic** easy but make **"is it a power of 2?"** hard.
  - Binary makes **"power of 2"** obvious (trailing zeros) but is bad for human hand-calculation.
  - Roman numerals collapse entirely at multiplication.

- **Methodological upshot**: pick the right representation and the problem is half-solved; pick the wrong one and you're stuck. So **"what representation does the visual system use"** is a real question, not a technical detail.

- 例子：数字 37 可写成阿拉伯 `37`、罗马 `XXXVII`、二进制 `100101`——**同一个数，不同表征**。

- **核心权衡：任何表征都让某些信息「一目了然」，同时把另一些「藏起来」。**
  - 阿拉伯数字让**手算**方便、但**判断 2 的幂**很难。
  - 二进制让**判断 2 的幂**一眼可见（看末位 0）、但不适合人手算。
  - 罗马数字做乘法直接崩溃。

- **方法论含义**：选对表征，问题解决一大半；选错表征，寸步难行。所以「视觉系统用什么表征」是个真问题，不是技术细节。

> **Tie-in for AI work / 和 AI 的呼应**
> This is the ancestral statement of today's **"representation learning,"** feature/embedding design, and ==\*why tokenizers / coordinate frames / prompt formats\* matter so much.== "A representation makes some information explicit and other information implicit" explains embedding spaces, what attention can and cannot do, and why reformatting a prompt swings model behavior.
> 这正是今天 ML 里「**representation learning**」、feature/embedding 设计、以及「为什么 tokenizer / 坐标系 / prompt 格式如此影响效果」的祖宗级论述。「表征决定哪些信息显式、哪些隐式」这句话拿去解释 embedding 空间、attention 能/不能做什么、换个 prompt 格式模型行为大变，全都成立。

---

## 3. Type 1 vs Type 2 Theories | 两类理论

Marr is honest: not everything admits a clean computational-level theory.
Marr 诚实地承认：不是所有东西都能有漂亮的计算层理论。

| Type / 类型 | Meaning / 含义 | Cleanly understandable? / 能否干净理解 |
|---|---|---|
| **Type 1 theory** | The problem is a **well-defined computation**, capturable by a clean theory and decomposable into independently solvable subprocesses. / 问题是一个**明确定义的计算**，可被清晰理论刻画、再分解成可独立解决的子过程。 | Yes. Marr **bets most of vision is Type 1.** / 能。Marr 押注**视觉大部分是 Type 1**。 |
| **Type 2 theory** | The problem is solved by **many processes acting simultaneously**, whose interaction **is its own simplest description** — no cleaner decomposition exists. / 问题由**大量过程同时相互作用**来解，这些交互**本身就是它最简单的描述**——无法进一步干净分解。 | Hard. "It just works this way, tangled." / 难。「它就是这么纠缠地 work 的」，没有更简洁的理论。 |

The working discipline: **assume Type 1 first and look hard for its computational theory**; only after repeated failure do you concede it might be Type 2. Don't dismiss a problem with "the brain is just a complex mess."
实践纪律：**先假设是 Type 1，努力去找它的计算理论**；只有反复失败，才退而承认它可能是 Type 2。别轻易用「大脑就是一团复杂的东西」打发问题。

---

## 4. A Representational Framework for Vision (1.3) | 视觉的表征框架

At level ② (representation & algorithm), Marr proposes the famous "vision builds a series of representations, stage by stage" blueprint. The purpose of vision: **starting from images, build up a description of the shapes and positions of things in the world.**
在第②层（表征与算法），Marr 提出著名的「视觉是逐级构建一系列表征」蓝图。视觉的目的：**从图像出发，一步步建起对「世界中物体的形状与位置」的描述。**

| Stage / 阶段 | What it makes explicit / 表征内容 | Coordinate frame / 坐标系 | One line / 一句话 |
|---|---|---|---|
| **Image 图像** | An array of **intensity values** (gray levels) / 一组**亮度数值**（灰度阵列） | — | Raw input; nothing made explicit yet / 原始输入，什么都没「显式」 |
| **Primal Sketch 基元图** | **Intensity changes**: edges, bars, blobs, terminations, plus their **geometry & grouping** / 显式化**亮度变化**：边缘、线条、斑点、端点，及其**几何与组织** | 2D image coords / 2D 图像坐标 | "Where are the edges and structure?" / 「图里哪儿有边、有结构」 |
| **2.5-D Sketch 2.5 维图** | Depth, surface orientation, and discontinuities of **visible surfaces** / 显式化**可见表面**的深度、朝向、不连续处 | **Viewer-centered 观察者中心** | "From my viewpoint, how far / which way does each surface face" — not yet whole objects / 「从我这视角看，各表面离我多远、朝向哪」——还没还原成完整物体 |
| **3-D Model Representation 三维模型表征** | An **object-centered, hierarchical, modular** description of shape / **以物体为中心、层级化、模块化**的形状描述 | **Object-centered 物体中心** | "This is a person: torso + limbs as generalized cylinders" — usable for recognition / 「这是一个人，由躯干+四肢的广义柱体组成」——可用于识别 |

The key design idea: **move from viewer-centered to object-centered.** The 2.5-D sketch is still tied to "the angle I'm standing at"; the 3-D model converts it into the object's _intrinsic_ shape, so you can recognize the same object from a new angle — the precondition for **recognition.**
关键设计思想：**从「观察者中心」走向「物体中心」**。2.5-D 还绑在「我现在站的角度」上；3-D 模型把它转成「物体自身固有的形状」，所以换个角度也能认出同一物体——这是\*\*识别（recognition）\*\*的前提。

> **Tie-in to deep vision / 和深度视觉的呼应**
> Modern CNN/vision models' hierarchy — shallow edges → mid-level texture parts → deep objects — is almost an engineered re-run of Marr's table (cf. Lecture 2 §7.2, "receptive fields grow and features get more abstract layer by layer"). The difference: Marr designs these representations **a priori, from computational theory**; deep learning **lets data learn them** — yet the resulting hierarchies are strikingly similar.
> 现代 CNN/视觉模型的「浅层边缘 → 中层纹理部件 → 深层物体」层级，几乎是 Marr 这张表的工程化重演（对照 Lecture 2 §7.2 末尾那段）。区别在于：Marr 是**先验地、按计算理论设计**这些表征；深度学习是**让数据自己学出来**——但学出来的层级结构惊人地相似。

---

## 5. Why the Three Levels Matter for Brains and LLMs Alike | 三层框架对理解大脑与 LLM 的意义

**Marr's three levels are a diagnostic ruler.** For any claim about a brain or a model, first ask: **is this a computational-, algorithmic-, or implementation-level explanation?** The three must not be conflated.
**Marr 三层是一把诊断尺子。** 对任何关于大脑或模型的解释，先问：**这是计算层、算法层，还是实现层的解释？** 三者不可混为一谈。

**Implications for mechanistic interpretability:**

- "We found what this attention head does" / "we localized a neuron or feature" — these are mostly **implementation-/algorithm-level** findings.
- On their own they **need not tell you what problem the model is solving** — exactly Marr's critique of the neuron doctrine, applying almost word-for-word to interpretability: without a computational-level theory, even endless feature visualizations may not add up to "understanding."
- The flip side is optimistic: because the levels are loosely coupled, the computational level — "what problem the model should solve and why solving it this way is right" — can be worked out **without** knowing every hardware detail first.

**对机制可解释性（interpretability）的启示：**

- 「找到了某个 attention head 在做什么」「定位了某个 neuron / feature」——这些大多是**实现层 / 算法层**的发现。
- 但**光有这些，未必说明模型在解什么问题**——这正是 Marr 对「神经元学说」的批评，几乎一字不改地适用于 interpretability：没有计算层理论，再多的 feature 可视化也可能拼不出「理解」。
- 反过来也有乐观的一面：因为三层松耦合，计算层（「模型该解什么问题、为什么这么解对」）可以**在不知道全部硬件细节的情况下**先想清楚。

**Implications for alignment / eval:** defining "what the model should do, and why that counts as correct" _is_ writing a computational-level theory. Many evals fail because they only measure behavior (≈ implementation-level performance) without stating the computational-level goal.
**对 alignment / eval 的启示：** 定义「模型该做什么、为什么这样算对」本质上是在写**计算层理论**。很多 eval 之所以失败，是因为只测了行为（≈ 实现层表现），却没说清计算层目标。

> To understand a system, ==first ask what problem it solves==, then how it solves it, and only last what it's built from.
> 理解一个系统，先问它在解什么问题，再问它怎么解，最后才问它用什么搭出来。

---

## 6. Bilingual Glossary | 中英术语对照表

| 中文 | English | 一句话记忆 / one-line |
|---|---|---|
| 信息加工任务 | information-processing task | 视觉的本质 / the essence of vision |
| 计算理论（计算层） | computational theory / computational level | 在算什么、为什么（最重要那层）/ what & why |
| 表征与算法（算法层） | representation and algorithm | 用什么数据结构、按什么步骤 / how, abstractly |
| 硬件实现（实现层） | hardware implementation | 用什么物料搭出来 / physically realized |
| 松耦合 | loosely coupled | 三层各自独立、多对多映射 / levels map many-to-many |
| 表征 | representation | 把某类信息**显式化**的形式系统 / makes info explicit |
| 描述 | description | 用某表征刻画对象的结果 / output of a representation |
| 显式化 | make explicit | 表征让某些信息一目了然、另一些被隐藏 |
| 特征探测器 | feature detector | 青蛙捕虫细胞、苍蝇运动电路（被批「没有理论」） |
| 神经元学说 | neuron doctrine | Barlow 的还原纲领，Marr 认为不够 |
| Type 1 理论 | Type 1 theory | 有干净计算理论、可分解 |
| Type 2 理论 | Type 2 theory | 大量过程纠缠、无更简描述 |
| 基元图 | primal sketch | 显式化边缘/线条/斑点 |
| 2.5 维图 | 2.5-D sketch | 观察者中心的表面深度/朝向 |
| 三维模型表征 | 3-D model representation | 物体中心、层级化形状，用于识别 |
| 观察者中心 / 物体中心 | viewer-centered / object-centered | 「从我这角度」vs「物体自身固有」 |
| 灰度阵列 | intensity array / gray-level array | 图像的原始数值形式 |

---

### 一句话总结全篇 | One-Sentence Summary

> To understand any information-processing system, work at **three levels** — **computational theory** (what problem, and why) → **representation & algorithm** (what data structures, what steps) → **hardware implementation** (what it's built from). The levels are **loosely coupled**, and Marr insists the top one is the most important yet most neglected ("studying neurons to understand perception is like studying feathers to understand flight"). For vision specifically he gives the staged blueprint **image → primal sketch → 2.5-D sketch → 3-D model**. The framework transfers intact to **understanding LLMs and interpretability**: first ask what problem the model solves, then how, and only last what it's built from.
>
> 理解任何信息加工系统都要分**三层**：**计算理论（在解什么问题、为什么）→ 表征与算法（用什么数据结构、按什么步骤）→ 硬件实现（用什么物料）**。三层**松耦合**，Marr 力主**最上层「计算理论」最重要也最被忽视**（「只研究神经元而想懂知觉，就像只研究羽毛而想懂飞行」）。落到视觉，他给出「**图像 → primal sketch → 2.5-D sketch → 3-D model**」的逐级表征蓝图。这套框架原封不动地适用于**理解 LLM 与可解释性**：先问模型在解什么问题，再问它怎么解，最后才问它用什么搭出来。

---

> **核对来源 / Sources（章节结构与三层定义已核对）**：[MIT Press · Vision](https://mitpress.mit.edu/9780262514620/vision/)；[McClamrock, _Marr's Three Levels_](https://www.albany.edu/~ron/papers/marrlevl.html)
