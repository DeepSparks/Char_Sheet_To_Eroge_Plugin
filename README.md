# RisuAI Plugin Backend

A NodeJS backend server designed to enhance the RisuAI roleplaying program through the LBI plugin integration.

## Overview

This project serves as a backend server for the `lbi_to_eroge_plugin.js` plugin used with [RisuAI](https://github.com/kwaroran/RisuAI). The server handles communication between RisuAI and external services to provide text-to-speech and image generation capabilities.

## Components

### RisuAI Resources (`risuai_resources` folder)

The `risuai_resources` folder contains files needed to use this backend server with RisuAI:

- **lbi_to_eroge_plugin.js**: The plugin file that loads into RisuAI
- **custom_css.css**: Custom CSS styles for RisuAI (can be applied via 'Sound & Display > Other > Custom CSS')
- **LBI_for_plugin.png**: LBI character image for use in RisuAI
- **global_notes_lbi.md**: Extracted global notes from LBI (for reference)
- **global_notes_normal.md**: Global notes for use in non-LBI contexts

## Integrations

This backend connects with the following external services:

- **VOICEVOX**: Acts as an API server to generate text-to-speech audio
- **NovelAI**: Acts as an API server to generate images based on provided prompts

## Installation Guide

1. **Set up environment variables**:
   - Copy `env_examples/.env.novel_ai.example` to `.env` in the root folder
   - Replace the `IMAGE_GENERATION_API_KEY` value with your NovelAI API key

2. **Configure VOICEVOX**:
   - Download VOICEVOX from [the official website](https://voicevox.hiroshiba.jp/)
   - Create a shortcut to `"C:\Program Files\VOICEVOX\vv-engine\run.exe"`
   - Edit the shortcut target to: `"C:\Program Files\VOICEVOX\vv-engine\run.exe" --use_gpu --cors_policy_mode all --host 127.0.0.1`
   - Run the shortcut to start the VOICEVOX API server

3. **Start the backend server**:
   ```
   npm install
   node main.js
   ```

4. **Configure RisuAI**:
   - Load the `LBI_for_plugin.png` character image in RisuAI
   - Load the `lbi_to_eroge_plugin.js` plugin in RisuAI
   - (Optional) Copy the contents of `custom_css.css` into 'Sound & Display > Other > Custom CSS' to apply the custom styling

5. **Test the setup** to ensure everything is working properly

## Requirements

- Node.js
- VOICEVOX installed locally
- NovelAI API key
- RisuAI

## Resources

- [RisuAI Repository](https://github.com/kwaroran/RisuAI)
- [VOICEVOX Homepage](https://voicevox.hiroshiba.jp/)
- [NovelAI Website](https://novelai.net/)
