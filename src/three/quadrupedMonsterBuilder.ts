import * as THREE from 'three';
import type {
  MonsterBlueprint,
  MonsterHeadStyle,
  MonsterHornStyle,
  MonsterTailStyle,
  MonsterWingStyle,
} from '../types/maker';

export interface QuadrupedLegRig {
  side: -1 | 1; // -1 = left (-X), +1 = right (+X)
  pairIndex: number; // 0 = frontmost ... legPairs - 1 = rearmost
  hipPivot: THREE.Group;
  kneePivot: THREE.Group;
  pawGroup: THREE.Group;
  baseHipX: number;
  baseKneeX: number;
  baseSpreadZ: number;
  baseYawY: number;
}

export interface QuadrupedHeadRig {
  neckPivot: THREE.Group;
  headPivot: THREE.Group;
  jawPivot?: THREE.Group;
  baseNeckYaw: number;
  baseNeckPitch: number;
  headIndex: number;
}

export interface QuadrupedWingRig {
  side: -1 | 1;
  innerPivot: THREE.Group;
  outerPivot: THREE.Group;
}

export interface QuadrupedMonsterRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  spineBackPivot: THREE.Group;
  legs: QuadrupedLegRig[];
  heads: QuadrupedHeadRig[];
  tailSegments: THREE.Group[];
  wingL?: QuadrupedWingRig;
  wingR?: QuadrupedWingRig;
  slashArc: THREE.Mesh;
  slashMat: THREE.MeshBasicMaterial;
  flashMaterials: THREE.MeshStandardMaterial[];
  groundClearance: number;
  topHeight: number;
  canFly: boolean;
  hasWings: boolean;
  legPairs: 2 | 3 | 4;
  isSpider: boolean;
  scale: number;
}

export interface MonsterPresetDef {
  id: string;
  label: string;
  category: 'animals' | 'monsters';
  blurb: string;
  blueprint: MonsterBlueprint;
}

export const MONSTER_PRESETS: MonsterPresetDef[] = [
  {
    id: 'timber_wolf',
    label: 'Timber Wolf',
    category: 'animals',
    blurb: 'Swift 4-legged woodland runner',
    blueprint: {
      id: 'preset_timber_wolf',
      name: 'Timber Wolf',
      presetId: 'timber_wolf',
      role: 'baddie',
      legPairs: 2,
      headCount: 1,
      headStyle: 'wolf',
      hornStyle: 'none',
      wingStyle: 'none',
      canFly: false,
      tailStyle: 'bushy',
      spineSpikes: false,
      bodyLength: 1.08,
      bodyWidth: 0.92,
      legHeight: 1.05,
      scale: 1.0,
      bodyColor: '#6B7280',
      bellyColor: '#E5E7EB',
      accentColor: '#374151',
      eyeColor: '#FBBF24',
      wingColor: '#4B5563',
      speed: 4,
      health: 4,
      dialogue: 'Grrr... stay out of the pack territory!',
    },
  },
  {
    id: 'red_fox',
    label: 'Red Fox',
    category: 'animals',
    blurb: 'Nimble 4-legged forest critter',
    blueprint: {
      id: 'preset_red_fox',
      name: 'Red Fox',
      presetId: 'red_fox',
      role: 'npc',
      legPairs: 2,
      headCount: 1,
      headStyle: 'wolf',
      hornStyle: 'none',
      wingStyle: 'none',
      canFly: false,
      tailStyle: 'bushy',
      spineSpikes: false,
      bodyLength: 0.96,
      bodyWidth: 0.85,
      legHeight: 0.9,
      scale: 0.9,
      bodyColor: '#D95F28',
      bellyColor: '#FFF3E0',
      accentColor: '#2B211B',
      eyeColor: '#F59E0B',
      wingColor: '#D95F28',
      speed: 4,
      health: 4,
      dialogue: 'Yip! Looking for hidden berries in the glade?',
    },
  },
  {
    id: 'forest_stag',
    label: 'Forest Stag',
    category: 'animals',
    blurb: 'Tall 4-legged antlered guardian',
    blueprint: {
      id: 'preset_forest_stag',
      name: 'Forest Stag',
      presetId: 'forest_stag',
      role: 'buddy',
      legPairs: 2,
      headCount: 1,
      headStyle: 'wolf',
      hornStyle: 'stagAntlers',
      wingStyle: 'none',
      canFly: false,
      tailStyle: 'shortStub',
      spineSpikes: false,
      bodyLength: 1.15,
      bodyWidth: 0.9,
      legHeight: 1.32,
      scale: 1.12,
      bodyColor: '#8B5A3C',
      bellyColor: '#EADBC8',
      accentColor: '#F3E5AB',
      eyeColor: '#38BDF8',
      wingColor: '#8B5A3C',
      speed: 4,
      health: 6,
      dialogue: 'Follow my antlers — I know the mountain paths.',
    },
  },
  {
    id: 'grizzly_bear',
    label: 'Grizzly Bear',
    category: 'animals',
    blurb: 'Heavy 4-legged woodland bruiser',
    blueprint: {
      id: 'preset_grizzly_bear',
      name: 'Grizzly Bear',
      presetId: 'grizzly_bear',
      role: 'baddie',
      legPairs: 2,
      headCount: 1,
      headStyle: 'fluffy',
      hornStyle: 'none',
      wingStyle: 'none',
      canFly: false,
      tailStyle: 'shortStub',
      spineSpikes: false,
      bodyLength: 1.12,
      bodyWidth: 1.34,
      legHeight: 0.92,
      scale: 1.24,
      bodyColor: '#6D442B',
      bellyColor: '#B98E68',
      accentColor: '#3B2314',
      eyeColor: '#FDE047',
      wingColor: '#6D442B',
      speed: 3,
      health: 7,
      dialogue: 'ROAR! Who woke me up from my nap?',
    },
  },
  {
    id: 'twin_dragon',
    label: 'Two-Headed Dragon',
    category: 'monsters',
    blurb: 'Winged flying 4-legged twin-head drake',
    blueprint: {
      id: 'preset_twin_dragon',
      name: 'Twin Flame Drake',
      presetId: 'twin_dragon',
      role: 'baddie',
      legPairs: 2,
      headCount: 2,
      headStyle: 'dragon',
      hornStyle: 'twinHorns',
      wingStyle: 'dragonBat',
      canFly: true,
      tailStyle: 'dragonSpiked',
      spineSpikes: true,
      bodyLength: 1.24,
      bodyWidth: 1.12,
      legHeight: 1.0,
      scale: 1.25,
      bodyColor: '#B91C1C',
      bellyColor: '#FBBF24',
      accentColor: '#450A0A',
      eyeColor: '#FEF08A',
      wingColor: '#EA580C',
      isBoss: true,
      speed: 4,
      health: 9,
      dialogue: 'Twice the jaws, twice the fire!',
    },
  },
  {
    id: 'hydra_beast',
    label: 'Three-Headed Hydra',
    category: 'monsters',
    blurb: '3-headed armored swamp monster',
    blueprint: {
      id: 'preset_hydra_beast',
      name: 'Three-Headed Hydra',
      presetId: 'hydra_beast',
      role: 'baddie',
      legPairs: 2,
      headCount: 3,
      headStyle: 'dragon',
      hornStyle: 'crownSpikes',
      wingStyle: 'none',
      canFly: false,
      tailStyle: 'dragonSpiked',
      spineSpikes: true,
      bodyLength: 1.32,
      bodyWidth: 1.24,
      legHeight: 1.05,
      scale: 1.35,
      bodyColor: '#0F766E',
      bellyColor: '#99F6E4',
      accentColor: '#F59E0B',
      eyeColor: '#FB7185',
      wingColor: '#14B8A6',
      isBoss: true,
      speed: 3,
      health: 10,
      dialogue: 'All three of us saw you coming!',
    },
  },
  {
    id: 'winged_manticore',
    label: 'Winged Manticore',
    category: 'monsters',
    blurb: 'Horned lion-beast with wings & stinger',
    blueprint: {
      id: 'preset_winged_manticore',
      name: 'Winged Manticore',
      presetId: 'winged_manticore',
      role: 'baddie',
      legPairs: 2,
      headCount: 1,
      headStyle: 'demon',
      hornStyle: 'ramCurl',
      wingStyle: 'feathered',
      canFly: true,
      tailStyle: 'stinger',
      spineSpikes: true,
      bodyLength: 1.18,
      bodyWidth: 1.08,
      legHeight: 1.08,
      scale: 1.18,
      bodyColor: '#9333EA',
      bellyColor: '#FDE68A',
      accentColor: '#F59E0B',
      eyeColor: '#38BDF8',
      wingColor: '#EC4899',
      speed: 5,
      health: 7,
      dialogue: 'Watch out for the sky — and my tail!',
    },
  },
  {
    id: 'six_leg_hound',
    label: 'Six-Legged Shadow Hound',
    category: 'monsters',
    blurb: '6-legged spiked prowler',
    blueprint: {
      id: 'preset_six_leg_hound',
      name: 'Shadow Hound',
      presetId: 'six_leg_hound',
      role: 'baddie',
      legPairs: 3,
      headCount: 2,
      headStyle: 'wolf',
      hornStyle: 'twinHorns',
      wingStyle: 'none',
      canFly: false,
      tailStyle: 'club',
      spineSpikes: true,
      bodyLength: 1.36,
      bodyWidth: 0.98,
      legHeight: 1.02,
      scale: 1.1,
      bodyColor: '#312E81',
      bellyColor: '#818CF8',
      accentColor: '#C084FC',
      eyeColor: '#22D3EE',
      wingColor: '#4F46E5',
      speed: 5,
      health: 6,
      dialogue: 'Six paws make zero sound in the dark...',
    },
  },
  {
    id: 'eight_leg_weaver',
    label: '8-Legged Cave Weaver',
    category: 'monsters',
    blurb: '8-legged arachnid monster with stinger',
    blueprint: {
      id: 'preset_eight_leg_weaver',
      name: 'Cave Weaver',
      presetId: 'eight_leg_weaver',
      role: 'baddie',
      legPairs: 4,
      headCount: 1,
      headStyle: 'spider',
      hornStyle: 'none',
      wingStyle: 'fairyInsect',
      canFly: false,
      tailStyle: 'stinger',
      spineSpikes: true,
      bodyLength: 1.2,
      bodyWidth: 1.25,
      legHeight: 1.05,
      scale: 1.08,
      bodyColor: '#27272A',
      bellyColor: '#71717A',
      accentColor: '#A3E635',
      eyeColor: '#EF4444',
      wingColor: '#84CC16',
      speed: 4,
      health: 5,
      dialogue: 'Skitter-skitter... step into my web!',
    },
  },
];

