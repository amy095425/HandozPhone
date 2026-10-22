// UTF-8；普通脚本加载，兼容直接打开本地网页。
const momentsData = [
  {
    id: 1,
    author: '姐姐',
    avatar: '姐姐头像',
    content: '好好喝喔！感谢闺蜜请客💞',
    images: ['朋友圈图片1'],
    time: '20分钟前',
    likes: [],
    comments: []
  },
  {
    id: 2,
    author: '小陈',
    avatar: '小陈头像',
    content: '列表里的嘉豪像蟑螂一样除不尽😅',
    images: [],
    time: '1小时前',
    likes: [],
    comments: [
      { author: '佳佳', content: '蜜儿我懂你……' },
      { author: '姜明', content: '嘉豪是什么梗啊，这个有对应的英文吗😂澳大利亚的网速真的太差了，我都跟不上你们了' }
    ]
  },
  {
    id: 3,
    author: '妈妈',
    avatar: '妈妈头像',
    content: '老公做饭水平不断提高😎看来我可以放弃掌勺退居二线了',
    images: ['朋友圈图片3'],
    time: '2小时前',
    likes: [],
    comments: [
      { author: '爸爸', content: '我完全是大厨啊！' },
      { author: '妈妈', replyTo: '爸爸', content: '能不能谦虚一点……' },
      { author: '姐姐', content: '咬不动。。。' }
    ]
  },
  {
    id: 4,
    author: '姜明',
    avatar: '姜明头像',
    content: '别问我最近在干嘛，天天忙着帮前辈对接客户杂事、整理项目资料，摸鱼间隙还得研究股票搞点小钱，真的半点空闲都没有，压根没时间刷朋友圈😂',
    images: ['朋友圈图片2'],
    time: '2小时前',
    likes: [],
    comments: [
      { author: '佳佳', content: '哇……' },
      { author: '小陈', content: '哇……' }
    ]
  },
  {
    id: 5,
    author: '勋❤️',
    avatar: '金道勋头像',
    content: '下次一起去狎鸥亭吃这个吧~',
    images: ['朋友圈图片4'],
    time: '3小时前',
    likes: [],
    comments: [
      { author: 'Real JINJIN', content: '也不知道在和谁说话🙄' },
      { author: '勋❤️', replyTo: 'Real JINJIN', content: '哇塞我的微信根本只有一个好友好吗！' },
      { author: 'Real JINJIN', content: '你请客哦' },
      { author: '勋❤️', replyTo: 'Real JINJIN', content: '嗯嗯嗯嗯' }
    ]
  }
];
