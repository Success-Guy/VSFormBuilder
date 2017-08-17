(function (window) {
    'use strict';

    function define_VSFormBuilder() {
        var VSFormBuilder = function (options) {
            this.SETTINGS = null;
            this.options = null;
            this.GenerateHTML = '';
            this.init(options);
            return this;
        }
        return VSFormBuilder;
    }

    if (typeof (Library) === 'undefined') {
        window.VSFormBuilder = define_VSFormBuilder();
    }

    VSFormBuilder.prototype = {
        VERSION: '1.0',
        DEFAULTS: {
            field_default_class: true,
            parent_wrap_tag: 'div',
            parent_wrap_attributes: {
                class: 'field-container',
            },
            wrap_tag: 'p',
            wrap_attributes: {
                id: '{field_id}_wrap',
                class: 'form-row',
            },
            label_position: 'before',
            label_tag: 'label',
            label_attributes: {
                class: 'input-label',
                for: {
                    id: '{field_id}'
                },
            },
            help_text_tag: 'span',
            help_text_position: 'after',
            help_text_attributes: {
                class: 'help-text',
                id: '{field_id}_help_text',
            }
        },
        CURRENT_PARAM: {},
        fromJson: new Array,
        GenerateHTML: '',
        MainExcludeFields: '',
        AttributeMap: {},

        init: function (options) {
            var defaults = this.DEFAULTS;
            this.SETTINGS = this._merge_array(defaults, options);
            this.MainExcludeFields = ['options', 'label', 'help_text', 'label_position', 'option_label_position'];
            this.AttributeMap = {
                form: {
                    map: 'global',
                    _attributes: {
                        action: '',
                        method: 'get'
                    },
                },
                fieldset: {
                    map: 'global',
                    exclude: ['placeholder'],
                },

                global: {
                    exclude: this.MainExcludeFields,
                    _attributes: {
                        class: '',
                        id: '',
                        name: ''
                    },
                    map: '',
                },

                wrap: {
                    map: 'global',
                    _attributes: {
                        id: '{new_id}'
                    },
                },

                label: {
                    map: 'global',
                },

                input: {
                    map: 'global',
                    _attributes: {
                        placeholder: '',
                        value: '',
                        type: ''
                    },
                },

                radio: {
                    exclude: ['placeholder', 'options'],
                    include: ['value'],
                    map: 'input',
                },

                checkbox: {
                    map: 'radio',
                },

                text: {
                    map: 'input',
                },

                file: {
                    map: 'input',
                },

                textarea: {
                    exclude: ['placeholder', 'options', 'value', 'type'],
                    _attributes: {
                        rows: 10,
                        cols: 10,
                    },
                    map: 'global',
                },

                select: {
                    exclude: ['value', 'placeholder', 'options', 'type'],
                    map: 'global',
                },

                option: {
                    exclude: this._merge_array(JSON.parse(JSON.stringify(this.MainExcludeFields)), ['placeholder', 'type', 'class', 'id', 'label']),
                    _attributes: {
                        value: ''
                    },
                },

                search: {
                    map: 'input'
                },
                email: {
                    map: 'input'
                },
                url: {
                    map: 'input'
                },
                tel: {
                    map: 'input'
                },
                number: {
                    map: 'input'
                },
                range: {
                    map: 'input'
                },
                date: {
                    map: 'input'
                },
                month: {
                    map: 'input'
                },
                week: {
                    map: 'input'
                },
                time: {
                    map: 'input'
                },
                datetime: {
                    map: 'input'
                },
                "datetime-local": {
                    map: 'input'
                },
                color: {
                    map: 'input'
                }
            };
            return this;
        },
        get_option: function (key, defaults) {
            if (typeof defaults === undefined) {
                defaults = '';
            }
            if (this.SETTINGS[key] === undefined) {
                return defaults;
            } else {
                return JSON.parse(JSON.stringify(this.SETTINGS[key]));
            }
        },

        add_html: function (html) {
            this.GenerateHTML += html + '\n\n';
        },
        add: function (type, param) {
            if (param == undefined) {
                param = {};
            }
            var send = {
                'type': type,
                'data': param
            };
            this.fromJson.push(send);
            return this;
        },
        generate: function () {
            var form = this.fromJson;
            for (var id in form) {
                var type = form[id].type;
                var param = {};
                this.CURRENT_PARAM = {};

                if (form[id].data !== undefined) {
                    param = form[id].data;
                }

                this.CURRENT_PARAM = param;
                this[type]();
            }
            return this.GenerateHTML;
        },

        AttributeMapping: function (type, exdata) {
            if (exdata === undefined) {
                exdata = {
                    exclude: [],
                    include: [],
                    _attributes: [],
                    map: '',
                    class: []
                };
            }
            if (this.AttributeMap[type] !== undefined) {
                var attrs = this.AttributeMap[type];
                var attrs = this._merge_array(exdata, attrs);
                if (attrs.map == '') {
                    return attrs;
                } else {
                    return this.AttributeMapping(attrs.map, attrs);
                }
            }
            return [];
        },
        get_field_attributes: function (type, ExArr) {
            var final_attr = this.AttributeMapping(type);
            final_attr._attributes = this._merge_array(final_attr._attributes, ExArr);
            final_attr.attributes = {};
            var attrs = JSON.parse(JSON.stringify(final_attr._attributes));

            for (var att in attrs) {
                var exists = jQuery.inArray(att, final_attr.exclude);

                if (exists == -1) {
                    final_attr.attributes[att] = attrs[att];
                }
            }

            return final_attr;
        },

        _merge_array: function (Object1, Object2) {
            for (var i in Object2) {
                if (Object1[i]) {
                    if (typeof Object2[i] == 'object') {
                        if (Array.isArray(Object2[i])) Object1[i].push(...Object2[i])
                        else Object1[i] = Object.assign({}, Object1[i], Object2[i])
                    } else {
                        Object1[i] = Object2[i]
                    }
                } else {
                    Object1[i] = Object2[i]
                }
            }
            return Object1;
        },
        _array_to_html_attribute: function (data_array) {
            var return_html = '';
            for (var I in data_array) {
                if (typeof data_array[I] == 'object') {
                    return_html += ' ' + I + '="';
                    for (var K in data_array[I]) {
                        return_html += data_array[I][K] + ' ';
                    }
                    return_html += '"';
                } else {
                    return_html += ' ' + I + '="' + data_array[I] + '" ';
                }
            }

            return return_html;
        },
        _array_to_string: function (data_array, sep) {
            var return_html = '';
            for (var key in data_array) {
                if (typeof data_array[key] == 'object') {
                    for (var K in data_array[key]) {
                        return_html += data_array[key][K] + sep;
                    }
                } else {
                    return_html += data_array[key] + sep;
                }
            }

            return return_html;
        },

        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        _get_id: function (num) {
            var now = new Date();
            var randomNum = '';
            randomNum = now.getTime() + this.getRandomInt(1, 10000);
            return randomNum;
        },
        render_template_tags: function (data, replace_values) {
            for (var id in data) {
                if (typeof data[id] == 'object') {
                    for (var I in data[id]) {
                        if (data[id][I] == '{field_id}') {
                            data[id] = data[id][I].replace("{field_id}", replace_values[I]);
                        }
                    }
                } else {
                    data[id] = data[id].replace("{field_id}", replace_values[id]);
                }
            }
            return data;
        },
        field_attributes: function (type, param) {
            var NJ = JSON.parse(JSON.stringify(param));
            var data = null;
            var data = this.get_field_attributes(type, NJ);

            if (data.attributes.id !== undefined) {
                if (data.attributes.id == '') {
                    data.attributes.id = type + this._get_id(2);
                }
            }

            if (this.get_option('field_default_class')) {
                if (data.class !== undefined) {
                    data.class.push('input-' + type);
                    data.class.push(type);
                }
            }

            if (data.attributes.class !== undefined) {
                var class1 = this._array_to_string(data.attributes.class, ' ');
                var class2 = this._array_to_string(data.class, ' ');
                data.attributes.class = class1 + class2;
            }
            data.attribute_html = this._array_to_html_attribute(data.attributes);
            return data;
        },

        tag: function (open, tag, attributes) {
            if (open == 'inline') {
                return '<' + tag + ' ' + attributes + '/>';
            } else if (open) {
                return '<' + tag + ' ' + attributes + '>';
            } else {
                return '</' + tag + '>';
            }
        },
        render_tag: function (open, tag, attributes) {
            var tags = this.tag(open, tag, attributes);
            this.add_html(tags);
            return this;
        },

        field_label: function (attrs) {
            var label_tag = this.get_option('label_tag');
            if (attrs._attributes['label_position'] === undefined) {
                var label_position = this.get_option('label_position');
            } else {
                var label_position = attrs._attributes['label_position'];
            }

            var label_attributes = this.get_option('label_attributes');
            var label_attributes = this.render_template_tags(label_attributes, attrs.attributes);
            var label_attributes = this._array_to_html_attribute(label_attributes);
            var label = this.tag(true, label_tag, label_attributes) + attrs._attributes['label'] + this.tag(false, label_tag);
            return {
                position: label_position,
                html: label
            };
        },
        field_help_text: function (attrs) {
            var help_tag = this.get_option("help_text_tag");
            var position = this.get_option("help_text_position");
            var attributes = this.get_option("help_text_attributes");
            var attributes = this.render_template_tags(attributes, attrs.attributes);
            var attributes = this._array_to_html_attribute(attributes);
            var help_text = this.tag(true, help_tag, attributes) + attrs._attributes['help_text'] + this.tag(false, help_tag);
            return {
                position: position,
                html: help_text
            };
        },
        field_wrap: function (attrs, type) {
            if (type === undefined) {
                type = 'wrap';
            }
            var wrap_attributes = this.get_option(type + '_attributes');
            var wrap_attributes = this.render_template_tags(wrap_attributes, attrs.attributes);
            var wrap_attributes = this._array_to_html_attribute(wrap_attributes);
            return {
                tag: this.get_option(type + "_tag"),
                html: wrap_attributes
            };
        },

        form_start: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            var attributes = this.field_attributes('form', param);
            this.render_tag(true, 'form', attributes.attribute_html);
            return this;
        },
        form_end: function () {
            this.render_tag(false, 'form', '');
        },
        fieldset_start: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            var attributes = this.field_attributes('fieldset', param);

            this.render_tag(true, 'fieldset', attributes.attribute_html);
            if (attributes._attributes['label'] !== undefined) {
                this.render_tag(true, 'legend', '');
                this.add_html(attributes._attributes['label']);
                this.render_tag(false, 'legend');
            }

            return this;

        },
        fieldset_end: function () {
            this.render_tag(false, 'fieldset', '');
        },

        form_field: function (open, tag, e) {
            var attrs = JSON.parse(JSON.stringify(e));
            var label_before = '';
            var label_after = '';
            var help_before = '';
            var help_after = '';
            var field_html = '';

            var wraps = this.field_wrap(attrs);
            var wrap_attributes = wraps.html;
            var wrap_tag = wraps.tag;

            if (attrs._attributes['label'] !== undefined) {
                var label_html = this.field_label(attrs);

                if (label_html.position == 'before') {
                    var label_before = label_html.html;
                }
                if (label_html.position == 'after') {
                    var label_after = label_html.html;
                }
            }

            if (attrs._attributes['help_text'] !== undefined) {
                var help_text_html = this.field_help_text(attrs);

                if (help_text_html.position == 'before') {
                    var help_before = help_text_html.html;
                }
                if (help_text_html.position == 'after') {
                    var help_after = help_text_html.html;
                }
            }

            if (open == true || open == 'inline') {
                this.add_html(this.tag(true, wrap_tag, wrap_attributes));
                if (open == true) {
                    var field_html = label_before + help_before + this.tag(true, tag, attrs.attribute_html);

                    if (attrs._attributes['value'] !== undefined) {
                        field_html += attrs._attributes['value'];
                    }

                    field_html += this.tag(false, tag, attrs.attribute_html) + help_after + label_after;
                } else if (open == 'inline') {
                    var field_html = label_before + help_before + this.tag(true, tag, attrs.attribute_html) + help_after + label_after;
                }
                this.add_html(field_html);
                this.add_html(this.tag(false, wrap_tag));
            } else {
                this.add_html(this.tag(open, wrap_tag));
            }

            return this;
        },
        _option: function (attributes, value) {
            return '<option ' + attributes + '>' + value + '</option>';
        },
        _options: function (options, param, selected) {
            var html = '';
            for (var option in options) {
                if (typeof options[option] == 'string') {
                    param['value'] = options[option];

                    if (selected == option) {
                        param['selected'] = true;
                    } else {
                        delete param['selected'];
                    }

                    var attr_html = this.field_attributes('option', param);
                    html += this._option(attr_html.attribute_html, options[option]);
                } else if (typeof options[option] == 'object') {
                    if (options[option]['group_name'] !== undefined) {
                        var Label = options[option]['group_name'] !== undefined ? options[option]['group_name'] : '';
                        var disabled = options[option]['disabled'] !== undefined ? options[option]['disabled'] : false;
                        var sub_options = options[option]['options'];
                        var AttrHTML = ' label="' + Label + '" ';
                        if (disabled) {
                            AttrHTML += ' disabled';
                        }

                        html += this.tag(true, 'optgroup', AttrHTML) + this._options(sub_options, param, selected) + this.tag(false, 'optgroup');
                    } else {
                        var value = '';
                        if (options[option]['value'] !== undefined) {
                            value = options[option]['value'];
                        }

                        if (selected == option) {
                            options[option]['selected'] = true;
                        } else {
                            delete options[option]['selected'];
                        }


                        var newOptionParam = JSON.parse(JSON.stringify(param));
                        newOptionParam = this._merge_array(newOptionParam, options[option]);
                        newOptionParam['value'] = option;
                        var attr_html = this.field_attributes('option', newOptionParam);
                        html += this._option(attr_html.attribute_html, value);
                    }

                }
            }

            return html;
        },
        check_radio: function (type, param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }

            var wrap_attributes = this.field_attributes('wrap', param);
            var wraps = this.field_wrap(wrap_attributes, 'parent_wrap');
            var wrap_attributes = wraps.html;
            var wrap_tag = wraps.tag;
            var label_before = '';
            var label_after = '';
            this.render_tag(true, wrap_tag, wrap_attributes);

            if (param['label'] !== undefined) {
                var label = this.field_label(this.field_attributes('label', param));
                if (label.position == 'before') {
                    label_before = label.html;
                } else {
                    label_after = label.html;
                }
            }

            this.add_html(label_before);
            var options = param.options;
            delete param.options;
            var attributes_array = '';

            param['type'] = type;
            for (var option in options) {
                param['value'] = option;
                param['label'] = options[option];
                if (param['option_label_position'] !== undefined) {
                    param['label_position'] = param['option_label_position'];
                }
                attributes_array = this.field_attributes(type, param);
                this.form_field('inline', 'input', attributes_array);
            }

            this.add_html(label_after);
            this.render_tag(false, wrap_tag);
            return this;
        },
        input_field: function (type, param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            var attributes_array = '';
            param['type'] = type;
            attributes_array = this.field_attributes(type, param);
            this.form_field('inline', 'input', attributes_array);
            return this;
        },

        textarea: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            var attributes_array = '';
            attributes_array = this.field_attributes('textarea', param);
            this.form_field(true, 'textarea', attributes_array);
            return this;
        },
        text: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('text', param);
        },
        password: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('password', param);
        },
        search: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('search', param);
        },
        email: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('email', param);
        },
        url: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('url', param);
        },
        tel: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('tel', param);
        },
        number: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('number', param);
        },
        range: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('range', param);
        },
        date: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('date', param);
        },
        month: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('month', param);
        },
        week: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('week', param);
        },
        time: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('time', param);
        },
        datetime: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('datetime', param);
        },
        datetime_local: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('datetime-local', param);
        },
        color: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('color', param);
        },
        file: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.input_field('file', param);
        },
        radio: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.check_radio('radio', param);
        },
        checkbox: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            return this.check_radio('checkbox', param);
        },
        select: function (param) {
            if (param === undefined) {
                param = this.CURRENT_PARAM;
            }
            var SelectOptions = JSON.parse(JSON.stringify(param.options));
            delete param.options;
            var option_param = JSON.parse(JSON.stringify(param));
            var selected = param['selected'] !== undefined ? param['selected'] : '';
            var options_html = this._options(SelectOptions, option_param, selected);
            param['value'] = options_html;
            var select = this.field_attributes('select', param);
            this.form_field(true, 'select', select);
            return this;
        }
    }

})(window);
