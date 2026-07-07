"use client"

import { useEffect, useRef, useState } from "react"
import TargetCursor from "@/components/TargetCursor/TargetCursor"
import ParallaxImage from "@/components/ParallaxImage/ParallaxImage"
import { useScrollJoin } from "@/lib/useScrollJoin"

export type ProjectItem = {
    key: string
    title: string
    year: string
    thumbnail: string
    hoverVideoUrl?: string
    copy: string
    tags: string[]
    link?: string
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
        // 5th project — sits in the former empty middle slot of row 1.
        // Replace the thumbnail/content via Payload (Featured Projects block)
        // or edit this default directly.
        key: "newproject",
        title: "NEW PROJECT TITLE",
        year: "2025",
        thumbnail: "/works-bg.png",
        copy: "ADD A SHORT PROJECT OVERVIEW HERE — WHAT THE CAMPAIGN WAS AND WHY IT WORKED.",
        tags: ["CATEGORY", "DISCIPLINE"],
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
    const sectionRef = useRef<HTMLElement>(null)
    const { headingRef, beforeRef, afterRef } = useScrollJoin<HTMLHeadingElement, HTMLSpanElement>()

    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [cursorActive, setCursorActive] = useState(false)
    const cursorStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const mousePosRef = useRef<{ x: number; y: number } | null>(null)
    const hideAllRef = useRef<() => void>(() => {})
    const showVideoRef = useRef<(id: string) => void>(() => {})

    // One <video> per project that has a hover video; refs collected by key.
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
    const videoProjects = projects.filter((p) => p.hoverVideoUrl)

    const showVideo = (id: string) => {
        setHoveredId(id)
        Object.entries(videoRefs.current).forEach(([key, vid]) => {
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
        Object.values(videoRefs.current).forEach((vid) => {
            if (!vid) return
            vid.style.opacity = "0"
            vid.pause()
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
            <h2 ref={headingRef} className="h1 amplitude dark projects-heading">
                <span ref={beforeRef} className="projects-heading__word">{headingBefore}</span>{' '}
                <span ref={afterRef} className="projects-heading__word text-highlight">{headingHighlight}</span>
            </h2>
            <div className="wrapper">
                <div className="video-bg">
                    <div className="video-wrapper">
                        {videoProjects.map((p) => (
                            <video
                                key={p.key}
                                ref={(el) => {
                                    videoRefs.current[p.key] = el
                                }}
                                loop
                                muted
                                playsInline
                                preload="auto"
                                style={videoStyle}
                                src={p.hoverVideoUrl}
                            ></video>
                        ))}
                    </div>
                </div>
                <div className="project-grid" onMouseLeave={hideAll}>
                    {projects.map((p) => (
                        <div
                            key={p.key}
                            id={p.key}
                            className="project"
                            onMouseEnter={() => showVideo(p.key)}
                        >
                            <div className="title-wrapper">
                                <p className="body dark">{p.title}</p>
                            </div>

                            <div className="project-image cursor-target">
                                <ParallaxImage src={p.thumbnail} alt="" style={imgStyle(p.key)} />
                            </div>
                        </div>
                    ))}

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
                                <a
                                    href={byKey[hoveredId].link || '/works'}
                                    className="custom-button project-info__cta"
                                >
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
