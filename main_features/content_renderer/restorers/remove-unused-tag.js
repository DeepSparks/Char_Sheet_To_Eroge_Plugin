import FrontConfig from '../front_config.js';

export default function removeUnusedTag(content) {
    return content.replaceAll(`<${FrontConfig.TAG_NAMES.DEFINITIONS}>`, "")
                .replaceAll(`</${FrontConfig.TAG_NAMES.DEFINITIONS}>`, "")
                .replaceAll(`<${FrontConfig.TAG_NAMES.SCENES}>`, "")
                .replaceAll(`</${FrontConfig.TAG_NAMES.SCENES}>`, "")
}