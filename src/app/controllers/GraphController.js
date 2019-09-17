import sequelize from 'sequelize';
import Panel from '../models/Panel';
import User from '../models/User';

class GraphController {
  async show(req, res) {
    try {
      const { state } = await User.findOne({
        where: { id: req.userId },
      });

      const dataGraph = await Panel.findAll({
        attributes: [
          [sequelize.literal(`SUM(system_size)`), 'total'],
          [sequelize.literal(`extract (YEAR FROM installation_date)`), 'ano'],
        ],
        group: ['ano'],
        order: sequelize.literal('2 ASC'),
        where: { state },
      });

      return res.status(200).json(dataGraph);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
}
export default new GraphController();
