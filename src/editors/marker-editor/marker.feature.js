import Feature from "ol/Feature";
import { MarkerOverlayBuilder as OverlayBuilder } from "./controls/marker.overlay";
import {
  baseMarkerStyle,
  transparentMarkerStyle,
} from "./marker.feature.style";

export class MarkerFeature extends Feature {
  constructor(feature, styled = true) {
    super(feature.getProperties());

    this.defaultSource = "./assets/icons/markers/icon3.png";
    this.defaultLabel = "New marker";
    this.init(feature, styled);
  }

  init(feature, styled) {
    const imageSource = feature.get("source") || this.defaultSource;
    const markerLabel = feature.get("label") || this.defaultLabel;

    this.setId(feature.getId());
    this.set("source", imageSource);
    this.set("label", markerLabel);

    this.overlay = OverlayBuilder.getOverlay(
      feature.getGeometry().getCoordinates(),
      feature.get("label"),
    );

    if (styled) {
      this.setStyle(baseMarkerStyle(0.8, imageSource));
    } else {
      this.setStyle(transparentMarkerStyle());
    }

    this.on("change", function () {
      this.overlay.setPosition(this.getGeometry().getCoordinates());
    });
  }
}
