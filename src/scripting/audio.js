(() => {
    "use strict";

    // effects

    SimpleAudio.tracks.add("open", "sdk/audio/open.mp3");
    SimpleAudio.tracks.add("close", "sdk/audio/close.mp3");
    SimpleAudio.tracks.add("select", "sdk/audio/select.mp3");
    SimpleAudio.tracks.add("tab", "sdk/audio/tab.mp3");
    SimpleAudio.loadWithScreen(); // load effects

    // music

    SimpleAudio.tracks.add("001", "bgm/BGM_001_SHOPSATION.ogg");
    SimpleAudio.tracks.add("002", "bgm/BGM_002_BGM_1.ogg");
    SimpleAudio.tracks.add("003", "bgm/BGM_003_BGM_1_BANG.ogg");
    SimpleAudio.tracks.add("004", "bgm/BGM_004_BGM_2.ogg");
    SimpleAudio.tracks.add("005", "bgm/BGM_005_BGM_3.ogg");
    SimpleAudio.tracks.add("006", "bgm/BGM_006_BGM_4.ogg");
    SimpleAudio.tracks.add("007", "bgm/BGM_007_SHRINE.ogg");
    SimpleAudio.tracks.add("008", "bgm/BGM_008_DIVA.ogg");
    SimpleAudio.tracks.add("011", "bgm/BGM_011_LIGHTING.ogg");

    
    SimpleAudio.tracks.add("035", "bgm/BGM_035_DARKEN_3.ogg");
    
    SimpleAudio.tracks.add("064", "bgm/BGM_064_CHILDDREAM.ogg");
    SimpleAudio.tracks.add("065", "bgm/BGM_065_NIGHTMARE.ogg");

})();