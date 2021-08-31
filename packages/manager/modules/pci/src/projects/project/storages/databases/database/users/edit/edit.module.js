import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import editUserComponent from './edit.component';
import routing from './edit.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseUsersEdit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseUsersEdit', editUserComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
