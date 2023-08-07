<template>
  <div>
    <div id="map" style="width: 100%; height: 500px"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Draw, Modify } from "ol/interaction";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import { fromLonLat, toLonLat } from "ol/proj";

export default {
  name: "DraggablePolygonMap",
  mounted() {
    const vectorLayer = new VectorLayer({
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

    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([103.831788, 30.048318]),
        zoom: 12,
      }),
    });

    const draw = new Draw({
      source: vectorLayer.getSource(),
      type: "Polygon", // Specify the geometry type here
    });

    this.map.addInteraction(draw);

    const modify = new Modify({ source: vectorLayer.getSource() });
    this.map.addInteraction(modify);

    // Handle feature modification
    modify.on("modifyend", (event) => {
      const modifiedFeature = event.features.getArray()[0];
      const coordinates = modifiedFeature.getGeometry().getCoordinates()[0];

      // Log the modified coordinates
      console.log(coordinates);
    });
  },

  // Rest of the code remains the same
  // ...
};
</script>

<style>
/* Styles remain the same */
</style>
