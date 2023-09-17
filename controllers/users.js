const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (email && !validator.isEmail(email)) {
    throw new BadRequestError('Передан неправильный email');
  }

  if (!password) {
    throw new BadRequestError('Введите пароль');
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в методы создания пользователя'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new InternalServerError('Не удалось получить пользователей')));
};

module.exports.getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неправильно передан ID пользователя'));
      }
      return next(err);
    });
};

module.exports.getMyUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неправильно передан ID пользователя'));
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неправильно переданы данные'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неправильно переданы данные'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError('Введите почту и пароль'));
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return [bcrypt.compare(password, user.password), user];
    })
    .then(([matched, user]) => {
      if (!matched) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      return res
        .cookie('token', token, { httpOnly: true })
        .send({ message: 'Вы успешно вошли' });
    })
    .catch(next);
};
