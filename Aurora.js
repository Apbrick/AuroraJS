//===================================================
//          Before you update make sure to check for:
//          Render.String( menu.x + 120, menu.y + 84, 0, "Current version: ", [ 255, 255, 255, 205 ], menu.font )
//===================================================

//UPDATES:
//Added GUI
//Removed Simple Clantag
//Fixed Static + Fancy Clantags
//Removed Indicators
//Reworked Slow walk AA
//Added Kill effect
//Hotkey list can now be dragged while only GUI is open


debugbuild = Cheat.GetUsername() == "Apnix" || Cheat.GetUsername() == "geinibba3413";
betabuild = Cheat.GetUsername() == "Brexan" || Cheat.GetUsername() == "avatar" || Cheat.GetUsername() == "Zapzter" || Cheat.GetUsername() == "xyren";



//=======================================================================================================
//
//
// GUI STARTS HERE
//  GUI BY HANA 
//  https://github.com/Hana-jsa/onetap-js/blob/main/menu_framework.js
//  Hana#5674
//
//
//=======================================================================================================


/* region: consts */
const hotkey_mode_t = {
    HOLD: 0,
    TOGGLE: 1,
    ALWAYS: 2
};

const element_t = {
    CHECKBOX: 0,
    SLIDER: 1,
    DROPDOWN: 2,
    COLOR_PICKER: 3,
    HOTKEY: 4
};

/* region: structs */
const checkbox_t = function (value) { return { __type: element_t.CHECKBOX, value: value || false } };
const slider_t = function (value) { return { __type: element_t.SLIDER, value: value || 0 } };
const dropdown_t = function (value) { return { __type: element_t.DROPDOWN, value: value || 0 } };
const color_picker_t = function (h, s, v, a) { const rgb = hsv_to_rgb([h, s, v, a]); const r = rgb[0], g = rgb[1], b = rgb[2]; return { __type: element_t.COLOR_PICKER, value: [h, s, v, a], h: h, s: s, v: v, r: r, g: g, b: b, a: a } };
const hotkey_t = function (value, mode, active) { return { __type: element_t.HOTKEY, value: value, mode: mode, active: active, open: false } };

/* region: locals */
const menu = {
    opened: true,
    color: [],
    font: null,

    // current tab index
    curr_tab: 0,

    // current subtab index for each tab
    curr_subtab: {
        "tab 0": 0,
        "tab 1": 0,
        "tab 2": 0,
        "tab 3": 0,
        "tab 4": 0,
        "tab 5": 0,
        "tab 6": 0
    },

    // current groupbox data
    // used for automatic spacing
    curr_groupbox: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        offset: 0
    },

    x: 140,
    y: 140,
    w: 400,
    h: 300,

    // whether or not the user was clicking
    // used to fix hotkey input
    clicked: false
};

const cursor = {
    x: 0,
    y: 0,
    delta_x: 0,
    delta_y: 0,
    dragging: false
};

const input_system = {
    pressed_keys: [],
    last_pressed_keys: []
};

const container = {
    // [0] = combobox, [1] = multibox, [2] = color_picker, [3] = hotkey
    type: -1,

    x: 0,
    y: 0,
    w: 0,
    h: 0,

    // combobox/multibox elements
    elements: [],

    variable: ""
};

const config_system = {};
const config = {
    aa_modes: dropdown_t(),
    e_peek: hotkey_t(0x0, hotkey_mode_t.HOLD, true),
    low_delta_slowwalk: checkbox_t(),
    leg_breaker: checkbox_t(),
    Aurora_doubletap: dropdown_t(),
    fast_recharge: checkbox_t(),
    advanced_fakelag: dropdown_t(),
    fake_lag_min: slider_t(),
    fake_lag_max: slider_t(),
    //indicators: dropdown_t(),
    hotkey_list: checkbox_t(),
    aspect_ratio: checkbox_t(),
    aspect_ratio_slider: slider_t(),
    healthshot_effect: checkbox_t(),
    healthshot_effect_strongness: slider_t(),
    healthshot_color: color_picker_t(255, 255, 255, 255),
    clantag: dropdown_t(),
    hide_chat: checkbox_t(),
    menu_color: color_picker_t(213, 78, 92, 255),
    menu_hotkey: hotkey_t(0x24, hotkey_mode_t.TOGGLE, true),
    hotkey_x: slider_t(),
    hotkey_y: slider_t(),
};
const join_server = {};

join_server.click = function () {

    //Connection
    Cheat.ExecuteCommand("connect server.buyaurora.today")
    // log
    Cheat.Print("[Aurora] Joining Server.\n");
}



const hotkeys = [];

/* region: callbacks */
function on_cmove() {
    input_system.fix_input();
}

function on_paint() {
    menu.render();
}

/* region: input_system */
input_system.update = function () {
    // loop thru all keys
    for (var i = 1; i < 255; ++i) {
        // save current pressed keys
        this.last_pressed_keys[i] = this.pressed_keys[i];

        // update pressed keys
        this.pressed_keys[i] = Input.IsKeyPressed(i);
    }

    // handle hotkeys
    input_system.handle_hotkeys();
}

input_system.is_key_down = function (key) {
    return this.pressed_keys[key];
}

input_system.is_key_pressed = function (key) {
    return this.pressed_keys[key] && !this.last_pressed_keys[key];
}

input_system.is_key_released = function (key) {
    return !this.pressed_keys[key] && this.last_pressed_keys[key];
}

input_system.handle_hotkeys = function () {
    // loop thru all config variables
    for (var variable in config) {
        // get current variable
        const hk = config[variable];

        // check if variable isn't a hotkey
        if (hk.__type !== element_t.HOTKEY)
            continue;

        // check if hotkey is being set (waiting for input)
        if (hk.open)
            continue;

        // switch between hotkey mode
        switch (hk.mode) {
            // on hold
            case 0:
                hk.active = this.is_key_down(hk.value);
                break;

            // on toggle
            case 1:
                if (this.is_key_pressed(hk.value))
                    hk.active = !hk.active;

                break;

            // always on
            case 2:
                hk.active = true;
                break;
        }
    }
}

input_system.enable_mouse_input = function (active) {
    Input.ForceCursor(+active)
}

input_system.fix_input = function () {
    // check if menu isn't open
    if (!menu.opened)
        return;

    // override buttons so we don't shoot while in the menu
    UserCMD.SetButtons(UserCMD.GetButtons() & ~(1 << 0));
}

input_system.cursor_in_bounds = function (x, y, w, h) {
    return cursor.x > x && cursor.y > y && cursor.x < x + w && cursor.y < y + h;
}

/* region: config */
config_system.save = function () {

    // loop thru all config variables
    for (var variable in config) {
        // get current variable
        const object = config[variable];

        // convert variable to JSON and save it to file
        DataFile.SetKey("config.Aurora", variable, JSON.stringify(object));
    }

    // save/create file
    DataFile.Save("config.Aurora");

    // log
    Cheat.Print("[Aurora] Configuration saved.\n");
}

config_system.load = function () {

    // load the file
    DataFile.Load("config.Aurora");

    // loop thru all config variables
    for (var variable in config) {
        // get the JSON value
        var string = DataFile.GetKey("config.Aurora", variable);

        // check if JSON isn't valid
        if (!string)
            continue;

        // parse JSON
        var data = JSON.parse(string);

        // check if the parsed data isn't valid
        if (!data)
            continue;

        // override config value
        config[variable] = data;
    }

    // log
    Cheat.Print("[Aurora] Configuration loaded.\n");
}

/* region: menu */



