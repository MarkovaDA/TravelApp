import $ from "jquery/dist/jquery";
import Overlay from "ol/Overlay";
import { featureGeometry } from "./../country.feature.style";

export class CountryOverlayBuilder {
  static getOverlay(feature) {
    const parent$ = $(".country-overlays-container"),
      pattern$ = $(".country-label-overlay").eq(0),
      overlayId = `country-label-overlay_${feature.get("id")}`,
      overlay$ = pattern$.clone();

    overlay$.attr("id", overlayId);
    overlay$.text(feature.get("name"));
    parent$.append(overlay$);

    return new Overlay({
      element: document.getElementById(overlayId),
      position: featureGeometry(feature).getCoordinates(),
      positioning: "center-center",
      className: "animated-overlay",
    });
  }
}
