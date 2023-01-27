import { Point, LineSymbol, Window } from './googlemaps.model';

class Maps {
  /** Markerを表示する拠点リスト */
  points: Point[] = [
    { title: 'maker1', position: { lat: -25.363, lng: 131.044 } },
    { title: 'maker2', position: { lat: -32.397, lng: 20.044 } },
    { title: 'maker3', position: { lat: 34.397, lng: 25.044 } },
    { title: 'maker4', position: { lat: 48.397, lng: 90.044 } },
    { title: 'maker5', position: { lat: 29.32, lng: 135.9 } },
  ];

  

  map!: google.maps.Map;

  /** ポリライン */
  line: google.maps.Polyline | null = null;

  /**
   * Mapを任意の要素に表示する
   * @param mapDiv Mapを表示する要素
   */
  
  public initMap(mapDiv: HTMLDivElement | null): void {
    /**
     * 地図を表示する際のオプション（初期表示）
     * Mapsのオプション一覧
     * https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
     */
     const mapStyle: google.maps.MapTypeStyle[] = [
      {
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ visibility: "on" }, { color: "#fcfcfc" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ visibility: "on" }, { color: "#bfd4ff" }],
      },
    ];
    var censusMin = Number.MAX_VALUE,
    censusMax = -Number.MAX_VALUE;

    let mapdata: google.maps.Data;
    const mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(42.361145, -71.057083),
      zoom: 12,
      styles: mapStyle,
    };

    
    /** Mapオブジェクトに地図表示要素情報とオプション情報を渡し、インスタンス生成 */
    this.map = new google.maps.Map(mapDiv, mapOptions); // <= refで取得した要素
    this.map.data.setStyle(styleFeature);
    this.map.data.addListener("mouseover", mouseInToRegion);
    this.map.data.addListener("mouseout", mouseOutOfRegion);
    mapdata = this.map.data;
     // wire up the button
     const selectBox = document.getElementById(
      "census-variable"
    ) as HTMLSelectElement;
  
    google.maps.event.addDomListener(selectBox, "change", () => {
      // censusMin = Number.MAX_VALUE;
      // censusMax = -Number.MAX_VALUE;
      // this.map.data.forEach((row) => {
      //   row.setProperty("census_variable", undefined);
      // });
      // (document.getElementById("data-box") as HTMLElement).style.display = "none";
      // (document.getElementById("data-caret") as HTMLElement).style.display = "none";
      //loadCensusData(selectBox.options[selectBox.selectedIndex].value);
      // const state = this.map.data.getFeatureById(1);
      // if (state) {
      //   //state.setProperty("census_variable", censusVariable);
      //   state.setProperty("census_variable", 82.6);
      // }
      const xhr = new XMLHttpRequest();

      xhr.open("GET", "https://storage.googleapis.com/mapsdevsite/json/DP05_0001E" + ".json");
    
      xhr.onload = function () {
        const censusData = JSON.parse(xhr.responseText) as any;
        


        censusData.shift(); // the first row contains column names
        censusData.forEach((row: string) => {
          const censusVariable = parseFloat(row[0]);
          const stateId = row[1];
          console.log(stateId);
    
          // keep track of min and max values
          if (censusVariable < censusMin) {
            censusMin = censusVariable;
          }
    
          if (censusVariable > censusMax) {
            censusMax = censusVariable;
          }
    
          const state = mapdata.getFeatureById(stateId);
    
          // update the existing row with the new data
          if (state) {
            state.setProperty("census_variable", censusVariable);
          }
        });
    
        // update and display the legend
        (document.getElementById("census-min") as HTMLElement).textContent =
          censusMin.toLocaleString();
        (document.getElementById("census-max") as HTMLElement).textContent =
          censusMax.toLocaleString();
      };
    
      xhr.send();




    });



    // google.maps.event.addDomListener(selectBox, "change", () => {
    //   censusMin = Number.MAX_VALUE;
    //   censusMax = -Number.MAX_VALUE;
    //   this.map.data.forEach((row) => {
    //     row.setProperty("census_variable", undefined);
    //   });
    //   (document.getElementById("data-box") as HTMLElement).style.display = "none";
    //   (document.getElementById("data-caret") as HTMLElement).style.display = "none";
    //   //loadCensusData(selectBox.options[selectBox.selectedIndex].value);
    //   //console.log(selectBox.options[selectBox.selectedIndex].value);
    //   const xhr = new XMLHttpRequest();let censusMin = Number.MAX_VALUE;let censusMax = -Number.MAX_VALUE;
    //   xhr.open("GET", "https://storage.googleapis.com/mapsdevsite/json/DP05_0001E" + ".json");
    
    //   xhr.onload = function () {
    //     const censusData = JSON.parse(xhr.responseText) as any;
    
    //     censusData.shift(); // the first row contains column names
    //     censusData.forEach((row: string) => {
    //       const censusVariable = parseFloat(row[0]);
    //       const stateId = row[1];
    
    //       // keep track of min and max values
    //       if (censusVariable < censusMin) {
    //         censusMin = censusVariable;
    //       }
    
    //       if (censusVariable > censusMax) {
    //         censusMax = censusVariable;
    //       }
    //       console.log(map.data);
    //        const state = map.data.getFeatureById(stateId);
    
    //       // // update the existing row with the new data
    //       if (state) {
    //         state.setProperty("census_variable", censusVariable);
    //       }
    //     });
    
    //     // update and display the legend
    //     (document.getElementById("census-min") as HTMLElement).textContent =
    //       censusMin.toLocaleString();
    //     (document.getElementById("census-max") as HTMLElement).textContent =
    //       censusMax.toLocaleString();
    //   };
    
    //   xhr.send();
    // });
  
    // // state polygons only need to be loaded once, do them now
    // load US state outline polygons from a GeoJson file
    this.map.data.loadGeoJson(
      "https://storage.googleapis.com/mapsdevsite/json/states.js",
      { idPropertyName: "STATE" }
    );
  
    // wait for the request to complete by listening for the first feature to be
    // added
    // google.maps.event.addListenerOnce(this.map.data, "addfeature", () => {
    //   google.maps.event.trigger(
    //     document.getElementById("census-variable") as HTMLElement,
    //     "change"
    //   );
    // });
    google.maps.event.addListenerOnce(this.map.data, "addfeature", () => {
      console.log("here");
      google.maps.event.trigger(
        document.getElementById("census-variable") as HTMLElement,
        "change"
      );
    });
  }
  // public  clearCensusData() {
  //   censusMin = Number.MAX_VALUE;
  //   censusMax = -Number.MAX_VALUE;
  //   map.data.forEach((row) => {
  //     row.setProperty("census_variable", undefined);
  //   });
  //   (document.getElementById("data-box") as HTMLElement).style.display = "none";
  //   (document.getElementById("data-caret") as HTMLElement).style.display = "none";
  // }
  public mouseInToRegion(e: any) {
    // set the hover state so the setStyle function can change the border
    e.feature.setProperty("state", "hover");
  
    const percent =
      ((e.feature.getProperty("census_variable") - censusMin) /
        (censusMax - censusMin)) *
      100;
  
    // update the label
    (document.getElementById("data-label") as HTMLElement).textContent =
      e.feature.getProperty("NAME");
    (document.getElementById("data-value") as HTMLElement).textContent = e.feature
      .getProperty("census_variable")
      .toLocaleString();
    (document.getElementById("data-box") as HTMLElement).style.display = "block";
    (document.getElementById("data-caret") as HTMLElement).style.display =
      "block";
    (document.getElementById("data-caret") as HTMLElement).style.paddingLeft =
      percent + "%";
  }
  public loadCensusData(variable: string) {
    console.log(variable);
    // load the requested variable from the census API (using local copies)
    const xhr = new XMLHttpRequest();let censusMin = Number.MAX_VALUE;let censusMax = -Number.MAX_VALUE;
    xhr.open("GET", variable + ".json");
  
    xhr.onload = function () {
      const censusData = JSON.parse(xhr.responseText) as any;
  
      censusData.shift(); // the first row contains column names
      censusData.forEach((row: string) => {
        const censusVariable = parseFloat(row[0]);
        const stateId = row[1];
  
        // keep track of min and max values
        if (censusVariable < censusMin) {
          censusMin = censusVariable;
        }
  
        if (censusVariable > censusMax) {
          censusMax = censusVariable;
        }
        console.log(map.data);
         const state = map.data.getFeatureById(stateId);
  
        // // update the existing row with the new data
        // if (state) {
        //   state.setProperty("census_variable", censusVariable);
        // }
      });
  
      // update and display the legend
      (document.getElementById("census-min") as HTMLElement).textContent =
        censusMin.toLocaleString();
      (document.getElementById("census-max") as HTMLElement).textContent =
        censusMax.toLocaleString();
    };
  
    xhr.send();
  }
  public  styleFeature(feature: google.maps.Data.Feature) {
    const low = [5, 69, 54]; // color of smallest datum
    const high = [151, 83, 34]; // color of largest datum
  
    // delta represents where the value sits between the min and max
    const delta =
      (feature.getProperty("census_variable") - censusMin) /
      (censusMax - censusMin);
  
    const color: number[] = [];
  
    for (let i = 0; i < 3; i++) {
      // calculate an integer color based on the delta
      color.push((high[i] - low[i]) * delta + low[i]);
    }
  
    // determine whether to show this shape or not
    let showRow = true;
  
    if (
      feature.getProperty("census_variable") == null ||
      isNaN(feature.getProperty("census_variable"))
    ) {
      showRow = false;
    }
  
    let outlineWeight = 0.5,
      zIndex = 1;
  
    if (feature.getProperty("state") === "hover") {
      outlineWeight = zIndex = 2;
    }
  
    return {
      strokeWeight: outlineWeight,
      strokeColor: "#fff",
      zIndex: zIndex,
      fillColor: "hsl(" + color[0] + "," + color[1] + "%," + color[2] + "%)",
      fillOpacity: 0.75,
      visible: showRow,
    };
  }



  // public mouseOutOfRegion(e: any) {
  //   // reset the hover state, returning the border to normal
  //   e.feature.setProperty("state", "normal");
  // }
  /**
   * Map上にマーカーを表示する
   */
  // public initMarker(): void {
  //   /** 範囲（境界）のインスタンスを作成するクラス */
  //   const bounds = new google.maps.LatLngBounds();

  //   /** Markerを表示 */
  //   this.points.forEach(
  //     (point: Point): void => {
  //       /**
  //        * Markerを設定
  //        * Markerオプション
  //        * https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
  //        */
  //       const marker = new google.maps.Marker({
  //         map: this.map,
  //         draggable: true, // ドラッグできるか
  //         opacity: 0.7, // 透明度
  //         position: point.position,
  //         title: point.title,
  //       });

  //       /** 位置情報を範囲に追加 */
  //       bounds.extend(marker.getPosition());

  //       /** 吹き出しを設定 */
  //       const infoWindow = new google.maps.InfoWindow({
  //         content: point.title,
  //       });

  //       /** クリック時の処理（吹き出し表示） */
  //       marker.addListener('click', () => {
  //         infoWindow.open(this.map, marker);
  //       });

  //       /** マーカードラッグ時の処理（ポリラインのアップデート） */
  //       marker.addListener('dragend', (event: google.maps.MouseEvent) => {
  //         const title = point.title;
  //         this.points = this.points.map((point: Point) => {
  //           if (point.title === title) {
  //             return {
  //               ...point,
  //               position: {
  //                 lat: event.latLng.lat(),
  //                 lng: event.latLng.lng(),
  //               },
  //             };
  //           }
  //           return point;
  //         });

  //         this.initPolyLine();
  //       });
  //     },
  //   );

  //   /** すべてのMarkerを地図に収める */
  //   this.map.fitBounds(bounds);
  // }

  /**
   * Map上にポリラインを表示する
   */
  // public initPolyLine(): void {
  //   /**
  //    * 既存のポリラインを削除
  //    * https://developers.google.com/maps/documentation/javascript/examples/polyline-remove
  //    * */
  //   if (this.line !== null) {
  //     this.line.setMap(null);
  //   }

  //   /**
  //    * polyline上を動くシンボル
  //    * https://developers.google.com/maps/documentation/javascript/symbols#animate
  //    * */
  //   const lineSymbol: LineSymbol = {
  //     path: google.maps.SymbolPath.CIRCLE,
  //     scale: 8,
  //     strokeColor: '#113345',
  //   };

  //   /** polylineを表示 */
  //   this.line = new google.maps.Polyline({
  //     path: this.points
  //       .map((point: Point) => {
  //         return point.position;
  //       })
  //       .concat([this.points[0].position]),
  //     icons: [
  //       {
  //         icon: lineSymbol,
  //         offset: '100%',
  //       },
  //     ],
  //     strokeColor: '#ccc',
  //     map: this.map,
  //   });

  //   /** ポリラインを表示 */
  //   this.line.setMap(this.map);

  //   /** アニメーションを実行 */
  //   this.animateCircle(this.line);
  // }

  /**
   * シンボルをpolylineに沿ってアニメーションさせる
   * */
  // private animateCircle(line: google.maps.Polyline): void {
  //   let count = 0;
  //   window.setInterval((): void => {
  //     count = (count + 1) % 200;

  //     const icons = line.get('icons');
  //     icons[0].offset = count / 2 + '%';
  //     line.set('icons', icons);
  //   }, 40);
  // }
}

export default Maps;
