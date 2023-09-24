/*
 * @Author: gongxi33
 * @Date: 2023-09-24 14:23:13
 * @LastEditTime: 2023-09-24 14:26:25
 * @LastEditors: gongxi33
 * @Description: 
 * @FilePath: /vue2-openlayers-drag-draw/src/components/OLMap/OLMapModify.js
 */
import { Modify } from "ol/interaction";

export default {
	addModifyInteraction(map) {
		const modify = new Modify({
			source: map.getLayers().getArray()[1].getSource(),
		});
		map.addInteraction(modify);

		modify.on("modifyend", (event) => {
			const modifiedFeature = event.features.getArray()[0];
			const coordinates = modifiedFeature
				.getGeometry()
				.getCoordinates()[0];
			console.log(coordinates);
		});
	},
};
