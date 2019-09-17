import sequelize from 'sequelize';
import Panel from '../models/Panel';
import User from '../models/User';

class MaxNumberInstallationController {
  async show(req, res) {
    try {
      const { state } = await User.findOne({
        where: { id: req.userId },
      });

      const maxCost = await Panel.findAll({
        attributes: [
          [sequelize.literal(`COUNT(*)`), 'qtd'],
          [sequelize.literal(`extract (MONTH FROM installation_date)`), 'mes'],
        ],
        group: ['mes'],
        order: sequelize.literal('1 DESC'),
        where: { state },
        limit: 3,
      });

      return res.status(200).json(maxCost);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
}
export default new MaxNumberInstallationController();
