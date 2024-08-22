import FinancialMap from 'components/FinancialMap';
import PageTransition from 'components/PageTransition';

const Screener: React.FC = () => {
  return (
    <PageTransition>
      <FinancialMap />
    </PageTransition>
  );
};

export default Screener;