/*
For the menu to remember all the things to add etc.

menu.checkbox( "enabled", "test_bool_enabled" )
menu.checkbox( "disabled", "test_bool_disabled" )
menu.color_picker( "menu color", "menu_color", false )
menu.slider( "int", "test_int", 0, 10, 1, false)
menu.slider( "float", "test_float", 8, 16, 0.25, true)
menu.combobox( "test_combobox", [ "a", "b", "c" ], "test_combobox" );
menu.multibox( "test_multicombo", [ "1", "2", "3" ], "test_combobox2" );
*/
menu.render = function () {

    // update variables
    menu.font = Render.GetFont("Tahoma.ttf", 12, true);
    menu.open = config.menu_hotkey[3];

    cursor.x = Input.GetCursorPosition()[0], cursor.y = Input.GetCursorPosition()[1];

    // handles input system
    input_system.update();
    input_system.enable_mouse_input(menu.opened);

    // change the menu's open state
    menu.opened = config.menu_hotkey.active;

    // check if menu isn't open
    if (!menu.opened)
        return;

    // change the menu's color
    menu.color = menu.get_color(config.menu_color);

    const topaccent = menu.get_color(config.menu_color)
    // render the box above menu's body
    menu.body(menu.x, menu.y - 3, menu.w, 10, [topaccent[0], topaccent[1], topaccent[2], 255], [topaccent[0], topaccent[1], topaccent[2], 255], [topaccent[0], topaccent[1], topaccent[2], 255], "Aurora | " + Cheat.GetUsername());
    // render the menu's body
    menu.body(menu.x, menu.y, menu.w, menu.h, [36, 36, 36, 255], [25, 25, 25, 255], [36, 36, 36, 255], "Aurora | " + Cheat.GetUsername());

    // tabs groupbox
    menu.groupbox(menu.x + 5, menu.y + 35, 100, 260, "tabs", false); {
        // render tabs
        menu.tab("AA Settings", 1, false, [])
        menu.tab("AA Misc", 2, false, [])
        menu.tab("DT Settings", 3, false, [])
        menu.tab("Fakelag Settings", 4, false, [])
        menu.tab("Visuals", 5, false, [])
        menu.tab("Misc", 6, false, [])

    }

    // switch between tabs
    switch (menu.curr_tab) {
        case 0:
            switch (menu.curr_subtab["tab 0"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 285, 260, "groupbox 3", false); {
                        Render.String(menu.x + 120, menu.y + 45, 0, "Welcome to Aurora " + Cheat.GetUsername(), [255, 255, 255, 205], menu.font)
                        Render.String(menu.x + 120, menu.y + 58, 0, "Join our discord for support", [255, 255, 255, 205], menu.font)
                        Render.String(menu.x + 120, menu.y + 71, 0, "discord.buyaurora.today", [255, 255, 255, 205], menu.font)
                        Render.String(menu.x + 120, menu.y + 84, 0, "Current version: V 1.1", [255, 255, 255, 205], menu.font)
                    }
                    break;
            }
            break;
        // first tab
        case 1:
            // switch between subtabs in the first tab
            switch (menu.curr_subtab["tab 1"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 285, 260, "groupbox", false); {
                        menu.combobox("Modes", ["None", "Simple", "Advanced", "Aurora", "Anti-Brute"], "aa_modes");
                        menu.hotkey("E-Peek", "e_peek");
                    }
                    break;

                // second subtab
                case 1:
            }
            break;

        // second tab
        case 2:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 2"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 285, 260, "groupbox 3", false); {
                        menu.checkbox("Slowwalk AA", "low_delta_slowwalk");
                        menu.checkbox("Leg Breaker", "leg_breaker");
                    }
                    break;
            }
            break;
        case 3:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 3"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 285, 260, "groupbox 3", false); {
                        menu.combobox("Aurora Doubletap", ["None", "Fast", "Quick", "Supersonic"], "Aurora_doubletap");
                        menu.checkbox("Fast Recharge", "fast_recharge");
                    }
                    break;
            }
            break;
        case 4:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 4"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 285, 260, "groupbox 3", false); {
                        menu.combobox("Advanced Fakelag", ["None", "Aurora", "Ideal Tick"], "advanced_fakelag");
                    }
                    break;
            }
            break;
        case 5:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 5"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 285, 260, "groupbox 3", false); {
                        //menu.multibox("Indicators", ["Anti-Aim Mode", "Doubletap", "Advanced Fakelag"], "indicators");
                        menu.checkbox("Hotkey List", "hotkey_list")
                        menu.checkbox("Aspect Ratio", "aspect_ratio")
                        function aspslider() {
                            if (config.aspect_ratio.value) {
                                menu.slider("Aspect Ratio Value", "aspect_ratio_slider", 0, 4, 0.05, true)
                            }
                        }
                        aspslider();
                        menu.checkbox("Kill Effect", "healthshot_effect")
                        function healthslider() {
                            if (config.healthshot_effect.value) {
                                menu.slider("   Strenght", "healthshot_effect_strongness", 0, 4, 0.1, true)
                                menu.color_picker("   Color", "healthshot_color", false)
                            }
                        }
                        healthslider();
                    }
                    break;
            }
            break;
        case 6:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 6"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 285, 260, "groupbox 3", false); {
                        menu.button("Join Server", join_server.click);
                        menu.combobox("Clantag", ["Off", "Static", "Fancy"], "clantag");
                        menu.checkbox("Hide Chat", "hide_chat")
                        menu.hotkey("Menu hotkey", "menu_hotkey");
                        menu.color_picker("Menu color", "menu_color", false)
                        menu.button("Save config", config_system.save);
                        menu.button("Load config", config_system.load);
                    }
                    break;
            }
            break;
        case 7:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 6"]) {
                // first subtab
                case 0:
                    menu.slider("_draggable_" + this.draggables.length + "_x", "hotkey_x", 0, screenSize[0], 1, false)
                    menu.slider("_draggable_" + this.draggables.length + "_y", "hotkey_y", 0, screenSize[1], 1, false)

                    menu.button("Join Server", join_server.click);
                    break;
            }
            break;
    }

    // handles the containers, aka, dropdowns, multi dropdowns, color pickers and hotkey mode window.
    menu.render_container();
}

menu.body = function (x, y, w, h, bg, header_text, header_line, name) {
    // disable dragging if mouse1 isn't pressed
    if (!input_system.is_key_down(0x01))
        cursor.dragging = false;

    // check if we're dragging the window
    if (input_system.is_key_down(0x01) && input_system.cursor_in_bounds(x, y, w, 30) || cursor.dragging) {
        // update dragging state
        cursor.dragging = true;

        // update menu position
        menu.x = cursor.x - cursor.delta_x;
        menu.y = cursor.y - cursor.delta_y;
    }

    else {
        // update cursor-menu delta
        cursor.delta_x = cursor.x - menu.x;
        cursor.delta_y = cursor.y - menu.y;
    }

    // render menu's body
    Render.FilledRect(x, y, w, h, bg)
    Render.FilledRect(x, y, w, 30, header_text)
    Render.FilledRect(x, y + 30, w, 2, header_line)
    Render.String(x + 10, y + 8, 0, name, [255, 255, 255, 205], menu.font)
}

menu.groupbox = function (x, y, w, h, string, show_name) {
    // render groupbox
    Render.FilledRect(x, y, w, h, [25, 25, 25, 255])
    Render.Rect(x, y, w, h, [45, 45, 45, 255])

    // render groupbox's name if show_name is active
    if (show_name)
        Render.String(x + 2, y - 12, 0, string, [255, 255, 255, 205], menu.font)

    // update automatic positioning data
    menu.curr_groupbox.x = x;
    menu.curr_groupbox.y = y;
    menu.curr_groupbox.w = w;
    menu.curr_groupbox.h = h;
    menu.curr_groupbox.offset = 0;
}

menu.tab = function (name, id, show_outline, subtabs) {
    // when u add a tab it automatically places based on these
    var x = menu.x + 5, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 15
    var w = 100, h = 30

    // is mouse 1 being held in the tabs width and height
    if ((cursor.x > x) && (cursor.x < x + w) && (cursor.y > y) && (cursor.y < y + h) && (input_system.is_key_pressed(0x01))) {
        // if an active container ( hotkey right click, color picker, dropdown, multi drop down ) is open stop updating it
        if (container.variable) {
            menu.update_container(true);
        }

        // set the current tab to this tabs id
        menu.curr_tab = id;
    }

    // show the clickable outline of a tab useful for testing things but looks ugly
    if (show_outline)
        Render.Rect(x, y, w, h, menu.curr_tab === id ? [52, 134, 235, 255] : [25, 25, 25, 255])

    // render the tabs name
    Render.String(x + 50, y, 1, name, [255, 255, 255, 205], menu.font)

    // increment the tabs offset so next tab won't collide
    menu.curr_groupbox.offset += 40

    // return if there isn't any subtabs
    if (subtabs.length === 0)
        return;

    // return if this isn't the current tab
    if (menu.curr_tab !== id)
        return;


    // check if its in bounds again and mouse 2 is being pressed this time
    if ((cursor.x > x) && (cursor.x < x + w) && (cursor.y > y) && (cursor.y < y + h) && (input_system.is_key_pressed(0x02))) {
        // if an active container ( hotkey right click, color picker, dropdown, multi drop down ) is open stop updating it
        if (container.variable) {
            menu.update_container(true);
        }

        // change the subtab by 1
        menu.curr_subtab[name] = (menu.curr_subtab[name] + 1) % subtabs.length
    }

    // render the subtabs name below the tab
    Render.String(x + 50, y + 12, 1, subtabs[menu.curr_subtab[name]], [200, 200, 200, 205], menu.font)
}

menu.checkbox = function (string, variable) {
    // when u add a checkbox it automatically places based on these
    var x = menu.curr_groupbox.x + 10, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;
    var position = menu.curr_groupbox.x + menu.curr_groupbox.w - 20;
    var w = 10, h = 10

    // is mouse 1 being held in the tabs width and height
    if (input_system.cursor_in_bounds(position, y, w, h)) {
        // if an active container ( hotkey right click, color picker, dropdown, multi drop down ) is open stop updating it
        if (input_system.is_key_pressed(0x01)) {
            if (container.variable) {
                menu.update_container(true);
            }

            else {
                // update config if there's no active container
                config[variable].value = !config[variable].value;
            }
        }
    }

    // render background
    Render.FilledRect(position, y + 2, w, h, config[variable].value ? menu.color : [36, 36, 36, 255])

    // render name
    Render.String(x, y, 0, string, [255, 255, 255, 205], menu.font)

    // update offset
    menu.curr_groupbox.offset += 15;
}

