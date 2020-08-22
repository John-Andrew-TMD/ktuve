<template>
  <div class="canvas-container">
    <div id="jrosbpm"></div>
    <div class="timeline-container" v-show="nodeData.length">
      <flow-timeline :nodeData="nodeData"></flow-timeline>
    </div>
  </div>
</template>

<script>
import jquery from "views/workflow/process-draw/plugins/jquery-1.7.2.min.js";
import jqueryUI from "views/workflow/process-draw/plugins/jquery-ui.min.js";
import Raphael from "raphael";
import bpm from "views/workflow/process-draw/plugins/jrosbpm";
import extend from "views/workflow/process-draw/plugins/jrosbpm.extend";
import FlowTimeline from 'components/FlowTimeline'
import { isEmptyObj } from 'utils'
export default {
  data() {
    return {
      nodeData: []
    };
  },
  components: {
    FlowTimeline
  },
  props: ['flowInfoObj', 'routeParams'],
  watch: {
    flowInfoObj: {
      handler(obj) {
        if(isEmptyObj(obj)) return
        if(obj.from === 'processDetail') {
          this._getNodeDataByFlowId(obj);
        } else {
          this._getNodeDataByFlowNo(obj);
        }
        this._getNodeTimelineData(obj);
      },
      immediate: true
    },
    routeParams: {
      handler(obj) {
        if(isEmptyObj(obj)) return
        this._getNodeDataByFlowId(obj);
        this._getNodeTimelineData(obj);
      },
      immediate: true
    }
  },
  created() {
    this._init()
  },
  methods: {
    _init() {
      jqueryUI(jquery);
      bpm(jquery, Raphael);
      extend(jquery);
    },
    _getNodeDataByFlowId(obj) {
      this.$promiseRequest({
        code: "100617",
        data: {
          flow_id: obj.flow_id,
          flow_version_id: obj.flow_version_id,
          req_id: obj.req_id
        }
      })
        .then(res => {
          if (res.data.record.length) {
            this._drawNode(res.data.record[0].json_str);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getNodeDataByFlowNo(obj) {
      this.$promiseRequest({
        code: "100618",
        data: {
          flow_no: obj.flow_no,
          flow_version: obj.flow_version,
          req_id: obj.req_id
        }
      })
        .then(res => {
          if (res.data.record.length) {
            this._drawNode(res.data.record[0].json_str);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getNodeTimelineData(obj) {
      this.$promiseRequest(
        {
          code: "100648",
          data: {
            req_id: obj.req_id
          }
        },
        { showLoading: true }
      )
        .then(res => {
          this.nodeData = res.data.record;
        })
        .catch(err => {
          console.log(err);
        });
    },
    _drawNode(json_str) {
      let jsonData = JSON.parse(json_str);
      let $ = jquery;
      $("#jrosbpm")
        .jrosbpm(
          $.extend(
            true,
            {
              basePath: "",
              restore: jsonData.restore,
              editable: false
            },
            { activeRects: jsonData.activeRects },
            { historyRects: jsonData.historyRects }
          )
        )
        .draggable();
    }
  }
};
</script>

<style lang='scss' scoped>
.canvas-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
}
.timeline-container {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 350px;
}

</style>
