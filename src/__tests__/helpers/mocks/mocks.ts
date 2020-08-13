import {
  PopcornMovie,
  PopcornShow,
  PopcornAnime,
} from '@/services/popcornTimeTypes'

export const apiStatusStub = {
  status: 'Idle',
  server: 'serv01',
  commit: '6c8a9a4',
  version: '2.2.3',
  totalAnimes: 704,
  uptime: 276,
  totalMovies: 19672,
  totalShows: 4312,
  updated: 1597029486,
}

export const moviesPages = ['movies/1', 'movies/2', 'movies/3'] as const
export const animesPages = ['animes/1', 'animes/2'] as const
export const showsPages = ['shows/1', 'shows/2'] as const

export const apiResources: ApiResources = {
  movies: {
    'movies/1': [
      {
        _id: 'tt1431045',
        imdb_id: 'tt1431045',
        title: 'Deadpool',
        year: '2016',
        synopsis:
          'Deadpool tells the origin story of former Special Forces operative turned mercenary Wade Wilson, who after being subjected to a rogue experiment that leaves him with accelerated healing powers, adopts the alter ego Deadpool. Armed with his new abilities and a dark, twisted sense of humor, Deadpool hunts down the man who nearly destroyed his life.',
        runtime: '108',
        released: 1455235200,
        trailer: 'http://youtube.com/watch?v=FyKWUTwSYAs',
        certification: 'R',
        torrents: {
          en: {
            '1080p': {
              provider: 'YTS',
              filesize: '1.65 GB',
              size: 1771674010,
              peer: 1081,
              seed: 2040,
              url:
                'magnet:?xt=urn:btih:6268ABCCB049444BEE76813177AA46643A7ADA88&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
            '720p': {
              provider: 'YTS',
              filesize: '798.59 MB',
              size: 837382308,
              peer: 1699,
              seed: 3344,
              url:
                'magnet:?xt=urn:btih:A1D0C3B0FD52A29D2487027E6B50F27EAF4912C5&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
          },
        },
        genres: ['action', 'adventure', 'comedy', 'superhero'],
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/yGSxMiF0cYuAiyuve5DA6bnWEOI.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/en971MEXui9diirXlogOrPKmsEn.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/yGSxMiF0cYuAiyuve5DA6bnWEOI.jpg',
        },
        rating: {
          percentage: 83,
          watching: 1,
          votes: 89435,
          loved: 100,
          hated: 100,
        },
      },
      {
        _id: 'tt2015381',
        imdb_id: 'tt2015381',
        title: 'Guardians of the Galaxy',
        year: '2014',
        synopsis:
          'Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser.',
        runtime: '121',
        released: 1406851200,
        trailer: 'http://youtube.com/watch?v=b7yOuhI1dzU',
        certification: 'PG-13',
        torrents: {
          en: {
            '1080p': {
              provider: 'YTS',
              filesize: '1.85 GB',
              size: 1986422374,
              peer: 2005,
              seed: 5908,
              url:
                'magnet:?xt=urn:btih:11A2AC68A11634E980F265CB1433C599D017A759&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
            '720p': {
              provider: 'YTS',
              filesize: '870.99 MB',
              size: 913299210,
              peer: 397,
              seed: 1429,
              url:
                'magnet:?xt=urn:btih:836D2E8C6350E4CE3800E812B60DE53A63FEB027&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
          },
        },
        genres: ['adventure', 'science-fiction', 'action'],
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/mZSAu5acXueGC4Z3S5iLSWx8AEp.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
        },
        rating: {
          percentage: 84,
          watching: 3,
          votes: 79296,
          loved: 100,
          hated: 100,
        },
      },
      {
        _id: 'tt0468569',
        imdb_id: 'tt0468569',
        title: 'The Dark Knight',
        year: '2008',
        synopsis:
          'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
        runtime: '152',
        released: 1216339200,
        trailer: 'http://youtube.com/watch?v=kmJLuwP3MbY',
        certification: 'PG-13',
        torrents: {
          en: {
            '2160p': {
              url:
                'magnet:?xt=urn:btih:61BE42FB337B1B84F844B88FD904982A0A2330E3&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
              seed: 259,
              peer: 114,
              size: 8074538516,
              filesize: '7.52 GB',
              provider: 'YTS',
            },
            '1080p': {
              provider: 'YTS',
              filesize: '1.70 GB',
              size: 1825361101,
              peer: 640,
              seed: 2338,
              url:
                'magnet:?xt=urn:btih:A54926C2E07B0E5F0243954330B599B31C804F0B&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
            '720p': {
              url:
                'magnet:?xt=urn:btih:F5D61BF3D57082BA2EE1305DA5DF8DCD10D34539&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
              seed: 464,
              peer: 172,
              size: 996136714,
              filesize: '949.99 MB',
              provider: 'YTS',
            },
          },
        },
        genres: ['action', 'crime', 'drama', 'thriller', 'superhero'],
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        },
        rating: {
          percentage: 89,
          watching: 3,
          votes: 60585,
          loved: 100,
          hated: 100,
        },
      },
    ],
    'movies/2': [
      {
        _id: 'tt1375666',
        imdb_id: 'tt1375666',
        title: 'Inception',
        year: '2010',
        synopsis:
          'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
        runtime: '148',
        released: 1279238400,
        trailer: 'http://youtube.com/watch?v=xitHF0IPJSQ',
        certification: 'PG-13',
        torrents: {
          en: {
            '1080p': {
              provider: 'YTS',
              filesize: '1.85 GB',
              size: 1986422374,
              peer: 189,
              seed: 1631,
              url:
                'magnet:?xt=urn:btih:224BF45881252643DFC2E71ABC7B2660A21C68C4&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
            '720p': {
              provider: 'YTS',
              filesize: '1.07 GB',
              size: 1148903752,
              peer: 197,
              seed: 1072,
              url:
                'magnet:?xt=urn:btih:CE9156EB497762F8B7577B71C0647A4B0C3423E1&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
          },
        },
        genres: ['action', 'adventure', 'science-fiction'],
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        },
        rating: {
          percentage: 87,
          watching: 4,
          votes: 57642,
          loved: 100,
          hated: 100,
        },
      },
      {
        _id: 'tt1211837',
        imdb_id: 'tt1211837',
        title: 'Doctor Strange',
        year: '2016',
        synopsis:
          'After his career is destroyed, a brilliant but arrogant surgeon gets a new lease on life when a sorcerer takes him under her wing and trains him to defend the world against evil.',
        runtime: '115',
        released: 1478217600,
        certification: 'PG-13',
        torrents: {
          en: {
            '2160p': {
              url:
                'magnet:?xt=urn:btih:1AB2D1005D6F43F6A7132A55D2E8BA54266FE0C1&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
              seed: 293,
              peer: 89,
              size: 5723043922,
              filesize: '5.33 GB',
              provider: 'YTS',
            },
            '1080p': {
              provider: 'YTS',
              filesize: '1.75 GB',
              size: 1879048192,
              peer: 9839,
              seed: 14081,
              url:
                'magnet:?xt=urn:btih:7BA0C6BD9B4E52EA2AD137D02394DE7D83B98091&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
            '720p': {
              url:
                'magnet:?xt=urn:btih:AFA238A8D953B6256D94FCF6D183917F5110E6F4&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
              seed: 9992,
              peer: 8260,
              size: 885973320,
              filesize: '844.93 MB',
              provider: 'YTS',
            },
          },
        },
        trailer: 'http://youtube.com/watch?v=HSzx-zryEgM',
        genres: [
          'action',
          'adventure',
          'science-fiction',
          'fantasy',
          'superhero',
        ],
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/gwi5kL7HEWAOTffiA14e4SbOGra.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/aL53oMdZKZRJRH8txH07DLuleF9.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/gwi5kL7HEWAOTffiA14e4SbOGra.jpg',
        },
        rating: {
          percentage: 79,
          watching: 2,
          votes: 56920,
          loved: 100,
          hated: 100,
        },
      },
      {
        _id: 'tt3315342',
        imdb_id: 'tt3315342',
        title: 'Logan',
        year: '2017',
        synopsis:
          "In the near future, a weary Logan cares for an ailing Professor X in a hideout on the Mexican border. But Logan's attempts to hide from the world and his legacy are upended when a young mutant arrives, pursued by dark forces.",
        runtime: '137',
        released: 1488499200,
        certification: 'R',
        torrents: {
          en: {
            '1080p': {
              provider: 'YTS',
              filesize: '2.09 GB',
              size: 2244120412,
              peer: 12030,
              seed: 14991,
              url:
                'magnet:?xt=urn:btih:1AB2CE4D62A9A46E91A3A3097BCEBD6248978D40&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
            '720p': {
              provider: 'YTS',
              filesize: '1014.33 MB',
              size: 1063602094,
              peer: 10687,
              seed: 12302,
              url:
                'magnet:?xt=urn:btih:A52324E4506C66CB30067BE13EE366C225BC4D70&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
          },
        },
        trailer: 'http://youtube.com/watch?v=Div0iP65aZo',
        genres: ['action', 'science-fiction', 'drama', 'superhero'],
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/x75pHBRH3UdRQtP52k8MIOLryW8.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/yEv8c6i79vk06sZDC3Z9D8HQLVV.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/x75pHBRH3UdRQtP52k8MIOLryW8.jpg',
        },
        rating: {
          percentage: 80,
          watching: 1,
          votes: 56649,
          loved: 100,
          hated: 100,
        },
      },
    ],
    'movies/3': [
      {
        _id: 'tt0848228',
        imdb_id: 'tt0848228',
        title: 'The Avengers',
        year: '2012',
        synopsis:
          'When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!',
        runtime: '143',
        released: 1336089600,
        trailer: 'http://youtube.com/watch?v=eOrNdBpGMv8',
        certification: 'PG-13',
        torrents: {
          en: {
            '1080p': {
              url:
                'magnet:?xt=urn:btih:E9F759B6A26113F3745311DAD4BD332B4612EB60&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
              seed: 1937,
              peer: 538,
              size: 2362232013,
              filesize: '2.20 GB',
              provider: 'YTS',
            },
            '720p': {
              provider: 'YTS',
              filesize: '1023.32 MB',
              size: 1073028792,
              peer: 650,
              seed: 2947,
              url:
                'magnet:?xt=urn:btih:0BBCA7584749D4E741747E32E6EB588AEA03E40F&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
          },
        },
        genres: ['action', 'adventure', 'science-fiction', 'superhero'],
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/qJQknP1F9R4pS5qiOuvpIUuWam4.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
        },
        rating: {
          percentage: 82,
          watching: 5,
          votes: 55561,
          loved: 100,
          hated: 100,
        },
      },
      {
        _id: 'tt1386697',
        imdb_id: 'tt1386697',
        title: 'Suicide Squad',
        year: '2016',
        synopsis:
          'From DC Comics comes the Suicide Squad, an antihero team of incarcerated supervillains who act as deniable assets for the United States government, undertaking high-risk black ops missions in exchange for commuted prison sentences.',
        runtime: '123',
        released: 1470355200,
        certification: 'PG-13',
        torrents: {
          en: {
            '2160p': {
              provider: 'YTS',
              filesize: '5.82 GB',
              size: 6249177416,
              peer: 23,
              seed: 105,
              url:
                'magnet:?xt=urn:btih:463E132A23EC6CA637E35A9369B1AAF5D7190AD2&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
            '1080p': {
              provider: 'YTS',
              filesize: '2.06 GB',
              size: 2211908157,
              peer: 10035,
              seed: 10085,
              url:
                'magnet:?xt=urn:btih:8DCEC817168702F38B707519356FE6E5A8367341&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
            '720p': {
              provider: 'YTS',
              filesize: '999.95 MB',
              size: 1048523571,
              peer: 5970,
              seed: 7874,
              url:
                'magnet:?xt=urn:btih:567E9F3DDB2802E75B88532FE315FA6391991763&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337',
            },
          },
        },
        trailer: 'http://youtube.com/watch?v=CmRih_VtVAs',
        genres: [
          'action',
          'crime',
          'fantasy',
          'science-fiction',
          'superhero',
          'adventure',
        ],
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/xFw9RXKZDvevAGocgBK0zteto4U.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/6Ljm3aMh07OrY11h51XrGr694oi.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/xFw9RXKZDvevAGocgBK0zteto4U.jpg',
        },
        rating: {
          percentage: 67,
          watching: 0,
          votes: 55331,
          loved: 100,
          hated: 100,
        },
      },
    ],
  },
  animes: {
    'animes/1': [
      {
        _id: '5646',
        mal_id: '9253',
        title: 'Steins;Gate',
        year: '2011',
        slug: 'steins-gate',
        type: 'show',
        genres: ['Comedy', 'Sci-Fi', 'Mystery', 'Thriller', 'Drama'],
        images: {
          poster:
            'https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953',
          fanart:
            'https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953',
          banner:
            'https://static.hummingbird.me/anime/poster_images/000/005/646/large/iJvXXwfdhJHaG.jpg?1416278953',
        },
        rating: {
          percentage: 90,
          watching: 0,
          votes: 0,
          loved: 100,
          hated: 100,
        },
        num_seasons: 1,
      },
      {
        _id: '10740',
        mal_id: '30276',
        title: 'One Punch Man',
        year: '2015',
        slug: 'one-punch-man',
        type: 'show',
        genres: [
          'Comedy',
          'Sci-Fi',
          'Supernatural',
          'Super Power',
          'Parody',
          'Action',
        ],
        images: {
          poster:
            'https://static.hummingbird.me/anime/poster_images/000/010/740/large/vAZRjfm.jpg?1441243505',
          fanart:
            'https://static.hummingbird.me/anime/poster_images/000/010/740/large/vAZRjfm.jpg?1441243505',
          banner:
            'https://static.hummingbird.me/anime/poster_images/000/010/740/large/vAZRjfm.jpg?1441243505',
        },
        rating: {
          percentage: 90,
          watching: 0,
          votes: 0,
          loved: 100,
          hated: 100,
        },
        num_seasons: 1,
      },
      {
        _id: '6028',
        mal_id: '10087',
        title: 'Fate/Zero',
        year: '2011',
        slug: 'fate-zero',
        type: 'show',
        genres: ['Supernatural', 'Fantasy', 'Action'],
        images: {
          poster:
            'https://static.hummingbird.me/anime/poster_images/000/006/028/large/fat.jpg?1410533243',
          fanart:
            'https://static.hummingbird.me/anime/poster_images/000/006/028/large/fat.jpg?1410533243',
          banner:
            'https://static.hummingbird.me/anime/poster_images/000/006/028/large/fat.jpg?1410533243',
        },
        rating: {
          percentage: 88,
          watching: 0,
          votes: 0,
          loved: 100,
          hated: 100,
        },
        num_seasons: 1,
      },
    ],
    'animes/2': [
      {
        _id: '11459',
        mal_id: '31933',
        title: "JoJo's Bizarre Adventure: Diamond Is Unbreakable",
        year: '2016',
        slug: 'jojo-s-bizarre-adventure-diamond-is-unbreakable',
        type: 'show',
        genres: ['Adventure', 'Comedy', 'Super Power', 'Action'],
        images: {
          poster:
            'https://static.hummingbird.me/anime/poster_images/000/011/459/large/t_main_img4.jpg?1478225658',
          fanart:
            'https://static.hummingbird.me/anime/poster_images/000/011/459/large/t_main_img4.jpg?1478225658',
          banner:
            'https://static.hummingbird.me/anime/poster_images/000/011/459/large/t_main_img4.jpg?1478225658',
        },
        rating: {
          percentage: 88,
          watching: 0,
          votes: 0,
          loved: 100,
          hated: 100,
        },
        num_seasons: 1,
      },
    ],
  },
  shows: {
    'shows/1': [
      {
        _id: 'tt0944947',
        imdb_id: 'tt0944947',
        tvdb_id: '121361',
        title: 'Game of Thrones',
        year: '2011',
        slug: 'game-of-thrones',
        num_seasons: 8,
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
        },
        rating: {
          percentage: 91,
          watching: 12,
          votes: 111962,
          loved: 100,
          hated: 100,
        },
      },
      {
        _id: 'tt0903747',
        imdb_id: 'tt0903747',
        tvdb_id: '81189',
        title: 'Breaking Bad',
        year: '2008',
        slug: 'breaking-bad',
        rating: {
          percentage: 93,
          watching: 8,
          votes: 77547,
          loved: 100,
          hated: 100,
        },
        num_seasons: 5,
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        },
      },
      {
        _id: 'tt1520211',
        imdb_id: 'tt1520211',
        tvdb_id: '153021',
        title: 'The Walking Dead',
        year: '2010',
        slug: 'the-walking-dead',
        rating: {
          percentage: 82,
          watching: 4,
          votes: 62528,
          loved: 100,
          hated: 100,
        },
        num_seasons: 10,
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/reKs8y4mPwPkZG99ZpbKRhBPKsX.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/wXXaPMgrv96NkH8KD1TMdS2d7iq.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/reKs8y4mPwPkZG99ZpbKRhBPKsX.jpg',
        },
      },
    ],
    'shows/2': [
      {
        _id: 'tt0898266',
        imdb_id: 'tt0898266',
        tvdb_id: '80379',
        title: 'The Big Bang Theory',
        year: '2007',
        slug: 'the-big-bang-theory',
        rating: {
          percentage: 82,
          watching: 25,
          votes: 58173,
          loved: 100,
          hated: 100,
        },
        num_seasons: 12,
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/ngoiHQul4QetfA62SdmZZOdDFAP.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg',
        },
      },
      {
        _id: 'tt1475582',
        imdb_id: 'tt1475582',
        tvdb_id: '176941',
        title: 'Sherlock',
        year: '2010',
        slug: 'sherlock',
        rating: {
          percentage: 91,
          watching: 0,
          votes: 40732,
          loved: 100,
          hated: 100,
        },
        num_seasons: 4,
        images: {
          poster:
            'http://image.tmdb.org/t/p/w500/aguWVR8xNilvw7t4X03UvG1hRJr.jpg',
          fanart:
            'http://image.tmdb.org/t/p/w500/oFvjxSIPYv5YXspDlnWeDJhnPHI.jpg',
          banner:
            'http://image.tmdb.org/t/p/w500/aguWVR8xNilvw7t4X03UvG1hRJr.jpg',
        },
      },
    ],
  },
}

interface ApiResources {
  movies: {
    'movies/1': PopcornMovie[]
    'movies/2': PopcornMovie[]
    'movies/3': PopcornMovie[]
  }
  shows: {
    'shows/1': PopcornShow[]
    'shows/2': PopcornShow[]
  }
  animes: {
    'animes/1': PopcornAnime[]
    'animes/2': PopcornAnime[]
  }
}
