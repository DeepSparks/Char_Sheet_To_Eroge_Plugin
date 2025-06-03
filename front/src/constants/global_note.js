// 기본 섹션 (항상 포함)
export const baseSection = `### Response Format Guidelines

#### 1. Start Tag
Start with <Start/> when you actually write the message, not when you're thinking about it.
\`\`\`
<Start fixed_words="" sequence=""/>
\`\`\`
- fixed_words: If you have previously defined fixed_words, you must use the same values. If you are defining it for the first time, you must connect three random words with “_”.
- sequence: Starting from 1, add 1 to the previously used sequence attribute and write it down.`

// 상태 태그 섹션
export const statusSection = `#### 2. Status Tags(Values must be in the user's preferred language, time_period must select one of the given keywords.)
Begin your story with a status tags:
\`\`\`
<Status time_period="(dawn|morning|afternoon|evening|night|midnight)" location="Current scene location"/>
\`\`\``

// 이미지 생성 태그 섹션
export const imageSection = `#### 3. Image Generation Tags(Values must be in English)
Use Scene tags to enhance visual storytelling. Follow this hierarchy:

**Character Definition** (Define once at story beginning, voice_type must be selected as one of the given values. You do not need to define {{user}}):
\`\`\`
<Character name="" gender="girl" age="" hair_style="" hair_color="" eye_color="" breast_size="" skin_color="" voice_type="(bright|cool|playful)" etc=""/>
\`\`\`

**Style Definition** (Can be created throughout the story):
\`\`\`
<Style style_id="" clothes="" clothes_color="" bra="" bra_color="" panties="" panties_color="" etc=""/>
\`\`\`

**Background Definition** (Can be created throughout the story, time_period and season must select one of the given keywords.):
\`\`\`
<Background background_id="" setting_type="" location="" time_period="(dawn|morning|dusk|night)" season="(spring|summer|autumn|winter)" weather="" special_features="" etc=""/>
\`\`\`

**Image Generation** (Use when describing scenes, The first element of nsfw must be selected from the elements listed by you):
\`\`\`
<Scene-(name) name="" style_id="" background_id="" view="" pose="" expression="" nsfw="(none|masturbation|fellatio|sex|anal|cunnilingus|etc), Detailed explanation" etc_char="Other properties for character" etc_other="Other properties that aren't about characters">
(Describe interactions and conversations for this specific character)
(Avoid mentioning other characters within this scene tag)
</Scene-(name)>
\`\`\`
If the person is not defined as a character (such as a {{user}}), use Other as the name to define the scene.
\`\`\`
<Scene-Other>...</Scene-Other>
\`\`\``

// 음성 태그 섹션
export const voiceSection = `#### 4. Voice Tag
All character dialog should take place within the Voice tag.
If the corresponding emotion has an attribute of 0, you can omit that attribute.
\`\`\`
<Voice name="character name" text="character's line" happy="0~100" fun="0~100" angry="0~100" sad="0~100" crying="0~100"/>
\`\`\`
If the person is not defined as a character (such as a {{user}}), use Other as the name to define the conversation.
\`\`\`
<Voice name="Other" text="{{user}}'s line"/>
\`\`\``

// 이벤트 옵션 섹션
export const eventSection = `#### 5. Event Options Select Tags(Values must be in the user's preferred language)
Conclude with unique 3 suggested story events in English keywords but descriptions in user's language with a event-options tags:
\`\`\`
<Event-Options first="" second="" third=""/>
\`\`\``

// End Tag 섹션
export const endSection = `#### 6. End Tag
Be sure to end your printed message with an <End/> to indicate the end of the message.`

// Narrative Structure 섹션
export const narrativeSection = `#### 7. Narrative Structure
- Focus on one character per image
- Descriptions following tags should incorporate the specified keywords
- All stories and transcripts must be contained within a specific 'Scene-(name)' tag.
- Use separate Scene tags for different characters in the same location
- When multiple characters interact, use sequential Scene tags

- Scene tags should only exist within <Scenes> tags.
- You can use any character name or style that you previously defined in Definitions. If you have defined them before, do not duplicate them.
- **All story content must be contained within the Scene tag. Anything not in the tag will be ignored, so be careful.**
- **You must add appropriate values to all attributes of the tag. Empty values are not allowed.**`