menu.slider = function (string, variable, min_value, max_value, step, float) {
    // when u add a slider it automatically places based on these
    var x = menu.curr_groupbox.x + 10, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;
    var position = menu.curr_groupbox.x + menu.curr_groupbox.w - 135;
    var w = 125, h = 8;

    // is mouse 1 being held in the tabs width and height
    if (input_system.cursor_in_bounds(position, y + 1, w, h) && input_system.is_key_down(0x01)) {
        // if an active container ( hotkey right click, color picker, dropdown, multi drop down ) is open stop updating it
        if (container.variable) {
            menu.update_container(true);
        }

        // calculate the fraction between the delta of your mouse with the slider and the width
        const fraction = -(1 - (cursor.x - position + w) / w);

        // update config
        config[variable].value = float ? Math.round((min_value + ((max_value - min_value) * fraction)) / step) * step :
            Math.round(Math.round(min_value + (max_value - min_value) * fraction / step) * step);
    }

    // render background and slider
    Render.FilledRect(position, y + 1, w, 8, [36, 36, 36, 255])
    Render.FilledRect(x + 140, y + 1, (config[variable].value - min_value) / (max_value - min_value) * w, 8, menu.color)

    // render name
    Render.String(x, y, 0, string + ": " + (float ? config[variable].value.toFixed(2) : config[variable].value.toFixed(0)), [255, 255, 255, 205], menu.font)

    // update offset
    menu.curr_groupbox.offset += 15;
}

menu.combobox = function (string, elements, variable) {
    // when u add a combobox it automatically places based on these
    var x = menu.curr_groupbox.x + 10, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;
    var position = menu.curr_groupbox.x + menu.curr_groupbox.w - 135;
    const w = 125, h = 15;
    const c_h = elements.length * 15;

    // is mouse 1 being held in the tabs width and height
    if (input_system.cursor_in_bounds(position, y, w, h) && input_system.is_key_pressed(0x01)) {
        // check if there's no active container or if the active container is this element
        if (!container.variable || container.variable === variable) {
            // update container state
            container.variable ? menu.update_container(true) : menu.update_container(false, 0, position, y + h, w, c_h, elements, variable);
        }
    }

    // render background
    Render.FilledRect(position, y, w, h, [36, 36, 36, 255]);

    // render name and active element
    Render.String(x, y, 0, string, [255, 255, 255, 205], menu.font);
    Render.String(position + 4, y, 0, elements[config[variable].value], [255, 255, 255, 205], menu.font);

    // update offset
    menu.curr_groupbox.offset += 20;
}

menu.multibox = function (string, elements, variable) {
    // when u add a multibox it automatically places based on these
    var x = menu.curr_groupbox.x + 10, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;
    var position = menu.curr_groupbox.x + menu.curr_groupbox.w - 135;
    const w = 125, h = 15;
    const c_h = elements.length * 15;

    // is mouse 1 being held in the tabs width and height
    if (input_system.cursor_in_bounds(position, y, w, h) && input_system.is_key_pressed(0x01)) {
        // check if there's no active container or if the active container is this element
        if (!container.variable || container.variable === variable) {
            // update container state
            container.variable ? menu.update_container(true) : menu.update_container(false, 1, position, y + h, w, c_h, elements, variable);
        }
    }

    // initialize variables for multidropdown rendered
    var selected = 0;
    var text = "";

    // loop thru our elements
    for (var i = 0; i < elements.length; ++i) {
        // check if this current element is active
        if (config[variable].value & (1 << i)) {
            // check if we are already displaying the first element
            if (selected > 0)
                text += ", ";

            // add this element's name to the display text
            text += elements[i];

            // increment selected amount
            ++selected;
        }
    }

    // get display text width
    const text_w = Render.TextSize(text, menu.font)[0];

    // render background
    Render.FilledRect(position, y, w, h, [36, 36, 36, 255]);

    // render name and active element(s)
    Render.String(x, y, 0, string, [255, 255, 255, 205], menu.font);
    Render.String(position + 4, y, 0, text_w > w ? "..." : text, [255, 255, 255, 205], menu.font);

    // update offset
    menu.curr_groupbox.offset += 20;
}

menu.color_picker = function (name, variable, inlined) {
    // when u add a color picker it automatically places based on these
    var x = menu.curr_groupbox.x + 10, y = inlined ? menu.curr_groupbox.y + menu.curr_groupbox.offset - 3 : menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;
    var position = inlined ? menu.curr_groupbox.x + menu.curr_groupbox.w - 35 : menu.curr_groupbox.x + menu.curr_groupbox.w - 20;
    var w = 10, h = 10;

    // is mouse 1 being held in the tabs width and height
    if (input_system.cursor_in_bounds(position, y, w, h)) {
        if (input_system.is_key_pressed(0x01)) {
            // check if there's no active container or if the active container is from this element
            if (!container.variable || container.variable === variable) {
                // update container state
                container.variable ? menu.update_container(true) : menu.update_container(false, 2, x + w, y + h, w, h, null, variable);
            }
        }
    }

    // check if the active container is from this element, updating it every frame
    if (container.variable === variable)
        menu.update_container(false, 2, position + w, y + h, w, h, null, variable);

    // render the color picker
    Render.FilledRect(position, y, w, h, hsv_to_rgb(config[variable].value));

    // check if this is not inlined
    if (!inlined) {
        // render name
        Render.String(x, y, 0, name, [255, 255, 255, 205], menu.font);

        // update offset
        menu.curr_groupbox.offset += 15;
    }
}

menu.hotkey = function (string, variable) {
    // when u add a hotkey it automatically places based on these
    const x = menu.curr_groupbox.x + 10, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;
    const position = menu.curr_groupbox.x + menu.curr_groupbox.w - 10;

    // get current config variable, to make it easier
    const data = config[variable];

    // get current hotkey label and its width
    const hotkey = "[" + key_names[config[variable].value] + "]";
    const hotkey_width = Render.TextSize(hotkey, menu.font)[0];

    // is mouse 1 being held in the tabs width and height
    if (input_system.is_key_down(0x01)) {
        if (input_system.cursor_in_bounds(position - hotkey_width, y, hotkey_width, 10) && !data.open) {
            // check if there's no active container or if the active container is this element
            if (!container.variable || container.variable === variable) {
                // disable current container
                menu.update_container(true);

                // update clicked state, fix input
                menu.clicked = true;

                // update hotkey's state to wait for input
                data.open = true;
            }
        }
    }

    else {
        // disable clicked state
        menu.clicked = false;
    }

    // is mouse 2 being held in the tabs width and height
    if (input_system.cursor_in_bounds(position - hotkey_width, y, hotkey_width, 10) && input_system.is_key_pressed(0x02) && !data.open) {
        // check if there's no active container or if the active container is this element
        if (!container.variable || container.variable === variable) {
            // update container state
            container.variable ? menu.update_container(true) : menu.update_container(false, 3, position, y + 10, 60, 50, null, variable);
        }
    }

    // check if we weren't clicking in the last frame and if we're waiting for input
    if (!menu.clicked && data.open) {
        // loop through every key
        for (var i = 1; i < 255; ++i) {
            // check if we're pressing this key
            if (input_system.is_key_down(i)) {
                // update hotkey value
                data.open = false;
                data.value = i;
                break;
            }
        }
    }

    // render hotkey
    Render.String(x, y, 0, string, [255, 255, 255, 205], menu.font);
    Render.String(position - hotkey_width, y, 0, hotkey, data.open ? menu.color : [175, 175, 175, 205], menu.font);

    // update offset
    menu.curr_groupbox.offset += 15;
}

menu.button = function (variable, callback) {
    // when u add a button it automatically places based on these
    var x = menu.curr_groupbox.x + 10, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;
    const w = 75, h = 15;

    // is mouse 1 being held in the tabs width and height
    if (input_system.cursor_in_bounds(x, y, w, h) && input_system.is_key_pressed(0x01)) {
        // disable current container
        menu.update_container(true);

        // run callback
        callback();
    }

    // render background
    Render.FilledRect(x, y, w, h, [36, 36, 36, 255]);

    // render name
    Render.String(x + w / 2, y + 1, 1, variable, [255, 255, 255, 205], menu.font);

    // update offset
    menu.curr_groupbox.offset += 20;
}

menu.update_container = function (disable, type, x, y, w, h, elements, variable) {
    // check if we're disabling the container
    if (disable) {
        // reset container variables
        container.type = -1;
        container.x = 0;
        container.y = 0;
        container.w = 0;
        container.h = 0;
        container.elements = elements;
        container.variable = "";
        return;
    }

    // update container variables
    container.type = type;
    container.x = x;
    container.y = y;
    container.w = w;
    container.h = h;
    container.elements = elements;
    container.variable = variable;
}

