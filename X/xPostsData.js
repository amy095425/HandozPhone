// UTF-8；帖子按数组顺序展示，点赞状态仅在本次页面加载中保留。
const xPostsData = [
  {
    id: 'p1', type: 'space', userName: '憨豆子万岁', userId: 'Handoz2499',
    avatarUrl: './X/主持人头像.jpeg', time: '20小时前', content: '一起来聊。',
    roomTitle: '一起来聊', image: '', likes: 24,
    stats: { comments: '56', reposts: '2', likes: '24', heat: '362' }, isLiked: false
  },
  {
    id: 'p_voice_room_next',
    userName: 'Sai42',
    userId: 'sai42',
    time: '1天前',
    content: '我们TWS才刚刚开始！TWS SAI Fighting！！！',
    image: './X/x帖子图片5.jpeg',
    likes: 1127,
    stats: { comments: '90', reposts: '87', likes: '1127', heat: '3739' },
    isLiked: false
  },
  {
    id: 'p2',
    userName: '狎鸥亭胶卷机',
    userId: 'xiaoutinglove',
    time: '2小时前',
    content: '有人懂一下下图吗，这是我的原生家庭我母父是腹黑攻和钓系受是青梅竹马是门当户对是财阀联姻是s1m0！一步一磕头感谢Celine皇祖母大人！皇祖母从此拳打葆蝶家脚踢罗意威万岁万岁万万岁！',
    image: './X/x帖子图片1.jpeg',
    likes: 4273,
    stats: { comments: '240', reposts: '36', likes: '4273', heat: '12938' },
    isLiked: false
  },
  {
    id: 'p3',
    userName: '彩虹酵母',
    userId: 'rainbowheart',
    time: '4小时前',
    content: '胶卷宝宝出生啦😳……',
    image: './X/x帖子图片2.jpeg',
    likes: 2839,
    stats: { comments: '172', reposts: '27', likes: '2839', heat: '7938' },
    isLiked: false
  },
  {
    id: 'p4',
    userName: '兔兔神教',
    userId: 'bunnylove',
    time: '5小时前',
    content: '我需要一个能够驱逐噩梦的魔法，然后替我心肝念7749遍😭让我做全世界倒数第一爱你的人吧，祈求每个人都比我多爱你一点……',
    image: './X/x帖子图片3.JPG',
    likes: 8273,
    stats: { comments: '289', reposts: '127', likes: '8273', heat: '37392' },
    isLiked: false
  },
  {
    id: 'p5',
    userName: '小狼饲养中心',
    userId: 'wolfwolf',
    time: '6小时前',
    content: '卧槽有狗啊！！！这个眼睛这个口轮炸鸡这个肥卧蚕！是人能直视的可爱吗！小道小道永远幸福快乐开心肆意好不好呀🥺',
    image: './X/x帖子图片4.jpeg',
    likes: 8273,
    stats: { comments: '289', reposts: '127', likes: '8273', heat: '37392' },
    isLiked: false
  }
];
// 默认头像只初始化一次，点赞或切换页面时不重新随机。
xPostsData.forEach(post => {
  if (!post.avatarUrl) {
    post.avatarColor = `hsl(${Math.floor(Math.random() * 360)} 58% 83%)`;
    post.avatarInitial = Array.from(post.userName)[0].toLocaleUpperCase();
  }
});
