import { config } from "../../core/config/env.js";

import axios from "axios";
import polyline from "@mapbox/polyline";
import axiosRetry from "axios-retry";

const MAPBOX_ACCESS_TOKEN = config.mapbox.apiKey;

const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

// export async function getRoute(origin, destination) {
//   try {
//     // console.log("origin", origin);
//     //   console.log("destination", destination);

//       if (!Array.isArray(origin) || !Array.isArray(destination)) {
//           console.log("not array")
//         throw new Error("Origin and destination must be arrays");
//       }
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?geometries=polyline&access_token=${MAPBOX_ACCESS_TOKEN}`;
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching route: ${error.message}`);
//     throw error;
//   }
// }

// export function decodePolyline(polylineStr) {
//   return polyline.decode(polylineStr);
// }

// export async function getPlacesNearby(location) {
//   try {
//     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json?proximity=${location}&access_token=${MAPBOX_ACCESS_TOKEN}`;
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching places: ${error.message}`);
//     throw error;
//   }
// }

// export async function getPlacesAlongRoute(origin, destination) {
//   const route = await getRoute(origin, destination);
//   // console.log(origin, destination)
//   const polylineStr = route.routes[0].geometry;
//   const coordinates = decodePolyline(polylineStr);
//   // console.log(coordinates)

//   let placesList = [];

//   for (let i = 0; i < coordinates.length; i += 1) {
//     // Limit the number of requests
//     const coord = coordinates[i];
//     const places = await getPlacesNearby([coord[1], coord[0]]);
//     places.features.forEach((place) => {
//       placesList.push(place.place_name);
//     });
//   }

//   return placesList;
// }

// export async function getCoordinates(address) {
//   const nigriaBox = "2.691702, 4.240594, 14.577275, 13.865924";
//   const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//     address
//   )}.json?bbox=${nigriaBox}&access_token=${MAPBOX_ACCESS_TOKEN}`;
//   const response = await axiosInstance.get(url);
//   if (
//     response.data &&
//     response.data.features &&
//     response.data.features.length > 0
//   ) {
//     const [longitude, latitude] = response.data.features[0].center;
//     return [longitude, latitude];
//   } else {
//     throw new Error("Address not found");
//   }
// }

// import axios from "axios";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions.js";
import { ApiRequestError } from "../../core/errors/apiRequestError.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
// import polyline from "polyline";

const mapboxToken = config.mapbox.apiKey;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
const directionsClient = mbxDirections({ accessToken: mapboxToken });

