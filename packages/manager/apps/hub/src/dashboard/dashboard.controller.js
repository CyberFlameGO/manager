export default class {
  /* @ngInject */
  constructor($rootScope) {
    this.$rootScope = $rootScope;
  }

  $onInit() {
    this.showLivechat.then((openLiveChat) => {
      if (openLiveChat) {
        this.openChatbot();
      }
    });
    return this.trackingPrefix.then((prefix) => {
      this.prefix = prefix;
    });
  }

  openChatbot() {
    this.$rootScope.$emit('ovh-chatbot:open');
  }
}
