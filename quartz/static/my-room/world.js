import * as T from './vendor/three-room.js'
import { MeshoptDecoder } from './vendor/meshopt.js'
import { kittens, interact, stepKittens } from './kittens.js'

const canvas = document.getElementById('world')
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const vec = (x,y,z) => new T.Vector3(x,y,z)
const home = vec(0,.70,.60)
const scene = new T.Scene()
scene.background = new T.Color(0xe4edf2)
const camera = new T.PerspectiveCamera(35,1,.035,60)
const ray = new T.Raycaster()
let model, renderer, controls, travel, selected = ''
const coffeeTime = {value: 2}
const center = new T.Vector3()
const delta = new T.Vector3()
// Each point is in metres in the exported room, with the open sides facing the visitor.
const views = {
  carpet: [vec(-1.55,.30,1.28), vec(1.76,1.44,1.58)],
  shelf: [vec(-2.16,.95,-.26), vec(1.85,.55,1.26)],
  sofa: [vec(-1.68,.43,1.22), vec(1.36,.68,1.22)],
  chair: [vec(1.02,.56,.08), vec(1.01,.51,1.03)],
  laptop: [vec(1.26,.69,-.57), vec(.91,.72,2.15)],
  monitor: [vec(1.29,1.11,-.76), vec(.45,.21,1.16)],
  mac: [vec(1.393,.804,-.633), vec(.045,.135,.29)],
  notebook: [vec(.81,.80,-.45), vec(.30,.55,.63)],
  kettle: [vec(1.77,.884,-.698), vec(-.075,.136,.424)],
  keyboard: [vec(1.18,.774,-.455), vec(.026,.24,.235)],
  coffee: [vec(1.555,.812,-.401), vec(.11,.101,.23)],
  book: [vec(-2.22,1.76,.115), vec(.51,.48,.25)],
  tree: [vec(1.92,.65,1.72), vec(.85,.64,1.31)],
  cradle: [vec(1.48,.72,1.32), vec(.67,.51,1.11)],
  plant: [vec(-2.27,1.28,2.26), vec(1.10,.16,.42)],
  narcissus: [vec(-2.18,1.95,-.55), vec(.67,.265,.48)],
  food: [vec(.87,.09,2.24),vec(.40,.52,.76)],
  water: [vec(1.16,.09,2.24),vec(.40,.52,.76)],
  yarn: [null,vec(.44,.43,.77)],
  小橘子: [null,vec(.54,.31,.74)],
  姜姜: [null,vec(.54,.31,.74)]
}
// The GLB stores these joined meshes in room metres, so the weave keeps its scale across seams.
function finishSurface(material){
  const glass=material.name==='Borosilicate wall'
  if(glass || material.name==='Clear kettle water'){
    // The window is modelled into the room, so it has no environment map to reflect.
    if(glass)material.depthWrite=false
    else material.thickness=.028
    material.customProgramCacheKey=()=>glass ? 'carafe' : 'clear-water'
    material.onBeforeCompile=shader=>{
      shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>', `
        vec3 eye = normalize(vViewPosition);
        float grazing = pow(1.0 - abs(dot(normal, eye)), 4.0);
        vec3 ray = inverseTransformDirection(reflect(-eye, normal), viewMatrix);
        vec2 pane = ray.xy / max(0.01, -ray.z);
        vec2 edges = abs(pane - vec2(-0.55, 0.47));
        float windowLight = (1.0 - smoothstep(0.45, 0.55, edges.x))
          * (1.0 - smoothstep(0.40, 0.48, edges.y)) * step(0.0, -ray.z);
        windowLight *= smoothstep(0.014, 0.033, edges.x);
        ${glass ? `
          float bounce = smoothstep(0.08, 0.18, ray.z) * exp(-pow(abs(ray.x + 0.74) / 0.115, 2.0));
          windowLight = max(windowLight, 0.78 * bounce);
          outgoingLight = mix(vec3(0.14, 0.18, 0.17), vec3(1.36, 1.43, 1.40), windowLight);
          diffuseColor.a = 0.012 + 0.30 * grazing + windowLight * (0.105 + 0.45 * grazing);
        ` : `
          outgoingLight += vec3(0.84, 0.91, 0.93) * windowLight * (0.024 + 0.37 * grazing);
        `}
        #include <opaque_fragment>`)
    }
    return
  }
  const coffee=material.name==='Coffee surface'
  const carpet=material.name.startsWith('Toli ')
  if(!coffee && !carpet && !['Heathered moss wool','Tobacco microsuede'].includes(material.name))return
  const suede=material.name==='Tobacco microsuede'
  material.customProgramCacheKey=()=>coffee ? 'coffee' : carpet ? 'carpet' : suede ? 'suede' : 'wool'
  material.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 surfacePoint;\n'+shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nsurfacePoint = position;')
    shader.fragmentShader='varying vec3 surfacePoint;\nuniform float coffeeTime;\n'+shader.fragmentShader
    shader.uniforms.coffeeTime=coffeeTime
    const detail=coffee ? `
      float radius = length(surfacePoint.xz - vec2(1.545, -0.40125));
      float wave = sin(radius * 310.0 - coffeeTime * 13.0);
      float front = (radius - coffeeTime * 0.12) / 0.022;
      diffuseColor.rgb += vec3(0.11, 0.067, 0.029) * (0.5 + 0.5 * wave)
        * exp(-front * front) * smoothstep(0.0, 0.09, coffeeTime);` : `
      vec2 threads = vec2(surfacePoint.x + surfacePoint.y * 0.73,
                          surfacePoint.z + surfacePoint.y * 0.61) * ${carpet ? '1100.0' : '1700.0'};
      vec2 visible = 1.0 - smoothstep(vec2(0.55), vec2(2.8), fwidth(threads));
      vec2 fibres = cos(threads) * visible;
      diffuseColor.rgb *= 1.0 + dot(fibres, vec2(0.11, 0.07));`
    // Suede catches diffuse light along the edges of its folds.
    if(suede)shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',
      `#include <normal_fragment_maps>
       float nap = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 2.0);
       diffuseColor.rgb += vec3(0.031, 0.026, 0.023) * nap;`)
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',
      '#include <color_fragment>\n'+detail)
  }
}
function touch(key){
  interact(key)
  if(key==='coffee' && !reduced.matches)coffeeTime.value=0
}
function subject(key){
  return key==='yarn' ? model.getObjectByName(key) : kittens.getObjectByName(key)
}
function target(key){
  if(!key)return home
  if(views[key][0])return views[key][0]
  subject(key).getWorldPosition(center)
  if(key!=='yarn')center.y+=.12
  return center
}
function focus(key='',instant=false){
  selected=key
  const at=target(key).clone()
  const offset=key ? views[key][1].clone().multiplyScalar(Math.max(1,.78/camera.aspect))
    : vec(3.65,3.41,5.78).multiplyScalar(Math.max(1.03,1.60/camera.aspect))
  travel={at,eye:at.clone().add(offset)}
  if(instant || reduced.matches){
    camera.position.copy(travel.eye);controls.target.copy(at);controls.update();travel=null
  }
}
function resize(){
  renderer.setSize(canvas.clientWidth,canvas.clientHeight,false)
  camera.aspect=canvas.clientWidth/canvas.clientHeight;camera.updateProjectionMatrix()
  if(model)focus(selected,true)
}
function hitKey(e){
  const r=canvas.getBoundingClientRect()
  ray.setFromCamera({x:(e.clientX-r.left)*2/r.width-1,y:1-(e.clientY-r.top)*2/r.height},camera)
  const hit=ray.intersectObjects([model,kittens],true)[0]
  for(let n=hit?.object;n;n=n.parent)if(Object.hasOwn(views,n.name))return n.name
  return ''
}
function input(){
  const pointers=new Set();let down
  canvas.addEventListener('pointerdown',e=>{
    pointers.add(e.pointerId);down=pointers.size===1?[e.clientX,e.clientY]:null
  })
  canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);down=null})
  canvas.addEventListener('pointerup',e=>{
    pointers.delete(e.pointerId)
    if(down && Math.hypot(e.clientX-down[0],e.clientY-down[1])<6){
      const key=hitKey(e);touch(key);focus(key==='carpet' && selected===key ? '' : key)
    }
    down=null
  })
  canvas.addEventListener('keydown',e=>{
    if(e.key==='Escape'||e.key==='Home'){focus();return}
    if(['[',']'].includes(e.key)){
      const keys=Object.keys(views),i=keys.indexOf(selected)
      focus(keys[(i+(e.key===']'?1:-1)+keys.length)%keys.length]);return
    }
    if(e.key==='Enter'){touch(selected);return}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key))return
    e.preventDefault();travel=null
    const offset=camera.position.clone().sub(controls.target)
    if(e.key.startsWith('Arrow')){
      offset.setFromSphericalCoords(offset.length(),controls.getPolarAngle()+(e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0),controls.getAzimuthalAngle()+(e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0))
    }else offset.setLength(Math.max(.35,Math.min(38,offset.length()*(e.key==='-'?1.12:.89))))
    camera.position.copy(controls.target).add(offset);controls.update()
  })
}
async function start(){
  renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'})
  renderer.transmissionResolutionScale=.5
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))
  renderer.toneMapping=T.ACESFilmicToneMapping
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap
  scene.add(new T.HemisphereLight(0xd9ebff,0xbeb8af,1.65))
  const sun=new T.DirectionalLight(0xfff2db,3.12)
  sun.position.set(-1.10,2.52,-4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048)
  Object.assign(sun.shadow.camera,{left:-3.9,right:3.9,top:3.9,bottom:-3.9,near:.1,far:12})
  sun.shadow.normalBias=.006;sun.shadow.bias=-.00018;scene.add(sun)
  const fill=new T.DirectionalLight(0xedf4ff,.92);fill.position.set(2,3,3);scene.add(fill)
  controls=new T.OrbitControls(camera,canvas);controls.enablePan=false
  controls.minDistance=.35;controls.maxDistance=38;controls.minPolarAngle=.16;controls.maxPolarAngle=1.49
  controls.minAzimuthAngle=-.67;controls.maxAzimuthAngle=1.48
  controls.addEventListener('start',()=>{travel=null})
  resize()
  const {scene:room}=await new T.GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('./whole-room.glb?v=madder-wool')
  model=room;scene.add(model,kittens);kittens.scale.set(.6,.67,.6)
  const materials=new Set()
  model.traverse(o=>{if(o.isMesh){o.castShadow=!['Hazy morning sky','Clear kettle water','Borosilicate wall'].includes(o.material.name);o.receiveShadow=true;materials.add(o.material)}})
  for(const material of materials)finishSurface(material)
  for(const name of Object.keys(views))if(!model.getObjectByName(name)&&!kittens.getObjectByName(name))throw Error('Missing room object '+name)
  const yarn=model.getObjectByName('yarn')
  const localBall=new T.Group()
  const scale=vec(.6,.67,.6)
  focus('',true);input();new ResizeObserver(resize).observe(canvas)
  let last=performance.now()
  renderer.setAnimationLoop(now=>{
    const dt=Math.min(.09,(now-last)/1000);last=now
    if(document.hidden)return
    coffeeTime.value=reduced.matches ? 2 : Math.min(2,coffeeTime.value+dt)
    stepKittens(dt,now,localBall);yarn.position.copy(localBall.position).multiply(scale)
    if(selected && !views[selected][0]){
      const at=target(selected)
      if(travel){travel.eye.add(delta.subVectors(at,travel.at));travel.at.copy(at)}
      else{
        delta.subVectors(at,controls.target).multiplyScalar(1-Math.exp(-dt*5))
        camera.position.add(delta);controls.target.add(delta)
      }
    }
    if(travel){
      const k=1-Math.exp(-dt*9)
      controls.target.lerp(travel.at,k);camera.position.lerp(travel.eye,k)
      if(camera.position.distanceToSquared(travel.eye)<.00001){camera.position.copy(travel.eye);controls.target.copy(travel.at);travel=null}
    }
    controls.update();renderer.render(scene,camera)
  })
}
start().catch(error=>{console.error(error);renderer?.dispose();canvas.setAttribute('aria-label','Clemmie 的房间全景')})
