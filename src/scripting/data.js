(() => {
    // handle cut scene data
    "use strict";

    const CHAPTER_LIST = [
        {
            name : "Prologue",
            episodes : 3
        },
        {
            name : "Chapter of Memories",
            episodes : 7
        }
    ];

    function getChapterName (chapter, episode) {
        return setup.chapters.story.main[chapter].episodes[episode - 1].name;
    }

    function loadChapter (chapter, episode) {
        const chapterData = State.variables.chapter = setup.chapters.story.main[chapter].episodes[episode - 1];
        
        return chapterData;
    }

    function createLi () {
        return $(document.createElement("li"));
    }

    function createA (text, ch, ep) {
        return $(document.createElement("a"))
            .attr({
                "data-ch" : ch,
                "data-ep" : ep,
                "data-current" : text
            })
            .wiki(text);
    }

    function listAvailableEpisodes () {
        const $ul = $(document.createElement("ul")).addClass("chapter-select");
        CHAPTER_LIST.forEach( (chapter, idx) => {
            for (let i = 1; i <= chapter.episodes; i++) {
                const curr = getChapterName(idx, i);
                const $a = createA(curr, idx, i);
                const check = State.variables.completed.includes(curr);
                const $checkmark = $(document.createElement("span")).append(" &check; ").appendTo($a).hide();
                if (check) {
                    $checkmark.show();
                }
                const $li = createLi().append($a);
                $ul.append($li);

                $a.ariaClick({ label : "Play this chapter!" }, function () {
                    const $self = $(this);
                    const loaded = State.variables.loaded = {
                        current : $self.attr("data-current"),
                        chapter : Number($self.attr("data-ch")),
                        episode : Number($self.attr("data-ep"))
                    }
                    loadChapter(loaded.chapter, loaded.episode);
                    Engine.play("Chapter Start")
                });
            }
        });
        return $ul;
    }

    window.Data = Object.assign(window.Data, {
        chapter : loadChapter,
        listChapters : listAvailableEpisodes
    });

    Macro.add("listchapters", {
        skipArgs : true,
        handler : function () {
            $(this.output).append(listAvailableEpisodes);
        }
    });

})();