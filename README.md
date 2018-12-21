# VSFormBuilder
VSFormBuilder is a simple and light weight javascript libarary used to create html forms on the go.

| File | Size |
| ------ | ------ |
| [VSFormBuilder.js] [VSFBJS] | 28kb |
| [VSFormBuilder.min.js] [VSFBMJS] | 13kb |

### Installation
> This Libarray Requires ***jQuery***

***Production Env***
```HTML
<script src="https://raw.githubusercontent.com/technofreaky/VSFormBuilder/master/vsformbuilder.min.js"></script>
```

***Development Env***
```HTML
<script src="https://raw.githubusercontent.com/technofreaky/VSFormBuilder/master/vsformbuilder.js"></script>
```


# Features!
 
#### Supported Tags
VSFormBuilder Currently Support below listed html Tags for generating forms.
#### HTML Tags
> **form**
**fieldset**
**label** 
**p** - Used For Field Wrap
**span** - Used For Field Help Text

#### Input Types
> **textarea** , **text**,  **password**, **search**, **email**, **url**, **tel**, **number**, **range**, **date** ,**month**, **week**, **time**, **datetime**, **datetime_local**, **color**, **file**, **radio**, **checkbox**, **select**


### Usage
The below code will use **VSFormBuilder** and generate 2 textfields and radio field with 3 options.
```javascript
jQuery(document).ready(function(){
    var VSFB = new VSFormBuilder();
    var textfield = VSFB.text({ name : 'my_textfield', value:"MY Value"});
    jQuery('body').append(textfield);
    VSFB.add('form_start',{class: "",action:""});
    VSFB.add("text",{name : 'text_2', value:"MY Value" , id:"MYTEXTFIELD"});
    VSFB.add("radio",{name : 'text_2', options:{option1 : "Option 1",option2 : "Option 2",option3: "Option 3"} , id:"MYTEXTFIELD"});
    VSFB.add('form_end');
    jQuery('body').append(VSFB.generate());
})
```



License
----

MIT

   [VSFBJS]: <https://raw.githubusercontent.com/technofreaky/VSFormBuilder/master/vsformbuilder.js>
   [VSFBMJS]: <https://raw.githubusercontent.com/technofreaky/VSFormBuilder/master/vsformbuilder.min.js>


---
## Sponsored By
[![DigitalOcean](https://vsp.ams3.cdn.digitaloceanspaces.com/cdn/DO_Logo_Horizontal_Blue.png)](https://s.svarun.in/Ef)
