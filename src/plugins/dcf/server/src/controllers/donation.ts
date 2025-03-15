/**
 *  controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('plugin::dcf.donation', ({ strapi }) => ({
    async donate(ctx) {
        try {
          const { donatorId, amount, causeId, companyCode } = ctx.request.body;
          
          // Validation des champs requis
          if (!donatorId || !amount || !causeId || !companyCode) {
            return ctx.badRequest('Tous les champs sont requis: identifier, amount, causeId, companyCode');
          }
    
          // Validation du montant
          if (typeof amount !== 'number' || amount <= 0) {
            return ctx.badRequest('Le montant doit être un nombre positif');
          }
    
          // Création de la donation
          const result = await strapi.documents('plugin::dcf.donation').create({
            data: {
              donatorIdentifier: donatorId,
              amount,
              cause: causeId,
              company: companyCode,
            }
          });
          return result;
          
        } catch (error) {
          console.error('Erreur lors de la création de la donation:', error);
          return ctx.badRequest('Une erreur est survenue lors de la création de la donation');
        }
      },
}));
