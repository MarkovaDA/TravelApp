import { easeIn, linear } from "ol/easing";
import { unByKey } from "ol/Observable";
import { baseMarkerStyle } from "./marker.feature.style";

// TODO: remove callbacks
export function easeMarkerIn(map, feature, onComplete, source) {
  const start = new Date().getTime();
  let listenerKey;

  function animate(event, duration = 300) {
    const frameState = event.frameState;
    const elapsed = frameState.time - start;
    const scale = easeIn(elapsed / duration);

    feature.setStyle(baseMarkerStyle(scale, source));

    if (scale >= 0.8) {
      feature.setStyle(baseMarkerStyle(0.8, source));
      unByKey(listenerKey);
      onComplete.call();
      return;
    }

    map.render();
  }

  map.render();
  listenerKey = map.on("postrender", animate);
}

export function easeMarkerOut(map, feature, onComplete, source) {
  const start = new Date().getTime();
  let listenerKey;

  function animate(event, duration = 200) {
    const frameState = event.frameState;
    const elapsed = frameState.time - start;
    const scale = 1 - linear(elapsed / duration);

    feature.setStyle(baseMarkerStyle(scale, source));

    if (scale <= 0) {
      unByKey(listenerKey);
      onComplete.call();
      return;
    }

    map.render();
  }

  map.render();
  listenerKey = map.on("postrender", animate);
}
