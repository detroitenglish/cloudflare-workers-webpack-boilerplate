module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true,
        useBuiltIns: 'usage',
        debug: process.env.WORKER_ACTION === 'build',
        targets: {
          browsers: 'last 1 Chrome versions',
        },
        exclude: [
          'web.dom.iterable', // We ain't got no DOM...
        ],
      },
    ],
  ],
  plugins: [],
}
