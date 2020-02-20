import * as martinez from 'martinez-polygon-clipping';
const PolyBool = require('polybooljs');
const classifyPoint = require('robust-point-in-polygon');

// polys must start and end with the same point
export const martinezUnion = (poly1, poly2) => {
  const p1 = [...poly1];
  const p2 = [...poly2];
  // TODO check if first and last point the same
  return martinez.union([poly1], [poly2]);
};

// [...{latitude: x, longitude:y}]  -->  [...[x,y]]
export const coordsToPoints = coords => {
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

export const center = points => {
  let minX, maxX, minY, maxY;
  for (let i = 0; i < points.length; i++) {
    minX = points[i][0] < minX || minX == null ? points[i][0] : minX;
    maxX = points[i][0] > maxX || maxX == null ? points[i][0] : maxX;
    minY = points[i][1] < minY || minY == null ? points[i][1] : minY;
    maxY = points[i][1] > maxY || maxY == null ? points[i][1] : maxY;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
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

export const flattenPolygon = p => {
  //-1 put a new intersection point on every line that intersects
  const polygon = [...p];

  // once a line segment is checked and has no intersections we can check from there forward
  let furthestClearedIndex = 0;

  // for each line
  for (let i = 0; i < polygon.length; i++) {
    furthestClearedIndex = i;
    const nextI = i === polygon.length - 1 ? 0 : i + 1;
    const A = polygon[i];
    const B = polygon[nextI];

    // check for insection of all other lines
    for (let j = i; j < polygon.length; j++) {
      const nextJ = j === polygon.length - 1 ? 0 : j + 1;
      const C = polygon[j];
      const D = polygon[nextJ];

      // if A, B, C, or D share any points - skip
      const hasAllUniquePoints = pointArray => {
        const allPoints = pointArray.map(p => `${p[0]}${p[1]}`);
        const uniquePoints = new Set(allPoints);
        return uniquePoints.size === allPoints.length ? true : false;
      };
      if (!hasAllUniquePoints([A, B, C, D])) continue;

      // check for intersection
      const intersectPoint = lineIntersectPoint(A, B, C, D);
      if (intersectPoint) {
        // insert intersect point into both lines of polygon
        // if nextJ index is 0 inset point at end of polygon not at front
        if (nextJ === 0) {
          polygon.push(intersectPoint);
        } else {
          polygon.splice(nextJ, 0, intersectPoint);
        }
        polygon.splice(nextI, 0, intersectPoint);
        // start at beginning again by resetting i index
        i = furthestClearedIndex - 1;

        break;
      }
    }
  }

  return polygon;
};

export const pointsAreSame = (A, B) => {
  return A[0] === B[0] && A[1] === B[1];
};

export const untwistPolygon = p => {
  // sanity check - first and last points of polygon can not be the same point
  // we are working with open ended polygons
  if (p[0][0] === p[p.length - 1][0] && p[0][1] === p[p.length - 1][1])
    p[0][0] += 0.00001;

  // adds points at every intersection
  let polygon = flattenPolygon(p);

  // *-1-* find northern point
  let northernLat = polygon[0][0];
  let northernIndex = 0;
  for (let i = 1; i < polygon.length; i++) {
    const lat = polygon[i][0];
    if (lat > northernLat) {
      northernLat = lat;
      northernIndex = i;
    }
  }

  // *-2-* make northern point the start of the polygon
  polygon = [
    ...polygon.slice(northernIndex, polygon.length),
    ...polygon.slice(0, northernIndex)
  ];

  // *-3-* store a reversed copy of polygon for easy switching
  let reversedPolygon = [...polygon];
  const firstElement = reversedPolygon.shift();
  reversedPolygon.reverse();
  reversedPolygon.unshift(firstElement);
  const reversePoly = () => {
    const temp = polygon;
    polygon = reversedPolygon;
    reversedPolygon = temp;
  };

  // *-4-* reverse polygon if not moving clockwise
  const prevCoord = polygon[polygon.length - 1];
  const nextCoord = polygon[1];
  const northernCoord = polygon[0];

  // if next coordinate is west and previous coordinate is east - reverse
  if (prevCoord[1] >= northernCoord[1] && nextCoord[1] <= northernCoord[1]) {
    reversePoly();
  } else {
    // coords are on the same side (both east or both west of northern coord) - or prev,next,& northern coords all have the same longitude
    const angleFromNorthernLng = coord => {
      const minusVector = (a, b) => {
        return [Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])];
      };
      const vect = minusVector(northernCoord, coord);
      // atan(opposite / adjacent)
      return Math.atan(vect[1] / vect[0]);
    };

    // if both are to the east
    if (prevCoord[1] >= northernCoord[1] && nextCoord[1] >= northernCoord[1]) {
      // and nextCoord has a smaller angle to the northCood longitude
      if (angleFromNorthernLng(prevCoord) > angleFromNorthernLng(nextCoord)) {
        reversePoly();
      }
    }
    // if both are to the west
    if (prevCoord[1] <= northernCoord[1] && nextCoord[1] <= northernCoord[1]) {
      // and nextCoord has a greater angle to the northCood longitude
      if (angleFromNorthernLng(prevCoord) < angleFromNorthernLng(nextCoord)) {
        reversePoly();
      }
    }
  }

  // *-5-* move point to point looking for matching points - these signify intersections
  let newPoly = [];
  for (let i = 0; i < polygon.length; i++) {
    const A = polygon[i];
    newPoly.push(A);

    // check if point appears anywhere else in polygon
    for (let j = 0; j < polygon.length; j++) {
      // skip if same point
      if (j === i) continue;

      const B = polygon[j];

      // *-6-* if you find an overlapping point
      if (A[0] === B[0] && A[1] === B[1]) {
        const beforeA = i === 0 ? polygon[polygon.length - 1] : polygon[i - 1];
        const afterB = j === polygon.length - 1 ? polygon[0] : polygon[j + 1];
        // find which point is in the left direction
        const dir = directionOfPoint(beforeA, A, afterB);

        if (dir === 1) {
          // if direction is left - set index to new point
          i = j;
        } else if (dir === -1) {
          // if direction is right - reverse polygon and set index to new point
          reversePoly();
          i = polygon.length - j;
        } else {
          i = j;
          throw Error('Issue untwisting polygon');
        }
        break;
      }
    }
  }

  //  *-5-* seperate any point that are the same
  const pointSet = new Set();

  // loop over points to find matches
  newPoly = newPoly.map((point, i) => {
    const pString = point.toString();
    if (!pointSet.has(pString)) {
      pointSet.add(pString);
      return point;
    }

    const vector2DDirection = (a, b) => {
      const x = b[0] - a[0];
      const y = b[1] - a[1];
      const mag = Math.sqrt(x * x + y * y);
      return mag > 0 ? [x / mag, y / mag] : [x, y];
    };

    // found matching point
    const prevPoint = newPoly[i - 1];

    // get a normalized unit vector in the direction of the last point
    let dir = vector2DDirection(point, prevPoint);
    const moveAmount = 0.00001;
    dir = [dir[0] * moveAmount, dir[1] * moveAmount];
    // adjust the point in that direction slightly
    const adjustedPoint = [point[0] + dir[0], point[1] + dir[1]];
    // add the adjusted point to the comparison set and return it
    pointSet.add(adjustedPoint.toString());
    return adjustedPoint;
  });

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

export const combine2Polygons = (poly1, poly2) => {
  // make sure polygons are wound clockwise
  // then add points to every intersection
  let [P1, P2] = flatten2Polygons(
    sanitizeInversion(poly1),
    sanitizeInversion(poly2)
  );
  const newPoly = [];

  // *-1-* find northern point
  let northernLat = P1[0][0];
  let northernIndex = 0;
  let northernPoly = P1;
  let nonNorthernPoly = P2;
  for (let i = 1; i < P1.length; i++) {
    const lat = P1[i][0];
    if (lat > northernLat) {
      northernLat = lat;
      northernIndex = i;
    }
  }
  for (let i = 0; i < P2.length; i++) {
    const lat = P2[i][0];
    if (lat > northernLat) {
      northernLat = lat;
      northernIndex = i;
      northernPoly = P2;
      nonNorthernPoly = P1;
    }
  }

  // *-2-* make northern point the start of the polygon
  northernPoly = [
    ...northernPoly.slice(northernIndex, northernPoly.length),
    ...northernPoly.slice(0, northernIndex)
  ];

  // *-2-* trace the outside points of both polys to make newPoly
  let currentIndex = 1;
  let currentPoly = [...northernPoly];
  let currentPoint = northernPoly[0];
  let otherPoly = [...nonNorthernPoly];
  let nextPoint = northernPoly[1];
  const _swapPolys = () => {
    let temp = currentPoly;
    currentPoly = otherPoly;
    otherPoly = temp;
  };

  const log = [];

  newPoly.push(currentPoint);

  while (!pointsAreSame(nextPoint, northernPoly[0])) {
    newPoly.push(nextPoint);
    const prevPoint = currentPoint;
    currentPoint = nextPoint;
    // look for a matching point in the other poly

    let pointFound = false;

    for (let i = 0; i < otherPoly.length; i++) {
      const point = otherPoly[i];
      // if you find a matching point
      if (pointsAreSame(currentPoint, point)) {
        // find point to the left and set it to nextPoint
        const pointX =
          currentIndex === currentPoly.length - 1
            ? currentPoly[0]
            : currentPoly[currentIndex + 1];

        const pointY =
          i === 0 ? otherPoly[otherPoly.length - 1] : otherPoly[i - 1];
        const pointZ =
          i === otherPoly.length - 1 ? otherPoly[0] : otherPoly[i + 1];

        const dirX = directionOfPoint(prevPoint, currentPoint, pointX);
        const dirY = directionOfPoint(prevPoint, currentPoint, pointY);
        const dirZ = directionOfPoint(prevPoint, currentPoint, pointZ);

        const angleX = angle(prevPoint, currentPoint, pointX);
        const angleY = angle(prevPoint, currentPoint, pointY);
        const angleZ = angle(prevPoint, currentPoint, pointZ);
        // set nextPoint to Y or Z

        // find all points to the left and give me the one with the smallest angle
        let points = [
          { name: 'X', point: pointX, dir: dirX, angle: angleX },
          { name: 'Y', point: pointY, dir: dirY, angle: angleY },
          { name: 'Z', point: pointZ, dir: dirZ, angle: angleZ }
        ];

        const pointsToTheLeft = points.filter(p => p.dir);

        if (pointsToTheLeft === 1) {
          // 1 points to the left
          if (pointsToTheLeft[0].name === 'X') {
            break;
          } else {
            handleNewPoint(pointsToTheLeft[0]);
          }
        } else if (pointsToTheLeft) {
          // multiple points to the left
        } else {
          // no points to the left
        }

        const smallestAngleOnLeft = points.reduce((acc, point) => {
          if (point.dir) {
            return acc.angle;
          }
          return acc;
        }, []);
        // else give me the points with the largest angle

        // if more than one point (X and Y/Z are on the same line) check the next points along the path

        // if all point
        // if Y is positive and Z is 0/negative
        // if Z is positive and Y is 0/negative
        // if one is at 0 and other is negative
        // if both are negative
        // if both are positive

        nextPoint = dirY > 0 ? pointY : dirZ > 0 ? pointZ : 0;
        // swap polys
        // set current index to i
        log.push({ pointY, pointZ, dirY, dirZ });
      }
    }

    if (!pointFound) {
      currentIndex =
        currentIndex === currentPoly.length - 1 ? 0 : currentIndex + 1;
      nextPoint = currentPoly[currentIndex];
    }
  }

  return [...log, newPoly];
};

const angle = (point1, anglePoint, point2) => {
  const p1 = { x: point1[1], y: point1[0] };
  const p2 = { x: anglePoint[1], y: anglePoint[0] };
  const p3 = { x: point2[1], y: point2[0] };

  const p12 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  const p13 = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
  const p23 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));

  //angle in degrees
  return (resultDegree =
    (Math.acos(
      (Math.pow(p12, 2) + Math.pow(p23, 2) - Math.pow(p13, 2)) / (2 * p12 * p23)
    ) *
      180) /
    Math.PI);
};

