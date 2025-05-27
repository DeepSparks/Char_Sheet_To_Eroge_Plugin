import { PROGRESS_UI_STYLES } from '../constants.js';

class ProgressUIRenderer {
    static renderContent(content_status, processed_characters, processed_styles, processed_backgrounds) {
        const charCount = content_status.raw_content.length;

        const charactersHTML = this._generateProgressItemHTML(
            '캐릭터',
            content_status.is_character_tag_included,
            processed_characters,
            (item) => {
                if(!item.name) return '이름 없는 캐릭터';

                const detailInfos = this._makeDetailInfos({
                    "성별": item.gender,
                    "나이": item.age,
                    "머리": item.hair_style,
                    "머리색": item.hair_color,
                    "눈동자": item.eye_color,
                    "피부색": item.skin_color,
                    "음성타입": item.voice_type,
                    "기타": item.etc
                });

                return `${item.name} ${detailInfos}`;
            }
        );

        const stylesHTML = this._generateProgressItemHTML(
            '스타일',
            content_status.is_style_tag_included,
            processed_styles,
            (item) => {
                if(!item.style_id) return 'ID 없는 스타일';

                const detailInfos = this._makeDetailInfos({
                    "옷": item.clothes,
                    "옷색": item.clothes_color,
                    "브라": item.bra,
                    "브라색": item.bra_color,
                    "팬티": item.panties,
                    "팬티색": item.panties_color,
                    "기타": item.etc
                });

                return `${item.style_id} ${detailInfos}`;
            }
        );

        const backgroundsHTML = this._generateProgressItemHTML(
            '배경',
            content_status.is_background_tag_included,
            processed_backgrounds,
            (item) => {
                if(!item.background_id) return 'ID 없는 배경';

                const detailInfos = this._makeDetailInfos({
                    "설정타입": item.setting_type,
                    "위치": item.location,
                    "시간대": item.time_period,
                    "날씨": item.weather,
                    "특수효과": item.special_features,
                    "기타": item.etc
                })

                return `${item.background_id} ${detailInfos}`;
            }
        );
        

        let detailsHTML = '';
        if (content_status.is_character_tag_included || content_status.is_style_tag_included || content_status.is_background_tag_included) {
            detailsHTML = `
                <div class="progress-details">
                    ${charactersHTML}
                    ${stylesHTML}
                    ${backgroundsHTML}
                </div>
            `;
        }


        return PROGRESS_UI_STYLES + `<div class="progress-container">
<p class="progress-text">콘텐츠 처리 중... (현재 <span id="char-count">${charCount}</span>자 생성됨)</p>
${detailsHTML}
</div>
        `;
    }

    static _generateProgressItemHTML(itemName, isTagIncluded, processedItems, getItemDisplay) {
        let statusText = '';
        let statusClass = 'status-none';
        let itemsHTML = '';

        if (!isTagIncluded) {
            statusText = '정의 없음';
            statusClass = 'status-none';
        } else if (processedItems.length > 0) {
            statusText = `처리 완료 (${processedItems.length}개)`;
            statusClass = 'status-completed';
            itemsHTML = `<ul class="processed-items-list">`;
            processedItems.forEach(item => {
                itemsHTML += `<li>${getItemDisplay(item)} (생성됨)</li>`;
            });
            itemsHTML += `</ul>`;
        } else {
            statusText = '정의 생성중...';
            statusClass = 'status-pending';
        }

        return `
<div class="progress-item">
<span class="item-label">${itemName}:</span>
<span class="item-status ${statusClass}">${statusText}</span>
${itemsHTML}
</div>
        `;
    };

    static _makeDetailInfos(infos) {
        let result = '';
        for(let info in infos) {
            if(infos[info]) {
                result += `${info}: ${infos[info]}, `;
            }
        }
        return `(${result.slice(0, -2)})`;
    }
}

export default ProgressUIRenderer;