import * as THREE from './vendor/three-room.js'
const mats=new Map()
const mat=c=>mats.get(c)||mats.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.9})).get(c)
const rand=(a,b)=>a+Math.random()*(b-a)
const room=new THREE.Group()
function group(parent=room){const g=new THREE.Group();parent.add(g);return g}
function say(c,_text,sec=2.5){c.sayT=sec}
const bowls={food:{level:100},water:{level:100}}
const SPOT={food:[238,376],water:[265,376],catbed:[77,144],sofa:[43,287]}
const CRADLE=[288,300],LITTER=[110,382]
const ball={x:165,y:328,vx:0,vy:0}
function carve(geo, amt, uvScale = 1 / 56) {
  // re-map UVs from each face's position (box-projection) so the grain has the same size on a book and on a wall
  geo.computeVertexNormals();
  const n = geo.attributes.normal, uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i)), P = geo.attributes.position;
    const [u, v] = ay >= ax && ay >= az ? [P.getX(i), P.getZ(i)] : ax >= az ? [P.getZ(i), P.getY(i)] : [P.getX(i), P.getY(i)];
    uv.setXY(i, u * uvScale, v * uvScale); }
  const p = geo.attributes.position, h = (x, y, z, k) => { const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + k * 4.1) * 43758.5453; return (v - Math.floor(v)) * 2 - 1; };
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), q = [x, y, z].map(v => Math.round(v * 100) / 100);
    p.setXYZ(i, x + h(...q, 1) * amt, y + h(...q, 2) * amt, z + h(...q, 3) * amt); }
  geo.computeVertexNormals(); return geo;
}
const unitSphere = carve(new THREE.IcosahedronGeometry(1, 1), .09, .5);
function mesh(geo, color, parent = room) { const m = new THREE.Mesh(geo, mat(color)); m.castShadow = m.receiveShadow = true; parent.add(m); return m; }
// two kittens (2–3 months: small body, big head): an orange mackerel tabby and a classic-tabby 狸花, both face +x
const KITTENS = [
  { name: '小橘子', emoji: '🍊', color: '#e9a25a', dark: '#c0763a', belly: '#fff3e0', coat: 'mackerel' },
  { name: '姜姜', emoji: '🌼', color: '#a08a6c', dark: '#3d3127', belly: '#efe4d0', coat: 'classic' },
];
const legGeo = new THREE.CylinderGeometry(2, 2, 8, 6), earGeo = new THREE.ConeGeometry(3.4, 7, 4), tailGeo = carve(new THREE.CapsuleGeometry(2, 13, 2, 6), .3, .08);
function makeCat(k, x, y, phase) {
  const g = group(), body = group(g); g.name=k.name; g.scale.setScalar(.016);
  const torso = mesh(unitSphere, k.color, body); torso.position.y = 12;
  // coat markings are children of the torso (unit-sphere space), so they stretch with every pose
  const mark = (parent, sx, sy, sz, px, py, pz, c = k.dark) => { const m = mesh(unitSphere, c, parent); m.scale.set(sx, sy, sz); m.position.set(px, py, pz); return m; };
  const ring = x => { const r = Math.sqrt(1 - x * x) + .04; mark(torso, .09, r, r, x, 0, 0); };
  if (k.coat === 'mackerel') [-.7, -.35, 0, .35].forEach(ring); // stripes around the body
  else { mark(torso, .85, .14, .32, -.05, .93, 0); [-.75, .62].forEach(ring); // dark spine + rings
    for (const z of [-1, 1]) { mark(torso, .42, .42, .12, -.15, .08, .92 * z); mark(torso, .2, .18, .1, -.15, .08, 1.01 * z, k.color); } } // classic "bullseye" swirl on each flank
  const headG = group(body), head = mesh(unitSphere, k.color, headG); head.scale.setScalar(8.5); // kitten: big head
  mark(headG, 3.6, 3, 3.6, 7, -2.5, 0, k.belly); // muzzle
  for (const z of [-1, 1]) { mark(headG, 1.1, 1.3, 1.1, 7.2, 1.5, 3 * z, '#2a2420'); const e = mesh(earGeo, k.dark, headG); e.position.set(-1, 7.5, 4.8 * z); } // eyes, ears
  for (const z of [-1, 1]) mark(head, .38, .1, .1, .35, .82, .22 * z); // forehead stripes
  const legs = [[8, 4.5], [8, -4.5], [-8, 4.5], [-8, -4.5]].map(([lx, lz]) => { const l = mesh(legGeo, k.color, body); l.position.set(lx, 4, lz); return l; });
  const tailPivot = group(body); tailPivot.position.set(-14, 13, 0);
  const tail = mesh(tailGeo, k.dark, tailPivot); tail.position.set(-5, 7, 0); tail.rotation.z = .6;
  return { k, g, body, torso, headG, legs, tailPivot, x, y, ang: rand(0, 6), state: 'idle', t: rand(.5, 2), goal: null, pose: 'stand', phase, target: [x, y],
    needs: { hunger: rand(55, 80), thirst: rand(45, 70), energy: rand(60, 85), fun: rand(35, 60), potty: rand(50, 90) }, sayT: 0 };
}
const cats = [makeCat(KITTENS[0], 160, 300, 0), makeCat(KITTENS[1], 205, 330, 1.7)];
const other = c => cats[c === cats[0] ? 1 : 0];
const DECAY = { hunger: .7, thirst: .9, energy: .45, fun: 1.1, potty: .6 }; // per second; 0 = urgent
const NEED_GOAL = { hunger: 'eat', thirst: 'drink', energy: 'sleep', fun: 'play', potty: 'litter' };
function pickGoal(n) {
  const low = Object.keys(NEED_GOAL).filter(k => n[k] < 35).sort((a, b) => n[a] - n[b]);
  return low.length ? NEED_GOAL[low[0]] : (Math.random() < .25 ? 'visit' : 'wander');
}
console.assert(pickGoal({ hunger: 10, thirst: 20, energy: 90, fun: 90, potty: 90 }) === 'eat' && pickGoal({ hunger: 90, thirst: 90, energy: 5, fun: 30, potty: 60 }) === 'sleep' && pickGoal({ hunger: 90, thirst: 90, energy: 90, fun: 90, potty: 10 }) === 'litter', 'pickGoal');

