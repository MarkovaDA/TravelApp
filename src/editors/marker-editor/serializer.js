import GeoJSON from "ol/format/GeoJSON";
import { dbService } from "../../services/db.service.js";
import { MarkerFeature } from "./marker.feature.js";

export class MarkerSerializer {
  constructor() {
    this.format = new GeoJSON({
      featureProjection: "EPSG:4326",
    });
  }

  async getFeatureCollection() {
    const serializedList = await dbService.getAllFromStore("Markers");

    return serializedList.map((it) => {
      const deserialized = this.getDeserializedFeature(it);
      return new MarkerFeature(deserialized);
    });
  }

  getDeserializedFeature(feature) {
    return this.format.readFeature(JSON.stringify(feature));
  }

  getSerializedFeature(feature) {
    const serializedObject = this.format.writeFeatureObject(feature);

    return {
      ...serializedObject,
      properties: {
        source: feature.get("source"),
        label: feature.get("label"),
      },
    };
  }

  async serializeFeature(feature) {
    const serialized = this.getSerializedFeature(feature);
    const store = await dbService.getStore("Markers", "readwrite"),
      request = store.put(serialized);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const id = event.target.result;
        feature.setId(id);
        resolve(id);
      };
      request.onerror = (event) => reject(null);
    });
  }

  async removeFeature(id) {
    const store = await dbService.getStore("Markers", "readwrite"),
      request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => reject(null);
    });
  }
}
