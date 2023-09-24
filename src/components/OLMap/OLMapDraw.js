/*
 * @Author: gongxi33
 * @Date: 2023-09-24 14:19:31
 * @LastEditTime: 2023-09-24 14:26:05
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /vue2-openlayers-drag-draw/src/components/OLMap/OLMapDraw.js
 */
import { Draw } from "ol/interaction";
import { Circle, Point } from "ol/geom";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { createRegularPolygon } from "ol/interaction/Draw";
import OLMapUtils from "./OLMapUtils";

export default {
	drawCircle(map, center, defaultCircle, drawCircleEndCallback) {
		const source = new VectorSource();

		const vectorLayer = new VectorLayer({
			source: source,
			style: new Style({
				fill: new Fill({
					color: "rgba(0, 128, 255, 0.2)",
				}),
				stroke: new Stroke({
					color: "blue",
					width: 2,
				}),
			}),
		});

		map.addLayer(vectorLayer);

		const draw = new Draw({
			source: source,
			type: "Circle",
			geometryFunction: createRegularPolygon(40),
		});

		map.addInteraction(draw);

		draw.on("drawend", (event) => {
			const feature = event.feature;
			const geometry = feature.getGeometry();
			const coordinates = geometry.getCoordinates()[0];

			let sumX = 0;
			let sumY = 0;

			coordinates.forEach((coord) => {
				sumX += coord[0];
				sumY += coord[1];
			});

			const center = [
				sumX / coordinates.length,
				sumY / coordinates.length,
			];
			const radius = coordinates.reduce((maxDistance, coord) => {
				const distance = Math.sqrt(
					(coord[0] - center[0]) ** 2 + (coord[1] - center[1]) ** 2,
				);
				return (Math.max(maxDistance, distance) / 1000).toFixed(2);
			}, 0);

			const lonLatCenter = OLMapUtils.toLonLat(center);

			const centerPointGeometry = new Point(center);
			const centerPointFeature = new Feature(centerPointGeometry);
			centerPointFeature.setStyle(
				new Style({
					image: new CircleStyle({
						radius: 5,
						fill: new Fill({ color: "red" }),
						stroke: new Stroke({
							color: "white",
							width: 2,
						}),
					}),
				}),
			);

			source.addFeature(centerPointFeature);

			const circleGeometry = new Circle(
				center,
				defaultCircle.distance * 1000,
			);
			const circleFeature = new Feature(circleGeometry);
			source.addFeature(circleFeature);

			map.getView().fit(circleGeometry, map.getSize());

			if (typeof drawCircleEndCallback === "function") {
				drawCircleEndCallback(lonLatCenter, radius);
			}
		});
	},

	drawPolygon(map) {
		const source = new VectorSource();

		const vectorLayer = new VectorLayer({
			source: source,
			style: new Style({
				fill: new Fill({
					color: "rgba(0, 128, 255, 0.2)",
				}),
				stroke: new Stroke({
					color: "blue",
					width: 2,
				}),
				image: new CircleStyle({
					radius: 7,
					fill: new Fill({
						color: "red",
					}),
				}),
			}),
		});

		map.addLayer(vectorLayer);

		const draw = new Draw({
			source: source,
			type: "Polygon",
		});

		map.addInteraction(draw);

		draw.on("drawend", (event) => {
			const drawendFeature = event.feature;
			const coordinates = drawendFeature
				.getGeometry()
				.getCoordinates()[0];

			if (coordinates.length < 5) {
				map.removeInteraction(draw);
			}

			console.log(coordinates);
		});
	},
};
