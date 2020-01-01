// import PolyBool from 'polybooljs';
const PolyBool = require('polybooljs');
const classifyPoint = require('robust-point-in-polygon');

// [...{latitude: x, longitude:y}]  -->  [...[x,y]]
export const coordsToPoly = coords => {
  return coords.map(c => [c.latitude, c.longitude]);
};

// [...[x,y]]  -->  [...{latitude: x, longitude:y}]
export const pointsToCoords = points => {
  return points.map(p => {
    return { latitude: p[0], longitude: p[1] };
  });
};

export const pointsToRegion = points => {
  return {
    regions: [points],
    inverted: false
  };
};

export const polysOverlap = (poly1, poly2) => {
  let overlap = false;
  for (let i = 0; i < poly1.length; i++) {
    const point = poly1[i];
    if (classifyPoint(poly2, point) < 0) {
      overlap = true;
      break;
    }
  }
  return overlap;
};

export const difference = (poly1, poly2) => {
  const region1 = pointsToRegion(sanitizeInversion(poly1));
  const region2 = pointsToRegion(sanitizeInversion(poly2));
  const difRegion = PolyBool.difference(region1, region2);
  return difRegion.regions;
};

export const merge = (poly1, poly2) => {
  const region1 = pointsToRegion(sanitizeInversion(poly1));
  const region2 = pointsToRegion(sanitizeInversion(poly2));
  const mergedRegions = PolyBool.union(region1, region2);
  // only return last region, all other regions are holes
  return mergedRegions.regions.pop();
};

// invert polygon if wound counter-clockwise
// [...[x,y]]
export const sanitizeInversion = polygon => {
  // https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
  // Sum over the edges, (x2 − x1)(y2 + y1)
  // check if inverted *if sum is negative it's counter-clockwise
  // point[0] = (5,0)   edge[0]: (6-5)(4+0) =   4
  // point[1] = (6,4)   edge[1]: (4-6)(5+4) = -18
  // point[2] = (4,5)   edge[2]: (1-4)(5+5) = -30
  // point[3] = (1,5)   edge[3]: (1-1)(0+5) =   0
  // point[4] = (1,0)   edge[4]: (5-1)(0+0) =   0
  //                                          ---
  //                                          -44  counter-clockwise
  let sum = 0;
  polygon.forEach((pointA, i) => {
    const pointB = i === polygon.length - 1 ? polygon[0] : polygon[i + 1];
    sum += pointA[0] * pointB[1] - pointA[1] * pointB[0]; // (pointB[0] - pointA[0]) * (pointB[1] + pointA[1]);
  });

  let nonInvertedPolygon = [...polygon];
  return sum < 0 ? nonInvertedPolygon.reverse() : nonInvertedPolygon;
};
