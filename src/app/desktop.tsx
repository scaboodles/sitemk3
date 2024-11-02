"use client";

import React, { memo, useMemo, useRef } from "react";
import { WindowDiv, WindowProps, maxDimensionsOffset, defaultDimensions, defaultPosition, maximizedPosition, ZIndexDict, WindowState, getWindowCenter } from "./windowdiv/window";
import { Folder, Html, Pdf } from "./windowdiv/filetypes"
import { LandingWindow, LandingWindowProps } from "./windowdiv/windows/landingpage";
import "./desktop.css"

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

const TestWindow = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const startState : WindowState = {
        name: 'test',
        windowShown: true,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }
    const [windowState , setWindowState ] = React.useState(startState);

    const windowProps : WindowProps = {
        closeWindow: React.useCallback( () => 
            {
                setWindowState({
                    ...windowState,
                    windowShown: false
                })
            }, [windowState]),

        guts: () => {return(<div>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            <p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p><p>hello</p>
            </div>)},

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
            <TestWindowIcon open={open} name={"test1"}/>
        </React.Fragment>
    )
});

const TestWindow2 = React.memo( ({ getMaxZ }: { getMaxZ: () => number }) => {
    const startState : WindowState = {
        name: 'test2',
        windowShown: true,
        windowWidth: defaultDimensions.width,
        windowHeight: defaultDimensions.height,
        windowPosition: {x: defaultPosition.x, y: defaultPosition.y},
        windowScroll: 0
    }
    const [windowState , setWindowState ] = React.useState(startState);

    const windowProps : WindowProps = {
        closeWindow: React.useCallback( () => 
            {
                setWindowState({
                    ...windowState,
                    windowShown: false
                })
            }, [windowState]),

        guts: () => {return(<p>hello again</p>)},

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
            <TestWindowIcon open={open} name={"test2"}/>
        </React.Fragment>
    )
});

const TestWindowIcon = ({open, name} : {open : () => void, name: string}) => {
    return <Html name={name} onDoubleClick={() => open()}/>
}

export const Desktop = () => {
    const maxZ = useRef<number>(0);

    const getMaxZ = (): number => {
        if(maxZ.current >= 5){
            maxZ.current = normalizeZIndexes();
        }

        maxZ.current++;
        return maxZ.current;
    }

    return(
        <div id='Desktop'>
            <TestWindow getMaxZ={getMaxZ} />
            <TestWindow2 getMaxZ={getMaxZ} />
        </div>
    )
}