const GROOM = ['lickfur', 'lickbutt', 'washface'];
function goalTarget(c, g) {
  const side = c === cats[0] ? -6 : 8; // two kittens share a bowl side by side
  if (g === 'eat') return [SPOT.food[0] + side, SPOT.food[1]]; if (g === 'drink') return [SPOT.water[0] + side, SPOT.water[1]];
  if (g === 'litter') return LITTER;
  if (g === 'sleep') { const o = other(c), beds = [SPOT.sofa, CRADLE, SPOT.catbed].filter(b => !(o.goal === 'sleep' && o.target === b)); return beds[Math.floor(Math.random() * beds.length)]; }
  if (g === 'play') return [ball.x, ball.y]; if (g === 'visit') return [160,245];
  return [rand(110, 240), rand(200, 380)]; // open floor between sofa, desk and cat tree
}
const free = o => o.state === 'idle' || (o.state === 'act' && o.goal === 'wander');
function decide(c) {
  const o = other(c), g = pickGoal(c.needs);
  // nothing urgent: kittens mostly go and bother each other
  if ((g === 'wander' || g === 'visit') && free(o) && Math.random() < .5) {
    if (Math.random() < .5) { c.goal = 'chase'; c.t = rand(4, 7); o.goal = 'flee'; o.state = 'walk'; o.target = goalTarget(o, 'wander'); say(c, '冲！', 1.5); }
    else { c.goal = 'pounce'; o.goal = 'wait'; o.state = 'act'; o.pose = 'sit'; o.t = 8; }
    c.state = 'walk'; return;
  }
  c.goal = g; if (g === 'play') c.plays = 2; c.target = goalTarget(c, g); c.state = 'walk';
}
function startFight(a, b) {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1; b.x = a.x + (b.x - a.x) / d * 15; b.y = a.y + (b.y - a.y) / d * 15; // face off, nose to nose
  a.ang = Math.atan2(b.y - a.y, b.x - a.x); b.ang = a.ang + Math.PI;
  for (const x of [a, b]) { x.goal = 'fight'; x.state = 'act'; x.pose = 'fight'; x.t = rand(3, 5); x.needs.fun = Math.min(100, x.needs.fun + 25); }
  say(a, '喵呜！', 2); say(b, '嘶～', 2);
}
function groom(c, kind, sec) { c.state = 'act'; c.goal = 'groom'; c.pose = kind; c.t = sec; say(c, { lickfur: '舔舔毛', lickbutt: '舔屁屁', washface: '舔爪子洗脸' }[kind], 3); }
function arrive(c) {
  const g = c.goal, n = c.needs;
  if (g === 'chase' || g === 'pounce') return startFight(c, other(c));
  if (g === 'flee') { c.target = goalTarget(c, 'wander'); return; } // keep running
  if (g === 'eat' || g === 'drink') {
    const b = bowls[g === 'eat' ? 'food' : 'water']; c.ang = Math.PI / 2; // face the bowl
    if (b.level < 20) { say(c, '喵～' + (g === 'eat' ? '没饭了' : '没水了'), 3); c.state = 'act'; c.pose = 'sit'; c.t = 3; return; }
    b.level -= 25; c.state = 'act'; c.pose = g; c.t = 6; say(c, g === 'eat' ? '🐟 吧唧吧唧' : '💧 舔舔', 6); return;
  }
  if (g === 'litter') { const poop = Math.random() < .35; c.state = 'act'; c.pose = poop ? 'poop' : 'pee'; c.t = poop ? 7 : 5; n.potty = 100; c.ang = rand(0, 6.28); say(c, poop ? '💩 嗯……' : '💦 嘘嘘', 4); return; }
  if (g === 'sleep') { c.state = 'sleep'; c.t = rand(20, 32); c.pose = c.target === CRADLE || Math.random() < .5 ? 'curl' : 'sprawl'; return; }
  if (g === 'play') {
    n.fun = Math.min(100, n.fun + 25); const a = rand(0, 6.28); ball.vx = Math.cos(a) * 260; ball.vy = Math.sin(a) * 260;
    if (--c.plays > 0) { say(c, '扑！', 1); return; } c.state = 'act'; c.pose = 'sit'; c.t = 2; return;
  }
  if (g === 'visit') { say(c, '蹭蹭～'); n.fun = Math.min(100, n.fun + 10); c.state = 'act'; c.pose = 'stand'; c.t = 3; return; }
  if (Math.random() < .35) return groom(c, GROOM[Math.floor(Math.random() * 3)], rand(4, 7));
  c.state = 'act'; c.pose = ['sit', 'loaf', 'stand'][Math.floor(Math.random() * 3)]; c.t = rand(3, 7);
}
function walk(o, tx, ty, speed, dt) {
  const dx = tx - o.x, dy = ty - o.y, d = Math.hypot(dx, dy);
  if (d < 4) return true;
  o.ang = Math.atan2(dy, dx); const s = Math.min(d, speed * dt); o.x += dx / d * s; o.y += dy / d * s; return false;
}
const SPEED = { play: 150, chase: 130, flee: 120, pounce: 85 };

