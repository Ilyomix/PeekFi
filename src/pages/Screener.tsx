import React from 'react';
import FinancialMap from 'components/Pages/Screener/FinancialMap';
import PageTransition from 'components/App/PageTransition';

/**
 * Screener Component
 *
 * This component serves as a wrapper for the FinancialMap component,
 * providing a page transition effect.
 *
 * @returns {JSX.Element} The rendered Screener component.
 */
const Screener: React.FC = React.memo(() => {
  return (
    <PageTransition duration={0.05}>
      <FinancialMap />
    </PageTransition>
  );
});

Screener.displayName = 'Screener';

export default Screener;
