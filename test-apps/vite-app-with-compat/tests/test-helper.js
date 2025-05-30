import Application from 'vite-app-with-compat/app';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import config, { enterTestMode } from 'vite-app-with-compat/config';

export function start() {
  enterTestMode();
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  qunitStart({ loadTests: false });
}
