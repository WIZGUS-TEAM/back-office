export default {
    kind: 'collectionType',
    collectionName: 'donations',
    info: {
      singularName: 'donation',
      pluralName: 'donations',
      displayName: 'Donation'
    },
    options: {
      comment: ''
    },
    attributes: {
      donatorIdentifier: {
        type: 'string',
        required: true,
      },
      cause: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'plugin::dcf.cause',
        inversedBy: 'donations'
      },
      company: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'plugin::dcf.company',
        inversedBy: 'donations'
      },
      date: {
        type: 'date'
      },
      amount: {
        type: 'integer'
      }
    }
  }