<template>
	<div id="app">
		<OLMap
			mapUrl="http://39.100.45.184:20080/map/tiles/{z}/{x}/{y}.jpg"
			:center="[30.048318, 103.831788]"
			:zoom="10"
			:minZoom="3"
			:maxZoom="18"
			:width="500"
			:height="500"
			drawType="circle"
			:enableDraw="false"
			:drawCircleEndCallback="drawCircleEndCallback"
		/>
	</div>
</template>

<script>
import OLMap from "./components/OLMap/";

export default {
	name: "App",
	components: {
		OLMap,
	},
	methods: {
		drawCircleEndCallback(latLonCenter, radius) {
			console.log("纬经度坐标:", latLonCenter);
			console.log("半径:", radius);
		},
		handleDrawCircle(defaultCircleDraw) {
			console.log("执行了 call-draw-circle");
			this.$EventBus.$emit("call-draw-circle", defaultCircleDraw);
		},
		handleLocateCenter(centerObj) {
			console.log("执行了 call-locate-center");
			this.$EventBus.$emit("call-locate-center", centerObj);
		},
		handleEnableDrawCircle(isEnable) {
			console.log("执行了 now you can draw circle");
			this.$EventBus.$emit("call-enable-draw-circle", {
				enable: isEnable,
			});
		},
	},
	created() {
		setTimeout(() => {
			this.handleDrawCircle({
				center: [30.058318, 103.831788],
				distance: 2,
			});
		}, 1000);
		setTimeout(() => {
			this.handleDrawCircle({
				center: [30.098318, 103.831788],
				distance: 30,
			});
		}, 3000);
		setTimeout(() => {
			this.handleLocateCenter({
				center: [31.098318, 103.831788],
				zoom: 13,
			});
		}, 6000);
		setTimeout(() => {
			this.handleEnableDrawCircle(true);
		}, 12000);
		// setInterval(() => {
		// 	this.handleDrawCircle({
		// 		center: [30.098318, 103.831788],
		// 		distance: 30,
		// 	});
		// }, 500);
	},
};
</script>

<style></style>
