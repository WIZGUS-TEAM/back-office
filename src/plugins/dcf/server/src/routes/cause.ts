import { factories } from '@strapi/strapi';

const customRoutes = [
  {
    method: 'POST',
    path: '/causes/:documentId/request-withdrawal',
    handler: 'cause.requestWithdrawal',
    config: {
      middlewares: ['plugin::dcf.filterCauseByAssociation']
    }
  }
];

export const causeAdmin = factories.createCoreRouter('plugin::dcf.cause', {
  type: 'admin',
  config: {
    find: {
      middlewares: ['plugin::dcf.filterCauseByAssociation'],
    },
    findOne: {
      middlewares: ['plugin::dcf.filterCauseByAssociation'],
    },
    create: {
      middlewares: ['plugin::dcf.associateCauseToAssociation'],
    }
  }
});

export const causeContent = factories.createCoreRouter('plugin::dcf.cause');

export const causeAdminWithdrawal = {
  type: 'admin',
  routes: customRoutes
};
