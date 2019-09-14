import fs from 'fs';
import { resolve } from 'path';

import Panel from '../models/Panel';
import User from '../models/User';

class PanelController {
  async store(req, res) {
    const file = resolve(__dirname, '..', '..', '..', 'solar_data.json');
    // eslint-disable-next-line consistent-return
    fs.readFile(file, 'utf8', async (err, jsonString) => {
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

      await Panel.bulkCreate(dataPanel, { validate: true })
        .then(() => {
          console.log('created');
          return res.status(200).json({ msg: 'Data created succefully!' });
        })
        .catch(e => {
          console.log('failed');
          console.log(e);
          return res.status(500).json({ error: e });
        });
    });
  }

  async index(req, res) {
    try {
      const { state } = await User.findOne({
        where: { id: req.userId },
      });

      const { page = 1 } = req.query;

      const panels = await Panel.findAll({
        where: { state },
        order: ['id'],
        attributes: [
          'data_provider',
          'installation_date',
          'system_size',
          'zip_code',
          'state',
          'cost',
        ],
        limit: 30,
        offset: (page - 1) * 30,
      });

      return res.status(200).json(panels);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
}
export default new PanelController();
