import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const DEFAULTS = {
  springK: 0.0007,
  driftRangeFactor: 3.2, // 超过此范围（×orbRadius）后，弹簧力二次方增长
  repelK: 0.25, // 球间排斥系数
  edgeK: 0.15, // 边缘排斥系数（更柔和）
  repelMinFactor: 2.4, // 球间排斥作用半径 = orbRadius * 此值
  edgePadExtra: 8, // 边缘排斥阈值 = orbRadius + extra
  damping: 0.85,
  contactDamping: 0.82, // 有接触时对速度的额外阻尼
  noise: 0.015,
  vMax: 0.9,
  // 切线反转（仅作用于球-球接触，随接触强度渐进）
  tangentReverseStart: 0.08,
  tangentReverseFull: 0.55,
  driftFreqMin: 0.00015,
  driftFreqMax: 0.0005,
  driftAmpMinFactor: 1.1, // 漂移幅度：×orbRadius（大范围游走）
  driftAmpMaxFactor: 2.0
};

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

// 入场落位后，漂移目标在入场方向上的初始偏置（px）
// 使弹簧力在 t=0 指向入场方向，与入场动画无缝衔接
const ENTRANCE_DRIFT_BIAS = 50;

/**
 * @param {number} radius
 * @param {object} cfg
 * @param {{x:number,y:number}|null} entranceDir  入场单位方向向量，初次加载时传入
 */
function makeDrift(radius, cfg, entranceDir) {
  const ax1 = radius * randRange(cfg.driftAmpMinFactor, cfg.driftAmpMaxFactor);
  const ax2 = radius * randRange(cfg.driftAmpMinFactor, cfg.driftAmpMaxFactor) * 0.6;
  const ay1 = radius * randRange(cfg.driftAmpMinFactor, cfg.driftAmpMaxFactor);
  const ay2 = radius * randRange(cfg.driftAmpMinFactor, cfg.driftAmpMaxFactor) * 0.6;

  // 主正弦初始相位：有入场方向时，令 ax1·sin(px1) = BIAS·dir.x
  // 使物理 t=0 时漂移目标恰好在 home 前方 BIAS px 处（入场方向）
  const clamp1 = (v) => Math.max(-1, Math.min(1, v));
  const px1 = entranceDir
    ? Math.asin(clamp1((entranceDir.x * ENTRANCE_DRIFT_BIAS) / ax1))
    : Math.random() * Math.PI * 2;
  const py1 = entranceDir
    ? Math.asin(clamp1((entranceDir.y * ENTRANCE_DRIFT_BIAS) / ay1))
    : Math.random() * Math.PI * 2;

  return {
    wx1: randRange(cfg.driftFreqMin, cfg.driftFreqMax),
    wx2: randRange(cfg.driftFreqMin, cfg.driftFreqMax),
    wy1: randRange(cfg.driftFreqMin, cfg.driftFreqMax),
    wy2: randRange(cfg.driftFreqMin, cfg.driftFreqMax),
    px1,
    px2: Math.random() * Math.PI * 2,
    py1,
    py2: Math.random() * Math.PI * 2,
    ax1, ax2, ay1, ay2
  };
}

/**
 * 非线性弹簧 + 正弦漂移 + 非线性排斥 + 切线分量反转的水晶球物理。
 * 入场动画由调用方（HomePage）控制，本 hook 只负责稳态漂移物理。
 *
 * @param {{
 *   homes: {x:number,y:number}[],
 *   size: {w:number,h:number},
 *   orbRadius?: number,
 *   enabled?: boolean,
 *   tuning?: Partial<typeof DEFAULTS>
 * }} opts
 */
