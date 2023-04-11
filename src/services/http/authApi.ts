import axios from 'axios';
import { axiosObj } from './interceptor';

export const authInstance = axios.create(axiosObj);
