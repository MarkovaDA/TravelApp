import { Control } from "ol/control";

export class MapZoomControl extends Control {
  constructor(map, elemId) {
    super({ element: document.querySelector(elemId) });

    this.map = map;
  }
}
