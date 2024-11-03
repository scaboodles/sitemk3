'use client';
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import "./resumeStyle.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export const ResumeGuts = () => {
    return(
        <div style={{height: '100%', backgroundColor:'white'}}>
            <br/>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '5%', paddingRight: '5%'}}>
                <a href="/images/OwenWolffResumeFall2024.pdf" download className='fakeButton clickable' >Download</a>
                <a href="/images/OwenWolffResumeFall2024.pdf" target="_blank" rel="noopener noreferrer" className='fakeButton clickable' >View in Browser</a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', backgroundColor:'white'}}>
                <Document file={"/images/OwenWolffResumeFall2024.pdf"} onLoadError={console.error} >
                    <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false}/>
                </Document>
            </div>
        </div>
    )
}