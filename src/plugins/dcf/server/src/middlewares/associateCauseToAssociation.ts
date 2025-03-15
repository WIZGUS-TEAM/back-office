export default (config, { strapi }) => {
    return async (ctx, next) => {
  
      const user = ctx.state.user;
      
      if (!user) {
        return next();
      }
  
      // Si c'est un super admin, on ne fait rien
      if (user.roles.some(role => role.code === 'strapi-super-admin')) {
        return next();
      }
  
      // On récupère l'association de l'admin
      const userAssociation = await strapi.documents('plugin::dcf.association').findFirst({
        filters: {
          admins: {
            id: user.id
          }
        }
      });
  
      if (!userAssociation) {
        return next();
      }
  
      // On ajoute l'association à la cause
      ctx.request.body.data = {
        ...ctx.request.body.data,
        association: userAssociation.id
      };
  
      return next();
    };
  };