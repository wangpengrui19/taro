// 5 个牌组的元数据 —— 用于首页水晶球、牌组页顶部、元素标识
export const deckGroups = [
  {
    id: 'major',
    nameZh: '大阿卡纳',
    nameEn: 'Major Arcana',
    element: '人生原型 / 灵魂旅程',
    count: 22,
    // 首页彩色渐变水晶球
    gradient: 'linear-gradient(135deg, #ff70c6 0%, #8e6df6 40%, #4da3ff 75%, #ffd36b 100%)',
    coreColor: '#c78bff',
    glowColor: 'rgba(190, 140, 255, 0.6)',
    crystal: {
      tint: '#ffffff',
      attenuationColor: '#4a1d9e',
      attenuationDistance: 1.4,
      emissive: '#2a0552',
      pointLightColor: '#d9a8ff',
      pointLightIntensity: 1.4,
      rainbow: true
    },
    keywords: ['命运课题', '重大转折', '精神成长'],
    description:
      '22 张大阿卡纳记录着"愚者之旅"——从 0 号启程，走过意识、欲望、试炼与觉醒，最终在世界牌抵达完满。它们映照出你此刻正在经历的人生主题。'
  },
  {
    id: 'wands',
    nameZh: '权杖',
    nameEn: 'Wands',
    element: '火',
    count: 14,
    gradient: 'linear-gradient(135deg, #ffb35c 0%, #ff6a3d 45%, #c41e3a 100%)',
    coreColor: '#ff6a3d',
    glowColor: 'rgba(255, 120, 70, 0.6)',
    crystal: {
      tint: '#d83a28',
      attenuationColor: '#7a1108',
      attenuationDistance: 1.2,
      emissive: '#2a0603',
      pointLightColor: '#ff6452',
      pointLightIntensity: 1.4
    },
    keywords: ['行动', '热情', '创造', '意志'],
    description:
      '权杖属火，代表点燃生命的那道火花：灵感、勇气、主动出击的能量。它们谈论你想做什么、正在燃烧什么。'
  },
  {
    id: 'cups',
    nameZh: '圣杯',
    nameEn: 'Cups',
    element: '水',
    count: 14,
    gradient: 'linear-gradient(135deg, #a0d8ff 0%, #4da3ff 45%, #1e3a8a 100%)',
    coreColor: '#4da3ff',
    glowColor: 'rgba(90, 160, 255, 0.6)',
    crystal: {
      tint: '#2a63d4',
      attenuationColor: '#0a1e5a',
      attenuationDistance: 1.4,
      emissive: '#04102e',
      pointLightColor: '#5e9cff',
      pointLightIntensity: 1.4
    },
    keywords: ['情感', '关系', '直觉', '疗愈'],
    description:
      '圣杯属水，承接内在的情感与潜意识的潮汐。它们询问你的感受、你的爱、你与他人之间柔软的连接。'
  },
  {
    id: 'pentacles',
    nameZh: '星币',
    nameEn: 'Pentacles',
    element: '土',
    count: 14,
    gradient: 'linear-gradient(135deg, #fff1a8 0%, #ffc85c 45%, #b8730f 100%)',
    coreColor: '#ffc85c',
    glowColor: 'rgba(255, 200, 90, 0.6)',
    crystal: {
      tint: '#e5a41c',
      attenuationColor: '#70420a',
      attenuationDistance: 1.3,
      emissive: '#2e1a00',
      pointLightColor: '#ffc650',
      pointLightIntensity: 1.4
    },
    keywords: ['物质', '金钱', '身体', '现实'],
    description:
      '星币属土，根植于现实世界——身体、工作、金钱、日常习惯。它们帮助你看清稳定与成长需要的土壤。'
  },
  {
    id: 'swords',
    nameZh: '宝剑',
    nameEn: 'Swords',
    element: '风',
    count: 14,
    gradient: 'linear-gradient(135deg, #ffffff 0%, #dfe7ff 45%, #8ea0c9 100%)',
    coreColor: '#e4ecff',
    glowColor: 'rgba(220, 230, 255, 0.7)',
    crystal: {
      tint: '#c6d4e8',
      attenuationColor: '#4a5c7a',
      attenuationDistance: 1.6,
      emissive: '#0e1830',
      pointLightColor: '#d6e2f5',
      pointLightIntensity: 1.1
    },
    keywords: ['思想', '沟通', '判断', '冲突'],
    description:
      '宝剑属风，代表思维、语言和判断。它们锋利而真实——既能切开迷雾，也可能划伤自己。练习看清你的念头。'
  }
];

export const groupById = Object.fromEntries(deckGroups.map((g) => [g.id, g]));
