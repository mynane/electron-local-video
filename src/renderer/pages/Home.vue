<template>
  <div id="wrapper" class="wrapper">
      <div class="video-test">
        <video
        id="video-player"
        class="video-js"
        controls
        preload="auto"
        data-setup="{}"
        ref="player"
        >
      </video>
    </div>
    <div class="toolbar-header drag">
      <div class="drag left">
        <Frame />
      </div>
      <div class="drag title"><span class="no-drag">{{active.filename}}</span></div>
      <div class="handle drag right">
        <span class="handle-icon"><i class="el-icon-upload2 no-drag" @click="selectFile"></i></span>
        <span class="handle-icon"><i class="el-icon-film no-drag" @click="drawer = true"></i></span>
      </div>
    </div>
    <el-drawer
      title="视频列表"
      :visible.sync="drawer"
      direction="rtl"
    >
      <ul>
        <li class="file-item" v-for="item in files" :key="item.uri" :class="{active: item.filename === active.filename}" @click="play(item)">{{item.filename}}</li>
      </ul>
    </el-drawer>
</div>
</template>

<script>
// import videojs from 'video.js';
const path = require('path');
import localStore from '../../shared/localStore';
import getJsonFiles from '../../shared/getJsonFiles';
import Frame from '@/components/Frame';
import 'video.js/dist/video-js.css';

export default {
  name: 'Home',
  components: {Frame},
  data() {
    return {
      files: getJsonFiles(localStore.get('files', '')),
      player: null,
      drawer: false,
      active: localStore.get('active', {})
    }
  },
  methods: {
    async play(_file) {
      this.player.src(_file.uri)
      this.player.defaultPlaybackRate(localStore.get('playbackRate', 1))
      this.player.play()
      this.active = _file
      localStore.set('active', _file)
    },
    async selectFile(){
      const dialog = this.$electron.remote.dialog;
      const files = dialog.showOpenDialog({
        properties: ['openDirectory'],
        filters: {
          "name": "video",
          "extensions": ['mp4'],
        }
      });
      if (files && files.length) {
        localStore.set('files', files[0])
        this.files = getJsonFiles(localStore.get('files', ''))
      }
      
    },
  },
  mounted() {
    const videoPlayerEle = this.$refs.player;
    this.player = videojs(videoPlayerEle, {
      // autoplay: true,
      playbackRates: [0.5, 1, 1.5, 2],
    });
    this.player.defaultPlaybackRate(localStore.get('playbackRate', 1))

    this.player.on("ratechange", (e) => {
      localStore.set('playbackRate', this.player.playbackRate())
    });
    this.player.on("timeupdate",(e) =>{
      localStore.set('currentTime', this.player.currentTime())
    })

    if (this.active && this.files.length) {
      const [_file] = this.files.filter(item => item.filename === this.active.filename)

      if (_file) {
        this.player.src(_file.uri);
        this.player.currentTime(localStore.get('currentTime', 0))
      }
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body { font-family: 'Source Sans Pro', sans-serif; }
.el-drawer__body {
  height: calc(100% - 30px);
  overflow-y: auto;
}
#wrapper {
  background:
  radial-gradient(
  ellipse at top left,
  rgba(255, 255, 255, 1) 40%,
  rgba(229, 229, 229, .9) 100%
  );
  height: 100vh;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 25%;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.toolbar-header, .toolbar-bottom {
  position: absolute;
  left: 0;
  right: 0;
  color: white;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s linear;
  padding: 1vw;
  // background-image: linear-gradient(rgba(255,255,255,1), rgba(0,0,0,0.2));
}

.toolbar-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);

  & > div {
    display: flex;
    align-items: center;
  }
}

.toolbar-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6vh;
  line-height: 6vh;
}
.handle {
  & > i {
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }
}

.handle-icon {
  margin-left: 10px;
  cursor: pointer;
}

.wrapper {
  &:hover {
    .toolbar-header, .toolbar-bottom {
      visibility: visible;
      opacity: 1;
    }
  }
}

.file-item {
  color: #999;
  cursor: pointer;
  padding: 6px 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  &:hover {
    color: #409eff;
  }
}

.file-item.active {
  background-color: #409eff;
  color: white;
}

.toolbar-header {
  display: flex;
  justify-content: space-between;
}

.video-test, .video-js {
  height: 100vh;
  width: 100vw;
}

.video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.software-info{
  text-align: center;
  .slogan{
    font-size: 1.1em;
    margin-top: 20px;
  }
}
.button-wrapper{
  text-align: center;
  margin-top:  30px;
}
</style>
