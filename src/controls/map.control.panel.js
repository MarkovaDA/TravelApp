import { Control } from "ol/control";

export class MapControlPanel extends Control {
  constructor(map, elemId) {
    super({ element: document.querySelector(elemId) });

    this.map = map;
  }
}
