import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DiseasesService } from '../services/diseases.service';
import { ViewChild, ElementRef } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FileService } from '../services/file.service';

//Alertas sweealert
import Swal from 'sweetalert2'

//importaciones CORNERSTONE
import * as cornerstone from '@cornerstonejs/core';
import * as dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';


//config cornerstone
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  useWebWorkers: true,
  decodeConfig: {
    convertFloatPixelDataToInt: false,
  },
});

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

export function createImageIdsAndCacheMetaData(arg0: { StudyInstanceUID: string; SeriesInstanceUID: string; wadoRsRoot: string; }) {
  throw new Error('Function not implemented.');
}

export function setVolumesForViewports(renderingEngine: any, arg1: { volumeId: string; }[], arg2: string[]) {
  throw new Error('Function not implemented.');
}

