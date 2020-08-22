<template>
  <div class="app-content app-content--quote file-store-mng-page">
    <quote text="文件上传下载测试" icon="file-store" />
    <div class="app-content-wrapper">
      <div class="content">
        <form-create v-model="fApi" class="form-container" :rule="formRules" :option="formOptions" />
        <div class="form-btn">
          <el-button type="primary" @click="handleFormSubmit">保存</el-button>
          <el-button v-if="fileConfigId" type="danger" @click="handleFormDelete">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fileConfigList,
  fileConfigAdd,
  fileConfigUpdate,
  fileConfigDelete
} from "api/file-system.js";
import Quote from "components/Quote";
export default {
  components: {
    Quote
  },
  data() {
    return {
      fApi: null,
      formRules: [
        {
          type: "select",
          title: "存储类型",
          field: "storageType",
          validate: this.formValidate({ required: true }),
          options: [
            {
              value: 1,
              label: "本地"
            },
            {
              value: 2,
              label: "HDFS(分布式文件系统)"
            },
            {
              value: 3,
              label: "OSS"
            }
          ],
          on: {
            change: this.handleStorageTypeChange
          }
        },
        {
          type: "input",
          title: "存储路径",
          field: "rootPath",
          validate: this.formValidate({ required: true })
        },
        {
          type: "input",
          title: "备注",
          field: "remark",
          props: {
            type: "textarea"
          }
        }
      ],
      formOptions: {
        form: {
          labelWidth: "110px"
        },
        submitBtn: {
          show: false
        }
      },
      fileConfigId: null
    };
  },
  created() {
    this.getFileStoreConfig();
  },
  methods: {
    getFileStoreConfig() {
      fileConfigList({
        dto: {},
        pageSize: 10,
        pageCurrent: 0
      })
        .then(({ data }) => {
          if (data && Array.isArray(data.records) && data.records.length) {
            const {
              id,
              storageType,
              rootPath,
              ossConfig,
              remark,
              sysVersion
            } = data.records[0];
            this.sysVersion = sysVersion;
            this.fileConfigId = id;
            if (storageType === 3) {
              this.prependOssConifgFeild();
            }
            this.$nextTick(() => {
              this.fApi.setValue({
                storageType,
                rootPath,
                ossConfig,
                remark
              });
              // this.fApi.clearValidateState()
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    prependOssConifgFeild() {
      this.fApi.prepend(
        {
          type: "input",
          title: "OSS存储配置",
          field: "ossConfig",
          props: {
            type: "textarea",
            rows: 3
          },
          validate: this.formValidate({ required: true })
        },
        "remark"
      );
    },
    handleFormSubmit() {
      this.fApi.validate(valid => {
        if (valid) {
          if (this.fileConfigId) {
            fileConfigUpdate(
              {
                id: this.fileConfigId,
                sysVersion: this.sysVersion,
                sysTenantId: 1,
                ...this.fApi.formData()
              },
              { showLoading: true }
            )
              .then(res => {
                this.$showToast("保存成功！", "success");
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            fileConfigAdd(
              {
                sysTenantId: 1,
                ...this.fApi.formData()
              },
              { showLoading: true }
            )
              .then(res => {
                this.$showToast("保存成功！", "success");
                this.getFileStoreConfig();
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      });
    },
    handleFormDelete() {
      this.$confirm(`确定删除吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fileConfigDelete(
            {
              id: this.fileConfigId
            },
            { showLoading: true }
          )
            .then(res => {
              this.$showToast("删除成功！", "success");
              this.fApi.resetFields();
              this.fileConfigId = null;
            })
            .catch(() => {});
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleStorageTypeChange(val) {
      if (val === 3) {
        this.prependOssConifgFeild();
      } else {
        this.fApi.removeField("ossConfig");
      }
    }
  }
};
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
}

</style>
