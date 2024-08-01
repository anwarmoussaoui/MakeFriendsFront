import axios from 'axios';

export const getProfile = async (email: string) => {
    const response = await axios.get(`http://localhost:8080/api/setting/${email}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  };
export const updateProfile = async (email: string, name: string, nickname: string, file: File) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('nickname', nickname);
  formData.append('file', file);

  const response = await axios.post(`http://localhost:8080/api/setting/${email}`, formData, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
      
    },
  });

  return response.data;
};
