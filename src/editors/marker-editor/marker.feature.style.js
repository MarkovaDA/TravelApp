import { Style, Icon, Fill, Stroke } from "ol/style";

export const transparentMarkerStyle = () => {
  return new Style({
    stroke: new Stroke({
      color: "rgba(0,0,0,0)",
    }),
    fill: new Fill({
      color: "rgba(0,0,0,0)",
    }),
  });
};

export const baseMarkerStyle = (
  scaleValue,
  sourceImage = "./assets/icons/markers/icon3.png",
) => {
  return new Style({
    image: new Icon({
      scale: scaleValue,
      src: sourceImage,
    }),
  });
};

export const selectedMarkerStyle = (
  scaleValue,
  sourceImage = "./assets/icons/markers/icon3.png",
) => {
  return new Style({
    image: new Icon({
      scale: scaleValue,
      src: sourceImage,
    }),
  });
};
