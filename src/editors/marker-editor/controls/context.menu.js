import $ from "jquery/dist/jquery";
import {
  ContextMenuControl,
  MAP_CONTEXT_MENU_EVENTS,
} from "../../../controls/map.context.menu";
import { MapSourceTypes } from "../../../constants";
import { MarkerFeature } from "../marker.feature";

export class MarkerContextMenu extends ContextMenuControl {
  constructor(map) {
    super(map);

    this.map = map;

    this.menu$ = $(".marker-editor-context-menu");
    this.items$ = this.menu$.find(".dropdown-item");
    this.createItem$ = this.items$.eq(0);
    this.removeItem$ = this.items$.eq(1);
  }

  apply() {
    super.root$.prepend(this.menu$);
    this.removeItem$.hide();
    this.bindEvents();
    return this;
  }

  bindEvents() {
    this.map.on(MAP_CONTEXT_MENU_EVENTS.CONTEXT_MENU_CALLED, ({ point }) => {
      const features = this.map.getFeaturesAtPixel(point, {
        layerFilter: (layer) => !!layer.get(MapSourceTypes.markerSource),
      });

      // if (!features.find(ft => ft instanceof MarkerFeature && ft.selected === true )) {
      //   this.removeItem$.hide();
      //   return;
      // }

      if (features.length > 0) {
        this.removeItem$.show();
        this.createItem$.hide();
      } else {
        this.createItem$.show();
        this.removeItem$.hide();
      }
    });

    this.createItem$.on("click", (event) => {
      event.stopPropagation();
      this.map.dispatchEvent(MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER);
      super.close();
    });

    this.removeItem$.on("click", (event) => {
      event.stopPropagation();
      this.map.dispatchEvent(MARKER_EDITOR_CONTEXT_MENU_EVENTS.REMOVE_MARKER);
      super.close();
    });
  }
}

export const MARKER_EDITOR_CONTEXT_MENU_EVENTS = {
  ADD_MARKER: "MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER",
  REMOVE_MARKER: "MARKER_EDITOR_CONTEXT_MENU_EVENTS.REMOVE_MARKER",
};