export function createDefaultMonsterBlueprint(presetId = 'twin_dragon'): MonsterBlueprint {
  const found = MONSTER_PRESETS.find((p) => p.id === presetId) ?? MONSTER_PRESETS[0];
  return {
    ...found.blueprint,
    id: `mon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
  };
}

const RANDOM_ADJECTIVES = [
  'Shadow', 'Ember', 'Storm', 'Frost', 'Moss', 'Crystal', 'Thunder', 'Bramble', 'Star', 'Fang',
];
const RANDOM_NOUNS = [
  'Hydra', 'Stalker', 'Drifter', 'Beast', 'Crawler', 'Griffin', 'Prowler', 'Wyrm', 'Howler',
];
const RANDOM_PALETTES: Array<{ body: string; belly: string; accent: string; eye: string; wing: string }> = [
  { body: '#991B1B', belly: '#FCD34D', accent: '#1F2937', eye: '#FEF08A', wing: '#F97316' },
  { body: '#4338CA', belly: '#A5B4FC', accent: '#F472B6', eye: '#22D3EE', wing: '#818CF8' },
  { body: '#0F766E', belly: '#A7F3D0', accent: '#F59E0B', eye: '#FB7185', wing: '#2DD4BF' },
  { body: '#7C2D12', belly: '#FDBA74', accent: '#FDE047', eye: '#38BDF8', wing: '#EA580C' },
  { body: '#581C87', belly: '#E9D5FF', accent: '#A3E635', eye: '#FDE047', wing: '#C084FC' },
  { body: '#334155', belly: '#CBD5E1', accent: '#EF4444', eye: '#38BDF8', wing: '#64748B' },
];

export function createRandomMonsterBlueprint(currentId?: string): MonsterBlueprint {
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const legPairs = pick<2 | 3 | 4>([2, 2, 2, 3, 4]);
  const headCount = pick<1 | 2 | 3>([1, 2, 3]);
  const headStyle = pick<MonsterHeadStyle>(['wolf', 'dragon', 'demon', 'dino', 'fluffy', 'spider']);
  const hornStyle = pick<MonsterHornStyle>(['none', 'twinHorns', 'ramCurl', 'stagAntlers', 'crownSpikes', 'rhinoHorn']);
  const wingStyle = pick<MonsterWingStyle>(['none', 'dragonBat', 'feathered', 'fairyInsect']);
  const tailStyle = pick<MonsterTailStyle>(['bushy', 'dragonSpiked', 'club', 'stinger', 'shortStub']);
  const pal = pick(RANDOM_PALETTES);
  return {
    id: currentId ?? `mon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: `${pick(RANDOM_ADJECTIVES)} ${pick(RANDOM_NOUNS)}`,
    role: 'baddie',
    legPairs,
    headCount,
    headStyle,
    hornStyle,
    wingStyle,
    canFly: wingStyle !== 'none' && Math.random() > 0.25,
    tailStyle,
    spineSpikes: Math.random() > 0.35,
    bodyLength: Number((0.95 + Math.random() * 0.48).toFixed(2)),
    bodyWidth: Number((0.88 + Math.random() * 0.38).toFixed(2)),
    legHeight: Number((0.85 + Math.random() * 0.45).toFixed(2)),
    scale: 1.05,
    bodyColor: pal.body,
    bellyColor: pal.belly,
    accentColor: pal.accent,
    eyeColor: pal.eye,
    wingColor: pal.wing,
    speed: 4,
    health: 6,
    dialogue: 'Grrrr! Look at what I can do!',
  };
}