function update(dt, now) {
  for (const c of cats) {
    const n = c.needs, o = other(c);
    for (const k in DECAY) n[k] = Math.max(0, n[k] - DECAY[k] * dt * (c.state === 'sleep' && k === 'energy' ? 0 : 1));
    if (c.state === 'walk') {
      if (c.goal === 'play') c.target = [ball.x, ball.y];
      if (c.goal === 'chase' || c.goal === 'pounce') {
        c.target = [o.x, o.y];
        if (c.goal === 'chase' && (c.t -= dt) <= 0) { c.state = 'idle'; c.t = 1; if (o.goal === 'flee') { o.state = 'idle'; o.t = 1; } continue; } // gave up
      }
      c.fast = (SPEED[c.goal] || 55) > 90;
      const close = (c.goal === 'chase' || c.goal === 'pounce') && Math.hypot(o.x - c.x, o.y - c.y) < 16;
      if (close || walk(c, c.target[0], c.target[1], SPEED[c.goal] || 55, dt)) arrive(c);
    } else if (c.state === 'act' || c.state === 'sleep') {
      if (c.goal === 'eat' && c.sayT > 0) n.hunger = Math.min(100, n.hunger + 18 * dt);
      if (c.goal === 'drink' && c.sayT > 0) n.thirst = Math.min(100, n.thirst + 18 * dt);
      if (c.state === 'sleep') n.energy = Math.min(100, n.energy + 5 * dt);
      if ((c.t -= dt) <= 0) {
        // after a meal a kitten licks its paw and washes its face; after the litter box, a quick bum lick
        if (c.goal === 'eat' && c.pose === 'eat') groom(c, 'washface', 5);
        else if (c.goal === 'litter' && Math.random() < .6) groom(c, 'lickbutt', 3.5);
        else { c.state = 'idle'; c.pose = 'stand'; c.t = rand(.5, 2); }
      }
    } else if ((c.t -= dt) <= 0) decide(c);
  }

  ball.x += ball.vx * dt; ball.y += ball.vy * dt; ball.vx *= Math.pow(.25, dt); ball.vy *= Math.pow(.25, dt);
  if (ball.x < 30 || ball.x > 310) { ball.vx *= -1; ball.x = Math.max(30, Math.min(310, ball.x)); }
  if (ball.y < 60 || ball.y > 410) { ball.vy *= -1; ball.y = Math.max(60, Math.min(410, ball.y)); }

  for (const c of cats) c.sayT = Math.max(0, c.sayT - dt);
}

