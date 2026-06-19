"use client"

import { useEffect, useRef, useState } from "react"
import TargetCursor from "@/components/TargetCursor/TargetCursor"
import ParallaxImage from "@/components/ParallaxImage/ParallaxImage"

export type ProjectItem = {
    key: string
    title: string
    year: string
    thumbnail: string
    hoverVideoUrl?: string
    copy: string
    tags: string[]
}

const DEFAULT_PROJECTS: ProjectItem[] = [
    {
        key: "gucci",
        title: "GUCCI WALK YOUR WAY",
        year: "2025",
        thumbnail: "/gucci.png",
        hoverVideoUrl: "https://streamable.com/l/ulxzt8/mp4.mp4",
        copy: "A FASHION-FORWARD CAMPAIGN CELEBRATING SELF-EXPRESSION THROUGH WALKING, BLENDING ICONIC HOUSE CODES WITH STREET CULTURE.",
        tags: ["FASHION", "BRAND FILM"],
    },
    {
        key: "nike",
        title: "NIKE EVERYTHING IS POSSIBLE",
        year: "2025",
        thumbnail: "/nikethumb.png",
        hoverVideoUrl: "https://streamable.com/l/xx3sll/mp4-high.mp4",
        copy: "A BOLD MANIFESTO PROVING THAT NO LIMIT IS FIXED — TURNING ATHLETES' DOUBT INTO PROOF THROUGH UNFLINCHING STORYTELLING.",
        tags: ["SPORTS", "VIDEO PRODUCTION & MEDIA"],
    },
    {
        key: "snickers",
        title: "SNICKERS YOU'RE NOT YOU WHEN YOU'RE HUNGRY",
        year: "2025",
        thumbnail: "/snickers.png",
        copy: "A WITTY INTEGRATED CAMPAIGN LEANING INTO THE INSIGHT THAT HUNGER CHANGES WHO YOU ARE — BUILT FOR SOCIAL AND OUT-OF-HOME.",
        tags: ["FMCG", "INTEGRATED CAMPAIGN"],
    },
    {
        key: "mcdonalds",
        title: "MCDONALD'S I'M LOVIN' IT",
        year: "2025",
        thumbnail: "/mcdonalds.png",
        copy: "AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.",
        tags: ["F&B", "DIGITAL & SOCIAL"],
    },
]

export type ProjectsProps = {
    headingBefore?: string
    headingHighlight?: string
    items?: ProjectItem[]
}

export default function Projects({
    headingBefore = "FEATURED",
    headingHighlight = "PROJECTS",
    items,
}: ProjectsProps = {}) {
    const projects = items?.length ? items : DEFAULT_PROJECTS
    const byKey: Record<string, ProjectItem> = Object.fromEntries(projects.map((p) => [p.key, p]))
    const get = (k: string) => byKey[k] ?? DEFAULT_PROJECTS.find((p) => p.key === k)!
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
            <h2 className="h1 amplitude dark">{headingBefore} <span className="text-highlight">{headingHighlight}</span></h2>
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
                            src={get("gucci").hoverVideoUrl}
                        ></video>

                        <video
                            ref={nikeRef}
                            data-nike
                            loop
                            muted
                            playsInline
                            preload="auto"
                            style={videoStyle}
                            src={get("nike").hoverVideoUrl}
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
                            <p className="body dark">{get("gucci").title}</p>

                            <p className="body dark">{get("gucci").year}</p>
                        </div>

                        <div className="project-image cursor-target">
                            <ParallaxImage src={get("gucci").thumbnail} alt="" style={imgStyle("gucci")} />
                        </div>
                    </div>

                    <div className="empty-div"></div>

                    <div
                        id="nike"
                        className="project"
                        onMouseEnter={() => showVideo("nike")}
                    >
                        <div className="title-wrapper">
                            <p className="body dark">{get("nike").title}</p>

                            <p className="body dark">{get("nike").year}</p>
                        </div>

                        <div className="project-image cursor-target">
                            <ParallaxImage src={get("nike").thumbnail} alt="" style={imgStyle("nike")} />
                        </div>
                    </div>

                    <div
                        id="snickers"
                        className="project"
                        onMouseEnter={() => showVideo("snickers")}
                    >
                        <div className="title-wrapper">
                            <p className="body dark">{get("snickers").title}</p>

                            <p className="body dark">{get("snickers").year}</p>
                        </div>

                        <div className="project-image cursor-target">
                            <ParallaxImage src={get("snickers").thumbnail} alt="" style={imgStyle("snickers")} />
                        </div>
                    </div>

                    <div
                        id="mcdonalds"
                        className="project"
                        onMouseEnter={() => showVideo("mcdonalds")}
                    >
                        <div className="title-wrapper">
                            <p className="body dark">{get("mcdonalds").title}</p>

                            <p className="body dark">{get("mcdonalds").year}</p>
                        </div>

                        <div className="project-image cursor-target">
                            <ParallaxImage src={get("mcdonalds").thumbnail} alt="" style={imgStyle("mcdonalds")} />
                        </div>
                    </div>

                    <div className={`project-info${hoveredId ? ' is-visible' : ''}`} aria-hidden="true">
                        {hoveredId && byKey[hoveredId] && (
                            <>
                                <p className=" body project-info__label">PROJECT OVERVIEW</p>
                                <p className="body project-info__copy">
                                    {byKey[hoveredId].copy}
                                </p>
                                <ul className="project-info__tags">
                                    {byKey[hoveredId].tags.map((tag) => (
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
