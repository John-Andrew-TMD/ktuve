<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container">
    <editor :init="init" class="tinymce-textarea"></editor>
  </div>
</template>

<script>
import Tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
// import "tinymce/plugins/autoresize";
// import "tinymce/plugins/fullscreen";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
// import 'tinymce/plugins/contextmenu'
import "tinymce/plugins/paste";
export default {
  name: "Tinymce",
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      tinymceInstance: null,
      init: {
        language_url: "/tinymce/zh_CN.js",
        language: "zh_CN",
        skin_url: "/tinymce/skins/ui/oxide",
        convert_urls: false,
        height: '100%',
        menubar: false,
        statusbar: false,
        toolbar_drawer: 'sliding',
        plugins: "table code paste",
        // autoresize_min_height: 300,
        autoresize_bottom_margin: 10,
        // extended_valid_elements: '@[class|name|title|readonly|onclick]',
        valid_elements : '*[*]',
        paste_data_images: false,
        paste_word_valid_elements: "b,strong,i,em,h1,h2",
        toolbar_items_size: "small",
        toolbar: `undo redo | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | table | removeformat code fullscreen`,
        fontsize_formats: '10pt 12pt 13pt 14pt 15pt 16pt 18pt 20pt 24pt 36pt 48pt',
        branding: false,
        content_style: `
          * { padding:0; margin:0; }
          ::-webkit-scrollbar {width: 6px; height: 6px;}
          ::-webkit-scrollbar-thumb {min-height: 28px; background-color: #C2C2C2; background-clip: padding-box;}
          ::-webkit-scrollbar-thumb:hover {background-color: #A0A0A0;}
          body { margin: 0 !important; padding: 10px !important; font-size: 14px; }
          img { max-width:100%;height:auto; }
          a { text-decoration: none; }
          input { width: 150px; height: 26px; vertical-align: text-bottom; transform: translateY(3px); padding: 0 10px; border-radius: 3px; border: 1px solid #DCDFE6; line-height: 26px; display: inline-block; transition: border-color 0.2s;font-family: inherit;box-sizing:border-box;}
          input[type=radio], input[type=checkbox] { width: auto;border: none;margin-right: 3px; height: 24px; }
          textarea { width: 50%; vertical-align: middle; padding: 0 10px; border-radius: 3px; border: 1px solid #DCDFE6; line-height: 24px; transition: border-color 0.2s; font-family: inherit; box-sizing: border-box;}
          input:focus, textarea:focus, select:focus { outline: none; border: 1px solid #409EFF; }
          select { width: 150px; height: 26px; padding: 0 5px; text-bottom; transform: translateY(3px); border-radius: 3px; border: 1px solid #DCDFE6; line-height: 26px; display: inline-block; transition: border-color 0.2s;box-sizing:border-box;}
          iframe { width: 100%; }
          p { line-height:1.5; margin-top: 5px; }
          label +label {margin-left: 5px;}
          table { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
          .mce-object-iframe { width:100%; box-sizing:border-box; margin:0; padding:0; }
          ul,ol { list-style-position:inside; }
          th { font-weight: 400; padding: 7px 5px; background: #F7F7F7; }
          td { text-align: center; padding: 7px 5px; }
          td input { width: 120px }
          .custom-add, .custom-delete { cursor: pointer; color: #409EFF; user-select: none; }
          .custom-delete { color: #f00 }
          `,
        init_instance_callback: editor => {
          setTimeout(() => {
            this.tinymceInstance = editor
            if (this.value) {
              editor.setContent(this.value);
            }
            this.hasInit = true;
            editor.on("SetContent", () => {
              this.$emit("setContent");
            });
            // editor.on("NodeChange Change KeyUp SetContent", () => {
            //   this.hasChange = true;
            //   this.$emit("input", editor.getContent());
            // });
            editor.on("click", e => {
              this.$emit('click', e)
            });
            editor.on("KeyUp", e => {
              this.$emit('keyup', e)
            });
          }, 20)
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", e => {
            this.fullscreen = e.state;
          });
        }
      }
    };
  },
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      type: String,
      default: "file edit insert view format table"
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto"
    }
  },
  watch: {
    value(val) {
      if (this.hasInit) {
        this.$nextTick(() => this.setContent(val || ""));
      }
    },
    tinymceInstance(obj) {
      if(!obj) return
      this.$emit('update:tinymceInstance', obj)
    }
  },
  mounted() {
    // this.initTinymce();
  },
  activated() {
    if (Tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    initTinymce() {
      Tinymce.init({});
    },
    destroyTinymce() {
      const tinymce = this.tinymceInstance
      if (this.fullscreen) {
        tinymce && tinymce.execCommand("mceFullScreen");
      }

      tinymce && tinymce.destroy();
    },
    setContent(value) {
      this.tinymceInstance.setContent(value);
    },
    getContent() {
      this.tinymceInstance.getContent();
    }
  }
};
</script>
<style lang="scss">
.tinymce-container {
  height: 100%;
  textarea {
    display: none;
  }
  .tox-tinymce {
    border: 1px solid #EEEEEE;
  }
  .tox {
    .tox-toolbar__primary, .tox-toolbar__overflow {
      background: #EEEEEE;
    }
    .tox-tbtn svg {
      fill: #515151;
    }
    .tox-tbtn--disabled svg {
      opacity: .4;
    }
    .tox-tbtn {
      width: 28px;
      height: 28px;
    }
    .tox-split-button__chevron {
      width: 16px;
    }
    .tox-tbtn--select {
      width: auto;
    }
    .tox-tbtn--bespoke {
      width: 100px;
      background: #FFFFFF;
    }
  }
  .tox:not([dir=rtl]) .tox-toolbar__group:not(:last-of-type) {
    border: none;
  }
}

</style>