export const getCoordinates = async (address) => {
  try {
      const response = await geocodingClient
      .forwardGeocode({
        query: address,
        limit: 1,
      })
      .send();

    if (response.body.features.length === 0) {
      throw new ApiRequestError(
        `No results found for address: ${address}`,
        HttpStatus.NOT_FOUND
      );
    }

    const match = response.body.features[0];
    // console.log(match.geometry.coordinates);
    return match.geometry.coordinates;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      console.error(`ApiRequestError: ${error.message}`);
    } else {
      console.error(`Error fetching coordinates for ${address}:`, error);
      throw new ApiRequestError(
        `Failed to fetch coordinates for ${address}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    throw error;
  }
};

// const getAddress = async (coordinates) => {
//   try {
//     const response = await geocodingClient
//       .reverseGeocode({
//         query: coordinates,
//         limit: 1,
//       })
//       .send();

//     if (response.body.features.length === 0) {
//       throw new Error(`No results found for coordinates: ${coordinates}`);
//     }

//     const match = response.body.features[0];
//     return match;
//   } catch (error) {
//     console.error(
//       `Error fetching address for coordinates ${coordinates}:`,
//       error
//     );
//     throw new Error(`Failed to fetch address for coordinates ${coordinates}`);
//   }
// };

const getAddressFromBusstop = async (busStops) => {
  try {
    const addressPromises = busStops.map(async (stop) => {
      const address = await getLocation(stop.location);
      return { ...stop, address };
    });

    const busStopsWithAddresses = await Promise.all(addressPromises);
    return busStopsWithAddresses;
  } catch (error) {
    console.error("Error converting bus stop coordinates to addresses:", error);
    throw new Error("Failed to convert bus stop coordinates to addresses");
  }
};

const getLocation = async (coordinates) => {
    try {
        const [long, lat ] = coordinates;
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${long}&latitude=${lat}&types=address&access_token=${MAPBOX_ACCESS_TOKEN}`;

        const response = await fetch(url);

        const data = await response.json();


    // if (response.body.features.length === 0) {
    //   throw new Error(`No results found for coordinates: ${coordinates}`);
        // }

    console.log(data);

    const match = data;
    return match;
  } catch (error) {
    console.error(
      `Error fetching address for coordinates ${coordinates}:`,
      error
    );
    throw new Error(`Failed to fetch address for coordinates ${coordinates}`);
  }
};



export const getDirections = async (start, end) => {
  try {
    const [startCoordinates, endCoordinates] = await Promise.all([
      getCoordinates(start),
      getCoordinates(end),
    ]);

    const response = await directionsClient
      .getDirections({
        profile: "driving",
        waypoints: [
          { coordinates: startCoordinates },
          { coordinates: endCoordinates },
        ],
        // geometries: "polyline",
        steps: true,
      })
      .send();

      const routes = response.body.routes;
    //   const coordinates = polyline.decode(routes);

    const busStops = routes[0].legs.flatMap((leg) =>
      leg.steps.map( (step) => ({
          location: step.maneuver.location,
        //   maneuver: step.maneuver,
        instruction: step.maneuver.instruction,
      }))
    );

      const lots = []
      for (let i = 0; i < busStops.length; i++) {
          const address = getLocation(busStops[i].location);
          lots.push(address);
      }

    // const addresses = await getAddressFromBusstop(busStops);

    //   const places = []
    //     for (let i = 0; i < coordinates.length; i++) {
    //         const address = await getAddress(coordinates[i]);
    //         places.push(address);
    //     }

      return lots;
  } catch (error) {
    console.error("Error fetching directions:", error);
    throw new ApiRequestError("Failed to fetch directions", 500);
  }
};

// export {  getDirections };

// // class MapboxService {
// //   constructor(accessToken) {
// //     this.geocodingClient = mbxGeocoding({ accessToken });
// //     this.directionsClient = mbxDirections({ accessToken });
// //   }

// //   async geocodeAddress(address) {
// //     try {
// //       const response = await this.geocodingClient
// //         .forwardGeocode({
// //           query: address,
// //           limit: 1,
// //         })
// //         .send();

// //       if (
// //         !response ||
// //         !response.body ||
// //         !response.body.features ||
// //         response.body.features.length === 0
// //       ) {
// //         throw new ApiRequestError("No geocode results found", 404);
// //       }

// //       return response.body.features[0].center;
// //     } catch (error) {
// //       if (error instanceof ApiRequestError) {
// //         throw error;
// //       }
// //       throw new ApiRequestError("Error during geocoding request", 502);
// //     }
// //   }

// //   async getDirections(start, end) {
// //     try {
// //       const response = await this.directionsClient
// //         .getDirections({
// //           profile: "driving",
// //           waypoints: [{ coordinates: start }, { coordinates: end }],
// //         })
// //         .send();

// //       if (
// //         !response ||
// //         !response.body ||
// //         !response.body.routes ||
// //         response.body.routes.length === 0
// //       ) {
// //         throw new ApiRequestError("No routes found", 404);
// //       }

// //       return response.body.routes;
// //     } catch (error) {
// //       if (error instanceof ApiRequestError) {
// //         throw error;
// //       }
// //       throw new ApiRequestError("Error during directions request", 502);
// //     }
// //   }

// //   async getRoutesAndBusStops(startAddress, endAddress) {
// //     try {
// //       const start = await this.geocodeAddress(startAddress);
// //       const end = await this.geocodeAddress(endAddress);
// //       const routes = await this.getDirections(start, end);

// //       const busStops = routes[0].legs[0].steps.map(
// //         (step) => step.maneuver.location
// //       );

// //       return { routes, busStops };
// //     } catch (error) {
// //       throw error;
// //     }
// //   }
// // }

// // export const mapboxService = new MapboxService(mapboxToken);