export const flatten2Polygons = (poly1, poly2) => {
  let P1 = [...poly1];
  let P2 = [...poly2];
  let furthestClearIndex = 0;

  // for every line in P1
  for (let i = furthestClearIndex; i < P1.length; i++) {
    const nextI = i === P1.length - 1 ? 0 : i + 1;
    const A = P1[i];
    let B = P1[nextI];

    // check every line in P2
    for (let j = 0; j < P2.length; j++) {
      const nextJ = j === P2.length - 1 ? 0 : j + 1;
      const C = P2[j];
      const D = P2[nextJ];

      // check for intersection
      const intersectPoint = lineIntersectPoint(A, B, C, D);

      // insert intersect point into both polys
      if (intersectPoint) {
        // check to see if the end of one line is along the path of the other
        if (
          !pointsAreSame(intersectPoint, A) &&
          !pointsAreSame(intersectPoint, B)
        ) {
          P1.splice(nextI, 0, intersectPoint);
          B = intersectPoint;
        }
        if (
          !pointsAreSame(intersectPoint, C) &&
          !pointsAreSame(intersectPoint, D)
        ) {
          P2.splice(nextJ, 0, intersectPoint);
        }
      }
    }
  }
  return [P1, P2];
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
// Return FALSE if any points are the same
// Return intersection point if end of one line lands on the path of the other
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
