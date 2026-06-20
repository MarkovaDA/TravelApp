import { Control } from "ol/control";
import $ from "jquery/dist/jquery";

export class CountryEditorControlPanel extends Control {
  constructor(map, elemId) {
    super({
      element: document.querySelector(elemId),
      target: document.querySelector("#control-panel .card .card-body"),
    });

    this.map = map;
    this.elem$ = $(elemId);
    this.title$ = this.elem$.find("#country-title-field");
    this.description$ = this.elem$.find("#country-description-field");
    this.colorSwitcher$ = this.elem$.find(".btn-colored");
    this.labelSwitcher$ = this.elem$.find("#country-label-switch");
    this.elem$.hide();
    this.bindEvents();
  }

  bindEvents() {
    this.colorSwitcher$.on("click", (event) => {
      const value = $(event.currentTarget).attr("rgb");

      if (!value) {
        return;
      }

      this.feature.set("color", value);
      this.feature.activeStyle = { color: value };
      this.feature.baseStyle = { color: value };
      this.feature.renderActive();
      this.map.render();

      this.notifyChanged();
    });

    this.labelSwitcher$.on("click", ({ target }) => {
      const checked = $(target).is(":checked");
      const overlay = this.feature.overlay;

      this.feature.set("showLabel", checked);

      if (checked) {
        this.map.addOverlay(overlay);
      } else {
        this.map.removeOverlay(overlay);
      }

      this.notifyChanged();
    });

    //  TODO: add throttling
    this.description$.on("input", (_) => {
      this.feature.set("description", this.description$.val());
      this.notifyChanged();
    });
  }

  applyToFeature(feature) {
    this.feature = feature;
    this.readProperties(feature);
    this.open();
  }

  notifyChanged() {
    this.dispatchEvent({
      type: COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.UPDATE_FEATURE,
      feature: this.feature,
    });
  }

  readProperties(feature) {
    this.title$.val(feature.get("name"));

    if (feature.get("description"))
      this.description$.val(feature.get("description"));
    else {
      this.description$.val("");
    }
    this.labelSwitcher$.prop("checked", !!feature.get("showLabel"));
  }

  open() {
    this.elem$.stop(true, true).slideDown(300);
  }

  close() {
    this.elem$.slideUp(200);
  }
}

export const COUNTRY_EDITOR_CONTROL_PANEL_EVENTS = {
  UPDATE_FEATURE: "COUNTRY_EDITOR_CONTROL_PANEL_EVENTS.UPDATE_FEATURE",
};
