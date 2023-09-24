<template>
	<div>
		<div
			id="map"
			:style="{
				width: typeof width === 'number' ? width + 'px' : width,
				height: height + 'px',
			}"
		></div>
	</div>
</template>

<script>
/* eslint-disable no-unused-vars */

import "ol/ol.css";
import Feature from "ol/Feature";
import { Point, Circle } from "ol/geom";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import XYZ from "ol/source/XYZ.js";
import VectorSource from "ol/source/Vector";
import { Draw, Modify } from "ol/interaction";
import { createRegularPolygon } from "ol/interaction/Draw";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";
import OLMapDraw from './OLMapDraw';
import OLMapModify from './OLMapModify';
import OLMapUtils from './OLMapUtils';
export default {
	name: "OLMap",
	props: {
		mapUrl: String, // map's url
		minZoom: Number, // min zoom
		maxZoom: Number, // max zoom
		center: Array, // [lat, lon]
		zoom: Number, // zoom
		width: Number,
		height: Number,
		drawType: String, // circle or polygon
		defaultCircleDraw: Object, // {distance: number, center: [lat, lon]}
		drawCircleEndCallback: Function, // new callback whe ndraw circle finish
		enableDraw: Boolean, // is enable draw
	},
	data() {
		return {
			vectorLayer: null,
			map: null,
			drawInteraction: null, // Store draw interaction
		};
	},
	mounted() {
		console.log(this.center);
		// enable vector

		this.map = new Map({
			target: "map",
			layers: [
				new TileLayer({
					source: new XYZ({
						url: this.mapUrl,
					}),
				}),
			],
			view: new View({
				center: fromLonLat([this.center[1], this.center[0]]),
				zoom: this.zoom,
				maxZoom: this.maxZoom,
				minZoom: this.minZoom,
			}),
		});
		this.drawType === "circle"
			? this.drawCircle()
			: this.drawType === "polygon"
			? this.drawPloy()
			: null;
	},
	methods: {
		drawPloy() {
			// init vector
			this.vectorLayer = new VectorLayer({
				source: new VectorSource(),
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
			// add layer
			this.map.addLayer(this.vectorLayer);

			const draw = new Draw({
				source: this.vectorLayer.getSource(),
				type: "Polygon",
			});

			this.map.addInteraction(draw);
			this.drawInteraction = draw; // Store the draw interaction
			const modify = new Modify({ source: this.vectorLayer.getSource() });
			this.map.addInteraction(modify);
			// modify
			modify.on("modifyend", (event) => {
				const modifiedFeature = event.features.getArray()[0];
				const coordinates = modifiedFeature
					.getGeometry()
					.getCoordinates()[0];
				console.log(coordinates);
			});
			// draw
			draw.on("drawend", (event) => {
				const drawendFeature = event.feature;
				const coordinates = drawendFeature
					.getGeometry()
					.getCoordinates()[0];
				if (coordinates.length < 5) {
					// Remove the last feature drawn
					// Remove the draw interaction to prevent further drawing
					this.map.removeInteraction(this.drawInteraction);
				}
				console.log(coordinates);
			});
		},
		drawCircle() {
			const source = new VectorSource();

			this.vectorLayer = new VectorLayer({
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

			const draw = new Draw({
				source: source,
				type: "Circle",
				geometryFunction: createRegularPolygon(40),
			});

			this.map.addLayer(this.vectorLayer);
			this.enableDraw && this.map.addInteraction(draw);
			this.drawInteraction = draw;
			if (
				this.defaultCircleDraw.center &&
				this.defaultCircleDraw.distance
			) {
				const center = fromLonLat([this.center[1], this.center[0]]);
				console.log(
					"🚀 ~ file: index.vue:145 ~ drawCircle ~ center:",
					center,
				);
				const distance = this.defaultCircleDraw.distance * 1000; // 转换成米
				console.log(
					"🚀 ~ file: index.vue:147 ~ drawCircle ~ distance:",
					distance,
				);

				// 创建一个圆形的几何体
				const circleGeometry = new Circle(center, distance);
				console.log(
					"🚀 ~ file: index.vue:167 ~ drawCircle ~ circleGeometry:",
					circleGeometry,
				);
				const circleFeature = new Feature(circleGeometry);
				console.log(
					"🚀 ~ file: index.vue:171 ~ drawCircle ~ circleFeature:",
					circleFeature,
				);
				const source = this.vectorLayer.getSource();
				// 添加到图层中
				source.addFeature(circleFeature);
				// 创建一个表示圆心的点几何体
				const centerPointGeometry = new Point(center);

				// 创建一个 Feature 来表示圆心
				const centerPointFeature = new Feature(centerPointGeometry);
				// 为圆心添加样式
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
				// 添加到图层中
				source.addFeature(centerPointFeature);
				// 更新视图以确保圆形可见
				this.map.getView().fit(circleGeometry, this.map.getSize());
			}
			draw.on("drawend", (event) => {
				const feature = event.feature;
				const geometry = feature.getGeometry();
				const coordinates = geometry.getCoordinates()[0];
				console.log("Geometry Type:", geometry.getType()); // 打印几何对象的类型

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
				console.log(
					"🚀 ~ file: index.vue:226 ~ draw.on ~ center:",
					center,
				);

				const radius = coordinates.reduce((maxDistance, coord) => {
					const distance = Math.sqrt(
						(coord[0] - center[0]) ** 2 +
							(coord[1] - center[1]) ** 2,
					);
					return (Math.max(maxDistance, distance) / 1000).toFixed(2);
				}, 0);

				console.log("Estimated Radius:", radius);
				console.log("Center:", toLonLat(center));

				// Update the coordinates of the center point feature
				const centerPoint = new Feature(new Point(center));
				centerPoint.setStyle(
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

				const source = this.vectorLayer.getSource();
				source.clear(); // Remove the old center point feature
				source.addFeature(centerPoint); // Add the updated center point feature
				console.log(this.drawCircleEndCallback);
				if (typeof this.drawCircleEndCallback === "function") {
					this.drawCircleEndCallback(toLonLat(center), radius);
				}
			});
		},
	},
};
</script>

<style>
/* Styles remain the same */
</style>
