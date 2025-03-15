/**
 *  router
 */

import { factories } from '@strapi/strapi';

const customRoutes = [
  {
    method: 'POST',
    path: '/donate',
    handler: 'donation.donate',
  },
];

export const donationContent = factories.createCoreRouter('plugin::dcf.donation', {
  type: 'admin',
  config: {
    find: {
      middlewares: ['plugin::dcf.filterDonationByAssociation'],
    },
  },
});

export const donateRoutes = {
  type: 'content-api',
  routes: customRoutes
};
