import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface, ModelOptions } from '@type/chat';
import { handleErrorStatus, isAzureEndpoint } from '@utils/api';

export const getToken = async (username:string,password:string ) => {
  try {
    // 创建一个 FormData 实例
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await fetch('http://127.0.0.1:8000/token', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await  response.json()
      error.status = response.status
      throw new Error(JSON.stringify(error));
    }

    const result = await response.json();
    return result.access_token;
  } catch (error) {
    handleErrorStatus(error)
  }
};


export const getSelfInfo = async (token: string) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/users/me/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await  response.json()
      error.status = response.status
      throw new Error(JSON.stringify(error));
    }
    const result = await response.json();
    return result;
  } catch (error) {
    handleErrorStatus(error)
  }
}
