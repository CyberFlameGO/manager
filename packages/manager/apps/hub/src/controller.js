import { isString } from 'lodash-es';

export default class HubController {
  /* @ngInject */
  constructor(
    $document,
    $http,
    $scope,
    $state,
    $rootScope,
    coreConfig,
    ovhFeatureFlipping,
  ) {
    this.$document = $document;
    this.$http = $http;
    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.chatbotEnabled = false;
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.servicesImpactedWithIncident = [];
    this.navbarOptions = {
      universe: this.coreConfig.getUniverse(),
      toggle: {
        event: 'sidebar:loaded',
      },
    };
    this.currentLanguage = this.coreConfig.getUserLanguage();
    this.me = this.coreConfig.getUser();
    const unregisterListener = this.$scope.$on('app:started', () => {
      const CHATBOT_FEATURE = 'chatbot';
      this.ovhFeatureFlipping
        .checkFeatureAvailability(CHATBOT_FEATURE)
        .then((featureAvailability) => {
          this.chatbotEnabled = featureAvailability.isFeatureAvailable(
            CHATBOT_FEATURE,
          );
          if (this.chatbotEnabled) {
            this.$rootScope.$broadcast(
              'ovh-chatbot:enable',
              this.chatbotEnabled,
            );
          }
        });
      unregisterListener();
    });

    return this.getServicesImpactedByIncident();
  }

  /**
   * Set focus on the specified element.
   * @param  {string} id Element to locate.
   * @return {void}
   */
  setFocus(id) {
    if (isString(id)) {
      const [element] = this.$document.find(`#${id}`);
      element.focus();
    }
  }

  getServicesImpactedByIncident() {
    return this.$http
      .get('/incident-status', {
        serviceType: 'aapi',
      })
      .then(({ data }) => {
        this.servicesImpactedWithIncident = data;
      })
      .catch(() => []);
  }

  goToIncidentStatus() {
    return this.$state.go('app.dashboard.incident.status', {
      incidentName: 'SBG',
    });
  }
}
