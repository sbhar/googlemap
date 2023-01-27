import * as React from 'react';
import Map from './maps';

class App extends React.Component<any, any> {
  /** mapを表示する要素 */
  gmapsRef = React.createRef<HTMLDivElement>();

  /** Mapのインスタンスを生成 */
  readonly map = new Map();

  componentDidMount(): void {
    /** コンポーネントがマウントされたらMapを表示する */
    this.map.initMap(this.gmapsRef.current);
    
    /** Map上にマーカーを表示する */
   // this.map.initMarker();

    /** Map上にポリラインを表示する */
    //this.map.initPolyLine();
  }

  render(): JSX.Element {
    const css = `
    html,
body,
#map {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.nicebox {
  position: absolute;
  text-align: center;
  font-family: "Roboto", "Arial", sans-serif;
  font-size: 13px;
  z-index: 5;
  box-shadow: 0 4px 6px -4px #333;
  padding: 5px 10px;
  background: rgb(255, 255, 255);
  background: linear-gradient(to bottom, rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%);
  border: rgb(229, 229, 229) 1px solid;
}

#controls {
  bottom: 10px;
  right: 80px;
  width: 360px;
  height: 45px;
}

#data-box {
  top: -61px;
  left: 0;
  height: 45px;
  line-height: 45px;
  display: none;
}

#census-variable {
  width: 360px;
  height: 20px;
  display: none;
}

#legend {
  display: flex;
  display: -webkit-box;
  padding-top: 7px;
}

.color-key {
  background: linear-gradient(to right, hsl(5deg, 69%, 54%) 0%, hsl(29deg, 71%, 51%) 17%, hsl(54deg, 74%, 47%) 33%, hsl(78deg, 76%, 44%) 50%, hsl(102deg, 78%, 41%) 67%, hsl(127deg, 81%, 37%) 83%, hsl(151deg, 83%, 34%) 100%);
  flex: 1;
  -webkit-box-flex: 1;
  margin: 0 5px;
  text-align: left;
  font-size: 1em;
  line-height: 1em;
}

#data-value {
  font-size: 2em;
  font-weight: bold;
}

#data-label {
  font-size: 2em;
  font-weight: normal;
  padding-right: 10px;
}

#data-label:after {
  content: ":";
}

#data-caret {
  margin-left: -5px;
  display: none;
  font-size: 14px;
  width: 14px;
}
    `
    const Fragment = React.Fragment;
    const style1 = { width: '100%', height: '100vh' } as React.CSSProperties;
    const style2 = {
      paddingTop: '16px',
      textAlign: 'center',
      width: '100%',
      fontWeight: 'bold',
      fontSize: '24px',
    } as React.CSSProperties;

    return (
      <Fragment>
        <div id="controls" className="nicebox">
          
        <style>
                    {css}
                </style>
        <div>
        <select id="census-variable">
          <option
            value="https://storage.googleapis.com/mapsdevsite/json/DP02_0066PE"
          >
            Percent of population over 25 that completed high school
          </option>
          <option
            value="https://storage.googleapis.com/mapsdevsite/json/DP05_0017E"
          >
            Median age
          </option>
          <option
            value="https://storage.googleapis.com/mapsdevsite/json/DP05_0001E"
          >
            Total population
          </option>
          <option
            value="https://storage.googleapis.com/mapsdevsite/json/DP02_0016E"
          >
            Average family size
          </option>
          <option
            value="https://storage.googleapis.com/mapsdevsite/json/DP03_0088E"
          >
            Per-capita income
          </option>
        </select>


      </div>
      <div id="legend">
        <div id="census-min">min</div>
        <div className="color-key"><span id="data-caret">&#x25c6;</span></div>
        <div id="census-max">max</div>
      </div>
    <div id="data-box" className="nicebox">
      <label id="data-label" htmlFor="data-value"></label>
      <span id="data-value"></span>
    </div>
        </div>
        <div ref={this.gmapsRef} style={style1}>
          Google Maps
        </div>
        <div id="map"></div>
      </Fragment>
    );
  }
}

export default App;