// ---------- kitten poses ----------
function poseCat(c, now) {
  const { body, torso, headG, legs, tailPivot } = c, t = now + c.phase * 1000;
  body.position.set(0, 0, 0); body.rotation.set(0, 0, 0); torso.scale.set(15, 8.5, 9.5); torso.position.y = 12;
  headG.position.set(15, 20, 0); headG.rotation.set(0, 0, 0); tailPivot.rotation.set(0, 0, Math.sin(t / 500) * .15);
  legs.forEach(l => { l.visible = true; l.rotation.set(0, 0, 0); l.scale.y = 1; l.position.y = 4; });
  const [fl, fr, bl, br] = legs, p = c.state === 'walk' ? 'walk' : c.state === 'idle' ? 'stand' : c.pose;
  const sit = () => { body.rotation.z = .5; body.position.y = 3; fl.rotation.z = fr.rotation.z = -.5; bl.visible = br.visible = false; headG.rotation.z = -.4; tailPivot.rotation.z = -.7; };
  if (p === 'walk') { const f = c.fast ? 45 : 80; legs.forEach((l, i) => l.rotation.z = Math.sin(t / f + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * .7);
    if (c.fast) { body.position.y = Math.abs(Math.sin(t / 90)) * 3; tailPivot.rotation.z = .7; } tailPivot.rotation.x = Math.sin(t / 120) * .5; }
  else if (p === 'stand') tailPivot.rotation.x = Math.sin(t / 400) * .5;
  else if (p === 'sit') sit();
  else if (p === 'loaf') { body.position.y = -5; legs.forEach(l => l.visible = false); headG.position.set(14, 17, 0); tailPivot.rotation.z = -.9; }
  else if (p === 'curl') { torso.scale.set(11, 6.5, 11); torso.position.y = 7; legs.forEach(l => l.visible = false); headG.position.set(7, 8, 6); headG.rotation.y = 1.1; headG.rotation.z = -.2; tailPivot.position.x = -9; tailPivot.rotation.set(0, -2.1, -1.1); }
  else if (p === 'sprawl') { const a = 1.45; body.rotation.x = a; body.position.set(0, 9 - 12 * Math.cos(a), -12 * Math.sin(a)); fl.rotation.z = fr.rotation.z = .8; bl.rotation.z = br.rotation.z = -.8; headG.rotation.x = -.4; tailPivot.rotation.z = -.4; }
  else if (p === 'eat' || p === 'drink') { body.rotation.z = -.2; headG.position.set(17, 11 + Math.sin(t / (p === 'eat' ? 140 : 90)) * 1.3, 0); headG.rotation.z = -.5; tailPivot.rotation.x = Math.sin(t / 300) * .3; }
  else if (p === 'pee') { body.rotation.z = .3; body.position.y = -2; bl.scale.y = br.scale.y = .5; bl.position.y = br.position.y = 2; tailPivot.rotation.z = .5; }
  else if (p === 'poop') { body.rotation.z = .5; body.position.set(Math.sin(t / 35) * .3, 0, 0); bl.visible = br.visible = false; tailPivot.rotation.z = 1; headG.rotation.z = -.3; }
  else if (p === 'fight') { body.position.y = Math.abs(Math.sin(t / 110)) * 7; body.rotation.x = Math.sin(t / 130) * .6; fl.rotation.z = fr.rotation.z = 1.3 + Math.sin(t / 70) * .6; headG.rotation.z = .25; tailPivot.rotation.z = .9; }
  else if (p === 'lickfur') { sit(); headG.position.set(4, 18, 6); headG.rotation.set(0, 2.2, -.5 + Math.sin(t / 160) * .15); } // head turned back to the flank
  else if (p === 'lickbutt') { body.rotation.z = .35; body.position.y = 1; fl.rotation.z = fr.rotation.z = -.35; br.rotation.x = -1.3; br.position.y = 9; bl.visible = false; // one hind leg up in the air
    headG.position.set(-6, 9, 6); headG.rotation.set(0, 2.6, -.6 + Math.sin(t / 150) * .15); tailPivot.rotation.z = -.8; }
  else if (p === 'washface') { sit(); const lick = Math.sin(t / 420) > 0; // alternate: lick the paw, then rub it over the face
    fl.rotation.z = -.5 - 1.4; fl.position.y = 4 + (lick ? 6 : 9 + Math.sin(t / 90) * 2.5); fl.position.x = 9 + (lick ? 2 : 3); headG.rotation.z = lick ? -.1 : -.5 + Math.sin(t / 90) * .25; headG.rotation.y = lick ? 0 : .35; }
}


export {cats,room as kittens}
export function interact(key){
  const c=cats.find(c=>c.k.name===key)
  if(c && c.state!=='sleep'){c.state='act';c.goal='pet';c.pose='sit';c.t=2.5;c.needs.fun=Math.min(100,c.needs.fun+15)}
  if(bowls[key])bowls[key].level=100
  if(key==='yarn'){const a=rand(0,Math.PI*2);ball.vx=Math.cos(a)*170;ball.vy=Math.sin(a)*170;for(const c of cats)if(c.state!=='sleep'){c.state='walk';c.goal='play';c.plays=3}}
}
export function stepKittens(dt,now,yarn){
 update(dt,now)
 for(const c of cats){
   const near=p=>Math.hypot(c.x-p[0],c.y-p[1])<10
   const h=c.state==='sleep'?(near(SPOT.sofa)?.43:near(CRADLE)?.9:near(SPOT.catbed)?.12:0):0
   c.g.position.set((c.x-165)*.020,h,(c.y-190)*.020)
   c.g.rotation.y=-c.ang
   poseCat(c,now)
 }
 if(yarn)yarn.position.set((ball.x-165)*.020,.12,(ball.y-190)*.020)
}
stepKittens(0,0,null)
