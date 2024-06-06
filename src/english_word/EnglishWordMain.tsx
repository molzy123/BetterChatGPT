import React, { useState } from 'react';
import { WordList } from './components/WordList';
import { NewWordEntity } from './mgr/WordApi';
import Article from './components/Article';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';
import { Locator } from '@src/common/System/Locator';
import { EnglishWordService } from './mgr/EnglishWordService';
import { EventService } from '@src/common/Event/EventService';
import { EventEnum } from '@src/common/Event/EventEnum';

const EnglishWordMain = () => {
  
    
    // WordApi.getWordList(10,(data:NewWordsNoteBookEntity)=>{
    //     console.log(data.data);
    //     setWordList(data.data);
    // });
    //构造假数据
    const data = [
        {
            word: 'apple',
            exp: '苹果'
        },
        {
            word: 'banana',
            exp: '香蕉'
        },
        {
            word: 'cherry',
            exp: '樱桃'
        },
        {
            word: 'date',
            exp: '枣'
        },
        {
            word: 'elderberry',
            exp: '接骨木'
        },
        {
            word: 'fig',
            exp: '无花果'
        },
        {
            word: 'grape',
            exp: '葡萄'
        },
        {
            word: 'honeydew',
            exp: '蜜瓜'
        },
        {
            word: 'kiwi',
            exp: '猕猴桃'
        },
        {
            word: 'lemon',
            exp: '柠檬'
        },
        {
            word: 'mango',
            exp: '芒果'
        },
        {
            word: 'nectarine',
            exp: '油桃'
        },
        {
            word: 'orange',
            exp: '橙子'
        },
        {
            word: 'pear',
            exp: '梨'
        },
        {
            word: 'quince',
            exp: '柑橘'
        },
        {
            word: 'raspberry',
            exp: '覆盆子'
        },
        {
            word: 'strawberry',
            exp: '草莓'
        },
        {
            word: 'tangerine',
            exp: '橘子'
        },
        {
            word: 'watermelon',
            exp: '西瓜'
        },
    ];
    const [wordList, setWordList] = useState<NewWordEntity[]|undefined>(data);
    // setWordList(data);
    const englishService = Locator.fetch(EnglishWordService);
    const [message, setMessage] = useState<AiChatMessage|undefined>();

    EventService.registerEvent(EventEnum.CURRENT_ARTICLE_CHANGED,(data:AiChatMessage)=>{
        setMessage(data);
    });

  return (
    <div className="bg-gray-800 flex h-full">
      <div className=" w-[300px] h-full">
        {wordList && <WordList words={wordList}/>}
      </div>
      <div className="flex-grow flex h-ful justify-center" >
        {message && <Article message={message}/>  }
      </div>
    </div>
  );
};

export default EnglishWordMain;
