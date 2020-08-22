export default {
  computed:{
      //是否为当前版本
      isHistory(){
          return this.contractRowInfo.conHistoryVersionDtos!==null
      },
      //是否初始版本
      isInite(){
        return this.contractRowInfo.conHistoryVersionDtos.length===(this.tabIndex-1)
      }
   }
}