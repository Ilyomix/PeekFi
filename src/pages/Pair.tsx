import { Image } from '@mantine/core';
import PageTransition from 'components/PageTransition';

const Pair: React.FC = () => {
  return (
    <PageTransition>
      {' '}
      <Image
        radius="md"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      />{' '}
      <Image
        radius="md"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      />{' '}
      <Image
        radius="md"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      />{' '}
      <Image
        radius="md"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      />
    </PageTransition>
  );
};

export default Pair;
