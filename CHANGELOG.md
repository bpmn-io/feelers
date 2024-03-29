# Changelog

All notable changes to [feelers](https://github.com/bpmn-io/feelers) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 1.3.1

* `FIX`: allow context overrides for builtins ([aa20cbba](https://github.com/bpmn-io/feelers/commit/aa20cbbadaf101ebbcc596a17accd3f687846770))

## 1.3.0

* `FEAT`: add sanitizer option to feelers ([#27](https://github.com/bpmn-io/feelers/pull/27))
* `DEPS`: update to `feelin@3.0.0`
* `DEPS`: update to `lezer-feel@1.2.4`
* `DEPS`: update to `@bpmn-io/feel-lint@1.2.0`

## 1.2.0

* `FEAT`: evaluate expressions with feel native string conversion ([#6a30a7c8](https://github.com/bpmn-io/feelers/commit/6a30a7c85a21d5215dead7e1d2639d0aea3f79dc))
* `DEPS`: update to `feelin@2.3.0`
* `DEPS`: update to `@bpmn-io/feel-lint@1.1.1`

## 1.1.0

* `DEPS`: update to `@bpmn-io/feel-lint@1.1.0`

## 1.0.0

* `FIX`: expose module using `mjs` extension ([#21](https://github.com/bpmn-io/feelers/pull/21))
* `FIX`: correct playground not bundling ([#21](https://github.com/bpmn-io/feelers/pull/21))
* `DEPS`: update to `lezer-feel@1.2.0`
* `DEPS`: update to `feelin@1.2.0`
* `DEPS`: update `lezer*` dependencies

## 0.1.0

### Breaking Changes

* `DEPS`: bumped feelin to `1.0.0`, which no longer supports expression list evaluation, as per the DMN FEEL specification. This is unlikely to have affected many people, if any.

## 0.1.0-alpha.8

* `FEAT`: added single line mode

## 0.1.0-alpha.6

* `FEAT`: higher contrast light theme

## 0.1.0-alpha.5

* `FEAT`: parameterized the editor host language (markdown is now opt-in)
* `FIX`: adjusted themes to match variable and bracket color

## 0.1.0-alpha.4

* `FEAT`: added content attribute extension to API

## 0.1.0-alpha.3

* `FIX`: differentiated cursor from bracket match outlines in light mode

## 0.1.0-alpha.2

* `FEAT`: implemented light mode

## 0.1.0-alpha.1

* `FIX`: fixed exports

## 0.1.0-alpha.0

_Initial release._
