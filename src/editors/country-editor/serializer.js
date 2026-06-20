import GeoJSON from "ol/format/GeoJSON";
import countriesData from "./../../data/countries.geo.json";
import { CountryFeature } from "./country.feature";
import { dbService } from "../../services/db.service.js";

export class CountrySerializer {
  constructor() {
    this.format = new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  }

  getSerializedFeature(feature) {
    const serializedObject = this.format.writeFeatureObject(feature, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

    const properties = serializedObject.properties;

    return {
      ...serializedObject,
      properties: {
        name: properties.name,
        color: properties.color,
        showLabel: properties.showLabel,
        description: properties.description,
        created: properties.created || false,
      },
    };
  }

  getDeserializedFeature(feature) {
    return this.format.readFeature(JSON.stringify(feature));
  }

  async getFeatureCollection() {
    const serializedList = await dbService.getAllFromStore("Countries");

    if (serializedList.length < 1) {
      const features = this.format
        .readFeatures(countriesData)
        .map((it) => new CountryFeature(it));
      this.serializeFeatures(features);
      return features;
    }

    return serializedList.map((it) => {
      const deserialized = this.getDeserializedFeature(it);
      return new CountryFeature(deserialized);
    });
  }

  async serializeFeatures(features) {
    const store = await dbService.getStore("Countries", "readwrite");

    features.forEach((feature) => {
      const serializedObj = this.getSerializedFeature(feature);
      store.put(serializedObj, serializedObj.id);
    });
  }

  async serializeFeature(feature) {
    const store = await dbService.getStore("Countries", "readwrite");
    store.put(this.getSerializedFeature(feature), feature.getId());
  }
}
