import Feature from "ol/Feature";
import {
  emptyFeatureStyle,
  baseFeatureStyle,
  selectedFeatureStyle,
} from "./country.feature.style.js";
import { CountryOverlayBuilder } from "./controls/country.overlays.js";

export class CountryFeature extends Feature {
  constructor(feature) {
    super({
      geometry: feature.getGeometry(),
      ...feature.getProperties(),
    });

    if (feature.getId() !== undefined) {
      super.setId(feature.getId());
    }

    this.init();
  }

  init() {
    const color = this.get("color") || "0,123,255";
    const name = this.get("name");
    const showLabel = this.get("showLabel") || false;
    const baseStyle = baseFeatureStyle(color, name, showLabel);
    const defaultStyle = this.get("created") ? baseStyle : emptyFeatureStyle();

    super.setProperties({
      activeStyle: selectedFeatureStyle(color, name, showLabel),
      baseStyle: baseStyle,
      showLabel: showLabel,
      color: color,
    });

    super.setStyle(defaultStyle);
    this.overlay = CountryOverlayBuilder.getOverlay(this);
  }

  get baseStyle() {
    return super.get("baseStyle");
  }

  get activeStyle() {
    return super.get("activeStyle");
  }

  // style: {color, showLabel}
  set baseStyle(style) {
    const color = style.color !== undefined ? style.color : super.get("color");
    const show =
      style.showLabel !== undefined ? style.showLabel : super.get("showLabel");
    const baseStyle = baseFeatureStyle(color, super.get("name"), show);
    super.set("baseStyle", baseStyle);
    super.set("color", color);
    super.set("showLabel", show);
  }

  // style: {color, showLabel}
  set activeStyle(style) {
    const color = style.color !== undefined ? style.color : super.get("color");
    const show =
      style.showLabel !== undefined ? style.showLabel : super.get("showLabel");
    const activeStyle = selectedFeatureStyle(color, super.get("name"), show);
    super.set("activeStyle", activeStyle);
    super.set("color", color);
    super.set("showLabel", show);
  }

  renderBasic() {
    this.setStyle(this.baseStyle);
  }

  renderActive() {
    this.setStyle(this.activeStyle);
  }

  clear() {
    super.set("created", false);
    super.set("showLabel", false);
    super.setStyle(emptyFeatureStyle());
  }
}
