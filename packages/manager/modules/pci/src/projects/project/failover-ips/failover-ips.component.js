import controller from './failover-ips.controller';
import template from './failover-ips.html';

export default {
  controller,
  template,
  bindings: {
    failoverIps: '<',
    instances: '<',
    guideUrl: '<',
    projectId: '<',
    failoverIp: '<',
    onListParamChange: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    failoverIpsRegions: '<',
    goToRegion: '<',
  },
};