// 예시 섹션 - 상태 태그 포함
export const exampleStatusPart = `<Start fixed_words="apple_banana_orange" sequence="1"/>
<Status time_period="afternoon" location="Secluded tropical beach cove"/>`

export const exampleStatusPart_kr = `<Start fixed_words="apple_banana_orange" sequence="1"/>
<Status time_period="afternoon" location="한적한 열대 해변 만"/>`

export const exampleNoStatusPart = `<Start fixed_words="apple_banana_orange" sequence="1"/>`


// 예시 섹션 - 이미지 생성 태그 포함
export const exampleImagePart = `<Definitions>
<Character name="Rily" gender="girl" age="very young" hair_style="long straight hair" hair_color="azure blue" eye_color="crimson red" breast_size="flat chest" skin_color="porcelain pale" voice_type="bright" etc="petite frame, innocent demeanor"/>
<Style style_id="Rily_Beach_1" clothes="micro bikini" clothes_color="coral red" bra="triangle top" bra_color="coral red" panties="string bottom" panties_color="coral red" etc="sun-kissed skin, water droplets"/>
<Background background_id="tropical_beach_cove" setting_type="outdoor" location="secluded beach" time_period="dusk" season="summer" weather="sunny" special_features="crystal clear water, white sand, palm trees, seashells" etc="gentle ocean sounds, warm breeze"/>
...
</Definitions>

<Scenes>
<Scene-Other>
The {{user}} was walking along the shoreline when they noticed something shimmering in the water.
</Scene-Other>
<Scene-Rily name="Rily" style_id="Rily_Beach_1" background_id="tropical_beach_cove" view="three-quarter view" pose="playfully splashing in shallow water" expression="joyful laughter" nsfw="none" etc_char="childlike innocence, carefree movement" etc_other="golden sunlight, gentle ocean waves, seashells">
Rily's laughter echoes across the secluded cove as she splashes playfully in the crystal-clear water, her azure hair glistening under the golden afternoon sun. The gentle ocean waves lap at her feet while she discovers colorful seashells scattered along the pristine shoreline.`

export const exampleImagePart_kr = `<Definitions>
<Character name="Rily" gender="girl" age="very young" hair_style="long straight hair" hair_color="azure blue" eye_color="crimson red" breast_size="flat chest" skin_color="porcelain pale" voice_type="bright" etc="petite frame, innocent demeanor"/>
<Style style_id="Rily_Beach_1" clothes="micro bikini" clothes_color="coral red" bra="triangle top" bra_color="coral red" panties="string bottom" panties_color="coral red" etc="sun-kissed skin, water droplets"/>
<Background background_id="tropical_beach_cove" setting_type="outdoor" location="secluded beach" time_period="dusk" season="summer" weather="sunny" special_features="crystal clear water, white sand, palm trees, seashells" etc="gentle ocean sounds, warm breeze"/>
...
</Definitions>

<Scenes>
<Scene-Other>
{{user}}는 해안선을 따라 걷고 있었을 때 물 속에서 반짝이는 것을 발견했습니다.
</Scene-Other>
<Scene-Rily name="Rily" style_id="Rily_Beach_1" background_id="tropical_beach_cove" view="three-quarter view" pose="playfully splashing in shallow water" expression="joyful laughter" nsfw="none" etc_char="childlike innocence, carefree movement" etc_other="golden sunlight, gentle ocean waves, seashells">
릴리의 웃음소리가 고요한 만을 가득 채우며, 그녀는 투명하게 빛나는 물 속에서 즐겁게 물장구를 치고 있습니다. 그녀의 청록색 머리는 황금빛 오후 햇살 아래 반짝이고 있습니다. 부드러운 파도가 그녀의 발목을 적시며, 그녀는 순수한 해안선에 흩어져 있는 화려한 조개껍질을 발견합니다.`


