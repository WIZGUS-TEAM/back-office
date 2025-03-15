import { factories } from '@strapi/strapi'
export default factories.createCoreController('plugin::dcf.cause', ({ strapi }: { strapi }) => ({
  async requestWithdrawal(ctx: any) {
    const { documentId } = ctx.request.params;
    console.log('documentId', documentId);

    try {
      // Récupérer la cause avec l'association
      const cause = await strapi.documents('plugin::dcf.cause').findOne({
        documentId: documentId,
        populate: {
          association: {
            populate: ['admins']
          }
        }
      })

      if (!cause) {
        return ctx.notFound('Cause introuvable')
      }

      console.log('cause', cause);

      // Vérifier si l'utilisateur appartient à l'association
      const user = ctx.state.user
      if (!user || cause.association.admins.includes(user.id)) {
        return ctx.forbidden('Vous n\'êtes pas autorisé à demander un retrait pour cette cause')
      }

      // Vérifier si la cause est dans un état valide pour le retrait
      if (cause.state !== 'Validée') {
        return ctx.badRequest('La cause doit être dans l\'état "Validée" pour demander un retrait')
      }

      // Vérifier si la date limite est atteinte ou s'il y a des dons
      const now = new Date()
      const endDate = new Date(cause.endDate)
      
      if (now < endDate && cause.currentDonations === 0) {
        return ctx.badRequest('Impossible de demander un retrait avant la date limite sauf si des dons ont été reçus')
      }

      // Mettre à jour l'état de la cause
      const updatedCause = await strapi.documents('plugin::dcf.cause').update({
        documentId: documentId,
        data: {
          state: 'En attente de retrait'
        }
      })

      return updatedCause
    } catch (error) {
      return ctx.badRequest('Une erreur est survenue lors du traitement de la demande de retrait')
    }
  }
}))
