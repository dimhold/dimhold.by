import * as THREE from 'three';

export interface HeroOptions {
  accent: string;
  deep: string;
  phase: 'morning' | 'day' | 'evening' | 'night';
  artifact: number;
  reduced: boolean;
}

interface Spring {
  x: number;
  v: number;
  target: number;
  k: number;
  d: number;
}

function spring(x: number, k = 120, d = 12): Spring {
  return { x, v: 0, target: x, k, d };
}

function tickSpring(s: Spring, dt: number) {
  const a = -s.k * (s.x - s.target) - s.d * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
}

const SKIN = 0xf2c9a8;
const HAIR = 0x3a2e28;
const DARK = 0x352e40;

/** Where to freeze the bundled Avaturn/Mixamo clip (seconds) — its calmest frame. */
const FREEZE_AT = 0;

function std(color: number | string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.65, ...opts });
}

/** The stand-in character: a friendly bean. Swapped out for the real
    Ready Player Me model when /avatar.glb exists. */
function buildBean(accent: string) {
  const g = new THREE.Group();

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.52, 0.62, 8, 24), std(accent, { roughness: 0.55 }));
  body.position.y = 0.85;
  body.castShadow = true;
  g.add(body);

  // hair: a bowl sitting on the crown
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.4),
    std(HAIR, { roughness: 0.85 }),
  );
  hair.position.set(0, 1.13, 0);
  hair.rotation.x = -0.1;
  hair.scale.set(1.02, 1, 1.02);
  g.add(hair);

  const eyeWhiteMat = std(0xffffff, { roughness: 0.25 });
  const pupilMat = std(0x241d18, { roughness: 0.2 });
  const eyes: { white: THREE.Mesh; pupil: THREE.Mesh }[] = [];
  for (const side of [-1, 1]) {
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), eyeWhiteMat);
    white.position.set(side * 0.15, 1.15, 0.5);
    white.scale.set(1, 1.15, 0.55);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), pupilMat);
    pupil.position.set(side * 0.15, 1.15, 0.555);
    g.add(white, pupil);
    eyes.push({ white, pupil });
  }

  // smile: an arc hugging the front surface
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 24, Math.PI * 0.75), pupilMat);
  smile.position.set(0, 1.0, 0.505);
  smile.rotation.set(-0.12, 0, Math.PI * 1.125);
  g.add(smile);

  // cheeks
  const cheekMat = std(0xffffff, { roughness: 0.6, transparent: true, opacity: 0.35 });
  for (const side of [-1, 1]) {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), cheekMat);
    cheek.position.set(side * 0.27, 1.03, 0.44);
    cheek.scale.set(1, 0.7, 0.5);
    g.add(cheek);
  }

  // feet
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), std(DARK, { roughness: 0.8 }));
    foot.position.set(side * 0.2, 0.09, 0.12);
    foot.scale.set(1, 0.55, 1.35);
    foot.castShadow = true;
    g.add(foot);
  }

  return { group: g, eyes };
}

