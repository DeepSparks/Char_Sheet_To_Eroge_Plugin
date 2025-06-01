export const variables = [
    {
        title: "Risu 커스텀 CSS",
        description: "플러그인 전용으로 만들어진 커스텀 CSS 입니다. '소리 및 디스플레이 > 기타 > 커스텀 CSS'에 붙여넣기해서 적용할 수 있습니다.",
        value: `.chattext p {
    color: white;
    font-weight: bolder;
    font-size: 30px;
    line-height: 1.2em;
    text-shadow: -2px 0px black, 0px 2px black, 2px 0px black, 0px -2px black;
}

.chattext mark[risu-mark=quote2]{
    color: skyblue;
}

.chattext mark[risu-mark=quote1]{
    color: orange;
}`
    }
]