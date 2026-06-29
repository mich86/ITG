import React from 'react';
import useData from './useData';
import './style.scss';

export default function VehicleList() {
  const [loading, error, vehicles] = useData();

  if (loading) {
    return <div role="status" data-testid="loading">Loading</div>;
  }

  if (error) {
    return <div role="alert" data-testid="error">{ error }</div>;
  }

  return (
    <>
      <h1 className="visually-hidden">Jaguar Vehicles</h1>
      <ul className="vehicle-list" aria-label="Available vehicles" data-testid="results">
        {Array.isArray(vehicles) && vehicles.map((vehicle) => {
          const image16x9 = vehicle.media.find((m) => m.url.includes('/16x9/'));
          const image1x1 = vehicle.media.find((m) => m.url.includes('/1x1/'));
          const headingId = `vehicle-name-${vehicle.id}`;

          return (
            <li key={vehicle.id} className="vehicle-list__item">
              <article className="vehicle-card" aria-labelledby={headingId}>
                <picture className="vehicle-card__image">
                  <source media="(min-width: 768px)" srcSet={image16x9 && image16x9.url} />
                  <img src={image1x1 && image1x1.url} alt={`Jaguar ${vehicle.id.toUpperCase()}`} />
                </picture>
                <div className="vehicle-card__content">
                  <h2 id={headingId} className="vehicle-card__name">{vehicle.id.toUpperCase()}</h2>
                  <p className="vehicle-card__price">{`From ${vehicle.price}`}</p>
                  <p className="vehicle-card__description">{vehicle.description}</p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
