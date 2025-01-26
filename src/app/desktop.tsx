"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { WindowDiv, WindowProps, defaultDimensions, defaultPosition,  WindowState } from "./windowdiv/window";
import { Html, IDFolder, IDHtml, IDPdf } from "./windowdiv/filetypes"
import { LandingWindow } from "./windowdiv/windows/landingpage";
import "./desktop.css"
import { ResumeGuts } from "./windowdiv/windows/resume";

const normalizeZIndexes = () : number => {
    const allWindows = Array.from(document.querySelectorAll('.mover') as NodeListOf<HTMLElement>);

    const sortedWindows = allWindows.sort((a, b) => parseInt(a.style.zIndex) - parseInt(b.style.zIndex));

    let idx = 0;
    sortedWindows.forEach((win) => {
        win.style.zIndex = (idx).toString();
        idx++;
    });
    return idx--;
};

type telemetry = {
    position : {x: number, y: number};
    size : {width : number, height: number};
}

const getInitalLandingPageTelemetry = (): telemetry => {
    const scaleFacHeight = .5;
    const scaledWidth = window.innerWidth * scaleFacHeight;
    const scaledHeight = window.innerHeight / 2;
    const telem : telemetry = { 
        position: {x: 45, y: 15},
        size: {width: scaledWidth, height: scaledHeight}
    }

    return telem;
}
const getInitalResumeTelemetry = (): telemetry => {
    const landingTelem = getInitalLandingPageTelemetry();

    const posX = landingTelem.position.x + landingTelem.size.width + 10;
    const posY = 96;

    const scaledWidth = window.innerWidth - posX - 20;
    const scaledHeight = window.innerHeight - posY - 20;

    const telem : telemetry = { 
        position: {x: posX, y: posY},
        size: {width: scaledWidth, height: scaledHeight}
    }

    return telem;
}
const getInitalProjectsTelemetry = (): telemetry => {
    const landingTelem = getInitalLandingPageTelemetry();

    const posX = landingTelem.position.x;
    const posY = landingTelem.position.y + landingTelem.size.height + 10;

    const scaledWidth = landingTelem.size.width;
    const scaledHeight = window.innerHeight - posY - 20;

    const telem : telemetry = { 
        position: {x: posX, y: posY},
        size: {width: scaledWidth, height: scaledHeight}
    }

    return telem;
}

const fadeInInital = (initTelem: telemetry, state : WindowState, setState: Dispatch<SetStateAction<WindowState>>) => {
    const windowRef = document.getElementById(state.name) as HTMLElement;
    if(windowRef){
        windowRef.style.opacity = '0';
        setState({
            ...state,
            windowWidth: initTelem.size.width,
            windowHeight: initTelem.size.height,
            windowPosition: initTelem.position,
            windowShown: true
        });
        setTimeout(() => {
            windowRef.style.opacity = '1';
        }, 50);
    }
}

const fadeInWindow = (state : WindowState, setState: Dispatch<SetStateAction<WindowState>>) => {
    const windowRef = document.getElementById(state.name) as HTMLElement;
    if(windowRef){
        windowRef.style.opacity = '0';
        setState({
            ...state,
            windowShown: true
        });
        setTimeout(() => {
            windowRef.style.opacity = '1';
        }, 50);
    }
}

const LandingPageWindow = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const pairName = 'Landing Page';
    const startState : WindowState = {
        name: pairName,
        windowShown: false,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [windowState , setWindowState ] = React.useState(startState);

    useEffect( () => {
        const telem = getInitalLandingPageTelemetry();
        fadeInInital(telem, windowState, setWindowState);
    },[])

    const windowProps : WindowProps = {
        guts: () => {return(<LandingWindow/>)},

        saveWindowState: (newState : WindowState) => {
            setWindowState(newState)
        },

        forceFullScreen: false,
        state: windowState,

        getMaxZ: getMaxZ,
        unmountOnClose: false
    }

    const open = () => {
        if(!windowState.windowShown){
            fadeInWindow(windowState, setWindowState);
        }

        const windowRef = document.getElementById(windowState.name)?.querySelector(".window") as HTMLElement;
        if(windowRef && windowState.windowShown){
            windowRef.style.border = '5px solid white';
        
            setTimeout(() => {
                windowRef.style.border = '0px solid white';
            }, 500);
        }
    }


    return (
        <React.Fragment>
            <WindowDiv {...windowProps}/>
            <IDHtml onDoubleClick={open} name={"Landing Page"} ID="landingIcon"/>
        </React.Fragment>
    )
});

