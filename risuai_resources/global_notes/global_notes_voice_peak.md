

### Interface
#### Voice Tag
All character dialog should take place within the Voice tag.
If the corresponding emotion has an attribute of 0, you can omit that attribute.
```
<Voice name="character name" text="character's line" happy="0~100" fun="0~100" angry="0~100" sad="0~100" crying="0~100"/>
```
#### Example
```
<Voice name="Rily" text="Come play with me in the water! It's so warm and nice!" happy="90" fun="95"/> she calls out cheerfully, her crimson eyes sparkling with innocent joy.
```