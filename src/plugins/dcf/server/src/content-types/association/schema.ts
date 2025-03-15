export default {
  kind: 'collectionType',
  collectionName: 'associations',
  info: {
    singularName: 'association',
    pluralName: 'associations',
    displayName: 'Association'
  },
  options: {
    comment: ""
  },
  pluginOptions: {
    'content-manager': {
      visible: true
    },
    'content-type-builder': {
      visible: true
    }
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    causes: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'plugin::dcf.cause',
      mappedBy: 'association'
    },
    admins: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'admin::user',
    }
  }
}

