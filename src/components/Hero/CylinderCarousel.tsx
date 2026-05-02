'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { scrollState } from '@/lib/scroll'
import { PRELOADER_DONE_EVENT } from '@/components/Preloader/Preloader'

// ─── CONTROLS ────────────────────────────────────────────────────────────────
const IMAGES = Array(8).fill('/carousel/test-image.png')

const RADIUS        = 4   // cylinder size — smaller = tighter curve
const IMG_WIDTH     = 2.9   // arc length per image (~333px wide at 1440 viewport)
const IMG_HEIGHT    = 1.34   // image height (~253px tall at 1440 viewport)
const CURVE_SEGMENTS = 20   // smoothness of the bend (higher = smoother)
const TILT_X        = 0.25 // tilt toward viewer (negative = top leans forward)
const TILT_Z        = 0.05   // left/right lean
const ROTATION_Y    = 0.0   // starting Y rotation offset
const SPIN_SPEED    = 0.25  // auto-rotate speed (0 to stop)
const SCROLL_SPIN   = 0.08  // how much scroll velocity nudges the spin (higher = more reactive)
const SCROLL_DAMP   = 0.08  // eased scroll velocity follow (lower = lazier)
const POP_DISTANCE  = 0.25   // how far hovered image pops out
const CAMERA_X      = 0     // camera left/right
const CAMERA_Y      = 0.3   // camera height
const CAMERA_Z      = 6.5   // camera distance (further = zoom out)
const CAMERA_FOV    = 65    // field of view (wider = more images visible)
const CYLINDER_Y    = 0.8   // vertical offset of the cylinder (positive = up)

// Intro animation
const INTRO_DURATION    = 3.5  // seconds
const INTRO_START_SCALE = 2.8  // starting scale (cylinder expanded — bigger circle + gap)
const INTRO_SPIN_MULT   = 30   // spin speed multiplier at start (more rotations before settling)
const INTRO_ARC_MULT    = 0.45 // image arc width at intro start (0.45 = 45% of final, bigger gap)

// Mouse parallax (after intro)
const PARALLAX_X = 0.08 // tilt strength on X axis (vertical mouse movement)
const PARALLAX_Y = 0.32 // tilt strength on Y axis (horizontal mouse movement)
const PARALLAX_EASE = 0.05 // smoothing (lower = lazier follow)
// ─────────────────────────────────────────────────────────────────────────────

const COUNT = IMAGES.length
const IMG_ARC = IMG_WIDTH / RADIUS   // angular span each image occupies on the cylinder

type IntroState = { scale: number; spinMult: number; arcMult: number }

type ImageProps = {
  texture: THREE.Texture
  angle: number
  isHovered: boolean
  isGreyed: boolean
  intro: React.RefObject<IntroState>
  onPointerOver: () => void
  onPointerOut: () => void
}

function CarouselImage({ texture, angle, isHovered, isGreyed, intro, onPointerOver, onPointerOut }: ImageProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offsetRef = useRef(0)
  const lastArcRef = useRef(-1)

  useFrame(() => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshBasicMaterial

    const targetOffset = isHovered ? POP_DISTANCE : 0
    offsetRef.current = THREE.MathUtils.lerp(offsetRef.current, targetOffset, 0.09)

    // Pop out along radial direction (cylinder segment is anchored at origin)
    meshRef.current.position.x = Math.sin(angle) * offsetRef.current
    meshRef.current.position.z = Math.cos(angle) * offsetRef.current

    // Dynamic arc: narrower at intro start (bigger gaps), grows to full width
    const dynamicArc = IMG_ARC * intro.current.arcMult
    if (Math.abs(dynamicArc - lastArcRef.current) > 0.002) {
      meshRef.current.geometry.dispose()
      meshRef.current.geometry = new THREE.CylinderGeometry(
        RADIUS, RADIUS, IMG_HEIGHT, CURVE_SEGMENTS, 1, true,
        angle - dynamicArc / 2, dynamicArc
      )
      lastArcRef.current = dynamicArc
    }

    const targetGrey = isGreyed ? 0.25 : 1.0
    mat.color.r = THREE.MathUtils.lerp(mat.color.r, targetGrey, 0.09)
    mat.color.g = THREE.MathUtils.lerp(mat.color.g, targetGrey, 0.09)
    mat.color.b = THREE.MathUtils.lerp(mat.color.b, targetGrey, 0.09)
    mat.opacity  = THREE.MathUtils.lerp(mat.opacity, isGreyed ? 0.85 : 1.0, 0.09)
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); onPointerOver() }}
      onPointerOut={onPointerOut}
    >
      <cylinderGeometry args={[RADIUS, RADIUS, IMG_HEIGHT, CURVE_SEGMENTS, 1, true, angle - IMG_ARC / 2, IMG_ARC]} />
      <meshBasicMaterial map={texture} color="#ffffff" transparent opacity={1} side={THREE.DoubleSide} />
    </mesh>
  )
}

