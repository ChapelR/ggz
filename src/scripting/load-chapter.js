(() => {
    // handle cut scene data
    "use strict";

    const CHAPTER_LIST = [
        {
            name : "Prologue",
            episodes : 3,
            index : 0,
            done : true
        },
        { // done
            name : "Chapter of Memories",
            episodes : 8,
            index : 1,
            done : true
        },
        {
            name : "Haunted House",
            episodes : 7,
            index : 2,
            done : false
        },
        { // done
            name : "Sakura",
            episodes : 1,
            index : 3,
            done : true
        },
        {
            name : "Chapter of Birth",
            episodes : 1,
            index : 4,
            done : false
        },
        {
            name : "Lost Child",
            episodes : 3,
            index : 12,
            done : true
        }
    ];

    function getChapterName (index, episode) {
        return setup.chapters.story.main[index].episodes[episode - 1].name;
    }

    function loadChapter (index, episode) {
        const chapterData = State.variables.chapter = setup.chapters.story.main[index].episodes[episode - 1];
        
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
        const $wrapper = $(document.createElement("div"));
        const $label = $(document.createElement("label"))
            .attr("for", "chapter");
        const $selector = $(document.createElement("select"))
            .attr("name", "chapter");
        $wrapper.append($label);
        $label.append($selector);

        CHAPTER_LIST.forEach( (chapter, idx) => {
            if (!chapter.done && !setup.isDebug()) {
                return;
            }
            idx = chapter.index || idx;
            let $ul = $(document.createElement("ul"))
                .addClass("chapter-select")
                .attr("data-chapter", idx);

            if (idx !== 0) {
                $ul.hide();
            }

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

                /* jshint ignore:start */
                $a.ariaClick({ label : "Play this chapter!" }, function () {
                    const $self = $(this);
                    const loaded = State.variables.loaded = {
                        current : $self.attr("data-current"),
                        chapter : Number($self.attr("data-ch")),
                        episode : Number($self.attr("data-ep"))
                    };
                    loadChapter(loaded.chapter, loaded.episode);
                    Engine.play("Chapter Start");
                });
                /* jshint ignore:end */
            }
            $selector.append( $(document.createElement("option"))
                .attr("value", idx)
                .append(chapter.name + ((!chapter.done && setup.isDebug()) ? " [DEBUG]" : "")));
            $wrapper.append($ul);
        });
        $selector.on("change", () => {
            let selected = Number($selector.val());
            if (typeof selected !== "number" || Number.isNaN(selected)) {
                selected = 0;
            }
            $wrapper
                .find("ul")
                .hide();
            $wrapper
                .find("ul[data-chapter='" + selected + "']")
                .show();
        });
        return $wrapper;
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