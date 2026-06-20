import {MarkerContextMenu, MARKER_EDITOR_CONTEXT_MENU_EVENTS} from "./controls/context.menu";
import $ from 'jquery/dist/jquery';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import {Translate, Select} from "ol/interaction";
import {MarkerFeature} from "./marker.feature";
import {easeMarkerIn, easeMarkerOut} from './animations';
import {selectedMarkerStyle, baseMarkerStyle} from './marker.feature.style';
import {MarkerEditorControlPanel, MARKER_EDITOR_CONTROL_PANEL_EVENTS} from "./controls/marker.control.panel";
import {MarkerSerializer} from "./serializer";

export class MapMarkerEditor {
    constructor(map) {
        this.map = map;
        this.contextMenu = new MarkerContextMenu(map).apply();
        this.control = new MarkerEditorControlPanel(map, '#marker-editor-control-panel');
        this.serializer = new MarkerSerializer();
    }

    apply() {
        if (this.vectorSource) {
            return;
        }

        this.vectorSource = new VectorSource({features: []});
        this.vectorSource.set('markerSource', true);

        this.serializer.getFeatureCollection().then(markers => {
            this.vectorSource.addFeatures(markers);
            markers.forEach(marker => this.map.addOverlay(marker.overlay));
        });

        this.vectorLayer = new VectorLayer({
            source: this.vectorSource
        });

        this.vectorLayer.setZIndex(1);
        this.vectorLayer.set('markerSource', true);
        this.map.addLayer(this.vectorLayer);

        this.select = new Select({
            layers: [this.vectorLayer],
            style: selectedMarkerStyle(1)
        })

        this.map.addInteraction(this.select);
        this.map.addInteraction(new Translate({features: this.select.getFeatures()}))
        this.map.addControl(this.control);

        this.bindEvents();
    }

    bindEvents() {
        // creation new marker
        this.map.on(MARKER_EDITOR_CONTEXT_MENU_EVENTS.ADD_MARKER, () => {
            const pixel = this.map.pixelClickedAt,
                coordinates = this.map.getCoordinateFromPixel(pixel),
                marker = new MarkerFeature(new Feature(new Point(coordinates)), false);

            easeMarkerIn(this.map, marker, () => this.map.addOverlay(marker.overlay));

            this.vectorSource.addFeature(marker);
            this.serializer.serializeFeature(marker);
            this.contextMenu.close();
            this.map.suppressPanelCloseUntil = Date.now() + 400;
            setTimeout(() => this.selectMarker(marker), 0);
        });

        // removing marker
        this.map.on(MARKER_EDITOR_CONTEXT_MENU_EVENTS.REMOVE_MARKER, () => {
            easeMarkerOut(this.map, this.selectedMarker, () => {
                this.serializer.removeFeature(this.selectedMarker.getId()).then(_ => {
                    this.map.removeOverlay(this.selectedMarker.overlay);
                    this.vectorSource.removeFeature(this.selectedMarker);
                });
            }, this.selectedMarker.get('source'));
        });

        // selection marker
        this.select.on('select', () => {
            if (this._syncingSelection) {
                return;
            }

            const selected = this.select.getFeatures().getArray()[0];

            if (!selected) {
                if (this.selectedMarker) {
                    const newSource = this.selectedMarker.get('source');
                    this.selectedMarker.selected = false;
                    this.selectedMarker.setStyle(baseMarkerStyle(0.8, newSource));
                }
                this.control.close();
                return;
            }

            this.selectMarker(selected);
        });

        this.control.on(MARKER_EDITOR_CONTROL_PANEL_EVENTS.MARKER_HAS_MODIFIED, ({marker}) => {
            this.serializer.serializeFeature(marker);
        });
    }

    selectMarker(marker) {
        if (!marker) {
            return;
        }

        if (this.selectedMarker && this.selectedMarker !== marker) {
            const previousSource = this.selectedMarker.get('source');
            this.selectedMarker.selected = false;
            this.selectedMarker.setStyle(baseMarkerStyle(0.8, previousSource));
        }

        const source = marker.get('source');

        if (source) {
            marker.setStyle(selectedMarkerStyle(1, source));
        }

        this.selectedMarker = marker;
        this.selectedMarker.selected = true;

        const collection = this.select.getFeatures();
        if (collection.getArray()[0] !== marker) {
            this._syncingSelection = true;
            collection.clear();
            collection.push(marker);
            this._syncingSelection = false;
        }

        $('#country-editor-control-panel').stop(true, true).slideUp(200);
        this.control.apply(marker);
    }
}