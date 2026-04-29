// 5 个初学者友好的常见牌阵
export const spreads = [
  {
    id: 'daily-one',
    nameZh: '每日指引',
    nameEn: 'Daily Card',
    cardCount: 1,
    description:
      '每天抽一张牌，作为今天的一扇窗户。它不是宿命预告，而是一个温柔的提醒——"今天可以带着这份觉察去体验"。',
    suitableQuestions: ['我今天值得留意什么？', '今天的内在主题是什么？'],
    positions: [
      { index: 0, x: 50, y: 50, label: '今日指引', meaning: '今天可以带着这份觉察去生活。' }
    ],
    beginnerTip: '别去"求准"。让牌成为你一天中的一个锚点。'
  },
  {
    id: 'past-present-future',
    nameZh: '过去 / 现在 / 未来',
    nameEn: 'Past / Present / Future',
    cardCount: 3,
    description: '经典三张牌牌阵，帮你看到当前情境的时间脉络——是怎么走到这里的、现在身在何处、若不改变将去向何方。',
    suitableQuestions: [
      '这件事是怎么走到今天的？',
      '我现在的处境有什么可学的？',
      '如果不改变，可能走向哪里？'
    ],
    positions: [
      { index: 0, x: 20, y: 50, label: '过去', meaning: '源头、成因、曾经塑造你的力量。' },
      { index: 1, x: 50, y: 50, label: '现在', meaning: '你此刻身处什么状态。' },
      { index: 2, x: 80, y: 50, label: '未来', meaning: '若延续当前轨迹的可能走向。' }
    ],
    beginnerTip: '"未来"指的是一个可能，不是判决。你仍握着方向盘。'
  },
  {
    id: 'situation-action-result',
    nameZh: '情况 / 行动 / 结果',
    nameEn: 'Situation / Action / Outcome',
    cardCount: 3,
    description: '帮你把问题拆成三步：看清现状、找出行动、预演结果。适合面对一个具体决定时使用。',
    suitableQuestions: ['我现在的处境是什么？', '我可以做什么？', '这样做大致会导向什么？'],
    positions: [
      { index: 0, x: 20, y: 50, label: '情况', meaning: '当前局面的底色。' },
      { index: 1, x: 50, y: 50, label: '行动', meaning: '你能迈出的一步。' },
      { index: 2, x: 80, y: 50, label: '结果', meaning: '若你采取这行动，可能带来什么。' }
    ],
    beginnerTip: '专注"行动"那张牌——它才是此刻你真的能握住的东西。'
  },
  {
    id: 'relationship-5',
    nameZh: '关系牌阵（五张）',
    nameEn: 'Relationship Spread',
    cardCount: 5,
    description: '看一段关系双方的状态与走向。适用于恋爱、友情、合作等任何需要两个人一起面对的关系。',
    suitableQuestions: [
      '对方此刻对我们的关系感受如何？',
      '我在这段关系里带来了什么？',
      '我们之间的连结点是什么？'
    ],
    positions: [
      { index: 0, x: 25, y: 28, label: '你', meaning: '你的状态、在关系里的姿态。' },
      { index: 1, x: 75, y: 28, label: '对方', meaning: '对方此刻的状态与感受。' },
      { index: 2, x: 50, y: 55, label: '连接', meaning: '你们之间的能量或议题。' },
      { index: 3, x: 28, y: 82, label: '挑战', meaning: '目前需要共同面对的课题。' },
      { index: 4, x: 72, y: 82, label: '可能', meaning: '往前走的潜在方向。' }
    ],
    beginnerTip: '这张牌阵不是在审判对方——它让你看清"你在哪里"。'
  },
  {
    id: 'celtic-cross',
    nameZh: '凯尔特十字牌阵',
    nameEn: 'Celtic Cross',
    cardCount: 10,
    description: '塔罗中最经典的综合牌阵，适合对一个重要议题做一次完整的自我对话。刚入门可以只读前三张，不要被十张压倒。',
    suitableQuestions: ['这件事的全貌是什么？', '我当下的核心议题是什么？'],
    positions: [
      { index: 0, x: 38, y: 52, label: '1 核心', meaning: '议题的核心，当前情境。' },
      { index: 1, x: 38, y: 52, label: '2 挑战', meaning: '横在面前的力量，交叉在核心牌上。', rotated: true },
      { index: 2, x: 38, y: 82, label: '3 根基', meaning: '过去或潜意识的基础。' },
      { index: 3, x: 16, y: 52, label: '4 近过去', meaning: '刚刚离开的影响。' },
      { index: 4, x: 38, y: 22, label: '5 可能未来', meaning: '若延续当前趋势的走向。' },
      { index: 5, x: 60, y: 52, label: '6 近未来', meaning: '即将到来的影响。' },
      { index: 6, x: 84, y: 86, label: '7 自我', meaning: '你对此事的态度。' },
      { index: 7, x: 84, y: 64, label: '8 外部', meaning: '环境 / 他人对此事的影响。' },
      { index: 8, x: 84, y: 42, label: '9 希望与恐惧', meaning: '你内心的渴望与担忧。' },
      { index: 9, x: 84, y: 20, label: '10 最终', meaning: '整合以上后的走向。' }
    ],
    beginnerTip: '塔罗是对话，不是考试。一次读三张，胜过一次读十张。'
  }
];

export const spreadById = Object.fromEntries(spreads.map((s) => [s.id, s]));
