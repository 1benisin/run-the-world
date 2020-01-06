import * as polyHelper from '../helpers/polyHelper';
import * as testData from '../fake-data/fake-data';

describe('f() difference', () => {
  test('basic cross shape', () => {
    expect(
      polyHelper.difference(testData.cross.vertical, testData.cross.horizontal)
    ).toEqual(testData.cross.difference);
  });

  test('snake & spike', () => {
    expect(
      polyHelper.difference(testData.snake.snake, testData.snake.spike)
    ).toEqual(testData.snake.difference);
  });

  test('island surrounded', () => {
    expect(
      polyHelper.difference(testData.island.inner, testData.island.outer)
    ).toEqual([]);
  });

  test('cut island out of shape', () => {
    expect(
      polyHelper.difference(testData.island.outer, testData.island.inner)
    ).toEqual([testData.island.outer]);
  });

  test('donut shape', () => {
    expect(
      polyHelper.difference(testData.donut.top, testData.donut.bottom)
    ).toEqual(testData.donut.difference);
  });
});

describe('f() sanitizeInversion', () => {
  test('reverses an inverted polygon', () => {
    expect(polyHelper.sanitizeInversion(testData.inverted.inverted)).toEqual(
      testData.inverted.notInverted
    );
  });

  test('does nothing to a non-inverted polygon', () => {
    expect(polyHelper.sanitizeInversion(testData.inverted.notInverted)).toEqual(
      testData.inverted.notInverted
    );
  });

  test('fixes basic inverted square', () => {
    const inverted = [
      [1, 0],
      [0, 0],
      [0, 1],
      [1, 1]
    ];
    expect(polyHelper.sanitizeInversion(inverted)).toEqual([
      [1, 1],
      [0, 1],
      [0, 0],
      [1, 0]
    ]);
  });
});

describe('f() mergeTwistedPolygon', () => {
  test('multi crossing shape', () => {
    expect(
      polyHelper.mergeTwistedPolygon(testData.selfCrossing.multiCrossing)
    ).toEqual(testData.selfCrossing.multiCrossingMerge);
  });

  test.only('untwistPolygon', () => {
    expect(polyHelper.untwistPolygon3(testData.selfCrossing.figure8)).toEqual([
      [47.62547077805564, -122.35890716314317],
      [47.62451244150106, -122.35641773790121],
      [47.62358052652604, -122.35388807952404],
      [47.622408308237894, -122.35200570547505],
      [47.623046543509034, -122.35060773789881],
      [47.62461842205012, -122.34732739627363],
      [47.62493839613551, -122.3457458987832],
      [47.622514362878974, -122.3455883190036],
      [47.61998400149665, -122.34542939811946],
      [47.61841198360306, -122.3455883190036],
      [47.622408308237894, -122.35200570547505],
      [47.62198195084879, -122.35293958336115],
      [47.62041021901962, -122.35594365745784],
      [47.6190239823868, -122.35906608402729],
      [47.621262417655934, -122.35890716314317],
      [47.623792717162736, -122.35922399908304],
      [47.62493839613551, -122.35922399908304]
    ]);
  });
});

describe('f() directionOfPoint', () => {
  test('point is to the left', () => {
    expect(polyHelper.directionOfPoint([1, 1], [3, 3], [4, 5])).toEqual(-1);
  });
  test('point is to the right', () => {
    expect(polyHelper.directionOfPoint([1, 1], [3, 3], [2, 1])).toEqual(1);
  });
  test('point is to the left', () => {
    expect(polyHelper.directionOfPoint([1, 1], [3, 3], [4, 4])).toEqual(0);
  });
});

describe('f() lineIntersectPoint', () => {
  test('returns intersect point', () => {
    const pointA = [47.63021248898915, -122.35562715679409];
    const pointB = [47.625044601790215, -122.3520303145051];
    const pointC = [47.62957418507829, -122.34965924173594];
    const pointD = [47.626936382105306, -122.35732700675727];
    expect(
      polyHelper.lineIntersectPoint(pointA, pointB, pointC, pointD)
    ).toEqual([47.62804106009122, -122.35411584530702]);
  });

  test('returns shared point ', () => {
    const pointA = [47.63021248898915, -122.35562715679409];
    const pointB = [47.62957418507829, -122.34965924173594];
    const pointC = [47.62957418507829, -122.34965924173594];
    const pointD = [47.626936382105306, -122.35732700675727];
    expect(
      polyHelper.lineIntersectPoint(pointA, pointB, pointC, pointD)
    ).toEqual([47.62957418507829, -122.34965924173594]);
  });

  test('returns false if lines do not intersect intersect', () => {
    const pointA = [47.63021248898915, -122.35562715679409];
    const pointB = [47.62957418607829, -122.34965924183594];
    const pointC = [47.62957418507829, -122.34965924173594];
    const pointD = [47.626936382105306, -122.35732700675727];
    expect(
      polyHelper.lineIntersectPoint(pointA, pointB, pointC, pointD)
    ).toEqual(false);
  });
});

describe('f() merge', () => {
  test('basic cross shape', () => {
    expect(
      polyHelper.merge(testData.cross.vertical, testData.cross.horizontal)
    ).toEqual(testData.cross.merged);
  });

  test('figure 8', () => {
    expect(
      polyHelper.merge(
        testData.selfCrossing.figure8,
        testData.selfCrossing.figure8
      )
    ).toEqual(testData.selfCrossing.merge);
  });

  test('donut shape', () => {
    expect(polyHelper.merge(testData.donut.bottom, testData.donut.top)).toEqual(
      testData.donut.merged
    );
  });

  test('snake & spike shape', () => {
    expect(
      polyHelper.merge(testData.snake.snake, testData.snake.spike)
    ).toEqual(testData.snake.merged);
  });

  test('internal island shape', () => {
    expect(
      polyHelper.merge(testData.island.outer, testData.island.inner)
    ).toEqual(testData.island.merge);
  });

  test('with inverted shape', () => {
    expect(
      polyHelper.merge(testData.donut.top, testData.inverted.inverted)
    ).toEqual([
      [47.630634424342716, -122.34486428000214],
      [47.63042623432632, -122.34262347221373],
      [47.624192464808324, -122.34246589243413],
      [47.625044601790215, -122.35123939812182],
      [47.63049553022523, -122.35270114283274],
      [47.63042623432632, -122.35811792314054],
      [47.62653688140613, -122.35780142247677],
      [47.62704258370051, -122.36092384904624],
      [47.632636165262085, -122.36139826476573],
      [47.632636165262085, -122.34511423856019]
    ]);
  });
});

// test('difference funciton is working', () => {
//   const poly1 = [
//     [47.615987421710436, -122.35187273472549],
//     [47.619877785560334, -122.35499516129494],
//     [47.62008999122647, -122.34373055398466],
//     [47.61670725350713, -122.34495531767607]
//   ];
//   const poly2 = [
//     [47.62294055977313, -122.35076531767845],
//     [47.62853458032193, -122.34092462807892],
//     [47.62083620708049, -122.33744647353888],
//     [47.61841198360306, -122.3413584753871]
//   ];
//   const poly3 = [
//     [
//       [47.62083620708049, -122.33744647353888],
//       [47.61841198360306, -122.3413584753871],
//       [47.61963350025978, -122.34389583240937],
//       [47.62008999122647, -122.34373055398466],
//       [47.62006980455917, -122.3448021317806],
//       [47.62294055977313, -122.35076531767845],
//       [47.62853458032193, -122.34092462807892]
//     ]
//   ];
//   expect(polyHelper.difference(poly2, poly1)).toBe(poly3);
// });