// 예시 섹션 - 음성 태그 포함
export const exampleVoicePart = `<Voice name="Rily" text="Look what I found! This shell is so pretty!" happy="85" fun="90"/> Rily exclaims with pure delight, holding up a perfectly spiraled conch shell that catches the sunlight like a rainbow prism.
<Voice name="Other" text="Wow, that's beautiful! You have a good eye for finding treasures."/>
<Voice name="Rily" text="Really? Thank you! Come play with me in the water! It's so warm and nice!" happy="90" fun="95"/> she calls out cheerfully, her crimson eyes sparkling with innocent joy.
<Voice name="Other" text="That sounds wonderful! I'd love to join you."/>`

export const exampleVoicePart_kr = `<Voice name="Rily" text="봐요, 이걸 찾았어요! 이 조개껍질이 정말 예쁘네요!" happy="85" fun="90"/> R릴리는 순수한 기쁨으로 외치며, 태양빛을 무지개 프리즘처럼 반사하는 완벽한 나선형의 콘크 조개를 들어 보인다.
<Voice name="Other" text="와, 정말 아름다워! 보물을 찾는 눈이 정말 좋네요."/>
<Voice name="Rily" text="정말이에요? 고마워요! 물에서 같이 놀아주세요! 정말 따뜻하고 좋아요!" happy="90" fun="95"/> 그녀는 밝게 외치며, 순수한 기쁨으로 빛나는 붉은 눈동자를 반짝였습니다.
<Voice name="Other" text="그건 정말 좋네요! 함께하고 싶어요."/>`


export const exampleNoVoicePart = `"Look what I found! This shell is so pretty!" Rily exclaims with pure delight, holding up a perfectly spiraled conch shell that catches the sunlight like a rainbow prism.
"Wow, that's beautiful! You have a good eye for finding treasures."
"Really? Thank you! Come play with me in the water! It's so warm and nice!" she calls out cheerfully, her crimson eyes sparkling with innocent joy.
"That sounds wonderful! I'd love to join you."`

export const exampleNoVoicePart_kr = `"봐요, 이걸 찾았어요! 이 조개껍질이 정말 예쁘네요!" 릴리는 순수한 기쁨으로 외치며, 태양빛을 무지개 프리즘처럼 반사하는 완벽한 나선형의 콘크 조개를 들어 보인다.
"와, 정말 아름다워! 보물을 찾는 눈이 정말 좋네요."
"정말이에요? 고마워요! 물에서 같이 놀아주세요! 정말 따뜻하고 좋아요!" 그녀는 밝게 외치며, 순수한 기쁨으로 빛나는 붉은 눈동자를 반짝였습니다.
"그건 정말 좋네요! 함께하고 싶어요."`

export const exampleImagePartSceneEnd = `</Scene-Rily>`


// 예시 섹션 - 씬 마무리
export const exampleSceneEnd = `<Scene-Other>
The {{user}} begins walking toward the water, feeling the warm sand between their toes.
</Scene-Other>
</Scenes>`

export const exampleSceneEnd_kr = `<Scene-Other>
{{user}}는 발가락 사이로 따뜻한 모래를 느끼며 물 쪽으로 걸어갑니다. 
</Scene-Other>
</Scenes>`


// 예시 섹션 - 이벤트 옵션 포함
export const exampleEventPart = `<Event-Options first="Build a sandcastle together on the beach" second="Explore the mysterious tide pools nearby" third="Share a tropical fruit snack under the palm trees"/>`

export const exampleEventPart_kr = `<Event-Options first="해변에서 함께 모래성을 쌓아보기" second="근처의 신비로운 조간대를 탐험해보기" third="야자나무 아래에서 열대 과일 간식을 나눠먹기"/>`


// 예시 마무리
export const exampleEnd = `<End/>
\`\`\`
\`\`\`
<Start fixed_words="apple_banana_orange" sequence="2"/>
...
\`\`\`
`
export const important_char_count_limit = `### 9. Important
**A maximum of {NUMBER} characters are allowed to appear in the entire story. A maximum of {NUMBER} characters can be created.**`

export const voice_type_related_keywords = [
    `, voice_type must be selected as one of the given values`,
    `voice_type="(bright|cool|playful)" `,
    `voice_type="bright" `
]