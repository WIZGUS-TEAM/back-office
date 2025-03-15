import type { Core } from '@strapi/strapi';

const bootstrap = ({ strapi }: { strapi }) => {
  strapi.db.lifecycles.subscribe({
    models: ['plugin::dcf.donation'],

    async afterCreate(event: any) {
      const { result } = event;
      if (result.cause) {
        await updateCauseDonations(strapi, result.documentId);
      }
    },

    async afterUpdate(event: any) {
      const { result } = event;
      if (result.cause) {
        await updateCauseDonations(strapi, result.documentId);
      }
    },

    async afterDelete(event: any) {
      const { result } = event;
      if (result.cause) {
        await updateCauseDonations(strapi, result.documentId);
      }
    },
  });
};

async function updateCauseDonations(strapi, donationDocumentId: string) {
  const donation = await strapi.db.query('plugin::dcf.donation').findOne({
    where: {
      documentId: donationDocumentId
    },
    populate: ['cause']
  });
  const causeDocumentId = donation.cause.documentId;

  // Récupérer toutes les donations pour cette cause
  const donations = await strapi.db.query('plugin::dcf.donation').findMany({
    where: {
      cause: {
        documentId: causeDocumentId
      }
    },
    select: ['amount']
  });

  // Calculer la somme totale
  const total = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);

  // Mettre à jour la cause avec le nouveau total en utilisant le document service
  await strapi.documents('plugin::dcf.cause').update({
    documentId: causeDocumentId,
    data: {
      currentDonations: total
    }
  });
}

export default bootstrap;