menu.render_container = function () {
    // get container and accent
    const self = container;
    const accent = menu.get_color(config.menu_color);

    // check if there's an active container
    if (!container.variable)
        return;

    // switch between the type of container
    switch (self.type) {
        default:
            break;

        // combobox
        case 0:
            // render the container's background
            Render.FilledRect(self.x, self.y, self.w, self.h, [32, 32, 32, 255]);

            // loop through all elements
            for (var i = 0; i < self.elements.length; i++) {
                // initialize hovered variable
                var hovered = false;

                // check if cursor is in bounds
                if (input_system.cursor_in_bounds(self.x, self.y + i * 15, self.x, 15)) {
                    // check if we're pressing mouse 1
                    if (input_system.is_key_pressed(0x01)) {
                        // update config variable
                        config[self.variable].value = i;

                        // disable container
                        menu.update_container(true);
                        break;
                    }

                    // set hovered to true
                    hovered = true;
                }

                else {
                    // check if we're pressing outside of the boundaries
                    if (!input_system.cursor_in_bounds(self.x, self.y - self.h, self.w, self.h + self.elements.length * 15) && input_system.is_key_pressed(0x01)) {
                        // disable container
                        menu.update_container(true);
                        break;
                    }
                }

                // render element
                Render.String(self.x + 4, self.y + i * 15, 0, self.elements[i], config[self.variable].value === i ?
                    accent : hovered ? [235, 235, 235, 205] : [100, 100, 100, 205], menu.font);
            }

            break;

        // Multi dropdown
        case 1:
            // render the container's background
            Render.FilledRect(self.x, self.y, self.w, self.h, [32, 32, 32, 255]);

            // loop through all elements
            for (var i = 0; i < self.elements.length; i++) {
                // initialize hovered variable
                var hovered = false;

                // check if cursor is in bounds
                if (input_system.cursor_in_bounds(self.x, self.y + i * 15, self.x, 15)) {
                    // check if we're pressing mouse 1
                    if (input_system.is_key_pressed(0x01)) {
                        // check if this element is active and then disable it
                        if (config[self.variable].value & (1 << i))
                            config[self.variable].value &= ~(1 << i);

                        else
                            // otherwise enable it
                            config[self.variable].value |= (1 << i);
                    }

                    // set hovered to true
                    hovered = true;
                }

                else {
                    // check if we're pressing outside of the boundaries
                    if (!input_system.cursor_in_bounds(self.x, self.y - self.h, self.w, self.h + self.elements.length * 15) && input_system.is_key_pressed(0x01)) {
                        // disable container
                        menu.update_container(true);
                        break;
                    }
                }

                // render element
                Render.String(self.x + 4, self.y + i * 15, 0, self.elements[i], config[self.variable].value & (1 << i) ?
                    accent : hovered ? [235, 235, 235, 205] : [100, 100, 100, 205], menu.font);
            }

            break;

        // Color picker
        case 2:
            // get config variable
            const hsv = config[self.variable];

            // check if we're clicking inside the color picker
            if (input_system.cursor_in_bounds(self.x + 5, self.y + 5, 190, 190) && input_system.is_key_down(0x01)) {
                // get the delta between bottom right corner and mouse position
                const delta_x = self.x + 195 - cursor.x;
                const delta_y = self.y + 195 - cursor.y;

                // calculate saturation and vibrance
                hsv.s = 100 - (delta_x * 100 / 190);
                hsv.v = delta_y * 100 / 190;
            }

            // check if we're dragging the hue bar
            if (input_system.cursor_in_bounds(self.x + 5, self.y + 200, 190, 8) && input_system.is_key_down(0x01)) {
                // get the delta between the right corner and the mouse position
                const delta_x = self.x + 195 - cursor.x;

                // calculate hue
                hsv.h = 360 - (delta_x * 360 / 190);
            }

            // check if we're dragging the alpha bar
            if (input_system.cursor_in_bounds(self.x + 5, self.y + 212, 190, 8) && input_system.is_key_down(0x01)) {
                // get the delta between the right corner and the mouse position
                const delta_x = self.x + 195 - cursor.x;

                // calculate alpha
                hsv.a = 255 - (delta_x * 255 / 190);
            }

            // check if we're clicking outside color picker window
            if (!input_system.cursor_in_bounds(self.x - 10, self.y - 10, 210, 235) && input_system.is_key_down(0x01)) {
                // disable container
                menu.update_container(true);
                break;
            }

            // update config value
            hsv.value = [
                hsv.h,
                hsv.s,
                hsv.v,
                hsv.a
            ];

            // convert the hsv values to rgb
            const color = hsv_to_rgb(hsv.value);

            // update config RGBA value
            hsv.r = color[0];
            hsv.g = color[1];
            hsv.b = color[2];
            hsv.a = color[3];

            // get the color picker's x and y position
            const color_selector_x = hsv.s * 190 / 100;
            const color_selector_y = (100 - hsv.v) * 190 / 100;

            // get the hue slider's x offset
            const hue_selector_x = hsv.h * 190 / 360;

            // get the alpha slider's x offset
            const alpha_selector_x = hsv.a * 190 / 255;

            // render the window
            Render.Rect(self.x - 1, self.y - 1, 202, 227, [10, 10, 10, 225]);
            Render.FilledRect(self.x, self.y, 200, 225, [32, 32, 32, 255]);

            // render the color picker
            Render.FilledRect(self.x + 5, self.y + 5, 190, 190, hsv_to_rgb([hsv.h, 100, 100, 255]))
            Render.GradientRect(self.x + 5, self.y + 5, 190, 190, 1, [255, 255, 255, 255], [255, 255, 255, 0]);
            Render.GradientRect(self.x + 5, self.y + 5, 190, 190, 0, [0, 0, 0, 0], [0, 0, 0, 255]);

            // render the hue and alpha sliders
            Render.HueRect(self.x + 5, self.y + 200, 222);
            Render.FilledRect(self.x + 5, self.y + 212, 190, 8, color);

            // render the selectors
            Render.Rect(self.x + 5 + color_selector_x - 2, self.y + 5 + color_selector_y - 2, 4, 4, [235, 235, 235, 255]);
            Render.Rect(self.x + 5 + hue_selector_x - 2, self.y + 200, 4, 8, [235, 235, 235, 255]);
            Render.Rect(self.x + 5 + alpha_selector_x - 2, self.y + 212, 4, 8, [235, 235, 235, 255]);

            break;

        // Hotkey
        case 3:
            // declare all possible hotkey modes
            const modes = ["On hold", "On toggle", "Always on"];

            // render background
            Render.FilledRect(self.x, self.y, self.w, self.h, [32, 32, 32, 255]);

            // loop thru all modes
            for (var i = 0; i < modes.length; i++) {
                // initialize hovered variable
                var hovered = false;

                // check if cursor is in bounds
                if (input_system.cursor_in_bounds(self.x, self.y + i * 15, self.w, 15)) {
                    // check if we're pressing mouse1
                    if (input_system.is_key_pressed(0x01)) {
                        // update hotkey mode
                        config[self.variable].mode = i;

                        // disable container
                        menu.update_container(true);
                        break;
                    }

                    // set hovered to true
                    hovered = true;
                }

                // render the mode labels
                Render.String(self.x + 2, self.y + 2 + i * 15, 0, modes[i], config[self.variable].mode === i ?
                    accent : hovered ? [235, 235, 235, 205] : [100, 100, 100, 205], menu.font);
            }

            break;
    }
}

menu.get_color = function (obj) {
    // return a packed color array
    return [obj.r, obj.g, obj.b, obj.a];
}

Render.ShadowString = function (x, y, a, s, c, f) {
    // get the shadow's alpha
    const alpha = Math.min(200, c[3]);

    // render string
    Render.String(x, y + 1, a, s, [10, 10, 10, alpha], f);
    Render.String(x, y, a, s, c, f);
}

Render.HueRect = function (x, y, w) {
    // declare hue spectrum colors
    const colors =
        [
            [255, 0, 0, 255],
            [255, 255, 0, 255],
            [0, 255, 0, 255],
            [0, 255, 255, 255],
            [0, 0, 255, 255],
            [255, 0, 255, 255],
            [255, 0, 0, 255]
        ];

    // loop thru the spectrum
    for (var i = 0; i < colors.length - 1; i++) {
        // render each gradient
        Render.GradientRect(x + i * w / 7, y, w / 7 + 1, 8, 1, colors[i], colors[i + 1]);
    }
}

function hsv_to_rgb(values) {
    var h = values[0], s = values[1], v = values[2], a = values[3];
    var r, g, b;
    var i;
    var f, p, q, t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;

    if (s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
        ];
    }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;

        case 1:
            r = q;
            g = v;
            b = p;
            break;

        case 2:
            r = p;
            g = v;
            b = t;
            break;

        case 3:
            r = p;
            g = q;
            b = v;
            break;

        case 4:
            r = t;
            g = p;
            b = v;
            break;

        default: // case 5:
            r = v;
            g = p;
            b = q;
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
        a
    ];
}