export function useOrbPhysics({ homes, size, orbRadius = 56, enabled = true, tuning, initialVelocities, initialPositions }) {
  const cfg = { ...DEFAULTS, ...tuning };
  // null 表示尺寸还未就绪，防止 canvas 在零坐标处闪现
  const [positions, setPositions] = useState(null);
  const stateRef = useRef(null);
  const rafRef = useRef(0);
  const startRef = useRef(performance.now());

  // 同步 home / size / radius 变更（保持漂移常量稳定）
  useEffect(() => {
    const current = stateRef.current;
    const sizeBecameValid =
      current && size.w > 0 && size.h > 0 && (current.size.w === 0 || current.size.h === 0);
    const needsReset =
      !current || current.positions.length !== homes.length || sizeBecameValid;

    if (needsReset) {
      // 初次加载（size 由 0 变有效）时，计算每颗球的入场方向（原点→home）
      // 用于偏置漂移初始相位，使漂移自然延续入场动画的运动方向
      const entranceDirs =
        size.w > 0 && size.h > 0
          ? homes.map((h) => {
              const d = Math.hypot(h.x, h.y) || 1;
              return { x: h.x / d, y: h.y / d };
            })
          : null;

      stateRef.current = {
        positions: homes.map((h) => ({ x: h.x, y: h.y })),
        velocities: homes.map(() => ({ x: 0, y: 0 })),
        drifts: homes.map((_, i) => makeDrift(orbRadius, cfg, entranceDirs?.[i])),
        homes,
        size,
        orbRadius
      };
      // 只有 size 有效时才推到 React state，避免零坐标先渲染一帧
      if (size.w > 0 && size.h > 0) {
        setPositions(homes.map((h) => ({ x: h.x, y: h.y })));
      }
    } else {
      current.homes = homes;
      current.size = size;
      // radius 变化时按比例重塑 drift 幅度（频率保留）
      if (current.orbRadius !== orbRadius) {
        const scale = orbRadius / current.orbRadius;
        current.drifts.forEach((d) => {
          d.ax1 *= scale;
          d.ax2 *= scale;
          d.ay1 *= scale;
          d.ay2 *= scale;
        });
        current.orbRadius = orbRadius;
      }
    }
  }, [JSON.stringify(homes), size.w, size.h, orbRadius]);

  // 入场完成时：在首次绘制前注入初始位置和速度，消除跳帧
  // useLayoutEffect 在 DOM 提交后、浏览器绘制前同步运行，确保第一帧无位置跳变
  useLayoutEffect(() => {
    if (!enabled || !stateRef.current) return;
    if (initialPositions) {
      initialPositions.forEach((p, i) => {
        const s = stateRef.current.positions[i];
        if (s) { s.x = p.x; s.y = p.y; }
      });
      setPositions(initialPositions.map((p) => ({ ...p })));
    }
    if (initialVelocities) {
      initialVelocities.forEach((v, i) => {
        const s = stateRef.current.velocities[i];
        if (s) { s.x = v.x; s.y = v.y; }
      });
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    // 重置漂移时钟：t=0 时漂移目标恰好在入场方向偏置位置，使弹簧力延续入场动量
    startRef.current = performance.now();
    let last = performance.now();

    const tick = (now) => {
      const dtRaw = now - last;
      last = now;
      const dt = Math.min(2, dtRaw / 16.67);
      const t = now - startRef.current;

      const s = stateRef.current;
      if (!s) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const { positions, velocities, drifts, homes, size, orbRadius } = s;
      const n = positions.length;
      const driftRange = orbRadius * cfg.driftRangeFactor;
      const repelMin = orbRadius * cfg.repelMinFactor;
      const edgePad = orbRadius + cfg.edgePadExtra;

      for (let i = 0; i < n; i++) {
        const p = positions[i];
        const v = velocities[i];
        const home = homes[i];
        const d = drifts[i];

        // ── 1) 漂移目标（并 clamp 进视口，避免把球导航进墙里） ──
        let targetX =
          home.x + d.ax1 * Math.sin(t * d.wx1 + d.px1) + d.ax2 * Math.sin(t * d.wx2 + d.px2);
        let targetY =
          home.y + d.ay1 * Math.sin(t * d.wy1 + d.py1) + d.ay2 * Math.sin(t * d.wy2 + d.py2);
        const margin = orbRadius + cfg.edgePadExtra + 4;
        if (targetX < margin) targetX = margin;
        else if (targetX > size.w - margin) targetX = size.w - margin;
        if (targetY < margin) targetY = margin;
        else if (targetY > size.h - margin) targetY = size.h - margin;

        // ── 2) 力累积 ──
        let fx = 0;
        let fy = 0;

        // 2a) 非线性弹簧：离漂移目标越远，拉回力越大（超线性）
        const dx0 = targetX - p.x;
        const dy0 = targetY - p.y;
        const dist = Math.sqrt(dx0 * dx0 + dy0 * dy0) || 0.0001;
        const springMag = cfg.springK * dist * (1 + (dist / driftRange) * (dist / driftRange));
        fx += (dx0 / dist) * springMag;
        fy += (dy0 / dist) * springMag;

        // 2b) 球-球排斥（非线性）—— 仅此类接触参与"切线反转"
        let bestPairStrength = 0;
        let bestPairNx = 0;
        let bestPairNy = 0;

        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          const dxp = p.x - positions[j].x;
          const dyp = p.y - positions[j].y;
          const dp = Math.sqrt(dxp * dxp + dyp * dyp) || 0.0001;
          if (dp < repelMin) {
            const r = (repelMin - dp) / repelMin; // 0..1
            const mag = cfg.repelK * r * r * (1 + 3 * r);
            const nx = dxp / dp;
            const ny = dyp / dp;
            fx += nx * mag;
            fy += ny * mag;
            if (r > bestPairStrength) {
              bestPairStrength = r;
              bestPairNx = nx;
              bestPairNy = ny;
            }
          }
        }

        // 2c) 球-墙排斥（更柔和的曲线；不参与切线反转，仅记录接触） ──
        let anyWallContact = false;
        const checkEdge = (distToEdge, nx, ny) => {
          if (distToEdge < edgePad) {
            const r = (edgePad - distToEdge) / edgePad;
            const mag = cfg.edgeK * r * r * (1 + 2 * r);
            fx += nx * mag;
            fy += ny * mag;
            anyWallContact = true;
          }
        };
        checkEdge(p.x, 1, 0); // 左墙 —— 向右推
        checkEdge(size.w - p.x, -1, 0); // 右墙
        checkEdge(p.y, 0, 1); // 上墙
        checkEdge(size.h - p.y, 0, -1); // 下墙

        // ── 3) 切线分量反转 —— 仅对球-球最强接触渐进应用 ──
        if (bestPairStrength >= cfg.tangentReverseStart) {
          // smoothstep(start, full, strength) → 0..1
          const denom = cfg.tangentReverseFull - cfg.tangentReverseStart;
          const raw = denom > 0 ? (bestPairStrength - cfg.tangentReverseStart) / denom : 1;
          const t01 = raw < 0 ? 0 : raw > 1 ? 1 : raw;
          const k = t01 * t01 * (3 - 2 * t01); // smoothstep
          const factor = 1 - 2 * k; // +1 (无反转) → -1 (完全反转)

          const fn = fx * bestPairNx + fy * bestPairNy;
          const fnx = fn * bestPairNx;
          const fny = fn * bestPairNy;
          const ftx = fx - fnx;
          const fty = fy - fny;
          fx = fnx + ftx * factor;
          fy = fny + fty * factor;
        }

        // ── 4) 噪声（保持生命感） ──
        fx += (Math.random() - 0.5) * cfg.noise;
        fy += (Math.random() - 0.5) * cfg.noise;

        // ── 5) 积分 + 阻尼 + 接触时额外阻尼 + 速度上限 ──
        v.x = (v.x + fx * dt) * cfg.damping;
        v.y = (v.y + fy * dt) * cfg.damping;

        if (anyWallContact || bestPairStrength >= cfg.tangentReverseStart) {
          v.x *= cfg.contactDamping;
          v.y *= cfg.contactDamping;
        }

        const vMag = Math.sqrt(v.x * v.x + v.y * v.y);
        if (vMag > cfg.vMax) {
          v.x = (v.x / vMag) * cfg.vMax;
          v.y = (v.y / vMag) * cfg.vMax;
        }
        p.x += v.x * dt;
        p.y += v.y * dt;
      }

      setPositions(positions.map((p) => ({ x: p.x, y: p.y })));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled]);

  return positions ?? [];
}
