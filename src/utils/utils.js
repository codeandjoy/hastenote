export const validateNoteTags = (note) => {
    return {
        ...note,
        tags: note.tags
            .split(" ")
            .map(tag => {
                if(tag !== "" && tag.charAt(0) !== "#") return "#"+tag;
                return tag;
            })
            .join(" ")
    }
}