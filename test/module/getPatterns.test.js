const m$katashiki = require(`${__module_dir}/dcs_sugity/qcNgPainting.module.js`);

const config = require(__config_dir + "/app.config.json");
const mysql = new (require(__class_dir + "/mariadb.class.js"))(config.db);

describe("Painting Sisipan", () => {
  test("Rearrange Queue Painting Order", async () => {
    const getQueuePainting = await m$katashiki.listNgRepair();
    console.log(JSON.stringify(getQueuePainting, null, 2));
  });
});
