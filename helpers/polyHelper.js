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

export const directionOfPoint = (A, B, P) => {
  let [Ax, Ay] = A;
  let [Bx, By] = B;
  let [Px, Py] = P;

  Bx -= Ax;
  By -= Ay;
  Px -= Ax;
  Py -= Ay;

  // Determining cross Product
  const cross_product = Bx * Py - By * Px;
  // point is to the left
  if (cross_product > 0) return -1;
  // point is to the right
  if (cross_product < 0) return 1;
  // point is on the line
  return 0;
};

export const untwistPolygon = polygon => {
  //-1 find northern point
  let northernLat = polygon[0][0];
  let northernIndex = 0;
  for (let i = 1; i < polygon.length; i++) {
    const lat = polygon[i][0];
    if (lat > northernLat) {
      northernLat = lat;
      northernIndex = i;
    }
  }
  // return { northernLat, northernIndex };
  //-2 make northern point the start of the polygon
  polygon = [
    ...polygon.slice(northernIndex, polygon.length),
    ...polygon.slice(0, northernIndex)
  ];

  //-3 reverse polygon if not moving clockwise
  const backward = [...polygon];
  backward.reverse();
  const front = backward.pop();
  let reversedPolygon = [front, ...backward];
  const reversePoly = () => {
    const temp = polygon;
    polygon = reversedPolygon;
    reversedPolygon = temp;
  };

  const prevCoord = polygon[polygon.length - 1];
  const nextCoord = polygon[1];
  const northernCoord = polygon[0];
  // if next coordinate is west and previous coordinate is east - reverse
  if (prevCoord[1] > northernCoord[1] && nextCoord[1] < northernCoord[1]) {
    reversePoly();
  }
  // if both are to the east
  if (prevCoord[1] > northernCoord[1] && nextCoord[1] > northernCoord[1]) {
    // and next coordinate is further south - reverse
    if (nextCoord[0] < prevCoord[0]) {
      reversePoly();
    }
  }
  // if both are to the west
  if (prevCoord[1] < northernCoord[1] && nextCoord[1] < northernCoord[1]) {
    // and next coordinate is further north - reverse
    if (nextCoord[0] > prevCoord[0]) {
      reversePoly();
    }
  }
  //-4 move point to point looking for intersections
  let newPoly = [];
  for (let i = 0; i < polygon.length; i++) {
    const A = i === 0 ? polygon[polygon.length - 1] : polygon[i - 1];
    const B = polygon[i];
    newPoly.push(B);

    // check for insection of all other lines
    for (let j = 0; j < polygon.length; j++) {
      // don't check for intersection of same line or line just before or after
      const indexBefore = i === 0 ? polygon.length - 1 : i - 1;
      const indexAfter = i === polygon.length - 1 ? 0 : i + 1;
      if (j === i || j === indexBefore || j === indexAfter) continue;

      const C = j === 0 ? polygon[polygon.length - 1] : polygon[j - 1];
      const D = polygon[j];
      const intersectPoint = lineIntersectPoint(A, B, C, D);

      //-5 if interect continue clockwise around the shape
      if (intersectPoint) {
        newPoly.pop();
        newPoly.push(intersectPoint);
        const dir = directionOfPoint(A, B, D);

        if (dir === 1) {
          // if direction is left - set index to new point
          newPoly.push(D);
          i = j;
        } else if (dir === -1) {
          // if direction is right - reverse polygon and set index to new point
          newPoly.push(C);
          reversePoly();
          i = polygon.length - j + 1;
        } else {
          throw Error('Issue untwisting polygon');
        }

        // if (newPoly.length > 5) return { dir, newPoly, polygon, i };
        break;
      }
    }
  }
  return newPoly;
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

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
export function lineIntersectPoint(pointA, pointB, pointF, pointG) {
  let [x1, y1] = pointA;
  let [x2, y2] = pointB;
  let [x3, y3] = pointF;
  let [x4, y4] = pointG;
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return [x, y];
}
