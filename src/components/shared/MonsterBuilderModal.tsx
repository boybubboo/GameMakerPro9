import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Dices, Feather, Plus, Save, Sparkles, X } from 'lucide-react';
import type { MakerStore } from '../../store/useMakerStore';
import type {
  MonsterBlueprint,
  MonsterHeadStyle,
  MonsterHornStyle,
  MonsterRole,
  MonsterTailStyle,
  MonsterWingStyle,
} from '../../types/maker';
import { disposeObject3D } from '../../three/islandScene';
import {
  animateQuadrupedMonster,
  buildQuadrupedMonsterMesh,
  createDefaultMonsterBlueprint,
  createRandomMonsterBlueprint,
  MONSTER_PRESETS,
  type QuadrupedAnimState,
  type QuadrupedMonsterRig,
} from '../../three/quadrupedMonsterBuilder';

export interface MonsterBuilderModalProps {
  store: MakerStore;
  initialBlueprint?: MonsterBlueprint | null;
  editingEntityId?: string | null;
  onClose: () => void;
}

const HEAD_OPTIONS: { id: MonsterHeadStyle; label: string }[] = [
  { id: 'wolf', label: 'Wolf / Fox' },
  { id: 'dragon', label: 'Dragon' },
  { id: 'demon', label: 'Horned Beast' },
  { id: 'dino', label: 'Dino' },
  { id: 'fluffy', label: 'Bear / Fluffy' },
  { id: 'spider', label: 'Spider' },
];

const HORN_OPTIONS: { id: MonsterHornStyle; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'twinHorns', label: 'Twin Horns' },
  { id: 'ramCurl', label: 'Ram Curl' },
  { id: 'stagAntlers', label: 'Stag Antlers' },
  { id: 'crownSpikes', label: 'Crown Spikes' },
  { id: 'rhinoHorn', label: 'Rhino Horn' },
];

const WING_OPTIONS: { id: MonsterWingStyle; label: string }[] = [
  { id: 'none', label: 'No Wings' },
  { id: 'dragonBat', label: 'Dragon / Bat' },
  { id: 'feathered', label: 'Feathered' },
  { id: 'fairyInsect', label: 'Fairy / Insect' },
];

const TAIL_OPTIONS: { id: MonsterTailStyle; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'bushy', label: 'Bushy Tail' },
  { id: 'dragonSpiked', label: 'Dragon Spiked' },
  { id: 'club', label: 'Club Mace' },
  { id: 'stinger', label: 'Scorpion Stinger' },
  { id: 'shortStub', label: 'Short Stub' },
];

const ROLE_OPTIONS: { id: MonsterRole; label: string; desc: string }[] = [
  { id: 'baddie', label: 'Monster Foe', desc: 'Patrols, chases & battles the hero' },
  { id: 'npc', label: 'Friendly Critter', desc: 'Wanders peacefully & talks' },
  { id: 'buddy', label: 'Buddy Companion', desc: 'Joins and follows the hero' },
];

