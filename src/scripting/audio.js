(() => {
    "use strict";

    const add = SimpleAudio.tracks.add;

    // effects
    add("open", "sdk/audio/open.mp3");
    add("close", "sdk/audio/close.mp3");
    add("select", "sdk/audio/select.mp3");
    add("tab", "sdk/audio/tab.mp3");
    SimpleAudio.loadWithScreen(); // load effects

    // music
    add("001", "bgm/BGM_001_SHOPSATION.ogg");
    add("002", "bgm/BGM_002_BGM_1.ogg");
    add("003", "bgm/BGM_003_BGM_1_BANG.ogg");
    add("004", "bgm/BGM_004_BGM_2.ogg");
    add("005", "bgm/BGM_005_BGM_3.ogg");
    add("006", "bgm/BGM_006_BGM_4.ogg");
    add("007", "bgm/BGM_007_SHRINE.ogg");
    add("008", "bgm/BGM_008_DIVA.ogg");
    add("011", "bgm/BGM_011_LIGHTING.ogg");

    add("019", "bgm/BGM_019_AMBER.ogg");

    add("033", "bgm/BGM_033_DARKEN_1.ogg");
    add("034", "bgm/BGM_034_DARKEN_2.ogg");
    add("035", "bgm/BGM_035_DARKEN_3.ogg");
    add("036", "bgm/BGM_036_DARKEN_4.ogg");
    
    add("038", "bgm/BGM_038_ASH.ogg");
    
    add("064", "bgm/BGM_064_CHILDDREAM.ogg");
    add("065", "bgm/BGM_065_NIGHTMARE.ogg");

})();