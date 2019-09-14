import Sequelize, { Model } from 'sequelize';

class Panel extends Model {
  static init(sequelize) {
    super.init(
      {
        data_provider: Sequelize.STRING,
        installation_date: Sequelize.DATE,
        system_size: Sequelize.DOUBLE,
        zip_code: Sequelize.STRING,
        state: Sequelize.STRING,
        cost: Sequelize.DOUBLE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Panel;
