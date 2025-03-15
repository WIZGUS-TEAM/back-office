export default {
  kind: 'collectionType',
  collectionName: 'causes',
  info: {
    singularName: 'cause',
    pluralName: 'causes',
    displayName: 'Cause'
  },
  options: {
    comment: ''
  },
  attributes: {
    name: {
      type: 'string'
    },
    description: {
      type: 'text'
    },
    state: {
      type: 'enumeration',
      enum: ['Refusée', 'En examen', 'Validée', 'En attente de retrait', 'Terminée'],
      default: 'En examen' 
    },
    donationGoal: {
      type: 'decimal'
    },
    currentDonations: {
      type: 'decimal',
      default: 0
    },
    endDate: {
      type: 'date',
      required: true
    },
    association: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'plugin::dcf.association',
      inversedBy: 'causes'
    },
    donations: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'plugin::dcf.donation',
      mappedBy: 'cause'
    }
  }
}