import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export default function VehicleImage({ media, alt, className }) {
  const image16x9 = media.find((m) => m.url.includes('/16x9/'));
  const image1x1 = media.find((m) => m.url.includes('/1x1/'));

  return (
    <picture className={className}>
      <source media="(min-width: 768px)" srcSet={image16x9 && image16x9.url} />
      <img src={image1x1 && image1x1.url} alt={alt} loading="lazy" width="470" height="470" />
    </picture>
  );
}

VehicleImage.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

VehicleImage.defaultProps = {
  className: undefined,
};
