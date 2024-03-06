import { Router } from '@angular/router';
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
} from '@angular/core';

import cornerstoneTools from 'cornerstone-tools';
import * as cornerstone from 'cornerstone-core';
import * as dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
// import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader/dist/dynamic-import/cornerstoneWADOImageLoader.min.js';
import cornerstoneMath from 'cornerstone-math';
import 'hammerjs';
import { UploadFileService } from '../services/upload-file.service';

var config = {
  webWorkerPath:
    '/assets/cornerstone/webworkers/cornerstoneWADOImageLoaderWebWorker.js',
  taskConfiguration: {
    decodeTask: {
      codecsPath:
        '/assets/cornerstone/codecs/cornerstoneWADOImageLoaderCodecs.js',
    },
  },
};
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

@Component({
  selector: 'app-radiologys',
  templateUrl: './radiologys.component.html',
  styleUrls: ['./radiologys.component.css'],
})
export class RadiologysComponent implements OnInit {
  constructor(
    private router: Router,
    private uploadService: UploadFileService
  ) {}
  conditionView: number = 1;

  activateTools(toolActive: string) {
    const element = document.getElementById('element');

    const LengthTool = cornerstoneTools.LengthTool;
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    const RotateTool = cornerstoneTools.RotateTool;
    const WwwcTool = cornerstoneTools.WwwcTool; // brillo
    const PanTool = cornerstoneTools.PanTool; // mover img por el canvas
    const AngleTool = cornerstoneTools.AngleTool;
    const BidirectionalTool = cornerstoneTools.BidirectionalTool; // crea una cruz tipo lenghtTool
    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool; // crea lineas a partir de otras (no para hatsa llegar al punto de inico)
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool; // rectangulo calcula el area
    const TextMarkerTool = cornerstoneTools.TextMarkerTool; // mark perzonalites

    cornerstone.enable(element);

    switch (toolActive) {
      case 'Length':
        cornerstoneTools.addTool(LengthTool);
        cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
        break;

      case 'EllipticalRoi':
        cornerstoneTools.addTool(EllipticalRoiTool);
        cornerstoneTools.setToolActive('EllipticalRoi', { mouseButtonMask: 1 });
        break;

      case 'ArrowAnnotate':
        cornerstoneTools.addTool(ArrowAnnotateTool);
        cornerstoneTools.setToolActive('ArrowAnnotate', { mouseButtonMask: 1 });
        break;

      case 'FreehandRoi':
        cornerstoneTools.addTool(FreehandRoiTool);
        cornerstoneTools.setToolActive('FreehandRoi', { mouseButtonMask: 1 });
        break;

      case 'Rotate':
        cornerstoneTools.addTool(RotateTool);
        cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 1 });
        break;

      case 'Wwwc':
        cornerstoneTools.addTool(WwwcTool);
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
        break;

      case 'Pan':
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
        break;

