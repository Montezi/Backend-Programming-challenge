import fs from 'fs';
import { resolve } from 'path';

import Panel from '../models/Panel';

class PanelController {
  async index(req, res) {
    const file = resolve(__dirname, '..', '..', '..', 'solar_data.json');
    fs.readFile(file, 'utf8', (err, jsonString) => {
      if (err) {
        console.log('File read failed:', err);
        return res.status(500).json(err);
      }
      const data = JSON.parse(jsonString);
      const dataPanel = [];

      data.map(async panel => {
        const dados = {};
        dados.data_provider = panel['Data Provider'];
        dados.installation_date = panel['Installation Date'];
        dados.system_size = panel['System Size'];
        dados.zip_code = panel['Zip Code'];
        dados.state = panel.State;
        dados.cost = panel.Cost;
        dataPanel.push(dados);
      });

      Panel.bulkCreate(dataPanel, { validate: true })
        .then(() => {
          console.log('created');
          return res.json({ ok: true });
        })
        .catch(e => {
          console.log('failed');
          console.log(e);
          return res.status(500).json({ error: e });
        });
    });

    // try {
    //   const teste = await Panel.bulkCreate(dataPanel);
    //   return res.json(teste);
    // } catch (e) {

    // }
  }
}
export default new PanelController();
