import Feature from 'ol/Feature';
import {
	emptyFeatureStyle, 
  baseFeatureStyle, 
	selectedFeatureStyle,
} from './country.feature.style.js';
import { CountryOverlayBuilder } from './controls/country.overlays.js';

export class CountryFeature extends Feature {
	constructor(feature) {
		super(feature.getProperties())		
		this.init(feature);
	}

	init(feature) {
		const id = feature.getId(), color = feature.get('color') || '0,123,255', name = feature.get('name');
		const showLabel = feature.get('showLabel') || false;
		const baseStyle = baseFeatureStyle(color, name, showLabel);
		const defaultStyle = feature.get('created') ? baseStyle : emptyFeatureStyle();

		super.setId(id);
    
		super.setProperties({
			'activeStyle': selectedFeatureStyle(color, name, showLabel),
			'baseStyle': baseStyle,
			'showLabel': showLabel,
			'color': color
		});

		super.setStyle(defaultStyle);
		this.overlay = CountryOverlayBuilder.getOverlay(this);
	}

	get baseStyle() {
		return super.get('baseStyle');
	}

	get activeStyle() {
		return super.get('activeStyle');
	}

	// style: {color, showLabel}
	set baseStyle(style) {
		const color = style.color || super.get('color'), show = style.showLabel || super.get('showLabel');
		const baseStyle = baseFeatureStyle(color, super.get('name'), show);
		super.set('baseStyle', baseStyle);
	} 

	// style: {color, showLabel}
	set activeStyle(style) {
		const color = style.color || super.get('color'), show = style.showLabel || super.get('showLabel');
		const activeStyle = selectedFeatureStyle(color, super.get('name'), show);
		super.set('activeStyle', activeStyle);
	}

	renderBasic() {
		this.setStyle(this.baseStyle);
	}

	renderActive() {
		this.setStyle(this.activeStyle);
	}

	clear() {
		super.set('created', false);
		super.set('showLabel', false);
		super.setStyle(emptyFeatureStyle());
	}
}