---
publish: true
title: Lecture 5 笔记：Cognitive Neuroscience Methods II 认知神经科学方法（二）
created: 2026-06-03T15:56:16.277+08:00
modified: 2026-06-03T17:18:07.635+08:00
tags:
  - cog-neuro-sci
---

官方资源（Spring 2019）：

- [Video(YouTube)](https://www.youtube.com/watch?v=YD7QG4G7WVg)
- [Transcript](https://ocw.mit.edu/courses/9-13-the-human-brain-spring-2019/de3bbf89e8fc0153b6873491f5186a82_YD7QG4G7WVg.pdf)
- [Lecture Notes 页面](https://ocw.mit.edu/courses/9-13-the-human-brain-spring-2019/pages/lecture-notes/) 选 "Lecture 5"
- [课程主页](https://ocw.mit.edu/courses/9-13-the-human-brain-spring-2019/)

本课为人脸知觉方法综述的下半场（Part 2 of 2），续 Lecture 4。

## 大纲

（Outline：Survey of Methods in Cognitive Neuroscience, & the Questions they answer, applied to face perception, Part 2 of 2）

- A. 计算理论（Computational theory）
- B. 行为（Behavior）
- C. fMRI
- D. 事件相关电位（ERPs）
- E. 脑磁图（MEG）
- F. 颅内记录（Intracranial recording）
- G. 局灶性脑损伤患者（Patients with focal brain damage）
- H. 经颅磁刺激（TMS）
- 脑电刺激（Electrical stimulation of the brain）

方法存在的目的只是回答科学问题，因此一切从问题出发。

> "methods in any field of science are just there to enable us to answer scientific questions... they're just to answer questions. And so you always have to start with the questions."

---

# 关于人脸识别的关键问题（Key Questions about Face Recognition）

先交代两个贯穿全篇的基础概念：**表征（representation）** 指脑内对外界信息的内部编码，例如"这是谁"在脑中的表示；**Marr 计算理论层** 指分析一个心理过程的最高层次——先不谈神经元和脑，只问"要解决什么计算问题、输入输出各是什么、难在哪"（详见 Lecture 4）。

1. 人脸知觉问题的本质是什么？（输入、输出、难点）——Marr 计算理论层。
2. 我们从人脸中提取的表征的本质是什么？
3. 人脸知觉是否是独立于其余视觉/认知的系统？
4. 人脸被检测和识别有多快？
5. 每个脑区在人脸识别中的因果作用（causal role）是什么？
6. 人脸识别如何在单个神经元/回路中实现？

Lecture 4 推进了 1–3；本课快速复习 1–3（方法 A/B/C），再用方法 D–H 推进 4–6。每讲一种方法，就回到这张问题清单填补一行答案。

---

# A. 计算理论（复习）

要解决的问题：图像 → 身份（"Julia!" / "Brad!"）。

⭐ 核心计算难题：每次看到同一张脸，它在光照、朝向、发型、情绪等方面都不一样，也就是说**同一张脸会投出差异极大的图像**（huge variation across images of a single face）；而我们却要从这些千差万别的图像里认出"是同一个人"。这是问题 1 的答案。

# B. 行为（复习）

证据一：对不熟悉的人，我们不擅长提取**不变表征**——即不随光照、角度、表情而变的稳定身份表征（invariant representation）。依据是 Lecture 4 的 Jenkins et al. (2011)：被试无法把同一个陌生人的多张照片正确归为一人。

证据二，**倒脸效应（face inversion effect，Yin, 1969）**——MIT 脑与认知科学系 1969 年一篇博士论文中的发现：相比正立刺激，上下颠倒刺激的识别错误增多（an increase in errors for upside-down compared to upright stimuli）；且人脸的倒置效应大于房子、火柴人（stick figures）等其它刺激。提示人脸识别可能与物体识别工作方式不同。

⭐ 问题 2 的答案（来自上面两条简单行为数据）：人类从人脸提取的表征**不是图像不变的**（对陌生人脸尤其如此——来自证据一），而且**与朝向有关**（orientation specific——来自证据二，倒过来就认不出）。

**行为方法的优缺点（Strengths and Weaknesses of Behavioral Methods）**

优点：(1) 善于刻画内部表征（至少能定性描述，即说清性质而非精确数值）；(2) 善于分辨两种心理过程是否彼此独立（如人脸加工 vs 物体加工）；(3) 便宜。

缺点：(1) 与脑无直接关联（除非补充其它信息）；(2) 数据稀疏——只有加工最后阶段的输出，而我们想刻画整条加工链的每一阶段。

> "Computations tend to have multiple stages and unfold over time. And all we have is the output."

# C. fMRI（复习 + 实验设计逻辑）

fMRI（功能性磁共振成像，functional MRI）：通过血流变化间接测量脑活动的无创方法，是正常人全脑范围内空间分辨率最好的手段。它测到的信号叫 **BOLD（血氧水平依赖信号，blood-oxygen-level-dependent）**——某处神经活动增强时局部血流随之变化，BOLD 就反映这一变化；下文（含那张响应表）所说的"反应强度"都是 BOLD 信号的相对大小。

**假设与检验**

假设：脑中存在一个对人脸选择性反应（即对人脸的反应明显强于其它类刺激）的区域。检验：把人放进扫描仪，看人脸与物体。是否找到对人脸 > 物体反应更高的区域？找到了。

**先想替代假说，再逐一检验（think up alternative hypotheses, then test them）**

"对人脸 > 物体反应更高"是否有更简单的解释？这个区会不会其实是对——任何人类相关之物（anything human）？任何身体部位（any body part）？任何被注意之物（anything attended）？任何带曲线之物（anything curvy）——都有反应，只是人脸恰好同时满足这些？为排除"只是注意力多寡的差异"，实验用 1-back 任务把各条件下的注意量固定住（1-back 任务：当前刺激与上一个相同时按键，迫使被试在每种刺激上都投入相当的注意）。

⭐ **定位器逻辑（localizer logic）**：先用第一个实验作为"定位器"（localizer），在每个被试个体脑中找到该区域，记下确切位置；再用新的"条件"（conditions）测它的反应。之所以必须逐个被试定位，是因为该区域的确切位置因人而异（varies from one subject to the next）——若把一个人的坐标配准到另一个人脑上，取到的并不正好是那块区域。"条件"指实验中被操纵并测量的刺激变量。

**梭状回面孔区（fusiform face area, FFA）**：用上面的逻辑检验那些替代假说——在几乎每个正常被试的相近位置都能定位到这个区，再测它对人脸、身体、手、带曲线之物等的反应；结果人脸的反应高于迄今测试过的任何其它刺激，替代假说由此被排除。下表是 FFA 对各类刺激的相对 BOLD 反应强度（数值越大反应越强）。可以看到一条由强到弱的梯度：正立真人脸最强，类人脸的图（卡通、猫脸、残缺人脸）居中，纯非人脸物体（手、建筑）最弱。

| 反应强度 | 刺激 | 是什么 |
|---|---|---|
| 1.9–2.3 | Front-View | 正面真人脸 |
| 2.0 | Mooney | Mooney 脸：黑白二值的退化人脸图，需自上而下补全才能看出是脸 |
| 1.8 | Profile-View | 侧面人脸 |
| 1.7 | Human Head | 人头 |
| 1.7 | No Eyes | 去掉眼睛的人脸 |
| 1.7 | Cartoon | 卡通脸 |
| 1.6 | Inv. Grey | 倒置（inverted）的灰阶人脸 |
| 1.6 | Cat Face | 猫脸 |
| 1.4 | Inv. Cartoon | 倒置卡通脸 |
| 1.3 | Eyes Only | 只保留眼睛 |
| 1.3 | Inv. Mooney | 倒置 Mooney 脸 |
| 1.3 | Animal Head | 动物头 |
| 1.1 | External Ftrs | 只保留外部轮廓特征（发型、脸型）、去掉五官 |
| 1.0 | Human Body | 人体（无头） |
| 1.0 | Back of Head | 后脑勺 |
| 0.9 | Whole Animal | 整只动物 |
| 0.8 | Animal Body | 动物身体 |
| 0.7 | Hand | 手 |
| 0.6–1.1 | Object | 一般物体 |
| 0.6 | Buildings | 建筑 |

**Mooney 人脸正立 vs 倒置**：同一张退化人脸图，仅上下颠倒——正立时能看出脸、倒置时看不出；FFA 对正立版（看到脸时）反应远强于倒置版。这排除了"FFA 只对某种空间频率/对比度/明暗信息选择"的说法——同一刺激，差别只在是否看到脸。

**几个悬而未决的问题**：能在几乎每个人脑中稳定找到 FFA，是否意味着它是先天的（innate）？是否意味着它对人脸识别是必需的（necessary）？是否告诉了我们人脸识别究竟如何工作？——都不能。fMRI 上能看到一个反应，"几乎只是第 0 步"（barely step zero）。

**fMRI 优缺点**

优点：对正常被试可用的最佳空间分辨率；无创（noninvasive）。

缺点：无法判断所测活动是否在认知/行为中起因果作用；BOLD 的生理基础不清楚（到底反映突触活动还是动作电位——spikes，即神经元发放的电脉冲）；空间分辨率最好约 1 mm（难看清皮层柱 cortical columns，即皮层中功能相近神经元构成的纵向微柱）；昂贵（> \$600/小时）；耳道与鼻窦附近磁不均匀导致的磁敏感伪影（susceptibility artifact）；噪声大；时间分辨率远不及视觉信息加工的时间尺度。

**为什么要问"多快"**：因为我们想理解识别人脸时脑内运行的计算。有些计算是迭代的、含反复的假设检验与反馈（iterative, feedback），有些则是信息沿视觉系统从输入到输出一次性向前传递的前馈扫描（a feedforward sweep）——二者时间尺度可能很不同。fMRI 回答不了这个问题，因为它经由血流、太慢。

---

# D. 事件相关电位（ERPs）

先分清两个名词：EEG 是记录手段，ERP 是对 EEG 数据的一种处理方式。

**脑电图（electroencephalography, EEG）**：在头皮上贴 12–100+ 个电极，连续测量脑的电位、对其下大量神经元求和。它一直在记，得到的是一条混着各种活动的原始电信号。空间分辨率很差（信号在头皮上四处弥散，无法定位来自脑内何处）。

**事件相关电位（event-related potential, ERP）**：拿 EEG 数据，把每次刺激出现的时刻当作零点对齐（time-locked to stimulus onset），再跨很多试次叠加平均。随机的背景活动正负相消被平均掉，只剩下每次都与该刺激稳定挂钩的那段反应。所以 ERP 不是另一种仪器，而是 EEG 加上「按事件对齐 + 跨试次平均」。

旧类比（说明 EEG 空间分辨率之差）：像把麦克风放在橄榄球场顶棚内侧——能知道何时达阵（touchdown）得分，但仅此而已；很难分辨看台上某人对另一人说了什么。（这一点正在改变。）

**Thorpe et al (1996)（指定阅读）**：人能多快判断一张图里是否有动物？

为什么不直接用反应时（reaction time，从图像出现到按键的耗时）？因为反应时把运动阶段也算进去了——看到动物 → 判断按哪个键 → 用哪根手指 → 信号一路传到手指，这段运动耗时与知觉耗时混在一起。于是该研究改从脑内信号里"读"出一个时间点：对额叶（frontal，前额一带，主管运动准备）电极的 ERP 求平均，有动物与无动物两条曲线在约 150 ms 处分叉。

⭐ 推理很微妙：曲线在 150 ms 分叉，说明到 150 ms 时脑内对"有/无动物"已开始有所不同。但 150 ms 既是该加工发生时刻的**上界**（可能更早就完成、我们看到的是更晚的运动阶段），也是该加工**起始**时刻的上界（分叉≠加工已完成）。

**Bentin et al (1996)**：刺激起始后 170 ms 出现人脸特异反应（即 N170），相对汽车、打乱的人脸等，在大致枕颞（occipitotemporal，后脑枕叶与颞叶交界一带）位置出现更大的波峰，右半球更明显。说明：(1) 又一项证据表明脑中存在对人脸特异的机制；(2) 人脸在刺激后 170 ms 已被（开始）与非人脸区分（faces are discriminated from nonfaces by 170 ms，很快）。但该信号是否来自 FFA？无从得知——只能大致说在脑后部（枕颞电极更明显）；想从头皮信号反推它在脑内的确切来源，是个**病态问题**（ill-posed：答案不唯一，下面 MEG 部分详述）。

---

# E. 脑磁图（MEG）

头部周围排布 300+ 个传感器，测量神经元电流产生的磁场（电流会产生磁场，二者方向的关系由右手定则 right-hand rule 决定）。

**为什么主要"看见"脑沟**：支撑知觉/认知的活动多发生在灰质（神经元胞体聚集的皮层表层），电流方向大致垂直穿过皮层。位于脑回（bumps, gyri）的活动，按右手定则其磁场大体留在皮层内，外部探测器难以测到；而位于脑沟（folds, sulci）的活动，其磁场会伸出脑外，可被磁传感器探测。故 MEG 主要"看见"脑沟内、即皮层中与头皮垂直部分的活动，而非脑回。

参数：磁场约 10⁻¹³ 特斯拉（Tesla），约为地球磁场的 1/10⁶，需大量屏蔽（CBMM 的 MEG 临近地铁，用多层铜屏蔽隔绝外界噪声）。探测器是超导量子干涉器件（Superconducting Quantum Interference Devices, SQUIDs），用液氦冷却到 −269 ℃。MEG 由 MIT 的 David Cohen 发明，第一台设备造于 1968 年。

**M170**：用头皮磁传感器同样能在刺激后 170 ms 检到人脸选择性反应（"M170"，位于枕颞 occipitotemporal 传感器上）。说明人脸检测发生得很快，并提示存在专门的皮层机制。（这批数据尚未超出 ERP 所能给出的结论。）

**EEG & MEG 优缺点**

优点：无创；时间分辨率极佳。此外，新的机器学习方法能从 ERP/MEG 反应中"解码"（decode）出人看到/想到了什么，效果出奇地好，打开了大量研究可能（后续课程详谈）。

缺点：空间分辨率很差——这是另一类病态的"逆问题"（ill-posed "inverse problem"）。脑内许多不同的源配置都能在头皮产生同一组电/磁场，因此无法求得唯一解；这与不变物体识别所面对的病态问题同源。

---

# F. 颅内记录（Intracranial recording）

⭐ 这是人身上唯一同时具备高空间与高时间分辨率的方法。对象是难治性癫痫（intractable epilepsy）的神经外科患者：取下一块颅骨，切开并拨开硬脑膜（dura mater），把电极直接贴在脑表面（subdural）。这样做有两个临床目的：当患者发作时三角定位（triangulate，用多个电极信号交叉推断位置）癫痫灶（seizure focus，引发癫痫的病灶）；以及绘制功能图（避免切到语言、运动等区域）。部分患者愿意在此期间配合看实验刺激。

**脑表面记录（日本患者，沿梭状回的电极条）**：约 2 mm 大小的皮层小块对人脸近乎排他地反应；该反应极其选择性，远比 fMRI 更选择（因直接记自脑表面），且自带时间信息——反应约在 130–150 ms 起、约 170 ms 达峰。2 mm 电极尺寸接近一个 fMRI 体素（voxel，fMRI 图像的最小三维像素单元），但模糊更少（fMRI 因血流而空间模糊）；尽管如此，仍是对数万个神经元求平均（比 fMRI 的数十万个少一个量级）。

**人 FFA 中的单个神经元（Khuvis et al, bioRxiv, 2018）**：电极尖端带可记录单神经元的微丝（μwires）。术前先用 fMRI 定出该患者的 FFA，再在其附近植入电极。结果首次记录到人 FFA 中的单个神经元：每个点是一个动作电位（spike），FFA 神经元对人脸选择性反应。它们能区分不同人脸吗？对不同人脸的反应有所不同，提示其中"可能"含有身份信息——但也可能只是噪声（同一张脸反复呈现也可能给出同样分布），需用机器学习/解码方法才能验证。局限：几乎无法在事后重新找到同一个神经元。

**颅内记录优缺点**

优点：人身上唯一同时高空间 + 高时间分辨率的方法。

缺点：有创，仅在有神经系统疾病的患者身上可行；数据稀少且难以控制；同样无法判断所测活动是否在认知/行为中起因果作用。

> "Resolution doesn't get you causality. To test the causal role of something, you need to mess with it."

因果性是科学理解的核心——要检验脑区 X 对行为的因果作用，必须去扰动 X、再看行为发生什么变化。

---

# G. 局灶性脑损伤患者（Patients with focal brain damage）

**疑似缺失 FFA 的患者（Wada & Yamamoto, 2001）**：其损伤位置正落在 FFA 通常所在的区带，患者无法识别人脸；关键在于，该患者识别物体完全正常（completely normal at recognizing objects）。这表明：FFA 对人脸识别是关键的，但对物体识别不是。

**面孔失认症（prosopagnosia）**：损害人脸的辨别与识别，但不损害人脸检测（仍知道"这是一张脸"，只是不知道是谁）；声音识别、由职业描述说出姓名等保持正常。它可来自损伤，也可为发育性——如 Jacob Hodes，无任何脑损伤却终生不能识别人脸，但其 FFA 形态正常。

⭐ 发育性面孔失认者可以拥有形态正常的 FFA → 拥有一个"对人脸反应更强的区域"并不足以保证正常的人脸识别（not sufficient for normal face recognition）。还需要：该区内回路真正能工作（能把人脸与物体区分开）、记忆、以及把信息读出并送往全脑其余部分的连接。

⭐ **单一分离（single dissociation）不足以下结论**。"分离"指一种能力受损、另一种能力保留；面孔失认就是一例单一分离（认脸坏了、认物体好）。但仅凭这一条仍与"人脸识别只是比物体识别更难"相容——若被损坏的是通用物体识别系统的一部分，那么较难的人脸任务自然会受更大冲击，照样表现为"认脸差、认物体好"。因此不能仅凭面孔失认就断定该区"专司人脸识别"。

**双重分离（double dissociation）**：患者 CK（Moscovitch et al, 1997）呈相反综合征——物体识别严重受损（分不清椅子、桌子、车、烤面包机），人脸识别却 100% 正常（甚至优于常人）。（CK 对倒置人脸的识别比常人更差，因为他依赖在倒置时失效的整体人脸系统。）

⭐ 两种相反缺陷的组合（一个"双重分离"）是强证据：人脸识别所用的脑机制对物体识别并非必需，反之亦然（the brain machinery for face recognition is not necessary for object recognition and vice versa）。它比单一分离更强，因为很难再用"人脸只是更难"之类的替代解释绕过去——否则不会出现 CK 这种相反综合征。

---

# 脑电刺激（Electrical stimulation of the brain）

前面所有方法（fMRI、ERP、MEG、颅内记录）都只是"看哪里在活动"，看得再清楚也证明不了因果——要确认某区对某行为有因果作用，必须去**扰动**它再看行为变化。神经外科医生有时会通过那些贴在脑表面的同一批电极通电刺激（本是为测试该区功能、定位癫痫灶）。这类罕见情形下，科学上能"鱼与熊掌兼得"——既保留颅内记录的高时空分辨率，又能像扰动实验一样检验因果作用。

**日本患者的电刺激实验**：刺激那块人脸选择性电极时，患者报告所看物体上方叠加出现一张脸；而当他看非人脸物体（盒子、球、汉字卡）时，被刺激同一电极——物体本身并不变形，只是"上面多了一张脸"。

⭐ 这一结果是很强的因果证据：该区不仅在因果上参与人脸知觉，而且是特异地、仅参与人脸知觉（causally involved in face perception only）——若它也因果参与非人脸知觉，刺激时盒子/球/汉字本应发生变形。（仍应继续设想替代假说与所需的控制条件。）

# H. 经颅磁刺激（TMS）

列于大纲，但本节因时间不足跳过、留待后续课程（TMS 即 transcranial magnetic stimulation，一种无创地暂时扰动局部皮层、以检验其因果作用的方法）。

---

# 今日要点：关键问题的更新答案（Key Questions, updated）

1. 人脸知觉问题的本质——Marr 计算理论层：主要难题是**单张人脸跨图像的巨大变异**。
2. 我们从人脸提取的表征：对不熟悉人脸**非图像不变**、**朝向特异**。
3. 人脸知觉是否独立系统：从行为与 fMRI 看像是，但尚未定论，思考为什么。
4. 人脸被检测/识别有多快：**人脸检测在 170 ms 前已开始，或许更早**（ERP/MEG 的 170 ms、颅内记录约 150 ms）；人脸的**识别**多快尚不清楚，待续。这是否告诉我们涉及哪类计算？暂时还不能。
5. 各脑区的因果作用：**FFA 在因果上参与人脸知觉，似乎不参与物体知觉**（来自患者双重分离与电刺激）——故人脸与物体识别也许需要不同的理论。
6. 在单个神经元/回路中如何实现：上述发现尚未告诉我们人脸识别中究竟是哪些计算、回路又如何执行这些计算。

---

## 方法对照（综合各方法的优缺点幻灯片）

| 方法 | 空间分辨率 | 时间分辨率 | 有创性 | 能否判因果 |
|---|---|---|---|---|
| 行为（Behavior） | — | — | 无创 | 否（与脑无直接关联） |
| fMRI | 较好（~1 mm，正常人最佳） | 差（秒级，经血流） | 无创 | 否 |
| ERP（EEG） | 差（病态逆问题） | 极佳（毫秒级） | 无创 | 否 |
| MEG | 差（病态逆问题；偏脑沟） | 极佳 | 无创 | 否 |
| 颅内记录（Intracranial） | 高 | 高 | 有创（仅患者） | 否 |
| 患者脑损伤（Lesion） | 受损伤范围限制 | — | 无创（研究已有患者） | 是（尤其双重分离） |
| 脑电刺激（Stimulation） | 取决于电极 | — | 有创（仅患者） | 是 |
| TMS | 中等 | 较好 | 无创 | 是 |

---

## 中英术语对照

| 中文 | English |
|---|---|
| 倒脸效应 | face inversion effect |
| 不变表征 | invariant representation |
| 定位器（逐被试定位） | localizer |
| 条件（实验设计） | condition |
| 梭状回面孔区 | fusiform face area (FFA) |
| 磁敏感伪影 | susceptibility artifact |
| 前馈扫描 / 迭代反馈 | feedforward sweep / iterative feedback |
| 脑电图 | electroencephalography (EEG) |
| 事件相关电位 | event-related potential (ERP) |
| 反应时 | reaction time |
| 脑磁图 | magnetoencephalography (MEG) |
| 右手定则 | right-hand rule |
| 脑回 / 脑沟 | gyri / sulci |
| 超导量子干涉器件 | SQUIDs |
| 逆问题（病态） | inverse problem (ill-posed) |
| 解码 | decode |
| 颅内记录 | intracranial recording |
| 硬脑膜 | dura mater |
| 癫痫灶 | seizure focus |
| 动作电位 | action potential (spike) |
| 面孔失认症 | prosopagnosia |
| 单一分离 / 双重分离 | single dissociation / double dissociation |
| 经颅磁刺激 | transcranial magnetic stimulation (TMS) |
| 脑电刺激 | electrical stimulation |

---

参考文献：Yin (1969)；Thorpe et al. (1996)；Bentin et al., _J Cogn Neurosci_ (1996)；Khuvis et al., bioRxiv (2018)；Wada & Yamamoto, _J Neurol Neurosurg Psychiatry_ (2001)；Moscovitch et al. (1997)。

关联：[[Week4_CogNeuroMethodsI_笔记]]、[[Week_1_Reading_Kanwisher2010_功能特异性]]、[[Week2_Reading1_Marr1982_中英对照]]。上接 Lecture 4：Methods I。
