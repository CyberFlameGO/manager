import controller from './edit.controller';
import template from './edit.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    storageId: '<',
    storage: '<',
    steins: '<',
    customerRegions: '<',
    storagesRegions: '<',
    goBack: '<',
  },
};
