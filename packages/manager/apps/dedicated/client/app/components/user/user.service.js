import flatten from 'lodash/flatten';

import { User } from '@ovh-ux/manager-models';
import { Environment } from '@ovh-ux/manager-config';

angular.module('services').service('User', [
  '$http',
  '$q',
  'constants',
  'Billing.constants',
  'OvhHttp',
  function userF($http, $q, constants, billingConstants, OvhHttp) {
    const self = this;

    this.getUser = function getUser() {
      if (Environment.getUser()) {
        return $q.resolve(
          new User({
            ...Environment.getUser(),
            firstName: Environment.getUser().firstname,
            lastName: Environment.getUser().name,
            billingCountry: Environment.getUser().country,
            customerCode: Environment.getUser().customerCode,
          }),
        );
      }

      return $q.reject(new User());
    };

    this.getUrlOf = function getUrlOf(link) {
      return this.getUser().then((data) => {
        try {
          return constants.urls[data.ovhSubsidiary][link];
        } catch (exception) {
          return constants.urls.FR[link];
        }
      });
    };

    /**
     * The new structure in constants.config.js will be ...value.subsidiary and not subsidiary.value
     * It will be easier for maintainers when you see all the possible values for a constant at
     * the same place
     * If constants are structured the old way, use getUrlOf
     */
    this.getUrlOfEndsWithSubsidiary = function getUrlOfEndsWithSubsidiary(
      link,
    ) {
      return this.getUser().then((data) => {
        try {
          return constants.urls[link][data.ovhSubsidiary];
        } catch (exception) {
          return constants.urls[link].FR;
        }
      });
    };

    this.getSshKeys = function getSshKeys() {
      return OvhHttp.get('/me/sshKey', {
        rootPath: 'apiv6',
      });
    };

    this.getCreditCards = function getCreditCards() {
      return $http.get('apiv6/me/paymentMean/creditCard').then((response) => {
        const queries = response.data.map(self.getCreditCard);

        return $q.all(queries);
      });
    };

    this.getCreditCard = function getCreditCard(id) {
      return $http
        .get(`apiv6/me/paymentMean/creditCard/${id}`)
        .then((response) => response.data);
    };

    this.uploadFile = function uploadFile(filename, file, tags) {
      let idFile;
      let documentResponse;

      const filenameSplitted = file.name.split('.');
      const params = {
        name: [filename, filenameSplitted[filenameSplitted.length - 1]].join(
          '.',
        ),
      };

      if (tags) {
        angular.extend(params, { tags });
      }

      return $http
        .post('apiv6/me/document', params)
        .then((response) => {
          documentResponse = response;

          return $http.post('apiv6/me/document/cors', {
            origin: window.location.origin,
          });
        })
        .then(() => {
          idFile = documentResponse.data.id;
          return $http.put(documentResponse.data.putUrl, file, {
            serviceType: 'external',
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        })
        .then(() => idFile);
    };

    this.getDocument = function getDocument(id) {
      return $http
        .get(`apiv6/me/document/${id}`)
        .then((response) => response.data);
    };

    this.getDocumentIds = function getDocumentIds() {
      return $http.get('apiv6/me/document').then((response) => response.data);
    };

    this.getDocuments = function getDocuments() {
      return self.getDocumentIds().then((data) => {
        const queries = data.map(self.getDocument);

        return $q.all(queries);
      });
    };

    this.payWithRegisteredPaymentMean = function payWithRegisteredPaymentMean(
      opts,
    ) {
      return OvhHttp.post('/me/order/{orderId}/payWithRegisteredPaymentMean', {
        rootPath: 'apiv6',
        urlParams: {
          orderId: opts.orderId,
        },
        data: {
          paymentMean: opts.paymentMean,
        },
      });
    };

    this.getValidPaymentMeansIds = function getValidPaymentMeansIds() {
      const means = billingConstants.paymentMeans;
      const baseUrl = `${constants.swsProxyRootPath}me/paymentMean`;
      const meanRequests = [];
      means.forEach((paymentMethod) => {
        let paramStruct = null;
        if (paymentMethod === 'bankAccount') {
          paramStruct = {
            state: 'valid',
          };
        }
        const promise = $http
          .get([baseUrl, paymentMethod].join('/'), { params: paramStruct })
          .then((response) => response.data);
        meanRequests.push(promise);
      });
      return $q.all(meanRequests).then((response) => flatten(response));
    };

    this.getUserCertificates = function getUserCertificates() {
      return OvhHttp.get('/me/certificates', {
        rootPath: 'apiv6',
      });
    };
  },
]);
