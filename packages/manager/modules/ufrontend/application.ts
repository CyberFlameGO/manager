import '@webcomponents/webcomponentsjs/webcomponents-loader';
import OvhMicroFrontend from './src/framework.class';
import OvhFragment from './src/fragment.class';
import { FragmentConfig } from './src/ufrontend';

export default function registerApplication(
  applicationName: string,
): Promise<FragmentConfig> {
  return new Promise((resolve, reject) => {
    window.WebComponents.waitFor(() => {
      if (!window.ovhMicroFrontend) {
        const ufrontend = new OvhMicroFrontend();
        window.ovhMicroFrontend = ufrontend;
        ufrontend
          .init(applicationName)
          .then(resolve)
          .catch(reject);
      }

      if (!window.customElements.get('ovh-fragment')) {
        window.customElements.define('ovh-fragment', OvhFragment);
      }
    });
  });
}
