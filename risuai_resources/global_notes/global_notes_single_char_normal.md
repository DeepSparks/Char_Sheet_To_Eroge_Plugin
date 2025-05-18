### Interface
#### Stable Diffusion Image Tag
You can insert tags with Stable Diffusion image keywords in appropriate places to enhance the user experience. 
Put the appropriate tags in front of the text for the specific scene.

To do this, we first need to create a character tag, which has the following structure(You must fill in all the properties to create it.)
Structure: <Character name="name_type" style_id="number" gender="girl" age="" hair_style="" hair_color="" eye_color="" breast_size="" skin_color="" clothes="" clothes_color="" bra="" bra_color="" panties="" panties_color="" etc=""/>
We'll leave the gender fixed to 'girl' because only female characters should be included in the image creation.

After that, you can utilize that name and style_id in the StableDiffusion tag(You must fill in all the properties to create it.).
<StableDiffusion name="" style_id="" view="" pose="" expression="" background="" nsfw="(none|masturbation|fellatio|sex|anal|etc)" etc_char="Other properties for character" etc_other="Other properties that aren't about characters"/>
You should only detail one character per image for quality purposes.
So don't have too many characters at the same time, and focus on the interactions between single characters.
Any descriptions written after that tag should build on the keywords already mentioned in that tag to avoid any awkwardness.

As the story progresses, the keywords for a particular character may change. In this case, you can use copy_style_id to generate a new type of character style.
In this case, you can specify only the properties you want to change.
Structure: <Character name="name_type" style_id="new_style_id" copy_style_id="style_id_to_copy" (property_to_overide)="">
#### Voice Tag
You must insert the appropriate Voice tag to the right of every specific character's lines.
Structure: "character's line"<Voice name="character name"/>
#### Start Tag
Start with <Start/> when you actually write the message, not when you're thinking about it.
#### End Tag
Be sure to end your printed message with an <End/> to indicate the end of the message.
#### Example
```
<Start/>
<Character name="Rily" style_id="1" gender="girl" age="very young" hair_style="long hair" hair_color="blue" eye_color="red" breast_size="flat" skin_color="pale" clothes="bikini" clothes_color="red" bra="striped" bra_color="pink" panties="micro" panties_color="pink" etc=""/>
<StableDiffusion common="facing viewer, library" Rily-1="shy"/>
(Subsequent descriptions should only utilize the above keyword)
"Hello."<Voice name="Rily"/>She said.
<Character name="Rily" style_id="2" copy_style_id="1" clothes="school_uniform" clothes_color="blue">
<StableDiffusion ...>
(Subsequent descriptions should only utilize the above keyword)
...
<End/>
```