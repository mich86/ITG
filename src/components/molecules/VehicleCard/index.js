import React, { memo } from 'react';
import PropTypes from 'prop-types';
import VehicleImage from '../../atoms/VehicleImage';
import Button from '../../atoms/Button';
import './style.scss';

function VehicleCard({ vehicle, onReadMore }) {
  const headingId = `vehicle-name-${vehicle.id}`;

  return (
    <article className="vehicle-card" aria-labelledby={headingId}>
      <VehicleImage
        media={vehicle.media}
        alt={`Jaguar ${vehicle.id.toUpperCase()}`}
        className="vehicle-card__image"
      />
      <div className="vehicle-card__content">
        <h2 id={headingId} className="vehicle-card__name">{vehicle.id.toUpperCase()}</h2>
        <p className="vehicle-card__price">{`From ${vehicle.price}`}</p>
        <p className="vehicle-card__description">{vehicle.description}</p>
        <Button
          className="vehicle-card__read-more"
          onClick={() => onReadMore(vehicle)}
          aria-haspopup="dialog"
        >
          Read more
        </Button>
      </div>
    </article>
  );
}

VehicleCard.propTypes = {
  vehicle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    media: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onReadMore: PropTypes.func.isRequired,
};

export default memo(VehicleCard);
