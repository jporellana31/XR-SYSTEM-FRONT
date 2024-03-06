import { Injectable } from '@angular/core';

interface diseases {
  name: string;
  value: number;
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiseasesService {

  constructor() { }

  private data: diseases[] =
  [
    {
      "name": "Antelectasis",
      "value": 10
    },
    {
      "name": "Consolidation",
      "value": 20
    },
    {
      "name": "Infiltration",
      "value": 90,
      photo: "../../assets/imgs/radiologyDiseases.jpeg"
    },
    {
      "name": "Pneumothorax",
      "value": 24
    },
    {
      "name": "Edema",
      "value": 55,
      photo: "../../assets/imgs/radiologyDiseases2.jpeg"
    },
    {
      "name": "Emphysema",
      "value": 10
    },
    {
      "name": "Fibrosis",
      "value": 20
    },
    {
      "name": "Effusion",
      "value": 80,
      photo : "../../assets/imgs/radiologyDiseases3.jpg"
    },
    {
      "name": "Pneumonia",
      "value": 30
    },
    {
      "name": "Pleural Thickening",
      "value": 25
    },
    {
      "name": "Cardiomegaly",
      "value": 100,
      photo : "../../assets/imgs/radiologyDiseases4.jpg"
    },
    {
      "name": "Nodule",
      "value": 15
    },
    {
      "name": "Mass",
      "value": 10
    },
    {
      "name": "Hernia",
      "value": 25
    },
    {
      "name": "Lung Lesion",
      "value": 5
    },
    {
      "name": "Fracture",
      "value": 1
    },
    {
      "name": "Lung Opacity",
      "value": 12
    },
    {
      "name": "Enlarged Cardiomedia",
      "value": 23
    },
  ];



  get diseasesData() {
    return this.data;
  }

  randonData() {
    this.data = [
      {
        "name": "Antelectasis",
        "value": Math.random() * 100
      },
      {
        "name": "Consolidation",
        "value": Math.random() * 100
      },
      {
        "name": "Infiltration",
        "value": Math.random() * 100
      },
      {
        "name": "Pneumothorax",
        "value": Math.random() * 100
      },
      {
        "name": "Edema",
        "value": Math.random() * 100
      },
      {
        "name": "Emphysema",
        "value": Math.random() * 100
      },
      {
        "name": "Fibrosis",
        "value": Math.random() * 100
      },
      {
        "name": "Effusion",
        "value": Math.random() * 100
      },
      {
        "name": "Pneumonia",
        "value": Math.random() * 100
      },
      {
        "name": "Pleural Thickening",
        "value": Math.random() * 100
      },
      {
        "name": "Cardiomegaly",
        "value": Math.random() * 100
      },
      {
        "name": "Nodule",
        "value": Math.random() * 100
      },
      {
        "name": "Mass",
        "value": Math.random() * 100
      },
      {
        "name": "Hernia",
        "value": Math.random() * 100
      },
      {
        "name": "Lung Lesion",
        "value": Math.random() * 100
      },
      {
        "name": "Fracture",
        "value": Math.random() * 100
      },
      {
        "name": "Lung Opacity",
        "value": Math.random() * 100
      },
      {
        "name": "Enlarged Cardiomedia",
        "value": Math.random() * 100
      },
    ]
  }
}
