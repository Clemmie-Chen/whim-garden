---
publish: true
title: Lecture 4 笔记：Cognitive Neuroscience Methods I 认知神经科学方法（一）
created: 2026-06-03T14:16:00.436+08:00
modified: 2026-06-03T15:27:12.865+08:00
tags:
  - cog-neuro-sci
---

官方资源（Spring 2019）：

- [Video(YouTube)](https://www.youtube.com/watch?v=vFZY--lgmHs)
- [Transcript](https://ocw.mit.edu/courses/9-13-the-human-brain-spring-2019/2074ec5346ad29c4bb1bc93031eb637b_vFZY--lgmHs.pdf)
- [Lecture Notes 页面](https://ocw.mit.edu/courses/9-13-the-human-brain-spring-2019/pages/lecture-notes/) 选 "Lecture 4"
- [课程主页](https://ocw.mit.edu/courses/9-13-the-human-brain-spring-2019/)

## 大纲（Outline for Today: Methods in Cog Neuro 1）

I. Marr 计算理论分析层（Marr Computational Theory Level of Analysis）

- 案例研究：颜色视觉（Case study: Color Vision）
  - Rosa 在影像中心候诊室的 demo
  - 讨论：我们用颜色来做什么？
  - 讲解：颜色视觉中的计算难题

II. 认知神经科学方法 & 它们回答的问题，应用于人脸知觉（Part 1 of 2）

- A. 计算理论（Computational theory）
- B. 行为（Behavior）
- C. fMRI

---

# I. Marr 计算理论分析层

## 总框架（Standard working framework）

本课的核心问题：脑如何产生心智？（How does the brain give rise to the mind?）

问题 1：心智是什么？心智 = 一组提取表征的计算（Mind = a set of computations that extract representations），表征即知觉/念头（percepts/thoughts）。

由此推论：如果真正理解了心智，就能写出代码，执行同样的计算、提取同样的表征。目前大多做不到，但这是目标。

⭐ Marr 的核心洞见：在对心智或脑做实证研究**之前**，必需的第一步是先思考"算什么、为什么算"（what is computed and why）。

## 以视觉运动为例

同一段视觉运动刺激可提取的输出（outputs）：有无运动（presence of motion）、有无人（presence of person）、运动方向（如 R→L）、是否在跳跃（jumping）、健康状况（health）、情绪（mood）。

要理解一个过程，需回答：

- 算什么、为什么算？（What is computed and why?）
- 输入是什么？输出是什么？（What are the inputs? What are the outputs?）
- 从输入到输出的计算难点是什么？（What are the computational challenges in getting from inputs to outputs?）

Marr：这是理解心智、进而理解脑的前提（a prerequisite for understanding minds, and hence brains）。

## Marr 的两段论述（Marr, 1982，引用原文）

只研究神经元来理解知觉，就像只研究羽毛来理解鸟怎么飞——根本做不到。要理解鸟的飞行，必须理解空气动力学；只有这样，羽毛的结构和翅膀的形状才说得通。同理，只研究视觉系统神经元的解剖和生理，无法理解它们为何那样工作。

> "Trying to understand perception by studying only neurons is like trying to understand bird flight by studying only feathers; it just cannot be done. To understand bird flight, you need to understand aerodynamics, only then can one make sense of the structure of feathers and the shape of wings. Similarly, you can't reach an understanding of why neurons in the visual system behave the way they do, just by studying their anatomy and physiology."

知觉背后的计算，其本质更多取决于所要解决的计算问题，而非实现这些解法的具体硬件。

> "The nature of the computations that underlie perception depends more upon the computational problems that have to be solved than upon the particular hardware in which their solutions are implemented."

---

## 案例研究：颜色视觉（Case study: Color Vision）

### Rosa 的 demo（影像中心候诊室）

demo 内容：全班到影像中心的候诊室，该房间用特殊的单色光照明（几乎只有单一波长的光），物体在其中失去颜色信息，看上去近乎灰阶。学生在其中观看水果、他人面孔等，亲身体验"没有颜色时缺少了什么"（experiencing what we miss when we do not have color info），以此反推颜色视觉的功能（即输出）。

在该照明下学生注意到的现象：草莓在绿叶背景中变得难以找到；香蕉等水果的成熟度难以判断；他人面孔显得病态（sickly）、没有血色。

### 讨论：我们用颜色来做什么？

标准答案（standard story）：找水果，并判断是否成熟（to find fruit, and tell if it is ripe）。

实证：拥有 3 种视锥感光细胞（cone photoreceptors）的猕猴（macaques，与人类一样）比只有 2 种的遗传变体更快找到水果（Melin, 2017）。

随后引出难题：如何确定一个物体的颜色（determining the color of an object）。

### 讲解：颜色视觉中的计算难题

**病态问题（ill-posed / underdetermined problem）**

颜色方程：L(λ) = R(λ) × I(λ)

- R（reflectance，反射率）：物体的颜色属性，是要求的目标。
- L（luminance）：到达眼睛的光，是唯一拥有的输入。
- I（illuminant，照明光）：照在物体上的光。
- L 不仅取决于物体，也取决于照明光 I。

已知 L，求 R：如同"A × B = 48，求 A 和 B"——信息不足以唯一确定答案，即病态/欠定问题。

推论：从 L 推断 R，需要关于 I 的其它信息或假设。
⭐ 大点（Big Point）：知觉与认知中许多推断都是病态的，因而需要关于世界的物理/统计规律的额外知识或假设。

**知觉/认知中普遍的病态性，另两个例子**

1. 形状知觉（shape perception）——视觉作为逆光学（inverse optics）：每一个视网膜图像（retinal image）都可能由许多不同的物体投出。逆光学是病态的，需其它约束才能求解。

2. 词义学习（word learning）："gavagai" 是什么意思？一个词可能有多种含义——兔子（rabbit）？毛皮（fur）？耳朵（ears）？运动（motion）？"未分离的兔子部件"（undetached rabbit-parts）？婴儿必须加入其它约束才能求解。

**Marr 三层次应用于颜色视觉（Marr's Levels of Analysis applied to Color Vision）**

I. 计算理论（Computational theory）

- 提取什么信息、为什么？→ R，用于刻画物体。
- 有哪些可用线索？→ 只有 L。
- 推断是否病态？→ 是，因为 I 未知。
- 世界中有哪些规律能约束这个推断？还有哪些信息来源能约束 I？
- 这一层无需任何关于心智、脑或机器的数据，仅靠思考，加上一点光学、物理、生态学（just thinking, with a little optics, physics, ecology）。

II. 算法与表征（Algorithm/representation）

- 系统如何做到？用了什么假设、计算、表征？能否写出代码？怎么找出答案？
- 手段：心理物理（psychophysics）——直接问人看到了什么。
- 行为或心理物理（含错觉 illusions）能揭示人类知觉系统为约束病态问题所用的假设。此处即：我们对 I 所作的假设，使我们能从 L 推断出 R。

III. 硬件实现（Hardware implementation）

- 系统如何在神经元与脑中物理实现（Lafer-Sousa et al., 2016，颜色脑区 color regions）。

⭐ 大点（Big Point）：理解心智与脑需要多个分析层次，也因此需要多种方法。

---

# II. 认知神经科学方法 & 它们回答的问题，应用于人脸知觉（Part 1 of 2）

## 为什么研究人脸（Face Perception: Who Cares?）

案例：Jacob Hodes 在 Swarthmore 大一时的经历（面孔失认症 prosopagnosia 的体验）。

人脸之所以重要：

- 人脸是信息量极大的刺激，传递身份（identity）、年龄（age）、性别（sex）、情绪（mood）、族群（race）、注视方向（direction of attention），可能还有性格的某些方面（如是否可信 trustworthy）。
- 人脸是日常生活中最频繁注视的刺激之一。
- 人脸知觉能力对祖先的生存很可能重要。

## 关于人脸识别的关键问题（Key Questions about Face Recognition）

1. 人脸知觉问题的本质是什么？（输入、输出、难点）——Marr 计算理论层。
2. 人脸识别在人脑中如何工作？什么计算、什么表征？人脸识别与物体识别的答案是否不同？
3. 人脸知觉是否是独立于其余视觉/认知的系统？
4. 人脸被检测和识别有多快？
5. 人脸识别如何在单个神经元/回路中实现？
6. 每个脑区在人脸识别中的因果作用（causal role）是什么？

本课（Part 1）推进 1–3；4–6 在后续课程。

## A. 计算理论（Computational theory）

问题：要解决的问题是什么？输入是什么？输出是什么？如何从输入到输出？（图像 → "Julia!" / "Brad!"）

简单设想：做一个模板（template）来匹配。——错。

原因：同一个人（或物体）随位置、距离/大小、视角、光照、表情、发型变化，投出无穷多张不同图像（infinitely many different images）；而我们仍能跨这些变化识别个体。

两种候选：

- 记住大量模板（memorize lots of templates）？
- 提取一个"不变"表征（extract an "invariant" representation，如眼距）？

机器侧：机器人脸识别直到近年才有效，因此几年前还没有可用的计算模型。VGG-Face 在人脸识别上非常准确，是人脑可能如何工作的一个候选模型。但：尚不清楚 VGG-Face 本身如何工作，也不清楚人脑是否以类似方式工作。

⭐ 问题 1 的答案（计算理论层揭示的首要挑战）：单张人脸的巨大图像变异（huge variation across images of a single face）。

## B. 行为（Behavior）

**判别两种候选的关键测试**

- 记住大量模板：对不认识的人脸不应奏效。
- 提取不变表征：对不认识的人脸也应奏效。
- 关键测试：在不认识某人的情况下，能否判断两张不同照片是否同一人？

**Jenkins et al., Cognition, 2011**

做法：从网上收集荷兰政客的照片，每人多张；让被试按"同一身份"分堆。

结果：照片实际只有 2 个人。Jenkins 被试分堆数均值为 7.5；无人答对（范围 3–16）。
对照：测试认识这两位政客的荷兰被试，几乎全部完成正确。

**我们从人脸中提取什么表征**

- 记住大量模板：仅对熟悉人脸奏效。
- 提取不变表征：对不熟悉人脸奏效。
- 这些"模板"是什么样：很可能不是脑中字面的像素阵列（not literal pixel arrays in the head）。

**倒脸效应（Face Inversion Effect, Yin, 1969）**

本系 1969 年做出的发现。相比正立刺激，上下颠倒的刺激识别错误增多；且人脸的倒置效应大于其它刺激（房子、火柴人）。提示人脸识别可能与物体识别工作方式不同。

⭐ 问题 2 的答案（来自简单行为数据）：人类从人脸提取的表征是非图像不变的（not image invariant）、朝向特异的（orientation specific）。

**行为方法的优缺点（Strengths and Weaknesses of Behavioral Methods）**

优点：

1. 善于刻画内部表征（至少定性）。
2. 善于分离不同的心理现象（如人脸 vs 物体加工）。
3. 便宜。

缺点：

1. 与脑无直接关联（除非补充其它信息）。
2. 数据稀疏：只有加工最后阶段的输出，但我们想刻画整条加工链的每一阶段。

## C. fMRI

**功能性磁共振成像（Functional Magnetic Resonance Imaging, fMRI）**

在全脑范围内无创测量神经活动时可用的最佳空间分辨率方法。信号基于血流（blood-flow based signal）。

BOLD（血氧水平依赖，blood oxygenation level dependent）信号链：
神经活动增加 → 局部血流增加，且超过耗氧补偿（more than compensates for O2 use）→ 去氧血红蛋白（deO2Hb）浓度下降 → MR 信号强度上升（deO2Hb 是顺磁性 paramagnetic）。

**时间特性：血流动力学响应函数（hemodynamic response function, HRF）**

视觉刺激出现 → 神经元放电 → BOLD 响应。BOLD 响应很慢，通常在刺激开始后约 5–6 秒达峰。

**关于 BOLD fMRI 信号的重要 caveats**

- 因基于血流，空间与时间分辨率受限：约 1 mm；> 几百毫秒。
- BOLD 信号的生理基础未知（动作电位？突触活动？抑制？）。
- 无法测量活动/代谢的绝对量，只能测两个条件之间的差异（only differences between two conditions）。

**脑中是否存在专门用于人脸识别的区域？**

1. 在被试观看人脸和物体时扫描。
2. 替代假说（alternative hypothesis）：这一反应是否有更简单的解释？它是否对——任何人类相关之物？任何身体部位？任何被注意之物？任何带曲线之物——也有反应？（用 1-back 任务控制注意；1-back 任务 = 当前刺激与上一个相同时按键，用来调控被试投入的注意量）

**梭状回面孔区（Fusiform Face Area, FFA）**

明显偏好人脸；对非人脸也有反应，但弱得多；几乎每个正常人都有。

部分刺激的响应值（节选）：Front-View 1.9–2.3、Mooney 2.0、Profile-View 1.8、Human Head 1.7、No Eyes 1.7、Cartoon 1.7、Inv. Grey 1.6、Cat Face 1.6、Eyes Only 1.3、Inv. Mooney 1.3、Animal Head 1.3、Human Body 1.0、Back of Head 1.0、Whole Animal 0.9、Animal Body 0.8、Hand 0.7、Buildings 0.6。

（Mooney = 黑白两色调的退化人脸图，需自上而下补全才能看出是脸；Inv. = 倒置 inverted；No Eyes / Eyes Only / External Ftrs 指只保留或去除部分面部特征的图。响应值越高表示该刺激引起的 BOLD 反应越强：正面真人脸最高，手、建筑最低。）

## 问题 3 的当前结论

人脸知觉是否是独立系统：从行为和 fMRI 两方面看，像是；但尚未定论。思考为什么。

---

## 今日要点（Important Points from Today）

1. Marr 计算理论：要理解一个知觉或认知过程，需思考所解决计算的本质——什么输入？什么输出？是什么让每一步推断在计算上困难？例子：颜色知觉、人脸识别。
2. 即使是低技术的行为实验，也能提供关于某一心理过程所含计算的洞见：如不熟悉人脸缺乏"不变性"、人脸的倒置效应不成比例地大。
3. fMRI 提示：人脸识别与物体识别动用了不同的神经组织。

---

## 中英术语对照

| 中文 | English |
|---|---|
| 计算理论 / 算法与表征 / 硬件实现 | computational theory / algorithm & representation / hardware implementation |
| 表征 | representation |
| 病态 / 欠定问题 | ill-posed / underdetermined problem |
| 反射率 / 亮度 / 照明光 | reflectance (R) / luminance (L) / illuminant (I) |
| 逆光学 | inverse optics |
| 心理物理 | psychophysics |
| 错觉 | illusion |
| 面孔失认症 | prosopagnosia |
| 注视方向 | direction of attention |
| 模板 / 不变表征 | template / invariant representation |
| 倒脸效应 | face inversion effect |
| 功能性磁共振成像 | fMRI |
| 血氧水平依赖信号 | BOLD signal |
| 去氧血红蛋白 | deoxyhemoglobin (deO2Hb) |
| 顺磁性 | paramagnetic |
| 血流动力学响应函数 | hemodynamic response function (HRF) |
| 体素 | voxel |
| 梭状回面孔区 | fusiform face area (FFA) |
| 一回退任务 | 1-back task |

---

参考文献：Marr (1982)；Melin (2017)；Jenkins et al., _Cognition_ (2011)；Yin (1969)；Lafer-Sousa et al. (2016)。

关联：[[Week2_Reading1_Marr1982_中英对照]]、[[Week_1_Reading_Kanwisher2010_功能特异性]]。
下接 Lecture 5：Methods II。
