'use client';
import React, { useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import "./resumeStyle.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export const ResumeGuts = () => {
    useEffect(() => {
        const handlePdfLinks = () => {
            const pdfLinks = document.querySelectorAll('.react-pdf__Page__annotations .linkAnnotation > a');
            pdfLinks.forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
        };
        
        const timer = setTimeout(handlePdfLinks, 100);
        return () => clearTimeout(timer);
    }, []);

    return(
        <div style={{height: '100%', backgroundColor:'white'}}>
            <br/>
            <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    width: '100%', 
                    paddingLeft: '5%', 
                    paddingRight: '5%',
                    textAlign: 'center',
                }}>
                <a href="/images/OwenWolffResumeFall2025.pdf" download className='fakeButton clickable' >Download</a>
                <a href="/images/OwenWolffResumeFall2025.pdf" target="_blank" rel="noopener noreferrer" className='fakeButton clickable' >View in Browser</a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', backgroundColor:'white'}}>
                <Document file={"/images/OwenWolffResumeFall2025.pdf"} onLoadError={console.error} >
                    <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={true}/>
                </Document>
            </div>
        </div>
    )
}