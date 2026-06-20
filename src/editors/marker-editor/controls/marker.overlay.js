import $ from "jquery/dist/jquery";
import Overlay from "ol/Overlay";

export class MarkerOverlayBuilder {
  static getOverlay(point, label) {
    const parent$ = $("marker-overlay-container"),
      pattern$ = $(".marker-label-overlay").eq(0),
      overlay$ = pattern$.clone();
    overlay$.text(label);

    parent$.append(overlay$);

    return new Overlay({
      element: overlay$.get(0),
      className: "animated-overlay",
      position: point,
      positioning: "right-center",
    });
  }
}