var key_names = ["-", "mouse1", "mouse2", "break", "mouse3", "mouse4", "mouse5",
    "-", "backspace", "tab", "-", "-", "-", "enter", "-", "-", "shift",
    "control", "alt", "pause", "capslock", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "space", "page up", "page down", "end", "home", "left",
    "up", "right", "down", "-", "Print", "-", "print screen", "insert", "delete", "-", "0", "1",
    "2", "3", "4", "5", "6", "7", "8", "9", "-", "-", "-", "-", "-", "-",
    "Error", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u",
    "v", "w", "x", "y", "z", "left windows", "right windows", "-", "-", "-", "insert", "end",
    "down", "page down", "left", "numpad 5", "right", "home", "up", "page up", "*", "+", "_", "-", ".", "/", "f1", "f2", "f3",
    "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "f13", "f14", "f15", "f16", "f17", "f18", "f19", "f20", "f21",
    "f22", "f23", "f24", "-", "-", "-", "-", "-", "-", "-", "-",
    "number lock", "scroll lock", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "shift", "right shift", "control",
    "right control", "menu", "right menu", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "next", "previous", "stop", "toggle", "-", "-",
    "-", "-", "-", "-", ";", "+", ",", "-", ".", "/?", "~", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "[{", "\\|", "}]", "'\"", "-",
    "-", "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-", "-", "-", "-", "-", "-", "-", "-",
    "-", "-"];

Cheat.RegisterCallback("Draw", "on_paint")
Cheat.RegisterCallback("CreateMove", "on_cmove")


//=======================================================================================================


// GUI ENDS HERE


//=======================================================================================================

function GetMathRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min)) + min;
}

/*       None     */
function AuroraNone() {
    if (config.aa_modes.value & (1 << 0)) {
        AntiAim.SetOverride(0);
    }
}
Cheat.RegisterCallback("CreateMove", "AuroraNone");

/*  Simple Mode   */
function AuroraSimple() {
    if (config.aa_modes.value & (1 << 1)) {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 2);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], 16);
        UI.SetValue(["Rage", "Anti Aim", "Fake", "Lower body yaw mode"], 1);
        UI.SetValue(["Rage", "Anti Aim", "General", "Key assignment", "Jitter"], 3);
        AntiAim.SetOverride(1);
        AntiAim.SetRealOffset(42);
        AntiAim.SetFakeOffset(GetMathRandom(25, 32));

    }
}
Cheat.RegisterCallback("CreateMove", "AuroraSimple");

/* Advanced Mode  */

function AuroraAdvanced() {
    var Aurora_AA_RealOffset = GetMathRandom(40, 48);
    var Aurora_AA_Advanced_JITTER = GetMathRandom(2, 10);
    var Aurora_AA_FakeOffset = GetMathRandom(25, 32);
    if (config.aa_modes.value & (1 << 2)) {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 2);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], Aurora_AA_Advanced_JITTER);
        UI.SetValue(["Rage", "Anti Aim", "Fake", "Lower body yaw mode"], 1);
        UI.SetValue(["Rage", "Anti Aim", "General", "Key assignment", "Jitter"], 3);
        AntiAim.SetOverride(1);
        AntiAim.SetRealOffset(Aurora_AA_RealOffset);
        AntiAim.SetFakeOffset(Aurora_AA_FakeOffset);
    }
}
Cheat.RegisterCallback("CreateMove", "AuroraAdvanced");

/* Aurora Mode  */
function AuroraMode() {
    var Auroramode = config.aa_modes.value & (1 << 3)
    if (Auroramode && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"]) || UI.GetValue(["Legit", "General", "General", "Key assignment", "AA Direction inverter"])) {
        AntiAim.SetOverride(1)
        AntiAim.SetFakeOffset(Globals.Tickcount() % 4, 5 * 1 ? 3 : 3);
        AntiAim.SetRealOffset(GetMathRandom(35, 25))
        AntiAim.SetLBYOffset(-10)
    } else if (!UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"]) || UI.GetValue(["Legit", "General", "General", "Key assignment", "AA Direction inverter"]) && Auroramode) {
        AntiAim.SetOverride(1)
        AntiAim.SetFakeOffset(Globals.Tickcount() % 4, 5 * 1 ? 5 : 5);
        AntiAim.SetRealOffset(GetMathRandom(-35, -25))
        AntiAim.SetLBYOffset(9)
    }
}
Cheat.RegisterCallback("CreateMove", "AuroraMode");

//Anti-Brute mode
//timer
var reset_time = 0;
var timer_indicator = 0;
var angle = 0;

//caching
ab_restrictions = UI.GetValue(["Config", "Cheat", "General", "Restrictions"]);
ab_yaw_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]);
ab_jitter_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"]);
ab_pitch_mode = UI.GetValue(["Rage", "Anti Aim", "General", "Pitch mode"]);
ab_at_targets = UI.GetValue(["Rage", "Anti Aim", "Directions", "At targets"]);


function Antibruteangle(c) {
    if (c.chokedcommands == 0) {
        if (c.in_use == 1) {
            angle = Math.min(57, Math.abs(Entity.GetProp(Entity.GetLocalPlayer(), "m_flPoseParameter", 11) * 120 - 60))
        } else {
            angle = Math.min(57, Math.abs(Entity.GetProp(Entity.GetLocalPlayer(), "m_flPoseParameter", 11) * 120 - 60))
        }
    }
};

Cheat.RegisterCallback("setup_command", "Antibruteangle")

function GetClosestPoint(A, B, P) {
    var a_to_p = [P[1] - A[1], P[2] - A[2]];
    var a_to_b = [B[1] - A[1], B[2] - A[2]];
    var atb2 = a_to_b[1] ^ 2 + a_to_b[2] ^ 2;
    var atp_dot_atb = a_to_p[1] * a_to_b[1] + a_to_p[2] * a_to_b[2]
    var t = atp_dot_atb / atb2
    return A[1] + a_to_b[1] * t, A[2] + a_to_b[2] * t;
}

var should_swap = false;
var it = 0;
var angles = [60, 20, -60]


function BulletImpact(c) {
    if (config.aa_modes.value & (1 << 4)) {
        var ent = Entity.GetEntityFromUserID(c.userid)
        if (Entity.IsValid(entity) && Entity.IsEnemy(entity)) {
            if (!Entity.IsDormant(entity)) {
                var ent_shoot = Entity.GetProp(ent, "m_vecOrigin");
                ent_shoot[3] = ent_shoot[3] + Entity.GetProp(ent, "m_vecViewOffset[2]");
                var player_head = Entity.GetHitboxPosition(Entity.GetLocalPlayer(), 0);
                var closest = GetClosestPoint(ent_shoot, [c.x, c.y, c.z], player_head);
                var delta = [player_head[1] - closest[1], player_head[2] - closest[2]];
                var delta_2d = Math.sqrt(delta[1] ^ 2 + delta[2] ^ 2);

                if (Math.abs(delta_2d) < 40) {
                    it = it + 1
                    should_swap = true
                }
            }
        }
    }
};

Cheat.RegisterCallback("bullet_impact", "BulletImpact")

function on_prestart() {
    if (config.aa_modes.value & (1 << 4)) {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], ab_yaw_offset);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], ab_jitter_offset);
        UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], ab_pitch_mode);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], ab_at_targets);
    }
}

// E Peek
//Thanks Atti + Zapzter for the help with Defusing and Planting

const time = Globals.Realtime();
var currently_defusing = false;
var currently_picking_hostage = false;
var Aurora_aa = true;
var key_e = false;

function KratoEPeek() {
    var defusing = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_bIsDefusing")
    var picking_hostage = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_bIsGrabbingHostage")
    var holding = Entity.GetWeapon(Entity.GetLocalPlayer()) == 116;
    var planted = Entity.GetEntitiesByClassID(128);
    var buttons = UserCMD.GetButtons();

    restrictions = UI.GetValue(["Config", "Cheat", "General", "Restrictions"]);
    yaw_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]);
    jitter_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"]);
    pitch_mode = UI.GetValue(["Rage", "Anti Aim", "General", "Pitch mode"]);
    at_targets = UI.GetValue(["Rage", "Anti Aim", "Directions", "At targets"]);


    if (!planted) {
        onReset()
    }
    var Aurora_AA_EPeek_YAW = GetMathRandom(172, 179);
    if (!currently_defusing && !picking_hostage && config.e_peek.active) {
        AntiAim.SetOverride(1);
        UI.SetValue(["Config", "Cheat", "General", "Restrictions"], 0);
        UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], 0);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], Aurora_AA_EPeek_YAW);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], 4);
        UI.SetValue(["Rage", "Anti Aim", "General", "Key assignment", "Jitter"], 3);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], 0);
        key_e = false;
        if (Globals.Realtime() >= time + 0.2) {
            if (key_e == false) {
                Cheat.ExecuteCommand("+use");
                key_e = true;
            }
            if (key_e == true) {
                Cheat.ExecuteCommand("-use");
            }
        } else if (key_e == true) {
            Cheat.ExecuteCommand("-use");
            key_e = false;
        }
    } else if (!Aurora_aa) {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], yaw_offset);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], jitter_offset);
        UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], pitch_mode);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], at_targets);
        Aurora_aa = true;
        currently_defusing = false;
        currently_picking_hostage = false;
    } else {
        UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], 1);
    }
}
function Defusing() {
    const userid = Entity.GetEntitiesByClassID(event_get_int("userid"));

    if (Entity.IsLocalPlayer(userid))
        currently_defusing = true;
    currently_picking_hostage = true;
}

