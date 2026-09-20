/* Угасание Трокслера. Секундомер идёт, пока вы держите взгляд, и останавливается, когда
   вы говорите, что пятно пропало. Ползунок резкости — контроль: у пятна с резкой границей
   угасание не наступает почти никогда, и это ровно то, что предсказывает объяснение. */
import { surface, slider, say } from '../canvas';

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const goBtn = root.querySelector<HTMLButtonElement>('[data-btn="go"]')!;
  const clock = root.querySelector<HTMLElement>('[data-clock]')!;

  let soft = 70;
  let t0 = 0;
  let timer = 0;

  const s = surface(
    canvas,
    ({ ctx, w, h }) => {
      ctx.fillStyle = '#8f8f93';
      ctx.fillRect(0, 0, w, h);

      const bx = w * 0.72;
      const by = h * 0.36;
      const R = Math.min(w, h) * 0.16;

      /* Мягкость края — это доля радиуса, на которой альфа падает с единицы до нуля.
         При soft = 0 граница резкая, и адаптации не за что зацепиться. */
      const inner = R * (1 - soft / 100);
      const g = ctx.createRadialGradient(bx, by, Math.max(inner, 0.001), bx, by, R);
      g.addColorStop(0, 'rgba(120, 175, 130, 0.95)');
      g.addColorStop(1, 'rgba(120, 175, 130, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, R, 0, Math.PI * 2);
      ctx.fill();

      /* Крест фиксации. Мельче пятна — на него нужно смотреть, а не на него глядеть. */
      ctx.strokeStyle = '#1b1b1b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.3 - 8, h * 0.62);
      ctx.lineTo(w * 0.3 + 8, h * 0.62);
      ctx.moveTo(w * 0.3, h * 0.62 - 8);
      ctx.lineTo(w * 0.3, h * 0.62 + 8);
      ctx.stroke();
    },
    { ratio: 0.55 },
  );

  slider(root, 'soft', (v) => {
    soft = v;
    s.draw();
  });

  const stop = (msg: string) => {
    clearInterval(timer);
    timer = 0;
    goBtn.textContent = 'начать заново';
    say(root, msg);
  };

  const finish = () => {
    if (!timer) return;
    const sec = (performance.now() - t0) / 1000;
    stop(
      soft < 25
        ? `${sec.toFixed(1)} с — и это при резкой границе. Если пятно правда пропало, попробуйте ещё раз: чаще при таком крае оно держится, пока хватает терпения.`
        : `${sec.toFixed(1)} с до исчезновения. Теперь уведите резкость в ноль и попробуйте снова.`,
    );
  };

  goBtn.addEventListener('click', () => {
    if (timer) {
      finish();
      return;
    }
    t0 = performance.now();
    goBtn.textContent = 'пропало';
    say(root, 'смотрите строго на крест и не моргайте. Как только пятно исчезнет — жмите.');
    timer = window.setInterval(() => {
      clock.textContent = `${((performance.now() - t0) / 1000).toFixed(1)} с`;
    }, 100);
  });

  /* Пробел — чтобы не искать кнопку глазами: любое движение взгляда обнуляет попытку. */
  root.addEventListener('keydown', (ev) => {
    /* Пробел на кнопке — это нажатие кнопки; второй раз его считать не надо. */
    if (ev.target instanceof HTMLButtonElement) return;
    if (ev.key === ' ' && timer) {
      ev.preventDefault();
      finish();
    }
  });
}
