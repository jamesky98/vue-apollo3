<template>
  <div id="pageContainer" class="overflow-auto">
    <div id="viewer" class="pdfViewer"></div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import 'pdfjs-dist/web/pdf_viewer.css';

const pdfDialogOpen = () => {
  nextTick(async () => {
    // 指定workerSrc屬性
    // pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
    
    const loadingTask = await pdfjsLib.getDocument({
      // url: state.currentPdfItem.url,
      url: '/test.pdf',
      cMapUrl: '../../node_modules/pdfjs-dist/cmaps',
      cMapPacked: true,
      enableXfa: true
    });
    let pdf = await loadingTask.promise;
    for (let i = 1; i <= pdf.numPages; i++) {
      renderPage(pdf, i)
    }

    console.log('pdfjsLib', pdfjsLib)
    console.log('PDFJSViewer', PDFJSViewer)

  })
}

const renderPage = (pdfDoc, pageNumber) => {
  pdfDoc.getPage(pageNumber).then((page) => {
    const pdfPageView = new PDFJSViewer.PDFPageView({
      container: document.getElementById("pageContainer"),
      id: pageNumber,
      scale: 1,
      eventBus: new PDFJSViewer.EventBus(),
      defaultViewport: page.getViewport({ scale: 1 }),
      annotationLayerFactory: new PDFJSViewer.DefaultAnnotationLayerFactory(),
      renderInteractiveForms: true
    })
    pdfPageView.setPdfPage(page)
    pdfPageView.draw()
  })
}


onMounted(() => {
  pdfDialogOpen();
});
</script>
<style>

#pageContainer {
  /* margin: auto; */
  width: 80%;
  height: 100%;
}

div.page {
  display: inline-block;
}

</style>
