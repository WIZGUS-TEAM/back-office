import contentAPIRoutes from './content-api';
import association from './association';
import { donationContent, donateRoutes } from './donation';
import company from './company';
import { causeAdmin, causeContent, causeAdminWithdrawal } from './cause';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
  association,
  donationContent,
  donateRoutes,
  company,
  causeAdmin,
  causeContent,
  causeAdminWithdrawal,
};

export default routes;
