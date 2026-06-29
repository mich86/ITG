import React, { useState, useCallback } from 'react';
import useData from './useData';
import VehicleCard from '../../molecules/VehicleCard';
import VehicleCardSkeleton from '../../molecules/VehicleCardSkeleton';
import Modal from '../Modal';
import './style.scss';

const SKELETON_COUNT = 4;

export default function VehicleList() {
  const [loading, error, vehicles] = useData();
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleReadMore = useCallback((vehicle) => setSelectedVehicle(vehicle), []);
  const handleModalClose = useCallback(() => setSelectedVehicle(null), []);

  if (loading) {
    return (
      <ul className="vehicle-list" role="status" aria-label="Loading vehicles" data-testid="loading">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </ul>
    );
  }

  if (error) {
    return <div role="alert" data-testid="error">{ error }</div>;
  }

  return (
    <>
      <h1 className="visually-hidden">Jaguar Vehicles</h1>
      <ul className="vehicle-list" aria-label="Available vehicles" data-testid="results">
        {Array.isArray(vehicles) && vehicles.map((vehicle, index) => (
          <li
            key={vehicle.id}
            className="vehicle-list__item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <VehicleCard
              vehicle={vehicle}
              onReadMore={handleReadMore}
            />
          </li>
        ))}
      </ul>
      {selectedVehicle && (
        <Modal
          vehicle={selectedVehicle}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
