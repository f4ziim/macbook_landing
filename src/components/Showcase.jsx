import React, { useRef, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Showcase.jsx — added smooth scroll behavior + smooth reveal animations using GSAP ScrollTrigger
export default function Showcase() {
    const sectionRef = useRef(null);
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // enable native smooth-scrolling for user agents that support it
        const prevScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'smooth';

        if (!sectionRef.current) return () => { document.documentElement.style.scrollBehavior = prevScrollBehavior };

        const el = sectionRef.current;

        // Main parallax / pin timeline for the showcase area (desktop only)
        let mainTimeline;
        if (!isTablet) {
            mainTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    pin: true,
                },
            });

            // scale the mask image slightly for parallax feel
            const maskImg = el.querySelector('.mask img');
            const contentEl = el.querySelector('.content');

            mainTimeline
                .to(maskImg, { scale: 1.08, transformOrigin: 'center center', ease: 'none' }, 0)
                .to(contentEl, { opacity: 1, y: 0, ease: 'power1.out' }, 0);
        }

        // Reveal animations for children inside content — works on all viewport sizes
        const reveals = el.querySelectorAll('.reveal');
        reveals.forEach((node) => {
            gsap.set(node, { opacity: 0, y: 30 });
            gsap.to(node, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: node,
                    start: 'top 85%',
                    end: 'bottom 60%',
                    toggleActions: 'play none none reverse',
                },
            });
        });

        // Cleanup
        return () => {
            if (mainTimeline) {
                if (mainTimeline.scrollTrigger) mainTimeline.scrollTrigger.kill();
                mainTimeline.kill();
            }
            ScrollTrigger.getAll().forEach((t) => t.kill());
            document.documentElement.style.scrollBehavior = prevScrollBehavior;
        };
    }, [isTablet]);

    return (
        <section id="showcase" ref={sectionRef}>
            <div className="media">
                <video src="/videos/game.mp4" loop muted autoPlay playsInline />
                <div className="mask">
                    <img src="/mask-logo.svg" alt="" />
                </div>
            </div>

            {/* .content initially hidden; children marked with .reveal will animate in */}
            <div className="content" style={{ opacity: 0, transform: 'translateY(20px)' }}>
                <div className="wrapper">
                    <div className="lg:max-w-md reveal">
                        <h2>Rocket Chip</h2>

                        <div className="space-y-5 mt-7 pe-10">
                            <p className="reveal">
                                Introducing{' '}
                                <span className="text-white">M4, the next generation of Apple silicon</span>. M4 powers
                            </p>
                            <p className="reveal">
                                It drives Apple Intelligence on IPad Pro, so you can write, create, and accomplish more with ease. All in a design that's unbelievably thin, light, and powerful
                            </p>
                            <p className="reveal">
                                A brand new display engine delivers breathtaking precision, color accuracy and brightness. And a next-gen CPU with hardware-accelerated ray tracing brings console-level graphics to your fingertips
                            </p>
                            <p className="text-primary reveal">Learn more about apple intelligence</p>
                        </div>
                    </div>

                    <div className="max-w-3xs space-y-14">
                        <div className="space-y-2 reveal">
                            <p>Up to</p>
                            <h3>4x faster</h3>
                            <p>pro rendering performance than m2</p>
                        </div>
                        <div className="space-y-2 reveal">
                            <p>Up to</p>
                            <h3>1.5x faster</h3>
                            <p>CPU performance than m2</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


