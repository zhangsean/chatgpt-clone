const express = require('express');
const router = express.Router();
const userSystemEnabled = !!process.env.ENABLE_USER_SYSTEM || false;

router.post('/login', function (req, res) {
  if (userSystemEnabled) {
    const { username, password } = req.body;
    if (!username || !password) {
      res.send(`请输入账号密码`, 201);
      return;
    } else if (username != 'admin' || password != 'Chat*adm1n') {
      res.send(`账号或密码不匹配`, 201);
      return;
    }

    if (userSystemEnabled) {
      const loginUser = {
        username: username, // was 'sample_user', but would break previous relationship with previous conversations before v0.1.0
        display: username
      };
      req.session.user = loginUser;
      req.session.save(function (error) {
        if (error) {
          console.log(error);
          res.send(`<h1>Login Failed. An error occurred. Please see the server logs for details.</h1>`, 202);
        } else {
          res.send(JSON.stringify(loginUser));
          // res.redirect('/chat/new');
        }
      });
    }
  } else {
    res.redirect('/');
  }
});

router.get('/logout', function (req, res) {
  // clear the session
  req.session.user = null;

  req.session.save(function () {
    if (userSystemEnabled) {
      // res.send(JSON.stringify({'code':0,'msg':'OK'}))
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
});

const authenticatedOr401 = (req, res, next) => {
  if (userSystemEnabled) {
    const user = req?.session?.user;

    if (user) {
      next();
    } else {
      res.status(401).end();
    }
  } else {
    next();
  }
};

const authenticatedOrRedirect = (req, res, next) => {
  if (userSystemEnabled) {
    const user = req?.session?.user;

    if (user) {
      next();
    } else {
      res.redirect('/login');
    }
  } else next();
};

module.exports = { router, authenticatedOr401, authenticatedOrRedirect };
