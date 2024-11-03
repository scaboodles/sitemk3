"use client";

import React, { createContext, Dispatch, memo, ReactNode, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { WindowDiv, WindowProps, maxDimensionsOffset, defaultDimensions, defaultPosition, maximizedPosition, ZIndexDict, WindowState, getWindowCenter } from "./windowdiv/window";
import { Folder, Html, IDPdf, Pdf } from "./windowdiv/filetypes"
import { LandingWindow } from "./windowdiv/windows/landingpage";
import "./desktop.css"
import { ResumeGuts } from "./windowdiv/windows/resume";
import { identity } from "lodash";
import { WindowDivNoUnmount } from "./windowdiv/hiddenWindow";

interface DesktopState {
    windows: {
      [key: string]: WindowState;
    };
    zIndexes: ZIndexDict;
}
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

    const windowProps : WindowProps = {
        guts: () => {return(<LandingWindow/>)},

        saveWindowState: (newState : WindowState) => {
            setWindowState(newState)
        },

        forceFullScreen: false,
        state: windowState,

        getMaxZ: getMaxZ,
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
    }

    const open = () => {
        if(!resumeState.windowShown){
            setResumeState({
                ...resumeState,
                windowShown: true
            })
        }
    }

    const ResumeIcon = () => {
        return <IDPdf name={"Resume"} onDoubleClick={() => open()} ID={'resumeIcon'}/>
    }

    return(
        <React.Fragment>
            <WindowDivNoUnmount {...resumeProps}/>
            <ResumeIcon/>
        </React.Fragment>
    )
});

const HTMLIcon = ({open, name} : {open : () => void, name: string}) => {
    return <Html name={name} onDoubleClick={() => open()}/>
}

export const Desktop = () => {
    const maxZ = useRef<number>(0);

    const getMaxZ = (): number => {
        if(maxZ.current >= 10){
            maxZ.current = normalizeZIndexes();
        }

        maxZ.current++;
        return maxZ.current;
    }

    return(
        <div id='Desktop'>
            <LandingPageWindow getMaxZ={getMaxZ} />
            <ResumeWindow getMaxZ={getMaxZ} />
        </div>
    )
}