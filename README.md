# 塔罗初学之旅 · Taro Beginner App

一款面向塔罗初学者的 Web App：使用经典 Rider-Waite-Smith 视觉风格，帮助你温柔地认识 78 张韦特塔罗牌。

## 特性

- 梦幻玻璃拟态 UI，神秘而轻盈
- 首页 5 个漂浮水晶球（带物理漂浮 / 相互排斥 / 边界约束）
- 78 张牌完整数据（名称、元素、关键词、图片路径）
- 5 张示范牌（愚者 · 四张王牌）含完整初学者讲解
- 随机抽牌 / 牌阵讲解 / 塔罗历史时间线 / 用户设置
- 响应式移动端优先 · 可本地运行 · 无需后端

## 启动

```bash
npm install
npm run dev
# 打开 http://localhost:5173
```

## 替换为真实牌图

所有牌的 `image` 字段都使用本地路径，例如 `/cards/rws/the-fool.jpg`。

把你收集 / 制作的韦特牌图放到：

```
public/cards/rws/the-fool.jpg
public/cards/rws/the-magician.jpg
public/cards/rws/ace-of-wands.jpg
...
```

文件缺失时，App 会自动降级为该牌元素色的渐变占位图，不会报错。

## 补全剩余 73 张牌的讲解

`src/data/cards.js` 中，除了 5 张示范牌外，其他牌的长字段（正位 / 逆位 / 符号讲解等）使用占位文本。
按相同字段结构填入自己的讲解即可，App 会立刻读取新内容。

## 目录结构

```
src/
  data/           # deckGroups / cards / spreads / historyTimeline
  hooks/          # useOrbPhysics 等
  components/     # 水晶球 / 底部导航 / 卡面等可复用组件
  pages/          # 7 个主页面
  App.jsx         # 路由 + 页面过渡
  main.jsx        # 入口
public/cards/rws/ # 牌图占位目录
```

## 内容表达原则

- 不宣称塔罗能绝对预测未来
- 不提供医疗 / 法律 / 投资建议
- 将牌作为自我觉察与对话的工具
