export default (config, { strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    
    console.log(user);
    if (!user || user.roles.some(role => role.code === 'strapi-super-admin')) {
      console.log('Super admin');
      return next();
    }

    console.log('User is not super admin');

    const userAssociation = await strapi.documents('plugin::dcf.association').findFirst({
      filters: {
        admins: {
          id: user.id
        }
      }
    });

    console.log(userAssociation);  

    if (!userAssociation) {
      ctx.query.filters = {
        ...ctx.query.filters,
        id: { $null: true }
      };
      return next();
    }

    ctx.query.filters = {
      ...ctx.query.filters,
      association: {
        documentId: userAssociation.documentId
      }
    };

    return next();
  };
};