import type { StrapiApp } from '@strapi/strapi/admin';
import favicon from "./extensions/favicon.png";
import menuLogo from "./extensions/menu-logo.png";
import authLogo from "./extensions/auth-logo.png";
export default {
  config: {
    locales: [
      'fr',
    ],
    translations: {
      fr: {
        'Auth.form.welcome.title': 'SolidaryPay', 
        'Auth.form.welcome.subtitle': 'Connectez-vous à votre compte',
      },
    },
    theme: {
      light: {
        colors: {
          primary600: '#0095de',
          buttonPrimary600: '#0095de',
          buttonPrimary500: '#0095de',
        },
      },
    },
    head: {
      favicon: favicon,
    },
    menu: {
      logo: menuLogo,
    }, 
    auth: {
      logo: menuLogo,
    }
  },
  bootstrap(app: StrapiApp) {
    console.log(app); 

  },
};
