import mqtt from '../../utils/mqtt.js';
var app = getApp();
Page({
  data: {
 
    client: "",
    hostaddr:"",
    subtopic:"",
    pubtopic:"",
    publishdata:"",//发送数据缓存
    subscribedata:"",//接收数据缓存
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clientId:"",
      clean: false,
      username: "U-2",
      password: "hahahaha",
    
     //password: "",
     //username: "",
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    }
  },

  connect_button: function () {
    var that = this;
    //开始连接
    this.data.client = mqtt.connect(this.data.hostaddr, this.data.options);
    this.data.client.on('connect', function (connack) {
      wx.showToast({
       
      title: '连接成功'
    
      })
    })


    //服务器下发消息的回调
    that.data.client.on("message", function (topic, payload) {
        
      that.setData({
        subscribedata: " 主题:" + topic+ "内容:"+ payload ,
      }) 
    })


    //服务器连接异常的回调
    that.data.client.on("error", function (error) {
      console.log(" 服务器 error 的回调" + error)
  

    })

    //服务器重连连接异常的回调
    that.data.client.on("reconnect", function () {
      console.log(" 服务器 reconnect的回调")

    })


    //服务器连接异常的回调
    that.data.client.on("offline", function (error,message) {
      console.log(" 服务器offline的回调" + message)
      that.data.client.end();
    })

  

  },
 
  onClick_SubOne: function () {
    if (this.data.client && this.data.client.connected) {
      //仅订阅单个主题
      this.data.client.subscribe(this.data.subtopic, function (err, granted) {
        if (!err) {
          wx.showToast({
            title: '订阅主题成功'
          })
        } else {
          wx.showToast({
            title: '订阅主题失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onClick_PubMsg: function () {
    if (this.data.client && this.data.client.connected) {
      this.data.client.publish(this.data.pubtopic, this.data.publishdata);
      wx.showToast({
        title: '发布成功'
      })
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onClick_unSubOne: function () {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe('Topic1');
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onClick_unSubMany: function () {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe(['Topic1', 'Topic2']);
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },

  addrinput:function(e){
    this.setData({
      hostaddr: "wxs://" + e.detail.value+"/mqtt"

    })

  },
  clientidinput:function(e){
    
    this.data.options.clientId = e.detail.value
      

  },
  userinput:function(e){
    

     this.data.options.username= e.detail.value


  },

  pswdinput: function (e) {

    
      this.data.options.password=e.detail.value
       
  

  },
  subtopicinput: function (e) {


    this.data.subtopic= e.detail.value
  },
  pubtopicinput: function (e) {


    this.data.pubtopic = e.detail.value

  },
  valueChange:function(e){

    this.data.publishdata = e.detail.value



  }
})