function DefuseReset() {
    currently_defusing = false;
    currently_picking_hostage = false;
}

Cheat.RegisterCallback("CreateMove", "KratoEPeek");
Cheat.RegisterCallback("bomb_begindefuse", "Defusing");
Cheat.RegisterCallback("round_start", "DefuseReset");
Cheat.RegisterCallback("player_connect_full", "DefuseReset");
Cheat.RegisterCallback("bomb_abortdefuse", "DefuseReset");

//Lowdelta recode
function lowdeltav2() {
    ab_restrictions = UI.GetValue(["Config", "Cheat", "General", "Restrictions"]);
    ab_yaw_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]);
    ab_jitter_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"]);
    ab_pitch_mode = UI.GetValue(["Rage", "Anti Aim", "General", "Pitch mode"]);
    ab_at_targets = UI.GetValue(["Rage", "Anti Aim", "Directions", "At targets"]);
    if (config.low_delta_slowwalk.value && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && !UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"], "AA Inverter")) {
        AntiAim.SetOverride(1);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], 1);
        AntiAim.SetFakeOffset(GetMathRandom(45, 55));
        AntiAim.SetRealOffset(-10);
    } else if (config.low_delta_slowwalk.value && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"], "AA Inverter")) {
        AntiAim.SetOverride(1);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], 1);
        AntiAim.SetFakeOffset(GetMathRandom(-45, -55));
        AntiAim.SetRealOffset(10);
    } else {
        AntiAim.SetOverride(0);
        UI.SetValue(["Config", "Cheat", "General", "Restrictions"], ab_restrictions);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], ab_yaw_offset);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], ab_jitter_offset);
        UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], ab_pitch_mode);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], ab_at_targets);
    }
}

Cheat.RegisterCallback("CreateMove", "lowdeltav2");

//Leg Fucker
var Legbreaker = true;
var Firstloop = 1;
var Secondloop = 1;

function LegBreaker() {
    if (config.leg_breaker.value) {
        var Amount = 0
        if (Legbreaker == true) {
            if (Secondloop > Amount) {
                BreakLeg = false;
                Secondloop = 0;
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 1)
                UI.SetValue(["Rage", "Anti Aim", "Jitter move"], 1)
            }
        } else if (BreakLeg == false) {
            if (Secondloop > Amount) {
                BreakLeg = true;
                Secondloop = 0;
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 2)
                UI.SetValue(["Rage", "Anti Aim", "Jitter move"], 0)
            }
        }
        Secondloop = Secondloop + 1;
    }
}

Cheat.RegisterCallback("Draw", "LegBreaker");


//LBY Flicker




// Advanced fakelag fully done
function AuroraFakelag() {
    var fakelagmin = config.fake_lag_min.value
    var customfakelag = GetMathRandom(config.fake_lag_min.value, config.fake_lag_max.value);
    if (config.advanced_fakelag.value & (1 << 1)) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
        UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], (GetMathRandom(9, 12)));
        UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], (GetMathRandom(2, 8)));
    } else if (config.advanced_fakelag.value & (1 << 2)) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
        UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], customfakelag);
        UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], 2);
    } else if (config.advanced_fakelag.value & (1 << 0)) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
    }
};

function KrFLDisable() {
    if (config.leg_breaker.value & (1 << 1) && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"])) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
        UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], 13);
        UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], 2);
    } else if (config.leg_breaker.value & (1 << 2) && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"])) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
        UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], 13);
        UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], 2);
    }
};



Cheat.RegisterCallback("CreateMove", "KrFLDisable");
Cheat.RegisterCallback("CreateMove", "AuroraFakelag");

//Misc

/* Double Tap */

function DT_Shots(ticks) {
    var me = Entity.GetLocalPlayer();
    var wpn = Entity.GetWeapon(me);
    var tickbase = Entity.GetProp(me, "CCSPlayer", "m_nTickBase");
    var curtime = Globals.TickInterval() * (tickbase - ticks);

    if (me == null || wpn == null) {
        return false;
    }

    if (curtime < Entity.GetProp(wpn, "CBaseCombatWeapon", "m_flNextPrimaryAttack")) {
        return false;
    }

    if (curtime < Entity.GetProp(me, "CCSPlayer", "m_flNextAttack")) {
        return false;
    }
    return true;
}