type CarouselProps = { onHoverChange?: (hovered: boolean) => void }

function Carousel({ onHoverChange }: CarouselProps) {
  const groupRef = useRef<THREE.Group>(null)
  const outerRef = useRef<THREE.Group>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const textures = useTexture(IMAGES)
  const unhoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intro = useRef<IntroState>({ scale: INTRO_START_SCALE, spinMult: INTRO_SPIN_MULT, arcMult: INTRO_ARC_MULT })
  const parallax = useRef({ x: 0, y: 0 })
  const scrollBoost = useRef(0)

  useEffect(() => {
    let tween: gsap.core.Tween | null = null
    const start = () => {
      tween = gsap.to(intro.current, {
        scale: 1,
        spinMult: 1,
        arcMult: 1,
        duration: INTRO_DURATION,
        ease: 'power3.out',
      })
    }
    window.addEventListener(PRELOADER_DONE_EVENT, start, { once: true })
    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, start)
      tween?.kill()
    }
  }, [])

  useEffect(() => {
    onHoverChange?.(hoveredIndex !== null)
  }, [hoveredIndex, onHoverChange])

  const handleOver = (i: number) => {
    if (unhoverTimer.current) clearTimeout(unhoverTimer.current)
    setHoveredIndex(i)
  }

  const handleOut = () => {
    unhoverTimer.current = setTimeout(() => setHoveredIndex(null), 120)
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.scale.setScalar(intro.current.scale)

    const targetBoost = Math.abs(scrollState.velocity) * SCROLL_SPIN
    scrollBoost.current = THREE.MathUtils.lerp(scrollBoost.current, targetBoost, SCROLL_DAMP)

    const baseSpin = hoveredIndex !== null ? 0 : SPIN_SPEED
    groupRef.current.rotation.y += delta * (baseSpin + scrollBoost.current) * intro.current.spinMult

    // Mouse parallax — translates the whole thing, tilt stays fixed
    if (outerRef.current) {
      const introDone = intro.current.arcMult > 0.95
      const targetX = introDone ? state.pointer.x * PARALLAX_Y : 0
      const targetY = introDone ? state.pointer.y * PARALLAX_X : 0
      parallax.current.x = THREE.MathUtils.lerp(parallax.current.x, targetX, PARALLAX_EASE)
      parallax.current.y = THREE.MathUtils.lerp(parallax.current.y, targetY, PARALLAX_EASE)
      outerRef.current.position.x = parallax.current.x
      outerRef.current.position.y = CYLINDER_Y + parallax.current.y
    }
  })

  return (
    // Outer group: fixed tilt + mouse parallax
    <group ref={outerRef} rotation={[TILT_X, 0, TILT_Z]}>
      {/* Inner group: only the spin happens here */}
      <group ref={groupRef} rotation={[0, ROTATION_Y, 0]}>
        {IMAGES.map((_, i) => {
          const angle = (i / COUNT) * Math.PI * 2
          const texture = Array.isArray(textures) ? textures[i] : textures
          return (
            <CarouselImage
              key={i}
              texture={texture}
              angle={angle}
              intro={intro}
              isHovered={hoveredIndex === i}
              isGreyed={hoveredIndex !== null && hoveredIndex !== i}
              onPointerOver={() => handleOver(i)}
              onPointerOut={handleOut}
            />
          )
        })}
      </group>
    </group>
  )
}

export default function CylinderCarousel({ onHoverChange }: { onHoverChange?: (hovered: boolean) => void }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', zIndex: 10 }}>
      <Canvas
        camera={{ position: [CAMERA_X, CAMERA_Y, CAMERA_Z], fov: CAMERA_FOV }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Carousel onHoverChange={onHoverChange} />
      </Canvas>
    </div>
  )
}
