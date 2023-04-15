import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';
import { CreateTopicBookmarkDto } from 'src/bookmark/dto/create-topic-bookmark.dto';

@Controller('bookmark')
@ApiTags('Bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('vocab')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo bookmark cho từ vựng',
  })
  @ApiResponseProperty({
    example: {
      id: 'HS10hYdOQNNEVAWe59xW',
      createdAt: '2023-04-10T16:56:56.746Z',
      phraseId: 'v5zECj4ydoGYkSc7t9Yi',
      userId: '2nMxHaVZJuSXuoKzw4MoELswKxH3',
    },
  })
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @User() user: UserRecord,
  ) {
    return this.bookmarkService.create(createBookmarkDto, user);
  }

  @Get('vocab')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy bookmark cho từ vựng của user',
  })
  @ApiResponseProperty({
    example: [
      {
        id: 'HS10hYdOQNNEVAWe59xW',
        createdAt: '2023-04-10T16:56:56.746Z',
        phraseId: 'v5zECj4ydoGYkSc7t9Yi',
        userId: '2nMxHaVZJuSXuoKzw4MoELswKxH3',
        phrase: {
          id: 'v5zECj4ydoGYkSc7t9Yi',
          createdAt: '2023-04-09T01:19:23.925Z',
          topicId: 'YZ5P40c74WjxRcREqDcf',
          phrase: 'online shopping platform',
          examples: [
            {
              sentence:
                'Sometimes I find better deals on online shopping platforms than in physical stores.',
            },
          ],
          translations: [
            {
              meaning: 'trang mua sắm trực tuyến',
            },
          ],
          updatedAt: '2023-04-09T01:19:23.925Z',
          phonetic: '/ˌɒnˈlaɪn ˈʃɒpɪŋ ˈplætfɔːm/',
        },
      },
      {
        id: 'LpD1BQPm4e7NWEkLAZcT',
        createdAt: '2023-04-12T06:48:46.578Z',
        phraseId: 'hNa1hBQLfNZBh8fYTUOw',
        userId: '2nMxHaVZJuSXuoKzw4MoELswKxH3',
        phrase: {
          id: 'hNa1hBQLfNZBh8fYTUOw',
          createdAt: '2022-12-11T15:16:19.268Z',
          topicId: 'GTQD3b84dBIq3eoUICIF',
          phrase: 'adventure',
          examples: [
            {
              sentence: 'Avatar is the best of adventure movies ever.',
            },
          ],
          translations: [
            {
              meaning: 'phiêu lưu',
            },
          ],
          phonetic: '/ədˈventʃə(r)/',
          updatedAt: '2023-04-09T07:11:33.130Z',
        },
      },
    ],
  })
  findAll(@User() user: UserRecord) {
    return this.bookmarkService.findAll(user);
  }

  @Get('vocab/:id')
  @ApiOperation({
    summary: 'Lấy chi tiết bookmark',
  })
  @ApiResponseProperty({
    example: {
      id: 'LpD1BQPm4e7NWEkLAZcT',
      createdAt: '2023-04-12T06:48:46.578Z',
      phraseId: 'hNa1hBQLfNZBh8fYTUOw',
      userId: '2nMxHaVZJuSXuoKzw4MoELswKxH3',
      phrase: {
        id: 'hNa1hBQLfNZBh8fYTUOw',
        createdAt: '2022-12-11T15:16:19.268Z',
        topicId: 'GTQD3b84dBIq3eoUICIF',
        phrase: 'adventure',
        examples: [
          {
            sentence: 'Avatar is the best of adventure movies ever.',
          },
        ],
        translations: [
          {
            meaning: 'phiêu lưu',
          },
        ],
        phonetic: '/ədˈventʃə(r)/',
        updatedAt: '2023-04-09T07:11:33.130Z',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(id);
  }

  @Delete('vocab/:id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xoá bookmark',
  })
  @ApiResponseProperty({
    example: true,
  })
  remove(@Param('id') id: string, @User() user: UserRecord) {
    return this.bookmarkService.remove(id, user);
  }

  // ? Section for topic
  @Post('topic')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo bookmark cho chủ đề',
  })
  @ApiResponseProperty({
    example: {
      userId: '2nMxHaVZJuSXuoKzw4MoELswKxH3',
      topicId: 'GTQD3b84dBIq3eoUICIF',
      createdAt: '2023-04-15T03:21:47.626Z',
      id: 'kNcCILune500lPPWGm7F',
    },
  })
  createTopicBookmark(
    @Body() createBookmarkDto: CreateTopicBookmarkDto,
    @User() user: UserRecord,
  ) {
    return this.bookmarkService.createTopicBookmark(createBookmarkDto, user);
  }

  @Get('topic')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy bookmark cho chủ đề của user',
  })
  @ApiResponseProperty({
    example: [
      {
        id: 'kNcCILune500lPPWGm7F',
        createdAt: '2023-04-15T03:21:47.626Z',
        topicId: 'GTQD3b84dBIq3eoUICIF',
        userId: '2nMxHaVZJuSXuoKzw4MoELswKxH3',
        topic: {
          id: 'GTQD3b84dBIq3eoUICIF',
          levelId: 'RA9HlzOCHavBC7UTVHjO',
          name: 'Movies',
          categoryId: 'GnzIHVQrtoBEyefk7FD9',
          description:
            'In this topic, you will learn how to talk about movies, share with people your opinion about your favorite ones, explore new movies from different genres and countries. Moreover, you will learn to ask someone about their preferences in watching movies.',
          imageURL:
            'https://firebasestorage.googleapis.com/v0/b/centalki.appspot.com/o/public%2Fmovie.jpeg?alt=media&token=8ce8932e-3d7e-4bba-a9c2-0a87b73c4927',
          level: {
            id: 'RA9HlzOCHavBC7UTVHjO',
            code: 'A2',
            name: 'Pre Intermediate',
          },
          category: {
            id: 'GnzIHVQrtoBEyefk7FD9',
            name: 'Entertainment',
          },
          questions: [
            {
              id: '5WTFc2Rx0e63uxKjUWO4',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Do you like watching movies alone or with your friends?',
              answers: [
                {
                  answer:
                    'I like watching movies with my friends, because I usually want to share my thoughts about the movies.',
                },
                {
                  answer:
                    'I only want to watch them with my friends when I go to the theater. When I watch movies at home, I prefer watching alone.',
                },
                {
                  answer:
                    'I prefer watching movies alone. I don’t want to be disturbed.',
                },
              ],
            },
            {
              id: 'KCcGGIJVPH7mx6aGrl70',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Do you enjoy watching movies at movie theaters or at home?',
              answers: [
                {
                  answer:
                    'I enjoy watching movies in the theater, because I can watch it as soon as it is released, and I can hang out with my friends, too.',
                },
                {
                  answer:
                    'I prefer watching movies at home more. The theater is too crowded for me, and I don’t like the loud sound effects in the theater.',
                },
                {
                  answer:
                    'It depends. I usually watch all kinds of movies with my friends in the theater. But if they want to have a party too, then staying and watching movies at home is a better choice, since you cannot bring food into the theater.',
                },
              ],
            },
            {
              id: 'QKg6c9mE8ROWlJ8sq5t8',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'Who is your favorite movie star? Why?',
              answers: [
                {
                  answer:
                    'The movie star that I like the most is Stephanie Hsu. She has gotten a lot of attention thanks to a movie recently. Despite being new to the movie industry, she performed extremely well in that movie.',
                },
                {
                  answer:
                    'Michelle Yeoh is my favorite movie star. Even at the age of 60, she still participates in a lot of movies. She even won an Oscar award this year.',
                },
              ],
            },
            {
              id: 'Qv3ApayeV0RusQeqLlR6',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'Would you like to be in a movie someday?',
              answers: [
                {
                  answer:
                    'Of course I do. But I only want minor roles in the movie. I am not good at acting.',
                },
                {
                  answer:
                    'I would love to. My dream is to become an actor. Sadly, my parents didn’t allow me to do so. But I always have a role in all the shows  in college.',
                },
                {
                  answer:
                    'No, I don’t. I prefer watching movies rather than being in the movie.',
                },
              ],
            },
            {
              id: 'SDHmYuhdcmOHsAlpwG63',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'How often do you go to a cinema/theater?',
              answers: [
                {
                  answer:
                    'I go to the theater every weekend. I love watching movies on big screens.',
                },
                {
                  answer:
                    'Once or twice a month at most, I don’t like watching movies that much, so I only go if there is a really good movie.',
                },
                {
                  answer:
                    'I only go to the theater a few times a year. I usually wait a few months to watch the movie online, since I rarely find any movie worth watching that soon, and I want to go with my friends, too.',
                },
              ],
            },
            {
              id: 'XIrPlEgY5zibp9g7C46C',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Do people in your country like to go to the cinema/movie theater?',
              answers: [
                {
                  answer:
                    'In the past, going to the movie theater was not cheap to most people. Now, almost everyone has gone to the theater at least once. But most people still enjoy watching movies at home.',
                },
                {
                  answer:
                    'In where I am from, people really like to go to the movie theater. It is like their every day basis, like going to the park, or going to the supermarket.',
                },
              ],
            },
            {
              id: 'dagemSwtGPcdxE9gGp87',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'When was the last time you went to the movie theater?',
              answers: [
                {
                  answer:
                    'The last time I was in a movie theater was in 2022. I have been very busy lately so I don’t have time to go and watch any new movies since then.',
                },
                {
                  answer:
                    'Just yesterday, there was a new movie in which one of my favorite actors has a major role. I went to watch it with my boyfriend.',
                },
                {
                  answer:
                    'I can’t remember to be honest. It must be somewhere in 2020. I am slowly losing my interest in movie theater. Now I enjoy watching TV shows on Netflix more.',
                },
              ],
            },
            {
              id: 'h4oQEP2zzwjowJjMavML',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'Do you like watching movies?',
              answers: [
                {
                  answer:
                    'Of course I do. I watch movies every evening until I go to bed.',
                },
                {
                  answer:
                    'I like watching movies, but I only watch really famous ones, or only on special occasions.',
                },
                {
                  answer:
                    'I don’t really like watching movies. I love listening to music more. I only go if someone invites me.',
                },
              ],
            },
            {
              id: 'hq7Urfm8dD1jqffaumHe',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'What are your favorite genres of movies?',
              answers: [
                {
                  answer:
                    'I love watching science fiction movies. I love seeing futuristic cities, spaceship battles with lasers, and advanced technologies.',
                },
                {
                  answer:
                    'I prefer watching detective movies. They make me feel excited and sometimes I learn new and useful knowledge from them.',
                },
                {
                  answer:
                    'I like watching fantasy movies. I love seeing magic, mythical creatures like dragons, phoenix on the big screen.',
                },
              ],
            },
            {
              id: 'i8TiF2JsNlLuvHXnO5Rs',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'Do you enjoy watching horror movies?',
              answers: [
                {
                  answer: 'Of course I do. I love the feeling of jump scares.',
                },
                {
                  answer:
                    'No, not really. But I love seeing people being scared while watching them.',
                },
                {
                  answer:
                    'No I don’t. it is simply because the stories are too easy to guess.',
                },
              ],
            },
            {
              id: 'ifx3YeuPpJIFfD8aIjPH',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Do you prefer foreign movies or movies made in your country?',
              answers: [
                {
                  answer:
                    'I prefer movies made in my country. I always watch them when I have the chance as a way to encourage them to make more movies, to help the movie industry in my country grow stronger.',
                },
                {
                  answer:
                    'I usually watch foreign movies, but if a movie made in my country receives good reviews, I will also watch them.',
                },
                {
                  answer:
                    'I don’t like watching movies made in my country. They are overall bad, even some of them are good, they are nowhere near the quality of foreign movies, while the ticket prices are the same.',
                },
              ],
            },
            {
              id: 'koKSADfIi89RAVWYj7yo',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'What is your favorite movie of all time?',
              answers: [
                {
                  answer:
                    'To me, it is a movie called “Everything Everywhere All At Once” released in 2022. It is excellent and received a lot of good reviews from experts and the audience. The actors are all great, the story is well-written, the message is heart-touching. It even wins so many awards in the Oscar.',
                },
                {
                  answer:
                    'My favorite movie is Avengers Endgame. It is a superhero movie, and it concludes the entire 10 years of its own series, like a final episode. All the characters, the stories, connected and went into one movie that lasts 3 hours. Everyone was so excited by the time it was released. People screamed and applauded in almost every scene of the movie.',
                },
              ],
            },
            {
              id: 'oWwY2exmPfZ5eLT4ZM3G',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Tell me about the first time you went to the movie theater.',
              answers: [
                {
                  answer:
                    'The first time I went to the movie theater was in 2018. The movie was Avengers - Infinity War. When the movie was released, everyone talked about it and wanted to watch it. I had to book a ticket weeks before the release date, and I could barely find a seat. I remember the theater was full for 3 days straight. The movie was really good. It is one of my favorites, even after all these years.',
                },
                {
                  answer:
                    "April 2016 was the first time I went to a movie theater. I went there on a date after having a meal with my girlfriend. The movie was really good in my opinion but it was not popular at the time it was released, so there were only a couple of people. I remember the feeling when I entered the theater for the first time. The screen is so big, the sound is very realistic. I didn't think it could be that good, it feels much better than watching movies on TV at home.",
                },
              ],
            },
          ],
          phrases: [
            {
              id: 'bzl0frLTuyFJQbuVMvSr',
              createdAt: '2022-12-11T15:16:06.669Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'action',
              examples: [
                {
                  sentence: 'I like films with plenty of action.',
                },
              ],
              translations: [
                {
                  meaning: 'hành động',
                },
              ],
              phonetic: '/ˈækʃn/',
              updatedAt: '2023-04-09T07:03:18.764Z',
            },
            {
              id: 'hNa1hBQLfNZBh8fYTUOw',
              createdAt: '2022-12-11T15:16:19.268Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'adventure',
              examples: [
                {
                  sentence: 'Avatar is the best of adventure movies ever.',
                },
              ],
              translations: [
                {
                  meaning: 'phiêu lưu',
                },
              ],
              phonetic: '/ədˈventʃə(r)/',
              updatedAt: '2023-04-09T07:11:33.130Z',
            },
            {
              id: 'q6EZp3BiJc0ZyQNyDTJD',
              createdAt: '2022-12-11T15:16:29.582Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    'The audience were very excited when the main actor appears.',
                },
              ],
              phrase: 'audience',
              translations: [
                {
                  meaning: 'khán giả',
                },
              ],
              phonetic: '/ˈɔːdiəns/',
              updatedAt: '2023-04-09T10:35:36.330Z',
            },
            {
              id: '5gEkuggexwYX3Qtv9eyF',
              createdAt: '2022-12-11T15:16:41.103Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/kɑːˈtuːn/',
              phrase: 'cartoon',
              examples: [
                {
                  sentence: 'I usually spend my Saturdays watching cartoons.',
                },
              ],
              translations: [
                {
                  meaning: 'hoạt hình',
                },
              ],
              updatedAt: '2022-12-11T15:16:41.103Z',
            },
            {
              id: 'xXIZZvR2YgcbfjZ1f8Pn',
              createdAt: '2022-12-11T15:16:50.702Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'The main character of this movie is Superman.',
                },
              ],
              phrase: 'character',
              translations: [
                {
                  meaning: 'nhân vật',
                },
              ],
              phonetic: '/ˈkærəktə(r)/',
              updatedAt: '2023-04-09T11:01:09.335Z',
            },
            {
              id: 'DBKBEUy1wY4sCNYW9bkr',
              createdAt: '2022-12-11T15:16:58.823Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/ˈkɒmədi/',
              examples: [
                {
                  sentence: 'They spent hours watching comedy on television.',
                },
              ],
              phrase: 'comedy',
              translations: [
                {
                  meaning: 'hài kịch',
                },
              ],
              updatedAt: '2022-12-11T15:16:58.823Z',
            },
            {
              id: 'CnDvwmtLCp3m5lUHY78y',
              createdAt: '2022-12-11T15:17:09.468Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'detective story',
              examples: [
                {
                  sentence:
                    'The Adventures Of Sherlock Holmes is one of the best detective story movies.',
                },
              ],
              translations: [
                {
                  meaning: 'truyện trinh thám',
                },
              ],
              phonetic: '/dɪˈtektɪv stɔːri/',
              updatedAt: '2023-04-09T04:10:43.699Z',
            },
            {
              id: 'NL08fYy10WFIhiLJ10tZ',
              createdAt: '2022-12-11T15:17:24.864Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    'My grandfather watchs a documentary film about World War every weekends',
                },
              ],
              phrase: 'documentary film',
              translations: [
                {
                  meaning: 'phim tài liệu',
                },
              ],
              phonetic: '/ˌdɒkjuˈmentri fɪlm/',
              updatedAt: '2023-04-09T05:48:22.859Z',
            },
            {
              id: 'luwt7Z1QNIqOpKFHGUYh',
              createdAt: '2022-12-11T15:17:35.680Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'Gone with the Wind is a popular romance drama.',
                },
              ],
              phrase: 'drama',
              translations: [
                {
                  meaning: 'kịch',
                },
              ],
              phonetic: '/ˈdrɑːmə/',
              updatedAt: '2023-04-09T09:59:02.223Z',
            },
            {
              id: 'eOLvzqawt1OxzFPsyNXN',
              createdAt: '2022-12-11T15:17:44.045Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'I am a fan of horror films.',
                },
              ],
              phrase: 'horror',
              translations: [
                {
                  meaning: 'rùng rợn',
                },
              ],
              phonetic: '/ˈhɒrə(r)/',
              updatedAt: '2023-04-09T07:07:30.201Z',
            },
            {
              id: 'chm7TZgOVP8LbZ5p3cp3',
              createdAt: '2022-12-11T15:17:54.460Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    'I have watched a few science fiction moives this semester.',
                },
              ],
              phrase: 'science fiction',
              translations: [
                {
                  meaning: 'khoa học viễn tưởng',
                },
              ],
              phonetic: '/ˌsaɪəns ˈfɪkʃn/',
              updatedAt: '2023-04-09T07:04:28.125Z',
            },
            {
              id: '19AiLPnXHWJA92cXXQve',
              createdAt: '2022-12-11T15:18:04.718Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/siːn/',
              phrase: 'scene',
              examples: [
                {
                  sentence:
                    'The movie opens with a scene in a New York apartment.',
                },
              ],
              translations: [
                {
                  meaning: 'cảnh quay',
                },
              ],
              updatedAt: '2022-12-11T15:18:04.718Z',
            },
            {
              id: 'OKliV5d49aGClkVp1Hlh',
              createdAt: '2022-12-11T15:18:14.397Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'Iron man is my favorite hero.',
                },
              ],
              phrase: 'hero',
              translations: [
                {
                  meaning: 'anh hùng',
                },
              ],
              phonetic: '/ˈhɪərəʊ/',
              updatedAt: '2023-04-09T05:48:49.693Z',
            },
            {
              id: 'ZmhMu2dE5OUT6iI8xF7q',
              createdAt: '2022-12-11T15:18:23.557Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'heroine',
              examples: [
                {
                  sentence: 'Wonder woman is my favorite heroine.',
                },
              ],
              translations: [
                {
                  meaning: 'nữ anh hùng',
                },
              ],
              phonetic: '/ˈherəʊɪn/',
              updatedAt: '2023-04-09T06:59:43.880Z',
            },
            {
              id: 'OotTH0ulPftVZPPLCiIs',
              createdAt: '2022-12-11T15:18:41.051Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'Iron man is my favorite superhero.',
                },
              ],
              phrase: 'superhero',
              translations: [
                {
                  meaning: 'siêu anh hùng',
                },
              ],
              updatedAt: '2022-12-11T15:18:41.051Z',
              phonetic: '/ˈsuːpəhɪərəʊ/',
            },
            {
              id: 'MWjhfnq6IpN1wmnUpMla',
              createdAt: '2022-12-11T15:18:52.116Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'to start with',
              examples: [
                {
                  sentence:
                    'The movice starts with a dramatic fight scene between the two brothers.',
                },
              ],
              translations: [
                {
                  meaning: 'bắt đầu với',
                },
              ],
              updatedAt: '2022-12-11T15:18:52.116Z',
              phonetic: '/stɑːt wɪð/',
            },
            {
              id: 'fOLZ6Z3kg3KxR5heKpAH',
              createdAt: '2022-12-11T15:19:08.735Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'after that',
              examples: [
                {
                  sentence:
                    'The woman was very happy, but after that the smile left her face.',
                },
              ],
              translations: [
                {
                  meaning: 'sau đó',
                },
              ],
              phonetic: '/ˈɑːftə(r) ðæt/',
              updatedAt: '2023-04-09T07:08:24.796Z',
            },
            {
              id: 'ZAKUTbOocpbkas54y5aE',
              createdAt: '2022-12-11T15:19:26.076Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'at the end',
              examples: [
                {
                  sentence: 'They finally make peace at the end of the movie.',
                },
              ],
              translations: [
                {
                  meaning: 'cuối cùng',
                },
              ],
              phonetic: '/æt ði end/',
              updatedAt: '2023-04-09T06:58:00.128Z',
            },
            {
              id: 'bRfftXSa834WmQ8BPKdv',
              createdAt: '2022-12-11T15:19:38.814Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    'The students were able to go behind the scenes to see how programmes are made.',
                },
              ],
              phrase: 'behind the scenes',
              translations: [
                {
                  meaning: 'hậu trường',
                },
              ],
              phonetic: '/bɪˈhaɪnd ðə siːn/',
              updatedAt: '2023-04-09T07:02:12.191Z',
            },
            {
              id: 'v8BTOuqd9nQ1K0AWxaZ0',
              createdAt: '2022-12-11T15:19:50.875Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    "Marvel's trailer is the thing you should not believe.",
                },
              ],
              phrase: 'trailer',
              translations: [
                {
                  meaning: 'giới thiệu tóm tắt',
                },
              ],
              phonetic: '/ˈtreɪlə(r)/',
              updatedAt: '2023-04-09T10:57:39.679Z',
            },
            {
              id: 'LF4tMUoWt2VvWNBteQlB',
              createdAt: '2022-12-11T15:20:14.976Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'credit',
              examples: [
                {
                  sentence: 'We left before the final credits began to roll.',
                },
              ],
              translations: [
                {
                  meaning:
                    'Đoạn cuối phim giới thiệu về các diễn viên hoặc đạo diễn, nhà biên kịch,…',
                },
              ],
              phonetic: '/ˈkredɪt/',
              updatedAt: '2023-04-09T05:27:16.931Z',
            },
            {
              id: 'Gx9XyYUJYe7nfDdPHmtY',
              createdAt: '2023-04-08T09:47:28.946Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'detective',
              examples: [
                {
                  sentence:
                    'She loves watching detective movies, especially those with complex plots and unexpected twists.',
                },
              ],
              translations: [
                {
                  meaning: 'trinh thám',
                },
              ],
              updatedAt: '2023-04-08T09:47:28.946Z',
              phonetic: '/dɪˈtektɪv/',
            },
            {
              id: 'OcHwN5tdLPwDlhRe2fiN',
              createdAt: '2023-04-08T10:01:35.899Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'role',
              examples: [
                {
                  sentence: 'She plays the lead role in the upcoming movie.',
                },
              ],
              translations: [
                {
                  meaning: 'vai diễn',
                },
              ],
              updatedAt: '2023-04-08T10:01:35.899Z',
              phonetic: '/roʊl/',
            },
            {
              id: 'cXhd8H0fyd9pX1UUAdGc',
              createdAt: '2023-04-08T13:16:05.043Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'actor',
              examples: [
                {
                  sentence: 'She wishes to become a famous actor in Hollywood.',
                },
              ],
              translations: [
                {
                  meaning: 'diễn viên',
                },
              ],
              phonetic: '/ˈæktə(r)/',
              updatedAt: '2023-04-09T07:03:55.917Z',
            },
            {
              id: 'eDrNdyGAP4bKQwODDUfC',
              createdAt: '2023-04-08T13:19:51.497Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'release',
              examples: [
                {
                  sentence:
                    'No one went to see the new movie, because it was released in the middle of the global pandemic.',
                },
              ],
              translations: [
                {
                  meaning: 'ra mắt, phát hành',
                },
              ],
              updatedAt: '2023-04-08T13:19:51.497Z',
              phonetic: '/rɪˈliːs/',
            },
            {
              id: 'aaHnJqhfZD5hrn3IzDXI',
              createdAt: '2023-04-08T13:21:10.210Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'ticket',
              examples: [
                {
                  sentence: 'He bought a ticket for the movie next Saturday.',
                },
              ],
              translations: [
                {
                  meaning: 'vé xem phim',
                },
              ],
              updatedAt: '2023-04-08T13:21:10.210Z',
              phonetic: '/ˈtɪkɪt/',
            },
            {
              id: 'rz3rN2VZBDqmOiqhkKuO',
              createdAt: '2023-04-08T13:27:51.255Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'movie industry',
              examples: [
                {
                  sentence:
                    "Many talented Vietnamese filmmakers and actors have appeared in recent years, contributing to the success of the country's movie industry.",
                },
              ],
              translations: [
                {
                  meaning: 'ngành công nghiệp điện ảnh',
                },
              ],
              phonetic: '/ˈmuːvi ˈɪndəstri/',
              updatedAt: '2023-04-09T10:39:52.400Z',
            },
            {
              id: 'MEayHYMVkz4bQdwQBO3q',
              createdAt: '2023-04-08T14:15:26.754Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/skrɪpt/',
              phrase: 'script',
              examples: [
                {
                  sentence:
                    'The writer spent weeks working on the script for the new movie.',
                },
                {
                  sentence:
                    'The director made several changes to the original script to improve the pacing of the film.',
                },
              ],
              translations: [
                {
                  meaning: 'kịch bản',
                },
              ],
              updatedAt: '2023-04-08T14:15:26.754Z',
            },
            {
              id: 'hZ7sRuvru79knfSC0Xeq',
              createdAt: '2023-04-08T14:20:11.650Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'episode',
              examples: [
                {
                  sentence:
                    'The final episode of the TV series had an unexpected and thrilling ending.',
                },
              ],
              translations: [
                {
                  meaning: 'tập phim',
                },
              ],
              phonetic: '/ˈepɪsəʊd/',
              updatedAt: '2023-04-09T07:12:12.355Z',
            },
            {
              id: 'hJy1z3Sq2zNb2ZM3diTZ',
              createdAt: '2023-04-08T14:40:52.738Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'thriller movie',
              examples: [
                {
                  sentence:
                    'We decided to have a movie night and picked a thriller movie to add some excitement to the evening.',
                },
                {
                  sentence:
                    'She loves watching thriller movies late at night with all the lights off to create a spooky atmosphere.',
                },
              ],
              translations: [
                {
                  meaning: 'phim giật gân',
                },
              ],
              updatedAt: '2023-04-08T14:40:52.738Z',
              phonetic: '/ˈθrɪlə(r) ˈmuːvi/',
            },
            {
              id: 'BSkEBzWX4YBtAgti4ONr',
              createdAt: '2023-04-08T15:07:49.837Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/ˈbreɪkdaʊn/',
              phrase: 'breakdown',
              examples: [
                {
                  sentence:
                    'He provided a detailed breakdown of the movie we watched together last week.',
                },
                {
                  sentence:
                    "Tom always watched breakdown videos about any movie that he enjoys to make sure he didn't miss any detail.",
                },
              ],
              translations: [
                {
                  meaning: 'phân tích',
                },
              ],
              updatedAt: '2023-04-08T15:07:49.837Z',
            },
          ],
        },
      },
    ],
  })
  findAllTopicBookmark(@User() user: UserRecord) {
    return this.bookmarkService.findAllTopicBookmark(user);
  }

  @Get('topic/:id')
  @ApiOperation({
    summary: 'Lấy chi tiết bookmark',
  })
  @ApiResponseProperty({
    example: {
      id: 'kNcCILune500lPPWGm7F',
      createdAt: '2023-04-15T03:21:47.626Z',
      topicId: 'GTQD3b84dBIq3eoUICIF',
      userId: '2nMxHaVZJuSXuoKzw4MoELswKxH3',
      topic: {
        data: {
          id: 'GTQD3b84dBIq3eoUICIF',
          levelId: 'RA9HlzOCHavBC7UTVHjO',
          name: 'Movies',
          categoryId: 'GnzIHVQrtoBEyefk7FD9',
          description:
            'In this topic, you will learn how to talk about movies, share with people your opinion about your favorite ones, explore new movies from different genres and countries. Moreover, you will learn to ask someone about their preferences in watching movies.',
          imageURL:
            'https://firebasestorage.googleapis.com/v0/b/centalki.appspot.com/o/public%2Fmovie.jpeg?alt=media&token=8ce8932e-3d7e-4bba-a9c2-0a87b73c4927',
          level: {
            id: 'RA9HlzOCHavBC7UTVHjO',
            code: 'A2',
            name: 'Pre Intermediate',
          },
          category: {
            id: 'GnzIHVQrtoBEyefk7FD9',
            name: 'Entertainment',
          },
          questions: [
            {
              id: '5WTFc2Rx0e63uxKjUWO4',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Do you like watching movies alone or with your friends?',
              answers: [
                {
                  answer:
                    'I like watching movies with my friends, because I usually want to share my thoughts about the movies.',
                },
                {
                  answer:
                    'I only want to watch them with my friends when I go to the theater. When I watch movies at home, I prefer watching alone.',
                },
                {
                  answer:
                    'I prefer watching movies alone. I don’t want to be disturbed.',
                },
              ],
            },
            {
              id: 'KCcGGIJVPH7mx6aGrl70',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Do you enjoy watching movies at movie theaters or at home?',
              answers: [
                {
                  answer:
                    'I enjoy watching movies in the theater, because I can watch it as soon as it is released, and I can hang out with my friends, too.',
                },
                {
                  answer:
                    'I prefer watching movies at home more. The theater is too crowded for me, and I don’t like the loud sound effects in the theater.',
                },
                {
                  answer:
                    'It depends. I usually watch all kinds of movies with my friends in the theater. But if they want to have a party too, then staying and watching movies at home is a better choice, since you cannot bring food into the theater.',
                },
              ],
            },
            {
              id: 'QKg6c9mE8ROWlJ8sq5t8',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'Who is your favorite movie star? Why?',
              answers: [
                {
                  answer:
                    'The movie star that I like the most is Stephanie Hsu. She has gotten a lot of attention thanks to a movie recently. Despite being new to the movie industry, she performed extremely well in that movie.',
                },
                {
                  answer:
                    'Michelle Yeoh is my favorite movie star. Even at the age of 60, she still participates in a lot of movies. She even won an Oscar award this year.',
                },
              ],
            },
            {
              id: 'Qv3ApayeV0RusQeqLlR6',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'Would you like to be in a movie someday?',
              answers: [
                {
                  answer:
                    'Of course I do. But I only want minor roles in the movie. I am not good at acting.',
                },
                {
                  answer:
                    'I would love to. My dream is to become an actor. Sadly, my parents didn’t allow me to do so. But I always have a role in all the shows  in college.',
                },
                {
                  answer:
                    'No, I don’t. I prefer watching movies rather than being in the movie.',
                },
              ],
            },
            {
              id: 'SDHmYuhdcmOHsAlpwG63',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'How often do you go to a cinema/theater?',
              answers: [
                {
                  answer:
                    'I go to the theater every weekend. I love watching movies on big screens.',
                },
                {
                  answer:
                    'Once or twice a month at most, I don’t like watching movies that much, so I only go if there is a really good movie.',
                },
                {
                  answer:
                    'I only go to the theater a few times a year. I usually wait a few months to watch the movie online, since I rarely find any movie worth watching that soon, and I want to go with my friends, too.',
                },
              ],
            },
            {
              id: 'XIrPlEgY5zibp9g7C46C',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Do people in your country like to go to the cinema/movie theater?',
              answers: [
                {
                  answer:
                    'In the past, going to the movie theater was not cheap to most people. Now, almost everyone has gone to the theater at least once. But most people still enjoy watching movies at home.',
                },
                {
                  answer:
                    'In where I am from, people really like to go to the movie theater. It is like their every day basis, like going to the park, or going to the supermarket.',
                },
              ],
            },
            {
              id: 'dagemSwtGPcdxE9gGp87',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'When was the last time you went to the movie theater?',
              answers: [
                {
                  answer:
                    'The last time I was in a movie theater was in 2022. I have been very busy lately so I don’t have time to go and watch any new movies since then.',
                },
                {
                  answer:
                    'Just yesterday, there was a new movie in which one of my favorite actors has a major role. I went to watch it with my boyfriend.',
                },
                {
                  answer:
                    'I can’t remember to be honest. It must be somewhere in 2020. I am slowly losing my interest in movie theater. Now I enjoy watching TV shows on Netflix more.',
                },
              ],
            },
            {
              id: 'h4oQEP2zzwjowJjMavML',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'Do you like watching movies?',
              answers: [
                {
                  answer:
                    'Of course I do. I watch movies every evening until I go to bed.',
                },
                {
                  answer:
                    'I like watching movies, but I only watch really famous ones, or only on special occasions.',
                },
                {
                  answer:
                    'I don’t really like watching movies. I love listening to music more. I only go if someone invites me.',
                },
              ],
            },
            {
              id: 'hq7Urfm8dD1jqffaumHe',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'What are your favorite genres of movies?',
              answers: [
                {
                  answer:
                    'I love watching science fiction movies. I love seeing futuristic cities, spaceship battles with lasers, and advanced technologies.',
                },
                {
                  answer:
                    'I prefer watching detective movies. They make me feel excited and sometimes I learn new and useful knowledge from them.',
                },
                {
                  answer:
                    'I like watching fantasy movies. I love seeing magic, mythical creatures like dragons, phoenix on the big screen.',
                },
              ],
            },
            {
              id: 'i8TiF2JsNlLuvHXnO5Rs',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'Do you enjoy watching horror movies?',
              answers: [
                {
                  answer: 'Of course I do. I love the feeling of jump scares.',
                },
                {
                  answer:
                    'No, not really. But I love seeing people being scared while watching them.',
                },
                {
                  answer:
                    'No I don’t. it is simply because the stories are too easy to guess.',
                },
              ],
            },
            {
              id: 'ifx3YeuPpJIFfD8aIjPH',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Do you prefer foreign movies or movies made in your country?',
              answers: [
                {
                  answer:
                    'I prefer movies made in my country. I always watch them when I have the chance as a way to encourage them to make more movies, to help the movie industry in my country grow stronger.',
                },
                {
                  answer:
                    'I usually watch foreign movies, but if a movie made in my country receives good reviews, I will also watch them.',
                },
                {
                  answer:
                    'I don’t like watching movies made in my country. They are overall bad, even some of them are good, they are nowhere near the quality of foreign movies, while the ticket prices are the same.',
                },
              ],
            },
            {
              id: 'koKSADfIi89RAVWYj7yo',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question: 'What is your favorite movie of all time?',
              answers: [
                {
                  answer:
                    'To me, it is a movie called “Everything Everywhere All At Once” released in 2022. It is excellent and received a lot of good reviews from experts and the audience. The actors are all great, the story is well-written, the message is heart-touching. It even wins so many awards in the Oscar.',
                },
                {
                  answer:
                    'My favorite movie is Avengers Endgame. It is a superhero movie, and it concludes the entire 10 years of its own series, like a final episode. All the characters, the stories, connected and went into one movie that lasts 3 hours. Everyone was so excited by the time it was released. People screamed and applauded in almost every scene of the movie.',
                },
              ],
            },
            {
              id: 'oWwY2exmPfZ5eLT4ZM3G',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              question:
                'Tell me about the first time you went to the movie theater.',
              answers: [
                {
                  answer:
                    'The first time I went to the movie theater was in 2018. The movie was Avengers - Infinity War. When the movie was released, everyone talked about it and wanted to watch it. I had to book a ticket weeks before the release date, and I could barely find a seat. I remember the theater was full for 3 days straight. The movie was really good. It is one of my favorites, even after all these years.',
                },
                {
                  answer:
                    "April 2016 was the first time I went to a movie theater. I went there on a date after having a meal with my girlfriend. The movie was really good in my opinion but it was not popular at the time it was released, so there were only a couple of people. I remember the feeling when I entered the theater for the first time. The screen is so big, the sound is very realistic. I didn't think it could be that good, it feels much better than watching movies on TV at home.",
                },
              ],
            },
          ],
          phrases: [
            {
              id: 'bzl0frLTuyFJQbuVMvSr',
              createdAt: '2022-12-11T15:16:06.669Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'action',
              examples: [
                {
                  sentence: 'I like films with plenty of action.',
                },
              ],
              translations: [
                {
                  meaning: 'hành động',
                },
              ],
              phonetic: '/ˈækʃn/',
              updatedAt: '2023-04-09T07:03:18.764Z',
            },
            {
              id: 'hNa1hBQLfNZBh8fYTUOw',
              createdAt: '2022-12-11T15:16:19.268Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'adventure',
              examples: [
                {
                  sentence: 'Avatar is the best of adventure movies ever.',
                },
              ],
              translations: [
                {
                  meaning: 'phiêu lưu',
                },
              ],
              phonetic: '/ədˈventʃə(r)/',
              updatedAt: '2023-04-09T07:11:33.130Z',
            },
            {
              id: 'q6EZp3BiJc0ZyQNyDTJD',
              createdAt: '2022-12-11T15:16:29.582Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    'The audience were very excited when the main actor appears.',
                },
              ],
              phrase: 'audience',
              translations: [
                {
                  meaning: 'khán giả',
                },
              ],
              phonetic: '/ˈɔːdiəns/',
              updatedAt: '2023-04-09T10:35:36.330Z',
            },
            {
              id: '5gEkuggexwYX3Qtv9eyF',
              createdAt: '2022-12-11T15:16:41.103Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/kɑːˈtuːn/',
              phrase: 'cartoon',
              examples: [
                {
                  sentence: 'I usually spend my Saturdays watching cartoons.',
                },
              ],
              translations: [
                {
                  meaning: 'hoạt hình',
                },
              ],
              updatedAt: '2022-12-11T15:16:41.103Z',
            },
            {
              id: 'xXIZZvR2YgcbfjZ1f8Pn',
              createdAt: '2022-12-11T15:16:50.702Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'The main character of this movie is Superman.',
                },
              ],
              phrase: 'character',
              translations: [
                {
                  meaning: 'nhân vật',
                },
              ],
              phonetic: '/ˈkærəktə(r)/',
              updatedAt: '2023-04-09T11:01:09.335Z',
            },
            {
              id: 'DBKBEUy1wY4sCNYW9bkr',
              createdAt: '2022-12-11T15:16:58.823Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/ˈkɒmədi/',
              examples: [
                {
                  sentence: 'They spent hours watching comedy on television.',
                },
              ],
              phrase: 'comedy',
              translations: [
                {
                  meaning: 'hài kịch',
                },
              ],
              updatedAt: '2022-12-11T15:16:58.823Z',
            },
            {
              id: 'CnDvwmtLCp3m5lUHY78y',
              createdAt: '2022-12-11T15:17:09.468Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'detective story',
              examples: [
                {
                  sentence:
                    'The Adventures Of Sherlock Holmes is one of the best detective story movies.',
                },
              ],
              translations: [
                {
                  meaning: 'truyện trinh thám',
                },
              ],
              phonetic: '/dɪˈtektɪv stɔːri/',
              updatedAt: '2023-04-09T04:10:43.699Z',
            },
            {
              id: 'NL08fYy10WFIhiLJ10tZ',
              createdAt: '2022-12-11T15:17:24.864Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    'My grandfather watchs a documentary film about World War every weekends',
                },
              ],
              phrase: 'documentary film',
              translations: [
                {
                  meaning: 'phim tài liệu',
                },
              ],
              phonetic: '/ˌdɒkjuˈmentri fɪlm/',
              updatedAt: '2023-04-09T05:48:22.859Z',
            },
            {
              id: 'luwt7Z1QNIqOpKFHGUYh',
              createdAt: '2022-12-11T15:17:35.680Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'Gone with the Wind is a popular romance drama.',
                },
              ],
              phrase: 'drama',
              translations: [
                {
                  meaning: 'kịch',
                },
              ],
              phonetic: '/ˈdrɑːmə/',
              updatedAt: '2023-04-09T09:59:02.223Z',
            },
            {
              id: 'eOLvzqawt1OxzFPsyNXN',
              createdAt: '2022-12-11T15:17:44.045Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'I am a fan of horror films.',
                },
              ],
              phrase: 'horror',
              translations: [
                {
                  meaning: 'rùng rợn',
                },
              ],
              phonetic: '/ˈhɒrə(r)/',
              updatedAt: '2023-04-09T07:07:30.201Z',
            },
            {
              id: 'chm7TZgOVP8LbZ5p3cp3',
              createdAt: '2022-12-11T15:17:54.460Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    'I have watched a few science fiction moives this semester.',
                },
              ],
              phrase: 'science fiction',
              translations: [
                {
                  meaning: 'khoa học viễn tưởng',
                },
              ],
              phonetic: '/ˌsaɪəns ˈfɪkʃn/',
              updatedAt: '2023-04-09T07:04:28.125Z',
            },
            {
              id: '19AiLPnXHWJA92cXXQve',
              createdAt: '2022-12-11T15:18:04.718Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/siːn/',
              phrase: 'scene',
              examples: [
                {
                  sentence:
                    'The movie opens with a scene in a New York apartment.',
                },
              ],
              translations: [
                {
                  meaning: 'cảnh quay',
                },
              ],
              updatedAt: '2022-12-11T15:18:04.718Z',
            },
            {
              id: 'OKliV5d49aGClkVp1Hlh',
              createdAt: '2022-12-11T15:18:14.397Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'Iron man is my favorite hero.',
                },
              ],
              phrase: 'hero',
              translations: [
                {
                  meaning: 'anh hùng',
                },
              ],
              phonetic: '/ˈhɪərəʊ/',
              updatedAt: '2023-04-09T05:48:49.693Z',
            },
            {
              id: 'ZmhMu2dE5OUT6iI8xF7q',
              createdAt: '2022-12-11T15:18:23.557Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'heroine',
              examples: [
                {
                  sentence: 'Wonder woman is my favorite heroine.',
                },
              ],
              translations: [
                {
                  meaning: 'nữ anh hùng',
                },
              ],
              phonetic: '/ˈherəʊɪn/',
              updatedAt: '2023-04-09T06:59:43.880Z',
            },
            {
              id: 'OotTH0ulPftVZPPLCiIs',
              createdAt: '2022-12-11T15:18:41.051Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence: 'Iron man is my favorite superhero.',
                },
              ],
              phrase: 'superhero',
              translations: [
                {
                  meaning: 'siêu anh hùng',
                },
              ],
              updatedAt: '2022-12-11T15:18:41.051Z',
              phonetic: '/ˈsuːpəhɪərəʊ/',
            },
            {
              id: 'MWjhfnq6IpN1wmnUpMla',
              createdAt: '2022-12-11T15:18:52.116Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'to start with',
              examples: [
                {
                  sentence:
                    'The movice starts with a dramatic fight scene between the two brothers.',
                },
              ],
              translations: [
                {
                  meaning: 'bắt đầu với',
                },
              ],
              updatedAt: '2022-12-11T15:18:52.116Z',
              phonetic: '/stɑːt wɪð/',
            },
            {
              id: 'fOLZ6Z3kg3KxR5heKpAH',
              createdAt: '2022-12-11T15:19:08.735Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'after that',
              examples: [
                {
                  sentence:
                    'The woman was very happy, but after that the smile left her face.',
                },
              ],
              translations: [
                {
                  meaning: 'sau đó',
                },
              ],
              phonetic: '/ˈɑːftə(r) ðæt/',
              updatedAt: '2023-04-09T07:08:24.796Z',
            },
            {
              id: 'ZAKUTbOocpbkas54y5aE',
              createdAt: '2022-12-11T15:19:26.076Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'at the end',
              examples: [
                {
                  sentence: 'They finally make peace at the end of the movie.',
                },
              ],
              translations: [
                {
                  meaning: 'cuối cùng',
                },
              ],
              phonetic: '/æt ði end/',
              updatedAt: '2023-04-09T06:58:00.128Z',
            },
            {
              id: 'bRfftXSa834WmQ8BPKdv',
              createdAt: '2022-12-11T15:19:38.814Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    'The students were able to go behind the scenes to see how programmes are made.',
                },
              ],
              phrase: 'behind the scenes',
              translations: [
                {
                  meaning: 'hậu trường',
                },
              ],
              phonetic: '/bɪˈhaɪnd ðə siːn/',
              updatedAt: '2023-04-09T07:02:12.191Z',
            },
            {
              id: 'v8BTOuqd9nQ1K0AWxaZ0',
              createdAt: '2022-12-11T15:19:50.875Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              examples: [
                {
                  sentence:
                    "Marvel's trailer is the thing you should not believe.",
                },
              ],
              phrase: 'trailer',
              translations: [
                {
                  meaning: 'giới thiệu tóm tắt',
                },
              ],
              phonetic: '/ˈtreɪlə(r)/',
              updatedAt: '2023-04-09T10:57:39.679Z',
            },
            {
              id: 'LF4tMUoWt2VvWNBteQlB',
              createdAt: '2022-12-11T15:20:14.976Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'credit',
              examples: [
                {
                  sentence: 'We left before the final credits began to roll.',
                },
              ],
              translations: [
                {
                  meaning:
                    'Đoạn cuối phim giới thiệu về các diễn viên hoặc đạo diễn, nhà biên kịch,…',
                },
              ],
              phonetic: '/ˈkredɪt/',
              updatedAt: '2023-04-09T05:27:16.931Z',
            },
            {
              id: 'Gx9XyYUJYe7nfDdPHmtY',
              createdAt: '2023-04-08T09:47:28.946Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'detective',
              examples: [
                {
                  sentence:
                    'She loves watching detective movies, especially those with complex plots and unexpected twists.',
                },
              ],
              translations: [
                {
                  meaning: 'trinh thám',
                },
              ],
              updatedAt: '2023-04-08T09:47:28.946Z',
              phonetic: '/dɪˈtektɪv/',
            },
            {
              id: 'OcHwN5tdLPwDlhRe2fiN',
              createdAt: '2023-04-08T10:01:35.899Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'role',
              examples: [
                {
                  sentence: 'She plays the lead role in the upcoming movie.',
                },
              ],
              translations: [
                {
                  meaning: 'vai diễn',
                },
              ],
              updatedAt: '2023-04-08T10:01:35.899Z',
              phonetic: '/roʊl/',
            },
            {
              id: 'cXhd8H0fyd9pX1UUAdGc',
              createdAt: '2023-04-08T13:16:05.043Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'actor',
              examples: [
                {
                  sentence: 'She wishes to become a famous actor in Hollywood.',
                },
              ],
              translations: [
                {
                  meaning: 'diễn viên',
                },
              ],
              phonetic: '/ˈæktə(r)/',
              updatedAt: '2023-04-09T07:03:55.917Z',
            },
            {
              id: 'eDrNdyGAP4bKQwODDUfC',
              createdAt: '2023-04-08T13:19:51.497Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'release',
              examples: [
                {
                  sentence:
                    'No one went to see the new movie, because it was released in the middle of the global pandemic.',
                },
              ],
              translations: [
                {
                  meaning: 'ra mắt, phát hành',
                },
              ],
              updatedAt: '2023-04-08T13:19:51.497Z',
              phonetic: '/rɪˈliːs/',
            },
            {
              id: 'aaHnJqhfZD5hrn3IzDXI',
              createdAt: '2023-04-08T13:21:10.210Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'ticket',
              examples: [
                {
                  sentence: 'He bought a ticket for the movie next Saturday.',
                },
              ],
              translations: [
                {
                  meaning: 'vé xem phim',
                },
              ],
              updatedAt: '2023-04-08T13:21:10.210Z',
              phonetic: '/ˈtɪkɪt/',
            },
            {
              id: 'rz3rN2VZBDqmOiqhkKuO',
              createdAt: '2023-04-08T13:27:51.255Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'movie industry',
              examples: [
                {
                  sentence:
                    "Many talented Vietnamese filmmakers and actors have appeared in recent years, contributing to the success of the country's movie industry.",
                },
              ],
              translations: [
                {
                  meaning: 'ngành công nghiệp điện ảnh',
                },
              ],
              phonetic: '/ˈmuːvi ˈɪndəstri/',
              updatedAt: '2023-04-09T10:39:52.400Z',
            },
            {
              id: 'MEayHYMVkz4bQdwQBO3q',
              createdAt: '2023-04-08T14:15:26.754Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/skrɪpt/',
              phrase: 'script',
              examples: [
                {
                  sentence:
                    'The writer spent weeks working on the script for the new movie.',
                },
                {
                  sentence:
                    'The director made several changes to the original script to improve the pacing of the film.',
                },
              ],
              translations: [
                {
                  meaning: 'kịch bản',
                },
              ],
              updatedAt: '2023-04-08T14:15:26.754Z',
            },
            {
              id: 'hZ7sRuvru79knfSC0Xeq',
              createdAt: '2023-04-08T14:20:11.650Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'episode',
              examples: [
                {
                  sentence:
                    'The final episode of the TV series had an unexpected and thrilling ending.',
                },
              ],
              translations: [
                {
                  meaning: 'tập phim',
                },
              ],
              phonetic: '/ˈepɪsəʊd/',
              updatedAt: '2023-04-09T07:12:12.355Z',
            },
            {
              id: 'hJy1z3Sq2zNb2ZM3diTZ',
              createdAt: '2023-04-08T14:40:52.738Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phrase: 'thriller movie',
              examples: [
                {
                  sentence:
                    'We decided to have a movie night and picked a thriller movie to add some excitement to the evening.',
                },
                {
                  sentence:
                    'She loves watching thriller movies late at night with all the lights off to create a spooky atmosphere.',
                },
              ],
              translations: [
                {
                  meaning: 'phim giật gân',
                },
              ],
              updatedAt: '2023-04-08T14:40:52.738Z',
              phonetic: '/ˈθrɪlə(r) ˈmuːvi/',
            },
            {
              id: 'BSkEBzWX4YBtAgti4ONr',
              createdAt: '2023-04-08T15:07:49.837Z',
              topicId: 'GTQD3b84dBIq3eoUICIF',
              phonetic: '/ˈbreɪkdaʊn/',
              phrase: 'breakdown',
              examples: [
                {
                  sentence:
                    'He provided a detailed breakdown of the movie we watched together last week.',
                },
                {
                  sentence:
                    "Tom always watched breakdown videos about any movie that he enjoys to make sure he didn't miss any detail.",
                },
              ],
              translations: [
                {
                  meaning: 'phân tích',
                },
              ],
              updatedAt: '2023-04-08T15:07:49.837Z',
            },
          ],
        },
        meta: {
          id: 'GTQD3b84dBIq3eoUICIF',
        },
      },
    },
  })
  findOneTopicBookmark(@Param('id') id: string) {
    return this.bookmarkService.findOneTopicBookmark(id);
  }

  @Delete('topic/:id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xoá bookmark',
  })
  @ApiResponseProperty({ example: true })
  removeTopicBookmark(@Param('id') id: string, @User() user: UserRecord) {
    return this.bookmarkService.removeTopicBookmark(id, user);
  }
}
