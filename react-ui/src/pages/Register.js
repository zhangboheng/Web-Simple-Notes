import React, { useState } from 'react';
import { register } from '../services/auth';

function Register() {
  const [loginNum, setUsername] = useState('');
  const [loginPwd, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ loginNum, loginPwd });
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input
        type="username"
        value={loginNum}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        required
      />
      <input
        type="password"
        value={loginPwd}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        required
      />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Register;