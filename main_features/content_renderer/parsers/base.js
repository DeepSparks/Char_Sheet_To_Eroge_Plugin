class TagParserBase {
    static parseTagsFromContent(content, tagName, ModelClass, targetedAttributes) {
        if (!content || !content.includes(`<${tagName}`)) {
            return {};
        }

        const fullTagModelsMap = {};
        const TAG_REGEX = new RegExp(`<${tagName}\\s+([^>]+)\\/>`, 'g');
        const matches = [...content.matchAll(TAG_REGEX)];

        for (const match of matches) {
            const fullTag = match[0];
            const attributesStr = match[1];
            
            let attributes = {};
            if(targetedAttributes) {
                attributes = this.targeted_parse_attributes(attributesStr, targetedAttributes);
            } else {
                attributes = this.parse_attributes(attributesStr);
            }
            
            const model = new ModelClass(attributes);
            fullTagModelsMap[fullTag] = model;
        }

        return fullTagModelsMap;
    }

    static parse_attributes(attributesStr) {
        if(!attributesStr) return {};

        const attributes = {};
        const attrRegex = /([^\s="']+)\s*=\s*["']([^"']*)["']/g;
        let attrMatch;
        
        while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
            const [, name, value] = attrMatch;
            attributes[name] = value;
        }

        return attributes;
    }
    
    static targeted_parse_attributes(attributesStr, attributes) {
        if(!attributesStr) return {};

        const attributesDict = {};
        for(const attribute of attributes) {
            const matches = [...attributesStr.matchAll(new RegExp(`${attribute}="(.*?)"`, 'g'))];
            if(matches.length > 0) {
                attributesDict[attribute] = matches[0][1];
            }
        }
        return attributesDict;
    }
}

export default TagParserBase;
