import { Fill, Stroke, Style, Text } from "ol/style";

const parseColor = (color) => {
  if (!color || typeof color !== "string") {
    return ["0", "123", "255"];
  }

  return color.split(",").map((part) => part.trim());
};

const featureTextStyle = (label) => {
  return new Text({
    font: "12px Arial",
    backgroundFill: new Fill({ color: "white" }),
    backgroundStroke: new Stroke({ color: "#e7e7e7" }),
    padding: [5, 2, 2, 5],
    rotateWithView: true,
    text: label,
    overflow: true,
  });
};

export const emptyFeatureStyle = () => {
  return new Style({
    stroke: new Stroke({
      color: "rgba(0,0,0,0)",
    }),
    fill: new Fill({
      color: "rgba(0,0,0,0)",
    }),
  });
};

export const baseFeatureStyle = (
  color,
  label,
  showLabel = false,
  opacity = 0.8,
) => {
  const [R, G, B] = parseColor(color);

  return () => {
    const polygonStyle = new Style({
      fill: new Fill({
        color: `rgba(${R}, ${G}, ${B}, ${opacity})`,
      }),
    });

    // const textStyle = new Style({
    //   text: featureTextStyle(label),
    //   geometry: feature => featureGeometry(feature)
    // })
    return [polygonStyle];
    // return showLabel ? [polygonStyle, textStyle] : [polygonStyle];
  };
};

export const selectedFeatureStyle = (color, label, showLabel = false) => {
  const [R, G, B] = parseColor(color);

  return () => {
    const polygonStyle = new Style({
      fill: new Fill({
        color: `rgba(${R}, ${G}, ${B}, 1)`,
      }),
      stroke: new Stroke({
        color: `rgba(255, 255, 255, 1)`,
        width: 2,
      }),
    });

    // const textStyle = new Style({
    //   text: featureTextStyle(label),
    //   geometry: feature => featureGeometry(feature)
    // })
    return [polygonStyle];
    // return showLabel ? [polygonStyle, textStyle] : [polygonStyle];
  };
};

export const featureGeometry = (feature) => {
  const geometry = feature.getGeometry();

  return geometry.getType() === "MultiPolygon"
    ? getMaxPolygon(geometry.getPolygons()).getInteriorPoint()
    : geometry.getInteriorPoint();
};

export function getMaxPolygon(polygons) {
  let maxPolygon = polygons.shift();

  polygons.forEach((polygon) => {
    if (polygon.getArea() > maxPolygon.getArea()) {
      maxPolygon = polygon;
    }
  });

  return maxPolygon;
}
