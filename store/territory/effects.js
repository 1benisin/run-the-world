const uuid = require('uuid');

import { database } from '../../services/firebase';
import Territory from './model';
import * as polygonService from '../../services/polygons';

export const fetchTerritories = async () => {
  try {
    const response = await (
      await database.ref('territories').once('value')
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
  const editedTerrs = {};
  nonUserTerritories.forEach(terr => {
    const alteredRegions = polygonService.difference(
      terr.coords,
      completedRun.coords
    );

    // if territory completely conquered
    if (alteredRegions.length === 0) {
      editedTerrs[terr.id] = null;

      // if territory partially conquered
    } else if (alteredRegions.length === 1) {
      editedTerrs[terr.id] = { ...terr, coords: alteredRegions[0] };

      // if territory cut into multiple parts
    } else {
      editedTerrs[terr.id] = null;
      alteredRegions.forEach(coords => {
        const newTer = { ...terr, coords };
        delete newTer.id;
        editedTerrs[Territory.uuid()] = newTer;
      });
    }
  });
  return editedTerrs;
};

export const editTerritories = async editedTerritories => {
  console.log('editedTerritories', editedTerritories);
  return await database.ref('territories').update(editedTerritories);
};
