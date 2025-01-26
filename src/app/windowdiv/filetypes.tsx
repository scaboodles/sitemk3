import { useEffect } from "react";

export type FileProps = {
    name: string;
    onDoubleClick: () => void;
}

const getSrc = (name: string): string => {
    return `/desktopEmulationAssets/${name}.png`;
}

export const Folder = (props: FileProps) => {
    return ( 
        <div className="icon" onDoubleClick={props.onDoubleClick}>
            <img src={getSrc("folder")} alt="folder icon"/>
            <h1>{props.name}</h1>
        </div>
    );
};

export const Mov = (props: FileProps) => {
    return ( 
        <div className="icon" onDoubleClick={props.onDoubleClick}>
            <img src={getSrc("mov-icon")} alt="movie icon"/>
            <h1>{`${props.name}.mov`}</h1>
        </div>
    );
};

export const Pdf  = (props: FileProps) => {
    return(
        <div className="icon" onDoubleClick={props.onDoubleClick}>
            <img src={getSrc("txt-icon")} alt="pdf icon"/>
            <h1>{`${props.name}.pdf`}</h1>
        </div>
    );
};

export type NOPFileProps = {
    name: string;
}

export const NOPPdf  = (props: NOPFileProps) => {
    return(
        <div className="icon">
            <img src={getSrc("txt-icon")} alt="pdf icon"/>
            <h1>{`${props.name}.pdf`}</h1>
        </div>
    );
};

export const NOPFolder  = (props: NOPFileProps) => {
    return(
        <div className="icon">
            <img src={getSrc("folder")} alt="folder icon"/>
            <h1>{props.name}</h1>
        </div>
    );
};

export const Html = (props: FileProps) => {
    return(
        <div className="icon" onDoubleClick={props.onDoubleClick}>
            <img src={getSrc("html-icon")} alt="html icon"/>
            <h1>{`${props.name}.jsx`}</h1>
        </div>
    );
};

export type IDFileProps = {
    name: string;
    onDoubleClick: () => void;
    ID: string;
}
export const IDPdf  = (props: IDFileProps) => {
    useEffect( () => {
        const icon = document.getElementById(props.ID);
        if(icon){
            icon.style.opacity = '0';
            setTimeout(() => {
                icon.style.opacity = '1';
            }, 50);
        }
    },[]);

    return(
        <div className="named icon" onDoubleClick={props.onDoubleClick} id={props.ID} >
            <img src={getSrc("txt-icon")} alt="pdf icon"/>
            <h1>{`${props.name}.pdf`}</h1>
        </div>
    );
};

export const IDFolder = (props: IDFileProps) => {
    useEffect( () => {
        const icon = document.getElementById(props.ID);
        if(icon){
            icon.style.opacity = '0';
            setTimeout(() => {
                icon.style.opacity = '1';
            }, 50);
        }
    },[]);

    return ( 
        <div className="named icon" onDoubleClick={props.onDoubleClick} id={props.ID}>
            <img src={getSrc("folder")} alt="folder icon"/>
            <h1>{props.name}</h1>
        </div>
    );
};

export const IDHtml = (props: IDFileProps) => {
    useEffect( () => {
        const icon = document.getElementById(props.ID);
        if(icon){
            icon.style.opacity = '0';
            setTimeout(() => {
                icon.style.opacity = '1';
            }, 50);
        }
    },[]);

    return(
        <div className="named icon" onDoubleClick={props.onDoubleClick} id={props.ID}>
            <img src={getSrc("html-icon")} alt="html icon"/>
            <h1>{`${props.name}.jsx`}</h1>
        </div>
    );
};