function buildHornsForHead(
  hornStyle: MonsterHornStyle,
  hornMat: THREE.Material,
  headRadius: number
): THREE.Group | null {
  if (hornStyle === 'none') return null;
  const g = new THREE.Group();

  if (hornStyle === 'twinHorns') {
    for (const side of [-1, 1]) {
      const h = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.34, 7), hornMat);
      h.position.set(side * headRadius * 0.56, headRadius * 0.92, -0.05);
      h.rotation.z = side * -0.42;
      h.rotation.x = -0.35;
      h.castShadow = true;
      g.add(h);
    }
  } else if (hornStyle === 'ramCurl') {
    for (const side of [-1, 1]) {
      const curl = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.042, 7, 14, Math.PI * 1.45), hornMat);
      curl.position.set(side * (headRadius * 0.78), headRadius * 0.42, -0.04);
      curl.rotation.y = side * (Math.PI / 2);
      curl.rotation.z = 0.6;
      curl.castShadow = true;
      g.add(curl);
    }
  } else if (hornStyle === 'stagAntlers') {
    for (const side of [-1, 1]) {
      const ant = new THREE.Group();
      ant.position.set(side * headRadius * 0.45, headRadius * 0.78, -0.05);
      const main = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.036, 0.46, 6), hornMat);
      main.position.set(side * 0.1, 0.2, -0.04);
      main.rotation.z = side * -0.45;
      main.rotation.x = -0.25;
      main.castShadow = true;
      const tine1 = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.22, 5), hornMat);
      tine1.position.set(side * 0.12, 0.22, 0.08);
      tine1.rotation.x = 0.55;
      const tine2 = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.2, 5), hornMat);
      tine2.position.set(side * 0.23, 0.36, -0.04);
      tine2.rotation.z = side * -0.25;
      ant.add(main, tine1, tine2);
      g.add(ant);
    }
  } else if (hornStyle === 'crownSpikes') {
    for (let i = -2; i <= 2; i++) {
      const len = 0.28 - Math.abs(i) * 0.035;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.038, len, 6), hornMat);
      spike.position.set(i * 0.075, headRadius * 0.9, -0.04 - Math.abs(i) * 0.02);
      spike.rotation.z = -i * 0.22;
      spike.rotation.x = -0.22;
      spike.castShadow = true;
      g.add(spike);
    }
  } else if (hornStyle === 'rhinoHorn') {
    const big = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.34, 7), hornMat);
    big.position.set(0, headRadius * 0.24, headRadius * 1.15);
    big.rotation.x = 0.65;
    big.castShadow = true;
    const small = new THREE.Mesh(new THREE.ConeGeometry(0.044, 0.18, 6), hornMat);
    small.position.set(0, headRadius * 0.48, headRadius * 0.72);
    small.rotation.x = 0.45;
    g.add(big, small);
  }

  return g;
}

