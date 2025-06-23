const uuid = require('uuid');

import { database } from '../../services/firebase';
import Territory from './model';
import * as polygonService from '../../services/polygons';
import * as utils from '../../services/utils';

export const fetchTerritoriesByCoords = async (coords = [47.75, -122.0]) => {
  regionId = utils.coordinateToRegionId(coords);
  try {
    const response = await (
      await database.ref('territories/' + regionId).once('value')
    ).val();
    if (!response) return [];

    const keys = Object.keys(response);
    return keys.map(key => {
      const ter = response[key];

      return new Territory().initWithID(key, ter);
    });
  } catch (error) {
    console.error(error);
    return Territory.FETCH_ERROR;
  }
};

export const getOverlappingTerritories = (completedRun, territories) => {
  const userTerritories = territories.filter(
    terr =>
      terr.userId === completedRun.userId &&
      polygonService.polysOverlap(completedRun.coords, terr.coords)
  );

  const nonUserTerritories = territories.filter(
    terr =>
      terr.userId !== completedRun.userId &&
      polygonService.polysOverlap(completedRun.coords, terr.coords)
  );

  return { userTerritories, nonUserTerritories };
};

export const checkRunInsideTerritory = (completedRun, territories) => {
  if (
    territories.length === 1 &&
    polygonService.poly1FullyContainsPoly2(
      territories[0].coords,
      completedRun.coords
    )
  ) {
    return Territory.FULLY_INSIDE_ANOTHER_ERROR;
  }
  return;
};

export const untwistRunPoints = runPoly => {
  return polygonService.untwistPolygon(runPoly);
};

export const uniteTerritories = (completedRun, territories) => {
  return territories.reduce((acc, ter) => {
    return polygonService.merge(ter.coords, acc);
  }, completedRun.coords);
};

export const subtractTerritories = (completedRun, nonUserTerritories) => {
  const newTerrs = [];
  nonUserTerritories.forEach(terr => {
    const alteredRegions = polygonService.difference(
      terr.coords,
      completedRun.coords
    );

    alteredRegions.forEach(coords => {
      const updateTerr = { ...terr, coords };
      const newTerr = new Territory().initWithID(Territory.uuid(), updateTerr);
      newTerrs.push(newTerr);
    });
  });

  return newTerrs;
};

export const updateDBTerritories = async editedTerritories => {
  return await database.ref('territories').update(editedTerritories);
};

export const convertTerritoriesToRegions = (
  territories = [],
  regions = {},
  deleteTerritories = false
) => {
  territories.forEach(terr => {
    // get starting lat lng
    let startLng = terr.center[1] - 0.25;
    let startLat = terr.center[0] - 0.25;

    // make region ids
    const regionIds = [];
    for (let i = 0; i < 3; i++) {
      startLat = terr.center[0] - 0.25;

      for (let k = 0; k < 3; k++) {
        regionIds.push(utils.coordinateToRegionId([startLat, startLng]));
        startLat += 0.25;
      }
      startLng += 0.25;
    }

    regionIds.forEach(id => {
      regions[id + '/' + terr.id] = deleteTerritories ? null : terr.withoutId();
    });
  });

  return regions;
};
