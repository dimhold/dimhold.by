/** Minsk Weather Engine.
    The site does not fake its weather: effects mirror the real conditions
    in Minsk right now (open-meteo, no key). If the network is unavailable,
    we fall back to a quiet seasonal ambient and show no caption — better
    silence than an invented temperature. */

export type WeatherKind = 'clear' | 'clouds' | 'fog' | 'rain' | 'snow' | 'thunder';

export interface WeatherLabels {
  line: string;
  conditions: Record<WeatherKind, string>;
}

export interface WeatherOptions {
  el: HTMLElement | null;
  labels: WeatherLabels | null;
  reduced: boolean;
}

interface Wx {
  code: number;
  temp: number;
  wind: number;
  windDir: number;
  isDay: boolean;
}

const API =
  'https://api.open-meteo.com/v1/forecast?latitude=53.9&longitude=27.567' +
  '&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day&timezone=Europe%2FMinsk';
const TTL = 30 * 60 * 1000;

async function fetchWeather(): Promise<Wx | null> {
  try {
    const cached = localStorage.getItem('wx');
    if (cached) {
      const { t, d } = JSON.parse(cached);
      if (Date.now() - t < TTL && d && typeof d.code === 'number') return d as Wx;
    }
  } catch {
    /* fresh fetch below */
  }
  try {
    const res = await fetch(API);
    if (!res.ok) return null;
    const j = await res.json();
    const c = j.current;
    const d: Wx = {
      code: c.weather_code,
      temp: Math.round(c.temperature_2m),
      wind: c.wind_speed_10m,
      windDir: c.wind_direction_10m,
      isDay: !!c.is_day,
    };
    try {
      localStorage.setItem('wx', JSON.stringify({ t: Date.now(), d }));
    } catch {
      /* private mode */
    }
    return d;
  } catch {
    return null;
  }
}

function kindOf(code: number): WeatherKind {
  if (code === 0) return 'clear';
  if (code <= 3) return 'clouds';
  if (code <= 48) return 'fog';
  if (code >= 95) return 'thunder';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  return 'rain';
}

const night = () => document.documentElement.dataset.mode === 'night';

interface Particle {
  x: number;
  y: number;
  v: number;
  s: number;
  phase: number;
  hue?: string;
}

