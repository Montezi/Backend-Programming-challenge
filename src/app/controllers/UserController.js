import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;
    try {
      const users = await User.findAll({
        order: ['id'],
        attributes: ['id', 'name', 'email', 'state'],
        limit: 20,
        offset: (page - 1) * 20,
      });

      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async store(req, res) {
    try {
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

      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const { id, name, email, state } = await User.create(req.body);

      return res.status(200).json({
        id,
        name,
        email,
        state,
      });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async update(req, res) {
    try {
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

      if (email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return res.status(400).json({ error: 'User already exists' });
        }
      }
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match' });
      }

      await user.update(req.body);
      const { id, name, state, avatar } = await User.findByPk(req.userId, {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      });

      return res.status(200).json({
        id,
        name,
        email,
        state,
        avatar,
      });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async show(req, res) {
    try {
      const idUser = parseInt(req.params.id, 10);
      if (idUser !== req.userId) {
        return res.status(401).json({ error: "You don't have permission" });
      }

      const user = await User.findOne({
        where: { id: idUser },
        attributes: ['id', 'name', 'email', 'state', 'avatar_id'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  // eslint-disable-next-line consistent-return
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
        return res.status(404).json({ message: 'User not found' });
      })
      .catch(err => {
        return res.status(500).json(err);
      });
  }
}

export default new UserController();