function buildHeadUnit(
  bp: MonsterBlueprint,
  bodyMat: THREE.MeshStandardMaterial,
  bellyMat: THREE.MeshStandardMaterial,
  accentMat: THREE.MeshStandardMaterial,
  eyeMat: THREE.MeshStandardMaterial
): { group: THREE.Group; jawPivot?: THREE.Group } {
  const headGroup = new THREE.Group();
  const darkMat = new THREE.MeshStandardMaterial({ color: '#1A1C24', roughness: 0.35, flatShading: true });
  const fangMat = new THREE.MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.3 });

  let headR = 0.24;
  let jawPivot: THREE.Group | undefined;

  if (bp.headStyle === 'dragon' || bp.headStyle === 'dino') {
    headR = 0.25;
    const isDino = bp.headStyle === 'dino';
    const skull = new THREE.Mesh(
      new THREE.BoxGeometry(isDino ? 0.38 : 0.34, isDino ? 0.32 : 0.26, 0.36),
      bodyMat
    );
    skull.castShadow = true;
    headGroup.add(skull);

    const snout = new THREE.Mesh(
      new THREE.BoxGeometry(isDino ? 0.28 : 0.24, isDino ? 0.2 : 0.16, 0.34),
      bodyMat
    );
    snout.position.set(0, 0.02, 0.29);
    snout.castShadow = true;
    headGroup.add(snout);

    jawPivot = new THREE.Group();
    jawPivot.position.set(0, -0.07, 0.06);
    const lowerJaw = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.09, 0.46), bellyMat);
    lowerJaw.position.set(0, -0.02, 0.18);
    jawPivot.add(lowerJaw);
    for (const side of [-1, 1]) {
      const fang = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.08, 5), fangMat);
      fang.position.set(side * 0.085, 0.055, 0.34);
      jawPivot.add(fang);
    }
    headGroup.add(jawPivot);

    // Brow ridges
    for (const side of [-1, 1]) {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.22), accentMat);
      brow.position.set(side * 0.13, 0.13, 0.09);
      brow.rotation.z = side * -0.18;
      headGroup.add(brow);
    }

    // Glowing eyes
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.065, 0.08), eyeMat);
      eye.position.set(side * 0.165, 0.05, 0.14);
      headGroup.add(eye);
    }

    if (!isDino) {
      // Cheek crest fins
      for (const side of [-1, 1]) {
        const fin = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24, 5), accentMat);
        fin.position.set(side * 0.18, 0.04, -0.16);
        fin.rotation.x = -Math.PI / 2.2;
        fin.rotation.z = side * -0.35;
        headGroup.add(fin);
      }
    }
  } else if (bp.headStyle === 'demon') {
    headR = 0.26;
    const skull = new THREE.Mesh(new THREE.IcosahedronGeometry(0.25, 1), bodyMat);
    skull.scale.set(1.06, 0.96, 1.04);
    skull.castShadow = true;
    headGroup.add(skull);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.17, 0.24), accentMat);
    snout.position.set(0, -0.05, 0.21);
    headGroup.add(snout);

    for (const side of [-1, 1]) {
      const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.14, 6), fangMat);
      tusk.position.set(side * 0.11, 0.02, 0.3);
      tusk.rotation.x = 0.3;
      headGroup.add(tusk);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.046, 8, 8), eyeMat);
      eye.position.set(side * 0.13, 0.06, 0.21);
      headGroup.add(eye);
    }
  } else if (bp.headStyle === 'spider') {
    headR = 0.24;
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 9), bodyMat);
    headMesh.scale.set(1.22, 0.78, 1.05);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Spider eye cluster!
    const eyeSpecs: Array<[number, number, number, number]> = [
      [-0.08, 0.04, 0.24, 0.042],
      [0.08, 0.04, 0.24, 0.042],
      [-0.17, 0.07, 0.18, 0.028],
      [0.17, 0.07, 0.18, 0.028],
      [-0.04, 0.12, 0.21, 0.024],
      [0.04, 0.12, 0.21, 0.024],
    ];
    for (const [ex, ey, ez, er] of eyeSpecs) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(er, 7, 7), eyeMat);
      eye.position.set(ex, ey, ez);
      headGroup.add(eye);
    }
    // Mandibles
    for (const side of [-1, 1]) {
      const mand = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.18, 6), accentMat);
      mand.position.set(side * 0.1, -0.08, 0.26);
      mand.rotation.x = Math.PI / 1.8;
      mand.rotation.z = side * 0.3;
      headGroup.add(mand);
    }
  } else if (bp.headStyle === 'fluffy') {
    headR = 0.25;
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), bodyMat);
    skull.scale.set(1.08, 0.94, 0.98);
    skull.castShadow = true;
    headGroup.add(skull);

    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), bellyMat);
    muzzle.scale.set(1.15, 0.85, 1.0);
    muzzle.position.set(0, -0.05, 0.22);
    headGroup.add(muzzle);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), darkMat);
    nose.position.set(0, -0.01, 0.34);
    headGroup.add(nose);

    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), bodyMat);
      ear.scale.set(0.85, 1.0, 0.55);
      ear.position.set(side * 0.19, 0.21, -0.02);
      ear.castShadow = true;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 8), eyeMat);
      eye.position.set(side * 0.12, 0.06, 0.22);
      headGroup.add(ear, eye);
    }
  } else {
    // 'wolf' (canine / fox / stag animal head)
    headR = 0.22;
    const skull = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 1), bodyMat);
    skull.scale.set(0.98, 0.9, 1.08);
    skull.castShadow = true;
    headGroup.add(skull);

    const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.11, 0.26, 7), bellyMat);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, -0.04, 0.26);
    snout.castShadow = true;
    headGroup.add(snout);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.042, 7, 7), darkMat);
    nose.position.set(0, -0.02, 0.39);
    headGroup.add(nose);

    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.2, 5), accentMat);
      ear.position.set(side * 0.13, 0.22, -0.03);
      ear.rotation.z = side * -0.18;
      ear.castShadow = true;

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), eyeMat);
      eye.position.set(side * 0.11, 0.06, 0.19);
      headGroup.add(ear, eye);
    }
  }

  const horns = buildHornsForHead(bp.hornStyle, accentMat, headR);
  if (horns) headGroup.add(horns);

  return { group: headGroup, jawPivot };
}

function buildWingRig(
  side: -1 | 1,
  style: MonsterWingStyle,
  wingMat: THREE.MeshStandardMaterial,
  boneMat: THREE.MeshStandardMaterial
): QuadrupedWingRig {
  const innerPivot = new THREE.Group();
  const outerPivot = new THREE.Group();
  outerPivot.position.set(side * 0.56, 0.04, -0.02);
  innerPivot.add(outerPivot);

  if (style === 'dragonBat') {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.048, 0.58, 6), boneMat);
    arm.rotation.z = side * (Math.PI / 2 - 0.12);
    arm.position.set(side * 0.28, 0.03, 0.04);
    arm.castShadow = true;
    const innerMembrane = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.025, 0.48), wingMat);
    innerMembrane.position.set(side * 0.28, 0, -0.18);
    innerMembrane.castShadow = true;
    innerPivot.add(arm, innerMembrane);

    const outerMembrane = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.02, 0.42), wingMat);
    outerMembrane.position.set(side * 0.34, 0, -0.16);
    outerMembrane.rotation.y = side * -0.16;
    outerMembrane.castShadow = true;
    outerPivot.add(outerMembrane);

    // Wing finger ribs
    for (let f = 0; f < 3; f++) {
      const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.022, 0.56, 5), boneMat);
      rib.rotation.z = side * (Math.PI / 2 - 0.15 * f);
      rib.rotation.y = side * (-0.12 - f * 0.24);
      rib.position.set(side * 0.26, 0.01, -0.05 - f * 0.12);
      outerPivot.add(rib);
    }
  } else if (style === 'feathered') {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.09, 0.22), boneMat);
    arm.position.set(side * 0.28, 0.02, 0.02);
    arm.castShadow = true;
    innerPivot.add(arm);

    for (let f = 0; f < 4; f++) {
      const feather = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.36), wingMat);
      feather.position.set(side * (0.14 + f * 0.11), -0.01, -0.18 - f * 0.02);
      feather.rotation.y = side * (0.12 - f * 0.05);
      feather.castShadow = true;
      innerPivot.add(feather);
    }
    for (let f = 0; f < 4; f++) {
      const primary = new THREE.Mesh(new THREE.BoxGeometry(0.56 - f * 0.07, 0.025, 0.16), wingMat);
      primary.position.set(side * (0.3 - f * 0.03), 0, -0.06 - f * 0.11);
      primary.rotation.y = side * (-0.12 - f * 0.16);
      primary.castShadow = true;
      outerPivot.add(primary);
    }
  } else if (style === 'fairyInsect') {
    const upperWing = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.16, 0.02, 10), wingMat);
    upperWing.scale.set(1.65, 1, 0.95);
    upperWing.position.set(side * 0.34, 0.02, 0.02);
    upperWing.rotation.y = side * -0.18;
    innerPivot.add(upperWing);

    const lowerWing = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.12, 0.02, 10), wingMat);
    lowerWing.scale.set(1.5, 1, 0.85);
    lowerWing.position.set(side * 0.32, 0, -0.2);
    lowerWing.rotation.y = side * 0.24;
    outerPivot.add(lowerWing);
  }

  return { side, innerPivot, outerPivot };
}

