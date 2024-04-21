import { handleErrorStatus, isAzureEndpoint } from '@utils/api';
import IAiBotCreateDef from '@src/ai/data/AIDef';
import useStore from '@store/store';

export const post = async (url:string, data:any,accessToken:string) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await  response.json()
      error.status = response.status
      throw new Error(JSON.stringify(error));
    }else{
      return response;
    }
  } catch (error) {
    handleErrorStatus(error)
    return "";
  }
};

export const get = async function (url:string,accessToken:string)
{
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await  response.json()
      error.status = response.status
      throw new Error(JSON.stringify(error));
    }else{
      return response;
    }
  } catch (error) {
    handleErrorStatus(error)
  }
};

export const put = async function (url:string, data:any,accessToken:string)
{
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await  response.json()
      error.status = response.status
      throw new Error(JSON.stringify(error));
    }else{
      return response;
    }
  } catch (error) {
    handleErrorStatus(error)
  }
}
