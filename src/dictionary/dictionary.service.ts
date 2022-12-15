import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IExample } from '../phrase/interface/example.interface';
// https://rapidapi.com/haizibinbin-owyntKc0a48/api/ai-translate
// const axios = require("axios");

// const options = {
//   method: 'POST',
//   url: 'https://ai-translate.p.rapidapi.com/translates',
//   headers: {
//     'content-type': 'application/json',
//     'X-RapidAPI-Key': 'a8bf900b67msh9320c0c4a3c035fp1be8b1jsnf1bfaa1f3fe5',
//     'X-RapidAPI-Host': 'ai-translate.p.rapidapi.com'
//   },
//   data: '{"texts":["hello. world!","<b>hello. google!</b>","<i>hello. rapidapi!</i>"],"tls":["zh","ru"],"sl":"en"}'
// };

// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });

// https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/microsoft-translator-text
// https://rapidapi.com/community/api/urban-dictionary/
@Injectable()
export class DictionaryService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async getMeaningByPrase(texts: string[], tls: string[] = ['vi'], sl = 'en') {
    const observable = this.httpService.post<{ texts: string[] }[]>(
      this.configService.getOrThrow('translationEndpoint'),
      {
        texts,
        tls,
        sl,
      },
      {
        headers: {
          'X-RapidAPI-Key': this.configService.getOrThrow('rapidApiKey'),
        },
      },
    );
    const meanings = (await firstValueFrom(observable)).data
      .flatMap((item) => item.texts)
      .flat();
    return meanings;
  }

  async getPhoneticByPrase(phrase = '') {
    if (phrase) {
      const tokens = phrase.split(' ');
      const promises = tokens.map(async (token) => {
        const observable = this.httpService.get<{ phonetic: string }[]>(
          `${this.configService.getOrThrow('phoneticEndpoint')}/${token}`,
        );
        return (await firstValueFrom(observable)).data[0]?.phonetic;
      });

      const phonetics = await Promise.all(promises);
      return phonetics.join(' ');
    }

    return null;
  }

  async getExamples(term: string) {
    const observable = this.httpService.get<{ list: IExample[] }>(
      this.configService.getOrThrow('EXAMPLE_ENDPOINT'),

      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        },
        params: { term },
      },
    );
    return (await firstValueFrom(observable)).data?.list || [];
  }
}
