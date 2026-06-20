import $ from 'jquery/dist/jquery';
import { CountryFeature } from "../country.feature";
import { MAP_CONTEXT_MENU_EVENTS, ContextMenuControl } from '../../../controls/map.context.menu';
import { MapSourceTypes } from '../../../constants';

export class CountryContextMenuControl extends ContextMenuControl  {
  constructor(map) {
    super(map);

    this.map = map;   
    this.menu$ = $('.country-editor-context-menu');
    this.items$ = this.menu$.find('.dropdown-item');
    this.createItem$ = this.items$.eq(0);
    this.removeItem$ = this.items$.eq(1);
  }

  apply() {
    super.root$.prepend(this.menu$);
    this.bindEvents();
    return this;
  }

  bindEvents() {
    this.map.on(MAP_CONTEXT_MENU_EVENTS.CONTEXT_MENU_CALLED, ({point}) => {      
      const features = this.map.getFeaturesAtPixel(point, {
          layerFilter: layer => !!layer.get(MapSourceTypes.countrySource)
        }).find(feature => feature instanceof CountryFeature && feature.get('created'));

      if (features) {
        this.createItem$.hide();
        this.removeItem$.show();
      } else {
        this.removeItem$.hide();
        this.createItem$.show();
      }
    })

    this.createItem$.on('click', (event) => {
      event.stopPropagation();
      this.map.dispatchEvent(COUNTRY_EDITOR_CONTEXT_MENU_EVENTS.CREATE_COUNTRY)
      super.close()
    });

    this.removeItem$.on('click', (event) => {
      event.stopPropagation();
      this.map.dispatchEvent(COUNTRY_EDITOR_CONTEXT_MENU_EVENTS.REMOVE_COUNTRY)
      super.close()
    });
  }
}

export const COUNTRY_EDITOR_CONTEXT_MENU_EVENTS = {
  CREATE_COUNTRY: 'COUNTRY_EDITOR_CONTEXT_MENU_EVENTS.CREATE_COUNTRY',
  REMOVE_COUNTRY: 'COUNTRY_EDITOR_CONTEXT_MENU_EVENTS.REMOVE_COUNTRY'
}