"use client"

import { useEffect, useRef, useState } from "react"
import TargetCursor from "@/components/TargetCursor/TargetCursor"
import ParallaxImage from "@/components/ParallaxImage/ParallaxImage"

type ProjectInfo = { copy: string; tags: string[] }
const PROJECT_INFO: Record<string, ProjectInfo> = {
    gucci: {
        copy: "A FASHION-FORWARD CAMPAIGN CELEBRATING SELF-EXPRESSION THROUGH WALKING, BLENDING ICONIC HOUSE CODES WITH STREET CULTURE.",
        tags: ["FASHION", "BRAND FILM"],
    },
    nike: {
        copy: "A BOLD MANIFESTO PROVING THAT NO LIMIT IS FIXED — TURNING ATHLETES' DOUBT INTO PROOF THROUGH UNFLINCHING STORYTELLING.",
        tags: ["SPORTS", "VIDEO PRODUCTION & MEDIA"],
    },
    snickers: {
        copy: "A WITTY INTEGRATED CAMPAIGN LEANING INTO THE INSIGHT THAT HUNGER CHANGES WHO YOU ARE — BUILT FOR SOCIAL AND OUT-OF-HOME.",
        tags: ["FMCG", "INTEGRATED CAMPAIGN"],
    },
    mcdonalds: {
        copy: "AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.",
        tags: ["F&B", "DIGITAL & SOCIAL"],
    },
}

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null)
    const gucciRef = useRef<HTMLVideoElement>(null)
    const nikeRef = useRef<HTMLVideoElement>(null)

    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [cursorActive, setCursorActive] = useState(false)
    const cursorStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const mousePosRef = useRef<{ x: number; y: number } | null>(null)
    const hideAllRef = useRef<() => void>(() => {})
    const showVideoRef = useRef<(id: string) => void>(() => {})

    const videoMap: Record<string, React.RefObject<HTMLVideoElement | null>> = {
        gucci: gucciRef,
        nike: nikeRef,
    }

    const showVideo = (id: string) => {
        console.log("[2] mouse enter project", id)
        setHoveredId(id)
        Object.entries(videoMap).forEach(([key, ref]) => {
            const vid = ref.current
            if (!vid) return
            if (key === id) {
                vid.style.opacity = "1"
                vid.currentTime = 0
                vid.play().catch(() => {})
            } else {
                vid.style.opacity = "0"
                vid.pause()
            }
        })
    }
    showVideoRef.current = showVideo

    const hideAll = () => {
        setHoveredId(null)
        Object.values(videoMap).forEach((ref) => {
            const v = ref.current
            if (!v) return
            v.style.opacity = "0"
            v.pause()
        })
    }
    hideAllRef.current = hideAll

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY }
        }

        let lastProject: Element | null = null

        const check = () => {
            const section = sectionRef.current
            const pos = mousePosRef.current
            if (!section || !pos) return
            const el = document.elementFromPoint(pos.x, pos.y)
            const inside = !!el && section.contains(el)
            setCursorActive((prev) => {
                if (inside && !prev) {
                    cursorStartRef.current = { x: pos.x, y: pos.y }
                    return true
                }
                if (!inside && prev) {
                    hideAllRef.current()
                    return false
                }
                return prev
            })

            const project = el?.closest(".project") as HTMLElement | null
            if (project !== lastProject) {
                console.log("[1.5] scroll changed project under cursor", {
                    from: (lastProject as HTMLElement | null)?.id,
                    to: project?.id,
                })
                lastProject = project
                if (project?.id) {
                    showVideoRef.current(project.id)
                } else {
                    hideAllRef.current()
                }
                if (el) {
                    el.dispatchEvent(
                        new MouseEvent("mouseover", {
                            bubbles: true,
                            clientX: pos.x,
                            clientY: pos.y,
                        })
                    )
                }
            }
        }

        window.addEventListener("mousemove", onMove, { passive: true })
        window.addEventListener("scroll", check, { passive: true })
        return () => {
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("scroll", check)
        }
    }, [])

    const videoStyle: React.CSSProperties = {
        opacity: 0,
        transition: "opacity 0.4s ease",
    }

    const imgStyle = (ownId: string): React.CSSProperties => ({
        opacity: hoveredId && hoveredId !== ownId ? 0 : 1,
        transition: "opacity 0.3s ease",
    })

    return (
        <section
            ref={sectionRef}
            className="projects"
            onMouseEnter={(e) => {
                console.log("[1] mouse enter section", { x: e.clientX, y: e.clientY })
                cursorStartRef.current = { x: e.clientX, y: e.clientY }
                setCursorActive(true)
            }}
            onMouseLeave={() => {
                setCursorActive(false)
                hideAll()
            }}
        >
            {cursorActive && (
                <TargetCursor
                    spinDuration={5}
                    hideDefaultCursor
                    parallaxOn
                    hoverDuration={0.1}
                    initialX={cursorStartRef.current.x}
                    initialY={cursorStartRef.current.y}
                />
            )}
            <h2 className="h1 dark">FEATURED <span className="text-highlight">PROJECTS</span></h2>
            <div className="wrapper">
                <div className="video-bg">
                    <div className="video-wrapper">
                        <video
                            ref={gucciRef}
                            data-gucci
                            loop
                            muted
                            playsInline
                            preload="auto"
                            style={videoStyle}
                            src="https://streamable.com/l/ulxzt8/mp4.mp4"
                        ></video>

                        <video
                            ref={nikeRef}
                            data-nike
                            loop
                            muted
                            playsInline
                            preload="auto"
                            style={videoStyle}
                            src="https://streamable.com/l/xx3sll/mp4-high.mp4"
                        ></video>
                    </div>

                </div>
                <div className="project-grid" onMouseLeave={hideAll}>
                    <div
                        id="gucci"
                        className="project"
                        onMouseEnter={() => showVideo("gucci")}
                    >
                        <div className="title-wrapper">
                            <p className="body dark">GUCCI WALK YOUR WAY</p>

                            <p className="body dark">2025</p>
                        </div>

                        <div className="project-image cursor-target">
                            <ParallaxImage src="/gucci.png" alt="" style={imgStyle("gucci")} />
                        </div>
                    </div>

                    <div className="empty-div"></div>

                    <div
                        id="nike"
                        className="project"
                        onMouseEnter={() => showVideo("nike")}
                    >
                        <div className="title-wrapper">
                            <p className="body dark">NIKE EVERYTHING IS POSSIBLE</p>

                            <p className="body dark">2025</p>
                        </div>

                        <div className="project-image cursor-target">
                            <ParallaxImage src="/nikethumb.png" alt="" style={imgStyle("nike")} />
                        </div>
                    </div>

                    <div
                        id="snickers"
                        className="project"
                        onMouseEnter={() => showVideo("snickers")}
                    >
                        <div className="title-wrapper">
                            <p className="body dark">SNICKERS YOU&apos;RE NOT YOU WHEN YOU&apos;RE HUNGRY</p>

                            <p className="body dark">2025</p>
                        </div>

                        <div className="project-image cursor-target">
                            <ParallaxImage src="/snickers.png" alt="" style={imgStyle("snickers")} />
                        </div>
                    </div>

                    <div
                        id="mcdonalds"
                        className="project"
                        onMouseEnter={() => showVideo("mcdonalds")}
                    >
                        <div className="title-wrapper">
                            <p className="body dark">MCDONALD&apos;S I&apos;M LOVIN&apos; IT</p>

                            <p className="body dark">2025</p>
                        </div>

                        <div className="project-image cursor-target">
                            <ParallaxImage src="/mcdonalds.png" alt="" style={imgStyle("mcdonalds")} />
                        </div>
                    </div>

                    <div className={`project-info${hoveredId ? ' is-visible' : ''}`} aria-hidden="true">
                        {hoveredId && PROJECT_INFO[hoveredId] && (
                            <>
                                <p className=" body project-info__label">PROJECT OVERVIEW</p>
                                <p className="body project-info__copy">
                                    {PROJECT_INFO[hoveredId].copy}
                                </p>
                                <ul className="project-info__tags">
                                    {PROJECT_INFO[hoveredId].tags.map((tag) => (
                                        <li key={tag} className="project-info__tag">{tag}</li>
                                    ))}
                                </ul>
                                <a href="#" className="custom-button project-info__cta">
                                    <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                                        <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                                        <circle className="ring ring--inner" cx="12" cy="12" r="3" />
                                    </svg>
                                    <span>OUR WORK</span>
                                </a>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </section>
    )
}
