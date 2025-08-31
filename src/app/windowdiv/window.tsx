"use client";
import React, { useEffect } from 'react';

export const maxDimensionsOffset = {width:10,height:10};
export const defaultDimensions = {
    width: 860,
    height: 500
};

export const defaultPosition = {x:75, y:15};
export const maximizedPosition = {x:5, y:5};

export type ZIndexDict = {[key: string]: number};

export type WindowState = {
    name: string;
    ID: string;
    windowShown: boolean;
    windowWidth: number;
    windowHeight: number;
    windowPosition: {x: number, y: number};
    windowScroll: number;
}

export type WindowProps = {
    guts: () => JSX.Element;
    saveWindowState: (arg : WindowState) => void;
    forceFullScreen: boolean;
    state : WindowState;
    getMaxZ: () => number;
    unmountOnClose: boolean;
};

export const getWindowCenter = (windowState : WindowState) : {x: number, y: number} => {
    if(!windowState.windowShown){
        return {x: 0, y: 0};
    }
    const x = windowState.windowPosition.x + (windowState.windowWidth / 2);
    const y = windowState.windowPosition.y + (windowState.windowHeight / 2);

    return {x: x, y: y};
}

export const WindowDiv = React.memo((props: WindowProps) => {

    const moverRef = React.createRef<HTMLDivElement>();
    const windowRef = React.createRef<HTMLDivElement>();

    const contentRef = React.createRef<HTMLDivElement>();
    const scroll = props.state.windowScroll;

    const resizeRefT = React.createRef<HTMLDivElement>();
    const resizeRefL = React.createRef<HTMLDivElement>();
    const resizeRefR = React.createRef<HTMLDivElement>();
    const resizeRefB = React.createRef<HTMLDivElement>();
    const resizeRefTL = React.createRef<HTMLDivElement>();
    const resizeRefTR = React.createRef<HTMLDivElement>();
    const resizeRefBL = React.createRef<HTMLDivElement>();
    const resizeRefBR = React.createRef<HTMLDivElement>();


    //const forceFullScreen = props.forceFullScreen ? props.forceFullScreen : false; 

    const pairName = props.state.name;
    const Guts=props.guts;


    const getState = () : WindowState => {
        const moverMounted = moverRef.current;
        let newPos : {x: number, y: number} = {x: 0 , y: 0}

        if(moverMounted){
            const styles = window.getComputedStyle(moverMounted);
            newPos = {x:getNumFromPx(styles.left), y:getNumFromPx(styles.top)};
        }
        const contentMounted = contentRef.current;
        let currScroll = 0;
        if(contentMounted){
            currScroll = contentMounted.scrollTop;
        }

        const windowMounted = windowRef.current;
        let width = defaultDimensions.width;
        let height = defaultDimensions.height;
        if(windowMounted){
            const styles = window.getComputedStyle(windowMounted);
            width = parseInt(styles.width,10)
            height = parseInt(styles.height,10)
        }

        const currState : WindowState = {
            name: pairName,
            ID: props.state.ID,
            windowShown: true,
            windowWidth: width,
            windowHeight: height,
            windowPosition: newPos,
            windowScroll: currScroll,
        }
        return currState;
    }

    function clickAndDrag(element: HTMLDivElement, win: HTMLDivElement){
        dragElement(element, win);
    }

    function dragElement(elmnt: HTMLDivElement, win: HTMLDivElement){
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

        //hella globals bc i am bad at programming
        let outOfBoundsX = 0;
        let outOfBoundsY = 0;

        let width = 0;
        let height = 0;

        let dxOld = 0;
        let dyOld = 0;

        let leftGrace = 0;
        let rightGrace = 0;

        let maxY =  window.innerHeight;
        let maxX = window.innerWidth;


        const headerOffset = 15;

        if (document.getElementById(elmnt.id + "Head")) {
            // if present, the header is where you move the DIV from:
            //@ts-ignore
            document.getElementById(elmnt.id + "Head").onmousedown = dragMouseDown;
        } else {
            //error can happen if element is missing a head or an id
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e: MouseEvent){
            e = e || window.event; //if e is unassigned, it is assigned to window.event
            e.preventDefault(); //only execute specifically handled events

            // get the mouse cursor position at startup:
            x2 = e.clientX;
            y2 = e.clientY;

            //initialize outOfBounds values
            outOfBoundsX = elmnt.offsetLeft;
            outOfBoundsY = elmnt.offsetTop;

            //max height and width of window
            maxY = window.innerHeight;
            maxX = window.innerWidth;

            if(win){ //need some data from win ref, might not exist yet
                width = win.offsetWidth;
                height = win.offsetHeight;
                const pointOnWin = x2 - elmnt.offsetLeft;
                leftGrace = pointOnWin;
                rightGrace = width - pointOnWin;
            }else{
                width = elmnt.offsetWidth;
                height = elmnt.offsetHeight;
                const pointOnWin = x2 - elmnt.offsetLeft;
                leftGrace = pointOnWin;
                rightGrace = width - pointOnWin;
            }

            document.onmouseup = closeDragElement; //stop dragging on mouse up
            document.onmousemove = elementDrag; // call a function whenever the cursor moves:

        }

        function elementDrag(e: MouseEvent){
            e = e || window.event; //if e is unassigned, it is assigned to window.event
            e.preventDefault();

            //recalculate cursor position

            x1 = x2 - e.clientX;
            y1 = y2 - e.clientY;

            const dx = -x1;
            const dy = -y1;

            x2 = e.clientX;
            y2 = e.clientY;

            if(dxOld * dx < 0){//recalculate left and right grace spans on switch direction
                const pointOnWin = x2 - elmnt.offsetLeft;
                leftGrace = pointOnWin;
                rightGrace = width - pointOnWin;

                if(dx<0){ //force window back in bounds after change in direction
                    const outOfBounds = elmnt.offsetLeft + width - maxX;
                    if(outOfBounds>0){
                        outOfBoundsX -= outOfBounds; 
                        elmnt.style.left = `${maxX-width}px`;
                    }
                }else{
                    const outOfBounds = elmnt.offsetLeft;
                    if(outOfBounds<0){
                        outOfBoundsX -= outOfBounds; 
                        elmnt.style.left = `0px`;
                    }
                }
            }

            if(dyOld * dy < 0){
                if(dy>0){
                    const outOfBounds = elmnt.offsetTop;
                    if(outOfBounds < 0){
                        outOfBoundsY -= outOfBounds;
                        elmnt.style.top = `0px`;
                    }
                }else{
                    const outOfBounds = (elmnt.offsetTop + height) - maxY;
                    if(outOfBounds > 0){
                        outOfBoundsY -= outOfBounds;
                        elmnt.style.top = `${maxY - height}px`
                    }
                }
            }
            // set the element's new position:
            if(dx<0){ //calculate moving left and right separately
                if(outOfBoundsX >= 0 && outOfBoundsX - rightGrace <= maxX - width){//not out of bounds left side, within grace span of right edge
                    outOfBoundsX -= x1; //update outOfBounds tracker
                    elmnt.style.left = (elmnt.offsetLeft - x1) + "px";//update pos
                }else if(rightGrace < 0){
                    const pointOnWin = x2 - elmnt.offsetLeft;
                    leftGrace = pointOnWin;
                    rightGrace = width - pointOnWin;
                }
            }else if(dx>0){
                if(outOfBoundsX <= maxX - width && outOfBoundsX + leftGrace >= 0){
                    outOfBoundsX -= x1;
                    elmnt.style.left = (elmnt.offsetLeft - x1) + "px";
                }else if(leftGrace < 0){
                    const pointOnWin = x2 - elmnt.offsetLeft;
                    leftGrace = pointOnWin;
                    rightGrace = width - pointOnWin;
                }
            }

            if(dy<0){ //calculate moving up and down separately

                if(outOfBoundsY >= 0 && outOfBoundsY <= maxY && e.clientY < maxY - height + headerOffset){//not out of bounds on top
                    outOfBoundsY -= y1; //update outOfBounds tracker
                    elmnt.style.top = (elmnt.offsetTop - y1) + "px";//update pos
                }

            }else if(dy>0){
                if(outOfBoundsY <= maxY - height && outOfBoundsY >= 0 && e.clientY - headerOffset > 0){
                    outOfBoundsY -= y1;
                    elmnt.style.top = (elmnt.offsetTop - y1) + "px";
                }
            }

            if(dx != 0){
                dxOld = dx;
            }
            if(dy != 0){
                dyOld = dy;
            }
        }

        function closeDragElement() {
            // stop moving when mouse button is released by removing document mouse events
            document.onmouseup = null;
            document.onmousemove = null;
            
            if(elmnt.offsetLeft + width > maxX){//force window back in bounds if out
                elmnt.style.left = `${maxX-width}px`;
            }else if(elmnt.offsetLeft<0){
                elmnt.style.left = `0px`;
            }

            if(elmnt.offsetTop < 0){
                elmnt.style.top = `0px`;
            }

            outOfBoundsX = 0;
            outOfBoundsY = 0;

            //updatePositions();
        }
    }

    const minWidth = 280;
    const minHeight = 280;
    let resizeOutOfBoundsOffsetY = 0;
    let resizeOutOfBoundsOffsetX = 0;

    const windowShown = props.state.windowShown;

    const closeFunc = (() => {
        let currState = getState();
        currState = {
            ...currState,
            windowShown: false
        }

        const windowRef = document.getElementById(currState.ID) as HTMLElement;
        if(windowRef){
            windowRef.style.opacity = '0';
            setTimeout(() => {
                props.saveWindowState(currState);
            }, 100);
        }else{
            props.saveWindowState(currState);
        }
    });

    const restoreState = () => {
        const mounted = windowRef.current;
        if(mounted){
            mounted.style.width = `${props.state.windowWidth}px`
            mounted.style.height = `${props.state.windowHeight}px`
        }
        const moverMounted = moverRef.current;
        if(moverMounted){
            moverMounted.style.top = `${props.state.windowPosition.y}px`;
            moverMounted.style.left = `${props.state.windowPosition.x}px`;
        }

        if(contentRef.current){
            contentRef.current.scrollTo(0, scroll); // Use the ref's value for restoration
        }
    }

    useEffect(() => {

        restoreState();
        if (windowRef.current != null && moverRef.current != null) {
            //make moveable
            clickAndDrag(moverRef.current, windowRef.current);

            //make resize handles
            const resizableEle = windowRef.current;
            const moveableContainer = moverRef.current;

            const bringToFront = () => {
                if(moveableContainer){
                    const newZ = props.getMaxZ();
                    moveableContainer.style.zIndex = newZ.toString();
                }
            }
            bringToFront();

            const styles = window.getComputedStyle(resizableEle);

            let width = parseInt(styles.width, 10);
            let height = parseInt(styles.height, 10);

            let x = 0;
            let y = 0;

            //right
            const onMouseMoveRightResize = (event: MouseEvent) => {
                const dx = event.clientX - x;
                x = event.clientX;
                width = width + dx;
                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x<window.innerWidth){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            };

            const onMouseUpRightResize = () => {
                document.removeEventListener("mousemove", onMouseMoveRightResize);
                resizeOutOfBoundsOffsetX = 0;
            }

            const onMouseDownRightResize = (event: MouseEvent) => {
                x = event.clientX;
                const styles = window.getComputedStyle(resizableEle);
                resizableEle.style.left = styles.left;
                resizableEle.style.right = "";
                document.addEventListener("mousemove", onMouseMoveRightResize, { passive: true });
                document.addEventListener("mouseup", onMouseUpRightResize, { passive: true });
            }

            //left
            const onMouseMoveLeftResize = (event: MouseEvent) => {
                const dx = event.clientX - x;
                x = event.clientX;
                width = width - dx;
                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x > 0){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            };

            const onMouseUpLeftResize = () => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);
                const tempLeft = getNumFromPx(resizedStyle.left);
                moveableContainer.style.left = `${getNumFromPx(moverStyle.left) + tempLeft}px`;
                resizableEle.style.left = "0";
                resizableEle.style.right = `${getNumFromPx(resizedStyle.right) + tempLeft}px`
                document.removeEventListener("mousemove", onMouseMoveLeftResize);
                resizeOutOfBoundsOffsetX = 0;
            }

            const onMouseDownLeftResize = (event: MouseEvent) => {
                x = event.clientX;
                const styles = window.getComputedStyle(resizableEle);
                resizableEle.style.right = styles.right;
                resizableEle.style.left = "";
                document.addEventListener("mousemove", onMouseMoveLeftResize, { passive: true });
                document.addEventListener("mouseup", onMouseUpLeftResize, { passive: true });
            }
            
            //top
            const onMouseMoveTopResize = (event: MouseEvent) => {
                const dy = event.clientY - y;
                y = event.clientY;
                height = height - dy;
                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y > 0){
                        resizableEle.style.height = `${height}px`;
                    }
                }
            };

            const onMouseUpTopResize = () => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);
                const tempTop = getNumFromPx(resizedStyle.top);
                moveableContainer.style.top = `${getNumFromPx(moverStyle.top) + tempTop}px`;
                resizableEle.style.top = "0";
                resizableEle.style.bottom = `${getNumFromPx(resizedStyle.bottom) + tempTop}px`
                document.removeEventListener("mousemove", onMouseMoveTopResize);
                resizeOutOfBoundsOffsetY = 0;
            }

            const onMouseDownTopResize = (event: MouseEvent) => {
                const styles = window.getComputedStyle(resizableEle);
                y = event.clientY;
                resizableEle.style.bottom = styles.bottom;
                resizableEle.style.top = "";
                document.addEventListener("mousemove", onMouseMoveTopResize, { passive: true });
                document.addEventListener("mouseup", onMouseUpTopResize, { passive: true });

                if(windowRef.current){
                    windowRef.current.classList.add("resizingTop");
                }
            }

            //Bottom
            const onMouseMoveBottomResize = (event: MouseEvent) => {
                const dy = event.clientY - y;
                y = event.clientY;
                height = height + dy;
                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y < window.innerHeight){
                        resizableEle.style.height = `${height}px`;
                    }
                }
            };

            const onMouseUpBottomResize = () => {
                document.removeEventListener("mousemove", onMouseMoveBottomResize);
                resizeOutOfBoundsOffsetY = 0;
            }

            const onMouseDownBottomResize = (event: MouseEvent) => {
                y = event.clientY
                const styles = window.getComputedStyle(resizableEle);
                resizableEle.style.top = styles.top;
                resizableEle.style.bottom = "";
                document.addEventListener("mousemove", onMouseMoveBottomResize, { passive: true });
                document.addEventListener("mouseup", onMouseUpBottomResize, { passive: true });
            }

            //Top Left
            const onMouseMoveTopLeftResize = (event: MouseEvent) => {
                const dy = event.clientY - y;
                const dx = event.clientX - x;

                y = event.clientY;
                x = event.clientX;

                width = width - dx;
                height = height - dy;

                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y>0){
                        resizableEle.style.height = `${height}px`;
                    }
                }

                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x > 0){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            }

            const onMouseUpTopLeftResize = () => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);

                const tempLeft = getNumFromPx(resizedStyle.left);
                moveableContainer.style.left = `${getNumFromPx(moverStyle.left) + tempLeft}px`;
                resizableEle.style.left = "0";
                resizableEle.style.right = `${getNumFromPx(resizedStyle.right) + tempLeft}px`

                const tempTop = getNumFromPx(resizedStyle.top);
                moveableContainer.style.top = `${getNumFromPx(moverStyle.top) + tempTop}px`;
                resizableEle.style.top = "0";
                resizableEle.style.bottom = `${getNumFromPx(resizedStyle.bottom) + tempTop}px`

                resizeOutOfBoundsOffsetY = 0;
                resizeOutOfBoundsOffsetX = 0;

                document.removeEventListener("mousemove", onMouseMoveTopLeftResize);
            }

            const onMouseDownTopLeftResize = (event: MouseEvent) => {
                y = event.clientY;
                x = event.clientX;

                const styles = window.getComputedStyle(resizableEle);

                resizableEle.style.top = "";
                resizableEle.style.bottom = styles.bottom;

                resizableEle.style.left = ""; 
                resizableEle.style.right = styles.right;

                document.addEventListener("mousemove", onMouseMoveTopLeftResize, { passive: true });
                document.addEventListener("mouseup", onMouseUpTopLeftResize, { passive: true });
            }

            //Top Right
            const onMouseMoveTopRightResize = (event: MouseEvent) => {
                const dy = event.clientY - y;
                const dx = event.clientX - x;

                y = event.clientY;
                x = event.clientX;

                width = width + dx;
                height = height - dy;

                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y > 0){
                        resizableEle.style.height = `${height}px`;
                    }
                }

                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x < window.innerWidth){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            }

            const onMouseUpTopRightResize = () => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);

                const tempTop = getNumFromPx(resizedStyle.top);
                moveableContainer.style.top = `${getNumFromPx(moverStyle.top) + tempTop}px`;
                resizableEle.style.top = "0";
                resizableEle.style.bottom = `${getNumFromPx(resizedStyle.bottom) + tempTop}px`;

                resizeOutOfBoundsOffsetY = 0;
                resizeOutOfBoundsOffsetX = 0;

                document.removeEventListener("mousemove", onMouseMoveTopRightResize);
            }

            const onMouseDownTopRightResize = (event: MouseEvent) => {
                y = event.clientY;
                x = event.clientX;

                const styles = window.getComputedStyle(resizableEle);

                resizableEle.style.top = "";
                resizableEle.style.bottom = styles.bottom;

                resizableEle.style.left = styles.left; 
                resizableEle.style.right = "";

                document.addEventListener("mousemove", onMouseMoveTopRightResize, { passive: true });
                document.addEventListener("mouseup", onMouseUpTopRightResize, { passive: true });
            }

            //Bot Right
            const onMouseMoveBottomRightResize = (event: MouseEvent) => {
                const dy = event.clientY - y;
                const dx = event.clientX - x;

                y = event.clientY;
                x = event.clientX;

                width = width + dx;
                height = height + dy;

                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y < window.innerHeight){
                        resizableEle.style.height = `${height}px`;
                    }
                }

                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x < window.innerWidth){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            }

            const onMouseUpBottomRightResize = () => {
                resizeOutOfBoundsOffsetY = 0;
                resizeOutOfBoundsOffsetX = 0;

                document.removeEventListener("mousemove", onMouseMoveBottomRightResize);
            }

            const onMouseDownBottomRightResize = (event: MouseEvent) => {
                y = event.clientY;
                x = event.clientX;

                const styles = window.getComputedStyle(resizableEle);

                resizableEle.style.top = styles.top;
                resizableEle.style.bottom = "";

                resizableEle.style.left = styles.left; 
                resizableEle.style.right = "";

                document.addEventListener("mousemove", onMouseMoveBottomRightResize, { passive: true });
                document.addEventListener("mouseup", onMouseUpBottomRightResize, { passive: true });
            }

            //Bot left
            const onMouseMoveBottomLeftResize = (event: MouseEvent) => {
                const dy = event.clientY - y;
                const dx = event.clientX - x;

                y = event.clientY;
                x = event.clientX;

                width = width - dx;
                height = height + dy;

                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y < window.innerHeight){
                        resizableEle.style.height = `${height}px`;
                    }
                }

                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x > 0){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            }

            const onMouseUpBottomLeftResize = () => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);

                const tempLeft = getNumFromPx(resizedStyle.left);
                moveableContainer.style.left = `${getNumFromPx(moverStyle.left) + tempLeft}px`;
                resizableEle.style.left = "0";
                resizableEle.style.right = `${getNumFromPx(resizedStyle.right) + tempLeft}px`

                resizeOutOfBoundsOffsetY = 0;
                resizeOutOfBoundsOffsetX = 0;

                document.removeEventListener("mousemove", onMouseMoveBottomLeftResize);
            }

            const onMouseDownBottomLeftResize = (event: MouseEvent) => {
                y = event.clientY;
                x = event.clientX;

                const styles = window.getComputedStyle(resizableEle);

                resizableEle.style.top = styles.top;
                resizableEle.style.bottom = "";

                resizableEle.style.left = ""; 
                resizableEle.style.right = styles.right;

                document.addEventListener("mousemove", onMouseMoveBottomLeftResize, { passive: true });
                document.addEventListener("mouseup", onMouseUpBottomLeftResize, { passive: true });
            }

            //add event listeners

            const resizerRight = resizeRefR.current;
            if(resizerRight){
                resizerRight.addEventListener("mousedown", onMouseDownRightResize);
            }

            const resizerLeft = resizeRefL.current;
            if(resizerLeft){
                resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);
            }

            const resizerTop = resizeRefT.current;
            if(resizerTop){
                resizerTop.addEventListener("mousedown", onMouseDownTopResize);
            }

            const resizerBottom = resizeRefB.current;
            if(resizerBottom){
                resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
            }

            const resizerTopLeft = resizeRefTL.current;
            if(resizerTopLeft){
                resizerTopLeft.addEventListener("mousedown", onMouseDownTopLeftResize);
            }

            const resizerTopRight = resizeRefTR.current;
            if(resizerTopRight){
                resizerTopRight.addEventListener("mousedown", onMouseDownTopRightResize);
            }

            const resizerBottomRight = resizeRefBR.current;
            if(resizerBottomRight){
                resizerBottomRight.addEventListener("mousedown", onMouseDownBottomRightResize);
            }

            const resizerBottomLeft = resizeRefBL.current;
            if(resizerBottomLeft){
                resizerBottomLeft.addEventListener("mousedown", onMouseDownBottomLeftResize);
            }

            moveableContainer.addEventListener("mousedown", bringToFront);

            //cleanup event listeners
            return () => {
                if(resizerRight){
                    resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
                }
                if(resizerLeft){
                    resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
                } 
                if(resizerTop){
                    resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
                }
                if(resizerBottom){
                    resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
                }
                if(resizerTopLeft){
                    resizerTopLeft.removeEventListener("mousedown", onMouseDownTopLeftResize);
                }
                if(resizerTopRight){
                    resizerTopRight.removeEventListener("mousedown", onMouseDownTopRightResize);
                }
                if(resizerBottomLeft){
                    resizerBottomLeft.removeEventListener("mousedown", onMouseDownBottomLeftResize);
                }
                if(resizerBottomRight){
                    resizerBottomRight.removeEventListener("mousedown", onMouseDownBottomRightResize);
                }

                moveableContainer.removeEventListener("mousedown", bringToFront);
            }
        };
    },[contentRef] );

    if (windowShown) {
        return (
            <div ref={moverRef} className="mover" id={props.state.ID} >
                <div className="window" ref={windowRef}>
                    <div ref={resizeRefT} className="resizer resizer-t"></div>
                    <div ref={resizeRefL} className="resizer resizer-l"></div>
                    <div ref={resizeRefR} className="resizer resizer-r"></div>
                    <div ref={resizeRefB} className="resizer resizer-b"></div>
                    <div ref={resizeRefTL} className="resizer resizer-tl"/>
                    <div ref={resizeRefTR} className="resizer resizer-tr"/>
                    <div ref={resizeRefBL} className="resizer resizer-bl"/>
                    <div ref={resizeRefBR} className="resizer resizer-br"/>

                    <div className="windowHead" id={`${props.state.ID}Head`}>
                        <img src={"/desktopEmulationAssets/window-head-left.png"} className="windowHeadBorder windowHeadBorderLeft"></img>
                        <img src={"/desktopEmulationAssets/window-head-middle.png"} className="windowHeadBorder windowHeadBorderMid"></img>
                        <h1>{pairName}</h1>
                        <img src={"/desktopEmulationAssets/window-head-right.png"} className="windowHeadBorder windowHeadBorderRight"></img>
                    </div>
                    <button className='closeButton' type='button' onClick={closeFunc}></button>
                    
                    <img src={"/desktopEmulationAssets/window-border.png"} className="windowBorderLeft"></img>
                    <img src={"/desktopEmulationAssets/window-border.png"} className="windowBorderRight"></img>

                    <div ref={contentRef} className='windowContents'>
                        <Guts/>
                    </div>

                    <div className='windowBorderBottomContainer'>
                        <img src={"/desktopEmulationAssets/window-border-bottom-left.png"} className='windowBorderBottomLeft'></img>
                        <img src={"/desktopEmulationAssets/window-border.png"} className='windowBorderBottom'></img>
                        <img src={"/desktopEmulationAssets/window-border-bottom-right.png"} className='windowBorderBottomRight'></img>
                    </div>
                </div>
            </div>
        );
    }else if(!props.unmountOnClose){
        return (
            <div ref={moverRef} className="mover hidden" id={props.state.ID} >
                <div className="window" ref={windowRef}>
                    <div ref={resizeRefT} className="resizer resizer-t"></div>
                    <div ref={resizeRefL} className="resizer resizer-l"></div>
                    <div ref={resizeRefR} className="resizer resizer-r"></div>
                    <div ref={resizeRefB} className="resizer resizer-b"></div>
                    <div ref={resizeRefTL} className="resizer resizer-tl"/>
                    <div ref={resizeRefTR} className="resizer resizer-tr"/>
                    <div ref={resizeRefBL} className="resizer resizer-bl"/>
                    <div ref={resizeRefBR} className="resizer resizer-br"/>

                    <div className="windowHead" id={`${props.state.ID}Head`}>
                        <img src={"/desktopEmulationAssets/window-head-left.png"} className="windowHeadBorder windowHeadBorderLeft"></img>
                        <img src={"/desktopEmulationAssets/window-head-middle.png"} className="windowHeadBorder windowHeadBorderMid"></img>
                        <h1>{pairName}</h1>
                        <img src={"/desktopEmulationAssets/window-head-right.png"} className="windowHeadBorder windowHeadBorderRight"></img>
                    </div>
                    <button className='closeButton' type='button' onClick={closeFunc}></button>
                    
                    <img src={"/desktopEmulationAssets/window-border.png"} className="windowBorderLeft"></img>
                    <img src={"/desktopEmulationAssets/window-border.png"} className="windowBorderRight"></img>

                    <div ref={contentRef} className='windowContents'>
                        <Guts/>
                    </div>

                    <div className='windowBorderBottomContainer'>
                        <img src={"/desktopEmulationAssets/window-border-bottom-left.png"} className='windowBorderBottomLeft'></img>
                        <img src={"/desktopEmulationAssets/window-border.png"} className='windowBorderBottom'></img>
                        <img src={"/desktopEmulationAssets/window-border-bottom-right.png"} className='windowBorderBottomRight'></img>
                    </div>
                </div>
            </div>
        );
    }else{
        return null;
    }
});

export function getNumFromPx(numPx : string): number{
    if(typeof numPx == "string"){
      const stripped = numPx.replace("px", '');
      return parseInt(stripped, 10);
    }
    return numPx;
}

type Offset={
    left: number;
    top: number;
}

export function getOffset(el: HTMLDivElement): Offset{
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}
