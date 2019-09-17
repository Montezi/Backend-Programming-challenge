import Panel from '../models/Panel';
import User from '../models/User';

class SearchTotalInstallationController {
  async show(req, res) {
    try {
      const { state } = await User.findOne({
        where: { id: req.userId },
      });

      const countPanels = await Panel.count({
        where: { state },
      });

      return res.status(200).json(countPanels);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
}
export default new SearchTotalInstallationController();
