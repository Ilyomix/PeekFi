import { Button } from '@mantine/core';
import PageTransition from 'components/PageTransition';

const Screener: React.FC = () => {
  return (
    <PageTransition>
      <Button>Button with custom default gradient</Button>
    </PageTransition>
  );
};

export default Screener;
