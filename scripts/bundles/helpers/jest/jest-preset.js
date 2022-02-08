/**
 * The path's declared below are relative. Specifically, they are relative to the location of this file after
 * compilation of the Stencil compiler has completed. See `scripts/bundles/testing` for the location of this file
 * following compilation.
 */
const path = require('path');
const testingDir = __dirname;
const rootDir = path.join(testingDir, '..');
const internalDir = path.join(rootDir, 'internal');

// NOTE: if you change this, also change compiler/transpile.ts
const moduleExtensions = ['ts', 'tsx', 'js', 'mjs', 'jsx'];
const moduleExtensionRegexp = '(' + moduleExtensions.join('|') + ')';

module.exports = {
  moduleFileExtensions: [...moduleExtensions, 'json', 'd.ts'],
  moduleNameMapper: {
    '^stencil-hotfix/cli$': path.join(rootDir, 'cli', 'index.js'),
    '^stencil-hotfix/compiler$': path.join(rootDir, 'compiler', 'stencil.js'),
    '^stencil-hotfix/internal$': path.join(internalDir, 'testing', 'index.js'),
    '^stencil-hotfix/internal/app-data$': path.join(internalDir, 'app-data', 'index.cjs'),
    '^stencil-hotfix/internal/app-globals$': path.join(internalDir, 'app-globals', 'index.js'),
    '^stencil-hotfix/internal/testing$': path.join(internalDir, 'testing', 'index.js'),
    '^stencil-hotfix/mock-doc$': path.join(rootDir, 'mock-doc', 'index.cjs'),
    '^stencil-hotfix/sys$': path.join(rootDir, 'sys', 'node', 'index.js'),
    '^stencil-hotfix/testing$': path.join(testingDir, 'index.js'),
    '^stencil-hotfix$': path.join(internalDir, 'testing', 'index.js'),
  },
  setupFilesAfterEnv: [path.join(testingDir, 'jest-setuptestframework.js')],
  testEnvironment: path.join(testingDir, 'jest-environment.js'),
  testPathIgnorePatterns: ['/.cache', '/.stencil', '/.vscode', '/dist', '/node_modules', '/www'],
  testRegex: '(/__tests__/.*|\\.?(test|spec))\\.' + moduleExtensionRegexp + '$',
  transform: {
    '^.+\\.(ts|tsx|jsx|css)$': path.join(testingDir, 'jest-preprocessor.js'),
  },
  watchPathIgnorePatterns: ['^.+\\.d\\.ts$'],
};
