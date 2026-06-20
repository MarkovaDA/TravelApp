import $ from 'jquery/dist/jquery';
import {Control} from 'ol/control';
import {easeMarkerIn} from '../animations';

export class MarkerEditorControlPanel extends Control {
    constructor(map, elemId) {
        super({
            element: document.querySelector(elemId),
            target: document.querySelector('#control-panel .card .card-body')
        })

        this.map = map;
        this.elem$ = $(elemId);
        this.label$ = this.elem$.find('#marker-input-label');
        this.images$ = this.elem$.find('.marker-preview-img');
        this.elem$.hide();
        this.bindEvents();
    }

    bindEvents() {
        this.label$.on('input', ({target}) => {
            // TODO: throttle value
            const label = $(target).val();
            this.feature.set('label', label);
            this.overlay$.text(label);

            this.dispatchEvent({
                type: MARKER_EDITOR_CONTROL_PANEL_EVENTS.MARKER_HAS_MODIFIED,
                marker: this.feature
            })
        });

        this.images$.on('click', ({target}) => {
            const src = $(target).attr('src');
            this.feature.set('source', src);
            easeMarkerIn(this.map, this.feature, () => {
            }, src);

            this.dispatchEvent({
                type: MARKER_EDITOR_CONTROL_PANEL_EVENTS.MARKER_HAS_MODIFIED,
                marker: this.feature
            })
        });
    }

    apply(feature) {
        if (!feature) {
            return;
        }

        this.feature = feature;
        this.overlay$ = $(feature.overlay.element).find('.marker-label-overlay');

        const label = feature.get('label');
        this.overlay$.text(label)
        this.label$.val(label);
        this.open();
    }

    open() {
        this.elem$.stop(true, true).slideDown(300);
    }

    close() {
        this.elem$.slideUp(200);
    }
}

export const MARKER_EDITOR_CONTROL_PANEL_EVENTS = {
    MARKER_HAS_MODIFIED: 'MARKER_EDITOR_CONTROL_PANEL_EVENTS.MARKER_HAS_MODIFIED'
}

