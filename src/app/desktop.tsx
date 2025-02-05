"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { WindowDiv, WindowProps, defaultDimensions, defaultPosition,  WindowState } from "./windowdiv/window";
import { GhostIcon, IDHtml, RefFolder, RefPDF } from "./windowdiv/filetypes"
import { LandingWindow } from "./windowdiv/windows/landingpage";
import "./desktop.css"
import { ResumeGuts } from "./windowdiv/windows/resume";
import { ProjectsGuts } from "./windowdiv/windows/projects";

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
    const windowRef = document.getElementById(state.ID) as HTMLElement;
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

export const fadeInWindow = (state : WindowState, setState: Dispatch<SetStateAction<WindowState>>) => {
    const windowRef = document.getElementById(state.ID) as HTMLElement;
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
        ID: 'landingPageWindow',
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

        const windowRef = document.getElementById(windowState.ID)?.querySelector(".window") as HTMLElement;
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
        ID: 'projectsWindow',
        windowShown: false,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [projectsState , setProjectsState ] = React.useState(projectsStart);
    const iconMounted = useRef<boolean>(false);

    useEffect( () => {
        const telem = getInitalProjectsTelemetry();
        fadeInInital(telem, projectsState, setProjectsState);
    },[])

    const projectsProps : WindowProps = {
        guts: () => {return(<ProjectsGuts/>)},

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
            fadeInWindow(projectsState, setProjectsState);
        }

        const windowRef = document.getElementById(projectsState.ID)?.querySelector(".window") as HTMLElement;
        if(windowRef && projectsState.windowShown){
            windowRef.style.border = '5px solid white';
        
            setTimeout(() => {
                windowRef.style.border = '0px solid white';
            }, 500);
        }
    }

    const ProjectsIcon = () => {
        return <RefFolder mountedRef={iconMounted} name={"Projects"} onDoubleClick={() => open()} ID={'projectsIcon'}/>
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
        ID: 'resumeWindow',
        windowShown: false,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [resumeState , setResumeState ] = React.useState(resumeStart);
    const iconMounted = useRef<boolean>(false);

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

        const windowRef = document.getElementById(resumeState.ID)?.querySelector(".window") as HTMLElement;
        if(windowRef && resumeState.windowShown){
            windowRef.style.border = '5px solid white';
        
            setTimeout(() => {
                windowRef.style.border = '0px solid white';
            }, 500);
        }
    }

    const ResumeIcon = () => {
        return <RefPDF mountedRef={iconMounted} name={"Resume"} onDoubleClick={() => open()} ID={'resumeIcon'}/>
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

type PlayerProps = {
    videoId: string;
    vidName: string;
}

const Player: React.FC<PlayerProps> = ({ videoId, vidName }) => {
    return (
        <div className="youtube-wrapper">
        <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={vidName}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
        ></iframe>
        </div>
    );
};

const VizDemo = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const vizStart : WindowState = {
        name: 'Visualizer Demo',
        ID: "vizWindow",
        windowShown: false,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [vizState , setVizState ] = React.useState(vizStart);

    const vizProps : WindowProps = {
        guts: () => {return(
            <div style={{width: '100', height:'100%', backgroundColor:'black'}}>
                <Player videoId="iBkNva83Ftw" vidName="wiretap viz demo"/>
            </div>
        )},

        saveWindowState: (newState : WindowState) => {
            setVizState(newState)
        },

        forceFullScreen: false,
        state: vizState,

        getMaxZ: getMaxZ,
        unmountOnClose: false
    }

    const open = () => {
        if(!vizState.windowShown){
            fadeInWindow(vizState, setVizState);
        }

        const windowRef = document.getElementById(vizState.ID)?.querySelector(".window") as HTMLElement;
        if(windowRef && vizState.windowShown){
            windowRef.style.border = '5px solid white';
        
            setTimeout(() => {
                windowRef.style.border = '0px solid white';
            }, 500);
        }
    }

    return(
        <React.Fragment>
            <GhostIcon ID="vizIcon" onDoubleClick={open}/>
            <WindowDiv {...vizProps}/>
        </React.Fragment>
    )
});

const TetrisDemo = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const tetrisStart : WindowState = {
        name: 'Tetris Demo',
        ID: "vizWindow",
        windowShown: false,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }

    const [tetrisState, setTetrisState ] = React.useState(tetrisStart);

    const tetrisProps : WindowProps = {
        guts: () => {return(
            <div style={{width: '100', height:'100%', backgroundColor:'black'}}>
                <Player videoId="ZLDA33eqwWo" vidName="cursed tetris demo"/>
            </div>
        )},

        saveWindowState: (newState : WindowState) => {
            setTetrisState(newState)
        },

        forceFullScreen: false,
        state: tetrisState,

        getMaxZ: getMaxZ,
        unmountOnClose: false
    }

    const open = () => {
        if(!tetrisStart.windowShown){
            fadeInWindow(tetrisState, setTetrisState);
        }

        const windowRef = document.getElementById(tetrisState.ID)?.querySelector(".window") as HTMLElement;
        if(windowRef && tetrisState.windowShown){
            windowRef.style.border = '5px solid white';
        
            setTimeout(() => {
                windowRef.style.border = '0px solid white';
            }, 500);
        }
    }

    return(
        <React.Fragment>
            <GhostIcon ID="tetrisIcon" onDoubleClick={open}/>
            <WindowDiv {...tetrisProps}/>
        </React.Fragment>
    )
});

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

            <VizDemo getMaxZ={getMaxZ}/>
            <TetrisDemo getMaxZ={getMaxZ}/>
        </div>
    )
}