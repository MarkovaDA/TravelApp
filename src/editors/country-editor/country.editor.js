import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import $ from "jquery/dist/jquery";
import { CountrySerializer } from "./serializer.js";
import { easeFeatureIn } from "./animations.js";
import {
  COUNTRY_EDITOR_CONTEXT_MENU_EVENTS,
  CountryContextMenuControl,
} from "./controls/context.menu.js";
import {
  CountryEditorControlPanel,
  COUNTRY_EDITOR_CONTROL_PANEL_EVENTS,
} from "./controls/country.control.panel.js";
import { map } from "../../index.js";

export class MapCountryEditor {
  constructor(map) {
    this.map = map;
    this.control = new CountryEditorControlPanel(
      map,
      "#country-editor-control-panel",
    );
    this.contextMenu = new CountryContextMenuControl(map).apply();
    this.serializer = new CountrySerializer();

    this.bindEvents();
  }

  bindEvents() {
    this.map.on(COUNTRY_EDITOR_CONTEXT_MENU_EVENTS.CREATE_COUNTRY, () => {
      const features = this.findFeatures(this.map.pixelClickedAt);
      const [selected] = features;

      if (!selected) {
        return;
      }

      this.createFeature(selected);
    });

    this.map.on(COUNTRY_EDITOR_CONTEXT_MENU_EVENTS.REMOVE_COUNTRY, () => {
      const features = this.findFeatures(this.map.pixelClickedAt);
      const [selected] = features;

      if (!selected) {
        return;
      }

      this.removeFeature(selected);
    });

    this.map.on("singleclick", (event) => {
      if (this.shouldSuppressPanelClose()) {
        return;
      }

      const point = event.pixel;
      this.selectedFeatures = this.findFeatures(point).filter(
        (ft) => ft.get("created") === true,
      );

      if (this.selectedFeatures.length < 1) {
        this.control.close();
        return;
      }

      this.selectFeatures(this.selectedFeatures);
    });

    this.control.on(
      COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.UPDATE_FEATURE,
      ({ feature }) => {
        this.serializer.serializeFeature(feature);
      },
    );
  }

  apply() {
    if (this.vectorSource) {
      return;
    }

    this.serializer.getFeatureCollection().then((features) => {
      this.vectorSource = new VectorSource({
        features: features,
      });

      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
      });

      this.vectorLayer.set("countrySource", true);
      this.vectorLayer.setZIndex(0);
      this.map.addLayer(this.vectorLayer);
      this.map.addControl(this.control);

      this.vectorSource.forEachFeature((feature) => {
        if (feature.get("showLabel")) map.addOverlay(feature.overlay);
      });
    });
  }

  createFeature(feature) {
    feature.set("created", true);
    easeFeatureIn(this.map, feature);
    this.serializer.serializeFeature(feature);
    this.suppressPanelClose();
    this.selectFeatures([feature]);
  }

  removeFeature(feature) {
    feature.clear();
    map.removeOverlay(feature.overlay);
    // easeFeatureOut(this.map, feature);
    this.serializer.serializeFeature(feature);
  }

  findFeatures(point) {
    return this.map.getFeaturesAtPixel(point, {
      layerFilter: (layer) => layer.getSource() === this.vectorSource,
    });
  }

  selectFeatures(features) {
    if (features.length > 0) {
      $("#marker-editor-control-panel").stop(true, true).slideUp(200);
      this.control.applyToFeature(...features);
    }

    // выделяем выбранную фичу и снимаем выделение с остальных
    this.vectorSource
      .getFeatures()
      .filter((ft) => ft.get("created") === true)
      .forEach((ft) => {
        if (features.includes(ft)) {
          ft.renderActive();
        } else {
          ft.renderBasic();
        }
      });
  }

  suppressPanelClose(duration = 400) {
    this.map.suppressPanelCloseUntil = Date.now() + duration;
  }

  shouldSuppressPanelClose() {
    return Date.now() < (this.map.suppressPanelCloseUntil || 0);
  }
}

export const MAP_COUNTRY_EDITOR_EVENTS = {
  ADD_COUNTRY: "MAP_COUNTRY_EDITOR_EVENTS.SELECT_COUNTRY",
  REMOVE_COUNTRY: "MAP_COUNTRY_EDITOR_EVENTS.REMOVE_COUNTRY",
};
