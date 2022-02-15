export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.connectors.config',
    {
      url: '/add/:availableConnectorId/config',
      component: 'ovhManagerPciStoragesDatabaseConnectorConfigComponent',
      params: {
        availableConnectorId: null,
      },
      resolve: {
        breadcrumb: () => null,
        availableConnectorId: /* @ngInject */ ($transition$) =>
          $transition$.params().availableConnectorId,
        availableConnector: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          availableConnectorId,
        ) =>
          DatabaseService.getAvailableConnector(
            projectId,
            database.engine,
            database.id,
            availableConnectorId,
          ).then((availableConnector) =>
            DatabaseService.getAvailableConnectorConfiguration(
              projectId,
              database.engine,
              database.id,
              availableConnectorId,
            ).then((connectorConfig) => {
              availableConnector.setConfiguration(connectorConfig);
              return availableConnector;
            }),
          ),
        goBack: /* @ngInject */ (goBackToConnectors) => goBackToConnectors,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
