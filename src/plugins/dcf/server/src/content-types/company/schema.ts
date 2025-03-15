export default {
    kind: "collectionType",
    collectionName: "companies",
    info: {
      singularName: "company", 
      pluralName: "companies",
      displayName: "Company"
    },
    options: {
      comment: ""
    },
    attributes: {
      name: {
        type: "string"
      },
      donations: {
        type: "relation",
        relation: "oneToMany",
        target: "plugin::dcf.donation",
        mappedBy: "company"
      }
    }
}