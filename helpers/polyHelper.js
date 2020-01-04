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
  for (let i = 0; i < poly2.length; i++) {
    const point = poly2[i];
    if (classifyPoint(poly1, point) < 0) {
      overlap = true;
      break;
    }
  }
  return overlap;
};

export const poly1FullyContainsPoly2 = (poly1, poly2) => {
  let fullyContained = true;
  for (let i = 0; i < poly2.length; i++) {
    const point = poly2[i];
    if (classifyPoint(poly1, point) > 0) {
      fullyContained = false;
      break;
    }
  }
  return fullyContained;
};

export const difference = (poly1, poly2) => {
  const region1 = pointsToRegion(sanitizeInversion(poly1));
  const region2 = pointsToRegion(sanitizeInversion(poly2));
  const difRegion = PolyBool.difference(region1, region2);
  // if only 2 regions come back check if poly2 is fully contained shape inside of poly1
  return poly1FullyContainsPoly2(poly1, poly2) ? [poly1] : difRegion.regions;
};

export const cleanPolygon = polygon => {
  return PolyBool.polygon(
    PolyBool.segments(pointsToRegion(sanitizeInversion(polygon)))
  );
};

export const mergeTwistedPolygon = polygon => {
  // break into multiple polygons to get a point at every overlaping line
  const polygons = intersect(polygon, polygon);

  // find all duplicate points and add a polyjoint shape
  const flatCoordArray = polygons.flat();
  const stingCoords = flatCoordArray.map(coord => {
    return `${coord[0].toString()},${coord[1].toString()}`;
  });
  const joints = stingCoords.reduce((acc, value, _, array) => {
    if (acc.includes(value)) return acc;

    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === value) {
        count++;
      }
    }
    if (count > 1) acc.push(value);
    return acc;
  }, []);

  // small squares that will be added at joints to merge all polygons together
  const polyJoints = [];
  const jointSize = 0.00002;
  joints.forEach(joint => {
    const splitCoord = joint.split(',');
    const lat = parseFloat(splitCoord[0]);
    const lng = parseFloat(splitCoord[1]);
    const polyjoint = [
      [lat + jointSize, lng - jointSize],
      [lat + jointSize, lng + jointSize],
      [lat - jointSize, lng + jointSize],
      [lat - jointSize, lng - jointSize]
    ];
    polyJoints.push(polyjoint);
  });

  const combinedPolygons = [...polygons, ...polyJoints];
  let segments = PolyBool.segments(
    pointsToRegion(sanitizeInversion(combinedPolygons[0]))
  );
  for (let i = 1; i < combinedPolygons.length; i++) {
    let seg2 = PolyBool.segments(
      pointsToRegion(sanitizeInversion(combinedPolygons[i]))
    );
    let comb = PolyBool.combine(segments, seg2);
    segments = PolyBool.selectUnion(comb);
  }
  return PolyBool.polygon(segments).regions.pop();
};

const roundToDecimalPlaces = (num, places) => {
  var multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
};

const roundCoordsOfPolygon = poly => {
  return poly.map(coord => {
    return [
      roundToDecimalPlaces(coord[0], 7),
      roundToDecimalPlaces(coord[1], 7)
    ];
  });
};

const roundCoordsOfPolygons = polys => {
  return polys.map(poly => roundCoordsOfPolygon(poly));
};

export const intersect = (poly1, poly2) => {
  const region1 = pointsToRegion(sanitizeInversion(poly1));
  const region2 = pointsToRegion(sanitizeInversion(poly2));
  const intersectRegion = PolyBool.intersect(region1, region2);
  // if only 2 regions come back check if poly2 is fully contained shape inside of poly1
  return intersectRegion.regions;
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

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
