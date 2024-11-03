import Image from 'next/image';
import './landingWindowStyle.css';
import React, { useEffect, useRef, useState } from 'react';
import { getNumFromPx } from '../window';
import { update } from 'lodash';
import { Pdf } from '../filetypes';

export const LandingWindow = () => {
    const projectFinger = useRef<HTMLDivElement>(null);
    const resumeFinger = useRef<HTMLDivElement>(null);
    const [resumePos, setResumePos] = useState({x: 0, y: 0});
    const [resumeShown, toggleResume] = useState(true);

    useEffect( () => {
        const targetNode = document.getElementById('Resume Fall 2024');
        if (!targetNode) return;

        const updatePosition = () => {
            const styles = window.getComputedStyle(targetNode);
            const parentInternal = targetNode.querySelector('.window');
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

        updatePosition();

        const observer = new MutationObserver( (mutations) => {
            for(let mut of mutations){
                if (mut.type === 'attributes' && mut.attributeName === 'style') {
                    updatePosition();
                }else if (mut.type === 'attributes' && mut.attributeName === 'class') {
                    if(resumeFinger.current){
                        if(targetNode.classList.contains('hidden')){
                            toggleResume(false);
                        }else{
                            toggleResume(true);
                        }
                    }
                }
            }
        })

        observer.observe(targetNode, {
            attributes: true 
        });

        return () => {
            observer.disconnect();
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
        if (resumeFinger.current) {
            if(resumeShown){
                rotateToPoint(resumeFinger.current, resumePos);
            }else{
                rotateToPoint(resumeFinger.current, {x:0, y:0});
            }
        }
    }, [resumePos, resumeShown]);

    const Fingers = () => {
        const fingerStyle: React.CSSProperties = {
            objectFit:'cover',
            width: '100%', 
            height: '100%', 
        }
        
        const ResumeShortcut = () => {
            return(
                <Pdf name={'Resume'} onDoubleClick={() => {
                    const resumeIcon = document.getElementById("resumeIcon");
                    const doubleClickEvent = new MouseEvent('dblclick', {
                        bubbles: true,
                        cancelable: true,
                    });
                    resumeIcon?.dispatchEvent(doubleClickEvent);
                }}/>
            )
        }

        return(
            <div id='fingers'>

                <div className='pointhalf'>

                    <div className='hoverTextContainer'>
                        <div>
                        </div>
                        <div className="hoverText">double click!</div>
                    </div>

                    <div className='fingerWrap' ref={projectFinger}>
                        <Image src={getSrc("pointin.gif")} alt="pointing finger" width={100} height={100} style={fingerStyle}/>
                    </div>
                </div>

                <div className='pointhalf'>
                    <div className='hoverTextContainer'>
                        <ResumeShortcut/>
                        <div className="hoverText">double click!</div>
                    </div>

                    <div className='fingerWrap' ref={resumeFinger}>
                        <Image src={getSrc("pointin.gif")} alt="pointing finger" width={100} height={100} style={fingerStyle}/>
                    </div>
                </div>

            </div>
        )
    };

    const profileStyle: React.CSSProperties = {
        objectFit: 'cover'
    };
    const ProfileGif = () => <Image src={getSrc("typin.gif")} alt="thats me!" fill={true} style={profileStyle} priority={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>;

    return(
        <div id='overrideGuts'>
            <div id='header'>
                <h1>Hello!</h1>
            </div>
                <div id='about'>
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
                        <Fingers/>
                    </div>
                </div>
        </div>
    );
}
