import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Color, ScaleType, TooltipService } from '@swimlane/ngx-charts';
import { DiseasesService } from '../services/diseases.service';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FileService } from '../services/file.service';

//Alertas sweealert
import Swal from 'sweetalert2';

//Cornerstone
import cornerstoneTools from 'cornerstone-tools';
import * as cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import cornerstoneMath from 'cornerstone-math';
import 'hammerjs';

import * as cornerstone1 from '@cornerstonejs/core';
import * as cornerstoneTools1 from '@cornerstonejs/tools';
import * as cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import initDemo from 'src/app/utils/initDemo';
import setCtTransferFunctionForVolumeActor from 'src/app/utils/setCtTransferFunctionForVolumeActor';
import addDropdownToToolbar from 'src/app/utils/addDropdownToToolbar';


cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;

var config = {
  maxWebWorkers: navigator.hardwareConcurrency || 1,
  startWebWorkersOnDemand: false,
  taskConfiguration: {
    decodeTask: {
      initializeCodecsOnStartup: true,
      strict: false,
    },
  },
};

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

// detects gpu and decides whether to use gpu rendering or cpu fallback
cornerstone1.init();
cornerstoneTools1.init();


const {
      ToolGroupManager,
      Enums: csToolsEnums,
      CrosshairsTool,
      StackScrollMouseWheelTool,
      ZoomTool,
    } = cornerstoneTools1;

    const { MouseBindings } = csToolsEnums;

    const volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
    const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
    const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id
    const toolGroupId = 'CROSSHAIRS_ID';

    const viewportId1 = 'CT_AXIAL';
    const viewportId2 = 'CT_SAGITTAL';
    const viewportId3 = 'CT_CORONAL';

    const renderingEngineId = 'MPR_ID';
    // Define tool groups to add the segmentation display tool to
    const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

