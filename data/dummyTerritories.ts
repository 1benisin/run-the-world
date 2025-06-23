import { TERRITORY_COLORS } from "../constants/map";
import { Territory } from "../types/map";

// San Francisco neighborhoods as dummy territories
export const dummyTerritories: Territory[] = [
  {
    id: "1",
    name: "Golden Gate Park",
    points: [
      { latitude: 37.7694, longitude: -122.4862 },
      { latitude: 37.7694, longitude: -122.4762 },
      { latitude: 37.7794, longitude: -122.4762 },
      { latitude: 37.7794, longitude: -122.4862 },
    ],
    color: TERRITORY_COLORS.primary,
    metadata: {
      population: 0,
      area: 1017, // acres
      description: "A large urban park in San Francisco, California.",
    },
  },
  {
    id: "2",
    name: "Financial District",
    points: [
      { latitude: 37.7894, longitude: -122.4062 },
      { latitude: 37.7894, longitude: -122.3962 },
      { latitude: 37.7994, longitude: -122.3962 },
      { latitude: 37.7994, longitude: -122.4062 },
    ],
    color: TERRITORY_COLORS.secondary,
    metadata: {
      population: 20000,
      area: 0.5, // square miles
      description: "The central business district of San Francisco.",
    },
  },
  {
    id: "3",
    name: "Fisherman's Wharf",
    points: [
      { latitude: 37.8094, longitude: -122.4162 },
      { latitude: 37.8094, longitude: -122.4062 },
      { latitude: 37.8194, longitude: -122.4062 },
      { latitude: 37.8194, longitude: -122.4162 },
    ],
    color: TERRITORY_COLORS.primary,
    metadata: {
      population: 5000,
      area: 0.3, // square miles
      description:
        "A popular tourist attraction and neighborhood in San Francisco.",
    },
  },
  {
    id: "4",
    name: "Mission District",
    points: [
      { latitude: 37.7594, longitude: -122.4162 },
      { latitude: 37.7594, longitude: -122.4062 },
      { latitude: 37.7694, longitude: -122.4062 },
      { latitude: 37.7694, longitude: -122.4162 },
    ],
    color: TERRITORY_COLORS.secondary,
    metadata: {
      population: 50000,
      area: 1.5, // square miles
      description:
        "A vibrant neighborhood known for its Latino culture and street art.",
    },
  },
  {
    id: "5",
    name: "Haight-Ashbury",
    points: [
      { latitude: 37.7694, longitude: -122.4462 },
      { latitude: 37.7694, longitude: -122.4362 },
      { latitude: 37.7794, longitude: -122.4362 },
      { latitude: 37.7794, longitude: -122.4462 },
    ],
    color: TERRITORY_COLORS.primary,
    metadata: {
      population: 15000,
      area: 0.8, // square miles
      description:
        "A neighborhood famous for its role in the 1960s counterculture movement.",
    },
  },
];
