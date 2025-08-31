'use client';
import React from "react";
import { IDMov } from "../filetypes";
import "./projectsStyle.css"

const BounceGateLink = () => {
    const staticImg = "/desktopEmulationAssets/extern-link.png";
    const hoverImg = "/desktopEmulationAssets/extern-link-hover.png";

    return (
        <div className="extern">
            <a href='https://ratcorpgames.itch.io/bouncegate' target="_blank"><img className="clickable" src={staticImg} onMouseOver={e => (e.currentTarget.src = hoverImg)} onMouseOut={e => (e.currentTarget.src = staticImg)} alt="link to bouncegate"></img></a>
            <h5>Link to itch.io</h5>
        </div>
    )
}

const TetrisLink = () => {
    const staticImg = "/desktopEmulationAssets/extern-link.png";
    const hoverImg = "/desktopEmulationAssets/extern-link-hover.png";

    return (
        <div className="extern">
            <a href='https://github.com/scaboodles/cursed_tetris' target="_blank"><img className="clickable" src={staticImg} onMouseOver={e => (e.currentTarget.src = hoverImg)} onMouseOut={e => (e.currentTarget.src = staticImg)} alt="link to bouncegate"></img></a>
            <h5>Link to github</h5>
        </div>
    )
}

const VizLink = () => {
    const staticImg = "/desktopEmulationAssets/extern-link.png";
    const hoverImg = "/desktopEmulationAssets/extern-link-hover.png";

    return (
        <div className="extern">
            <a href='https://github.com/scaboodles/wiretapmk2' target="_blank"><img className="clickable" src={staticImg} onMouseOver={e => (e.currentTarget.src = hoverImg)} onMouseOut={e => (e.currentTarget.src = staticImg)} alt="link to bouncegate"></img></a>
            <h5>Link to github</h5>
        </div>
    )
}

const VizIcon = () => {
    const vizDemoOpen = () => {
        const vizIcon = document.getElementById("vizIcon");
        const doubleClickEvent = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
        });
        vizIcon?.dispatchEvent(doubleClickEvent);
    }

    return <IDMov name={"viz_demo"} onDoubleClick={vizDemoOpen} ID={'vizIconReal'}/>
}

const TetrisIcon = () => {
    const tetrisDemoIcon = () => {
        const tetrisIcon = document.getElementById("tetrisIcon");
        const doubleClickEvent = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
        });
        tetrisIcon?.dispatchEvent(doubleClickEvent);
    }

    return <IDMov name={"tetris_demo"} onDoubleClick={tetrisDemoIcon} ID={'tetrisIconReal'}/>
}

export function ProjectsGuts(){
    return(
        <div id="projectsWrapper">
            <div id="projectsIntro">
                <div>
                    <h2>My favorite projects</h2>
                </div>
            </div>
            <div className="divider"/>
            <div id="projectFiles">
                <div className="projectFile">
                    <div>
                        <TetrisIcon/>
                        <TetrisLink/>
                    </div>
                    <div className="textContainer">
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            Here&apos;s a short demo of an ASCII Tetris clone that I built in C with ncurses.
                            <br/>
                            <br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            To render the tetrominoes, I used half block ASCII characters and manipulation of background colors. Im really
                            happy with how it ended up looking.
                            <br/>
                            <br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            It&apos;s missing a couple of canonical Tetris features (points system, slams, t-spins)
                            but for running in my command line, I think it&apos;s kinda neat.
                        </p>
                    </div>
                </div>
                <div className="divider"/>
                <div className="projectFile">
                    <div>
                        <VizIcon/>
                        <VizLink/>
                    </div>
                    <div className="textContainer">
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            Sticking with the theme of silly command line toys, this is an ASCII audio visualizer I built.
                            <br/>
                            <br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            This one also uses C-ncurses and I used Swift to tap the system audio. Thanks to DRM, I had to do some janky
                            digital audio cable hijinks to make it all work.
                            <br/>
                            <br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            It pipes audio data (amplitudes) from Swift into a C program that performs a fourier transfrom 
                            (<a className="clickable hyperlink" href="https://www.fftw.org/">fftw</a>) to get frequency data
                            then renders it in ASCII block characters via ncurses.
                        </p>
                    </div>
                </div>
                <div className="divider"/>
                <div className="projectFile">
                    <BounceGateLink/>
                    <div className="textContainer">
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            This last one is a game that my friend and I submitted to a game jam, and it&apos;s easily my favorite.
                            <br/>
                            <br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            We built it in Unity in 72 hours and I think it turned out pretty well.
                             If nothing else, this one was the most fun to work on.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}