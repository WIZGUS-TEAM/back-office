import association from './association';
import donation from './donation';
import company from './company';
import cause from './cause';

export default {
  'association': {
    schema: association.schema
  },
  'donation': {
    schema: donation.schema
  },
  'company': {
    schema: company.schema
  },
  'cause': {
    schema: cause.schema
  }
};