function buildTailSegments(
  tailStyle: MonsterTailStyle,
  bodyMat: THREE.MeshStandardMaterial,
  bellyMat: THREE.MeshStandardMaterial,
  accentMat: THREE.MeshStandardMaterial
): THREE.Group[] {
  if (tailStyle === 'none') return [];
  const segs: THREE.Group[] = [];

  if (tailStyle === 'shortStub') {
    const seg = new THREE.Group();
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), bellyMat);
    puff.scale.set(0.95, 0.95, 1.25);
    puff.position.set(0, 0.03, -0.1);
    puff.castShadow = true;
    seg.add(puff);
    segs.push(seg);
    return segs;
  }

  const count = tailStyle === 'stinger' ? 4 : 3;
  let parent: THREE.Group | null = null;
  for (let i = 0; i < count; i++) {
    const seg = new THREE.Group();
    if (parent) {
      seg.position.set(0, tailStyle === 'stinger' ? 0.06 * i : 0.01, -0.26);
      parent.add(seg);
    }

    if (tailStyle === 'bushy') {
      const r1 = i === 0 ? 0.11 : i === 1 ? 0.16 : 0.12;
      const r2 = i === 0 ? 0.15 : i === 1 ? 0.14 : 0.04;
      const mat = i === count - 1 ? bellyMat : bodyMat;
      const mesh = new THREE.Mesh(new THREE.ConeGeometry(Math.max(r1, r2), 0.32, 8), mat);
      mesh.rotation.x = i === 0 ? -Math.PI / 2.2 : -Math.PI / 2;
      mesh.position.set(0, 0, -0.14);
      mesh.castShadow = true;
      seg.add(mesh);
    } else if (tailStyle === 'dragonSpiked') {
      const rTop = Math.max(0.035, 0.11 - i * 0.03);
      const rBot = Math.max(0.05, 0.14 - i * 0.03);
      const bone = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, 0.3, 7), bodyMat);
      bone.rotation.x = Math.PI / 2;
      bone.position.set(0, 0, -0.14);
      bone.castShadow = true;
      seg.add(bone);
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 5), accentMat);
      spike.position.set(0, rBot + 0.04, -0.14);
      seg.add(spike);
      if (i === count - 1) {
        const spade = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.24, 4), accentMat);
        spade.rotation.x = -Math.PI / 2;
        spade.position.set(0, 0, -0.32);
        seg.add(spade);
      }
    } else if (tailStyle === 'club') {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.28, 7), bodyMat);
      rod.rotation.x = Math.PI / 2;
      rod.position.set(0, 0, -0.14);
      seg.add(rod);
      if (i === count - 1) {
        const mace = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 0), accentMat);
        mace.position.set(0, 0, -0.3);
        mace.castShadow = true;
        seg.add(mace);
      }
    } else if (tailStyle === 'stinger') {
      const segMesh = new THREE.Mesh(new THREE.SphereGeometry(0.095 - i * 0.014, 8, 7), bodyMat);
      segMesh.scale.set(0.85, 0.85, 1.4);
      segMesh.position.set(0, 0.04, -0.14);
      seg.rotation.x = i === 0 ? 0.28 : 0.38;
      seg.add(segMesh);
      if (i === count - 1) {
        const needle = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.26, 6), accentMat);
        needle.rotation.x = Math.PI / 2.6;
        needle.position.set(0, 0.08, -0.26);
        seg.add(needle);
      }
    }

    segs.push(seg);
    parent = seg;
  }

  return segs;
}