@Component({
  selector: 'app-resonance',
  templateUrl: './resonance.component.html',
  styleUrls: ['./resonance.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ResonanceComponent implements OnInit {
  constructor(
    private diseasesService: DiseasesService,
    private fileService: FileService
  ) {}

  @Output() dicomFilesEvent = new EventEmitter<File[]>();

  //>>>>>>> Variables photo
  viewUpload: boolean = true;
  viewRadiology: boolean = false;

  file!: File;
  photoSelected!: string | ArrayBuffer | null;
  hiddenTxt: boolean = true;
  hiddenSpinner: boolean = false;
  displayButton: boolean = true;

  // Upload photo
  onPhotoSelected(event: any): any {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files;
      this.photoSelected = '../../assets/imgs/giphy.gif';

      // hiddens
      this.hiddenTxt = false;
      this.displayButton = false;
    }
  }

  // Bar progress
  loading() {
    this.hiddenSpinner = true;
    setTimeout(() => {
      // console.log('hello');
      // this.files(this.file);
      this.stackDicom(this.file);
    }, 500);
    this.viewUpload = false;
    this.viewRadiology = true;
    this.MiniTutorial();
  }
  // <<<<<<<<<

  diseases: any[] = [];

  // Options Horizontal Bar
  view: [number, number]; // [view]="view"
  onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }


  // Obtener datos
  get single() {
    return this.diseasesService.diseasesData;
  }

  // Ejes X labels formateado a 0%
  formatPercent(val: any) {
    return val + '%';
  }

  // Datos seleccionados




  CtrlActive: boolean = false;
  desactiveAltKey() {
    this.CtrlActive = false;

    const {ZoomTool}=cornerstoneTools1; // zoom

    cornerstoneTools1.addTool(ZoomTool);
    toolGroup.addTool(ZoomTool.toolName)
    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Auxiliary }],
    });
    toolGroup.addViewport(viewportId1,renderingEngineId);
    toolGroup.addViewport(viewportId2,renderingEngineId);
    toolGroup.addViewport(viewportId3,renderingEngineId);
  }


  //Borra las herramientas selecionadas (Tool Management)
  opciones = [
    { texto: 'Length', seleccionado: false },
    { texto: 'EllipticalRoi', seleccionado: false },
    { texto: 'Angle', seleccionado: false },
    { texto: 'Bidirectional', seleccionado: false },
    { texto: 'RectangleRoi', seleccionado: false },
    { texto: 'ArrowAnnotate', seleccionado: false },
    { texto: 'TextMarker', seleccionado: false },
    { texto: 'FreehandRoi', seleccionado: false },
    { texto: 'CobbAngle', seleccionado: false },
    { texto: 'Probe', seleccionado: false },
    { texto: 'All', seleccionado: false },
  ];

  seleccionados: any[] = [];
  toolSelectToDelete() {
    this.seleccionados = this.opciones.filter((opcion) => opcion.seleccionado);
    var element = document.getElementById('element');
    cornerstone.enable(element);

    if (this.opciones[0].seleccionado == true) {
      this.opciones.forEach((e) => {
        cornerstoneTools.clearToolState(element, e.texto);
      });
    } else {
      this.seleccionados.forEach((e) => {
        cornerstoneTools.clearToolState(element, e.texto);
      });
    }
    cornerstone.updateImage(element);

    this.opciones.forEach((e) => (e.seleccionado = false));
  }

  activateTools(toolActive: string) {
    const LengthTool = cornerstoneTools.LengthTool;
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    const RotateTool = cornerstoneTools.RotateTool;
    const WwwcTool = cornerstoneTools.WwwcTool; // brillo
    const AngleTool = cornerstoneTools.AngleTool;
    const BidirectionalTool = cornerstoneTools.BidirectionalTool; // crea una cruz tipo lenghtTool
    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool; // crea lineas a partir de otras (no para hatsa llegar al punto de inico)
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool; // rectangulo calcula el area
    const EraserTool = cornerstoneTools.EraserTool; // borrador
    const StackScrollTool = cornerstoneTools.StackScrollTool; // Add our tool, and set it's mode
    const CobbAngleTool = cornerstoneTools.CobbAngleTool; // amgules cobb
    const TextMarkerTool = cornerstoneTools.TextMarkerTool; // mark perzonalites
    const ProbeTool = cornerstoneTools.ProbeTool; // marks
    const WwwcRegionTool = cornerstoneTools.WwwcRegionTool;

    try {
      switch (toolActive) {
        case 'Length':
          cornerstoneTools.addTool(LengthTool);
          cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
          break;

        case 'EllipticalRoi':
          cornerstoneTools.addTool(EllipticalRoiTool);
          cornerstoneTools.setToolActive('EllipticalRoi', {
            mouseButtonMask: 1,
          });
          break;

        case 'ArrowAnnotate':
          cornerstoneTools.addTool(ArrowAnnotateTool);
          cornerstoneTools.setToolActive('ArrowAnnotate', {
            mouseButtonMask: 1,
          });
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

        case 'Eraser':
          cornerstoneTools.addTool(EraserTool);
          cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 1 });
          break;

        case 'Angle':
          cornerstoneTools.addTool(AngleTool);
          cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 });
          break;

        case 'Bidirectional':
          cornerstoneTools.addTool(BidirectionalTool);
          cornerstoneTools.setToolActive('Bidirectional', {
            mouseButtonMask: 1,
          });
          break;

        case 'RectangleRoi':
          cornerstoneTools.addTool(RectangleRoiTool);
          cornerstoneTools.setToolActive('RectangleRoi', {
            mouseButtonMask: 1,
          });
          break;

        case 'FreehandRoi':
          cornerstoneTools.addTool(FreehandRoiTool);
          cornerstoneTools.setToolActive('FreehandRoi', { mouseButtonMask: 1 });
          break;

        case 'CobbAngle':
          cornerstoneTools.addTool(CobbAngleTool);
          cornerstoneTools.setToolActive('CobbAngle', { mouseButtonMask: 1 });
          break;

        case 'StackScroll':
          cornerstoneTools.addTool(StackScrollTool);
          cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
          break;

        case 'Probe':
          cornerstoneTools.addTool(ProbeTool);
          cornerstoneTools.setToolActive('Probe', { mouseButtonMask: 1 });
          break;

        case 'WwwcRegion':
          cornerstoneTools.addTool(WwwcRegionTool);
          cornerstoneTools.setToolActive('WwwcRegion', { mouseButtonMask: 1 });
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
          Swal.fire(
            "Don't found",
            'Tool not found / or could an error occur',
            'error'
          );
          break;
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }


  //Herramientas por defecto activas
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

    // herramientas activadas
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool; // zoom
    const EraserTool = cornerstoneTools.EraserTool; // borrador
    const MagnifyTool = cornerstoneTools.MagnifyTool; // lupa
    const ScaleOverlayTool = cornerstoneTools.ScaleOverlayTool; // escala
    const OrientationMarkersTool = cornerstoneTools.OrientationMarkersTool; // letras de orientacion

    //para mouse avanzaados
    const RotateTool = cornerstoneTools.RotateTool; // rotar imagen
    const PanTool = cornerstoneTools.PanTool; // mover img por el canvas

    //toll activa por defecto
    const LengthTool = cornerstoneTools.LengthTool;

    //primera toll activa
    cornerstoneTools.addTool(LengthTool);
    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });

    cornerstoneTools.addTool(RotateTool);
    cornerstoneTools.addTool(PanTool);

    cornerstoneTools.addTool(ZoomMouseWheelTool);
    cornerstoneTools.addTool(EraserTool);
    cornerstoneTools.addTool(MagnifyTool);
    cornerstoneTools.addTool(ScaleOverlayTool);
    cornerstoneTools.addTool(OrientationMarkersTool);

    //herramientas activas por defecto
    cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 8 }); // Browser Back No funciona
    cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 16 }); // Browser Forward No funciona

    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 }); // mover
    cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 0 }); // rueda de maus
    cornerstoneTools.setToolActive('Magnify', { mouseButtonMask: 4 }); // boton rueda
    cornerstoneTools.setToolActive('ScaleOverlay', { mouseButtonMask: 0 });
    cornerstoneTools.setToolActive('OrientationMarkers', {
      mouseButtonMask: 0,
    });
  }



  //DESDE AQUI COMIENZA TODA LA PROGRAMACIÓN PARA LA VISUALIZACIÓN DE LAS IMAGENES MEDICAS Y CREACION DE LA VENTANA MULTIPLANAR

  // funcion de ver por stack varios dicom

  async stackDicom(uploadFiles: any): Promise<any> {
    this.hiddenSpinner = false;
    const useCPU = false;
    const useVolume = true;
    const shouldUseSharedArrayBuffer = false;
    const initWebWorkers = false;
    const loadSlices = true;
    /////////////////////

    let description = 'useCPU: ' + useCPU + '\n';
    description += 'useVolume: ' + useVolume + '\n';
    description += 'initWebWorkers: ' + initWebWorkers + '\n';
    description += 'loadSlices: ' + loadSlices + '\n';
    description +=
      'Should use SharedArrayBuffer: ' + shouldUseSharedArrayBuffer + '\n';
    description += 'Cross-origin isolated: ' + self.crossOriginIsolated + '\n';
    if (shouldUseSharedArrayBuffer && !self.crossOriginIsolated) {
      description +=
        'NOTE: the above configuration will NOT use SharedArrayBuffer\n';
    }
    cornerstone1.setUseSharedArrayBuffer(shouldUseSharedArrayBuffer);

    if (useCPU) {
      cornerstone1.setUseCPURendering(true);
    }

    cornerstone1.init();
    cornerstoneTools1.init();


    const { MouseBindings } = csToolsEnums;
    const { ViewportType } = cornerstone1.Enums;

    //SERVICIO PARA ENVIAR LAS IMAGENES DICOM HACIA EL SERVIDOR FILEZILLA
    this.fileService.setDicomFiles(uploadFiles);
    //FIN SERVICIO PARA ENVIAR LAS IMAGENES DICOM HACIA EL SERVIDOR FILEZILLA

    // Define a unique id for the volume

    const element1 = document.getElementById('element1') as HTMLDivElement;
    const element2 = document.getElementById('element2') as HTMLDivElement;
    const element3 = document.getElementById('element3') as HTMLDivElement;

    element1.style.width = '600px';
    element1.style.height = '600px';
    element2.style.width = '300px';
    element2.style.height = '300px';
    element3.style.width = '300px';
    element3.style.height = '300px';
    // Disable right click context menu so we can have right click tools
    element1.oncontextmenu = (e) => e.preventDefault();
    element2.oncontextmenu = (e) => e.preventDefault();
    element3.oncontextmenu = (e) => e.preventDefault();

    // Add our tool, and set it's mode


    const viewportColors = {
      [viewportId1]: 'rgb(200, 0, 0)',
      [viewportId2]: 'rgb(200, 200, 0)',
      [viewportId3]: 'rgb(0, 200, 0)',
    };

    const viewportReferenceLineControllable = [
      viewportId1,
      viewportId2,
      viewportId3,
    ];

    const viewportReferenceLineDraggableRotatable = [
      viewportId1,
      viewportId2,
      viewportId3,
    ];

    const viewportReferenceLineSlabThicknessControlsOn = [
      viewportId1,
      viewportId2,
      viewportId3,
    ];

    function getReferenceLineColor(viewportId) {
      return viewportColors[viewportId];
    }

    function getReferenceLineControllable(viewportId) {
      const index = viewportReferenceLineControllable.indexOf(viewportId);
      return index !== -1;
    }

    function getReferenceLineDraggableRotatable(viewportId) {
      const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
      return index !== -1;
    }

    function getReferenceLineSlabThicknessControlsOn(viewportId) {
      const index =
        viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
      return index !== -1;
    }

    let externalViewport = null;


    // Init Cornerstone and related libraries
    await initDemo();

    // Add tools to Cornerstone3D
    cornerstoneTools1.addTool(StackScrollMouseWheelTool);
    cornerstoneTools1.addTool(CrosshairsTool);

    // Get Cornerstone imageIds for the source data and fetch metadata into RAM
    const imageIds = [];

    Array.prototype.forEach.call(uploadFiles, function (file) {
      const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
      imageIds.push(imageId);
    });

    cornerstoneDICOMImageLoader.wadouri.dataSetCacheManager.purge();
    cornerstone.registerImageLoader('custom', (imageId: string) => {
      const filename = imageId.substring('custom:'.length);
      return cornerstoneDICOMImageLoader.wadouri.loadImage(imageId, {
        loader: () => {
          console.log(filename);
          return fetch('/' + filename).then((r) => r.arrayBuffer());
        },
        preScale: {
          enabled: true,
        },
      });
    });

    if (loadSlices) {
      for (let i = 0; i < imageIds.length; ++i) {
        await cornerstone1.imageLoader.loadImage(imageIds[i]);
      }
    }
    // Define a volume in memory
    const volume = await cornerstone1.volumeLoader.createAndCacheVolume(
      volumeId,
      {
        imageIds,
      }
    );

    // Instantiate a rendering engine
    const renderingEngine = new cornerstone1.RenderingEngine(renderingEngineId);

    // Create the viewports
    const viewportInputArray = [
      {
        viewportId: viewportId1,
        type: ViewportType.ORTHOGRAPHIC,
        element: element1,
        defaultOptions: {
          orientation: cornerstone1.Enums.OrientationAxis.AXIAL,
          background: <cornerstone1.Types.Point3>[0, 0, 0],
        },
      },
      {
        viewportId: viewportId2,
        type: ViewportType.ORTHOGRAPHIC,
        element: element2,
        defaultOptions: {
          orientation: cornerstone1.Enums.OrientationAxis.SAGITTAL,
          background: <cornerstone1.Types.Point3>[0, 0, 0],
        },
      },
      {
        viewportId: viewportId3,
        type: ViewportType.ORTHOGRAPHIC,
        element: element3,
        defaultOptions: {
          orientation: cornerstone1.Enums.OrientationAxis.CORONAL,
          background: <cornerstone1.Types.Point3>[0, 0, 0],
        },
      },
    ];

    renderingEngine.setViewports(viewportInputArray);

    // Set the volume to load
    volume['load']();

    if (externalViewport !== null) {
      externalViewport.setVolumes([{ volumeId }]);
    }

    // Set volumes on the viewports
    await cornerstone1.setVolumesForViewports(
      renderingEngine,
      [
        {
          volumeId,
          callback: setCtTransferFunctionForVolumeActor,
        },
      ],
      [viewportId1, viewportId2, viewportId3]
    );



    // For the crosshairs to operate, the viewports must currently be
    // added ahead of setting the tool active. This will be improved in the future.
    toolGroup.addViewport(viewportId1, renderingEngineId);
    toolGroup.addViewport(viewportId2, renderingEngineId);
    toolGroup.addViewport(viewportId3, renderingEngineId);

    // Manipulation Tools
    toolGroup.addTool(StackScrollMouseWheelTool.toolName);
    // Add Crosshairs tool and configure it to link the three viewports
    // These viewports could use different tool groups. See the PET-CT example
    // for a more complicated used case.

    const isMobile = window.matchMedia('(any-pointer:coarse)').matches;

    toolGroup.addTool(CrosshairsTool.toolName, {
      getReferenceLineColor,
      getReferenceLineControllable,
      getReferenceLineDraggableRotatable,
      getReferenceLineSlabThicknessControlsOn,
      mobile: {
        enabled: isMobile,
        opacity: 0.8,
        handleRadius: 9,
      },
    });

    toolGroup.setToolActive(CrosshairsTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary }],
    });
    // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
    // hook instead of mouse buttons, it does not need to assign any mouse button.
    toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);

    // Render the image
    renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);

    if (imageIds.length > 1) {
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Control') {
          // Verifica si la tecla presionada es la tecla "Ctrl".
          this.CtrlActive = !this.CtrlActive;
          console.log(
            this.CtrlActive ? 'Frames Habilitado' : 'Frames Deshabilitado'
          );

          if (this.CtrlActive) {
            cornerstoneTools.addTool(StackScrollMouseWheelTool);
            cornerstoneTools.setToolActive('StackScrollMouseWheel', {});
          } else {
            const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool; // zoom
            cornerstoneTools.addTool(ZoomMouseWheelTool);
            cornerstoneTools.setToolActive('ZoomMouseWheel', {});
          }
        }
      });
    } else {
      Swal.fire({
        title: 'Are you sure to continue?',
        text: "You only uploaded one .dcm, you won't be able to see the other frames",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes continue!',
        cancelButtonText: 'No, cancel!',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.MiniTutorial();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          window.location.reload();
        }
      });
    }
  }

  changeColorXray(color: string) {
    var element = document.getElementById('element');

    // cornerstone.displayImage(element, image);
    var viewport = {
      // invert: false,
      // pixelReplication: false,
      // voi: {
      //   windowWidth: 400,
      //   windowCenter: 60,
      // },
      // scale: 1.0,
      // translation: {
      //   x: 0,
      //   y: 0,
      // },
      colormap: color,
    };

    cornerstone.setViewport(element, viewport);
    cornerstone.updateImage(element);

    // this.isInvierte = false;
    // this.isPixel = false;
  }

  colorToolsInactive: any = '#FFFF00';
  colorToolsActive: any = '#00FF00';
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

  // dropdown de switchs
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
    // Define un array con los IDs de tus elementos
    const elementsIds = ['element1', 'element2', 'element3'];

    setTimeout(() => {
      elementsIds.forEach((elementId) => {
        var element = document.getElementById(elementId);
        if (element) {
          // Verifica si el elemento existe
          var viewport = cornerstone.getViewport(element); // Obtiene el viewport actual del elemento
          viewport.vflip = this.isFlipV; // Configura el flip vertical según isFlipV

          // Puedes ajustar más propiedades del viewport aquí si es necesario

          cornerstone.setViewport(element, viewport);
          cornerstone.updateImage(element);
        }
      });
    }, 0); // El tiempo de espera se establece en 0ms
  }

  infoToolModal(tipo: string) {
    if (tipo === 'Inactive') {
      Swal.fire({
        html: `<h2 style="color: white;">Tool Inactive</h2>`,
        imageUrl: '../../assets/imgs/ExampleToolInactive.png',
        imageWidth: 500,
        imageHeight: 400,
        imageAlt: 'Tool Inactive example image:',
        background: '#212529',
      });
    } else if (tipo === 'Active') {
      Swal.fire({
        html: `<h2 style="color: white;">Tool Active</h2>`,
        imageUrl: '../../assets/imgs/ExampleToolActive.gif',
        imageWidth: 500,
        imageHeight: 400,
        imageAlt: 'Tool Active example image',
        background: '#212529',
      });
    } else if (tipo === 'MausClassic') {
      Swal.fire({
        html: `<h2 style="color: white;">Classic mouse buttons</h2>`,
        imageUrl: '../../assets/imgs/Tutorial-Maus1.png',
        imageWidth: 500,
        imageHeight: 400,
        imageAlt: 'Classic mouse tutorial',
        background: '#212529',
      });
    } else if (tipo === 'MausAdvanced') {
      Swal.fire({
        html: `<h2 style="color: white;">Advanced mouse buttons</h2>`,
        imageUrl: '../../assets/imgs/Tutorial-Maus2.png',
        imageWidth: 500,
        imageHeight: 400,
        imageAlt: 'Advanced mouse tutorial',
        background: '#212529',
      });
    }
  }

  MiniTutorial() {
    // BOTTOM DRAWER
    Swal.fire({
      title: 'Hello 👋, Watch this little tutorial before you start.',
      position: 'top-start',
      width: '600px',
      showClass: {
        popup: `
     animate__animated
     animate__fadeInUp
     animate__faster
   `,
      },
      hideClass: {
        popup: `
     animate__animated
     animate__fadeOutDown
     animate__faster
   `,
      },
      grow: 'row',
      showConfirmButton: true,
      showCloseButton: true,
      confirmButtonColor: '#71D4AD',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "OK, let's go",
      cancelButtonText: "I don't need it",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: `<h2 style="color: white;">Classic mouse buttons</h2>`,
          imageUrl: '../../assets/imgs/Tutorial-Maus1.png',
          imageWidth: 500,
          imageHeight: 400,
          imageAlt: 'Classic mouse tutorial',
          background: '#212529',
          confirmButtonText: 'Next >',
          showCancelButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              html: `<h2 style="color: white;">
         You can access the tool settings by clicking on the nut.</h2>`,
              imageUrl: '../../assets/imgs/config-tutorial.png',
              imageWidth: 500,
              imageHeight: 400,
              imageAlt: 'Tool Sttings',
              background: '#212529',
              confirmButtonText: 'Next >',
              showCancelButton: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  html: `<h2 style="color: white;">By clicking on the three points you can access the options for flipping, pixel and inverting the colors of the radiograph.</h2>`,
                  imageUrl: '../../assets/imgs/captura-switch.png',
                  imageWidth: 500,
                  imageHeight: 400,
                  imageAlt: 'three points Sttings',
                  background: '#212529',
                  confirmButtonText: 'Next >',
                  showCancelButton: true,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      html: `
                     <h2 style="color: white;">To see the frames you can do them in two ways:</h2>
                     <ol >
                       <li style="color: white;">Press <kbd style="background: grey;">CTRL</kbd> to activate it and use the mouse wheel.</li>
                       <li style="color: white;">Click on the Stack button and left click to use.</li>
                     </ol>
                     <br>
                     <h4 style="color: white;">If activated by keyboard, the zoom tool on the mouse wheel will be replaced by it. To deactivate it, press the red blinking button.</h4>
                     `,
                      imageUrl: '../../assets/imgs/tutorial-Ctrl.png',
                      imageWidth: 500,
                      imageHeight: 400,
                      imageAlt: 'Ctrl Stack Frames Settings',
                      background: '#212529',
                      confirmButtonText: 'Next >',
                      showCancelButton: true,
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      allowEnterKey: false,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.fire({
                          html: `<h1 style="color: white;">🎊🎉Congratulations!🎉🎊</h1> <br> <h4 style="color: white;">Now you can start working.</h4>`,
                          background: '#212529',
                          imageUrl: '../../assets/imgs/giphy.gif',
                          imageWidth: 400,
                          imageHeight: 200,
                          imageAlt: 'Congratulations For end turial',
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  ngOnInit(): void {}
}
