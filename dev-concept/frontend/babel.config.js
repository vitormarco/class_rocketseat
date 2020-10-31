module.exports = {
  presets: [
    '@babel/preset-env', // vai entender o ambiente que a app está sendo usada
    '@babel/preset-react', // Vai entender o html dentro do js
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
  ]
};