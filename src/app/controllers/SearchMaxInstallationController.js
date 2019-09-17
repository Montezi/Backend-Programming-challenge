import sequelize from 'sequelize';
import Panel from '../models/Panel';
import User from '../models/User';

class SearchMaxInstallationController {
  async show(req, res) {
    try {
      const { state } = await User.findOne({
        where: { id: req.userId },
      });

      const maxCost = await Panel.findAll({
        attributes: [
          [sequelize.fn('max', sequelize.col('cost')), 'maxCost'],
          'zip_code',
        ],
        group: 'zip_code',
        order: sequelize.literal('1 DESC'),
        where: { state },
        limit: 1,
      });

      return res.status(200).json(maxCost);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
}
export default new SearchMaxInstallationController();
