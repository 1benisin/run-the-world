import * as polyHelper from '../helpers/polyHelper';
import * as testData from '../fake-data/fake-data';

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

describe('f() merge', () => {
  test('basic cross shape', () => {
    expect(
      polyHelper.merge(testData.cross.vertical, testData.cross.horizontal)
    ).toEqual(testData.cross.merged);
  });

  test('donut shape', () => {
    expect(polyHelper.merge(testData.donut.bottom, testData.donut.top)).toEqual(
      testData.donut.merged
    );
  });

  test('snake & spike shape', () => {
    expect(
      polyHelper.merge(testData.snake.snake, testData.snake.spike)
    ).toEqual();
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
