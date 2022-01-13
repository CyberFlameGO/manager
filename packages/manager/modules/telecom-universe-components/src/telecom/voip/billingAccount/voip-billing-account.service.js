import map from 'lodash/map';

/**
 *  @ngdoc service
 *  @name managerApp.service:tucVoipBillingAccount
 *
 *  @requires OvhApiTelephony from ovh-api-services
 *  @requires managerApp.object:TucVoipBillingAccount
 *
 *  @description
 *  Service that manage API calls to `/telephony/{billingAccount}`.
 */
export default class {
  /* @ngInject */
  constructor($http, iceberg, TucVoipBillingAccount) {
    this.$http = $http;
    this.iceberg = iceberg;
    this.TucVoipBillingAccount = TucVoipBillingAccount;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipBillingAccount#fetchAll
   *  @methodOf managerApp.service:tucVoipBillingAccount
   *
   *  @description
   *  Get all billingAccounts of connected user using API v7.
   *
   *  @param {Boolean} [withError=true]   Either return billingAccounts and services
   *                                      with error or not. Should be replaced with better filters
   *                                      when APIv7 will be able to filter by status code (SOON!!).
   *
   *  @return {Promise} That return an Array of TucVoipBillingAccount instances.
   */
  fetchAll() {
    return this.iceberg('/telephony')
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data: result }) => {
        return map(result, (res) => {
          if (res.billingAccount) {
            return new this.TucVoipBillingAccount(res);
          }
          return null;
        });
      });
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipBillingAccount#fetchServiceInfo
   *  @methodOf managerApp.service:tucVoipBillingAccount
   *
   *  @description
   *  Get billing account service information.
   *
   *
   *  @return {Promise} That return an billing account service information.
   */
  fetchServiceInfo(billingAccount) {
    return this.$http
      .get(`/telephony/${billingAccount}/serviceInfos`)
      .then(({ data }) => data);
  }
}