/** Ten little artifacts, one per day. All procedural, no assets. */
function buildArtifact(index: number, accent: string, deep: string): THREE.Group {
  const g = new THREE.Group();
  const a = std(accent);
  const d = std(deep);
  const neutral = std(0xf5efe6, { roughness: 0.5 });
  const dark = std(DARK, { roughness: 0.7 });

  switch (index % 10) {
    case 0: {
      // mug of coffee
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.26, 24), a);
      cup.position.y = 0.13;
      const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 24), std(0x4a3221, { roughness: 0.3 }));
      coffee.position.y = 0.26;
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 10, 20), a);
      handle.position.set(0.18, 0.14, 0);
      g.add(cup, coffee, handle);
      break;
    }
    case 1: {
      // stack of books
      const sizes: [number, number, THREE.MeshStandardMaterial][] = [
        [0.34, 0.05, a],
        [0.3, 0.05, neutral],
        [0.26, 0.05, d],
      ];
      let y = 0.025;
      sizes.forEach(([w, h, m], i) => {
        const book = new THREE.Mesh(new THREE.BoxGeometry(w, h, w * 0.72), m);
        book.position.y = y;
        book.rotation.y = (i - 1) * 0.35;
        g.add(book);
        y += h + 0.004;
      });
      break;
    }
    case 2: {
      // houseplant
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.16, 16), a);
      pot.position.y = 0.08;
      const bush1 = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.24, 8), std(0x5d8b4c, { flatShading: true }));
      bush1.position.y = 0.3;
      const bush2 = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 8), std(0x6fa25b, { flatShading: true }));
      bush2.position.y = 0.44;
      g.add(pot, bush1, bush2);
      break;
    }
    case 3: {
      // chess pawn
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.08, 20), d);
      base.position.y = 0.04;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.2, 16), d);
      stem.position.y = 0.18;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), d);
      head.position.y = 0.33;
      g.add(base, stem, head);
      break;
    }
    case 4: {
      // donut
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.07, 14, 28), std(0xe8b46a, { roughness: 0.6 }));
      ring.rotation.x = -Math.PI / 2.4;
      ring.position.y = 0.14;
      const icing = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.045, 14, 28), a);
      icing.rotation.x = -Math.PI / 2.4;
      icing.position.y = 0.175;
      g.add(ring, icing);
      break;
    }
    case 5: {
      // dumbbell
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.36, 12), dark);
      bar.rotation.z = Math.PI / 2;
      bar.position.y = 0.12;
      for (const side of [-1, 1]) {
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.07, 18), a);
        plate.rotation.z = Math.PI / 2;
        plate.position.set(side * 0.16, 0.12, 0);
        g.add(plate);
      }
      g.add(bar);
      break;
    }
    case 6: {
      // vinyl record
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.015, 32), std(0x1c1a1f, { roughness: 0.35 }));
      disc.position.y = 0.1;
      disc.rotation.x = 0.12;
      const label = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.017, 24), a);
      label.position.y = 0.1;
      label.rotation.x = 0.12;
      g.add(disc, label);
      break;
    }
    case 7: {
      // laptop
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.24), dark);
      base.position.y = 0.06;
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.015), dark);
      screen.position.set(0, 0.17, -0.11);
      screen.rotation.x = -0.28;
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.18), std(accent, { emissive: new THREE.Color(accent), emissiveIntensity: 0.55, roughness: 0.3 }));
      glow.position.set(0, 0.17, -0.1);
      glow.rotation.x = -0.28;
      g.add(base, screen, glow);
      break;
    }
    case 8: {
      // gem
      const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 0), std(accent, { flatShading: true, roughness: 0.25, metalness: 0.15 }));
      gem.position.y = 0.2;
      g.add(gem);
      break;
    }
    default: {
      // balloon
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 16), std(accent, { roughness: 0.3 }));
      ball.scale.y = 1.15;
      ball.position.y = 0.52;
      const string = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.34, 6), dark);
      string.position.y = 0.24;
      g.add(ball, string);
      break;
    }
  }

  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  return g;
}

const PHASE_LIGHTS = {
  morning: { hemiSky: 0xe4efff, hemiGround: 0xc9d2e0, hemiInt: 1.0, key: 0xffffff, keyInt: 1.3, keyPos: [2.5, 3, 2] },
  day: { hemiSky: 0xdfefff, hemiGround: 0xc9d2e0, hemiInt: 1.05, key: 0xffffff, keyInt: 1.35, keyPos: [2, 3.5, 2] },
  evening: { hemiSky: 0xd7e2f5, hemiGround: 0xb6c1d4, hemiInt: 0.9, key: 0xeef4ff, keyInt: 1.2, keyPos: [2.5, 1.8, 1.5] },
  night: { hemiSky: 0x2a3a5e, hemiGround: 0x0e1626, hemiInt: 0.55, key: 0x8fa8ff, keyInt: 0.35, keyPos: [2, 3, 2] },
} as const;

