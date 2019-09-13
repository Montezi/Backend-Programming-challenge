import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const users = await User.findAll({
      order: ['id'],
      attributes: ['id', 'name', 'email', 'state'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      state: Yup.string()
        .required()
        .max(2),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, state } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      state,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      state: Yup.string().max(2),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);
    // console.log(req.userState);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, state } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      state,
    });
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const { id, name, email, state } = user;

    return res.json({
      id,
      name,
      email,
      state,
    });
  }

  async delete(req, res) {
    const { admin } = await User.findByPk(req.userId);

    if (!admin) {
      return res
        .status(401)
        .json({ error: "You don't have permission to delete user." });
    }

    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(deletedRecord => {
        if (deletedRecord === 1) {
          return res.status(200).json({ message: 'User deleted successfully' });
        }
        return res.status(404).json({ message: 'record not found' });
      })
      .catch(err => {
        return res.status(500).json(err);
      });
  }
}

export default new UserController();
