const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-err');
const BadRequestError = require('../errors/bad-request-err');

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
      if (err.name === 'BadRequest') {
        next(err);
      }
      return next(new InternalServerError('Произошла неизвестная ошибка'));
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
      if (err.name === 'NotFound') {
        next(err);
      }
      return next(new InternalServerError('Не удалось получить данные о пользователе'));
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
      return next(new InternalServerError('Не удалось получить данные о пользователе'));
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
      return next(new InternalServerError('Произошла ошибка'));
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
      return next(new InternalServerError('Произошла ошибка'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return [bcrypt.compare(password, user.password), user];
    })
    .then(([matched, user]) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      return res
        .cookie('token', token, { httpOnly: true })
        .send({ message: 'Logged in successfully 😊 👌' });
    })
    .catch((err) => {
      next({ message: err.message });
      // res
      //   .status(UNAUTHORIZED)
      //   .send({ message: err.message });
    });
};
