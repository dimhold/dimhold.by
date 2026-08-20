/** The Adlega philosophy, playable: every number here comes from a tiny
    deterministic engine. Nothing is generated, nothing is guessed. */

import { track } from './analytics';

export interface ToyOptions {
  locale: string;
  monthsLabel: string;
}

const MRR0 = 10_000;
const MONTHS = 36;
const GOAL_MULT = 3;
const GOAL_MONTH = 24;

function series(growthPct: number, churnPct: number): number[] {
  const g = growthPct / 100;
  const c = churnPct / 100;
  const out: number[] = [MRR0];
  for (let i = 1; i <= MONTHS; i++) {
    out.push(out[i - 1]! * (1 + g) * (1 - c));
  }
  return out;
}

/** Closed-form goal-seek: net factor needed so that m(GOAL_MONTH) = GOAL_MULT × m(0). */
function solveGrowth(churnPct: number): number {
  const c = churnPct / 100;
  const net = Math.pow(GOAL_MULT, 1 / GOAL_MONTH);
  return (net / (1 - c) - 1) * 100;
}

export function mountToy(root: HTMLElement, opts: ToyOptions) {
  const growth = root.querySelector<HTMLInputElement>('[data-growth]')!;
  const churn = root.querySelector<HTMLInputElement>('[data-churn]')!;
  const growthOut = root.querySelector<HTMLElement>('[data-growth-out]')!;
  const churnOut = root.querySelector<HTMLElement>('[data-churn-out]')!;
  const chart = root.querySelector<HTMLElement>('[data-chart]')!;
  const btn = root.querySelector<HTMLButtonElement>('[data-solve]')!;

  const fmt = new Intl.NumberFormat(opts.locale, { maximumFractionDigits: 0 });
  const fmtPct = new Intl.NumberFormat(opts.locale, { maximumFractionDigits: 1 });

  function draw() {
    const gv = parseFloat(growth.value);
    const cv = parseFloat(churn.value);
    growthOut.textContent = fmtPct.format(gv) + ' %';
    churnOut.textContent = fmtPct.format(cv) + ' %';

    const data = series(gv, cv);
    const goal = MRR0 * GOAL_MULT;
    const max = Math.max(...data, goal) * 1.08;

    const W = 320;
    const H = 110;
    const PAD = 6;
    const x = (i: number) => PAD + (i / MONTHS) * (W - PAD * 2);
    const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);

    let line = '';
    data.forEach((v, i) => {
      line += (i ? ' L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
    });
    const area = line + ` L${x(MONTHS).toFixed(1)} ${H - PAD} L${x(0).toFixed(1)} ${H - PAD} Z`;

    const hitGoal = data[GOAL_MONTH]! >= goal;
    const end = data[MONTHS]!;

    chart.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="MRR projection">
        <path d="${area}" fill="var(--accent-wash)" opacity="0.9"></path>
        <path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"></path>
        <line x1="${PAD}" y1="${y(goal).toFixed(1)}" x2="${W - PAD}" y2="${y(goal).toFixed(1)}"
              stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 5" opacity="0.7"></line>
        <line x1="${x(GOAL_MONTH).toFixed(1)}" y1="${PAD}" x2="${x(GOAL_MONTH).toFixed(1)}" y2="${H - PAD}"
              stroke="var(--muted)" stroke-width="1" stroke-dasharray="2 5" opacity="0.5"></line>
        <circle cx="${x(GOAL_MONTH).toFixed(1)}" cy="${y(Math.min(data[GOAL_MONTH]!, max)).toFixed(1)}" r="4"
                fill="${hitGoal ? 'var(--accent)' : 'var(--muted)'}"></circle>
        <text x="${W - PAD}" y="${Math.max(y(end) - 6, 12).toFixed(1)}" text-anchor="end"
              font-family="var(--font-mono)" font-size="10" fill="var(--ink)">$${fmt.format(end)}</text>
        <text x="${PAD}" y="${(y(goal) - 5).toFixed(1)}"
              font-family="var(--font-mono)" font-size="9" fill="var(--muted)">×${GOAL_MULT} · ${GOAL_MONTH} ${opts.monthsLabel}</text>
      </svg>`;
  }

  growth.addEventListener('input', draw);
  churn.addEventListener('input', draw);

  btn.addEventListener('click', () => {
    const target = Math.min(solveGrowth(parseFloat(churn.value)), parseFloat(growth.max));
    const from = parseFloat(growth.value);
    const t0 = performance.now();
    const D = 650;
    track('goalseek_used', { churn: churn.value, solution: target.toFixed(2) });
    function step(now: number) {
      const p = Math.min((now - t0) / D, 1);
      const e = 1 - Math.pow(1 - p, 3);
      growth.value = (from + (target - from) * e).toFixed(1);
      draw();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

  draw();
}
