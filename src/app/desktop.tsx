"use client";

import React, { memo, useMemo } from "react";
import { WindowDiv, WindowProps, maxDimensionsOffset, defaultDimensions, defaultPosition, maximizedPosition, ZIndexDict, WindowState, findKeyOfmax, sortedKeysByVal, getWindowCenter } from "./windowdiv/window";
import { Folder, Html, Pdf } from "./windowdiv/filetypes"
import { LandingWindow, LandingWindowProps } from "./windowdiv/windows/landingpage";
import "./desktop.css"

interface DesktopState {
    windows: {
      [key: string]: WindowState;
    };
    zIndexes: ZIndexDict;
}

export class Desktop extends React.Component<{}, DesktopState>{
    // shitty memoization
    resumePos: { x: number, y: number } | null = null;
    projectsPos: { x: number, y: number } | null = null;

    constructor(props: any) {
        super(props)

        this.state = {
            windows:{
                landingPage:{
                    name:"landingPage",
                    windowShown:true,
                    windowWidth:defaultDimensions.width,
                    windowHeight:defaultDimensions.height,
                    windowPosition: defaultPosition,
                    windowScroll: 0
                },

                projects:{
                    name:"projects",
                    windowShown:true,
                    windowWidth:300,
                    windowHeight:200,
                    windowPosition: defaultPosition,
                    windowScroll: 0
                },

                resume:{
                    name:"resume",
                    windowShown:true,
                    windowWidth: 550,
                    windowHeight: 200,
                    windowPosition: defaultPosition,
                    windowScroll: 0
                }
            },
            // name in z index obj MUST match name in state obj
            zIndexes:{projects: 0, landingPage: 2, resume: 1},
        };
    }

    componentDidMount() {
        const updateWindowPosition = (windowKey: string, pos: {x: number, y: number}) => {
            this.setState((prevState) => ({
                windows: {
                    ...prevState.windows,

                    [windowKey]: {
                        ...prevState.windows[windowKey],
                        windowPosition: pos, 
                    },
                },
            }));
        }

        updateWindowPosition("resume", {x: window.innerWidth - 700, y: window.innerHeight - 325});
        updateWindowPosition("projects", {x: 50, y: window.innerHeight - 300});
    }

    componentDidUpdate(prevProps: {}, prevState: DesktopState) {
        // "" memoized ""
        if (prevState.windows.resume.windowPosition !== this.state.windows.resume.windowPosition ||
            prevState.windows.resume.windowWidth !== this.state.windows.resume.windowWidth ||
            prevState.windows.resume.windowHeight !== this.state.windows.resume.windowHeight) {
            this.resumePos = getWindowCenter(this.state.windows.resume);

        }else if(prevState.windows.resume.windowShown === true && this.state.windows.resume.windowShown === false){
            this.resumePos = {x: 0, y: 0}
        }

        if (prevState.windows.projects.windowPosition !== this.state.windows.projects.windowPosition ||
            prevState.windows.projects.windowWidth !== this.state.windows.projects.windowWidth ||
            prevState.windows.projects.windowHeight !== this.state.windows.projects.windowHeight) {
            
            this.projectsPos = getWindowCenter(this.state.windows.projects);

        }else if(prevState.windows.projects.windowShown === true && this.state.windows.projects.windowShown === false){
            console.log("shut projects")
            this.projectsPos = {x: 0, y: 0}
        }
    }


