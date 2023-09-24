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
			:defaultCircleDraw="{ center: [30.048318, 103.831788], distance: 20 }"
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
		drawCircleEndCallback(lonLatCenter, radius) {
			console.log("经纬度坐标:", lonLatCenter);
			console.log("半径:", radius);
		},
	},
};
</script>

<style></style>
