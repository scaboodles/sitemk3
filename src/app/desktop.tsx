"use client";

import React, { useEffect, useRef } from "react";
import { WindowDiv, WindowProps, defaultDimensions, defaultPosition,  WindowState } from "./windowdiv/window";
import { Html, IDFolder, IDPdf } from "./windowdiv/filetypes"
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

const LandingPageWindow = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const pairName = 'Landing Page';
    const startState : WindowState = {
        name: pairName,
        windowShown: true,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [windowState , setWindowState ] = React.useState(startState);

    useEffect( () => {
        const telem = getInitalLandingPageTelemetry();
        setWindowState({
            ...windowState,
            windowWidth: telem.size.width,
            windowHeight: telem.size.height,
            windowPosition: telem.position,
        })
    },[])

    const windowProps : WindowProps = {
        guts: () => {return(<LandingWindow/>)},

        saveWindowState: (newState : WindowState) => {
            setWindowState(newState)
        },

        forceFullScreen: false,
        state: windowState,

        getMaxZ: getMaxZ,
        unmountOnClose: true
    }

    const open = () => {
        if(!windowState.windowShown){
            setWindowState({
                ...windowState,
                windowShown: true
            })
        }
    }


    return (
        <React.Fragment>
            <WindowDiv {...windowProps}/>
            <HTMLIcon open={open} name={"Landing Page"}/>
        </React.Fragment>
    )
});

const ProjectsWindow = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const projectsStart : WindowState = {
        name: 'Projects',
        windowShown: true,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [projectsState , setProjectsState ] = React.useState(projectsStart);

    useEffect( () => {
        const telem = getInitalProjectsTelemetry();
        setProjectsState({
            ...projectsState,
            windowWidth: telem.size.width,
            windowHeight: telem.size.height,
            windowPosition: telem.position,
        })
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
            setProjectsState({
                ...projectsState,
                windowShown: true
            })
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
        windowShown: true,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [resumeState , setResumeState ] = React.useState(resumeStart);

    useEffect( () => {
        const telem = getInitalResumeTelemetry();
        setResumeState({
            ...resumeState,
            windowWidth: telem.size.width,
            windowHeight: telem.size.height,
            windowPosition: telem.position,
        })
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
            setResumeState({
                ...resumeState,
                windowShown: true
            })
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

const HTMLIcon = ({open, name} : {open : () => void, name: string}) => {
    return <Html name={name} onDoubleClick={() => open()}/>
}

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