import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../JWT/userTokens.js';
import { getUser, createNewUser } from '../db/requests/userRequests.js';

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors });
      }

      const { email, password } = req.body;

      if (await getUser(email)) {
        return res.status(400).json({ message: 'The user already exist' });
      }

      const hashPassword = await bcrypt.hash(password, 3);
      const dataUser = { email, password: hashPassword };

      await createNewUser(dataUser);
      const user = await getUser(email);
      const token = generateAccessToken(user._id, user.email);

      return res.json({ message: 'The user has been successfully registered', token });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await getUser(email);

      if (!user) {
        return res.status(400).json({ message: 'The user not found' });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: 'Insert incorrect password' });
      }

      const token = generateAccessToken(user._id, user.email);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login error' });
    }
  }

  async checkLogin(req, res) {
    try {
      res.json({ message: 'User authorizatoin' });
      console.log(req.user);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new AuthController();
