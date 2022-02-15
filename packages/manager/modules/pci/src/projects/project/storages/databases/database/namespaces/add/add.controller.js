import { stringToDuration } from '../durationHelper.constants';
import Namespace from '../../../../../../../components/project/storages/databases/namespace.class';
import { FORM_RULES } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.FORM_RULES = FORM_RULES;
  }

  $onInit() {
    this.trackDashboard('namespaces_add', 'page');
    this.model = {
      type: 'aggregated',
      retention: {},
    };
  }

  prepareModel() {
    return new Namespace({
      name: this.model.name,
      resolution: stringToDuration(this.model.resolution),
      retention: {
        blockDataExpirationDuration: stringToDuration(
          this.model.retention.blockDataExpirationDuration,
        ),
        blockSizeDuration: stringToDuration(
          this.model.retention.blockSizeDuration,
        ),
        bufferFutureDuration: stringToDuration(
          this.model.retention.bufferFutureDuration,
        ),
        bufferPastDuration: stringToDuration(
          this.model.retention.bufferPastDuration,
        ),
        periodDuration: stringToDuration(this.model.retention.periodDuration),
      },
      snapshotEnabled: this.model.snapshotEnabled,
      type: this.model.type,
      writesToCommitLogEnabled: this.model.writesToCommitLogEnabled,
    });
  }

  trackAndGoBack() {
    this.trackDashboard('namespaces::add_new_namespace_cancel');
    this.goBack();
  }

  add() {
    this.processing = true;
    this.trackDashboard('namespaces::add_new_namespace_validated');
    return this.DatabaseService.addNamespace(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.prepareModel(),
    )
      .then(() => {
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_namespaces_add_success_message',
            {
              name: this.model.name,
            },
          ),
        });
      })
      .catch((err) => {
        return this.goBack(
          this.$translate.instant(
            'pci_databases_namespaces_add_error_message',
            {
              name: this.model.name,
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
