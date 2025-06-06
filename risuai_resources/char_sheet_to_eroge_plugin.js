//@name char_sheet_to_eroge_plugin
//@display-name Char Sheet to Eroge Plugin v5.0.4

const CONFIG = {
    BACKEND_URL: "http://127.0.0.1:3000",
    START_TAG_NAME: "Start"
};


class PluginBackend {
    static async jsonPostRequest(url, jsonData) {
        try {
            const response = await nativeFetch(`${CONFIG.BACKEND_URL}/${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonData)
            });
            return response.json();
        } catch (error) {
            console.error(`API Request Error (${url}):`, error);
            throw error;
        }
    }

    static async addToLog(log, type = 'info') {
        await this.jsonPostRequest("addToLog", { log, type });
    }

    static async renderContent(content) {
        return (await this.jsonPostRequest("renderContent", { content })).result;
    }
}


async function handleDisplay(content) {
    try {
        if(!content.match(new RegExp(`<${CONFIG.START_TAG_NAME}.*\/>`)))
            return content;

        const renderedContent = await PluginBackend.renderContent(content);
        return renderedContent;
    } catch (error) {
        PluginBackend.addToLog("[PLUGIN] Error while displaying content: " + error.message + '\n' + error.stack, "error");
        return content;
    }
}


function initializePlugin() {
    addRisuScriptHandler("display", handleDisplay);
    PluginBackend.addToLog("[PLUGIN] LBI to Eroge Plugin loaded! Use Scene tag or Voice tag in messages to render display content.", "info");
}

function uninitializePlugin() {
    removeRisuScriptHandler("display", handleDisplay);
    PluginBackend.addToLog("[PLUGIN] LBI to Eroge Plugin unloaded.", "info");
}


initializePlugin();
onUnload(uninitializePlugin);