export const MonsterBuilderModal: React.FC<MonsterBuilderModalProps> = ({
  store,
  initialBlueprint,
  editingEntityId,
  onClose,
}) => {
  const [bp, setBp] = useState<MonsterBlueprint>(() =>
    initialBlueprint ? { ...initialBlueprint } : createDefaultMonsterBlueprint('twin_dragon')
  );
  const [previewAction, setPreviewAction] = useState<'idle' | 'walk' | 'run' | 'fly' | 'strike'>(() =>
    initialBlueprint?.canFly ? 'fly' : 'walk'
  );
  const [contextLost, setContextLost] = useState(false);

  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const previewStateRef = useRef<{
    rig: QuadrupedMonsterRig | null;
    action: 'idle' | 'walk' | 'run' | 'fly' | 'strike';
  }>({ rig: null, action: previewAction });
  const stageHandlesRef = useRef<{
    holder: THREE.Group;
  } | null>(null);

  useEffect(() => {
    previewStateRef.current.action = previewAction;
  }, [previewAction]);

  // Keep flying preview synced if user turns flight off
  useEffect(() => {
    if (previewAction === 'fly' && (bp.wingStyle === 'none' || !bp.canFly)) {
      setPreviewAction('walk');
    }
  }, [bp.wingStyle, bp.canFly, previewAction]);

  // Setup Three.js interactive studio viewport
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#131722');
    scene.fog = new THREE.FogExp2('#131722', 0.032);

    const width = Math.max(240, host.clientWidth);
    const height = Math.max(240, host.clientHeight);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    camera.position.set(2.9, 1.9, 3.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.6;

    // Three-point studio lighting (warm key + cool fill + rim)
    const hemi = new THREE.HemisphereLight('#C7D2FE', '#262B3A', 0.75);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight('#FFF5E1', 1.85);
    keyLight.position.set(4.5, 6.5, 4.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 22;
    const d = 3.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#60A5FA', 0.9);
    rimLight.position.set(-4.2, 3.2, -4.5);
    scene.add(rimLight);

    // Subtle grounded turntable disc + grid ring
    const floorGeo = new THREE.CylinderGeometry(2.6, 2.75, 0.12, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#1E2433',
      roughness: 0.78,
      metalness: 0.12,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.06;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const ringGeo = new THREE.RingGeometry(1.9, 1.95, 48);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#7C5CFF',
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.005;
    scene.add(ring);

    const holder = new THREE.Group();
    scene.add(holder);
    stageHandlesRef.current = { holder };

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 0.85, 0);
    controls.minDistance = 1.6;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI * 0.49;

    const handleLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleRestored);

    const handleResize = () => {
      if (!host) return;
      const w = Math.max(240, host.clientWidth);
      const h = Math.max(240, host.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(host);

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let walkPhase = 0;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsed += dt;

      const rig = previewStateRef.current.rig;
      const act = previewStateRef.current.action;
      if (rig) {
        let qState: QuadrupedAnimState = act;
        let speedNorm = 0;
        let prog = 0;
        if (act === 'walk') {
          walkPhase += dt * 5.2;
          speedNorm = 0.55;
        } else if (act === 'run') {
          walkPhase += dt * 9.5;
          speedNorm = 0.94;
        } else if (act === 'fly') {
          walkPhase += dt * 4.0;
          speedNorm = 0.6;
        } else if (act === 'strike') {
          const cycle = (elapsed % 1.15) / 1.15;
          if (cycle < 0.45) {
            qState = 'windup';
            prog = cycle / 0.45;
          } else if (cycle < 0.78) {
            qState = 'strike';
            prog = (cycle - 0.45) / 0.33;
          } else {
            qState = 'idle';
          }
        }
        animateQuadrupedMonster(rig, dt, elapsed, walkPhase, speedNorm, qState, prog, 0);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleRestored);
      disposeObject3D(scene);
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
      stageHandlesRef.current = null;
      previewStateRef.current.rig = null;
    };
  }, []);

  // Rebuild 3D monster mesh whenever blueprint parameters change
  useEffect(() => {
    const handles = stageHandlesRef.current;
    if (!handles) return;
    disposeObject3D(handles.holder);
    handles.holder.clear();

    const built = buildQuadrupedMonsterMesh(bp);
    handles.holder.add(built);
    previewStateRef.current.rig = (built.userData.quadrupedRig as QuadrupedMonsterRig) ?? null;
  }, [bp]);

  const savedMonsters = useMemo(
    () => store.currentProject?.customMonsters ?? [],
    [store.currentProject?.customMonsters]
  );

  const patchBp = (patch: Partial<MonsterBlueprint>) => {
    setBp((prev) => ({ ...prev, ...patch }));
  };

  const handleSaveAndPlace = (placeInLevel: boolean) => {
    const cleanName = bp.name.trim() || 'Custom Beast';
    const finalBp: MonsterBlueprint = {
      ...bp,
      name: cleanName,
      id: bp.id || `mon_${Date.now().toString(36)}`,
    };
    store.saveCustomMonster(finalBp);
    if (editingEntityId) {
      store.updateEntity(editingEntityId, `update ${cleanName}`, (ent) => ({
        ...ent,
        name: cleanName,
        kind: finalBp.role === 'baddie' ? 'baddie' : 'npc',
        isBuddy: finalBp.role === 'buddy',
        isBoss: Boolean(finalBp.isBoss),
        brain: finalBp.canFly ? 'Flyer' : finalBp.role === 'baddie' ? 'Chaser' : 'Walker',
        speed: finalBp.speed ?? ent.speed,
        health: finalBp.health ?? ent.health,
        dialogue: finalBp.dialogue ?? ent.dialogue,
        monsterConfig: finalBp,
      }));
    } else if (placeInLevel) {
      store.spawnMonsterEntity(finalBp);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl h-[92vh] bg-slate-50 dark:bg-[#111520] text-slate-900 dark:text-[#F3F5FA] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/[0.1] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white dark:bg-[#171A23] border-b border-slate-200/80 dark:border-white/[0.08]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[#7C5CFF]/15 text-[#7C5CFF] flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold leading-tight truncate">
                Animal &amp; Monster Studio
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#949BB0] truncate">
                Design 4, 6, or 8-legged animals &amp; fantastical winged multi-headed monsters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const rand = createRandomMonsterBlueprint(bp.id);
                setBp(rand);
                if (rand.canFly) setPreviewAction('fly');
                else setPreviewAction('walk');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300 hover:bg-amber-500/25 text-xs font-extrabold transition-colors"
            >
              <Dices size={14} />
              <span>Randomize</span>
            </button>

            {!editingEntityId && (
              <button
                type="button"
                onClick={() => handleSaveAndPlace(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-[#23293A] hover:bg-slate-300 dark:hover:bg-[#2D354B] text-xs font-bold transition-colors"
              >
                <Save size={14} />
                <span>Save Only</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSaveAndPlace(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6A48F5] text-white text-xs font-extrabold shadow-sm transition-colors"
            >
              <Plus size={14} />
              <span>{editingEntityId ? 'Save Changes' : 'Save & Place in Level'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#1F2430] flex items-center justify-center text-slate-500 dark:text-[#949BB0] hover:text-slate-900 dark:hover:text-white"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* Main Workspace: 3D Viewport Left + Inspector Right */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
          {/* Left: Live 3D Stage + Presets Drawer */}
          <div className="flex-1 min-h-[300px] flex flex-col bg-[#131722] relative">
            <div ref={canvasHostRef} className="w-full flex-1 min-h-0 relative">
              {contextLost && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#131722] text-slate-300 text-sm font-semibold">
                  3D context paused — waiting to restore...
                </div>
              )}

              {/* Floating Live Gait & Flight Preview Switcher */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10">
                {(
                  [
                    { id: 'idle', label: 'Stand' },
                    { id: 'walk', label: 'Walk' },
                    { id: 'run', label: 'Run' },
                    ...(bp.wingStyle !== 'none' && bp.canFly
                      ? [{ id: 'fly' as const, label: 'Fly' }]
                      : []),
                    { id: 'strike', label: 'Attack' },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPreviewAction(mode.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                      previewAction === mode.id
                        ? 'bg-[#7C5CFF] text-white'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-black/45 backdrop-blur-sm border border-white/10 text-[11px] font-semibold text-slate-300 pointer-events-none">
                Drag to orbit · Scroll to zoom · {bp.legPairs * 2} legs · {bp.headCount}{' '}
                {bp.headCount === 1 ? 'head' : 'heads'}
                {bp.wingStyle !== 'none' && bp.canFly ? ' · Flying' : ''}
              </div>
            </div>

            {/* Bottom Preset Shelf */}
            <div className="shrink-0 bg-[#171C29] border-t border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2 overflow-x-auto maker-scroll pb-1">
                {MONSTER_PRESETS.map((preset) => {
                  const active = bp.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setBp({
                          ...preset.blueprint,
                          id: bp.id,
                          presetId: preset.id,
                        });
                        setPreviewAction(preset.blueprint.canFly ? 'fly' : 'walk');
                      }}
                      className={`shrink-0 px-3 py-1.5 rounded-xl border text-left transition-all ${
                        active
                          ? 'bg-[#7C5CFF]/25 border-[#7C5CFF] text-white'
                          : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{preset.label}</div>
                      <div className="text-[10px] text-slate-400">
                        {preset.blueprint.legPairs * 2}L · {preset.blueprint.headCount}H
                        {preset.blueprint.canFly ? ' · Wings' : ''}
                      </div>
                    </button>
                  );
                })}
                {savedMonsters.map((saved) => (
                  <button
                    key={saved.id}
                    type="button"
                    onClick={() => {
                      setBp({ ...saved });
                      setPreviewAction(saved.canFly ? 'fly' : 'walk');
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-xl border text-left transition-all ${
                      bp.id === saved.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-white'
                        : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{saved.name}</div>
                    <div className="text-[10px] text-emerald-300/80">Saved Custom</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Structured Builder Controls */}
          <aside className="w-full lg:w-[400px] shrink-0 bg-white dark:bg-[#171A23] border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-white/[0.08] overflow-y-auto maker-scroll p-4 space-y-4">
            {/* Name & Role */}
            <section className="space-y-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bp.name}
                  onChange={(e) => patchBp({ name: e.target.value })}
                  placeholder="Monster or animal name"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#1F2430] text-sm font-extrabold border border-slate-200/70 dark:border-white/[0.08] focus:outline-none focus:border-[#7C5CFF]"
                />
                <label className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-[#1F2430] text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(bp.isBoss)}
                    onChange={(e) => patchBp({ isBoss: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Boss</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => patchBp({ role: r.id })}
                    title={r.desc}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                      bp.role === r.id
                        ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white'
                        : 'bg-slate-100 dark:bg-[#1F2430] border-transparent text-slate-600 dark:text-[#949BB0]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Legs & Heads Counts */}
            <section className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#1F2430] space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#8E96AB]">
                Legs &amp; Heads
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold">Number of Legs</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    { pairs: 2 as const, label: '4 Legs' },
                    { pairs: 3 as const, label: '6 Legs' },
                    { pairs: 4 as const, label: '8 Legs' },
                  ]).map((opt) => (
                    <button
                      key={opt.pairs}
                      type="button"
                      onClick={() => patchBp({ legPairs: opt.pairs })}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-colors ${
                        bp.legPairs === opt.pairs
                          ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white'
                          : 'bg-white dark:bg-[#171A23] border-slate-200/70 dark:border-white/[0.08]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold">Number of Heads</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {([1, 2, 3] as const).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => patchBp({ headCount: cnt })}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-colors ${
                        bp.headCount === cnt
                          ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white'
                          : 'bg-white dark:bg-[#171A23] border-slate-200/70 dark:border-white/[0.08]'
                      }`}
                    >
                      {cnt} {cnt === 1 ? 'Head' : 'Heads'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold">Head Style</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {HEAD_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => patchBp({ headStyle: opt.id })}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                        bp.headStyle === opt.id
                          ? 'bg-[#7C5CFF]/20 border-[#7C5CFF] text-[#7C5CFF] dark:text-white'
                          : 'bg-white dark:bg-[#171A23] border-slate-200/70 dark:border-white/[0.08] text-slate-600 dark:text-[#949BB0]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Horns, Wings, Flight, Spikes & Tail */}
            <section className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#1F2430] space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#8E96AB]">
                Horns, Wings &amp; Tail
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold">Horns &amp; Antlers</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {HORN_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => patchBp({ hornStyle: opt.id })}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                        bp.hornStyle === opt.id
                          ? 'bg-[#7C5CFF]/20 border-[#7C5CFF] text-[#7C5CFF] dark:text-white'
                          : 'bg-white dark:bg-[#171A23] border-slate-200/70 dark:border-white/[0.08] text-slate-600 dark:text-[#949BB0]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold">Wings</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {WING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        const hasWings = opt.id !== 'none';
                        patchBp({
                          wingStyle: opt.id,
                          canFly: hasWings ? true : false,
                        });
                        if (hasWings) setPreviewAction('fly');
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                        bp.wingStyle === opt.id
                          ? 'bg-[#7C5CFF]/20 border-[#7C5CFF] text-[#7C5CFF] dark:text-white'
                          : 'bg-white dark:bg-[#171A23] border-slate-200/70 dark:border-white/[0.08] text-slate-600 dark:text-[#949BB0]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {bp.wingStyle !== 'none' && (
                  <label className="flex items-center justify-between pt-1 text-xs font-bold cursor-pointer">
                    <span className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-300">
                      <Feather size={13} />
                      <span>Can Fly in Level</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={bp.canFly}
                      onChange={(e) => {
                        patchBp({ canFly: e.target.checked });
                        setPreviewAction(e.target.checked ? 'fly' : 'walk');
                      }}
                      className="accent-sky-500 w-4 h-4"
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold">Tail</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {TAIL_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => patchBp({ tailStyle: opt.id })}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                        bp.tailStyle === opt.id
                          ? 'bg-[#7C5CFF]/20 border-[#7C5CFF] text-[#7C5CFF] dark:text-white'
                          : 'bg-white dark:bg-[#171A23] border-slate-200/70 dark:border-white/[0.08] text-slate-600 dark:text-[#949BB0]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between pt-1 text-xs font-bold cursor-pointer">
                <span>Back Spine Spikes</span>
                <input
                  type="checkbox"
                  checked={bp.spineSpikes}
                  onChange={(e) => patchBp({ spineSpikes: e.target.checked })}
                  className="accent-[#7C5CFF] w-4 h-4"
                />
              </label>
            </section>

            {/* Body Shape & Proportions */}
            <section className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#1F2430] space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#8E96AB]">
                Size &amp; Proportions
              </div>

              {[
                { key: 'bodyLength' as const, label: 'Body Length', min: 0.75, max: 1.65 },
                { key: 'bodyWidth' as const, label: 'Chest Width', min: 0.75, max: 1.55 },
                { key: 'legHeight' as const, label: 'Leg Height', min: 0.65, max: 1.55 },
                { key: 'scale' as const, label: 'Overall Size', min: 0.65, max: 2.2 },
              ].map((slider) => (
                <div key={slider.key} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span>{slider.label}</span>
                    <span className="tabular-nums">{bp[slider.key].toFixed(2)}×</span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={0.05}
                    value={bp[slider.key]}
                    onChange={(e) => patchBp({ [slider.key]: Number(e.target.value) })}
                    className="w-full accent-[#7C5CFF]"
                  />
                </div>
              ))}
            </section>

            {/* Colors */}
            <section className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#1F2430] space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#8E96AB]">
                Colors
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { key: 'bodyColor' as const, label: 'Body' },
                  { key: 'bellyColor' as const, label: 'Belly' },
                  { key: 'accentColor' as const, label: 'Horns' },
                  { key: 'wingColor' as const, label: 'Wings' },
                  { key: 'eyeColor' as const, label: 'Eyes' },
                ].map((c) => (
                  <label key={c.key} className="flex flex-col items-center gap-1 text-[10px] font-bold cursor-pointer">
                    <input
                      type="color"
                      value={bp[c.key]}
                      onChange={(e) => patchBp({ [c.key]: e.target.value })}
                      className="w-9 h-9 rounded-xl border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-slate-600 dark:text-[#949BB0]">{c.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};
