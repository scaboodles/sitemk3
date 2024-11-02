import Image from 'next/image';
import './landingWindowStyle.css';
import React, { useEffect, useRef } from 'react';

export type LandingWindowProps = {
    width : number;
    resume: () => JSX.Element;
    projects: () => JSX.Element;
    resumePos: {x: number, y: number};
    projectsPos: {x: number, y: number};
    prevResumePos: {x: number, y: number};
    prevProjectsPos: {x: number, y: number};
}

export const LandingWindow = (props : LandingWindowProps) => {
    const projectFinger = useRef<HTMLDivElement>(null);
    const resumeFinger = useRef<HTMLDivElement>(null);

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


    const widthBP = 600;
    const width = props.width;

    const getSrc = (filename: string) => {
        return `/images/${filename}`;
    }

    const transition = 'transform 0.3s ease';
    useEffect(() => {
        if (projectFinger.current) {
            projectFinger.current.style.transition = 'none';
            rotateToPoint(projectFinger.current, props.prevProjectsPos);
            
            requestAnimationFrame(() => {
                if(projectFinger.current){
                    projectFinger.current.style.transition = transition;
                    rotateToPoint(projectFinger.current, props.projectsPos);
                }
            });
        }
    
        if (resumeFinger.current) {
            resumeFinger.current.style.transition = 'none';
            rotateToPoint(resumeFinger.current, props.prevResumePos);
    
            requestAnimationFrame(() => {
                if(resumeFinger.current){
                    resumeFinger.current.style.transition = transition;
                    rotateToPoint(resumeFinger.current, props.resumePos);
                }
            });
        }
    }, []);

    const Fingers = () => {
        const fingerStyle: React.CSSProperties = {
            objectFit:'cover',
            width: '100%', 
            height: '100%', 
        }
        return(
            <div id='fingers'>

                <div className='pointhalf'>

                    <div className='hoverTextContainer'>
                        <props.projects/>
                        <div className="hoverText">double click!</div>
                    </div>

                    <div className='fingerWrap' ref={projectFinger}>
                        <Image src={getSrc("pointin.gif")} alt="pointing finger" width={100} height={100} style={fingerStyle}/>
                    </div>
                </div>

                <div className='pointhalf'>
                    <div className='hoverTextContainer'>
                        <props.resume/>
                        <div className="hoverText">double click!</div>
                    </div>

                    <div className='fingerWrap' ref={resumeFinger}>
                        <Image src={getSrc("pointin.gif")} alt="pointing finger" width={100} height={100} style={fingerStyle}/>
                    </div>
                </div>

            </div>
        )
    };

    let DynamicAbout : React.FC;
    const profileStyle: React.CSSProperties = {
        objectFit: 'cover'
    };
    const ProfileGif = () => <Image src={getSrc("typin.gif")} alt="thats me!" fill={true} style={profileStyle} priority={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>;
    if(width <= widthBP){
        DynamicAbout = () => {
            return(
                <div id='aboutAlt'>
                    <div id='thasmeAlt'>
                        <div id='profileWrap'>
                            <ProfileGif/>
                        </div>
                        <p>typin.gif</p>
                    </div>
                    <br/>
                    <div>
                        <div id='aboutText'>
                            <h2>My name is Owen</h2>
                            <br/>
                            <br/>
                            <h3>I like making stuff and solving problems.</h3>
                        </div>
                    </div>
                    <Fingers/>
                </div>
            )
        }
    }else{
        DynamicAbout = () => {
            return(
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
            )
        }
    }

    return(
        <div id='overrideGuts'>
            <div id='header'>
                <h1>Hello!</h1>
            </div>
            <DynamicAbout/>
        </div>
    );
}
