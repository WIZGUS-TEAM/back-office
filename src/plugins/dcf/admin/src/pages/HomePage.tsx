import { Main, Box, Typography, Flex } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { HandHeart } from '@strapi/icons';

import { getTranslation } from '../utils/getTranslation';

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main>
      <Box padding={8} background="neutral100">
        <Flex direction="column" alignItems="center" gap={4}>
          <HandHeart width="100px" height="100px" />
          <Typography variant="alpha" textAlign="center">
            Bienvenue sur votre espace d'administration
          </Typography>
          <Typography variant="epsilon" textColor="neutral600" textAlign="center">
            Gérez vos dons et vos causes caritatives en toute simplicité
          </Typography>
        </Flex>
      </Box>
    </Main>
  );
};

export { HomePage };