export async function initWeather(opts: WeatherOptions) {
  const wx = await fetchWeather();
  const minskMonth = parseInt(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Minsk', month: 'numeric' }).format(new Date()),
    10,
  );
  const autumn = minskMonth >= 9 && minskMonth <= 11;
  const winter = minskMonth === 12 || minskMonth <= 2;

  let kind: WeatherKind | null = null;
  let wind = 8;
  let windDir = 270;

  if (wx) {
    kind = kindOf(wx.code);
    wind = wx.wind;
    windDir = wx.windDir;
    if (opts.el && opts.labels) {
      const t = (wx.temp > 0 ? '+' : '') + wx.temp;
      opts.el.textContent = `${opts.labels.line}: ${opts.labels.conditions[kind]}, ${t}°`;
    }
    (window as any).posthog?.register?.({ minsk_weather: kind, minsk_temp: wx.temp });
  } else {
    // offline fallback: quiet seasonal ambient, no caption
    kind = winter ? 'snow' : 'clouds';
  }

  if (opts.reduced) return;

  const showLeaves = autumn && (kind === 'clear' || kind === 'clouds') && wind >= 10;
  const showStars = kind === 'clear' && (wx ? !wx.isDay : false);
  const nothingToDraw = kind === 'clear' && !showStars && !showLeaves;
  if (nothingToDraw) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'weather-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  let W = 0;
  let H = 0;
  function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }
  resize();
  addEventListener('resize', resize);

  const mobile = innerWidth < 640;
  const dirRad = ((windDir + 180) * Math.PI) / 180;
  const driftBase = Math.sin(dirRad) * Math.min(wind, 40);

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  const drops: Particle[] = [];
  const flakes: Particle[] = [];
  const leaves: Particle[] = [];
  const stars: Particle[] = [];
  const clouds: Particle[] = [];

  if (kind === 'rain' || kind === 'thunder') {
    const n = (kind === 'thunder' ? 150 : wx && wx.code >= 61 ? 110 : 60) / (mobile ? 2 : 1);
    for (let i = 0; i < n; i++) drops.push({ x: rand(0, 1), y: rand(0, 1), v: rand(750, 1150), s: rand(7, 13), phase: 0 });
  }
  if (kind === 'snow') {
    const n = 70 / (mobile ? 2 : 1);
    for (let i = 0; i < n; i++)
      flakes.push({ x: rand(0, 1), y: rand(0, 1), v: rand(45, 95), s: rand(1.2, 2.8), phase: rand(0, Math.PI * 2) });
  }
  if (showLeaves) {
    const palette = ['#c9722e', '#d9a02b', '#a85a26', '#b8451f'];
    for (let i = 0; i < (mobile ? 6 : 11); i++)
      leaves.push({
        x: rand(0, 1),
        y: rand(0, 1),
        v: rand(35, 70),
        s: rand(4, 7),
        phase: rand(0, Math.PI * 2),
        hue: palette[i % palette.length],
      });
  }
  if (showStars) {
    for (let i = 0; i < 70; i++) stars.push({ x: rand(0, 1), y: rand(0, 0.45), v: rand(0.5, 2), s: rand(0.5, 1.4), phase: rand(0, Math.PI * 2) });
  }
  if (kind === 'clouds' || kind === 'fog') {
    for (let i = 0; i < 4; i++)
      clouds.push({ x: rand(0, 1), y: rand(0.02, kind === 'fog' ? 0.9 : 0.22), v: rand(6, 14), s: rand(90, 190), phase: rand(0, 1) });
  }

  let last = performance.now();

  function frame(now: number) {
    requestAnimationFrame(frame);
    if (document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    const dark = night();
    ctx.clearRect(0, 0, W, H);

    if (clouds.length) {
      ctx.save();
      for (const c of clouds) {
        c.x += ((c.v * dt) / W) * (driftBase >= 0 ? 1 : -1) * 0.8;
        if (c.x > 1.25) c.x = -0.25;
        if (c.x < -0.25) c.x = 1.25;
        const cx = c.x * W;
        const cy = c.y * H + Math.sin(t * 0.1 + c.phase * 7) * 6;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.s);
        const a = kind === 'fog' ? (dark ? 0.05 : 0.09) : dark ? 0.045 : 0.16;
        g.addColorStop(0, dark ? `rgba(200,205,235,${a})` : `rgba(255,255,255,${a * 4})`);
        g.addColorStop(0.6, dark ? `rgba(200,205,235,${a * 0.5})` : `rgba(255,255,255,${a * 2})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(cx - c.s, cy - c.s * 0.6, c.s * 2, c.s * 1.2);
      }
      ctx.restore();
    }

    if (stars.length) {
      for (const s of stars) {
        const a = 0.25 + 0.55 * Math.abs(Math.sin(t * s.v * 0.6 + s.phase));
        ctx.fillStyle = `rgba(255, 244, 214, ${a * (dark ? 1 : 0.4)})`;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.s, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (drops.length) {
      const slant = driftBase * 0.6;
      ctx.strokeStyle = dark ? 'rgba(185, 205, 255, 0.30)' : 'rgba(105, 125, 170, 0.32)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        d.y += (d.v * dt) / H;
        d.x += (slant * dt) / W;
        if (d.y > 1.05) {
          d.y = -0.05;
          d.x = Math.random();
        }
        if (d.x > 1.05) d.x -= 1.1;
        if (d.x < -0.05) d.x += 1.1;
        const x = d.x * W;
        const y = d.y * H;
        ctx.moveTo(x, y);
        ctx.lineTo(x + slant * 0.06, y + d.s);
      }
      ctx.stroke();
    }

    if (flakes.length) {
      ctx.fillStyle = dark ? 'rgba(255,255,255,0.75)' : 'rgba(150,160,195,0.55)';
      for (const f of flakes) {
        f.y += (f.v * dt) / H;
        f.x += ((Math.sin(t * 0.9 + f.phase) * 14 + driftBase * 0.45) * dt) / W;
        if (f.y > 1.03) {
          f.y = -0.03;
          f.x = Math.random();
        }
        if (f.x > 1.03) f.x -= 1.06;
        if (f.x < -0.03) f.x += 1.06;
        ctx.beginPath();
        ctx.arc(f.x * W, f.y * H, f.s, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (leaves.length) {
      for (const l of leaves) {
        l.y += (l.v * dt) / H;
        l.x += ((Math.sin(t * 0.7 + l.phase) * 22 + driftBase * 0.8) * dt) / W;
        if (l.y > 1.04) {
          l.y = -0.04;
          l.x = Math.random();
        }
        if (l.x > 1.04) l.x -= 1.08;
        if (l.x < -0.04) l.x += 1.08;
        const x = l.x * W;
        const y = l.y * H;
        const rot = t * 1.4 + l.phase * 3;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = night() ? 0.5 : 0.8;
        ctx.fillStyle = l.hue!;
        ctx.beginPath();
        ctx.ellipse(0, 0, l.s, l.s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  requestAnimationFrame(frame);
}