      case 'Angle':
        cornerstoneTools.addTool(AngleTool);
        cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 });
        break;

      case 'Bidirectional':
        cornerstoneTools.addTool(BidirectionalTool);
        cornerstoneTools.setToolActive('Bidirectional', { mouseButtonMask: 1 });
        break;

      case 'RectangleRoi':
        cornerstoneTools.addTool(RectangleRoiTool);
        cornerstoneTools.setToolActive('RectangleRoi', { mouseButtonMask: 1 });
        break;

      case 'TextMarker':
        const configuration = {
          markers: ['F5', 'F4', 'F3', 'F2', 'F1'],
          current: 'Double click to change text',
          ascending: true,
          loop: true,
        };
        cornerstoneTools.addTool(TextMarkerTool, { configuration });
        cornerstoneTools.setToolActive('TextMarker', { mouseButtonMask: 1 });
        break;

      default:
        console.log('No such day exists!');
        break;
    }
  }

  colorToolsInactive: any;
  colorToolsActive: any;
  changeColorTools() {
    // Set color for inactive tools
    cornerstoneTools.toolColors.setToolColor(this.colorToolsInactive);
    // Set color for active tools
    cornerstoneTools.toolColors.setActiveColor(this.colorToolsActive);
  }

  fuenteSelecioanda: string = '';
  sizeFont: number = 16;
  lineWidhtTool: number = 1;
  changeTextCornerstone() {
    switch (this.fuenteSelecioanda) {
      case 'Aboreto':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Aboreto`);
        break;
      case 'Audiowide':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Audiowide`);
        break;
      case 'Bangers':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Bangers`);
        break;
      case 'Bungee Shade':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Bungee Shade`);
        break;
      case 'Londrina Outline':
        cornerstoneTools.textStyle.setFont(
          `${this.sizeFont}px Londrina Outline`
        );
        break;
      case 'Megrim':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Megrim`);
        break;
      case 'Metamorphous':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Metamorphous`);
        break;
      case 'Noto Serif HK':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Noto Serif HK`);
        break;
      case 'Play':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Play`);
        break;
      case 'Poiret One':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Poiret One`);
        break;
      case 'Redacted Script':
        cornerstoneTools.textStyle.setFont(
          `${this.sizeFont}px Redacted Script`
        );
        break;
      case 'Slackey':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Slackey`);
        break;
      case 'Solitreo':
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px Solitreo`);
        break;
      case 'UnifrakturMaguntia':
        cornerstoneTools.textStyle.setFont(
          `${this.sizeFont}px UnifrakturMaguntia`
        );
        break;
      case 'Zilla Slab Highlight':
        cornerstoneTools.textStyle.setFont(
          `${this.sizeFont}px Zilla Slab Highlight`
        );
        break;

      default:
        const fontFamily =
          'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
        cornerstoneTools.textStyle.setFont(`${this.sizeFont}px ${fontFamily}`);
        break;
    }
  }
  onlyLineWidthToolCornerstone() {
    cornerstoneTools.toolStyle.setToolWidth(this.lineWidhtTool);
  }

  Tools() {
    // Style de tools
    const fontFamily =
      'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';

    cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);
    // Set the tool width
    cornerstoneTools.toolStyle.setToolWidth(1);
    // Set color for inactive tools
    cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
    // Set color for active tools
    cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

    // Despligue de herramientas
    // const element = document.getElementById('element');

    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool; // zoom
    const EraserTool = cornerstoneTools.EraserTool; // borrador
    const MagnifyTool = cornerstoneTools.MagnifyTool; // lupa
    const ScaleOverlayTool = cornerstoneTools.ScaleOverlayTool; // escala
    const OrientationMarkersTool = cornerstoneTools.OrientationMarkersTool; // letras de orientacion

    cornerstoneTools.addTool(ZoomMouseWheelTool);
    cornerstoneTools.addTool(EraserTool);
    cornerstoneTools.addTool(MagnifyTool);
    cornerstoneTools.addTool(ScaleOverlayTool);
    cornerstoneTools.addTool(OrientationMarkersTool);

    //herramientas activas por defecto
    cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 0 }); // rueda de maus
    cornerstoneTools.setToolActive('Magnify', { mouseButtonMask: 4 }); // boton rueda
    cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 2 }); //  click derecho
    cornerstoneTools.setToolActive('ScaleOverlay', { mouseButtonMask: 0 });
    cornerstoneTools.setToolActive('OrientationMarkers', {
      mouseButtonMask: 0,
    });
  }

  file: File;
  file2: File;

  files(event: any): any {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init();

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand: true,
      webWorkerPath: 'cornerstoneWADOImageLoaderWebWorker.min.js',
      taskConfiguration: {
        decodeTask: {
          loadCodecsOnStartup: true,
          initializeCodecsOnStartup: false,
          codecsPath: 'cornerstoneWADOImageLoaderCodecs.min.js',
        },
      },
    });

    var element = document.getElementById('element');

    this.file = <File>event.target.files[0];

    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(
      this.file
    );
    console.log('-file:', this.file);
    console.log('ImageIDs: ', imageId);

    cornerstone.enable(element);
    this.Tools();

    cornerstone
      .loadImage(imageId)
      .then((image) => {
        // image.windowWidth = 400;
        // image.windowCenter = 60;

        cornerstone.displayImage(element, image);
        console.log(image);
      })
      .catch((e) => console.log(e));
  }

  // prueba de stack Img
  stackDicom(event: any): any {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init({
      showSVGCursors: true,
    });

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand: true,
      webWorkerPath: 'cornerstoneWADOImageLoaderWebWorker.min.js',
      taskConfiguration: {
        decodeTask: {
          loadCodecsOnStartup: true,
          initializeCodecsOnStartup: false,
          codecsPath: 'cornerstoneWADOImageLoaderCodecs.min.js',
        },
      },
    });

    var element = document.getElementById('element');
    cornerstone.enable(element);
    this.Tools();

    // Grab a cursor
    const cursors = cornerstoneTools.import('tools/cursors');
    const cursor = cursors.arrowAnnotateCursor; // `MouseCursor` class

    // Create and display cursor image
    const cursorImg = document.createElement('img');
    // const cursorImgUrl = window.URL.createObjectURL(cursor.iconSVG);
    const cursorImgUrl = 'http://www.w3.org/2000/svg';

    cursorImg.src = cursorImgUrl;
    document.querySelector('body').appendChild(cursorImg);

    // Create and display cursor image w/ pointer
    const cursorImgPointer = document.createElement('img');
    // const cursorImgPointerUrl = window.URL.createObjectURL(cursor.blob);
    const cursorImgPointerUrl = 'http://www.w3.org/2000/svg';

    cursorImgPointer.src = cursorImgPointerUrl;
    document.querySelector('body').appendChild(cursorImgPointer);

    this.file = <File>event.target.files;

    const imageIds = [];
    Array.prototype.forEach.call(this.file, function (file) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      imageIds.push(imageId);
    });

    // Add our tool, and set it's mode
    const StackScrollTool = cornerstoneTools.StackScrollTool;

    //define the stack
    const stack = {
      currentImageIdIndex: 0,
      imageIds: imageIds,
    };

    // load images and set the stack
    cornerstone
      .loadImage(imageIds[0])
      .then((image) => {
        cornerstone.displayImage(element, image);
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
      })
      .catch((e) => console.log(e));

    cornerstoneTools.addTool(StackScrollTool);
    cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 2 });
  }

  // pruebas de Syncronisacion
  @ViewChild('input1', { read: ElementRef }) input1: ElementRef;
  @ViewChild('input2', { read: ElementRef }) input2: ElementRef;
  SyncCornerstone(): any {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init({
      showSVGCursors: true,
      globalToolSyncEnabled: true,
    });

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    var firstElement = document.getElementById('element1');
    var secondElement = document.getElementById('element2');
    const elements = [firstElement, secondElement];

    //first Img Radiologi
    this.file = this.input1.nativeElement.files;
    const imageIds = [];

    Array.prototype.forEach.call(this.file, function (file: any) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      imageIds.push(imageId);
    });

    //Second Stack radiology
    this.file2 = this.input2.nativeElement.files;
    const imageIds2 = [];

    Array.prototype.forEach.call(this.file2, function (file: any) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      imageIds2.push(imageId);
    });

    const firstStack = {
      currentImageIdIndex: 0,
      imageIds: imageIds,
    };

    const secondStack = {
      currentImageIdIndex: 0,
      imageIds: imageIds2,
    };

    // Create the synchronizer
    const synchronizer = new cornerstoneTools.Synchronizer(
      // Cornerstone event that should trigger synchronizer
      'cornerstonenewimage',
      // Logic that should run on target elements when event is observed on source elements
      cornerstoneTools.updateImageSynchronizer
    );
    const synchronizer2 = new cornerstoneTools.Synchronizer(
      'cornerstoneimagerendered',
      cornerstoneTools.wwwcSynchronizer,
      // cornerstoneTools.panZoomSynchronizer
    );

    elements.forEach((element) => {
      cornerstone.enable(element);
    });

    // Add and activate tools
    cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
    cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
    // cornerstoneTools.addTool(cornerstoneTools.PanTool);


    cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
    cornerstoneTools.setToolActive('StackScrollMouseWheel', {});

    // load images and set the stack
    const firstLoadImagePromise = cornerstone
      .loadImage(firstStack.imageIds[0])
      .then((image) => {
        cornerstone.displayImage(firstElement, image);

        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 2 });
        // cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 })
        synchronizer2.add(firstElement);

        // set the stack as tool state
        synchronizer.add(firstElement);
        cornerstoneTools.addStackStateManager(firstElement, [
          'stack',
          'Crosshairs',
        ]);
        cornerstoneTools.addToolState(firstElement, 'stack', firstStack);
      });

    const secondLoadImagePromise = cornerstone
      .loadImage(secondStack.imageIds[0])
      .then((image) => {
        cornerstone.displayImage(secondElement, image);

        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 2 });
        // cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 })
        synchronizer2.add(secondElement);

        // set the stack as tool state
        synchronizer.add(secondElement);
        cornerstoneTools.addStackStateManager(secondElement, [
          'stack',
          'Crosshairs',
        ]);
        cornerstoneTools.addToolState(secondElement, 'stack', secondStack);
      });

    // After images have loaded, and our sync context has added both elements
    Promise.all([firstLoadImagePromise, secondLoadImagePromise]).then(() => {
      cornerstoneTools.addTool(cornerstoneTools.ReferenceLinesTool);
      cornerstoneTools.setToolEnabled('ReferenceLines', {
        synchronizationContext: synchronizer,
      });
    });
  }

  changeColorXray(color: string) {
    var element = document.getElementById('element');

    // cornerstone.displayImage(element, image);
    var viewport = {
      invert: false,
      pixelReplication: false,
      voi: {
        windowWidth: 400,
        windowCenter: 60,
      },
      scale: 1.4,
      translation: {
        x: 0,
        y: 0,
      },
      colormap: color,
    };

    cornerstone.setViewport(element, viewport);
    cornerstone.updateImage(element);
  }

  isInvierte: boolean = false;
  // invierte colores de negro y blanco
  invertXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        invert: this.isInvierte,
        translation: {
          x: 0,
          y: 0,
        },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }

  isPixel: boolean = false;
  // pixela la imagen (se usa para distinguir cuando hay mucho zoom)
  pixelXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        pixelReplication: this.isPixel,
        translation: {
          x: 0,
          y: 0,
        },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }

  isFlipH: boolean = false;
  // imagen se voltea horizontalmente
  flipHXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        hflip: this.isFlipH, // verdadero si la imagen se voltea horizontalmente
        translation: {
          x: 0,
          y: 0,
        },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }

  isFlipV: boolean = false;
  // imagen se voltea verticalmente
  flipVXray() {
    var element = document.getElementById('element');
    setTimeout(() => {
      var viewport = {
        vflip: this.isFlipV, // si la imagen se voltea verticalmente
        translation: {
          x: 0,
          y: 0,
        },
      };
      cornerstone.setViewport(element, viewport);
      cornerstone.updateImage(element);
    }, 100);
  }

  //prueba inicial de cornestrone EN DESUSO
  initCornerstone() {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.init();

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    var element = document.getElementById('element');

    cornerstone.enable(element);
    this.Tools();

    cornerstone
      .loadAndCacheImage('wadouri:' + '../../assets/IM222')
      .then((imageData) => {
        console.log(imageData);
        cornerstone.displayImage(element, imageData);

        //   var viewport = {
        //   invert: false,
        //   pixelReplication: false,
        //   voi: {
        //     windowWidth: 400,
        //     windowCenter: 60,
        //   },
        //   scale: 1.1,
        //   translation: {
        //     x: 0,
        //     y: 0,
        //   },
        //   // colormap: 'hot',
        // };

        // cornerstone.setViewport(element, viewport);
        // cornerstone.updateImage(element);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ngOnInit(): void {}

  // SyncCornerstone() {
  //   cornerstoneTools.external.cornerstone = cornerstone;
  //   cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  //   cornerstoneTools.external.Hammer = Hammer;
  //   cornerstoneTools.init({
  //     showSVGCursors: true,
  //     globalToolSyncEnabled: true,
  //   });

  //   cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  //   cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  //   var firstElement = document.getElementById('element1');
  //   var secondElement = document.getElementById('element2');
  //   const elements = [firstElement, secondElement];

  //   // image enable the dicomImage element and add canvas to it
  //   elements.forEach(element => {
  //     cornerstone.enable(element);
  //   });

  //   // Enable our elements
  //   const scheme = 'wadouri';
  //   // Create our Stack data
  //   const firstSeries = ['../../assets/Dicom/cuerpo/IM0'];

  //   const secondSeries = [
  //     '../../assets/Dicom/xr/IM0',
  //     '../../assets/Dicom/xr/IM1',
  //     '../../assets/Dicom/xr/IM2',
  //     '../../assets/Dicom/xr/IM3',
  //     '../../assets/Dicom/xr/IM4',
  //     '../../assets/Dicom/xr/IM5',
  //     '../../assets/Dicom/xr/IM6',
  //     '../../assets/Dicom/xr/IM7',
  //     '../../assets/Dicom/xr/IM8',
  //     '../../assets/Dicom/xr/IM9',
  //     '../../assets/Dicom/xr/IM10',
  //     '../../assets/Dicom/xr/IM11',
  //     '../../assets/Dicom/xr/IM12',
  //     '../../assets/Dicom/xr/IM13',
  //     '../../assets/Dicom/xr/IM14',
  //     '../../assets/Dicom/xr/IM15',
  //     '../../assets/Dicom/xr/IM16',
  //     '../../assets/Dicom/xr/IM17',
  //     '../../assets/Dicom/xr/IM18',
  //     '../../assets/Dicom/xr/IM19',
  //     '../../assets/Dicom/xr/IM20',
  //   ];

  //   const firstStack = {
  //     currentImageIdIndex: 0,
  //     imageIds: firstSeries.map((seriesImage) => `${scheme}:${seriesImage}`),
  //   };

  //   const secondStack = {
  //     currentImageIdIndex: 0,
  //     imageIds: secondSeries.map((seriesImage) => `${scheme}:${seriesImage}`),
  //   };

  //   // Create the synchronizer
  //   const synchronizer = new cornerstoneTools.Synchronizer(
  //     // Cornerstone event that should trigger synchronizer
  //     'cornerstonenewimage',
  //     // Logic that should run on target elements when event is observed on source elements
  //     cornerstoneTools.updateImageSynchronizer
  //   );

  //   // Add and activate tools
  //   cornerstoneTools.addTool(cornerstoneTools.StackScrollTool);
  //   cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);

  //   cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
  //   cornerstoneTools.setToolActive('StackScrollMouseWheel', {});

  //   // load images and set the stack
  //   const firstLoadImagePromise = cornerstone
  //     .loadImage(firstStack.imageIds[0])
  //     .then((image) => {
  //       cornerstone.displayImage(firstElement, image);

  //       // set the stack as tool state
  //       synchronizer.add(firstElement);
  //       cornerstoneTools.addStackStateManager(firstElement, [
  //         'stack',
  //         'Crosshairs',
  //       ]);
  //       cornerstoneTools.addToolState(firstElement, 'stack', firstStack);
  //     });

  //   const secondLoadImagePromise = cornerstone
  //     .loadImage(secondStack.imageIds[0])
  //     .then((image) => {
  //       cornerstone.displayImage(secondElement, image);

  //       // set the stack as tool state
  //       synchronizer.add(secondElement);
  //       cornerstoneTools.addStackStateManager(secondElement, [
  //         'stack',
  //         'Crosshairs',
  //       ]);
  //       cornerstoneTools.addToolState(secondElement, 'stack', secondStack);
  //     });

  //   // After images have loaded, and our sync context has added both elements
  //   Promise.all([firstLoadImagePromise, secondLoadImagePromise]).then(() => {
  //     cornerstoneTools.addTool(cornerstoneTools.ReferenceLinesTool);
  //     cornerstoneTools.setToolEnabled('ReferenceLines', {synchronizationContext: synchronizer,});
  //   });
  // }
}

/* modificado --> node_modules/dicom-parser/index.d.ts:104:92
 */
