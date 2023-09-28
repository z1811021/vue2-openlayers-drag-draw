<template>
	<div>
		<div
			id="map"
			:style="{
				width: typeof width === 'number' ? width + 'px' : width,
				height: height + 'px',
			}"
		/>
	</div>
</template>

<script>
/* eslint-disable no-unused-vars */
import "ol/ol.css";
import VectorSource from "ol/source/Vector";
import OLMapDraw from "./OLMapDraw";
import OLMapModify from "./OLMapModify";
import OLMapUtils from "./OLMapUtils";

export default {
	name: "OLMap",
	props: {
		mapUrl: String, // map's url
		minZoom: Number, // min zoom
		maxZoom: Number, // max zoom
		center: Array, // [lat, lon]
		zoom: Number, // zoom
		width: {
			type: [Number, String],
			default: 100,
		}, // support Percentage or Number
		height: Number, // Number
		drawType: String, // circle or polygon
		// defaultCircleDraw: Object, // {distance: number, center: [lat, lon]}
		drawCircleEndCallback: Function, // new callback whe ndraw circle finish
		enableDraw: Boolean, // is enable draw
	},
	data() {
		return {
			vectorLayer: null, // vector
			map: null,
			drawInteraction: null, // Store draw interaction
			source: null, // vector source
			lastListenDrawCircle: null, // record last draw circle object no need redundant
			isCreated: false, // is new map component created
		};
	},
	created() {
		console.log("map created");
		this.isCreated = true;
		this.clearPreviousState();
		this.source = new VectorSource();

		this.$EventBus.$on("call-draw-circle", (defaultCircleDraw) => {
			console.log(
				"🚀 ~ file: index.vue:53 ~ created ~ defaultCircleDraw:",
				defaultCircleDraw,
			);
			console.log(
				OLMapUtils.deepEqual(
					this.lastListenDrawCircle,
					defaultCircleDraw,
				),
			);
			console.log(
				"🚀 ~ file: index.vue:55 ~ created ~ this.lastListenDrawCircle:",
				this.lastListenDrawCircle,
			);

			!OLMapUtils.deepEqual(
				this.lastListenDrawCircle,
				defaultCircleDraw,
			) &&
				(OLMapDraw.drawCircle(
					this.map,
					defaultCircleDraw,
					this.drawCircleEndCallback,
					this.enableDraw,
					this.source,
					this.isCreated,
				),
				(this.lastListenDrawCircle = defaultCircleDraw),
				(this.isCreated = false));
		});
	},
	mounted() {
		this.map = OLMapUtils.createMap(
			this.center,
			this.zoom,
			this.minZoom,
			this.maxZoom,
			this.mapUrl,
		);
		// two situation circle or polygon
		if (this.drawType === "circle" && this.enableDraw) {
			// OLMapDraw.drawCircle(
			//   this.map,
			//   {}, // first time empty object no need draw circle
			//   this.drawCircleEndCallback,
			//   this.enableDraw,
			//   this.source,
			//   this.lastFeature
			// )
		} else if (this.drawType === "polygon") {
			// OLMapDraw.drawPolygon(
			// 	this.map,
			// 	(drawInteraction) => {
			// 		console.log('🚀 ~ file: index.vue:65 ~ mounted ~ drawInteraction:', drawInteraction)
			// 		// 在这里处理回调函数的逻辑
			// 		this.drawInteraction = drawInteraction;
			// 		this.map.removeInteraction(drawInteraction);
			// 	},
			// );
		}
		// OLMapModify.addModifyInteraction(this.map);
	},
	methods: {
		clearPreviousState() {
			this.vectorLayer = null;
			this.map = null;
			this.drawInteraction = null;
			this.source = null;
			this.lastListenDrawCircle = null;
		},
		// drawPloy() {
		// 	// init vector
		// 	this.vectorLayer = new VectorLayer({
		// 		source: new VectorSource(),
		// 		style: new Style({
		// 			fill: new Fill({
		// 				color: "rgba(0, 128, 255, 0.2)",
		// 			}),
		// 			stroke: new Stroke({
		// 				color: "blue",
		// 				width: 2,
		// 			}),
		// 			image: new CircleStyle({
		// 				radius: 7,
		// 				fill: new Fill({
		// 					color: "red",
		// 				}),
		// 			}),
		// 		}),
		// 	});
		// 	// add layer
		// 	this.map.addLayer(this.vectorLayer);
		// 	const draw = new Draw({
		// 		source: this.vectorLayer.getSource(),
		// 		type: "Polygon",
		// 	});
		// 	this.map.addInteraction(draw);
		// 	this.drawInteraction = draw; // Store the draw interaction
		// 	const modify = new Modify({ source: this.vectorLayer.getSource() });
		// 	this.map.addInteraction(modify);
		// 	// modify
		// 	modify.on("modifyend", (event) => {
		// 		const modifiedFeature = event.features.getArray()[0];
		// 		const coordinates = modifiedFeature
		// 			.getGeometry()
		// 			.getCoordinates()[0];
		// 		console.log(coordinates);
		// 	});
		// 	// draw
		// 	draw.on("drawend", (event) => {
		// 		const drawendFeature = event.feature;
		// 		const coordinates = drawendFeature
		// 			.getGeometry()
		// 			.getCoordinates()[0];
		// 		if (coordinates.length < 5) {
		// 			// Remove the last feature drawn
		// 			// Remove the draw interaction to prevent further drawing
		// 			this.map.removeInteraction(this.drawInteraction);
		// 		}
		// 		console.log(coordinates);
		// 	});
		// },
	},
};
</script>

<style>
/* Styles remain the same */
</style>
