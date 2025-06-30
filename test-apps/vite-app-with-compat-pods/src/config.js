const ENV = {
  modulePrefix: 'vite-app-with-compat-pods',
  podModulePrefix: 'vite-app-with-compat-pods/pods',
  environment: import.meta.env.DEV ? 'development' : 'production',
  rootURL: '/',
  locationType: 'history',
  EmberENV: {},
  APP: {
    // Here you can pass flags/options to your application instance
    // when it is created
  },
};

Object.assign(window, { EmberENV: ENV.EmberENV });

export default ENV;

export function enterTestMode() {
  ENV.locationType = 'none';
  ENV.APP.rootElement = '#ember-testing';
  ENV.APP.autoboot = false;
}
