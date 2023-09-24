/*
 * @Author: gongxi33
 * @Date: 2023-09-24 14:23:32
 * @LastEditTime: 2023-09-24 14:26:33
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /vue2-openlayers-drag-draw/src/components/OLMap/OLMapUtils.js
 */
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ.js";
import { fromLonLat, toLonLat } from "ol/proj";

export default {
	createMap(center, zoom, minZoom, maxZoom, mapUrl) {
		return new Map({
			target: "map",
			layers: [
				new TileLayer({
					source: new XYZ({
						url: mapUrl,
					}),
				}),
			],
			view: new View({
				center: fromLonLat([center[1], center[0]]),
				zoom: zoom,
				maxZoom: maxZoom,
				minZoom: minZoom,
			}),
		});
	},

	toLonLat(coordinates) {
		return toLonLat(coordinates);
	},
};
