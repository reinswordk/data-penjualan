// will be executed for every test
const urlWebsite = "site";

global.__basedir = __dirname + "/../";
global.__config_dir = __basedir + '/config';
global.__class_dir = __basedir + '/class';
global.__module_dir = __basedir + '/module';
global.__addons_dir = __basedir + '/addons';
global.__routes_dir = __basedir + '/routes';
global.__views_dir = __basedir + '/views';

const config = require(__config_dir + "/app.config.json");
global.__site_title = config.site.title;
global.__siteurl = config.site.url;
global.__publicurl = __siteurl + "/" + urlWebsite;

const mysql = new (require(__class_dir + "/mariadb.class.js"))(config.db);
afterAll(async () => {
  await mysql.end();
});
