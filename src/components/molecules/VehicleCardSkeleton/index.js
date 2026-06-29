import React from 'react';
import './style.scss';

export default function VehicleCardSkeleton() {
  return (
    <li className="vehicle-list__item" aria-hidden="true">
      <article className="vehicle-card-skeleton">
        <div className="vehicle-card-skeleton__image" />
        <div className="vehicle-card-skeleton__content">
          <div className="vehicle-card-skeleton__title" />
          <div className="vehicle-card-skeleton__line" />
          <div className="vehicle-card-skeleton__line vehicle-card-skeleton__line--short" />
          <div className="vehicle-card-skeleton__btn" />
        </div>
      </article>
    </li>
  );
}