const ProjectsWindow = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const projectsStart : WindowState = {
        name: 'Projects',
        windowShown: false,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [projectsState , setProjectsState ] = React.useState(projectsStart);

    useEffect( () => {
        const telem = getInitalProjectsTelemetry();
        fadeInInital(telem, projectsState, setProjectsState);
    },[])

    const projectsProps : WindowProps = {
        guts: () => {return(
            <div></div>
        )},

        saveWindowState: (newState : WindowState) => {
            setProjectsState(newState)
        },

        forceFullScreen: false,
        state: projectsState,

        getMaxZ: getMaxZ,
        unmountOnClose: false
    }

    const open = () => {
        if(!projectsState.windowShown){
            console.log("trigger fade")
            fadeInWindow(projectsState, setProjectsState);
        }

        const windowRef = document.getElementById(projectsState.name)?.querySelector(".window") as HTMLElement;
        if(windowRef && projectsState.windowShown){
            windowRef.style.border = '5px solid white';
        
            setTimeout(() => {
                windowRef.style.border = '0px solid white';
            }, 500);
        }
    }

    const ProjectsIcon = () => {
        return <IDFolder name={"Projects"} onDoubleClick={() => open()} ID={'projectsIcon'}/>
    }

    return(
        <React.Fragment>
            <WindowDiv {...projectsProps}/>
            <ProjectsIcon/>
        </React.Fragment>
    )
});

const ResumeWindow = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const resumeStart : WindowState = {
        name: 'Resume Fall 2024',
        windowShown: false,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [resumeState , setResumeState ] = React.useState(resumeStart);

    useEffect( () => {
        const telem = getInitalResumeTelemetry();
        fadeInInital(telem, resumeState, setResumeState);
    },[])

    const resumeProps : WindowProps = {
        guts: () => {return(
            <ResumeGuts/>
        )},

        saveWindowState: (newState : WindowState) => {
            setResumeState(newState)
        },

        forceFullScreen: false,
        state: resumeState,

        getMaxZ: getMaxZ,
        unmountOnClose: false
    }

    const open = () => {
        if(!resumeState.windowShown){
            fadeInWindow(resumeState, setResumeState);
        }

        const windowRef = document.getElementById(resumeState.name)?.querySelector(".window") as HTMLElement;
        if(windowRef && resumeState.windowShown){
            windowRef.style.border = '5px solid white';
        
            setTimeout(() => {
                windowRef.style.border = '0px solid white';
            }, 500);
        }
    }

    const ResumeIcon = () => {
        return <IDPdf name={"Resume"} onDoubleClick={() => open()} ID={'resumeIcon'}/>
    }

    return(
        <React.Fragment>
            <WindowDiv {...resumeProps}/>
            <ResumeIcon/>
        </React.Fragment>
    )
});

const GithubLink = () => {
    const staticImg = "/desktopEmulationAssets/gh-icon.png";
    const hoverImg = "/desktopEmulationAssets/gh-icon-invert.png";
    return <a href='https://github.com/scaboodles' target="_blank"><img id='githubIcon' src={staticImg} onMouseOver={e => (e.currentTarget.src = hoverImg)} onMouseOut={e => (e.currentTarget.src = staticImg)} alt="github link"></img></a>;
}

const LinkedInLink = () => {

    const staticImg = "/desktopEmulationAssets/linkedInIcon.png";
    const hoverImg = "/desktopEmulationAssets/linkedInIcon-hover.png";

    return <a href='https://www.linkedin.com/in/owen-wolff-061a85229/' target="_blank"><img id='linkedInIcon' src={staticImg} onMouseOver={e => (e.currentTarget.src = hoverImg)} onMouseOut={e => (e.currentTarget.src = staticImg)} alt="linked in link"></img></a>;
}

export const Desktop = () => {
    const maxZ = useRef<number>(1);

    const getMaxZ = (): number => {
        if(maxZ.current >= 10){
            maxZ.current = normalizeZIndexes();
        }

        maxZ.current++;
        return maxZ.current;
    }

    return(
        <div id='Desktop'>
            <GithubLink/>
            <LinkedInLink/>

            <ProjectsWindow getMaxZ={getMaxZ} />
            <ResumeWindow getMaxZ={getMaxZ} />
            <LandingPageWindow getMaxZ={getMaxZ} />
        </div>
    )
}