export async function mountHero(container: HTMLElement, opts: HeroOptions): Promise<void> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
  camera.position.set(0, 1.25, 4.6);
  camera.lookAt(0, 0.8, 0);

  // lights — switchable, because the lamp in the masthead can flip the scene
  // between the current day phase and night at any moment
  const hemi = new THREE.HemisphereLight(0xffffff, 0xcfc4b4, 1);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.3);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -3;
  scene.add(key);
  const lamp = new THREE.PointLight(0xbdd2ff, 14, 7, 1.8);
  lamp.position.set(1.3, 2.1, 1.1);
  lamp.visible = false;
  scene.add(lamp);

  const stage = new THREE.Mesh(
    new THREE.CylinderGeometry(1.55, 1.62, 0.16, 48),
    std(0xe8eef5, { roughness: 0.9 }),
  );
  stage.position.y = -0.08;
  stage.receiveShadow = true;
  scene.add(stage);

  const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(1.5, 48), new THREE.ShadowMaterial({ opacity: 0.16 }));
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0.005;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  function applyRig(kind: keyof typeof PHASE_LIGHTS) {
    const rig = PHASE_LIGHTS[kind];
    hemi.color.set(rig.hemiSky);
    hemi.groundColor.set(rig.hemiGround);
    hemi.intensity = rig.hemiInt;
    key.color.set(rig.key);
    key.intensity = rig.keyInt;
    key.position.set(rig.keyPos[0], rig.keyPos[1], rig.keyPos[2]);
    const night = kind === 'night';
    lamp.visible = night;
    (stage.material as THREE.MeshStandardMaterial).color.set(night ? 0x20304b : 0xe8eef5);
    (shadowCatcher.material as THREE.ShadowMaterial).opacity = night ? 0.32 : 0.16;
  }

  const modeRig = () => {
    applyRig(document.documentElement.dataset.mode === 'night' ? 'night' : opts.phase === 'night' ? 'evening' : opts.phase);
    if (opts.reduced) renderer.render(scene, camera);
  };
  modeRig();
  new MutationObserver(modeRig).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });

  // character: real model if present, bean otherwise
  const avatar = new THREE.Group();
  avatar.position.x = -0.3;
  scene.add(avatar);

  let eyes: { white: THREE.Mesh; pupil: THREE.Mesh }[] = [];
  let headBone: THREE.Object3D | null = null;
  let headRest: THREE.Euler | null = null;
  let usingGlb = false;
  let mixer: THREE.AnimationMixer | null = null;
  let danceAction: THREE.AnimationAction | null = null;
  let danceUntil = 0;
  let frozenTime = FREEZE_AT;

  try {
    const head = await fetch('/avatar.glb', { method: 'HEAD' });
    const type = head.headers.get('content-type') ?? '';
    if (head.ok && !type.includes('text/html')) {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const gltf = await new GLTFLoader().loadAsync('/avatar.glb');
      const model = gltf.scene;
      model.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.castShadow = true;
          o.frustumCulled = false;
        }
      });
      const box = new THREE.Box3().setFromObject(model);
      const height = box.max.y - box.min.y;
      const scale = 1.6 / height;
      model.scale.setScalar(scale);
      model.position.y = -box.min.y * scale;
      avatar.add(model);
      model.traverse((o) => {
        if (!headBone && /head/i.test(o.name)) headBone = o;
      });
      const realClip = gltf.animations.length && gltf.animations[0]!.duration > 0.5;
      if (realClip && !opts.reduced) {
        // freeze the bundled clip on its first frame for a calm stance;
        // the full dance is saved for the every-4th-poke easter egg
        mixer = new THREE.AnimationMixer(model);
        const clip = gltf.animations[0]!;
        danceAction = mixer.clipAction(clip);
        danceAction.play();
        danceAction.paused = true;
        // freeze on the calmest frame of the bundled clip; ?pose= overrides for tuning
        const poseParam = parseFloat(new URLSearchParams(location.search).get('pose') ?? '');
        frozenTime = Number.isFinite(poseParam) ? Math.min(poseParam, clip.duration - 0.01) : FREEZE_AT;
        danceAction.time = frozenTime;
        mixer.update(0);
        (window as any).__scene = { clipDuration: clip.duration, frozenAt: danceAction.time };
      }
      if (!realClip || opts.reduced) {
        // no usable animation: relax the T-pose into a natural stance
        const rot = (name: string, x: number, y: number, z: number) => {
          const b = model.getObjectByName(name);
          if (b) b.rotation.set(b.rotation.x + x, b.rotation.y + y, b.rotation.z + z);
        };
        rot('LeftArm', 1.38, 0, 0);
        rot('RightArm', 1.38, 0, 0);
        rot('LeftForeArm', 0.18, 0, 0);
        rot('RightForeArm', 0.18, 0, 0);
      }
      if (headBone) headRest = (headBone as THREE.Object3D).rotation.clone();
      (window as any).__scene = Object.assign((window as any).__scene ?? {}, { model });
      usingGlb = true;
    }
  } catch {
    /* no model yet — the bean steps in */
  }

  if (!usingGlb) {
    const bean = buildBean(opts.accent);
    avatar.add(bean.group);
    eyes = bean.eyes;
  }

  // artifact of the day
  const artifact = buildArtifact(opts.artifact, opts.accent, opts.deep);
  artifact.position.set(1.02, 0, 0.25);
  scene.add(artifact);

  // interaction state
  const squash = spring(1, 160, 9);
  const hop = spring(0, 140, 10);
  const spinBoost = spring(0, 60, 8);
  let rotTarget = 0;
  let lookX = 0;
  let lookY = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartRot = 0;
  let pokes = 0;
  let blinkAt = performance.now() + 2600;
  let blinkUntil = 0;

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  function pointerNdc(e: PointerEvent) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  renderer.domElement.addEventListener('pointerdown', (e) => {
    pointerNdc(e);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(avatar, true).length > 0;
    if (hit) {
      pokes++;
      squash.x = 0.78;
      squash.v = -2.5;
      hop.v = 3.2;
      if (pokes % 4 === 0) {
        if (danceAction) {
          danceAction.paused = false;
          danceUntil = performance.now() + 4200;
        } else {
          spinBoost.v = 14;
        }
      }
      (window as any).posthog?.capture('avatar_poked', { pokes, using_glb: usingGlb });
    }
    dragging = true;
    dragStartX = e.clientX;
    dragStartRot = rotTarget;
  });

  addEventListener('pointerup', () => (dragging = false));

  addEventListener('pointermove', (e) => {
    if (dragging) {
      rotTarget = dragStartRot + (e.clientX - dragStartX) * 0.012;
      return;
    }
    const r = renderer.domElement.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.35;
    lookY = THREE.MathUtils.clamp((e.clientX - cx) / innerWidth, -0.5, 0.5);
    lookX = THREE.MathUtils.clamp((e.clientY - cy) / innerHeight, -0.5, 0.5);
  });

  // resize
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  // render loop, paused offscreen
  let visible = true;
  new IntersectionObserver((entries) => (visible = entries[0]?.isIntersecting ?? true)).observe(container);

  let last = performance.now();

  function frame(nowMs: number) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min((nowMs - last) / 1000, 0.05);
    last = nowMs;
    const t = nowMs / 1000;

    mixer?.update(dt);
    if (danceAction && !danceAction.paused && nowMs > danceUntil) {
      danceAction.paused = true;
      danceAction.time = frozenTime;
    }

    tickSpring(squash, dt);
    tickSpring(hop, dt);
    tickSpring(spinBoost, dt);
    spinBoost.target = 0;
    hop.target = 0;
    squash.target = 1;

    const sy = squash.x;
    const sxz = 1 / Math.sqrt(Math.max(sy, 0.05));
    avatar.scale.set(sxz, sy, sxz);
    avatar.position.y = Math.max(hop.x, 0) * 0.4 + (opts.reduced || usingGlb ? 0 : Math.sin(t * 1.7) * 0.02);
    avatar.rotation.y = rotTarget + spinBoost.x + (opts.reduced ? 0 : lookY * 0.7);
    avatar.rotation.x = opts.reduced ? 0 : lookX * 0.25;

    if (headBone && !opts.reduced) {
      if (mixer) {
        // the mixer re-poses the head every frame; nudge on top of it
        headBone.rotation.x += lookX * 0.45;
        headBone.rotation.y += lookY * 0.8;
      } else if (headRest) {
        headBone.rotation.set(headRest.x + lookX * 0.5, headRest.y + lookY * 0.9, headRest.z);
      } else {
        headBone.rotation.set(lookX * 0.5, lookY * 0.9, 0);
      }
    }

    if (eyes.length && !opts.reduced) {
      if (nowMs > blinkAt) {
        blinkUntil = nowMs + 130;
        blinkAt = nowMs + 2200 + Math.random() * 3800;
      }
      const closed = nowMs < blinkUntil;
      for (const { white, pupil } of eyes) {
        white.scale.y = closed ? 0.12 : 1.15;
        pupil.scale.y = closed ? 0.15 : 1;
        pupil.position.x = (pupil.userData.baseX ??= pupil.position.x) + lookY * 0.045;
        pupil.position.y = 1.15 - lookX * 0.03;
      }
    }

    artifact.rotation.y = opts.reduced ? 0.5 : t * 0.4;
    if (opts.artifact % 10 === 9 && !opts.reduced) artifact.position.y = Math.sin(t * 1.3) * 0.05;

    renderer.render(scene, camera);
  }

  if (opts.reduced) {
    resize();
    renderer.render(scene, camera);
    // one gentle static frame; still re-render on resize
    new ResizeObserver(() => renderer.render(scene, camera)).observe(container);
  } else {
    requestAnimationFrame(frame);
  }
}
