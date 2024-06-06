import { BaseRpcRequest } from '@src/common/Net/RpcRequest';

const baseUrl = 'http://21hut.com:8080/v1';

export interface NewWordEntity {
  word: string;
  exp: string;
}

export interface NewWordsNoteBookEntity {
  data: NewWordEntity[];
  message: string;
}

export const WordApi = {
  getWordList: function (
    number: number,
    success: (response: NewWordsNoteBookEntity) => void
  ) {
    const rpc = new BaseRpcRequest(
      baseUrl + `/notebook/${number}`,
      success,
      'GET'
    );
    return rpc.send();
  },
};
