import { request } from './helpers';

/**
 * Pull vehicles information
 *
 * Fetches the vehicle list, then fetches each vehicle's detail endpoint in
 * parallel. Vehicles with a broken apiUrl or without a price are excluded.
 *
 * @return {Promise<Array.<vehicleSummaryPayload>>}
 */
export default async function getData() {
  const vehicles = await request('/api/vehicles.json');

  const results = await Promise.all(
    vehicles.map(async (vehicle) => {
      try {
        const details = await request(vehicle.apiUrl);
        return { ...vehicle, ...details };
      } catch {
        return null;
      }
    }),
  );

  return results.filter((vehicle) => vehicle && vehicle.price);
}
