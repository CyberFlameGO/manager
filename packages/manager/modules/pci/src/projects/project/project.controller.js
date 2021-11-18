import angular from 'angular';
import isNil from 'lodash/isNil';

import { COMMUNITY_LINKS, PRODUCT_IMAGES } from './project.constants';

export default class ProjectController {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $uibModal,
    atInternet,
    coreConfig,
    OvhApiCloudProject,
    ovhFeatureFlipping,
    PciProject,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.region = coreConfig.getRegion();
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.PciProject = PciProject;

    const filterByRegion = (list) =>
      list.filter(
        ({ regions }) => isNil(regions) || coreConfig.isRegion(regions),
      );

    this.links = filterByRegion(LINKS);
    this.communityLinks = filterByRegion(COMMUNITY_LINKS);
  }

  $onInit() {
    this.productImages = PRODUCT_IMAGES;
    this.isSidebarOpen = false;

    this.$scope.$on('sidebar:open', () => {
      this.isSidebarOpen = true;
      this.$timeout(() => angular.element('#sidebar-focus').focus());
    });

    this.projectQuotaAboveThreshold = this.quotas.find(
      (quota) => quota.quotaAboveThreshold,
    );

    const featuresName = ProjectController.findFeatureToCheck(ACTIONS);
    this.ovhFeatureFlipping
      .checkFeatureAvailability(featuresName)
      .then((features) => {
        const isItemAvailable = ({
          regions,
          feature,
          availableForTrustedZone,
        }) => {
          const isValidRegion =
            isNil(regions) || this.coreConfig.isRegion(regions);
          const isValidFeature =
            !feature || features.isFeatureAvailable(feature);

          return (
            (!this.isTrustedZone && isValidRegion && isValidFeature) ||
            (this.isTrustedZone &&
              availableForTrustedZone &&
              isValidRegion &&
              isValidFeature)
          );
        };

        this.actions = ACTIONS.filter((action) => {
          return isItemAvailable(action);
        });
      });
    this.PciProject.setProjectInfo(this.project);
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  /**
   * finds and returns array of features
   * @param {Array} items
   */
  static findFeatureToCheck(items) {
    return items.reduce((features, item) => {
      return [...features, item.feature].filter((feature) => !!feature);
    }, []);
  }
}
