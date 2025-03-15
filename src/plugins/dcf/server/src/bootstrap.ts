import type { Core } from '@strapi/strapi';

const bootstrap = ({ strapi }: { strapi }) => {
  strapi.db.lifecycles.subscribe({
    models: ['plugin::dcf.donation'],

    async afterCreate(event: any) {
      const { result } = event;
      await updateCauseDonations(strapi, result.documentId);
    },

    async afterUpdate(event: any) {
      const { result } = event;
      await updateCauseDonations(strapi, result.documentId);
    },

    async afterDelete(event: any) {
      const { result } = event;
      // Pour le delete, on doit d'abord récupérer la cause avant la suppression
      const donation = await strapi.db.query('plugin::dcf.donation').findOne({
        where: { documentId: result.documentId },
        populate: ['cause']
      });
      
      if (donation && donation.cause) {
        const causeDocumentId = donation.cause.documentId;
        // Récupérer toutes les donations restantes pour cette cause
        const donations = await strapi.db.query('plugin::dcf.donation').findMany({
          where: {
            cause: { documentId: causeDocumentId },
            documentId: { $ne: result.documentId } // Exclure la donation supprimée
          },
          select: ['amount']
        });

        // Calculer la somme totale
        const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

        // Mettre à jour la cause
        await strapi.documents('plugin::dcf.cause').update({
          documentId: causeDocumentId,
          data: { currentDonations: total }
        });
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
  console.log('total', total);
  console.log('causeDocumentId', causeDocumentId);
  await strapi.documents('plugin::dcf.cause').update({
    documentId: causeDocumentId,
    data: {
      currentDonations: total
    }
  });
}

export default bootstrap;
