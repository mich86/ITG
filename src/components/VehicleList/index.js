import React, { useState } from 'react';
import useData from './useData';
import Modal from '../Modal';
import VehicleCardSkeleton from '../VehicleCardSkeleton';
import './style.scss';

const SKELETON_COUNT = 4;

export default function VehicleList() {
  const [loading, error, vehicles] = useData();
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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
        {Array.isArray(vehicles) && vehicles.map((vehicle, index) => {
          const image16x9 = vehicle.media.find((m) => m.url.includes('/16x9/'));
          const image1x1 = vehicle.media.find((m) => m.url.includes('/1x1/'));
          const headingId = `vehicle-name-${vehicle.id}`;

          return (
            <li
              key={vehicle.id}
              className="vehicle-list__item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <article className="vehicle-card" aria-labelledby={headingId}>
                <picture className="vehicle-card__image">
                  <source media="(min-width: 768px)" srcSet={image16x9 && image16x9.url} />
                  <img src={image1x1 && image1x1.url} alt={`Jaguar ${vehicle.id.toUpperCase()}`} />
                </picture>
                <div className="vehicle-card__content">
                  <h2 id={headingId} className="vehicle-card__name">{vehicle.id.toUpperCase()}</h2>
                  <p className="vehicle-card__price">{`From ${vehicle.price}`}</p>
                  <p className="vehicle-card__description">{vehicle.description}</p>
                  <button
                    type="button"
                    className="vehicle-card__read-more"
                    onClick={() => setSelectedVehicle(vehicle)}
                    aria-haspopup="dialog"
                  >
                    Read more
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      {selectedVehicle && (
        <Modal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </>
  );
}
