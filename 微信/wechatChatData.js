// UTF-8；普通脚本加载，兼容 Safari 直接打开本地 index.html。
const wechatChatData = {
  family: {
    name: '相亲相爱一家人', type: 'group', myName: '小振', avatar: 'quad',
    messages: [
      { date: '2026年10月5日', items: [
        { sender: '爸爸', text: '@小振 去巴黎了？', isMe: false },
        { sender: '爸爸', text: '😎', isMe: false },
        { sender: '爸爸', text: '牛喔，照片好帅', isMe: false },
        { sender: '妈妈', text: '你姐把图片搞成家里电脑背景了😊', isMe: false },
        { sender: '妈妈', text: '帅气大男孩👍🏻', isMe: false },
        { sender: '姐姐', text: '别跟他说嘛🥺我瞎搞的', isMe: false },
        { sender: '小振', text: '😳😳😳', isMe: true },
        { sender: '姐姐', text: '书房里好大一张你的脸', isMe: false },
        { sender: '姐姐', text: '快点回家吧', isMe: false }
      ]},
      { date: '2026年10月7日', items: [
        { sender: '爸爸', text: '老妈新学了糖醋排骨😎好吃喔', isMe: false },
        { sender: '爸爸', text: '了不起女士👍🏻', isMe: false },
        { sender: '妈妈', text: '😂💞', isMe: false },
        { sender: '姐姐', text: '好吃喔，比上次老爸做的红烧猪排好吃', isMe: false },
        { sender: '姐姐', text: '老爸做饭咬不动啊😓', isMe: false }
      ]},
      { date: '2026年10月10日', items: [
        { sender: '姐姐', text: '尊敬的老爹老妈@爸爸@妈妈', isMe: false },
        { sender: '妈妈', text: '😳', isMe: false },
        { sender: '爸爸', text: '大事不妙！', isMe: false },
        { sender: '爸爸', text: '生日包过红包啦……', isMe: false },
        { sender: '姐姐', text: '是车子在东路这边被刮啦……', isMe: false },
        { sender: '小振', text: '东路坏', isMe: true },
        { sender: '姐姐', text: '小振说得对👍🏻', isMe: false },
        { sender: '姐姐', text: '哪个弱智在路口设置的石桩😠', isMe: false },
        { sender: '姐姐', text: '完全反人类', isMe: false },
        { sender: '妈妈', text: '这点小事~打保险电话就好啦~', isMe: false },
        { sender: '妈妈', text: '人没事最重要', isMe: false },
        { sender: '妈妈', text: '嗨，我以为什么大事呢，快回家吃饭啊', isMe: false },
        { sender: '妈妈', text: '炖的五花肉都要烂掉了', isMe: false },
        { sender: '爸爸', text: '@姐姐 发个定位我来接你吧', isMe: false },
        { sender: '爸爸', text: '不然到点了市中心要堵车啊', isMe: false }
      ]},
      { date: '2026年10月14日', items: [
        { sender: '小振', text: '今天吃了好吃的炖排骨', isMe: true },
        { sender: '小振', text: '但是没有妈妈做得好吃喔', isMe: true },
        { sender: '小振', text: '😔', isMe: true },
        { sender: '妈妈', text: '🥺什么时候才能回来呢', isMe: false },
        { sender: '妈妈', text: '跟公司申请一下吧', isMe: false },
        { sender: '妈妈', text: '我和爸爸好想你哦', isMe: false }
      ]},
      { date: '2026年10月17日', items: [
        { sender: '姐姐', text: '哇闹鬼了', isMe: false },
        { sender: '姐姐', text: '去接老弟下课看到他上次数学只考了五十分😠', isMe: false },
        { sender: '姐姐', text: '遗传的谁@爸爸@妈妈', isMe: false },
        { sender: '妈妈', text: '😳', isMe: false },
        { sender: '爸爸', text: '😳', isMe: false },
        { sender: '爸爸', text: '哇五十分啊', isMe: false },
        { sender: '爸爸', text: '厉害噢，小学数学能考这个分很不容易的', isMe: false },
        { sender: '姐姐', text: '😅这是重点吗', isMe: false },
        { sender: '小振', text: '再接再厉就好啦', isMe: true }
      ]},
      { date: '2026年10月20日', items: [
        { sender: '妈妈', text: '新专辑拍这么好', isMe: false },
        { sender: '妈妈', text: '真的像小猫一样可爱', isMe: false },
        { sender: '爸爸', text: '你妈在家下单了好多专辑@小振', isMe: false },
        { sender: '爸爸', text: '说是要给朋友一人一本啊', isMe: false },
        { sender: '小振', text: '啊！那也太尴尬了吧！', isMe: true },
        { sender: '妈妈', text: '希望抽到你的小卡😊', isMe: false },
        { sender: '小振', text: '我发几张自拍就好了嘛', isMe: true },
        { sender: '妈妈', text: '那不一样', isMe: false },
        { sender: '姐姐', text: '妈上次一张你的卡都没抽到', isMe: false },
        { sender: '妈妈', text: '😭😭😭', isMe: false },
        { sender: '姐姐', text: '我帮妈上闲鱼买了一套🙂', isMe: false },
        { sender: '小振', text: '🥺妈妈……', isMe: true },
        { sender: '小振', text: '下次回家一起拍拍立得吧', isMe: true },
        { sender: '小振', text: 'Hanjinroid Love let’s go!', isMe: true }
      ]}
    ]
  },
  xun: {
    name: '勋❤️', type: 'private', myName: '振ni', avatar: '金道勋头像',
    messages: [
      { date: '2026年1月1日', items: [
        { sender: '勋❤️', text: '落地没？', isMe: false },
        { sender: '振ni', text: '滑行中', isMe: true },
        { sender: '振ni', text: '你发的好准时', isMe: true },
        { sender: '勋❤️', text: '当然了，我有用app看实时航班啊', isMe: false },
        { sender: '勋❤️', text: '😟不是偷窥狂哦', isMe: false },
        { sender: '振ni', text: '哈哈哈哈哈哈真可爱，可爱的道勋哥🥰', isMe: true },
        { sender: '振ni', text: '我要去拿行李了，下次和我一起来河南玩吧', isMe: true },
        { sender: '勋❤️', text: '要记得我很想你啊', isMe: false }
      ]},
      { date: '2026年2月17日', items: [
        { sender: '振ni', text: '上海完全是大都市啊', isMe: true },
        { sender: '振ni', text: '在超多人的路口Cha了Overdrive', isMe: true },
        { sender: '振ni', text: '😣', isMe: true },
        { sender: '勋❤️', text: 'kkk，这么可爱的视频会发出来吗？', isMe: false },
        { sender: '振ni', text: '应该会吧，发到Tiktok或者vlog里？', isMe: true },
        { sender: '勋❤️', text: '期待一下你的上海vlog😎', isMe: false },
        { sender: '勋❤️', text: '今日ootd是什么？', isMe: false },
        { sender: '振ni', text: '好看的驼色大衣、黑色卫衣、白色内搭，还有——', isMe: true },
        { sender: '振ni', text: '啊，要不晚上来打视频电话吧', isMe: true },
        { sender: '振ni', text: '今天是大年初一🤔听说只要今天幸福了，接下来一整年就都会顺顺利利', isMe: true },
        { sender: '勋❤️', text: '所以韩振呐，只要和哥见面就会幸福吗🤭', isMe: false },
        { sender: '振ni', text: '我完全是啊，难道哥不是吗🥺', isMe: true },
        { sender: '勋❤️', text: '😳', isMe: false },
        { sender: '振ni', text: '👉🏻👈🏻', isMe: true },
        { sender: '勋❤️', text: '哎呀，现在就视频吧', isMe: false },
        { sender: '勋❤️', text: '让幸福来得再早一点好吗？', isMe: false }
      ]},
      { date: '2026年2月19日', items: [
        { sender: '振ni', text: '报告，已落地仁川机场', isMe: true },
        { sender: '振ni', text: '距离目标位置还有五十公里', isMe: true },
        { sender: '振ni', text: '不想上班😭不想回复KakaoTalk的消息', isMe: true },
        { sender: '勋❤️', text: '报告，和司机刚抵达仁川机场T1航站楼地下停车场', isMe: false },
        { sender: '勋❤️', text: '不是公司的车，我自己打的Uber👀', isMe: false },
        { sender: '勋❤️', text: '下楼吧，我们一起逃跑', isMe: false },
        { sender: '勋❤️', text: '就跑到芦原区孔陵洞东一路55号住宅楼如何呢', isMe: false },
        { sender: '勋❤️', text: '妈妈刚做好了饭，她叫我们快点去吃呀', isMe: false }
      ]},
      { date: '2026年8月18日', items: [
        { sender: '振ni', text: '好久没吃学校门口的麻辣香锅了', isMe: true },
        { sender: '振ni', text: '吃了42块钱，kkk，是Sai们呢', isMe: true },
        { sender: '勋❤️', text: '😯回中学了吗', isMe: false },
        { sender: '振ni', text: '在校门口走了一下，没进去看', isMe: true },
        { sender: '振ni', text: '好怀念啊', isMe: true },
        { sender: '勋❤️', text: '要是河南和首尔之间能有条路连起来就好了，我还没有接过你放学欸😮‍💨', isMe: false },
        { sender: '振ni', text: '那全世界会因为哥爆发第三次大战的🤭', isMe: true },
        { sender: '振ni', text: '我买了今晚回首尔的飞机，哥可不可以留在宿舍等我？', isMe: true },
        { sender: '勋❤️', text: '这么快就回来？是不是太赶了？', isMe: false },
        { sender: '勋❤️', text: '有什么急事吗？？？我看看能不能代处理', isMe: false },
        { sender: '振ni', text: '不是哇，只是今天是七夕而已', isMe: true },
        { sender: '振ni', text: '中国的情人节。这么好的日子，我有要一起过节的人🥰', isMe: true },
        { sender: '勋❤️', text: '那看来必须要开个直播了👀', isMe: false },
        { sender: '振ni', text: '播什么啊😟', isMe: true },
        { sender: '勋❤️', text: '🐺&🐰的幸福日常啊☝️', isMe: false }
      ]}
    ]
  },
  sister: {
    name: '姐姐', type: 'private', myName: '小振', avatar: '姐姐头像',
    messages: [
      { date: '2026年10月1日', items: [
        { sender: '姐姐', text: '弟弟下周过生日哦，不要忘记买礼物了', isMe: false },
        { sender: '姐姐', text: '不然他会一直缠着我给你打电话的😇', isMe: false },
        { sender: '小振', text: '👌', isMe: true },
        { sender: '小振', text: '事情交给我你放心', isMe: true },
        { sender: '小振', text: '不过他现在多高啊，买170的码够吗？', isMe: true },
        { sender: '姐姐', text: '175吧，这样等你下次回来还能穿给你看', isMe: false },
        { sender: '小振', text: '🥺这样说弄得我很想哭', isMe: true },
        { sender: '姐姐', text: '想哭就哭啦，还要挑日子吗', isMe: false },
        { sender: '姐姐', text: '我也不想你变成没眼泪的大人啦👎🏻', isMe: false },
        { sender: '小振', text: '😭😭😭😭😭', isMe: true }
      ]},
      { date: '2026年10月21日', items: [
        { sender: '姐姐', text: '🙄昨天回镇里，三叔又在问我什么时候结婚，没品的家伙', isMe: false },
        { sender: '小振', text: '你怎么回答的呀🤭', isMe: true },
        { sender: '姐姐', text: '我说韩振不结婚我不结婚🙂', isMe: false },
        { sender: '小振', text: '😳呀你太坏了吧！', isMe: true },
        { sender: '姐姐', text: '然后你猜三叔说什么', isMe: false },
        { sender: '小振', text: '说什么？', isMe: true },
        { sender: '姐姐', text: '他说小振不是有对象了吗，年初穿红色合照的那个', isMe: false },
        { sender: '姐姐', text: '我说那是小振队友啊，什么对象😅', isMe: false },
        { sender: '小振', text: '那三叔倒是也没说错……', isMe: true },
        { sender: '姐姐', text: '？？？？？！', isMe: false },
        { sender: '姐姐', text: '？？？？？？？？？？？', isMe: false },
        { sender: '姐姐', text: '！！！！！！！！！！！！！！！！！！！！！！！！', isMe: false },
        { sender: '姐姐', text: '啥玩意啊韩振！', isMe: false },
        { sender: '姐姐', text: '你别装下线！给我把话说清楚！！！！！！', isMe: false }
      ]}
    ]
  },
  jiajia: {
    name: '佳佳', type: 'private', myName: '小振', avatar: '佳佳头像',
    messages: [
      { date: '2026年7月11日', items: [
        { sender: '佳佳', text: '今年的高中同学聚会定在国庆了，你能来参加吗？', isMe: false },
        { sender: '佳佳', text: '大家还挺想你的🥰', isMe: false },
        { sender: '小振', text: '不行呢😣那时候有工作', isMe: true },
        { sender: '小振', text: '抱歉😭', isMe: true },
        { sender: '佳佳', text: '没关系啊，有什么好抱歉的，一定要成为大明星哦！', isMe: false },
        { sender: '佳佳', text: '我们真的觉得很骄傲的🥰下次再约吧！', isMe: false },
        { sender: '佳佳', text: '总会有机会的呀！', isMe: false }
      ]}
    ]
  }
};
