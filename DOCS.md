the assets under the tiles directory would be use to replace the actual map from leaflet so it would be displaying our map instead of the world map.

this tiles was generated using (gdal2tile)[]

to apply the custom tiles you have made, just place the tiles directory into the TileLayer component

```jsx
<TileLayer url="tiles/{z}/{x}/{y}.png" noWrap={true} />
```
