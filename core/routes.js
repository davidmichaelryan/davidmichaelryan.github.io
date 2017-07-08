/* eslint global-require: 0, import/no-dynamic-require: 0 */
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.load();

const noRouteModules = {
  header: true,
  footer: true,
};
const moduleFoldersPath = `${__dirname}/../modules/`;

// https://stackoverflow.com/a/35759360
const fetchModuleNames = () => fs.readdirSync(moduleFoldersPath).filter(
    f => fs.statSync(moduleFoldersPath + f).isDirectory() && !noRouteModules[f]
);

const defaultRoute = (app, name) => {
  const path = name === 'homepage' ? '/' : `/${name}`;
  app.get(path, (req, res) => {
    res.render(`modules/${name}`);
  });
};

const routes = (app) => {
  app.use((req, res, next) => {
    next();
  });

  fetchModuleNames().forEach((moduleName) => {
    if (fs.statSync(moduleFoldersPath + moduleName).isFile()) {
      require(`${moduleFoldersPath + moduleName}/routes`)(app);
    } else {
      defaultRoute(app, moduleName);
    }
  });
};

module.exports = routes;
