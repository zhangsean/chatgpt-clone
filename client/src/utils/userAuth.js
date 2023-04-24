import axios from 'axios';

export default async function fetchData() {
  try {
    const response = await axios.get('/api/me', {
      timeout: 1000,
      withCredentials: true
    });
    const user = response.data;
    if (user) {
      return user;
    } else {
      console.log('Not login!');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Get me info error', error);
    window.location.href = '/login';
  }
}