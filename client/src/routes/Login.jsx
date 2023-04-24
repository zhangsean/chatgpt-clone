import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        username: username,
        password: password
      });
      if (response.status == 200) {
        window.location.href = '/chat/new';
      } else {
        alert(response.data)
      }

      // console.log(response.data);
      // 在登录成功时，你可以在此处更新用户状态或跳转到其他页面
    } catch (error) {
      console.error(error);
      // 在登录失败时，你需要在此处向用户显示错误消息
    }
  };
  return (
    <>
      <div className="login_root">
        <div id="login_box">
          <h2>登录</h2>
          <form onSubmit={handleSubmit}>
            <div id="input_box">
              <input type="text" value={username} placeholder='请输入账号' onChange={(event) => setUsername(event.target.value)} />
            </div>
            <div className="input_box">
              <input type="password" value={password} placeholder='请输入密码' onChange={(event) => setPassword(event.target.value)} />
            </div>
            <button className='login-submit' type="submit">登录</button>
          </form>
        </div>
      </div>
    </>
  );
}
