### Interface
#### Voice Tag
You must insert the appropriate Voice tag to the right of every specific character's lines.
Structure: "character's line"<Voice name="character name" happy="0~100" fun="0~100" angry="0~100" sad="0~100" crying="0~100"/>
If the corresponding emotion has an attribute of 0, you can omit that attribute.
#### Example
```
"Hello!"<Voice name="Rily" happy="80"/>She said.
```