import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../../atoms/Button';
import './style.scss';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const vehicleShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  media: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string.isRequired })).isRequired,
  meta: PropTypes.shape({
    bodystyles: PropTypes.arrayOf(PropTypes.string),
    drivetrain: PropTypes.arrayOf(PropTypes.string),
    passengers: PropTypes.number,
    emissions: PropTypes.shape({
      template: PropTypes.string,
      value: PropTypes.number,
    }),
  }),
});

export default function Modal({ vehicle, onClose }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    const modal = modalRef.current;
    const focusable = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTORS));

    if (focusable.length) {
      focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose]);

  const {
    id, description, price, media, meta,
  } = vehicle;

  const image16x9 = media.find((m) => m.url.includes('/16x9/'));
  const emissions = meta && meta.emissions
    ? meta.emissions.template.replace('$value', meta.emissions.value)
    : null;
  const titleId = `modal-title-${id}`;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal"
        ref={modalRef}
      >
        <Button
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          Close &#x2715;
        </Button>

        {image16x9 && (
          <img
            src={image16x9.url}
            alt={`Jaguar ${id.toUpperCase()}`}
            className="modal__image"
            loading="lazy"
            width="470"
            height="246"
          />
        )}

        <div className="modal__content">
          <h2 id={titleId} className="modal__title">{id.toUpperCase()}</h2>
          {price && <p className="modal__price">{`From ${price}`}</p>}
          {description && <p className="modal__description">{description}</p>}

          {meta && (
            <dl className="modal__specs">
              {meta.bodystyles && meta.bodystyles.length > 0 && (
                <>
                  <dt className="modal__spec-term">Body style</dt>
                  <dd className="modal__spec-detail">{meta.bodystyles.join(', ')}</dd>
                </>
              )}
              {meta.drivetrain && meta.drivetrain.length > 0 && (
                <>
                  <dt className="modal__spec-term">Drivetrain</dt>
                  <dd className="modal__spec-detail">{meta.drivetrain.join(', ')}</dd>
                </>
              )}
              {meta.passengers && (
                <>
                  <dt className="modal__spec-term">Passengers</dt>
                  <dd className="modal__spec-detail">{meta.passengers}</dd>
                </>
              )}
              {emissions && (
                <>
                  <dt className="modal__spec-term">Emissions</dt>
                  <dd className="modal__spec-detail">{emissions}</dd>
                </>
              )}
            </dl>
          )}
        </div>
      </div>
    </>
  );
}

Modal.propTypes = {
  vehicle: vehicleShape.isRequired,
  onClose: PropTypes.func.isRequired,
};
