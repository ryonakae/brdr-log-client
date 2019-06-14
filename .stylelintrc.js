const css = {
  properties: 'assets/css/custom-properties.css',
  media: 'assets/css/custom-media.css'
}

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: [
    'stylelint-value-no-exposed-custom-properties',
    'stylelint-value-no-unknown-custom-properties',
    'stylelint-media-use-custom-media',
    'stylelint-use-nesting'
  ],
  rules: {
    'declaration-colon-newline-after': 'always-multi-line',
    'value-list-comma-newline-after': 'always-multi-line',
    'plugin/value-no-exposed-custom-properties': [
      false,
      { importFrom: [css.properties] }
    ],
    'csstools/value-no-unknown-custom-properties': [
      true,
      { importFrom: [css.properties] }
    ],
    'csstools/media-use-custom-media': [
      'always-known',
      { importFrom: [css.media] }
    ],
    'csstools/use-nesting': 'always'
  }
}
