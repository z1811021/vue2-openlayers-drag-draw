/*
 * @Author: gongxi33
 * @Date: 2023-09-24 14:19:31
 * @LastEditTime: 2023-09-28 14:59:12
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /vue2-openlayers-drag-draw/src/components/OLMap/OLMapDraw.js
 */
import { Draw } from "ol/interaction";
import { Circle, Point } from "ol/geom";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import { createRegularPolygon } from "ol/interaction/Draw";
import OLMapUtils from "./OLMapUtils";

export default {
	drawCircle(
		map,
		defaultCircleDraw,
		drawCircleEndCallback,
		enableDraw,
		source,
		isCreated,
	) {
		// isCreated means from new map component so we need remove previous feature
		isCreated && (this.lastFeatures = null);
		console.log(
			"🚀 ~ file: OLMapDraw.js:27 ~ defaultCircleDraw:",
			defaultCircleDraw,
		);
		// new vector layer
		const vectorLayer = new VectorLayer({
			source: source,
			style: new Style({
				fill: new Fill({
					color: "rgba(0, 128, 255, 0.2)", // fill background
				}),
				stroke: new Stroke({
					// stroke style
					color: "blue",
					width: 2,
				}),
			}),
		});
		// new draw interaction
		const draw = new Draw({
			source: source,
			type: "Circle",
			geometryFunction: createRegularPolygon(40), // draw circle
		});

		// add layer into map
		!this.lastFeatures && map.addLayer(vectorLayer);

		// add interaction into map when enable draw
		enableDraw && map.addInteraction(draw);
		console.log(
			"🚀 ~ file: OLMapDraw.js:53 ~ is enable enableDraw:",
			enableDraw,
		);

		if (defaultCircleDraw.center && defaultCircleDraw.distance) {
			// Remove the old center point feature
			this.lastFeatures &&
				this.lastFeatures.forEach((feature) =>
					source.removeFeature(feature),
				);

			const center = fromLonLat([
				defaultCircleDraw["center"][1],
				defaultCircleDraw["center"][0],
			]);
			console.log(
				"🚀 ~ file: index.vue:145 ~ drawCircle ~ center[lon, lat]:",
				center,
			);
			const distance = defaultCircleDraw.distance * 1000; // 转换成米
			console.log(
				"🚀 ~ file: index.vue:147 ~ drawCircle ~ distance m:",
				distance,
			);

			// create circle
			const circleGeometry = new Circle(center, distance);
			const circleFeature = new Feature(circleGeometry);

			// add to layer
			source.addFeature(circleFeature);

			// create center point
			const centerPointGeometry = new Point(center);
			const centerPointFeature = new Feature(centerPointGeometry);
			// center point style
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

			// add to layer
			source.addFeature(centerPointFeature);
			// makre sure in the correct view

			map.getView().fit(circleGeometry, map.getSize());
			// update last render
			this.lastFeatures = [circleFeature, centerPointFeature];
		}
		draw.on("drawend", (event) => {
			const feature = event.feature;
			const geometry = feature.getGeometry();
			const coordinates = geometry.getCoordinates()[0];

			let sumX = 0;
			let sumY = 0;
			// all points
			coordinates.forEach((coord) => {
				sumX += coord[0];
				sumY += coord[1];
			});
			// caculate the center ponits
			const center = [
				sumX / coordinates.length,
				sumY / coordinates.length,
			];
			// get the distance km
			const radius = coordinates.reduce((maxDistance, coord) => {
				const distance = Math.sqrt(
					(coord[0] - center[0]) ** 2 + (coord[1] - center[1]) ** 2,
				);
				return (Math.max(maxDistance, distance) / 1000).toFixed(2);
			}, 0);
			// the center need to change to [Lon, Lat] because of wgs84
			const lonLatCenter = OLMapUtils.toLonLat(center);
			// add to layer and give style
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

			// Remove the old center point feature
			source.clear();
			// add new point feature
			source.addFeature(centerPointFeature);
			// add callback give lonLatCenter and radius
			if (typeof drawCircleEndCallback === "function") {
				drawCircleEndCallback(lonLatCenter, radius);
			}
		});
	},

	drawPolygon(map, callback) {
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
		const drawInteraction = draw;
		draw.on("drawend", (event) => {
			const drawendFeature = event.feature;
			const coordinates = drawendFeature
				.getGeometry()
				.getCoordinates()[0];

			if (coordinates.length < 5) {
				map.removeInteraction(draw);
				if (typeof callback === "function") {
					callback(drawInteraction);
				}
			}

			console.log(coordinates);
		});
	},
};
