import Image from 'next/image';
import './landingWindowStyle.css';
import React, { useEffect, useRef, useState } from 'react';
import { defaultPosition, getNumFromPx } from '../window';
import { NOPFolder, NOPPdf } from '../filetypes';

export const LandingWindow = () => {
    const projectFinger = useRef<HTMLDivElement>(null);
    const resumeFinger = useRef<HTMLDivElement>(null);

    const [resumePos, setResumePos] = useState({x: 0, y: 0});
    const [resumeShown, toggleResume] = useState(true);

    const [projectsPos, setProjectsPos] = useState({x: 0, y: 0});
    const [projectsShown, toggleProjects] = useState(true);

    const [selfPosition, setSelfPosition] = useState({x: defaultPosition.x, y: defaultPosition.y});

    const [altRender, toggleAltRender] = useState(false);

    useEffect( () => {
        const resumeNode = document.getElementById('resumeWindow');
        const selfNode = document.getElementById('landingPageWindow');
        const projectsNode = document.getElementById('projectsWindow');
        if (!resumeNode || !selfNode || !projectsNode) return;

        const updateSelfPosition = () => {
            const styles = window.getComputedStyle(selfNode);
            const parentInternal = selfNode.querySelector('.window');
            let widthOffset = 0;
            let heightOffset = 0;
            if(parentInternal){
                const windowStyles = window.getComputedStyle(parentInternal);
                widthOffset = parseInt(windowStyles.width, 10) / 2;
                heightOffset = parseInt(windowStyles.height, 10) / 2;
            }
            const newPos = {x:getNumFromPx(styles.left) + widthOffset, y:getNumFromPx(styles.top) + heightOffset};
            setSelfPosition(newPos);
        };

        const updateResumePosition = () => {
            const styles = window.getComputedStyle(resumeNode);
            const parentInternal = resumeNode.querySelector('.window');
            let widthOffset = 0;
            let heightOffset = 0;
            if(parentInternal){
                const windowStyles = window.getComputedStyle(parentInternal);
                widthOffset = parseInt(windowStyles.width, 10) / 2;
                heightOffset = parseInt(windowStyles.height, 10) / 2;
            }
            const newPos = {x:getNumFromPx(styles.left) + widthOffset, y:getNumFromPx(styles.top) + heightOffset};
            setResumePos(newPos);
        };

        const updateProjectsPosition = () => {
            const styles = window.getComputedStyle(projectsNode);
            const parentInternal = projectsNode.querySelector('.window');
            let widthOffset = 0;
            let heightOffset = 0;
            if(parentInternal){
                const windowStyles = window.getComputedStyle(parentInternal);
                widthOffset = parseInt(windowStyles.width, 10) / 2;
                heightOffset = parseInt(windowStyles.height, 10) / 2;
            }
            const newPos = {x:getNumFromPx(styles.left) + widthOffset, y:getNumFromPx(styles.top) + heightOffset};
            setProjectsPos(newPos);
        };

        const checkWidth = () => {
            const parentInternal = selfNode.querySelector('.window');
            if(parentInternal){
                const windowStyles = window.getComputedStyle(parentInternal);
                if(parseInt(windowStyles.width, 10) < 700){
                    toggleAltRender(true);
                }else{
                    toggleAltRender(false);
                }
            }
        }

        updateResumePosition();
        updateSelfPosition();
        updateProjectsPosition();

        checkWidth();

        const selfObserver = new MutationObserver( (mutations) => {
            for(const mut of mutations){
                if (mut.type === 'attributes' && mut.attributeName === 'style') {
                    checkWidth();
                }
            }
        });

        const selfObserverPos = new MutationObserver( (mutations) => {
            for(const mut of mutations){
                if (mut.type === 'attributes' && mut.attributeName === 'style') {
                    updateSelfPosition();
                }
            }
        });

        selfObserver.observe(selfNode.querySelector(".window")!, {
            attributes: true 
        });

        selfObserverPos.observe(selfNode, {
            attributes: true 
        });

        const resumeObserver = new MutationObserver( (mutations) => {
            for(const mut of mutations){
                if (mut.type === 'attributes' && mut.attributeName === 'style') {
                    updateResumePosition();
                }else if (mut.type === 'attributes' && mut.attributeName === 'class') {
                    if(resumeFinger.current){
                        if(resumeNode.classList.contains('hidden')){
                            toggleResume(false);
                        }else{
                            toggleResume(true);
                        }
                    }
                }
            }
        });

        resumeObserver.observe(resumeNode, {
            attributes: true 
        });

        const projectsObserver = new MutationObserver( (mutations) => {
            for(const mut of mutations){
                if (mut.type === 'attributes' && mut.attributeName === 'style') {
                    updateProjectsPosition();
                }else if (mut.type === 'attributes' && mut.attributeName === 'class') {
                    if(projectFinger.current){
                        if(projectsNode.classList.contains('hidden')){
                            toggleProjects(false);
                        }else{
                            toggleProjects(true);
                        }
                    }
                }
            }
        });

        projectsObserver.observe(projectsNode, {
            attributes: true 
        });

        return () => {
            resumeObserver.disconnect();
            selfObserver.disconnect();
            projectsObserver.disconnect();
        };
    }, [])

    function rotateToPoint(element: HTMLDivElement, target: {x: number, y: number}) {
        if(target.x == 0 && target.y == 0){
            element.style.transform = `rotate(0deg)`;
            return;
        }
        // center of the element
        const arrowRect = element.getBoundingClientRect();
        const arrowCenterX = arrowRect.left + arrowRect.width / 2;
        const arrowCenterY = arrowRect.top + arrowRect.height / 2;

        const deltaX = target.x - arrowCenterX;
        const deltaY = target.y - arrowCenterY;

        // angle in radians and convert to degrees
        const angleInRadians = Math.atan2(deltaY, deltaX);
        const angleInDegrees = (angleInRadians * 180) / Math.PI;
        const rotOffset = 90;
        element.style.transform = `rotate(${angleInDegrees + rotOffset}deg)`;
    }

    const getSrc = (filename: string) => {
        return `/images/${filename}`;
    }

    useEffect(() => {
        if (projectFinger.current) {
            if(projectsShown){
                rotateToPoint(projectFinger.current, projectsPos);
            }else{
                rotateToPoint(projectFinger.current, {x:0, y:0});
            }
        }

        if (resumeFinger.current) {
            if(resumeShown){
                rotateToPoint(resumeFinger.current, resumePos);
            }else{
                rotateToPoint(resumeFinger.current, {x:0, y:0});
            }
        }
    }, [resumePos, resumeShown, projectsPos, projectsShown, selfPosition]);

    const resumeOpenEvent = () => {
        const resumeIcon = document.getElementById("resumeIcon");
        const doubleClickEvent = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
        });
        resumeIcon?.dispatchEvent(doubleClickEvent);
    }

    const projectsOpenEvent = () => {
        const projectsIcon = document.getElementById("projectsIcon");
        const doubleClickEvent = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
        });
        projectsIcon?.dispatchEvent(doubleClickEvent);
    }

    const profileStyle: React.CSSProperties = {
        objectFit: 'cover'
    };

    const ProfileGif = () => <Image src={getSrc("typin.gif")} unoptimized={true} alt="thats me!" fill={true} style={profileStyle} priority={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>;

    const aboutId = altRender ? "aboutAlt" : "about"

    return(
        <div id='overrideGuts'>
            <div id='header'>
                <h1>Hello!</h1>
            </div>

            <div id={aboutId}>
                <div id='thasme'>
                    <div id='profileWrapHeight'>
                        <ProfileGif/>
                    </div>
                </div>
                <div>
                    <div id='aboutText'>
                        <h2>My name is Owen</h2>
                        <br/>
                        <br/>
                        <h3>I like making stuff and solving problems.</h3>
                    </div>

                    <div id='shortcuts'>
                        <div className='shortcutHalf'>
                            <div className='flex' onDoubleClick={projectsOpenEvent}>
                                <div className='hoverTextContainer'>
                                    <NOPFolder name={"Projects"}/>
                                    <div className="hoverText">double click to open!</div>
                                </div>
                            </div>
                            <div className='fingerWrap' ref={projectFinger}>
                                <Image unoptimized={true} src={getSrc("pointin.gif")} alt="pointing finger" width={100} height={100} className='fingerStyle'/>
                            </div>
                        </div>

                        <div className='shortcutHalf'>
                            <div className='flex' onDoubleClick={resumeOpenEvent}>
                                <div className='hoverTextContainer'>
                                    <NOPPdf name={"Resume"}/>
                                    <div className="hoverText">double click to open!</div>
                                </div>
                            </div>
                            <div className='fingerWrap' ref={resumeFinger}>
                                <Image unoptimized={true} src={getSrc("pointin.gif")} alt="pointing finger" width={100} height={100} className='fingerStyle'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}