export function buildQuadrupedMonsterMesh(blueprint: MonsterBlueprint): THREE.Group {
  const bp = blueprint;
  const root = new THREE.Group();
  root.userData.monsterId = bp.id;

  const scale = THREE.MathUtils.clamp(bp.scale || 1, 0.55, 2.5);
  const bodyLen = THREE.MathUtils.clamp(bp.bodyLength || 1, 0.7, 1.75) * (bp.legPairs === 3 ? 1.24 : bp.legPairs === 4 ? 1.28 : 1.0);
  const bodyWid = THREE.MathUtils.clamp(bp.bodyWidth || 1, 0.7, 1.65);
  const legH = THREE.MathUtils.clamp(bp.legHeight || 1, 0.6, 1.65);
  const isSpider = bp.headStyle === 'spider' || bp.legPairs === 4;

  // Ground shadow disc
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.72 * Math.max(bodyLen, bodyWid), 20),
    new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.28, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  root.add(shadow);

  const bodyMat = new THREE.MeshStandardMaterial({ color: bp.bodyColor, roughness: 0.62, flatShading: true });
  const bellyMat = new THREE.MeshStandardMaterial({ color: bp.bellyColor, roughness: 0.72, flatShading: true });
  const accentMat = new THREE.MeshStandardMaterial({ color: bp.accentColor, roughness: 0.45, metalness: 0.2, flatShading: true });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: bp.eyeColor,
    emissive: bp.eyeColor,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });
  const wingMat = new THREE.MeshStandardMaterial({
    color: bp.wingColor,
    roughness: 0.52,
    side: THREE.DoubleSide,
    transparent: bp.wingStyle === 'fairyInsect',
    opacity: bp.wingStyle === 'fairyInsect' ? 0.78 : 1,
    flatShading: true,
  });

  const groundClearance = isSpider ? 0.44 * legH : 0.66 * legH;
  const torsoRadius = 0.31 * bodyWid;
  const torsoLength = 0.92 * bodyLen;

  const bodyPivot = new THREE.Group();
  bodyPivot.position.y = groundClearance;
  bodyPivot.scale.setScalar(scale);

  // Chest / front torso
  const chest = new THREE.Mesh(new THREE.SphereGeometry(torsoRadius * 1.05, 11, 9), bodyMat);
  chest.scale.set(0.95, 0.95, 1.25);
  chest.position.set(0, 0.03, torsoLength * 0.26);
  chest.castShadow = true;
  bodyPivot.add(chest);

  // Belly underplate
  const belly = new THREE.Mesh(new THREE.SphereGeometry(torsoRadius * 0.84, 10, 8), bellyMat);
  belly.scale.set(0.82, 0.68, torsoLength * 1.65);
  belly.position.set(0, -torsoRadius * 0.34, 0);
  bodyPivot.add(belly);

  // Mid & rear haunches pivot (subtly flexes during gallops!)
  const spineBackPivot = new THREE.Group();
  spineBackPivot.position.set(0, 0.02, -torsoLength * 0.05);
  const rear = new THREE.Mesh(new THREE.SphereGeometry(torsoRadius * 0.96, 11, 9), bodyMat);
  rear.scale.set(0.94, 0.92, (torsoLength * 1.05) / (torsoRadius * 1.35));
  rear.position.set(0, 0, -torsoLength * 0.24);
  rear.castShadow = true;
  spineBackPivot.add(rear);
  bodyPivot.add(spineBackPivot);

  // Dorsal spine spikes along back
  if (bp.spineSpikes) {
    const spikeCount = bp.legPairs >= 3 ? 6 : 4;
    for (let i = 0; i < spikeCount; i++) {
      const frac = i / Math.max(1, spikeCount - 1);
      const zPos = THREE.MathUtils.lerp(torsoLength * 0.32, -torsoLength * 0.45, frac);
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.19 - frac * 0.04, 5), accentMat);
      sp.position.set(0, torsoRadius * 0.96, zPos);
      sp.rotation.x = -0.25;
      sp.castShadow = true;
      bodyPivot.add(sp);
    }
  }

  // Articulated legs (4, 6, or 8 legs)
  const legs: QuadrupedLegRig[] = [];
  const upperLen = isSpider ? 0.38 * legH : 0.35 * legH;
  const lowerLen = isSpider ? 0.44 * legH : 0.33 * legH;
  const limbRadius = (bp.headStyle === 'fluffy' ? 0.088 : isSpider ? 0.044 : 0.068) * Math.min(1.3, bodyWid);

  for (let p = 0; p < bp.legPairs; p++) {
    const t = p / Math.max(1, bp.legPairs - 1);
    const zAnchor = THREE.MathUtils.lerp(torsoLength * 0.36, -torsoLength * 0.38, t);
    const xAnchor = torsoRadius * (isSpider ? 0.85 : 0.72);
    const yAnchor = isSpider ? -0.02 : -torsoRadius * 0.3;

    for (const side of [-1, 1] as const) {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(side * xAnchor, yAnchor, zAnchor);

      const baseSpreadZ = isSpider ? side * 0.88 : side * 0.08;
      const baseYawY = isSpider ? side * THREE.MathUtils.lerp(0.65, -0.65, t) : 0;
      const baseHipX = isSpider ? 0 : p === bp.legPairs - 1 ? 0.14 : -0.1;

      hipPivot.rotation.set(baseHipX, baseYawY, baseSpreadZ);

      const upperMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(limbRadius * 1.15, limbRadius * 0.85, upperLen, 7),
        bodyMat
      );
      upperMesh.position.y = -upperLen * 0.5;
      upperMesh.castShadow = true;
      hipPivot.add(upperMesh);

      const kneePivot = new THREE.Group();
      kneePivot.position.set(0, -upperLen, 0);
      const baseKneeX = isSpider ? 0 : p === bp.legPairs - 1 ? -0.22 : 0.16;
      kneePivot.rotation.x = baseKneeX;
      if (isSpider) {
        kneePivot.rotation.z = side * -1.18;
      }

      const lowerMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(limbRadius * 0.82, limbRadius * 0.62, lowerLen, 7),
        accentMat
      );
      lowerMesh.position.y = -lowerLen * 0.5;
      lowerMesh.castShadow = true;
      kneePivot.add(lowerMesh);

      const pawGroup = new THREE.Group();
      pawGroup.position.set(0, -lowerLen, 0);
      const pawMesh = new THREE.Mesh(
        new THREE.SphereGeometry(limbRadius * (isSpider ? 0.85 : 1.18), 7, 6),
        accentMat
      );
      pawMesh.scale.set(1.05, 0.58, 1.35);
      pawMesh.position.set(0, 0, isSpider ? 0 : 0.03);
      pawMesh.castShadow = true;
      pawGroup.add(pawMesh);
      kneePivot.add(pawGroup);

      hipPivot.add(kneePivot);
      bodyPivot.add(hipPivot);

      legs.push({
        side,
        pairIndex: p,
        hipPivot,
        kneePivot,
        pawGroup,
        baseHipX,
        baseKneeX,
        baseSpreadZ,
        baseYawY,
      });
    }
  }

  // Necks & 1 / 2 / 3 Heads!
  const heads: QuadrupedHeadRig[] = [];
  const headOffsets: number[] =
    bp.headCount === 1
      ? [0]
      : bp.headCount === 2
      ? [-0.32, 0.32]
      : [-0.48, 0, 0.48];
  const neckLen = bp.headStyle === 'dragon' ? 0.36 : bp.headStyle === 'spider' ? 0.14 : 0.24;

  headOffsets.forEach((yawOffset, idx) => {
    const neckPivot = new THREE.Group();
    const isCenterOfThree = bp.headCount === 3 && idx === 1;
    const xPos = Math.sin(yawOffset) * 0.22 * bodyWid;
    const yPos = torsoRadius * 0.52 + (isCenterOfThree ? 0.1 : 0);
    const zPos = torsoLength * 0.48;
    neckPivot.position.set(xPos, yPos, zPos);

    const baseNeckPitch = bp.headStyle === 'spider' ? 0.12 : -0.35;
    neckPivot.rotation.set(baseNeckPitch, yawOffset, 0);

    const neckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.15, neckLen, 8),
      bodyMat
    );
    neckMesh.position.set(0, neckLen * 0.45, 0.05);
    neckMesh.castShadow = true;
    neckPivot.add(neckMesh);

    const headPivot = new THREE.Group();
    headPivot.position.set(0, neckLen * 0.88, 0.1);
    headPivot.rotation.x = -baseNeckPitch * 0.85; // Keep head level forward!

    const builtHead = buildHeadUnit(bp, bodyMat, bellyMat, accentMat, eyeMat);
    headPivot.add(builtHead.group);
    neckPivot.add(headPivot);
    bodyPivot.add(neckPivot);

    heads.push({
      neckPivot,
      headPivot,
      jawPivot: builtHead.jawPivot,
      baseNeckYaw: yawOffset,
      baseNeckPitch,
      headIndex: idx,
    });
  });

  // Tail chain
  const tailSegments = buildTailSegments(bp.tailStyle, bodyMat, bellyMat, accentMat);
  if (tailSegments.length > 0) {
    tailSegments[0].position.set(0, torsoRadius * 0.28, -torsoLength * 0.54);
    spineBackPivot.add(tailSegments[0]);
  }

  // Wings (Left + Right)
  let wingL: QuadrupedWingRig | undefined;
  let wingR: QuadrupedWingRig | undefined;
  const hasWings = bp.wingStyle !== 'none';
  if (hasWings) {
    wingL = buildWingRig(-1, bp.wingStyle, wingMat, accentMat);
    wingL.innerPivot.position.set(-torsoRadius * 0.72, torsoRadius * 0.65, torsoLength * 0.16);
    bodyPivot.add(wingL.innerPivot);

    wingR = buildWingRig(1, bp.wingStyle, wingMat, accentMat);
    wingR.innerPivot.position.set(torsoRadius * 0.72, torsoRadius * 0.65, torsoLength * 0.16);
    bodyPivot.add(wingR.innerPivot);
  }

  // Combat strike slash arc (hidden unless attacking as baddie)
  const slashGeo = new THREE.RingGeometry(0.55, 1.38, 16, 1, -0.95, 1.9);
  slashGeo.rotateX(-Math.PI / 2);
  const slashMat = new THREE.MeshBasicMaterial({
    color: '#FF5E3A',
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const slashArc = new THREE.Mesh(slashGeo, slashMat);
  slashArc.position.set(0, 0.2, torsoLength * 0.75);
  slashArc.visible = false;
  bodyPivot.add(slashArc);

  root.add(bodyPivot);

  const topHeight = (groundClearance + torsoRadius + neckLen + 0.48) * scale;
  const rig: QuadrupedMonsterRig = {
    root,
    bodyPivot,
    spineBackPivot,
    legs,
    heads,
    tailSegments,
    wingL,
    wingR,
    slashArc,
    slashMat,
    flashMaterials: [bodyMat, bellyMat, accentMat, wingMat],
    groundClearance,
    topHeight,
    canFly: hasWings && Boolean(bp.canFly),
    hasWings,
    legPairs: bp.legPairs,
    isSpider,
    scale,
  };

  root.userData.quadrupedRig = rig;
  return root;
}

export type QuadrupedAnimState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'fly'
  | 'windup'
  | 'strike'
  | 'stagger'
  | 'dying'
  | 'celebrate';

export function animateQuadrupedMonster(
  rig: QuadrupedMonsterRig | null | undefined,
  dt: number,
  elapsed: number,
  walkPhase: number,
  speedNorm: number,
  state: QuadrupedAnimState,
  stateProgress = 0,
  terrainPitch = 0,
  recoilPitch = 0,
  recoilRoll = 0
): void {
  if (!rig) return;
  const clampedDt = Math.min(0.05, Math.max(0.001, dt));
  const isFlying = rig.canFly && (state === 'fly' || state === 'walk' || state === 'run' || state === 'windup' || state === 'strike');
  const moving = state === 'walk' || state === 'run' || (state === 'fly' && speedNorm > 0.15);

  // 1. Body elevation, pitch & bob
  let targetBodyY = rig.groundClearance;
  let targetBodyPitch = terrainPitch + recoilPitch;
  let targetBodyRoll = recoilRoll;
  let targetSpinePitch = 0;

  if (state === 'dying') {
    targetBodyY = rig.groundClearance * 0.28;
    targetBodyRoll = 1.35;
  } else if (state === 'windup') {
    // Rear up / flare wings before pounce!
    targetBodyPitch = -0.34 * stateProgress + recoilPitch;
    targetBodyY = rig.groundClearance + (isFlying ? 1.15 : 0.14 * stateProgress);
  } else if (state === 'strike') {
    // Forward bite/claw lunge!
    const lunge = Math.sin(stateProgress * Math.PI);
    targetBodyPitch = 0.28 * lunge + recoilPitch;
    targetBodyY = rig.groundClearance + (isFlying ? 0.92 : 0.06 * lunge);
  } else if (state === 'stagger') {
    targetBodyPitch = -0.22 + recoilPitch;
  } else if (isFlying) {
    targetBodyY = rig.groundClearance + 1.18 + Math.sin(elapsed * 3.4) * 0.16;
    targetBodyPitch = (speedNorm > 0.2 ? 0.14 : 0.04) + Math.sin(elapsed * 3.4) * 0.05 + recoilPitch;
  } else if (state === 'celebrate') {
    targetBodyY = rig.groundClearance + Math.abs(Math.sin(elapsed * 8.5)) * 0.22;
    targetBodyPitch = -0.18 + Math.sin(elapsed * 8.5) * 0.1;
  } else if (moving) {
    const isRun = state === 'run' || speedNorm > 0.72;
    const bounceAmp = isRun ? 0.1 : 0.055;
    targetBodyY = rig.groundClearance + Math.abs(Math.sin(walkPhase)) * bounceAmp;
    targetBodyPitch = terrainPitch + (isRun ? Math.cos(walkPhase) * 0.12 : 0.03) + recoilPitch;
    targetBodyRoll = Math.sin(walkPhase) * (rig.isSpider ? 0.05 : 0.035) + recoilRoll;
    targetSpinePitch = isRun ? Math.sin(walkPhase) * 0.14 : 0;
  } else {
    // Idle breathing
    targetBodyY = rig.groundClearance + Math.sin(elapsed * 2.2) * 0.022;
  }

  rig.bodyPivot.position.y = THREE.MathUtils.damp(rig.bodyPivot.position.y, targetBodyY, 14, clampedDt);
  rig.bodyPivot.rotation.x = THREE.MathUtils.damp(rig.bodyPivot.rotation.x, targetBodyPitch, 14, clampedDt);
  rig.bodyPivot.rotation.z = THREE.MathUtils.damp(rig.bodyPivot.rotation.z, targetBodyRoll, 14, clampedDt);
  rig.spineBackPivot.rotation.x = THREE.MathUtils.damp(rig.spineBackPivot.rotation.x, targetSpinePitch, 14, clampedDt);

  // 2. Articulated Animal / Spider Leg Gaits
  const isRun = state === 'run' || speedNorm > 0.72;
  const strideAmp = state === 'strike' ? 0.65 : isRun ? 0.78 : moving ? 0.56 : 0;

  for (let i = 0; i < rig.legs.length; i++) {
    const leg = rig.legs[i];
    let targetHipX = leg.baseHipX;
    let targetKneeX = leg.baseKneeX;
    let targetSpreadZ = leg.baseSpreadZ;
    let targetYawY = leg.baseYawY;

    if (isFlying) {
      // Relaxed tucked trailing legs while flying
      targetHipX = leg.baseHipX + 0.45 + Math.sin(elapsed * 3.4 + leg.pairIndex * 0.4) * 0.08;
      targetKneeX = leg.baseKneeX + 0.55;
    } else if (state === 'windup') {
      if (leg.pairIndex === 0) {
        // Front paws raised!
        targetHipX = -0.82 * stateProgress;
        targetKneeX = 0.75 * stateProgress;
      } else {
        targetHipX = leg.baseHipX + 0.25 * stateProgress;
      }
    } else if (state === 'strike') {
      if (leg.pairIndex === 0) {
        targetHipX = THREE.MathUtils.lerp(-0.82, 0.45, Math.min(1, stateProgress * 1.4));
        targetKneeX = 0.25;
      }
    } else if (moving) {
      let phaseOffset = 0;
      if (rig.legPairs === 2) {
        if (isRun) {
          // Gallop / Canter: front pair together-ish, back pair opposite
          phaseOffset = (leg.pairIndex === 0 ? 0 : Math.PI) + (leg.side === 1 ? 0.38 : 0);
        } else {
          // True Quadruped Diagonal Trot/Walk (FL+BR sync, FR+BL sync)
          const isDiagonalA =
            (leg.pairIndex === 0 && leg.side === -1) ||
            (leg.pairIndex === 1 && leg.side === 1);
          phaseOffset = (isDiagonalA ? 0 : Math.PI) + leg.pairIndex * 0.16;
        }
      } else {
        // 6-legged & 8-legged alternating tripod / wave gait!
        const alt = (leg.pairIndex + (leg.side > 0 ? 1 : 0)) % 2;
        phaseOffset = (alt === 0 ? 0 : Math.PI) + leg.pairIndex * 0.42;
      }

      const p = walkPhase + phaseOffset;
      const swing = Math.sin(p);
      const lift = Math.max(0, Math.cos(p)); // Peaks mid-swing as paw travels forward!

      if (rig.isSpider) {
        targetYawY = leg.baseYawY + swing * 0.42 * leg.side;
        targetSpreadZ = leg.baseSpreadZ - lift * 0.36 * leg.side;
        targetHipX = leg.baseHipX - swing * 0.16;
      } else {
        targetHipX = leg.baseHipX - swing * strideAmp;
        targetKneeX = leg.baseKneeX + lift * (isRun ? 0.92 : 0.68);
      }
    }

    const dampRate = state === 'strike' ? 24 : 16;
    leg.hipPivot.rotation.x = THREE.MathUtils.damp(leg.hipPivot.rotation.x, targetHipX, dampRate, clampedDt);
    leg.hipPivot.rotation.z = THREE.MathUtils.damp(leg.hipPivot.rotation.z, targetSpreadZ, dampRate, clampedDt);
    leg.hipPivot.rotation.y = THREE.MathUtils.damp(leg.hipPivot.rotation.y, targetYawY, dampRate, clampedDt);
    leg.kneePivot.rotation.x = THREE.MathUtils.damp(leg.kneePivot.rotation.x, targetKneeX, dampRate, clampedDt);
  }

  // 3. Multi-head independent look/bob/jaw snap
  for (let i = 0; i < rig.heads.length; i++) {
    const h = rig.heads[i];
    const phase = elapsed * (moving ? 5.2 : 1.9) + h.headIndex * 1.45;
    let targetPitch = h.baseNeckPitch;
    let targetYaw = h.baseNeckYaw + Math.sin(phase) * (moving ? 0.08 : 0.14);
    let targetJaw = 0.04 + Math.max(0, Math.sin(elapsed * 2.1 + h.headIndex)) * 0.04;

    if (state === 'windup') {
      targetPitch = h.baseNeckPitch - 0.28 * stateProgress;
      targetJaw = 0.45 * stateProgress;
    } else if (state === 'strike') {
      targetPitch = h.baseNeckPitch + 0.42 * Math.sin(stateProgress * Math.PI);
      targetJaw = 0.55 * (1 - stateProgress);
    } else if (state === 'celebrate') {
      targetPitch = h.baseNeckPitch - 0.2 + Math.sin(elapsed * 9 + h.headIndex) * 0.14;
      targetJaw = 0.25;
    } else if (moving) {
      // Head counter-stabilization during quadruped stride
      targetPitch = h.baseNeckPitch + Math.sin(walkPhase * 2 + h.headIndex * 0.6) * 0.07;
    }

    h.neckPivot.rotation.x = THREE.MathUtils.damp(h.neckPivot.rotation.x, targetPitch, 14, clampedDt);
    h.neckPivot.rotation.y = THREE.MathUtils.damp(h.neckPivot.rotation.y, targetYaw, 10, clampedDt);
    h.headPivot.rotation.x = THREE.MathUtils.damp(h.headPivot.rotation.x, -targetPitch * 0.85, 14, clampedDt);
    if (h.jawPivot) {
      h.jawPivot.rotation.x = THREE.MathUtils.damp(h.jawPivot.rotation.x, targetJaw, 18, clampedDt);
    }
  }

  // 4. Multi-segment tail wave
  const tailFreq = state === 'celebrate' ? 11 : moving ? 6.5 : 2.4;
  const tailAmp = state === 'celebrate' ? 0.34 : moving ? 0.22 : 0.1;
  for (let i = 0; i < rig.tailSegments.length; i++) {
    const seg = rig.tailSegments[i];
    seg.rotation.y = Math.sin(elapsed * tailFreq - i * 0.72) * tailAmp;
  }

  // 5. Articulated inner + outer wing flap!
  if (rig.wingL && rig.wingR) {
    const flapSpeed =
      state === 'windup' ? 19 :
      state === 'strike' ? 22 :
      isFlying ? (speedNorm > 0.6 ? 12.5 : 9.2) :
      state === 'celebrate' ? 12 : 2.6;
    const flapAmp =
      isFlying ? 0.64 :
      state === 'windup' || state === 'strike' || state === 'celebrate' ? 0.52 : 0.08;
    const baseLift = isFlying ? 0.16 : 0.28;

    const innerAngle = baseLift + Math.sin(elapsed * flapSpeed) * flapAmp;
    const outerAngle = Math.sin(elapsed * flapSpeed - 0.62) * (flapAmp * 0.75);

    rig.wingL.innerPivot.rotation.z = -innerAngle;
    rig.wingR.innerPivot.rotation.z = innerAngle;
    rig.wingL.outerPivot.rotation.z = -outerAngle;
    rig.wingR.outerPivot.rotation.z = outerAngle;
  }
}
