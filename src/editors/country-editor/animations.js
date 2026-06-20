import { easeIn, inAndOut, easeOut, linear } from "ol/easing";
import { unByKey } from "ol/Observable";
import { baseFeatureStyle, emptyFeatureStyle } from "./country.feature.style";

export function easeFeatureIn(map, feature) {
  const start = new Date().getTime();
  let listenerKey;

  function animate(event, duration = 200) {
    const frameState = event.frameState;
    const elapsed = frameState.time - start;
    const opacity = easeIn(elapsed / duration);

    const style = baseFeatureStyle(
      feature.get("color"),
      feature.get("name"),
      feature.get("showLabel"),
      opacity,
    );

    feature.setStyle(style);

    if (opacity >= 0.8) {
      unByKey(listenerKey);
      feature.renderBasic();
      return;
    }

    map.render();
  }

  map.render();
  listenerKey = map.on("postrender", animate);
}

export function easeFeatureOut(map, feature) {
  const start = new Date().getTime();
  let listenerKey;

  function animate(event, duration = 200) {
    const frameState = event.frameState;
    const elapsed = frameState.time - start;
    const opacity = 1 - linear(elapsed / duration);

    const style = baseFeatureStyle(
      feature.get("color"),
      feature.get("name"),
      feature.get("showLabel"),
      opacity,
    );

    feature.setStyle(style);

    if (opacity <= 0) {
      unByKey(listenerKey);
      feature.setStyle(emptyFeatureStyle());
      return;
    }

    map.render();
  }

  map.render();
  listenerKey = map.on("postrender", animate);
}
