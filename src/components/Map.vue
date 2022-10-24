<script setup>
import { ref, reactive, onMounted, provide, inject } from "vue";
// open layer
import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj';
import {register} from 'ol/proj/proj4';

// map main components
import { Map, View } from 'ol';
// layers
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
// source
import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
// controls
import {FullScreen, defaults as defaultControls} from 'ol/control';
// interaction
import {DragRotateAndZoom, defaults as defaultInteractions, Select as SelectInteraction} from 'ol/interaction';
// style
import {Circle, Fill, Stroke, Style, Text as TextStyle} from 'ol/style';
// geom
import Point from 'ol/geom/Point';
// 3-rd
import LayerSwitcher from 'ol-layerswitcher';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';
// other
import {getTopLeft, getWidth} from 'ol/extent';

// 註冊坐標系統
proj4.defs("EPSG:3826","+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs");
register(proj4);

const projection = getProjection('EPSG:3857');
const projectionExtent = projection.getExtent();
const size = getWidth(projectionExtent) / 256;
let resolutions = new Array(21);
let matrixIds = new Array(21);
for (let z = 0; z < 21; ++z) {
  // generate resolutions and matrixIds arrays for this WMTS
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}	

const propData = inject('gcpCoor');
const dt_gcp = inject('dt_gcp');
const map = ref();
const width = 2;

// OSM底圖
const osmLayer = new TileLayer({
  name: 'OSMLayer',
  title: 'OSM底圖',
  type: 'base',
  visible: false,
  source: new OSM()
});
// 電子地圖
const emap_b = new TileLayer({
  name: 'EMAP_B', 
  title: '臺灣通用電子地圖', 
  type: 'base', 
  opacity: 1.0, 
  visible: false, 
  source: new WMTS({ 
    url: 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}', 
    layer: 'EMAP', 
    requestEncoding: "REST", 
    matrixSet: "GoogleMapsCompatible", 
    format: "image/png", 
    transparente: true, 
    projection: projection, 
    tileGrid: new WMTSTileGrid({ 
      origin: getTopLeft(projectionExtent), 
      matrixIds: matrixIds, 
      resolutions: resolutions 
    }), 
    style: 'default', 
    maxZoom: 20 
  }) 
});
// 正射影像
const photo2_b = new TileLayer({ 
  name: 'PHOTO2_B', 
  title: '正射影像', 
  type: 'base', 
  opacity: 1.0, 
  visible: true, 
  source: new WMTS({ 
    url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}', 
    layer: 'PHOTO2', 
    requestEncoding: "REST", 
    matrixSet: "GoogleMapsCompatible", 
    format: "image/png", 
    transparente: true, 
    projection: projection, 
    tileGrid: new WMTSTileGrid({ 
      origin: getTopLeft(projectionExtent), 
      matrixIds: matrixIds, 
      resolutions: resolutions 
    }), 
    style: 'default', 
    maxZoom: 20 
  }) 
});
// 校正標圖層
const ptLayer = new VectorLayer({
  name: 'GCPLayer',
  title: '校正標',
  source: new VectorSource(),
  style: pointstyles,
});

// 圖層群組
const baseGroup = new LayerGroup({
  'title': '底圖',
  layers:[osmLayer,emap_b,photo2_b],
});

const select = new SelectInteraction({style: selectStyle});
let selectedFeatures = select.getFeatures();

// 圖層選擇器
const layerSwitcher = new LayerSwitcher({
  activationMode: 'click',
  tipLabel: '切換圖層',
  reverse: true,
  groupSelectStyle: 'children'
});

// 圖層樣式
function pointstyles(feature){
  let pointText = feature.get('name');
  return new Style({
    image: new Circle({
      radius: width * 2,
      fill: new Fill({
        color: [255, 255, 255, 0.5],
      }),
      stroke: new Stroke({
        color: [0, 153, 255, 1],
        width: width / 2,
      }),
    }),
    text: new TextStyle({
      text: pointText,
      font: '14px Arial',
      offsetX: 0,
			offsetY: 14,
      stroke: new Stroke({
        color: '#DFF6FF', 
        width: 2,
      }),
      fill: new Fill({
        color: '#256D85',
      }),
    }),
  })
}
// 被選樣式
function selectStyle(feature) {
  let selected = pointstyles(feature).clone();
  selected.getText().getStroke().setColor('#FAEDF0');
  selected.getText().getFill().setColor('#161853');
  selected.getText().setFont('bold 16px Arial')
  selected.setImage(
    new Circle({
      radius: width * 2,
      fill: new Fill({
        color: '#CD1818',
      }),
      stroke: new Stroke({
        color: '#0F2C67',
        width: width / 2,
      }),
    })
  );
  selected.setZIndex(Infinity);
  // selected.getImage().getStroke().setColor('#FF5677')
  return selected;
}
// 載入點位
function loadFeatures(){
  if(map.value){
    let ptFeatures = [];
    ptLayer.getSource().clear();
    // console.log(propData.value.length);
    if(propData.value.length>0){
      for(let i=0;i<propData.value.length;i++){
        if(propData.value[i].latest_coor){
          const x = parseFloat(propData.value[i].latest_coor.coor_E);
          const y = parseFloat(propData.value[i].latest_coor.coor_N);  
          if(x && y){
            ptFeatures.push(new Feature(
              {
                name: propData.value[i].id,
                geometry: new Point([x, y]),
              }
            ));
          }
        }
      }
      ptLayer.getSource().addFeatures(ptFeatures);
      //縮放視窗至目標範圍
      map.value.getView().fit(ptLayer.getSource().getExtent(),{
        size: map.value.getSize(),
        padding: [50,50,50,50],
        duration: 1000
      });
    }
  }
}
// 文查圖
function selectPtFeature(ptName){
  selectedFeatures.clear();
  ptLayer.getSource().getFeatures().forEach(function (e){
    if (e.get('name')===ptName){
      selectedFeatures.push(e);
      map.value.getView().setCenter(e.getGeometry().getCoordinates());
    }
  });
}
// 圖查文
select.on('select',e=>{
  if(e.target.getFeatures().getArray().length>0){
    let ptID =e.target.getFeatures().getArray()[0].get('name');
    dt_gcp.value.rows(function ( idx, data, node ) {
      return (data.id===ptID)?true:false
    }).select();
  }
});

onMounted(function () {
  // console.log('map onMounted');
  new Promise((resolve, reject)=>{
    map.value = new Map({
      target: 'map',
      layers: [baseGroup,ptLayer],
      view: new View({
        projection: 'EPSG:3826',
        center: [215227.575,2647360.432],
        zoom: 14
      }),
      controls: defaultControls().extend([new FullScreen()]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
    });
    map.value.addInteraction(select);
    map.value.addControl(layerSwitcher);
    return resolve("Success!");
  }).then((res)=>{
    // 載入坐標點
    loadFeatures();
  });
});

defineExpose({
  loadFeatures,
  selectPtFeature,
});

</script>

<template>
  <div id="map" class="h-100 w-100"></div>
</template>

<style>
@import "ol/ol.css";
@import 'ol-layerswitcher/dist/ol-layerswitcher.css';
/* position the rotate control lower than usual */
#map .ol-rotate {
  top: 4.5em; 
}
#map .layer-switcher {
  top: 0.5em; 
}

#map .layer-switcher button {
  width: 38px;
  height: 38px;
}

#map .ol-full-screen {
  top: 3em; 
}
#map .panel label{
  vertical-align: top;
  font-size: 0.9em;
  line-height: 1;
}
#map .layer-switcher ul{
  margin: 0;
}
</style>