<script setup>
import { ref, reactive, onMounted, provide, inject } from "vue";
// open layer
import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj';
import {register} from 'ol/proj/proj4';

// map main components
import { Map, View } from 'ol';
// layers
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
// source
import OSM from 'ol/source/OSM';
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

const propData = inject('gcpCoor');
const dt_gcp = inject('dt_gcp');
const map = ref();
const osmLayer = new TileLayer({source: new OSM()});
const width = 2;
const ptLayer = new VectorLayer({
  name: 'GCPLayer',
  title: '校正標',
  source: new VectorSource(),
  style: pointstyles,
});
const select = new SelectInteraction({style: selectStyle});
let selectedFeatures = select.getFeatures();

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

    // console.log(ptLayer);
    for(let i=0;i<propData.value.length;i++){
      ptFeatures.push(new Feature(
        {
          name: propData.value[i].id,
          geometry: new Point([propData.value[i].latest_coor.coor_E, propData.value[i].latest_coor.coor_N]),
        }
      ));
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
    console.log('ptID', ptID);
    console.log('dt_gcp', dt_gcp);
    
    dt_gcp.value.rows(function ( idx, data, node ) {
      return (data.id===ptID)?true:false
    }).select();
    // table.row(ptID).select();
    // var orderId = table.rows({order: 'current'}).indexes().indexOf(parseInt(ptID));
    // var page_index = parseInt((orderId-1)/table.page.len());
    // console.log('orderId:'+orderId);
    // console.log('page_index:'+page_index);
    // table.page(page_index).draw( 'page' );
  }
});

onMounted(function () {
  proj4.defs("EPSG:3826","+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
  register(proj4);
  console.log("init map");

  new Promise((resolve, reject)=>{
    map.value = new Map({
      target: 'map',
      layers: [osmLayer,ptLayer],
      view: new View({
        projection: 'EPSG:3826',
        center: [215227.575,2647360.432],
        zoom: 14
      }),
      controls: defaultControls().extend([new FullScreen()]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
    });

    
    map.value.addInteraction(select);
    return resolve("Success!");
  }).then((res)=>{
    console.log("map OK");
    // 載入坐標點
    loadFeatures();
    // 建立選擇池
    
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
/* position the rotate control lower than usual */
#map .ol-rotate {
  top: 2.5rem; 
}
</style>