    render() {
        const setNewZIndex = (updatedIndexes: ZIndexDict) => {
            this.setState({zIndexes:updatedIndexes});
        }

        const updateZIndexes = (name: string) =>{
            let zIndexes: ZIndexDict = this.state.zIndexes;
            const highestZ=findKeyOfmax(zIndexes);
            if(highestZ == name){
                return;
            }else{
                let sortedKeys = sortedKeysByVal(zIndexes);
                let currIndex = sortedKeys.indexOf(name);
                sortedKeys.unshift(sortedKeys.splice(currIndex, 1)[0]);
                let updatedZs: ZIndexDict = {};
                for(let i=0; i<sortedKeys.length; i++){
                    updatedZs[sortedKeys[i]] = sortedKeys.length - i + 1;
                }
                setNewZIndex(updatedZs);
            }
        }

        const updateWindowShown = (windowKey: string, toggle: boolean) => {
            this.setState((prevState) => ({
                windows: {
                    ...prevState.windows,

                    [windowKey]: {
                        ...prevState.windows[windowKey],
                        windowShown: toggle, 
                    },
                },
            }));
        }

        const updateWindowWidth = (windowKey: string, width: number) => {
            this.setState((prevState) => ({
                windows: {
                    ...prevState.windows,

                    [windowKey]: {
                        ...prevState.windows[windowKey],
                        windowWidth: width, 
                    },
                },
            }));
        }
        const updateWindowHeight = (windowKey: string, height: number) => {
            this.setState((prevState) => ({
                windows: {
                    ...prevState.windows,

                    [windowKey]: {
                        ...prevState.windows[windowKey],
                        windowHeight: height, 
                    },
                },
            }));
        }
        const updateWindowPosition = (windowKey: string, pos: {x: number, y: number}) => {
            this.setState((prevState) => ({
                windows: {
                    ...prevState.windows,

                    [windowKey]: {
                        ...prevState.windows[windowKey],
                        windowPosition: pos, 
                    },
                },
            }));
        }
        const updateWindowScroll = (windowKey: string, newScroll: number) => {
            this.setState((prevState) => ({
                windows: {
                    ...prevState.windows,

                    [windowKey]: {
                        ...prevState.windows[windowKey],
                        windowScroll: newScroll, 
                    },
                },
            }));
        }

        const fabricateWindowProps = (windowKey: string, guts: () => JSX.Element) : WindowProps => {
            const props: WindowProps = {
                closeWindow: React.useCallback(() => {updateWindowShown(windowKey, false)}, []),
                guts: guts,
                zIndexes: this.state.zIndexes,
                updateZ: React.useCallback((indexDict) => {setNewZIndex(indexDict)}, []),
                updateWidth: React.useCallback((newWidth: number) => {updateWindowWidth(windowKey, newWidth)}, []),
                updateHeight: React.useCallback((newHeight: number) => {updateWindowHeight(windowKey, newHeight)}, []),
                setPos: React.useCallback((newPos : {x: number, y:number}) => {updateWindowPosition(windowKey, newPos)}, []),
                forceFullScreen: false,
                state: this.state.windows[windowKey],
                updateScroll: React.useCallback((newScroll: number) => {updateWindowScroll(windowKey, newScroll)}, [])
            }

            return props;
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

        const openFunc = (windowKey:string) =>{
            updateWindowShown(windowKey, true);
            updateZIndexes(windowKey);
        }


        const Projects = () => {
            const name = "projects";

            return <Folder name={name} onDoubleClick={() => openFunc(name)}/>
        }

        const ProjectsWindow = () => {
            const fragment = <React.Fragment><p>stuff</p></React.Fragment>;
            const windowprops = fabricateWindowProps("projects", () => fragment);
            return <WindowDiv {...windowprops}/>
        }

        const Resume = () => {
            const name = "resume";
            return <Pdf name={name} onDoubleClick={() => openFunc(name)}/>
        }

        const ResumeWindow = () => {
            const fragment = React.useMemo( () => {
                return(
                    <div style={{overflowY: 'hidden', height: '100%'}}>
                        <object data="/images/resumeFall2024.pdf" type="application/pdf" width="100%" height="100%">
                            <p>Here's the <a href="/images/resumeFall2024.pdf">link</a> if the embed is broken</p>
                        </object>
                    </div>
                );
            }, [this.state.windows.resume.windowHeight, this.state.windows.resume.windowWidth]);
            const windowprops = fabricateWindowProps("resume", () => fragment);
            return <WindowDiv {...windowprops}/>
        }

        const LandingPage = () => {
            const name = "landingPage";
            return <Html name={name} onDoubleClick={() => openFunc(name)}/>
        }

        const LandingPageWindow = () => {
            const resumePos = this.resumePos ? this.resumePos : {x: 0, y: 0};
            const projectsPos = this.projectsPos ? this.projectsPos : {x: 0, y: 0};
            const landingProps: LandingWindowProps = {
                width: this.state.windows.landingPage.windowWidth,
                resume: Resume,
                projects: Projects,
                resumePos: getWindowCenter(this.state.windows.resume),
                projectsPos: getWindowCenter(this.state.windows.projects),
                prevResumePos: resumePos,
                prevProjectsPos: projectsPos,
            }
            const fragment = <LandingWindow {...landingProps}/>
            const windowprops = fabricateWindowProps("landingPage", () => fragment);
            return <WindowDiv {...windowprops}/>
        }

        const Icons = () => {
            return (
                <div className="iconContainer">
                    <LandingPage/>
                    <Projects/>
                    <Resume/>
                </div>
            )
        }

        return (
            <div id='Desktop'>
                <GithubLink/>
                <LinkedInLink/>

                <Icons/>

                <LandingPageWindow/>
                <ProjectsWindow/>
                <ResumeWindow/>
            </div>
        )
    };
}