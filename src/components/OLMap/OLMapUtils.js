/*
 * @Author: gongxi33
 * @Date: 2023-09-24 14:23:32
 * @LastEditTime: 2023-09-28 11:34:44
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
	deepEqual(obj1, obj2) {
		if (obj1 === null || obj2 === null) return false;
		// 获取两个对象的键数组
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		// 如果键的数量不同，对象不相等
		if (keys1.length !== keys2.length) {
			return false;
		}

		// 检查每一个键的值是否相等
		for (const key of keys1) {
			const val1 = obj1[key];
			const val2 = obj2[key];

			// 如果值是对象，递归进行深比较
			if (typeof val1 === "object" && typeof val2 === "object") {
				if (!this.deepEqual(val1, val2)) {
					return false;
				}
			} else {
				// 否则直接比较值
				if (val1 !== val2) {
					return false;
				}
			}
		}

		// 所有键值对均相等
		return true;
	},
};