function AuroraDT() {
    if (config.Aurora_doubletap.value & (1 << 0)) {
        Exploit.EnableRecharge(), Exploit.OverrideShift(12), Exploit.OverrideTolerance(3)
    }
    if (config.Aurora_doubletap.value & (1 << 1)) {
        var GetCharge = Exploit.GetCharge();
        Exploit[(1 != GetCharge ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 14), Exploit.OverrideShift(12),
            Exploit.OverrideTolerance(0), DT_Shots(14) && 1 != GetCharge && (Exploit.DisableRecharge(), Exploit.Recharge())
    } else if (config.Aurora_doubletap.value & (1 << 2)) {
        var GetCharge = Exploit.GetCharge();
        Exploit[(1 != GetCharge ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 16), Exploit.OverrideShift(14),
            Exploit.OverrideTolerance(0), DT_Shots(16) && 1 != GetCharge && (Exploit.DisableRecharge(), Exploit.Recharge())
    } else if (config.Aurora_doubletap.value & (1 << 3)) {
        var GetCharge = Exploit.GetCharge();
        Exploit[(1 != GetCharge ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 18), Exploit.OverrideShift(16),
            Exploit.OverrideTolerance(0), DT_Shots(18) && 1 != GetCharge && (Exploit.DisableRecharge(), Exploit.Recharge())
    } else {
        Exploit.EnableRecharge(), Exploit.OverrideShift(12), Exploit.OverrideTolerance(3)
    }
}

function AuroraDT_UNLOAD() {
    Exploit.EnableRecharge();
}

var rechargeTime = 0, updateTime = !![], shouldDisableRecharge = !![];
function FastRecharge() {
    if (config.fast_recharge.value) {
        const Currentdate = new Date().getTime() / 1000;
        Exploit.DisableRecharge(), shouldDisableRecharge = !![];
        if (Exploit.GetCharge() >= 1) updateTime = !![];
        Exploit.GetCharge() < 1 && (updateTime && (rechargeTime = Currentdate, updateTime = ![]), Currentdate - rechargeTime > 0.5 && updateTime == ![] && (Exploit.Recharge(), rechargeTime = Currentdate));
    } else shouldDisableRecharge && (Exploit.EnableRecharge(), shouldDisableRecharge = ![]);
}

Cheat.RegisterCallback("CreateMove", "AuroraDT");
Cheat.RegisterCallback("Unload", "AuroraDT_UNLOAD");
Cheat.RegisterCallback("CreateMove", "FastRecharge");


//clantag -- Finished
//Fuck you jordan for ruining the clantag in the lua!

var client_set_clan_tag = Local.SetClanTag;
var oldTick = Globals.Tickcount();
var AuroraNL = ["/", "/\\", "A", "A|", "A|_", "A|_|", "Au", "Au|", "Au|‾", "Aur", "Aur0", "Auro", "Auro|", "Auro|‾", "Auror", "Auror/", "Auror/\\", "Aurora", "Aurora", "Auror", "Auro", "Aur", "Au", "A", "", "", ""];
var AuroraGS = ["A", "Au", "Aur", "Auro", "Auror", "Aurora", "Aurora", "Auror", "Auro", "Aur", "Au", "A", ""];
var AuroraStatic = "Aurora"
const globaltime = Globals.Realtime();
const delay = 0.1;

function AuroraClantag() {
    if (config.clantag.value & (3 << 1)) {
        if (Globals.Realtime() > globaltime + delay) {
            globaltime = Globals.Realtime();
            cur = Math.floor(Globals.Curtime() * 2 % 25 + 1);
            Local.SetClanTag(AuroraNL[cur]);
            oldTick = Globals.Tickcount();
            Globals.ChokedCommands() == 0;
        }
    } else if (config.clantag.value & (1 << 0)) {
        if (Globals.Realtime() > globaltime + delay) {
            globaltime = Globals.Realtime();
            Local.SetClanTag(AuroraStatic)
        }
    }
}

Cheat.RegisterCallback("FRAME_START", "AuroraClantag");

//Hotkey List
var accent = menu.get_color(config.menu_color);

(function () {
    for (var i in UI) {
        if (!~i.indexOf("Add"))
            continue;

        (function (cur) {
            UI[i] = function () {
                cur.apply(this, Array.prototype.slice.call(arguments));
                return arguments[0].concat(arguments[1]);
            }
        }(UI[i]));
    }
})();

const math = {
    clamp: function (val, min, max) {
        return Math.min(max, Math.max(min, val));
    }
};

const draggable = {
    draggables: [],

    create_draggable: function (startingSizeX, startingSizeY, callback) {
        const screenSize = Render.GetScreenSize();

        const sliderX = config.hotkey_x.value;
        const sliderY = config.hotkey_y.value;

        this.draggables.push({
            pos: [config.hotkey_x.value, config.hotkey_y.value],
            size: [startingSizeX, startingSizeY],

            isDragging: false,

            initialDragPosition: [sliderX, sliderY],
            sliders: [sliderX, sliderY],

            callbackFunction: callback,

            update: function () {
                const screenSize = Render.GetScreenSize();
                const menuOpened = menu.opened;

                if (menuOpened) {
                    if (Input.IsKeyPressed(1)) {
                        const mousePosition = Input.GetCursorPosition();

                        if (!this.isDragging && mousePosition[0] >= this.pos[0] && mousePosition[1] >= this.pos[1] && mousePosition[0] <= this.pos[0] + this.size[0] && mousePosition[1] <= this.pos[1] + this.size[1]) {
                            this.isDragging = true;
                            this.initialDragPosition = [mousePosition[0] - this.pos[0], mousePosition[1] - this.pos[1]];
                        } else if (this.isDragging) {
                            this.pos = [math.clamp(mousePosition[0] - this.initialDragPosition[0], 0, screenSize[0]), math.clamp(mousePosition[1] - this.initialDragPosition[1], 0, screenSize[1])];

                            for (var i in this.pos) {
                                UI.SetValue(this.sliders[i], this.pos[i]);
                            }
                        }
                    } else if (this.isDragging) {
                        this.isDragging = false;
                        this.initialDragPosition = [0, 0];
                    }
                }

                this.callbackFunction.apply(this, [menuOpened]);
            }
        });
    },

    updateDraggables: function () {
        for (var i in this.draggables) {
            this.draggables[i].update();
        }
    }
};

const AuroraHotkey = function () {
    UI.SetValue(["Misc.", "Helpers", "General", "Show keybind states"], 0);
    UI.SetValue(["Misc.", "Helpers", "General", "Show spectators"], 0);
    draggable.updateDraggables();
};

const hotkeyList = {
    listInternalData: {
        alpha: 0
    }
};

var samp = ["Ragebot activation", "Resolver override", "Left direction", "Right direction", "Back direction", "Mouse direction", "AA Direction inverter", "Jitter", "Slow walk", "Edge jump",
    "Thirdperson", "Zoom", "Freecam", "Thirdperson", "Disable Autowall", "Extended backtrack", "Disable autowall"];

(function () {
    const addHotkeyToList = function (bindPath) {
        const keys = UI.GetChildren(bindPath);
        for (var i in keys) {
            hotkeyList[keys[i]] = {
                name: keys[i],
                path: bindPath.concat(keys[i]),
                alpha: 0
            }
        }
    };

    addHotkeyToList(["Rage", "General", "SHEET_MGR", "General", "Key assignment"]);
    addHotkeyToList(["Rage", "Exploits", "SHEET_MGR", "Key assignment"]);
    addHotkeyToList(["Rage", "Anti Aim", "SHEET_MGR", "Key assignment"]);
    addHotkeyToList(["Misc.", "Keys", "SHEET_MGR", "Key assignment"]);
    addHotkeyToList(["Config", "Scripts", "SHEET_MGR", "Keys", "JS Keybinds"]);

    for (var i in samp) {
        hotkeyList[samp[i]] = undefined;
    }

})();

const keybindModes = {
    "Hold": "[holding]",
    "Toggle": "[toggled]",
    "Always": "[always]"
};

draggable.create_draggable(152, 18, (function (menuOpened) {
    if (config.hotkey_list.value) {
        const localPlayer = Entity.GetLocalPlayer();
        const isAnyHotkeyActive = (function () {
            for (var i in hotkeyList) {
                if (hotkeyList[i] && hotkeyList[i].name && UI.GetValue(hotkeyList[i].path) && keybindModes[UI.GetHotkeyState(hotkeyList[i].path)]) {
                    return true;
                }
            }
            return false;
        })();

        const newAlphaValue = Globals.Frametime() * 8 * ((menuOpened || Entity.IsValid(localPlayer) && isAnyHotkeyActive) ? 1 : -1);
        hotkeyList.listInternalData.alpha = math.clamp(hotkeyList.listInternalData.alpha + newAlphaValue, 0, 1);

        if (hotkeyList.listInternalData.alpha > 0) {
            const hotkeyListAccent = menu.get_color(config.menu_color);
            const hotkeyTitleFont = Render.GetFont("verdana.ttf", 10, true);


            var text = "hotkey list"
            var fonten = Render.GetFont("verdana.ttf", 10, true);
            var w = Render.TextSize(text, fonten)[0] + 10;
            var x = Global.GetScreenSize()[0];

            var x = x - w - 10;

            const renderPosition = [this.pos[0], this.pos[1]];
            Render.FilledRect(renderPosition[0], renderPosition[1], this.size[0], 20, [17, 17, 17, 155]);
            Render.FilledRect(renderPosition[0], renderPosition[1], this.size[0], 2, [hotkeyListAccent[0], hotkeyListAccent[1], hotkeyListAccent[2], 222]);
            Render.String(renderPosition[0] + this.size[0] / 2, renderPosition[1] + 3, 1, text, [233, 230, 229, 255], hotkeyTitleFont);


            renderPosition[1] += this.size[1];

            if (!menuOpened) {
                const hotkeyFont = Render.GetFont("verdana.ttf", 10, true);

                for (var i in hotkeyList) {
                    if (hotkeyList[i] && hotkeyList[i].name) {
                        const active = UI.GetValue(hotkeyList[i].path);
                        const mode = keybindModes[UI.GetHotkeyState(hotkeyList[i].path)];
                        const alphaAdditive = Globals.Frametime() * 8 * ((active && !!mode) ? 1 : -1);

                        hotkeyList[i].alpha = math.clamp(hotkeyList[i].alpha + alphaAdditive, 0, 1);
                        if (hotkeyList[i].alpha > 0) {
                            renderPosition[1] += 6;
                            const measuredName = Render.TextSize(i, hotkeyFont);
                            const measuredMode = Render.TextSize(mode, hotkeyFont);

                            if (!active && hotkeyList[i].alpha < 0.15) {
                                renderPosition[1] -= measuredName[1] * hotkeyList[i].alpha * Math.abs(alphaAdditive) * 7.5;
                            }

                            Render.FilledRect(renderPosition[0], renderPosition[1] - 4, this.size[0], this.size[1] - 2, [17, 17, 17, 155]);

                            Render.String(renderPosition[0] + 4, renderPosition[1] - 6, 0, i.toLowerCase(), [0, 0, 0, hotkeyList[i].alpha * 255], hotkeyTitleFont)
                            Render.String(renderPosition[0] + 4, renderPosition[1] - 6, 0, i.toLowerCase(), [233, 230, 229, hotkeyList[i].alpha * 255], hotkeyTitleFont);

                            Render.String(renderPosition[0] + this.size[0] - 4 - measuredMode[0], renderPosition[1] - 6, 0, mode, [0, 0, 0, hotkeyList[i].alpha * 255], hotkeyTitleFont);
                            Render.String(renderPosition[0] + this.size[0] - 4 - measuredMode[0], renderPosition[1] - 6, 0, mode, [233, 230, 229, hotkeyList[i].alpha * 255], hotkeyTitleFont);

                            if (hotkeyList[i].alpha > 0.15) {
                                renderPosition[1] += measuredName[1]
                            }
                        }
                    }
                }
            }
        }
    }
}));
Cheat.RegisterCallback("Draw", "AuroraHotkey");


//Watermark --  Finished
//Zap came in clutch again

function WatermarkText() {
    var getserverstring = World.GetServerString();
    if (getserverstring == "local server") {
        return "local"
    }
    else if (getserverstring == "valve [aimstep]") {
        return "valve"
    }
    else if (getserverstring != "valve [aimstep]" && getserverstring != "local server") {
        return "metamod"
    }
    else {
        return "release"
    }
}

function watermark() {
    UI.SetValue(["Misc.", "Helpers", "General", "Watermark"], 0);
    Number.prototype.zeroPad = function () {
        return ('0' + this).slice(-2);
    };


    var rate = 1 / Globals.Tickrate()
    var tickrate = Math.floor(rate)
    const DateNow = new Date();
    const CurrentTime = DateNow.getHours().zeroPad() + ":" + DateNow.getMinutes().zeroPad() + ":" + DateNow.getSeconds().zeroPad();
    var tickrate = Global.Tickrate()
    const ping = Math.floor(Global.Latency() * 1000 / 1.5);
    var servertext = WatermarkText().toString();
    var getAccent = menu.get_color(config.menu_color);
    var textdebug = "Aurora [debug] | " + Cheat.GetUsername() + " | " + tickrate + "ticks | " + ping + "ms | " + CurrentTime;
    var textrelease = "Aurora [" + servertext + "] | " + Cheat.GetUsername() + " | " + tickrate + " ticks | " + ping + "ms | " + CurrentTime;
    var textbeta = "Aurora [beta] | " + Cheat.GetUsername() + " | " + tickrate + " ticks | " + ping + "ms | " + CurrentTime;

    var fonten = Render.GetFont("verdana.ttf", 10, true);
    if (debugbuild)
        var w = Render.TextSize(textdebug, fonten)[0] + 10;
    else if (betabuild)
        var w = Render.TextSize(textbeta, fonten)[0] + 10;
    else
        var w = Render.TextSize(textrelease, fonten)[0] + 10;
    var x = Global.GetScreenSize()[0];

    var x = x - w - 10;

    Render.FilledRect(x - 25, 11 + 2, w, 18, [17, 17, 17, 155]);
    Render.FilledRect(x - 25, 11, w, 2, [getAccent[0], getAccent[1], getAccent[2], 222]);
    if (debugbuild)
        Render.String(x - 23, 11 + 3, 0, textdebug, [255, 255, 255, 255], fonten);
    else if (betabuild)
        Render.String(x - 23, 11 + 3, 0, textbeta, [255, 255, 255, 255], fonten);
    else
        Render.String(x - 23, 11 + 3, 0, textrelease, [255, 255, 255, 255], fonten);
}
Cheat.RegisterCallback("Draw", "watermark");





// Indicators
function aatext() {
    if (config.aa_modes.value & (1 << 0)) {
        return "None"
    } else if (config.aa_modes.value & (1 << 1)) {
        return "Simple"
    } else if (config.aa_modes.value & (1 << 2)) {
        return "Advanced"
    } else if (config.aa_modes.value & (1 << 1)) {
        return "Kratos"
    } else if (config.aa_modes.value & (1 << 1)) {
        return "Anti-Brute"
    }
}
function dttext() { // None, fast, quck, supersonice
    if (config.Aurora_doubletap.value & (1 << 0)) {
        return "None"
    } else if (config.Aurora_doubletap.value & (1 << 1)) {
        return "Fast"
    } else if (config.Aurora_doubletap.value & (1 << 2)) {
        return "Quick"
    } else if (config.Aurora_doubletap.value & (1 << 1)) {
        return "Supersonic"
    }
}

function fltext() {
    if (config.advanced_fakelag.value & (1 << 0)) {
        return "None"
    } else if (config.advanced_fakelag.value & (1 << 1)) {
        return "Aurora FL"
    } else if (config.advanced_fakelag.value & (1 << 2)) {
        return "Custom FL"
    }
}

function indicators() {
    var screenx = Global.GetScreenSize()[0];
    var screeny = Global.GetScreenSize()[1];
    var color = menu.get_color(config.menu_color);
    var fonten2 = Render.GetFont("verdana.ttf", 10, true);

    Render.Arc = function (x, y, radius, radius_inner, start_angle, end_angle, segments, color) {
        segments = 360 / segments;
        for (var i = start_angle; i < start_angle + end_angle; i = i + segments) {
            var rad = i * Math.PI / 180;
            var rad2 = (i + segments) * Math.PI / 180;
            var rad_cos = Math.cos(rad);
            var rad_sin = Math.sin(rad);
            var rad2_cos = Math.cos(rad2);
            var rad2_sin = Math.sin(rad2);
            var x1_inner = x + rad_cos * radius_inner;
            var y1_inner = y + rad_sin * radius_inner;
            var x1_outer = x + rad_cos * radius;
            var y1_outer = y + rad_sin * radius;
            var x2_inner = x + rad2_cos * radius_inner;
            var y2_inner = y + rad2_sin * radius_inner;
            var x2_outer = x + rad2_cos * radius;
            var y2_outer = y + rad2_sin * radius;

            Render.Polygon([
                [x1_outer, y1_outer],
                [x2_outer, y2_outer],
                [x1_inner, y1_inner]],
                color
            );

            Render.Polygon([
                [x1_inner, y1_inner],
                [x2_outer, y2_outer],
                [x2_inner, y2_inner]],
                color
            );
        }
    }
    Render.OutlineString = function (x, y, a, s, c, f) {
        const alpha = Math.min(255, c[3]);
        Render.String(x - 1, y - 1, a, s, [0, 0, 0, 55], f);
        Render.String(x - 1, y + 1, a, s, [0, 0, 0, 55], f);
        Render.String(x + 1, y - 1, a, s, [0, 0, 0, 55], f);
        Render.String(x + 1, y + 1, a, s, [0, 0, 0, 55], f);
        Render.String(x, y, a, s, c, f);
    }

    var fake = Local.GetFakeYaw();
    var real = Local.GetRealYaw();
    var delta = Math.min(Math.abs(real - fake) / 2, 60).toFixed(0);
    iloveyou = Number(delta);
    var dt_active = UI.GetValue(["Rage", "Exploits", "Key assignment", "Double tap"]);
    var advfl_active = config.advanced_fakelag.value;
    var x = screenx / 2
    var y = screeny / 2
    var text = delta
    var w = Render.TextSize(text, fonten2)[0] + 10;
    const charge = Exploit.GetCharge();

    //TEXT FOR IND
    var aamodes_text = aatext();
    var dtmodes_text = dttext();
    var flmodes_text = fltext();

    if (dt_active) {
        dt_height = 45
    } else {
        dt_height = 35
    }
    Render.Arc(x + w + 19, y + 19, 1.4, 0.5, 200, 360, 100, color);;
    Render.OutlineString(x - 30, y + 15, 0, "Aurora", color, fonten2);
    Render.OutlineString(x + 28, y + 15, 0, delta, color, fonten2);
    if (config.indicators.value & (1 << 2)) {
        Render.OutlineString(x - 12, y + 25, 0, aamodes_text, [255, 255, 255, 255], fonten2);
    }
    if (dt_active && config.indicators.value & (1 << 0))
        Render.OutlineString(x - 12, y + 35, 0, "   " + dtmodes_text, [255, 255, 255, 255], fonten2);
    else;
    if (dt_active && config.indicators.value & (1 << 0))
        Render.OutlineString(x - 30, y + 35, 0, "DT", [184 - 35 * charge, 6 + 178 * charge, 6, 255], fonten2);
    else;
    if (advfl_active && config.indicators.value & (1 << 1))
        Render.OutlineString(x - 30, y + dt_height, 0, flmodes_text, color, fonten2);
    else;
}
//Cheat.RegisterCallback("Draw", "indicators")

//Aspect Ratio
function AspectRatio() {
    ar_cache = Convar.GetString("r_aspectratio")
    ar_cachestr = ar_cache.toString();
    slidervalue = config.aspect_ratio_slider.value;
    sliderstr = slidervalue.toString();
    if (config.aspect_ratio.value) {
        Convar.SetString("r_aspectratio", sliderstr);
    }
    else {
        Convar.SetString("r_aspectratio", ar_cachestr);
    }
}

Cheat.RegisterCallback("FrameStageNotify", "AspectRatio");

//Hide Chat
function hidechat() {
    if (config.hide_chat.value) {
        Convar.SetInt("cl_chatfilters", 0)
    } else {
        Convar.SetInt("cl_chatfilters", 63)
    }
}
Cheat.RegisterCallback("CreateMove", "hidechat")

//Healthshot effect
var alpha = 0;
var size = 0;

function clamp(v, min, max) {
    return Math.max(Math.min(v, max), min);
}


function render_effect() {
    if (config.healthshot_effect.value) {
        if (alpha === 0)
            return;

        const inc_alpha = ((1 / config.healthshot_effect_strongness.value) * Global.Frametime()) * 255
        const inc_size = ((1 / config.healthshot_effect_strongness.value) * Global.Frametime()) * 360

        alpha = clamp(alpha - inc_alpha, 0, 255);
        size = clamp(size - inc_size, 0, 360);

        const x = Global.GetScreenSize()[0], y = Global.GetScreenSize()[1];
        const hscolor = menu.get_color(config.healthshot_color)

        Render.GradientRect(0, 0, x, size, 0, [hscolor[0], hscolor[1], hscolor[2], alpha], [hscolor[0], hscolor[1], hscolor[2], 0]);
        Render.GradientRect(0, y - size, x, size, 0, [hscolor[0], hscolor[1], hscolor[2], 0], [hscolor[0], hscolor[1], hscolor[2], alpha]);
        Render.GradientRect(x - size, 0, size, y, 1, [hscolor[0], hscolor[1], hscolor[2], 0], [hscolor[0], hscolor[1], hscolor[2], alpha]);
        Render.GradientRect(0, 0, size, y, 1, [hscolor[0], hscolor[1], hscolor[2], alpha], [hscolor[0], hscolor[1], hscolor[2], 0]);
    }
}

function on_death() {
    const attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    const userid = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    const player = Entity.GetLocalPlayer();

    if (attacker === player && userid != player) {
        alpha = 255;
        size = 360;
    }
}

Global.RegisterCallback("player_death", "on_death");
Global.RegisterCallback("Draw", "render_effect");

// Upon startup shows Aurora ASCII art

function asciiart() {
    var randomnumber = GetMathRandom(1, 7)


}
Cheat.Print("      _____                                     \n")
Cheat.Print("     /  _  \\  __ _________  ________________    \n")
Cheat.Print("    /  /_\\  \\|  |  \\_  __ \\/  _ \\_  __ \\__  \\  \n")
Cheat.Print("   /    |    \\  |  /|  | \\(  <_> )  | \\// __ \\_ \n")
Cheat.Print("   \\____|__  /____/ |__|   \\____/|__|  (____  / \n")
Cheat.Print("           \\/                               \\/  \n")
