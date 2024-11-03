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
            <img src={getSrc("folder")} />
            <h1>{props.name}</h1>
        </div>
    );
};

export const Mov = (props: FileProps) => {
    return ( 
        <div className="icon" onDoubleClick={props.onDoubleClick}>
            <img src={getSrc("mov-icon")} />
            <h1>{`${props.name}.mov`}</h1>
        </div>
    );
};

export const Pdf  = (props: FileProps) => {
    return(
        <div className="icon" onDoubleClick={props.onDoubleClick}>
            <img src={getSrc("txt-icon")} />
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
            <img src={getSrc("txt-icon")} />
            <h1>{`${props.name}.pdf`}</h1>
        </div>
    );
};

export const NOPFolder  = (props: NOPFileProps) => {
    return(
        <div className="icon">
            <img src={getSrc("folder")} />
            <h1>{props.name}</h1>
        </div>
    );
};

export type IDFileProps = {
    name: string;
    onDoubleClick: () => void;
    ID: string;
}
export const IDPdf  = (props: IDFileProps) => {
    return(
        <div className="icon" onDoubleClick={props.onDoubleClick} id={props.ID} >
            <img src={getSrc("txt-icon")} />
            <h1>{`${props.name}.pdf`}</h1>
        </div>
    );
};

export const IDFolder = (props: IDFileProps) => {
    return ( 
        <div className="icon" onDoubleClick={props.onDoubleClick} id={props.ID}>
            <img src={getSrc("folder")} />
            <h1>{props.name}</h1>
        </div>
    );
};

/*
const CustomIcon = (props: FileProps) => {
    return(
        <div className="icon" onDoubleClick={props.onDoubleClick}>
            <props.icon/>
            <h1>{`props.name`}</h1>
        </div>
    );
}
*/

export const Html = (props: FileProps) => {
    return(
        <div className="icon" onDoubleClick={props.onDoubleClick}>
            <img src={getSrc("html-icon")} />
            <h1>{`${props.name}.jsx`}</h1>
        </div>
    );
};