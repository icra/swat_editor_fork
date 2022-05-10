<template>
	<div :class="'map-container ' + (page.customWidth? '' : (page.customHeight ? 'w-100' : 'full-map'))" :style="(page.customHeight ? `height: ${height};` : '') + (page.customWidth ? `width: ${width};` : '')">
		<l-map style="height: 100%; width:100%" :zoom="map.zoom" :center="map.center">
			<l-control-layers position="topright"></l-control-layers>
			<l-tile-layer v-for="tileProvider in map.tileProviders"
						  :key="tileProvider.name"
						  :name="tileProvider.name"
						  :visible="tileProvider.visible"
						  :url="tileProvider.url"
						  :attribution="tileProvider.attribution"
						  layer-type="base" />
			<l-marker :lat-lng="pointCoords"></l-marker>
		</l-map>
	</div>
</template>

<script>
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LControlLayers } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

export default {
	name: 'MapPoint',
	components: {
		LMap, LTileLayer, LMarker, LControlLayers
	},
	props: {
		lat: {
			type: Number,
			required: true
		},
		lon: {
			type: Number,
			required: true
		},
		height: {
			type: String,
			default: '100%'
		},
		width: {
			type: String,
			default: '100%'
		},
	},
	data() {
		return {
			page: {
				customHeight: this.height != '100%',
				customWidth: this.width != '100%'
			},
			map: {
				zoom: 13,
				center: [this.lat, this.lon],
				url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
				attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
				tileProviders: [
					{
						name: 'Default map',
						visible: true,
						attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
						url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					},
					{
						name: 'Topography map',
						visible: false,
						url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
						attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
					},
					{
						name: 'Satellite map',
						visible: false,
						url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
						attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
					}
				]
			}
		}
	},
	computed: {
		pointCoords() {
			return latLng(this.lat, this.lon);
		}
	}
}
</script>