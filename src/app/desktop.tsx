"use client";

import React, { memo, useMemo } from "react";
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
const TestWindow = React.memo( ({ zIndex, setZindex }: { zIndex: number, setZindex: () => void }) => {
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

        guts: () => {return(<p>hello</p>)},

        saveWindowState: (newState : WindowState) => {
            setWindowState(newState)
        },

        zIndex: zIndex,
        forceFullScreen: false,
        state: windowState,
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

const TestWindow2 = React.memo( ({ zIndex, setZindex }: { zIndex: number, setZindex: () => void }) => {
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

        zIndex: zIndex,
        forceFullScreen: false,
        state: windowState,
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

//const fabricateWindowProps = (windowKey: string, guts: () => JSX.Element) : WindowProps => {
    //const props: WindowProps = {
        //closeWindow: React.useCallback(() => {updateWindowShown(windowKey, false)}, []),
        //guts: guts,
        //zIndexes: this.state.zIndexes,
        //updateZ: React.useCallback((indexDict) => {setNewZIndex(indexDict)}, []),
        //updateWidth: React.useCallback((newWidth: number) => {updateWindowWidth(windowKey, newWidth)}, []),
        //updateHeight: React.useCallback((newHeight: number) => {updateWindowHeight(windowKey, newHeight)}, []),
        //setPos: React.useCallback((newPos : {x: number, y:number}) => {updateWindowPosition(windowKey, newPos)}, []),
        //forceFullScreen: false,
        //state: this.state.windows[windowKey],
        //updateScroll: React.useCallback((newScroll: number) => {updateWindowScroll(windowKey, newScroll)}, [])
    //}

    //return props;
//}

export const Desktop = () => {
    return(
        <div id='Desktop'>
            <TestWindow zIndex={0} setZindex={() => {}}/>
            <TestWindow2 zIndex={0} setZindex={() => {}}/>
        </div>
    )
}