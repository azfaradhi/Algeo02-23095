import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const fetchGreeting = async () => {
  const response = await api.get('/');
  return response.data;
};

export const fetchMapperData = async () => {
  const response = await api.get('/mapper');
  return response.data;
};

export const fetchFilesFromDataset = async () => {
  const response = await api.get('/dataset');
  return response.data;
}