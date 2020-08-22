<template>
  <div class="app-content app-content--quote file-store-mng-page">
    <quote text="文件转换" icon="file-store" />
    <div class="app-content-wrapper">
      <el-form model="forItems">
        <el-form-item label="转换类型">
          <el-select v-model="forItems.transferType" @change="handleTransferTypeChange">
            <el-option
              v-for="item in transferOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="file-upload-container">
        <el-button v-if="[1, 2].includes(forItems.transferType)" type="primary">选择文件</el-button>
        <el-button v-if="[3, 4].includes(forItems.transferType)" type="primary" @click="handleFormSubmit">确定</el-button>
        <form v-show="[1, 2].includes(forItems.transferType)" ref="formDom" class="file-upload-form" :action="action" method="post" enctype="multipart/form-data">
          <input v-if="[3, 4].includes(forItems.transferType)" v-model="htmlContent" type="text" name="htmlContent" @change="handleFileChange">
          <input v-else type="file" name="file" @change="handleFileChange">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Quote from 'components/Quote'
import { word2pdf, wordToHtml, html2pdf, html2word } from 'api/office-convert'
import { formSubmit } from 'utils'
export default {
  components: {
    Quote
  },
  data() {
    return {
      action: word2pdf,
      forItems: {
        transferType: 1
      },
      htmlContent: '<html><boty>123</body></html>',
      transferOptions: [
        {
          value: 1,
          label: 'word转PDF'
        },
        {
          value: 2,
          label: 'word转HTML'
        },
        {
          value: 3,
          label: 'HTML转PDF'
        },
        {
          value: 4,
          label: 'HTML转word'
        }
      ]
    }
  },
  methods: {
    handleFileChange(e) {
      if (e.target.files.length) {
        this.$refs.formDom.submit()
      }
    },
    handleFormSubmit() {
      this.$refs.formDom.submit()
    },
    handleTransferTypeChange(val) {
      this.action = ['', word2pdf, wordToHtml, html2pdf, html2word][val]
    }
  }
}
</script>

<style lang='scss'>
.file-store-mng-page {
  .form-container {
    max-width: 600px;
    margin-top: 10px;
  }
  .form-btn {
    padding-left: 110px;
  }
  .file-upload-container {
    position: relative;
    overflow: hidden;
    width: 80px;
    .file-upload-form {
      position: absolute;
      top: 0;
      left: 0;
      width: 80px;
      height: 100%;
      cursor: pointer;
      opacity: 0;
    }
  }
}

</style>
