import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export default function Button({
  children,
  onClick,
  className,
  'aria-label': ariaLabel,
  'aria-haspopup': ariaHasPopup,
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-haspopup={ariaHasPopup}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-haspopup': PropTypes.string,
};

Button.defaultProps = {
  className: undefined,
  'aria-label': undefined,
  'aria-haspopup': undefined,
};
