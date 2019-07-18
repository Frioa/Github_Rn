![image.png](https://upload-images.jianshu.io/upload_images/14297357-f88e80cb8d455ede.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 项目介绍

-  ES6
-   React Native 0.50.4

第三方组件
-  `react-native-check-box`
-  `react-native-htmlview`
-  `react-native-navigation`
-  `react-native-parallax-scroll-view`
-  `react-native-scrollable-tab-view`
- `react-native-sortable-listview`

 App 结构

![image.png](https://upload-images.jianshu.io/upload_images/14297357-95c92471c0fc72a6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

遇到的坑
虽然是按照视频来写，但是由于项目的结构等一些差别还会导致一些坑

- 数据改变后通知刷新视图，视图未刷新

在收藏子模块中，如果取消收藏了。我们则要在相应的最热、趋势模块也做相应的视图刷新，经过调试之后发现不会刷新，经过不断调试发现是由于异步调用造成的，采用延迟通知即可
```
this.timer = setTimeout(()=>{

  //一定要适当的延迟一下，因为AsyncStorage可能还没完全移除掉相应的key。

  DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_UPDATE_FAVORITE);

},500)
```
这里的`timer`一定要在`componentWillUnmount()`方法进行释放
```
componentWillUnmount(){

  this.timer&&clearTimeout(this.timer);

}
```
- 切换主题底部tabbar字体和图片的颜色不能改变

由于作者使用`react-native-navigation`这个第三方控件。其实本质就是封装了原生控件，当APP初始化之后，字体的颜色是该表不了了，不过图片能够改变。作者看了一下它的源码，其实实现也不难，只要改一下原生封装的代码，对外提供一个方法就好。

- 自定义视图的时候刷新要在主线程

在实现趋势的下拉框过程中，点击回调显示下拉框的时候，要在主线程调用。
```
dispatch_async(dispatch_get_main_queue(), ^{

  [KxMenu showMenuInView:[UIApplication sharedApplication].keyWindow

                fromRect:CGRectMake([dic[@"ox"] floatValue], [dic[@"oy"] floatValue]+20, [dic[@"width"] floatValue], [dic[@"height"] floatValue])

               menuItems:arrays];

});
```
- Can only update a mounted or mounting component...
```
Warning:
setState(...): Can only update a mounted or mounting component.
This usually means you called setState() on an unmounted component.
This is a no-op.
Please check the code for the xxx component.
```
这个问题也是在趋势模块导航栏自定义标题视图中遇到的一个警告。场景就是导航栏标题视图点击选择[今天,本周,本月],选完之后要更新导航栏显示的文字为用户所选的。这里作者自定义了一个`CustomTopBar.js`，然后注册了一个通知来监听更新`state`来刷新顶部文字的显示
```
componentDidMount(){
  this.listner = DeviceEventEmitter.addListener(ACTION_CUSTOMTOPBAR.CHANGE_TITLE,(title)=>{
    this.setState({
      title:title
    })
  })
}
```
查来查去作者想这个`component`应该没有被unmount，要不怎么会显示出来呢，而且标题也会正常更新，这里只是一个警告。作者就反复看代码，发现了一个问题就是作者的`listner`没有被释放，所以就加入了释放代码,居然神奇般的警告就消失了
##总结
第一个项目写的时候比较生疏，写第二个的时候就有点孰能生巧的感觉，所以写的会比较快。看视频的时候最好别按部就班的去写，最好一边看然后暂停一下，自己去实现一下或者尝试不同的实现方式去写。有时候看视频其实也会忽略一些细节，导致项目报错，这时候不要慌，我们要充分利用debug模式配合Chrome来断点远程调试，一点一点的运行最终肯定会找到问题所在。

