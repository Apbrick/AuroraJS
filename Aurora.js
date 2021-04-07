// NADE WARNING DONT WORKY WITH MOLOTOVS

debugbuild = Cheat.GetUsername() == "Apbrick" || Cheat.GetUsername() == "Heneston";
betabuild = Cheat.GetUsername() == "Edde6969" || Cheat.GetUsername() == "Timing" || Cheat.GetUsername() == "Natzmortes" || Cheat.GetUsername() == "flexy04";

aspectratiocache = Convar.GetString("r_aspectratio")
restrictions_cache = UI.GetValue(["Config", "Cheat", "General", "Restrictions"]);
yaw_offset_cache = UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]);
jitter_offset_cache = UI.GetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"]);
pitch_cache = UI.GetValue(["Rage", "Anti Aim", "General", "Pitch mode"]);
at_tar = UI.GetValue(["Rage", "Anti Aim", "Directions", "At targets"]);
autodir = UI.GetValue(["Rage", "Anti Aim", "Directions", "Auto direction"]);


UI.AddHotkey(["Config", "Scripts", "JS Keybinds"], "Minimum DMG", "[aurora] min dmg")
UI.AddHotkey(["Config", "Scripts", "JS Keybinds"], "E-Peek", "[aurora] e-peek")
UI.AddHotkey(["Config", "Scripts", "JS Keybinds"], "Freestanding", "[aurora] freestanding")

UI.SetValue(["Config", "Scripts", "JS Keybinds", "Freestanding"], 0x0)
UI.SetValue(["Config", "Scripts", "JS Keybinds", "E-Peek"], 0x0)
UI.SetValue(["Config", "Scripts", "JS Keybinds", "Minimum DMG"], 0x0)

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
        x: 55,
        y: 0,
        w: 0,
        h: 0,
        offset: 0
    },

    x: 140,
    y: 140,
    w: 800,
    h: 500,

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
    // RAGE FEATURES
    target_selection: dropdown_t(),
    avoid_hitboxes: dropdown_t(),
    forcesafety: dropdown_t(),
    inairoptions: checkbox_t(),
    inair_weapons: dropdown_t(),
    awp_inair: slider_t(),
    r8_inair: slider_t(),
    scout_inair: slider_t(),
    smg_inair: slider_t(),
    dmg_override: checkbox_t(),
    dmg_override_value: slider_t(),
    dmg_override_key: hotkey_t(0x0, hotkey_mode_t.TOGGLE, false),
    delayshot: checkbox_t(),
    noscope: checkbox_t(),
    noscopeflag: checkbox_t(),
    noscopedistance: slider_t(),
    telepeak: checkbox_t(),
    mmfakeduck: hotkey_t(0x0, hotkey_mode_t.HOLD, false),
    dynamichitchance: checkbox_t(),
    pingspike: checkbox_t(),
    aimlog: checkbox_t(),
    aimlog_chat: checkbox_t(),

    // AA FEATURES
    aa_modes: dropdown_t(),
    e_peek: hotkey_t(0x0, hotkey_mode_t.HOLD, false),
    freestanding: hotkey_t(0x0, hotkey_mode_t.TOGGLE, false),
    low_delta_slowwalk: checkbox_t(),
    deltamode: dropdown_t(),
    slowwalkspeed: slider_t(),
    leg_breaker: checkbox_t(),

    // DOUBLETAP FEATURES
    doubletap: dropdown_t(),
    fast_recharge: checkbox_t(),
    weapon_swap_recharge: checkbox_t(),
    mindmgdt: checkbox_t(),
    log_dt_speed: checkbox_t(),



    // FAKELAG FEATURES
    advanced_fakelag: dropdown_t(),
    FLonRoundEnd: checkbox_t(),

    // VISUAL FEATURES
    indicators: dropdown_t(),
    indicators_color: color_picker_t(213, 78, 92, 255),
    aspect_ratio: checkbox_t(),
    aspect_ratio_slider: slider_t(),
    healthshot_effect: checkbox_t(),
    healthshot_effect_strength: slider_t(),
    healthshot_color: color_picker_t(207, 23, 100, 255),
    rainbow_bar: checkbox_t(),
    rainbow_fullscreen: checkbox_t(),
    rainbow_bar_speed: slider_t(),
    fog: checkbox_t(),
    fog_type: dropdown_t(),
    fog_density: slider_t(),
    fog_color: color_picker_t(255, 255, 255, 255),
    snowflakes: checkbox_t(),
    hotkey_list: checkbox_t(),
    grenade_tracer: checkbox_t(),

    // MISC FEATURES
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

function on_unload() {
    input_system.enable_mouse_input(false);
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
        DataFile.SetKey("Aurora.ini", variable, JSON.stringify(object));
    }

    // save/create file
    DataFile.Save("Aurora.ini");

    // log
    Cheat.Print("[Aurora] Configuration saved.\n");
}

config_system.load = function () {

    // load the file
    DataFile.Load("Aurora.ini");

    // loop thru all config variables
    for (var variable in config) {
        // get the JSON value
        var string = DataFile.GetKey("Aurora.ini", variable);

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

config_system.reset = function () {
    for (var variable in config) {
        DataFile.EraseKey("Aurora.ini", variable);
        DataFile.Load("Aurora.ini");
    }

    DataFile.Save("Aurora.ini");

    Cheat.Print("[Aurora] Configuration reset.\n");
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
    menu.font = Render.GetFont("verdana.ttf", 12, true);
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
    menu.topbar(menu.x, menu.y - 3, menu.w, 10, [topaccent[0], topaccent[1], topaccent[2], 255], [topaccent[0], topaccent[1], topaccent[2], 255], [topaccent[0], topaccent[1], topaccent[2], 255], "Aurora | " + Cheat.GetUsername());
    // render the menu's body
    menu.body(menu.x, menu.y, menu.w, menu.h, [36, 36, 36, 255], [25, 25, 25, 255], [36, 36, 36, 255], "Aurora  |  buyaurora.today");
    menu.body(menu.x, menu.y + 500, menu.w, 5, [36, 36, 36, 255], [25, 25, 25, 255], [36, 36, 36, 255], Cheat.GetUsername());


    // tabs groupbox
    menu.groupbox(menu.x + 5, menu.y + 35, 100, 460, "tabs", false); {
        // render tabs
        menu.tab("Rage", 1, false, [])
        menu.tab("Anti-Aim", 2, false, [])
        menu.tab("Double Tap", 3, false, [])
        menu.tab("Fakelag", 4, false, [])
        menu.tab("Visuals", 5, false, [])
        menu.tab("Misc", 6, false, [])
    }

    // switch between tabs
    switch (menu.curr_tab) {
        case 0:
            switch (menu.curr_subtab["tab 0"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 685, 460, "groupbox 3", false); {
                        menu.label("Welcome to Aurora")
                        menu.label("")
                        menu.label("Current version: V 2.1.1")
                        menu.label("Update Log:")
                        menu.label(" - Fixed issue where script would crash with aimlogs on")
                        menu.label("")
                        menu.label("Full update log can be found at:")
                        menu.label("updates.buyaurora.today")
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
                    menu.groupbox(menu.x + 110, menu.y + 35, 340, 460, "groupbox 3", false); {
                        menu.multibox("Avoid unsafe hitboxes", ["Head", "Chest", "Arms", "Stomach", "Legs", "Feet"], "avoid_hitboxes");
                        menu.multibox("Force safety on hitbox", ["Head", "Chest", "Arms", "Stomach", "Legs", "Feet"], "forcesafety");
                        menu.combobox("Target Selection", ["Default", "Closest Target"], "target_selection")
                        menu.checkbox("In air options", "inairoptions")
                        function inair() {
                            if (config.inairoptions.value) {
                                var inairweapons = config.inair_weapons.value
                                menu.multibox("Weapons", ["AWP", "R8 Revolver", "SSG08", "SMG"], "inair_weapons");
                                if (inairweapons & (1 << 0)) {
                                    menu.slider("   AWP Hitchance", "awp_inair", -1, 101, 1, false)
                                }
                                if (inairweapons & (1 << 1)) {
                                    menu.slider("   R8 Hitchance", "r8_inair", -1, 101, 1, false)
                                }
                                if (inairweapons & (1 << 2)) {
                                    menu.slider("   SSG Hitchance", "scout_inair", -1, 101, 1, false)
                                }
                                if (inairweapons & (1 << 3)) {
                                    menu.slider("   SMG Hitchance", "smg_inair", -1, 101, 1, false)
                                }
                            }
                        }
                        inair()

                        menu.checkbox("Minimum damage override", "dmg_override")
                        function mindmg() {
                            if (config.dmg_override.value) {
                                menu.hotkey("   Min DMG Key", "dmg_override_key")
                                menu.slider("   Damage", "dmg_override_value", -1, 101, 1, false)
                            }
                        }
                        mindmg()
                        menu.checkbox("Aim logs", "aimlog")
                        function aimlog() {
                            if (config.aimlog.value) {
                                menu.checkbox("Log in chat", "aimlog_chat")
                            }
                        }
                        aimlog()
                    }
                    menu.groupbox(menu.x + 450, menu.y + 35, 340, 460, "groupbox 4", false); {
                        menu.checkbox("Delay shot", "delayshot")

                        menu.checkbox("No-scope Distance", "noscope")
                        function noscope() {
                            if (config.noscope.value) {
                                menu.checkbox("   Noscopable Flag", "noscopeflag")
                                menu.slider("   Max distance", "noscopedistance", 0, 21, 1, false)
                            }
                        }
                        noscope()

                        menu.checkbox("Teleport on peek", "telepeak")
                        menu.label("Only works on Scout")
                        menu.hotkey("MatchMaking Fakeduck", "mmfakeduck")
                        menu.checkbox("Dynamic Hitchance", "dynamichitchance")
                        menu.checkbox("Ping spike on peek", "pingspike")
                    }
                    break;
            }
            break;

        // second tab
        case 2:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 2"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 340, 460, "groupbox 3", false); {
                        menu.combobox("Modes", ["None", "Simple", "Advanced", "Aurora", "Anti-Brute", "Dangerous", "Safe"], "aa_modes");
                        menu.hotkey("E-Peek", "e_peek");
                        menu.hotkey("Freestanding", "freestanding")

                    }

                    menu.groupbox(menu.x + 450, menu.y + 35, 340, 460, "groupbox 4", false); {
                        menu.checkbox("Slowwalk AA", "low_delta_slowwalk");
                        function slowwalkspeed() {
                            if (config.low_delta_slowwalk.value) {
                                menu.combobox(" Override Delta", ["Low delta", "High delta"], "deltamode")
                                menu.slider("   Speed", "slowwalkspeed", 0, 80, 1, false)
                            }
                        }
                        slowwalkspeed();
                        menu.checkbox("Anti Prediction", "leg_breaker");
                    }
                    break;
            }
            break;
        case 3:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 3"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 340, 460, "groupbox 3", false); {
                        menu.combobox("Aurora Doubletap", ["None", "Fast", "Quick", "Supersonic"], "doubletap");
                        function dtshow() {
                            if (config.doubletap.value >= 1) {
                                menu.checkbox("Instant Recharge", "fast_recharge");
                                menu.checkbox("Recharge on swap", "weapon_swap_recharge");
                                menu.checkbox("Dynamic Doubletap Damageq", "mindmgdt")
                                menu.checkbox("Log DT Speed", "log_dt_speed")
                            }
                        }
                        dtshow();
                    }
                    menu.groupbox(menu.x + 450, menu.y + 35, 340, 460, "groupbox 4", false); {

                    }
                    break;
            }
            break;
        case 4:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 4"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 340, 460, "groupbox 3", false); {
                        menu.combobox("Fakelag Modes", ["None", "Aurora", "Ideal Tick", "Fluctuate", "Maximum", "Switch"], "advanced_fakelag");
                    }
                    menu.groupbox(menu.x + 450, menu.y + 35, 340, 460, "groupbox 4", false); {

                    }
                    break;
            }
            break;
        case 5:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 5"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 340, 460, "groupbox 3", false); {
                        menu.checkbox("Aspect Ratio", "aspect_ratio")
                        function aspslider() {
                            if (config.aspect_ratio.value) {
                                menu.slider("   Value", "aspect_ratio_slider", 0, 2, 0.001, true)
                            }
                        }
                        aspslider();

                        menu.checkbox("Kill Effect", "healthshot_effect")
                        function healthslider() {
                            if (config.healthshot_effect.value) {
                                menu.slider("Speed", "healthshot_effect_strength", 0, 4, 0.1, true)
                                menu.color_picker("   Color", "healthshot_color", false)
                            }
                        }
                        healthslider();

                        menu.checkbox("Rainbow Bar", "rainbow_bar")
                        function rainbowbar() {
                            if (config.rainbow_bar.value) {
                                menu.checkbox("   Fullscreen", "rainbow_fullscreen")
                                menu.slider("   Speed", "rainbow_bar_speed", 1, 10, 1, false)
                            }
                        }
                        rainbowbar();
                        menu.checkbox("Hotkey list", "hotkey_list")
                        menu.checkbox("Grenade Tracer", "grenade_tracer")
                    }
                    menu.groupbox(menu.x + 450, menu.y + 35, 340, 460, "groupbox 4", false); {
                        /*
                        fog: checkbox_t(),
                        fog_color: color_picker_t(213, 78, 92, 255),
                        fog_start_distance: slider_t(),
                        fog_distance: slider_t(),
                        fog_density: slider_t(),
                        */
                        menu.checkbox("Fog", "fog")
                        function fog() {
                            if (config.fog.value) {
                                menu.combobox("Fog type", ["Full", "Far", "Close"], "fog_type")
                                menu.slider("Fog Density", "fog_density", -1, 101, 1, false)
                                menu.color_picker("Fog Color", "fog_color", false)
                            }
                        }
                        fog()
                        menu.checkbox("Snowflakes", "snowflakes")
                        menu.combobox("Indicators", ["None", "V1", "Aurora", "Aurora V2", "Old Sidebar", "New Sidebar", "Sidebar V2"], "indicators")
                        menu.color_picker("Indicators Color", "indicators_color", false)
                    }
                    break;
            }
            break;
        case 6:
            // switch between subtabs in the second tab
            switch (menu.curr_subtab["tab 6"]) {
                // first subtab
                case 0:
                    menu.groupbox(menu.x + 110, menu.y + 35, 340, 460, "groupbox 3", false); {
                        menu.combobox("Clantag", ["Off", "Static", "Fancy"], "clantag");
                        menu.checkbox("Hide Chat", "hide_chat")
                    }
                    menu.groupbox(menu.x + 450, menu.y + 35, 340, 460, "groupbox 4", false); {
                        menu.hotkey("Menu hotkey", "menu_hotkey");
                        menu.color_picker("Menu color", "menu_color", false)
                        menu.button("Save config", config_system.save);
                        menu.button("Load config", config_system.load);
                        //                        menu.button("Reset config", config_system.reset);
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

menu.topbar = function (x, y, w, h, bg, header_text, header_line, name) {
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
    Render.FilledRect(x, y, w, h - 7, header_text)
    Render.FilledRect(x, y, w, h - 7, header_line)
    Render.String(x + 10, y, 0, name, [255, 255, 255, 205], menu.font)
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

menu.label = function (string) {
    // when u add a checkbox it automatically places based on these
    var x = menu.curr_groupbox.x + 10, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;

    // render name
    Render.String(x, y, 0, string, [255, 255, 255, 205], menu.font)

    // update offset
    menu.curr_groupbox.offset += 15;
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
    var x = menu.curr_groupbox.x + 65, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 10;
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
    var x = menu.curr_groupbox.x + 10, y = menu.curr_groupbox.y + menu.curr_groupbox.offset + 13;
    const w = 75, h = 18;

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


function getDropdownValue(value, index) {
    var mask = 1 << index;
    return value & mask ? true : false;
}

function hotkeymode1() {
    if (config.e_peek.mode == 0) {
        return "Hold"
    } else if (config.e_peek.mode == 1) {
        return "Toggle"
    } else {
        return "Always"
    }
}

function hotkeymode2() {
    if (config.dmg_override_key.mode == 0) {
        return "Hold"
    } else if (config.dmg_override_key.mode == 1) {
        return "Toggle"
    } else {
        return "Always"
    }
}

function hotkeymode3() {
    if (config.freestanding.mode == 0) {
        return "Hold"
    } else if (config.freestanding.mode == 1) {
        return "Toggle"
    } else {
        return "Always"
    }
}

mode1 = hotkeymode1().toString()
mode2 = hotkeymode2().toString()
mode3 = hotkeymode3().toString()

function getMathRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min)) + min;
}

function getVelocity(index) {
    var velocity = Entity.GetProp(index, "CBasePlayer", "m_vecVelocity[0]");
    return Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
}

var wep2tab = {
    "usp s": "USP", "glock 18": "Glock", "dual berettas": "Dualies", "r8 revolver": "Revolver", "desert eagle": "Deagle", "p250": "P250", "tec 9": "Tec-9",
    "mp9": "MP9", "mac 10": "Mac10", "pp bizon": "PP-Bizon", "ump 45": "UMP45", "ak 47": "AK47", "sg 553": "SG553", "aug": "AUG", "m4a1 s": "M4A1-S", "m4a4": "M4A4", "ssg 08": "SSG08",
    "awp": "AWP", "g3sg1": "G3SG1", "scar 20": "SCAR20", "xm1014": "XM1014", "mag 7": "MAG7", "m249": "M249", "negev": "Negev", "p2000": "General", "famas": "FAMAS", "five seven": "Five Seven", "mp7": "MP7",
    "ump 45": "UMP45", "p90": "P90", "cz75 auto": "CZ-75", "mp5 sd": "MP5", "galil ar": "GALIL", "sawed off": "Sawed off"
};
var tab_names = ["General", "USP", "Glock", "Five Seven", "Tec-9", "Deagle", "Revolver", "Dualies", "P250", "CZ-75", "Mac10", "P90", "MP5", "MP7", "MP9", "UMP45", "PP-Bizon", "M4A1-S", "M4A4", "AK47", "AUG", "SG553", "FAMAS", "GALIL", "AWP", "SSG08", "SCAR20", "G3SG1", "M249", "XM1014", "MAG7", "Negev", "Sawed off"];

function renderArc(xCoordinate, yCoordinate, radius, innerRadius, startingAngle, endingAngle, segments, color) {
    for (var i = startingAngle; i < startingAngle + endingAngle; i = i + (360 / segments)) {

        Render.Polygon([
            [xCoordinate + Math.cos(i * Math.PI / 180) * radius, yCoordinate + Math.sin(i * Math.PI / 180) * radius],
            [xCoordinate + Math.cos((i + (360 / segments)) * Math.PI / 180) * radius, yCoordinate + Math.sin((i + (360 / segments)) * Math.PI / 180) * radius],
            [xCoordinate + Math.cos(i * Math.PI / 180) * innerRadius, yCoordinate + Math.sin(i * Math.PI / 180) * innerRadius]],
            color
        );

        Render.Polygon([
            [xCoordinate + Math.cos(i * Math.PI / 180) * innerRadius, yCoordinate + Math.sin(i * Math.PI / 180) * innerRadius],
            [xCoordinate + Math.cos((i + (360 / segments)) * Math.PI / 180) * radius, yCoordinate + Math.sin((i + (360 / segments)) * Math.PI / 180) * radius],
            [xCoordinate + Math.cos((i + (360 / segments)) * Math.PI / 180) * innerRadius, yCoordinate + Math.sin((i + (360 / segments)) * Math.PI / 180) * innerRadius]],
            color
        );
    }
}



function onAvoidingHitboxes() {
    Entity.GetEnemies().forEach((function (player) {
        if (Ragebot.GetTargetHitchance() <= 75) {
            if (config.avoid_hitboxes.value & (1 << 0)) {
                Ragebot.IgnoreTargetHitbox(player, 0);
                Ragebot.IgnoreTargetHitbox(player, 1);
            }

            if (config.avoid_hitboxes.value & (1 << 1)) {
                Ragebot.IgnoreTargetHitbox(player, 5);
            }

            if (config.avoid_hitboxes.value & (1 << 2)) {
                Ragebot.IgnoreTargetHitbox(player, 6);
            }

            if (config.avoid_hitboxes.value & (1 << 3)) {
                Ragebot.IgnoreTargetHitbox(player, 2);
                Ragebot.IgnoreTargetHitbox(player, 3);
                Ragebot.IgnoreTargetHitbox(player, 4);
            }

            if (config.avoid_hitboxes.value & (1 << 4)) {
                Ragebot.IgnoreTargetHitbox(player, 7);
                Ragebot.IgnoreTargetHitbox(player, 8);
                Ragebot.IgnoreTargetHitbox(player, 9);
                Ragebot.IgnoreTargetHitbox(player, 10);
            }

            if (config.avoid_hitboxes.value & (1 << 5)) {
                Ragebot.IgnoreTargetHitbox(player, 11);
                Ragebot.IgnoreTargetHitbox(player, 12);
            }
        }
    }));
}


function onForcingSafety() {
    Entity.GetEnemies().forEach((function (player) {
        if (getDropdownValue(config.forcesafety.value, 0)) {
            Ragebot.ForceHitboxSafety(player, 0);
            Ragebot.ForceHitboxSafety(player, 1);
        }

        if (getDropdownValue(config.forcesafety.value, 1)) {
            Ragebot.ForceHitboxSafety(player, 5);
        }

        if (getDropdownValue(config.forcesafety.value, 2)) {
            Ragebot.ForceHitboxSafety(player, 6);
        }

        if (getDropdownValue(config.forcesafety.value, 3)) {
            Ragebot.ForceHitboxSafety(player, 2);
            Ragebot.ForceHitboxSafety(player, 3);
            Ragebot.ForceHitboxSafety(player, 4);
        }

        if (getDropdownValue(config.forcesafety.value, 4)) {
            Ragebot.ForceHitboxSafety(player, 7);
            Ragebot.ForceHitboxSafety(player, 8);
            Ragebot.ForceHitboxSafety(player, 9);
            Ragebot.ForceHitboxSafety(player, 10);
        }

        if (getDropdownValue(config.forcesafety.value, 5)) {
            Ragebot.ForceHitboxSafety(player, 11);
            Ragebot.ForceHitboxSafety(player, 12);
        }
    }));
}

function onAirHitchance() {
    inAirOptions = config.inairoptions.value;
    var flags = Entity.GetProp(Entity.GetLocalPlayer(), 'CBasePlayer', 'm_fFlags');

    if (getDropdownValue(config.inair_weapons.value, 0) && config.inairoptions.value) {
        if (Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'awp') {
            !(flags & 1 << 0) && !(flags & 1 << 18) && (target = Ragebot.GetTarget(), Ragebot.ForceTargetHitchance(target, onfig.awp_inair.value));
        }
    }

    if (getDropdownValue(config.inair_weapons.value, 1) && config.inairoptions.value) {
        if (Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'ssg 08') {
            !(flags & 1 << 0) && !(flags & 1 << 18) && (target = Ragebot.GetTarget(), Ragebot.ForceTargetHitchance(target, config.scout_inair.value));
        }
    }

    if (getDropdownValue(config.inair_weapons.value, 2) && config.inairoptions.value) {
        if (Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'r8 revolver') {
            !(flags & 1 << 0) && !(flags & 1 << 18) && (target = Ragebot.GetTarget(), Ragebot.ForceTargetHitchance(target, config.r8_inair.value));
        }
    }

    if (getDropdownValue(config.inair_weapons.value, 3) && config.inairoptions.value) {
        if (Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'mp9' || Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'mac 10' || Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'pp bizon' || Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'ump 45' || Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'mp7' || Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'p90' || Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'mp5 sd') {
            !(flags & 1 << 0) && !(flags & 1 << 18) && (target = Ragebot.GetTarget(), Ragebot.ForceTargetHitchance(target, config.smg_inair.value));
        }
    }
}


function onMinDMG() {
    if (!Entity.IsAlive(Entity.GetLocalPlayer())) {
        return;
    }
    if (config.dmg_override_key.active) {
        UI.SetHotkeyState(["Config", "Scripts", "JS Keybinds", "Minimum DMG"], mode2)
        var mindmghexString = config.dmg_override_key.value.toString(16);
        UI.SetValue(["Config", "Scripts", "JS Keybinds", "Minimum DMG"], Number("0x" + mindmghexString))
        if (!UI.GetValue(["Config", "Scripts", "JS Keybinds", "Minimum DMG"])) {
            UI.ToggleHotkey(["Config", "Scripts", "JS Keybinds", "Minimum DMG"])
        }

        var target = Entity.GetEnemies();
        for (var i in target) {
            if (config.dmg_override.value) {
                Ragebot.ForceTargetMinimumDamage(target[i], config.dmg_override_value.value)
            }
            else {
                Ragebot.ForceTargetMinimumDamage(target[i], 1)
            }
        }
    } else {
        if (UI.GetValue(["Config", "Scripts", "JS Keybinds", "Minimum DMG"])) {
            UI.ToggleHotkey(["Config", "Scripts", "JS Keybinds", "Minimum DMG"])
        }
    }
}



var lastTimeShot = [];

const enemy_cache = {};
var local_player = null;

const onScriptLoad = void function () {
    local_player = Entity.GetLocalPlayer();
    Entity.GetLastShotTime = function (entity) {
        if (entity === undefined) return;
        const entity_gun = Entity.GetWeapon(entity);
        if (entity_gun === undefined) return;
        const last_shot_time = Entity.GetProp(entity_gun, "CWeaponCSBase", "m_fLastShotTime");
        return last_shot_time;
    };


    Entity.GetNextAttackTime = function (entity) {
        if (entity === undefined) return;
        const next_attack_time = Entity.GetProp(entity, "CCSPlayer", "m_flNextAttack");
        return next_attack_time;
    };


    Entity.GetOnshotWindow = function (entity, last_shot_time, next_attack_time) {
        if (entity === undefined || last_shot_time === undefined || next_attack_time === undefined) return;
        const sim_time = Entity.GetProp(entity, "CCSPlayer", "m_flSimulationTime");
        if (sim_time === undefined) return false;
        const valid_onshot_time_window = sim_time.toFixed(6) < Math.ceil(last_shot_time.toFixed(6));
        return valid_onshot_time_window;
    };
    Local.UpdateCache = function () {
        const enemies = Entity.GetEnemies();
        const cache_keys = Object.keys(enemy_cache);
        for (var c in cache_keys) {
            const current_key = cache_keys[c];
            if (!enemies || enemies.length === 0 || enemies.indexOf(current_key) === -1) delete enemy_cache[current_key];
        };
        for (var e in enemies) {
            const current_id = enemies[e];
            if (Entity.IsDormant(current_id) || !Entity.IsValid(current_id) || !Entity.IsAlive(current_id)) continue;
            const last_shot_time = Entity.GetLastShotTime(current_id);
            if (last_shot_time === undefined) continue;
            const next_attack_time = Entity.GetNextAttackTime(current_id);
            if (next_attack_time === undefined) continue;
            const can_be_onshot = Entity.GetOnshotWindow(current_id, last_shot_time, next_attack_time);
            if (can_be_onshot === undefined) continue;
            enemy_cache[current_id.toString()] = { "can_be_onshot": can_be_onshot };
        };
    };

    Local.UpdateCache();

}();

function onDelayShot() {
    if (!config.delayshot.value) return;
    if (!World.GetServerString()) return;
    Local.UpdateCache();
    if (!enemy_cache) return;
    const enemies = Object.keys(enemy_cache);
    for (var e in enemies) {
        const current_id = parseInt(enemies[e]);
        const can_be_onshot = enemy_cache[current_id.toString()].can_be_onshot;
        if (can_be_onshot === false) continue;
        const local_eye_position = Entity.GetEyePosition(local_player);
        const target_head_position = Entity.GetHitboxPosition(current_id, 0)
        const damage_result = Trace.Bullet(local_player, current_id, local_eye_position, target_head_position)[1];
        if (damage_result === undefined) continue;
        Ragebot.ForceTargetMinimumDamage(current_id, damage_result);
        for (var id = 1; id <= 18; id++) Ragebot.IgnoreTargetHitbox(current_id, id);
    };
};

function onWeaponFire() {
    Local.UpdateCache();
};




function closestTarget() {
    var local = Entity.GetLocalPlayer();
    var enemies = Entity.GetEnemies();
    var dists = [];
    for (e in enemies) {
        if (!Entity.IsAlive(enemies[e]) || Entity.IsDormant(enemies[e]) || !Entity.IsValid(enemies[e])) continue;
        dists.push([enemies[e], calcDist(Entity.GetHitboxPosition(local, 0), Entity.GetHitboxPosition(enemies[e], 0))]);
    }
    dists.sort((function (a, b) {
        return a[1] - b[1];
    }));
    if (dists.length == 0 || dists == []) return (target = -1);
    return dists[0][0];
}
function calcDist(a, b) {
    x = a[0] - b[0];
    y = a[1] - b[1];
    z = a[2] - b[2];
    return Math.sqrt(x * x + y * y + z * z);
}
function get_metric_distance(a, b) {
    return Math.floor(Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)) * 0.0254);
}

var target = -1;
function onNSDistance() {
    if (config.noscope.value) {
        localplayer = Entity.GetLocalPlayer();
        localplayer_weapon = Entity.GetWeapon(localplayer);
        currentweapon = Entity.GetName(localplayer_weapon);
        if (currentweapon === "g3sg1") {
            currentweapon = "G3SG1";
        } else if (currentweapon === "awp") {
            currentweapon = "AWP";
        } else if (currentweapon === "scar 20") {
            currentweapon = "SCAR20";
        } else {
            currentweapon = "none";
        }
        if (!Ragebot.GetTarget()) target = closestTarget();
        else target = Ragebot.GetTarget();
        if (currentweapon != "none") {
            if (!Entity.IsAlive(target)) {
                UI.SetValue(["Rage", "SUBTAB_MGR", "Accuracy", "SHEET_MGR", currentweapon, "Auto scope"], 1);
                return;
            }
            if (get_metric_distance(Entity.GetRenderOrigin(Entity.GetLocalPlayer()), Entity.GetRenderOrigin(target)) < config.noscopedistance.value) {
                UI.SetValue(["Rage", "SUBTAB_MGR", "Accuracy", "SHEET_MGR", currentweapon, "Auto scope"], 0);
                if (config.noscopeflag.value) {
                    target = Ragebot.GetTargets();
                    for (i = 0; i < target.length; i++) {
                        Entity.DrawFlag(target[i], "NOSCOPEABLE", [0, 255, 255, 255])
                    }
                }
            } else {
                UI.SetValue(["Rage", "SUBTAB_MGR", "Accuracy", "SHEET_MGR", currentweapon, "Auto scope"], 1);
            }
        }
    }
}


notpeeked = 0
peeked = 0

function onTelepeak() {
    if (config.telepeak.value) {
        if (Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer())) == 'ssg 08') {
            if (Ragebot.GetTargets() == "" && notpeeked == 0) {
                UI.SetValue(["Rage", "Exploits", "General", "Double tap"], 1)
            }
            else if (Ragebot.GetTargets() != "") {
                notpeeked = 1
                peeked = Globals.Realtime()
            }

            if (notpeeked == 1) {
                UI.SetValue(["Rage", "Exploits", "General", "Double tap"], 0)
                if (peeked + 1 < Globals.Realtime()) {
                    notpeeked = 0
                }
            }
        }
    }
}

var crouchHeight;

function onMMFakeduck() {
    var cmd = UserCMD.GetButtons();
    if (config.mmfakeduck.active) {
        var entityStuff = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_flDuckAmount");
        if (UserCMD.Choke(), entityStuff <= .28) {
            crouchHeight = !0
        }
        if (entityStuff >= .8 && (crouchHeight = !1, UserCMD.Send()), crouchHeight) {
            UserCMD.SetButtons(4 | cmd)
        } else UserCMD.SetButtons(cmd | 1 << 22)
    } else {
        UserCMD.SetButtons(cmd | 1 << 22)
    }
}


function onDynamicHitchance() {
    if (config.dynamichitchance.value) {
        var hitchance = Ragebot.GetTargetHitchance() - 1
        localplayer = Entity.GetLocalPlayer();
        localplayer_weapon = Entity.GetWeapon(localplayer);
        currentweapon = Entity.GetName(localplayer_weapon);
        if (currentweapon === "g3sg1") {
            currentweapon = "G3SG1";
        } else if (currentweapon === "awp") {
            currentweapon = "AWP";
        } else if (currentweapon === "scar 20") {
            currentweapon = "SCAR20";
        } else {
            currentweapon = "none";
        }
        if (currentweapon = "none") { return }
        if (hitchance <= UI.GetValue(["Rage", "Accuracy", currentweapon, "Hitchance"])) {
            if (hitchance >= 45) {
                Ragebot.ForceTargetHitchance(Ragebot.GetTarget(), hitchance)
            } else {
                Ragebot.ForceTargetHitchance(Ragebot.GetTarget(), 45)
            }
        }
    }
}


inverted = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"])
function onAntiAim() {
    var Aurora_AA_RealOffset = getMathRandom(40, 48);
    var Aurora_AA_Advanced_JITTER = getMathRandom(2, 10);
    var Aurora_AA_FakeOffset = getMathRandom(25, 32);
    var inAirCheck = Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_fFlags")

    if (config.aa_modes.value == 1) {
        AntiAim.SetOverride(1);
        AntiAim.SetRealOffset(2);
        AntiAim.SetFakeOffset(32);
    } else if (config.aa_modes.value == 2) {
        UI.SetHotkeyState(["Rage", "Anti Aim", "General", "Key assignment", "Jitter"], "Always")
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], Aurora_AA_Advanced_JITTER);
        UI.SetValue(["Rage", "Anti Aim", "Fake", "Lower body yaw mode"], 1);
        AntiAim.SetOverride(1);
        AntiAim.SetRealOffset(Aurora_AA_RealOffset);
        AntiAim.SetFakeOffset(Aurora_AA_FakeOffset);
    } else if (config.aa_modes.value == 3) {
        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"]) || UI.GetValue(["Legit", "General", "General", "Key assignment", "AA Direction inverter"])) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(Globals.Tickcount() % 4, 5 * 1 ? 3 : 3);
            AntiAim.SetRealOffset(getMathRandom(35, 25))
            AntiAim.SetLBYOffset(-10)
        } else {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(Globals.Tickcount() % 4, 5 * 1 ? 5 : 5);
            AntiAim.SetRealOffset(getMathRandom(-35, -25))
            AntiAim.SetLBYOffset(9)
        }
    } else if (config.aa_modes.value == 5) {
        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && !inverted) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(0)
            AntiAim.SetRealOffset(-27)
        } else if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && inverted) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(0)
            AntiAim.SetRealOffset(27)
        } else if (!(inAirCheck & 1) && !inverted) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(0)
            AntiAim.SetRealOffset(-15)
        } else if (!(inAirCheck & 1) && inverted) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(0)
            AntiAim.SetRealOffset(15)
        } else {
            AntiAim.SetOverride(0)
        }
    } else if (config.aa_modes.value == 6) {
        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && !inverted) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(0)
            AntiAim.SetRealOffset(-44)
        } else if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && inverted) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(0)
            AntiAim.SetRealOffset(44)
        } else if (!(inAirCheck & 1) && !inverted) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(0)
            AntiAim.SetRealOffset(-25)
        } else if (!(inAirCheck & 1) && inverted) {
            AntiAim.SetOverride(1)
            AntiAim.SetFakeOffset(0)
            AntiAim.SetRealOffset(25)
        } else {
            AntiAim.SetOverride(0)
        }
    }
}


function radian(degree) {
    return degree * Math.PI / 180.0;
}

function ExtendVector(vector, angle, extension) {
    var radianAngle = radian(angle);
    return [extension * Math.cos(radianAngle) + vector[0], extension * Math.sin(radianAngle) + vector[1], vector[2]];
}

function VectorAdd(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function VectorSubtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function VectorMultiply(a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

function VectorLength(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
}

function VectorNormalize(vec) {
    var length = VectorLength(vec[0], vec[1], vec[2]);
    return [vec[0] / length, vec[1] / length, vec[2] / length];
}

function VectorDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function VectorDistance(a, b) {
    return VectorLength(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function ClosestPointOnRay(target, rayStart, rayEnd) {
    var to = VectorSubtract(target, rayStart);
    var dir = VectorSubtract(rayEnd, rayStart);
    var length = VectorLength(dir[0], dir[1], dir[2]);
    dir = VectorNormalize(dir);

    var rangeAlong = VectorDot(dir, to);
    if (rangeAlong < 0.0) {
        return rayStart;
    }
    if (rangeAlong > length) {
        return rayEnd;
    }
    return VectorAdd(rayStart, VectorMultiply(dir, [rangeAlong, rangeAlong, rangeAlong]));
}

function Flip() {
    UI.ToggleHotkey(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"], "AA Inverter");
}

var lastHitTime = 0.0;
var lastImpactTimes =
    [
        0.0
    ];
var lastImpacts =
    [
        [0.0, 0.0, 0.0]
    ];

function OnHurt() {
    if (config.aa_modes.value == 4) {
        if (Entity.GetEntityFromUserID(Event.GetInt("userid")) !== Entity.GetLocalPlayer()) return;
        var hitbox = Event.GetInt('hitgroup');

        if (hitbox == 1 || hitbox == 6 || hitbox == 7) {
            var curtime = Global.Curtime();
            if (Math.abs(lastHitTime - curtime) > 0.5) {
                lastHitTime = curtime;
                Flip();
            }
        }
    }
}

function OnBulletImpact() {
    if (config.aa_modes.value == 4) {

        var curtime = Global.Curtime();
        if (Math.abs(lastHitTime - curtime) < 0.5) return;

        var entity = Entity.GetEntityFromUserID(Event.GetInt("userid"));
        var impact = [Event.GetFloat("x"), Event.GetFloat("y"), Event.GetFloat("z"), curtime];
        var source;
        if (Entity.IsValid(entity) && Entity.IsEnemy(entity)) {
            if (!Entity.IsDormant(entity)) {
                source = Entity.GetEyePosition(entity);
            }
            else if (Math.abs(lastImpactTimes[entity] - curtime) < 0.1) {
                source = lastImpacts[entity];
            }
            else {
                lastImpacts[entity] = impact;
                lastImpactTimes[entity] = curtime;
                return;
            }
            var local = Entity.GetLocalPlayer();
            var localEye = Entity.GetEyePosition(local);
            var localOrigin = Entity.GetProp(local, "CBaseEntity", "m_vecOrigin");
            var localBody = VectorMultiply(VectorAdd(localEye, localOrigin), [0.5, 0.5, 0.5]);

            var bodyVec = ClosestPointOnRay(localBody, source, impact);
            var bodyDist = VectorDistance(localBody, bodyVec);

            if (bodyDist < 85.0) {
                var realAngle = Local.GetRealYaw();
                var fakeAngle = Local.GetFakeYaw();

                var headVec = ClosestPointOnRay(localEye, source, impact);
                var headDist = VectorDistance(localEye, headVec);
                var feetVec = ClosestPointOnRay(localOrigin, source, impact);
                var feetDist = VectorDistance(localOrigin, feetVec);

                var closestRayPoint;
                var realPos;
                var fakePos;

                if (bodyDist < headDist && bodyDist < feetDist) {
                    closestRayPoint = bodyVec;
                    realPos = ExtendVector(bodyVec, realAngle + 180.0, 10.0);
                    fakePos = ExtendVector(bodyVec, fakeAngle + 180.0, 10.0);
                }
                else if (feetDist < headDist) {
                    closestRayPoint = feetVec;
                    var realPos1 = ExtendVector(bodyVec, realAngle - 30.0 + 60.0, 10.0);
                    var realPos2 = ExtendVector(bodyVec, realAngle - 30.0 - 60.0, 10.0);
                    var fakePos1 = ExtendVector(bodyVec, fakeAngle - 30.0 + 60.0, 10.0);
                    var fakePos2 = ExtendVector(bodyVec, fakeAngle - 30.0 - 60.0, 10.0);
                    if (VectorDistance(feetVec, realPos1) < VectorDistance(feetVec, realPos2)) {
                        realPos = realPos1;
                    }
                    else {
                        realPos = realPos2;
                    }
                    if (VectorDistance(feetVec, fakePos1) < VectorDistance(feetVec, fakePos2)) {
                        fakePos = fakePos1;
                    }
                    else {
                        fakePos = fakePos2;
                    }
                }
                else {
                    closestRayPoint = headVec;
                    realPos = ExtendVector(bodyVec, realAngle, 10.0);
                    fakePos = ExtendVector(bodyVec, fakeAngle, 10.0);
                }

                if (VectorDistance(closestRayPoint, fakePos) < VectorDistance(closestRayPoint, realPos))        //they shot at our fake. they will probably not gonna shoot it again.
                {
                    lastHitTime = curtime;
                    Flip();
                }
            }

            lastImpacts[entity] = impact;
            lastImpactTimes[entity] = curtime;
        }
    }
}

const legitaa_time = Global.Realtime();
var E = true;
var Defuse = false;
var x = 1;
var key = 0;
var distance = 0;
var distance1 = 0;
var original_aa = true;
function onEPeek2() {
    if (config.e_peek.active) {
        UI.SetHotkeyState(["Config", "Scripts", "JS Keybinds", "E-Peek"], mode1)
        var epeekhexString = config.e_peek.value.toString(16);
        UI.SetValue(["Config", "Scripts", "JS Keybinds", "E-Peek"], Number("0x" + epeekhexString))
        if (!UI.GetValue(["Config", "Scripts", "JS Keybinds", "E-Peek"])) {
            UI.ToggleHotkey(["Config", "Scripts", "JS Keybinds", "E-Peek"])
        }




        if (original_aa) {
            original_aa = false;
        }
        if (!inverted) {
            UI.SetValue(["Config", "Cheat", "General", "Restrictions"], 0);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], getMathRandom(-172, -180));
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], 0);
            UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], 0);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], 0);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Auto direction"], 0);
        } else {
            UI.SetValue(["Config", "Cheat", "General", "Restrictions"], 0);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], getMathRandom(172, 180));
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], 0);
            UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], 0);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], 0);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Auto direction"], 0);
        }
        if (Input.IsKeyPressed(0x45) == true) {
            E = false;
            if (Globals.Realtime() > legitaa_time + 0.2) {
                if (E == false) {
                    Cheat.ExecuteCommand("+use");
                    E = true;
                }
                if (E == true) {
                    Cheat.ExecuteCommand("-use");
                }
            }
        } else {
            if (E == true) {
                Cheat.ExecuteCommand("-use");
                E = false;
            }
        }
    } else {

        if (!original_aa) {
            UI.SetValue(["Config", "Cheat", "General", "Restrictions"], restrictions_cache);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], yaw_offset_cache);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], jitter_offset_cache);
            UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], pitch_cache);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], at_tar);
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Auto direction"], autodir);
            original_aa = true;
        }
        legitaa_time = Global.Realtime();
    }
}
function onEPeek() {
    var C4 = Entity.GetEntitiesByClassID(129)[0];
    var Host = Entity.GetEntitiesByClassID(97)[0];
    if (C4) {
        var C4Loc = Entity.GetRenderOrigin(C4);
        var local = Entity.GetLocalPlayer();
        var lLoc = Entity.GetRenderOrigin(local)
        distance = calcDist(C4Loc, lLoc);
        if (distance >= 100) {
            onEPeek2()
        }
    } else if (Host != undefined) {
        var HLoc = Entity.GetRenderOrigin(Host);
        var local = Entity.GetLocalPlayer();
        var lLoc = Entity.GetRenderOrigin(local)
        distance1 = calcDist(HLoc, lLoc);
        if (distance1 >= 100) {
            onEPeek2()
        }
    } else {
        onEPeek2()
    }
}
function calcDist(local, target) {
    var lx = local[0];
    var ly = local[1];
    var lz = local[2];
    var tx = target[0];
    var ty = target[1];
    var tz = target[2];
    var dx = lx - tx;
    var dy = ly - ty;
    var dz = lz - tz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function onFreestanding() {
    if (config.freestanding.active) {
        UI.SetHotkeyState(["Config", "Scripts", "JS Keybinds", "Freestanding"], mode3)
        var freestandhexString = config.freestanding.value.toString(16);
        UI.SetValue(["Config", "Scripts", "JS Keybinds", "Freestanding"], Number("0x" + freestandhexString))
        if (UI.GetValue(["Config", "Scripts", "JS Keybinds", "Freestanding"])) {
            UI.ToggleHotkey(["Config", "Scripts", "JS Keybinds", "Freestanding"])
        }

        UI.SetValue(["Rage", "Anti Aim", "Directions", "Auto direction"], 1);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], 0);
    } else {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Auto direction"], 0);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], 1);
    }
}

function onSlowwalkAA() {
    ab_restrictions = UI.GetValue(["Config", "Cheat", "General", "Restrictions"]);
    ab_yaw_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]);
    ab_jitter_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"]);
    ab_pitch_mode = UI.GetValue(["Rage", "Anti Aim", "General", "Pitch mode"]);
    ab_at_targets = UI.GetValue(["Rage", "Anti Aim", "Directions", "At targets"]);
    var inverted = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"])
    if (config.low_delta_slowwalk.value) {
        if (config.deltamode.value == 0) {
            if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && !inverted) {
                AntiAim.SetOverride(1)
                AntiAim.SetFakeOffset(0)
                AntiAim.SetRealOffset(-25)
            } else if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && inverted) {
                AntiAim.SetOverride(1)
                AntiAim.SetFakeOffset(0)
                AntiAim.SetRealOffset(25)
            } else {
                AntiAim.SetOverride(0)
            }
        }

        if (config.deltamode.value == 1) {
            if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && !inverted) {
                AntiAim.SetOverride(1)
                AntiAim.SetFakeOffset(0)
                AntiAim.SetRealOffset(-50)
            } else if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && inverted) {
                AntiAim.SetOverride(1)
                AntiAim.SetFakeOffset(0)
                AntiAim.SetRealOffset(50)
            } else {
                AntiAim.SetOverride(0)
            }
        }
    } else {
        AntiAim.SetOverride(0);
        UI.SetValue(["Config", "Cheat", "General", "Restrictions"], ab_restrictions);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], ab_yaw_offset);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], ab_jitter_offset);
        UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], ab_pitch_mode);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], ab_at_targets);
    }
}

function OnSlowwalkSpeed() {
    if (config.slowwalkspeed.value && config.low_delta_slowwalk.value && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"])) {
        var movedirection = [0, 0, 0];
        if (Input.IsKeyPressed(0x57)) {
            movedirection[0] += config.slowwalkspeed.value;
        }
        if (Input.IsKeyPressed(0x44)) {
            movedirection[1] += config.slowwalkspeed.value;
        }
        if (Input.IsKeyPressed(0x41)) {
            movedirection[1] -= config.slowwalkspeed.value;
        }
        if (Input.IsKeyPressed(0x53)) {
            movedirection[0] -= config.slowwalkspeed.value;
        }
        UserCMD.SetMovement(movedirection);
    }
}

function onShakingLegs() {
    if (config.leg_breaker.value) {
        if (Globals.Tickcount() % getMathRandom(4, 7) == 0) {
            if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 2) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 0);
            } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 0) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
            } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 1) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
            }
        }
    }
}


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


function onDoubleTap() {
    if (config.doubletap.value == 0) {
        Exploit.EnableRecharge(), Exploit.OverrideShift(12), Exploit.OverrideTolerance(3)
    }
    if (config.doubletap.value == 1) {
        var GetCharge = Exploit.GetCharge();
        Exploit[(1 != GetCharge ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 14), Exploit.OverrideShift(12),
            Exploit.OverrideTolerance(0), DT_Shots(14) && 1 != GetCharge && (Exploit.DisableRecharge(), Exploit.Recharge())
    } else if (config.doubletap.value == 2) {
        var GetCharge = Exploit.GetCharge();
        Exploit[(1 != GetCharge ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 16), Exploit.OverrideShift(14),
            Exploit.OverrideTolerance(0), DT_Shots(16) && 1 != GetCharge && (Exploit.DisableRecharge(), Exploit.Recharge())
    } else if (config.doubletap.value == 3) {
        var GetCharge = Exploit.GetCharge();
        Exploit[(1 != GetCharge ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 18), Exploit.OverrideShift(16),
            Exploit.OverrideTolerance(0), DT_Shots(18) && 1 != GetCharge && (Exploit.DisableRecharge(), Exploit.Recharge())
    } else {
        Exploit.EnableRecharge(), Exploit.OverrideShift(12), Exploit.OverrideTolerance(3)
    }
}

function onDTUnload() {
    Exploit.EnableRecharge();
}

var rechargeTime = 0, updateTime = !![], shouldDisableRecharge = !![];
function onFastRecharge() {
    if (config.fast_recharge.value) {
        const Currentdate = new Date().getTime() / 1000;
        Exploit.DisableRecharge(), shouldDisableRecharge = !![];
        if (Exploit.GetCharge() >= 1) updateTime = !![];
        Exploit.GetCharge() < 1 && (updateTime && (rechargeTime = Currentdate, updateTime = ![]), Currentdate - rechargeTime > 0.5 && updateTime == ![] && (Exploit.Recharge(), rechargeTime = Currentdate));
    } else shouldDisableRecharge && (Exploit.EnableRecharge(), shouldDisableRecharge = ![]);
}

function onSwapRecharge() {
    if (config.weapon_swap_recharge.value) {
        var itemArray = ["CDecoyGrenade", "CHEGrenade", "CIncendiaryGrenade", "CSmokeGrenade", "CMolotovGrenade", "CC4", "CKnife"];
        for (var i = 0; i < itemArray.length; i++) {
            if (Entity.GetClassName(Entity.GetWeapon(Entity.GetLocalPlayer())) == itemArray[i]) {
                UI.SetValue(["Rage", "Exploits", "General", "Double tap"], 0);
            } else {
                UI.SetValue(["Rage", "Exploits", "General", "Double tap"], 1);
            }
        }
    }
}

function onHP2() {
    if (config.mindmgdt.value) {
        var enemies = Entity.GetEnemies();
        for (var i in Entity.GetEnemies()) {
            if (Entity.GetProp(Entity.GetEnemies()[i], "CBasePlayer", "m_iHealth") && Exploit.GetCharge() == 1 && UI.GetValue(["Rage", "Exploits", "Key assignment", "Double tap"]) && !UI.GetValue(["Rage", "Exploits", "Key assignment", "Hide shots"]) && !UI.GetValue(["Rage", "Anti Aim", "Key assignment", "Fake duck"])) {
                Ragebot.ForceTargetMinimumDamage(Entity.GetEnemies()[i], Entity.GetProp(enemies[i], "CBasePlayer", "m_iHealth") / 2 + 1);
            }
        }
    }
}

var tick = 0;

function onLogSpeed() {
    if (config.log_dt_speed.value) {
        var e = Event.GetInt("exploit");
        if (UI.GetValue(["Rage", "Exploits", "Keys", "Double tap"])) {
            if (e > 0) {
                tick = Globals.Tickcount();

            } else if (tick != 0 && (Globals.Tickcount() - tick) < 16) {
                Cheat.PrintChat("\x01[\x0B aurora \x01] Doubletap speed: \x0B" + (Globals.Tickcount() - tick).toString() + " tick(s)\n");
                tick = 0;
            }
        }
    }
}


function onFakeLag() {
    if (config.advanced_fakelag.value == 1) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
        UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], (getMathRandom(9, 12)));
        UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], (getMathRandom(2, 8)));
        UI.SetValue(["Rage", "Fake Lag", "General", "Trigger limit"], (getMathRandom(12, 14)));
    } else if (config.advanced_fakelag.value == 2) {
        if (UI.GetValue(["Rage", "Exploits", "Key assignment", "Double tap"])) {
            UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], 1)
            UI.SetValue(["Rage", "Fake Lag", "General", "Trigger limit"], 0)
        } else {
            UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
            UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], Globals.Tickcount() % 2 ? 1.4 : 13);
            UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], (Globals.Tickcount() % 20 ? 14 : 13) + 12);
            UI.SetValue(["Rage", "Fake Lag", "General", "Trigger limit"], Globals.Tickcount() % 2 ? 1.2 : 14);
        }
    } else if (config.advanced_fakelag.value == 3) {
        if (getVelocity(Entity.GetLocalPlayer()) < 40) {
            UserCMD.Send();
        } else if (getVelocity(Entity.GetLocalPlayer()) < 100) {
            if (Math.random() < 0.6) {
                UserCMD.Choke();
            } else {
                UserCMD.Send();
            }
        } else if (getVelocity(Entity.GetLocalPlayer()) < 200) {
            if (Math.random() < 0.8) {
                UserCMD.Choke();
            } else {
                UserCMD.Send();
            }
        } else {
            UserCMD.Choke();
        }
    } else if (config.advanced_fakelag.value == 4) {
        UserCMD.Choke();
    } else if (config.advanced_fakelag.value == 5) {
        if (Math.random() < 0.7) {
            if (Globals.ChokedCommands() > 128) {
                UserCMD.Send();
            } else {
                UserCMD.Choke();
            }
        } else {
            if (Globals.ChokedCommands() > 18) {
                UserCMD.Send();
            } else {
                UserCMD.Choke();
            }
        }
    }

    if (config.advanced_fakelag.value >= 1 && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"])) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 0);
    }
};



function onAspectRatio() {
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



var alpha = 0;
var size = 0;

function clamp(v, min, max) {
    return Math.max(Math.min(v, max), min);
}


function onKillEffect() {
    if (config.healthshot_effect.value) {
        if (alpha === 0)
            return;

        const inc_alpha = ((1 / config.healthshot_effect_strength.value) * Global.Frametime()) * 255
        const inc_size = ((1 / config.healthshot_effect_strength.value) * Global.Frametime()) * 360

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

function onPlayerDeath() {
    const attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    const userid = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    const player = Entity.GetLocalPlayer();

    if (attacker === player && userid != player) {
        alpha = 255;
        size = 360;
    }


    // THIS IS FOR PINGSPIKE // Ping Spike
    UI.SetValue(["Misc.", "Helpers", "General", "Extended backtracking"], 0);
}


var screen_width = Math.round(Global.GetScreenSize()[0]);
var screen_length = Math.round(Global.GetScreenSize()[1]);
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function onRainbowBar() {
    if (config.rainbow_bar.value) {
        var colors = HSVtoRGB(Global.Realtime() * config.rainbow_bar_speed.value / 10 + 1, 1, 1);
        //up
        Render.GradientRect(0, 0, screen_width / 2, 3, 1, [colors.g, colors.b, colors.r, 255], [colors.r, colors.g, colors.b, 255]);
        Render.GradientRect(screen_width / 2, 0, screen_width / 2, 3, 1, [colors.r, colors.g, colors.b, 255], [colors.b, colors.r, colors.g, 255]);
        if (config.rainbow_fullscreen.value) {
            //left
            Render.GradientRect(0, 0, 3, screen_length, 0, [colors.g, colors.b, colors.r, 255], [colors.r, colors.g, colors.b, 255]);
            //right
            Render.GradientRect(screen_width - 3, 0, 3, screen_length, 0, [colors.b, colors.r, colors.g, 255], [colors.g, colors.b, colors.r, 255]);
            //down
            Render.GradientRect(screen_width / 2, screen_length - 3, screen_width / 2, 3, 1, [colors.b, colors.r, colors.g, 255], [colors.g, colors.b, colors.r, 255]);
            Render.GradientRect(0, screen_length - 3, screen_width / 2, 3, 1, [colors.r, colors.g, colors.b, 255], [colors.b, colors.r, colors.g, 255]);
        }
    }
}

var client_set_clan_tag = Local.SetClanTag;
var oldTick = Globals.Tickcount();
var AuroraNLV2 = ["/", "/\\", "A", "A|", "A|_", "A|_|", "Au", "Au|", "Au|‾", "Aur", "Aur0", "Auro", "Auro|", "Auro|‾", "Auror", "Auror/", "Auror/\\", "Aurora", "Aurora ", "Aurora \\", "Aurora \\/", "Aurora V", "Aurora V2", "Aurora V2", "Aurora V2", "Aurora V2", "Aurora V2", "Aurora V2", "Aurora V", "Aurora ", "Aurora", "Auror", "Auro", "Aur", "Au", "A", "", "", ""];
var AuroraStatic = "Aurora"
const globaltime = Globals.Realtime();
const delay = 0.2;
function AuroraClantag() {
    if (config.clantag.value == 2) {
        if (Globals.Realtime() > globaltime + delay) {
            globaltime = Globals.Realtime();
            cur = Math.floor(Globals.Curtime() * 4 % 37 + 1);
            Local.SetClanTag(AuroraNLV2[cur]);
            oldTick = Globals.Tickcount();
            Globals.ChokedCommands() == 0;
        }
    } else if (config.clantag.value == 1) {
        if (Globals.Realtime() > globaltime + delay) {
            globaltime = Globals.Realtime();
            Local.SetClanTag(AuroraStatic)
        }
    }
}



function onHidechat() {
    if (config.hide_chat.value) {
        Convar.SetInt("cl_chatfilters", 0)
    } else {
        Convar.SetInt("cl_chatfilters", 63)
    }
}


function onFog() {
    if (!config.fog.value) { return }
    const clr = menu.get_color(config.fog_color);
    const clr_value = clr[0] + " " + clr[1] + " " + clr[2];
    const dens = (config.fog_density.value / 100).toString();
    if (!config.fog.value) {
        if (Convar.GetString("fog_override") !== "0") {
            Convar.SetString("fog_override", "0");
        }
    }


    if (config.fog_type.value == 0) {
        if (Convar.GetString("fog_override") == "0") {
            Convar.SetString("fog_override", "1");
            Convar.SetString("fog_enable_water_fog", "1");
        }

        // Check if the fog's color isn't the same as our desired color
        if (Convar.GetString("fog_color") !== clr_value || Convar.GetString("fog_colorskybox") !== clr_value) {
            // Update color
            Convar.SetString("fog_color", clr_value);
            Convar.SetString("fog_colorskybox", clr_value);
        }

        // Check if the fog's end distance isn't the same as our desired end distance
        if (Convar.GetString("fog_end") !== "10") {
            // Update distance
            Convar.SetString("fog_start", "10");
            Convar.SetString("fog_end", "10");
        }

        // Check if the fog's density isn't the same as our desired density
        if (Convar.GetString("fog_maxdensity") !== dens) {
            // Update density
            Convar.SetString("fog_maxdensity", dens);
        }
    } else if (config.fog_type.value == 1) {
        if (Convar.GetString("fog_override") == "0") {
            Convar.SetString("fog_override", "1");
            Convar.SetString("fog_enable_water_fog", "1");
        }

        // Check if the fog's color isn't the same as our desired color
        if (Convar.GetString("fog_color") !== clr_value || Convar.GetString("fog_colorskybox") !== clr_value) {
            // Update color
            Convar.SetString("fog_color", clr_value);
            Convar.SetString("fog_colorskybox", clr_value);
        }

        // Check if the fog's end distance isn't the same as our desired end distance
        if (Convar.GetString("fog_end") !== "1300") {
            // Update distance
            Convar.SetString("fog_start", "200");
            Convar.SetString("fog_end", "1300");
        }

        // Check if the fog's density isn't the same as our desired density
        if (Convar.GetString("fog_maxdensity") !== dens) {
            // Update density
            Convar.SetString("fog_maxdensity", dens);
        }
    } else if (config.fog_type.value == 2) {
        if (Convar.GetString("fog_override") == "0") {
            Convar.SetString("fog_override", "1");
            Convar.SetString("fog_enable_water_fog", "1");
        }

        // Check if the fog's color isn't the same as our desired color
        if (Convar.GetString("fog_color") !== clr_value || Convar.GetString("fog_colorskybox") !== clr_value) {
            // Update color
            Convar.SetString("fog_color", clr_value);
            Convar.SetString("fog_colorskybox", clr_value);
        }

        // Check if the fog's end distance isn't the same as our desired end distance
        if (Convar.GetString("fog_end") !== "400") {
            // Update distance
            Convar.SetString("fog_start", "0");
            Convar.SetString("fog_end", "400");
        }

        // Check if the fog's density isn't the same as our desired density
        if (Convar.GetString("fog_maxdensity") !== dens) {
            // Update density
            Convar.SetString("fog_maxdensity", dens);
        }
    }
}

function RandFloat(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function RandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var Data = {
    Time: null,
    StoredTime: null,
    Resolution: {
        w: null,
        h: null
    },

    Update: function () {
        Data.Time += Globals.Frametime();
        const _Resolution = Render.GetScreenSize();
        if (this.Resolution.w != _Resolution[0] || this.Resolution.h != _Resolution[1]) {
            Data.Resolution = {
                w: _Resolution[0],
                h: _Resolution[1]
            }
        }
    }
};
var Snowflakes = [];
Render.Snowflake = function (x, y, size) {
    var Base = 4 + size;
    Render.Line(x - Base, y - Base, x + Base + 1, y + Base + 1, [255, 255, 255, 180]);
    Render.Line(x + Base, y - Base, x - Base, y + Base, [255, 255, 255, 180]);
    Base = 5 + size;
    Render.Line(x - Base, y, x + Base + 1, y, [255, 255, 255, 180]);
    Render.Line(x, y - Base, x, y + Base + 1, [255, 255, 255, 180]);
}
function onSnowflakes() {
    if (!Entity.IsValid(Entity.GetLocalPlayer())) { return }
    if (config.snowflakes.value) {

        Data.Update();
        const Delay = 0.2;
        if (Snowflakes.length < 128) {
            if (Data.Time > Data.StoredTime) {
                Data.StoredTime = Data.Time + Delay;
                Snowflakes.push([
                    RandFloat(10, Data.Resolution.w - 10),
                    1,
                    RandFloat(1, 3),
                    RandFloat(-0.6, 0.6),
                    RandInt(-3, 0)
                ]);
            }
        }

        for (var i = 0; i < Snowflakes.length; i++) {
            var x = Snowflakes[i][0];
            var y = Snowflakes[i][1];
            var VSpeed = Snowflakes[i][2];
            var HSpeed = Snowflakes[i][3];
            var Size = Snowflakes[i][4];
            if (Data.Resolution.h <= y) {
                Snowflakes[i][0] = RandFloat(10, Data.Resolution.w - 10)
                Snowflakes[i][1] = 1;
                Snowflakes[i][2] = RandFloat(1, 3);
                Snowflakes[i][3] = RandFloat(-0.6, 0.6);
                Snowflakes[i][4] = RandInt(-3, 0)
            }
            Render.Snowflake(x, y, Size);
            const FPS = 1 / Globals.Frametime();
            Snowflakes[i][1] += VSpeed / FPS * 100;
            Snowflakes[i][0] += HSpeed / FPS * 100;
        }
    }
}


function aaText() {
    var returnVar = "";

    if (config.aa_modes.value == 0) {
        returnVar = "None";
    } else if (config.aa_modes.value == 1) {
        returnVar = "Simple";
    } else if (config.aa_modes.value == 2) {
        returnVar = "Advanced AA";
    } else if (config.aa_modes.value == 3) {
        returnVar = "Aurora AA";
    } else if (config.aa_modes.value == 4) {
        returnVar = "Anti-Brute";
    } else if (config.aa_modes.value == 5) {
        returnVar = "Dangerous";
    } else if (config.aa_modes.value == 6) {
        returnVar = "Safe";
    }

    return returnVar;
}

function dtText() {
    var returnVar = "";

    if (config.doubletap.value == 0) {
        returnVar = "None";
    } else if (config.doubletap.value == 1) {
        returnVar = "Fast";
    } else if (config.doubletap.value == 2) {
        returnVar = "Quick";
    } else if (config.doubletap.value == 3) {
        returnVar = "Supersonic";
    }

    return returnVar;
}

function flText() {
    var returnVar = "";

    if (config.advanced_fakelag.value == 0) {
        returnVar = "None";
    } else if (config.advanced_fakelag.value == 1) {
        returnVar = "Aurora Fakelag";
    } else if (config.advanced_fakelag.value == 2) {
        returnVar = "  Ideal Tick";
    } else if (config.advanced_fakelag.value == 3) {
        returnVar = "  Fluctuate";
    } else if (config.advanced_fakelag.value == 4) {
        returnVar = "  Maximum";
    } else if (config.advanced_fakelag.value == 5) {
        returnVar = "  Switch";
    }

    return returnVar;
}

function stText() {
    var returnVar = "";

    if (World.GetServerString() == "local server") {
        returnVar = "local";
    } else if (World.GetServerString() == "valve [aimstep]") {
        returnVar = "valve";
    } else if (World.GetServerString() != "valve [aimstep]" && World.GetServerString() != "local server") {
        returnVar = "metamod";
    } else {
        returnVar = "release";
    }

    return returnVar;
}

var screen_size = Global.GetScreenSize()
var lp = Entity.GetLocalPlayer()
var velocity = Math.round(getVelocity(lp)).toString()
var drawLeft = 0
var drawRight = 0
var cur_dmg = 0
var cur_hit = 0
var fake = Local.GetFakeYaw();
var real = Local.GetRealYaw();
var delta_size = Render.TextSize(delta, font);
var real_yaw = Local.GetRealYaw();
var fake_yaw = Local.GetFakeYaw();
var delta = Math.min(Math.abs(real_yaw - fake_yaw) / 2, 60).toFixed(0);
var x = (Render.GetScreenSize()[0] / 2);
var y = (Render.GetScreenSize()[1] / 2);
var font = Render.GetFont("verdana.ttf", 10, true);
var font2 = Render.GetFont("verdana.ttf", 24, true);
var color = menu.get_color(config.menu_color);

var Inair = function () {
    if (!(Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_fFlags") & (1 << 0))) {
        return true;
    } else {
        return false;
    }
}
function getSite(c4) {
    bombsite = Entity.GetProp(c4, "CPlantedC4", "m_nBombSite");
    if (bombsite == 0) {
        return "A - ";
    } else {
        return "B - ";
    }
}

function bomb_exploded() {
    isbomb = 0
    on_plant_time = 0
    fill = 0
    planting = false
}
function autobuy() {
    if (UI.GetValue(["Rage", "XO-YAW", "XO-YAW", "AWP Fast Buy"])) {
        Cheat.ExecuteCommand("buy awp;buy awp;buy awp;buy awp;buy awp;buy awp;buy awp;")
    }
}
function bomb_beginplant() {
    on_plant_time = Globals.Curtime()
    bombsite = Event.GetInt("site")
    world = World.GetMapName()
    if (world == "de_mirage") {
        if (bombsite == 447) {
            bombsiteonplant = "Bombsite B"
        } else {
            bombsiteonplant = "Bombsite A"
        }
    }
    if (world == 'de_dust2') {
        if (bombsite == 366) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'de_dust2_old') {
        if (bombsite == 366) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'de_dust2_old_1') {
        if (bombsite == 366) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'de_dust2_old_ht') {
        if (bombsite == 366) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'de_vertigo') {
        if (bombsite == 79) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'de_overpass') {
        if (bombsite == 85) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'de_inferno') {
        if (bombsite == 370) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'gd_rialto') {
        bombsiteonplant = "Bombsite A"
    };
    if (world == 'de_cbble') {
        if (bombsite == 216) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'de_tulip') {
        if (bombsite == 620) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    if (world == 'de_tulip_ht') {
        if (bombsite == 620) {
            bombsiteonplant = "Bombsite A"
        } else {
            bombsiteonplant = "Bombsite B"
        }
    };
    planting = true
}

function bomb_abortplant() {
    on_plant_time = 0
    fill = 0
    planting = false
}

function bomb_defused() {
    on_plant_time = 0
    fill = 0
    planting = false
}

function bomb_planted() {
    on_plant_time = 0
    fill = 0
    planting = false
}

function onIndicators() {
    if (!Entity.IsAlive(Entity.GetLocalPlayer())) { return }
    var screen_size = Global.GetScreenSize()
    var lp = Entity.GetLocalPlayer()
    var velocity = Math.round(getVelocity(lp)).toString()
    var drawLeft = 0
    var drawRight = 0
    var cur_dmg = 0
    var cur_hit = 0
    var fake = Local.GetFakeYaw();
    var real = Local.GetRealYaw();
    var real_yaw = Local.GetRealYaw();
    var fake_yaw = Local.GetFakeYaw();
    var font = Render.GetFont("verdana.ttf", 10, true);
    var font2 = Render.GetFont("verdana.ttf", 24, true);
    var color = menu.get_color(config.indicators_color);
    var delta = Math.min(Math.abs(real_yaw - fake_yaw) / 2, 60).toFixed(0);
    var delta_size = Render.TextSize(String(delta), font);
    var x = (Render.GetScreenSize()[0] / 2);
    var y = (Render.GetScreenSize()[1] / 2);
    var on_plant_time

    if (fake < 0) {
        fake = 360 + fake;
    }
    if (real < 0) {
        real = 360 + real;
    }
    angle = fake - real;
    if (Math.abs(angle) > 240) {
        if (real > fake) {
            angle = 360 + angle;
        } else {
            angle = angle - 360;
        }
    }
    angle = angle / 2;
    if (fake > real) delta = (fake - real) / 2;
    else delta = (real - fake) / 2;
    var fonts = {
        "tahomabd": Render.GetFont("tahomabd.ttf", 10, true),
        "verdanab": Render.GetFont("verdanab.ttf", 19, true),
        "calibrib": Render.GetFont("calibrib.ttf", 11, true),
        "ebrimabd": Render.GetFont("ebrimabd.ttf", 10, true),
        "verdanab8": Render.GetFont("verdanab.ttf", 8, true),
        "verdana8": Render.GetFont("verdana.ttf", 10, true),
        "tahoma10": Render.GetFont("tahoma.ttf", 10, true),
        "calibrib20": Render.GetFont("calibrib.ttf", 20, true),
        "tahoma18": Render.GetFont("tahoma.ttf", 18, true),
        "pixel": Render.GetFont("arialbd.ttf", 10, true)
    }
    lp = Entity.GetLocalPlayer();
    velocity = Math.round(getVelocity(lp)).toString();
    fix_posdmg = Render.TextSize(cur_dmg + "", fonts.tahomabd)[0] / 2
    fix_poshc = Render.TextSize(cur_hit + "", fonts.tahomabd)[0] / 2
    inverted = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"])
    isDmg = config.dmg_override_key.active;
    isDoubletap = UI.GetValue(["Rage", "Exploits", "Keys", "Double tap"]);
    isHideshots = UI.GetValue(["Rage", "Exploits", "Keys", "Hide shots"]);
    isSafe = UI.GetValue(["Rage", "General", "General", "Key assignment", "Force safe point"]);;
    isBody = UI.GetValue(["Rage", "General", "General", "Key assignment", "Force body aim"]);
    isFs = config.freestanding.active;
    isAuto = UI.GetValue(["Rage", "Anti Aim", "Directions", "Auto direction"]);
    isDuck = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"]);
    isPeek = UI.GetValue(["Misc.", "Keys", "Key assignment", "Auto peek"]);
    isAntiAim = UI.GetValue(["Rage", "Anti Aim", "General", "Enabled"])
    isSlow = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]);
    add_y = 0;
    add_x = 0;
    var planting = false
    var fill = 0
    var bombsiteonplant = ""
    var on_plant_time
    var distance = 0

    if (config.indicators.value == 1) {
        Render.ShadowString = function (x, y, a, l, c, f) {
            // Get the minimum alpha.
            Render.String(x - 1 + delta_size[0], y - 1, a, l, [0, 0, 0, 55], f);
            Render.String(x - 1 + delta_size[0], y + 1, a, l, [0, 0, 0, 55], f);
            Render.String(x + 1 + delta_size[0], y - 1, a, l, [0, 0, 0, 55], f);
            Render.String(x + 1 + delta_size[0], y + 1, a, l, [0, 0, 0, 55], f);
            Render.String(x + delta_size[0], y, a, l, c, f);
        }
        Render.ShadowCircle = function (x, y, r, c) {
            // Get the minimum alpha.

            Render.Circle(x + delta_size[0], y + 29, r, c)
            Render.Circle(x - 1, y - 1, r, [0, 0, 0, 55])
            Render.Circle(x - 1, y + 1, r, [0, 0, 0, 55])
            Render.Circle(x + 1, y - 1, r, [0, 0, 0, 55])
            Render.Circle(x + 1, y + 1, r, [0, 0, 0, 55])
        }
        var font = Render.GetFont("verdana.ttf", 10, true);
        var font2 = Render.GetFont("verdana.ttf", 24, true);
        var x = (Render.GetScreenSize()[0] / 2);
        var y = (Render.GetScreenSize()[1] / 2);
        var color = menu.get_color(config.indicators_color);
        var real_yaw = Local.GetRealYaw();
        var fake_yaw = Local.GetFakeYaw();
        var delta = Math.min(Math.abs(real_yaw - fake_yaw) / 2, 60).toFixed(0);
        var delta_size = Render.TextSize(delta, font);
        var inverted = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"]);
        Render.String(x - 35, y - 15, 1, "<", inverted ? color : [100, 100, 100, 100], font2);
        Render.String(x + 35, y - 15, 1, ">", !inverted ? color : [100, 100, 100, 100], font2);
        Render.ShadowString(x - 30, y + 15, 0, "A U R O R A", color, font);
        Render.ShadowString(x, y + 25, 1, delta, color, font);
        Render.ShadowCircle(x + 12, y, 2, color)
        Render.ShadowString(x - 18, y + 35, 0, aaText(), color, font);
        if (UI.GetValue(["Rage", "Exploits", "Key assignment", "Double tap"])) {
            Render.ShadowString(x - 14, y + 45, 0, "   " + dtText(), color, font);
            Render.ShadowString(x - 32, y + 45, 0, "  DT", [184 - 35 * Exploit.GetCharge(), 6 + 178 * Exploit.GetCharge(), 6, 255], font);
        } else if (UI.GetValue(["Rage", "Exploits", "Key assignment", "Hide shots"])) {
            Render.ShadowString(x - 14, y + 45, 0, "   " + dtText(), color, font);
            Render.ShadowString(x - 32, y + 45, 0, "  DT", [184 - 35 * Exploit.GetCharge(), 6 + 178 * 0, 6, 255], font);
        }
        Render.ShadowString(x - 30, y + 55, 0, flText(), color, font);
    }


    if (config.indicators.value == 2) {
        add_y = 30;
        if (isSlow) {
            Render.String(screen_size[0] / 2 - 31, screen_size[1] / 2 + add_y + 1, 0, "SLOWWALK", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 31, screen_size[1] / 2 + add_y, 0, "SLOWWALK", [177, 171, 255, 255], fonts.tahomabd);
        } else if (isAntiAim) {
            Render.String(screen_size[0] / 2 - 26, screen_size[1] / 2 + add_y + 1, 0, "FAKE YAW", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 26, screen_size[1] / 2 + add_y, 0, "FAKE YAW", [177, 171, 255, 255], fonts.tahomabd);
        }
        if (isFs) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 29, screen_size[1] / 2 + add_y + 1, 0, "FREESTAND", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 29, screen_size[1] / 2 + add_y, 0, "FREESTAND", [209, 159, 230, 255], fonts.tahomabd);
        } else {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 25, screen_size[1] / 2 + add_y + 1, 0, "DYNAMIC", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 25, screen_size[1] / 2 + add_y, 0, "DYNAMIC", [209, 139, 230, 255], fonts.tahomabd);
        }
        if (isDoubletap) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 7, screen_size[1] / 2 + add_y + 1, 0, "DT", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 7, screen_size[1] / 2 + add_y, 0, "DT", Exploit.GetCharge() == 1 ? [72, 255, 16, 255] : [255, 0, 0, 255], fonts.tahomabd);
        }
        if (isDuck) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 14, screen_size[1] / 2 + add_y + 1, 0, "DUCK", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 14, screen_size[1] / 2 + add_y, 0, "DUCK", [255, 255, 255, 255], fonts.tahomabd);
        }
        if (isHideshots) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 22, screen_size[1] / 2 + add_y + 1, 0, "ONSHOT", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 22, screen_size[1] / 2 + add_y, 0, "ONSHOT", [132, 255, 16, 255], fonts.tahomabd);
        }
        if (isBody) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 14, screen_size[1] / 2 + add_y + 1, 0, "BAIM", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 14, screen_size[1] / 2 + add_y, 0, "BAIM", [132, 255, 16, 255], fonts.tahomabd);
        }
        if (isSafe) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 13, screen_size[1] / 2 + add_y + 1, 0, "SAFE", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - 13, screen_size[1] / 2 + add_y, 0, "SAFE", [132, 255, 16, 255], fonts.tahomabd);
        }
        if (isDmg) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - fix_posdmg, screen_size[1] / 2 + add_y + 1, 0, cur_dmg + "", [0, 0, 0, 255], fonts.tahomabd);
            Render.String(screen_size[0] / 2 - fix_posdmg, screen_size[1] / 2 + add_y, 0, cur_dmg + "", [200, 185, 255, 255], fonts.tahomabd);
        }
    }
    if (config.indicators.value == 3) {
        add_y = 0
        if (inverted) {
            Render.String(screen_size[0] / 2 + 38, screen_size[1] / 2 - 9, 0, ">", [0, 0, 0, 200], fonts.calibrib20)
            Render.String(screen_size[0] / 2 + 38, screen_size[1] / 2 - 9, 0, ">", [184, 184, 184, 255], fonts.calibrib20)
            Render.String(screen_size[0] / 2 - 48, screen_size[1] / 2 - 9, 0, "<", [0, 0, 0, 200], fonts.calibrib20)
            Render.String(screen_size[0] / 2 - 48, screen_size[1] / 2 - 9, 0, "<", color, fonts.calibrib20)
        } else if (!inverted) {
            Render.String(screen_size[0] / 2 - 48, screen_size[1] / 2 - 9, 0, "<", [0, 0, 0, 200], fonts.calibrib20)
            Render.String(screen_size[0] / 2 - 48, screen_size[1] / 2 - 9, 0, "<", [184, 184, 184, 255], fonts.calibrib20)
            Render.String(screen_size[0] / 2 + 38, screen_size[1] / 2 - 9, 0, ">", [0, 0, 0, 200], fonts.calibrib20)
            Render.String(screen_size[0] / 2 + 38, screen_size[1] / 2 - 9, 0, ">", color, fonts.calibrib20)
        }
        Render.GradientRect(screen_size[0] / 2 + 1, screen_size[1] / 2 + 40, (Math.abs(angle)), 2, 1, color, [147, 135, 255, 5])
        Render.GradientRect(screen_size[0] / 2 - (Math.abs(angle)) + 2, screen_size[1] / 2 + 40, (Math.abs(angle)), 2, 1, [147, 135, 255, 5], color)
        Render.String(screen_size[0] / 2 - 6, screen_size[1] / 2 + 24, 0, Math.round(Math.abs(angle)) + "°", [255, 255, 255, 255], fonts.ebrimabd)
        Render.Circle(screen_size[0] / 2 + 7, screen_size[1] / 2 + 29, 1, [255, 255, 255, 255]);
        Render.String(screen_size[0] / 2 - 18, screen_size[1] / 2 + 44 + add_y, 0, "AURORA", [0, 0, 0, 255], fonts.calibrib)
        Render.String(screen_size[0] / 2 - 18, screen_size[1] / 2 + 43, 0 + add_y, "AURORA", [255, 255, 255, 255], fonts.calibrib)
        if (drawLeft) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 10, screen_size[1] / 2 + 44 + add_y, 0, "LEFT", [0, 0, 0, 255], fonts.calibrib)
            Render.String(screen_size[0] / 2 - 10, screen_size[1] / 2 + 43 + add_y, 0, "LEFT", [255, 255, 255, 255], fonts.calibrib)
        } else if (drawRight) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 14, screen_size[1] / 2 + 44 + add_y, 0, "RIGHT", [0, 0, 0, 255], fonts.calibrib)
            Render.String(screen_size[0] / 2 - 14, screen_size[1] / 2 + 43 + add_y, 0, "RIGHT", [255, 255, 255, 255], fonts.calibrib)
        }
        if (isHideshots) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 19, screen_size[1] / 2 + 44 + add_y, 0, "ONSHOT", [0, 0, 0, 255], fonts.calibrib);
            Render.String(screen_size[0] / 2 - 19, screen_size[1] / 2 + 43 + add_y, 0, "ONSHOT", [255, 255, 255, 255], fonts.calibrib);
        }
        if (isBody) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 13, screen_size[1] / 2 + 44 + add_y, 0, "BAIM", [0, 0, 0, 255], fonts.calibrib);
            Render.String(screen_size[0] / 2 - 13, screen_size[1] / 2 + 43 + add_y, 0, "BAIM", [255, 255, 255, 255], fonts.calibrib);
        }
        if (isDmg) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 12, screen_size[1] / 2 + 44 + add_y, 0, "DMG", [0, 0, 0, 255], fonts.calibrib);
            Render.String(screen_size[0] / 2 - 12, screen_size[1] / 2 + 43 + add_y, 0, "DMG", [255, 255, 255, 255], fonts.calibrib);
        }
        if (isDoubletap) {
            add_y = add_y + 11
            Render.String(screen_size[0] / 2 - 6, screen_size[1] / 2 + 44 + add_y, 0, "DT", [0, 0, 0, 255], fonts.calibrib);
            Render.String(screen_size[0] / 2 - 6, screen_size[1] / 2 + 43 + add_y, 0, "DT", Exploit.GetCharge() == 1 ? [255, 255, 255, 255] : [255, 0, 0, 255], fonts.calibrib);
        }
    }

    if (config.indicators.value == 4) {
        add_y = 0;
        if (isDmg) {
            add_y = add_y - 24
            Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, cur_dmg + "", [0, 0, 0, 255], fonts.verdanab);
            Render.String(5, screen_size[1] / 1.5 + add_y, 0, cur_dmg + "", [200, 185, 255, 255], fonts.verdanab);
        }
        if (isDuck) {
            add_y = add_y - 24
            Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, "DUCK", [0, 0, 0, 255], fonts.verdanab);
            Render.String(5, screen_size[1] / 1.5 + add_y, 0, "DUCK", [255, 255, 255, 255], fonts.verdanab);
        }
        if (isBody) {
            add_y = add_y - 24
            Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, "BAIM", [0, 0, 0, 255], fonts.verdanab);
            Render.String(5, screen_size[1] / 1.5 + add_y, 0, "BAIM", [255, 0, 0, 255], fonts.verdanab);
        }
        if (isFs) {
            add_y = add_y - 24
            Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, "FS", [0, 0, 0, 255], fonts.verdanab);
            Render.String(5, screen_size[1] / 1.5 + add_y, 0, "FS", [132, 210, 16, 255], fonts.verdanab);
        }
        if (isSafe) {
            add_y = add_y - 24
            Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, "SP", [0, 0, 0, 255], fonts.verdanab);
            Render.String(5, screen_size[1] / 1.5 + add_y, 0, "SP", [30, 144, 255, 255], fonts.verdanab);
        }
        if (Inair() & velocity > 250) {
            add_y = add_y - 24
            Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, "LC", velocity > 295 ? [0, 0, 0, 255] : [0, 0, 0, 255], fonts.verdanab)
            Render.String(5, screen_size[1] / 1.5 + add_y, 0, "LC", velocity > 295 ? [132, 210, 16, 255] : [255, 0, 0, 255], fonts.verdanab)
        }
        add_y = add_y - 24
        Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, "FAKE", [0, 0, 0, 255], fonts.verdanab)
        Render.String(5, screen_size[1] / 1.5 + add_y, 0, "FAKE", [255 - (delta * 2.29824561404), delta * 3.42105263158, delta * 0.22807017543, 255], fonts.verdanab)
        if (isDoubletap) {
            add_y = add_y - 24
            Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, "DT", [0, 0, 0, 255], fonts.verdanab);
            Render.String(5, screen_size[1] / 1.5 + add_y, 0, "DT", Exploit.GetCharge() == 1 ? [132, 210, 16, 255] : [255, 0, 0, 255], fonts.verdanab);
        }
        if (isHideshots) {
            add_y = add_y - 24
            Render.String(5, screen_size[1] / 1.5 + add_y + 1, 0, "HIDE", [0, 0, 0, 255], fonts.verdanab);
            Render.String(5, screen_size[1] / 1.5 + add_y, 0, "HIDE", [132, 210, 16, 255], fonts.verdanab);
        }
    }

    if (config.indicators.value == 5) {
        add_y = 0
        Render.Indicator = function (text, col) {
            x = screen_size[0] / 100
            y = screen_size[1] / 1.33
            fonts = Render.GetFont("calibrib.ttf", 21, true)
            text_size = Render.TextSize(text, fonts)
            width = text_size[0] - 2;
            add_y = add_y + 33
            Render.GradientRect(13, y - add_y - 3, width / 2, 26, 1, [0, 0, 0, 0], [0, 0, 0, 55]);
            Render.GradientRect(13 + width / 2, y - add_y - 3, width / 2, 26, 1, [0, 0, 0, 55], [0, 0, 0, 0]);
            Render.String(x, y + 1 - add_y, 0, text, [33, 33, 33, 180], fonts)
            Render.String(x, y - add_y, 0, text, col, fonts)
        }
        fill = 3.125 - (3.125 + on_plant_time - Globals.Curtime())
        if (fill > 3.125) {
            fill = 3.125
        }
        fonts = Render.GetFont("calibrib.ttf", 21, true)
        if (Entity.IsAlive(Entity.GetLocalPlayer())) {
            if (velocity > 255 || Inair()) {
                Render.Indicator("LC", velocity > 275 ? [132, 195, 16, 255] : [255, 0, 0, 255])
            }
            if (isDuck) {
                Render.Indicator("DUCK", [255, 255, 255, 255])
            }
            if (isBody) {
                Render.Indicator("BAIM", [255, 0, 0, 255])
            }
            if (isSafe) {
                Render.Indicator("SAFE", [132, 195, 16, 255])
            }
            if (isDmg) {
                Render.Indicator("DMG : " + config.dmg_override_value.value + "", [164, 164, 164, 255]);
            }
            if (isAuto) {
                Render.Indicator("FREESTAND", [132, 195, 16, 255]);
            }
            if (Convar.GetInt("weapon_accuracy_nospread") != 0) {
                Render.Indicator("NS", [255, 0, 0, 255])
            }
            if (isFs) {
                Render.Indicator("AT", [132, 195, 16, 255])
            }
        }
        var c4 = Entity.GetEntitiesByClassID(129)[0];
        if (c4 != undefined) {
            var eLoc = Entity.GetRenderOrigin(c4);
            var lLoc = Entity.GetRenderOrigin(Entity.GetLocalPlayer())
            var distance = calcDist(eLoc, lLoc);
            var willKill = false;
            var dmg;
            //player checks
            var armor = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayerResource", "m_iArmor"); // player armor
            var health = Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_iHealth"); // player health
            //c4 things
            var isbombticking = Entity.GetProp(c4, "CPlantedC4", "m_bBombTicking");
            var timer = (Entity.GetProp(c4, "CPlantedC4", "m_flC4Blow") - Globals.Curtime()); // c4 left time
            var c4length = Entity.GetProp(c4, "CPlantedC4", "m_flTimerLength");
            var bar_length = (((Render.GetScreenSize()[1] - 50) / c4length) * (timer));
            //defusing things
            var deflength = Entity.GetProp(c4, "CPlantedC4", "m_flDefuseLength"); // length of defuse
            var deftimer = (Entity.GetProp(c4, "CPlantedC4", "m_flDefuseCountDown") - Globals.Curtime()); // timer when defusing
            var defbarlength = (((Render.GetScreenSize()[1] - 50) / deflength) * (deftimer)); // lenght for left bar
            var isbeingdefused = Entity.GetProp(c4, "CPlantedC4", "m_hBombDefuser"); // check if bomb is being defused
            var gotdefused = Entity.GetProp(c4, "CPlantedC4", "m_bBombDefused"); // check if bomb has or hasnt defused
            const a = 450.7;
            const b = 75.68;
            const c = 789.2;
            const d = (distance - b) / c;
            var damage = a * Math.exp(-d * d);
            if (armor > 0) {
                var newDmg = damage * 0.5;
                var armorDmg = (damage - newDmg) * 0.5;
                if (armorDmg > armor) {
                    armor = armor * (1 / .5);
                    newDmg = damage - armorDmg;
                }
                damage = newDmg;
            }
            dmg = Math.ceil(damage);
            if (dmg >= health) {
                willKill = true;
            } else {
                willKill = false;
            }
            timer = parseFloat(timer.toPrecision(3));
            timer2 = parseFloat(timer.toPrecision(2));
            timer3 = parseFloat(timer.toPrecision(1));
            if (!isbombticking) return;
            if (gotdefused) return;
            if (timer >= 0.1) {
                Render.Indicator(getSite(c4) + timer.toFixed(1) + "s", [255, 255, 255, 255])
            }
            if (willKill) {
                Render.Indicator("FATAL", [255, 0, 0, 255])
            } else if (damage > 0.5) {
                Render.Indicator("-" + dmg + "HP", [210, 216, 112, 255])
            }
            // defuse time bar
            if (isbeingdefused > 0) {
                if (timer > deflength && timer >= 0.1) {
                    Render.FilledRect(0, 0, 10, Render.GetScreenSize()[1], [25, 25, 25, 120]);
                    Render.FilledRect(0, Render.GetScreenSize()[1] - defbarlength, 10, Render.GetScreenSize()[1], [58, 191, 54, 120]);
                    Render.Rect(0, 0, 10, Render.GetScreenSize()[1], [25, 25, 25, 120]);
                } else {
                    Render.FilledRect(0, 0, 10, Render.GetScreenSize()[1], [25, 25, 25, 120]);
                    Render.FilledRect(0, Render.GetScreenSize()[1] - defbarlength, 10, Render.GetScreenSize()[1], [252, 18, 19, 120]);
                    Render.Rect(0, 0, 10, Render.GetScreenSize()[1], [25, 25, 25, 120]);
                }
            }
        }
        if (planting) {
            textsize_C4 = Render.TextSize(bombsiteonplant, fonts)[0] + 15;
            Render.Indicator(bombsiteonplant, [210, 216, 112, 255])
            Render.OutlineCircle(x + textsize_C4, y - 25 - add_y + 35, fill / 3.3, [255, 255, 255, 255])
        }
        if (Entity.IsAlive(Entity.GetLocalPlayer())) {
            if (isHideshots) {
                Render.Indicator("ONSHOT", [132, 195, 16, 255])
            }
            if (isDoubletap) {
                Render.Indicator("DT", Exploit.GetCharge() == 1 ? [255, 255, 255, 255] : [255, 0, 0, 255])
            }
        }
    }
    if (config.indicators.value == 6) {
        var sw = Render.GetScreenSize()[0];
        var sh = Render.GetScreenSize()[1];
        var font = Render.GetFont("verdana.ttf", 9, true);
        var smallfont = Render.GetFont("verdanab.ttf", 13, true);

        var swm = Math.floor(sw * 0.5 + 0.5);
        var shm = sh - 20;

        var fpsColoring = [];
        var pingColoring = [];

        if (Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing") < 40) {
            pingColoring = [159, 202, 43, 255];
        } else if (Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing") < 80) {
            pingColoring = [255, 222, 0, 255];
        } else {
            pingColoring = [255, 0, 60, 255];
        }

        Math.floor(1 / Global.Frametime()) < Globals.Tickrate() ? fpsColoring = [255, 0, 60, 255] : fpsColoring = [159, 202, 43, 255];

        Render.FilledRect(swm - 110, shm - 12, 220, 110, [30, 30, 30, 220]);
        Render.GradientRect(swm - 300, shm - 12, 190, 300, 1, [30, 30, 30, 0], [30, 30, 30, 220]);
        Render.GradientRect(swm + 110, shm - 12, 190, 110, 1, [30, 30, 30, 220], [30, 30, 30, 0]);
        Render.GradientRect(swm - 200, shm - 12, 200, 2, 1, [0, 0, 0, 0], [0, 0, 0, 150]);
        Render.GradientRect(swm, shm - 12, 200, 2, 1, [0, 0, 0, 150], [0, 0, 0, 0]);

        Render.String(swm - 108, shm - 4, 1, String(Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing")), pingColoring, smallfont);
        Render.String(swm - 79, shm - 1, 1, "PING", [255, 255, 255, 150], font);

        Render.String(swm - 14, shm - 4, 1, String(Math.floor(1 / Global.Frametime())), fpsColoring, smallfont);
        Render.String(swm + 13, shm - 1, 1, "FPS", [255, 255, 255, 150], font);

        Render.String(swm + 71, shm - 4, 1, String(Math.floor(Math.min(10000, Math.sqrt(Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[0] * Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[0] + Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[1] * Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[1]) + 0.5))), [255, 255, 255, 255], smallfont);
        Render.String(swm + 105, shm - 1, 1, "SPEED", [255, 255, 255, 150], font);
        var font = Render.GetFont("verdanab.ttf", 24, true);
        var dtLoc, lcLoc, fdLoc, ebtLoc, spLoc, fkLoc, hsLoc;
        var lcColor = [];

        var swm = sw / 115;
        var shm = sh / 1.15;

        UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) ? dtLoc = 35 : dtLoc = 0;
        Math.sqrt(Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[0] * Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[0] + Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[1] * Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[1]) > 255 && Entity.IsAlive(Entity.GetLocalPlayer()) ? lcLoc = 35 : lcLoc = 0;

        if (Math.sqrt(Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[0] * Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[0] + Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[1] * Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[1]) > 295) {
            if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) || UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Hide shots"])) {
                lcColor[0] = 255;
                lcColor[1] = 0;
                lcColor[2] = 0;
            } else {
                lcColor[0] = 132;
                lcColor[1] = 195;
                lcColor[2] = 16;
            }
        } else {
            lcColor[0] = 255;
            lcColor[1] = 0;
            lcColor[2] = 0;
        }

        UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"]) ? fdLoc = 35 : fdLoc = 0;
        UI.GetValue(["Misc.", "Helpers", "General", "Extended backtracking"]) ? ebtLoc = 35 : ebtLoc = 0;
        UI.GetValue(["Rage", "General", "General", "Key assignment", "Force safe point"]) ? spLoc = 35 : spLoc = 0;
        UI.GetValue(["Rage", "Anti Aim", "General", "Enabled"]) ? fkLoc = 35 : fkLoc = 0;
        UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Hide shots"]) ? hsLoc = 35 : hsLoc = 0;


        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"])) {
            Render.String(swm, shm + 1 - 280 - hsLoc - fkLoc - spLoc - ebtLoc - fdLoc - lcLoc - 5, 0, "DT", [17, 17, 17, 255], font);
            Render.String(swm, shm - 280 - hsLoc - fkLoc - spLoc - ebtLoc - fdLoc - lcLoc - 5, 0, "DT", [184 - 35 * Exploit.GetCharge(), 6 + 178 * Exploit.GetCharge(), 6, 255], font);
            Render.FilledRect(swm + 2, shm + 1 - 280 - hsLoc - fkLoc - spLoc - ebtLoc - fdLoc - lcLoc + 25, Math.abs(Exploit.GetCharge() * 34).toFixed(0), 3, [17, 17, 17, 255]);
            Render.FilledRect(swm + 2, shm - 280 - hsLoc - fkLoc - spLoc - ebtLoc - fdLoc - lcLoc + 25, Math.abs(Exploit.GetCharge() * 34).toFixed(0), 3, [184 - 35 * Exploit.GetCharge(), 6 + 178 * Exploit.GetCharge(), 6, 255]);

        }

        if (Math.sqrt(Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[0] * Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[0] + Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[1] * Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]")[1]) > 255 && Entity.IsAlive(Entity.GetLocalPlayer())) {
            Render.String(swm, shm + 1 - 280 - hsLoc - fkLoc - spLoc - ebtLoc - fdLoc, 0, "LC", [17, 17, 17, 255], font);
            Render.String(swm, shm - 280 - hsLoc - fkLoc - spLoc - ebtLoc - fdLoc, 0, "LC", [lcColor[0], lcColor[1], lcColor[2], 255], font);
        }

        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"])) {
            Render.String(swm, shm + 1 - 280 - hsLoc - fkLoc - spLoc - ebtLoc, 0, "DUCK", [17, 17, 17, 255], font);
            Render.String(swm, shm - 280 - hsLoc - fkLoc - spLoc - ebtLoc, 0, "DUCK", [255, 255, 255, 255], font);
        }

        if (UI.GetValue(["Misc.", "Helpers", "General", "Extended backtracking"])) {
            Render.String(swm, shm + 1 - 350 + 105 - hsLoc - fkLoc - spLoc - ebtLoc, 0, "PING", [17, 17, 17, 255], font);
            Render.String(swm, shm - 350 + 105 - hsLoc - fkLoc - spLoc - ebtLoc, 0, "PING", [255 - ((Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing") / 189 * 60) * 2.29824561404), (Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing") / 189 * 60) * 3.42105263158, (Entity.GetProp(Entity.GetLocalPlayer(), "CPlayerResource", "m_iPing") / 189 * 60) * 0.22807017543, 255], font);
        }

        if (UI.GetValue(["Rage", "General", "General", "Key assignment", "Force safe point"])) {
            Render.String(swm, shm + 1 - 280 - hsLoc - fkLoc, 0, "SAFE", [17, 17, 17, 255], font);
            Render.String(swm, shm - 280 - hsLoc - fkLoc, 0, "SAFE", [132, 195, 16, 255], font);
        }

        if (UI.GetValue(["Rage", "Anti Aim", "General", "Enabled"])) {
            renderArc(swm + 8.5, shm + 1 - 280 - hsLoc + 14, 9, 4.5, 0, 360, 50, [17, 17, 17, 255]);
            renderArc(swm + 8.5, shm + 1 - 280 - hsLoc + 14, 9, 4.5, 0, delta * 2, 50, [132, 195, 16, 255]);
            Render.String(swm + 26, shm + 1 - 280 - hsLoc, 0, "FAKE", [17, 17, 17, 255], font);
            Render.String(swm + 26, shm - 280 - hsLoc, 0, "FAKE", [132, 195, 16, 255], font);
        }

        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Hide shots"])) {
            Render.String(swm, shm + 1 - 280, 0, "ONSHOT", [17, 17, 17, 255], font);
            Render.String(swm, shm - 280, 0, "ONSHOT", [132, 195, 16, 255], font);
        }

        if (config.dmg_override_key.active) {
            Render.String(swm, shm + 1 - 280 - dtLoc - fkLoc, 0, "DMG", [17, 17, 17, 255], font);
            Render.String(swm, shm - 280 - dtLoc - fkLoc, 0, "DMG", [132, 195, 16, 255], font);
        }
    }
}

function WatermarkText() {
    if (World.GetServerString() == "local server") {
        return "local"
    }
    else if (World.GetServerString() == "valve [aimstep]") {
        return "valve"
    }
    else if (World.GetServerString() == "") {
        return "main menu"
    } else {
        return "metamod"
    }
}

function onWatermark() {
    if (Entity.IsAlive(Entity.GetLocalPlayer())) {
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
        if (debugbuild) {
            var w = Render.TextSize(textdebug, fonten)[0] + 10;
        } else if (betabuild) {
            var w = Render.TextSize(textbeta, fonten)[0] + 10;
        } else {
            var w = Render.TextSize(textrelease, fonten)[0] + 10;
        }
        var x = Global.GetScreenSize()[0];

        var x = x - w - 10;

        Render.FilledRect(x - 25, 11 + 2, w, 18, [17, 17, 17, 155]);
        Render.FilledRect(x - 25, 11, w, 2, [getAccent[0], getAccent[1], getAccent[2], 222]);
        if (debugbuild) {
            Render.String(x - 23, 11 + 3, 0, textdebug, [255, 255, 255, 255], fonten);
        } else if (betabuild) {
            Render.String(x - 23, 11 + 3, 0, textbeta, [255, 255, 255, 255], fonten);
        } else {
            Render.String(x - 23, 11 + 3, 0, textrelease, [255, 255, 255, 255], fonten);
        }
    }
}


pathes = []
var lasttime = 0
function get_all_keys() {

    config.hotkey_x.value = 150;
    config.hotkey_y.value = 150;

    ragekeysgeneral = UI.GetChildren(["Rage", "General", "SHEET_MGR", "General", "Key assignment"])
    ragekeysexploits = UI.GetChildren(["Rage", "Exploits", "SHEET_MGR", "Keys", "Key assignment"])
    ragekeysantiaim = UI.GetChildren(["Rage", "Anti Aim", "SHEET_MGR", "General", "Key assignment"])
    miskkeys = UI.GetChildren(["Misc.", "Keys", "SHEET_MGR", "General", "Key assignment"])
    scriptkeys = UI.GetChildren(["Config", "Scripts", "Keys", "JS Keybinds",])
    for (p in ragekeysgeneral) {
        pathes.push([
            ["Rage", "General", "SHEET_MGR", "General", "Key assignment", ragekeysgeneral[p]], ragekeysgeneral[p]
        ])
    }
    for (o in ragekeysexploits) {
        pathes.push([
            ["Rage", "Exploits", "SHEET_MGR", "Keys", "Key assignment", ragekeysexploits[o]], ragekeysexploits[o]
        ])
    }
    for (r in ragekeysantiaim) {
        pathes.push([
            ["Rage", "Anti Aim", "SHEET_MGR", "General", "Key assignment", ragekeysantiaim[r]], ragekeysantiaim[r]
        ])
    }
    for (n in miskkeys) {
        pathes.push([
            ["Misc.", "Keys", "SHEET_MGR", "General", "Key assignment", miskkeys[n]], miskkeys[n]
        ])
    }
    for (z in scriptkeys) {
        pathes.push([
            ["Config", "Scripts", "Keys", "JS Keybinds", scriptkeys[z]], scriptkeys[z]
        ])
    }
}
/* On start */
get_all_keys()
/* shadow */
Render.Strings = function (x, y, align, txt, col, font) {
    Render.String(x, y + 1, align, txt, [0, 0, 0, 255], font);
    Render.String(x, y, align, txt, col, font);
}
/* Keybinds main function */
function keybinds() {
    if (!config.hotkey_list.value) { return }
    function in_bounds(vec, x, y, x2, y2) {
        return (vec[0] > x) && (vec[1] > y) && (vec[0] < x2) && (vec[1] < y2)
    }


    Render.Strings = function (x, y, align, txt, col, font) {
        Render.String(x, y + 1, align, txt, [0, 0, 0, 255], font);
        Render.String(x, y, align, txt, col, font);
    }

    if (!Entity.IsAlive(Entity.GetLocalPlayer()) || World.GetServerString() == "" || pathes.length == 0) return;


    font_keys = Render.GetFont("verdana.ttf", 10, true)
    /* Translate ui name to render text */
    const ui_to_type = {
        "Always": "[~]",
        "Hold": "[holding]",
        "Toggle": "[toggled]"
    }
    var keys = []
    for (var i in pathes) {
        active = UI.GetValue(pathes[i][0])
        if (!active) continue;
        type = ui_to_type[UI.GetHotkeyState(pathes[i][0])]
        if (type == "[~]") continue;
        text = pathes[i][1]
        keys.push({
            "text": text,
            "type": type
        })
    }
    const x = config.hotkey_x.value, y = config.hotkey_y.value
    if (keys.length == 0 && !menu.opened) return;
    var max_size = 25
    for (var b in keys) {
        if (Render.TextSize(keys[b].text, font_keys)[0] > max_size) {
            max_size = Render.TextSize(keys[b].text, font_keys)[0]
        }
    }
    for (var i in keys) {
        bind = keys[i]
        data = {
            "a": bind.text,
            "b": bind.type,
            "c": Render.TextSize(bind.text, font_keys)
        }
        Render.Strings(x + 2, y + 5 + 15 * i, 0, data.a, [255, 255, 255, 255], font_keys);
        Render.Strings(x + 2 + max_size + 10, y + 5 + 15 * i, 0, data.b, [255, 255, 255, 255], font_keys);
    }
    w_ = 60 + max_size

    Render.FilledRect(x + 5, y - 15, w_, 18, [17, 17, 17, 155]);
    Render.FilledRect(x + 5, y - 17, w_, 2, menu.get_color(config.menu_color));

    Render.Strings(x + w_ / 2, y - 14, 1, "hotkeys", [255, 255, 255, 255], font_keys);
    /* For dragging */
    if (Global.IsKeyPressed(1) && menu.opened) {
        const mouse_pos = Input.GetCursorPosition();
        if (in_bounds(mouse_pos, x, y - 20, x + w_, y + 20)) {
            config.hotkey_x.value = mouse_pos[0] - w_ / 2;
            config.hotkey_y.value = mouse_pos[1];
        }
    }
}

var positions = [];
var trace = [];
var render = [];
var local = Entity.GetLocalPlayer();

function Clamp(v, min, max) {
    return Math.max(Math.min(v, max), min);
}

render.arc = function (x, y, r1, r2, s, d, col) {
    for (var i = s; i < s + d; i++) {

        var rad = i * Math.PI / 180;

        Render.Line(x + Math.cos(rad) * r1, y + Math.sin(rad) * r1, x + Math.cos(rad) * r2, y + Math.sin(rad) * r2, col);
    }
}

function ImportGrenades() {
    if (!config.grenade_tracer.value) { return }
    var grenades = Entity.GetEntitiesByClassID(9).concat(Entity.GetEntitiesByClassID(113).concat(Entity.GetEntitiesByClassID(100)));
    for (e in grenades) {
        pass = false;
        for (g in positions) {
            if (positions[g][0] == grenades[e]) {
                pass = true;
                continue;
            }
        }
        if (pass)
            continue;

        positions.push([grenades[e], Globals.Curtime(), [Entity.GetRenderOrigin(grenades[e])], Globals.Curtime()]);
    }
}

function GrenadeWarning() {
    if (!config.grenade_tracer.value) { return }
    var grenades = Entity.GetEntitiesByClassID(9).concat(Entity.GetEntitiesByClassID(113).concat(Entity.GetEntitiesByClassID(100)));
    if (!Entity.IsAlive(local))
        return;

    for (g in grenades) {
        for (var i = 0; i < grenades.length; i++) {
            var g = grenades[i];
            var isInferno = Entity.GetClassID(g) === 100;
            var isHeGrenade = Entity.GetClassID(g) === 9;
            var isMolotov = Entity.GetClassID(g) === 113;
            var DistanceInFeet = function (origin, destination) {
                var sub = [destination[0] - origin[0], destination[1] - origin[1], destination[2] - origin[2]];
                return Math.round(Math.sqrt(sub[0] * 2 + sub[1] * 2 + sub[2] * 2) / 12);
            }
            var destination = Entity.GetRenderOrigin(g);
            var origin = Entity.GetEyePosition(local);
            var distance = parseFloat(DistanceInFeet(origin, destination));
            var screen = Render.WorldToScreen(destination);
            var isSafe = distance > (isInferno ? 15 : 20) || trace[1] < 0.61;

            if (distance > 256) {
                continue;
            }

            if (isHeGrenade && Entity.GetProp(g, "CBaseCSGrenadeProjectile", "m_nExplodeEffectTickBegin")) {
                continue;
            }

            if (isMolotov || Entity.GetProp(g, "CBaseCSGrenadeProjectile", "m_nExplodeEffectTickBegin")) {
                continue;
            }

            const font = Render.GetFont("Verdana.TTF", 8, true);
            const fontArrow = Render.GetFont("Verdana.TTF", 25, true);

            Render.FilledCircle(screen[0], screen[1] - 50, 23, [30, 25, 22, 200])
            Render.FilledCircle(screen[0], screen[1] - 50, 22, !isSafe ? [204, 48, 14, 220] : [30, 25, 22, 200])
            Render.String(screen[0], screen[1] - 73, 1, "!", [252, 240, 3, 255], fontArrow);
            Render.String(screen[0], screen[1] - 46, 1, distance + " m", [255, 255, 255, 255], font);
            Render.String(screen[0], screen[1] - 45, 1, distance + " m", [255, 255, 255, 255], font);
        }
    }
}

function onPingSpike() {
    var pingspike, time;

    if (config.pingspike.value) {
        if (Ragebot.GetTargets() == "" && pingspike == 0) {
            UI.SetValue(["Misc.", "Helpers", "General", "Extended backtracking"], 0)
        }
        else if (Ragebot.GetTargets() != "") {
            pingspike = 1
            time = Globals.Realtime()
        }

        if (pingspike == 1) {
            if (!UI.GetValue(["Rage", "Exploits", "Key assignment", "Double tap"])) {
                UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
                UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], 14);
                UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], 0);
                UI.SetValue(["Misc.", "Helpers", "General", "Extended backtracking"], 1);
                UserCMD.Choke()
            } else {
                UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
                UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], 1);
                UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], 0);
                UI.SetValue(["Misc.", "Helpers", "General", "Extended backtracking"], 1);
                random = getMathRandom(0, 10)
                if (random <= 1) {
                    UserCMD.Choke()
                } else {
                    UserCMD.Send();
                }
            }
            if (time + 1 < Globals.Realtime()) {
                pingspike = 0
            }
        }
    } else {
        UI.SetValue(["Misc.", "Helpers", "General", "Extended backtracking"], 0);
    }
}



hitboxes = [
    'generic',
    'head',
    'chest',
    'stomach',
    'left arm',
    'right arm',
    'left leg',
    'right leg',
    '?'
];
var predicthc = 0;
var safety = 0;
var hitboxName = "";
var choked = 0;
var exploit = 0;
function getHitboxName(index) {
    switch (index) {
        case 0:
            hitboxName = "head";
            break;
        case 1:
            hitboxName = "head";
            break;
        case 2:
            hitboxName = "stomach";
            break;
        case 3:
            hitboxName = "stomach";
            break;
        case 4:
            hitboxName = "stomach";
            break;
        case 5:
            hitboxName = "chest";
            break;
        case 6:
            hitboxName = "chest";
            break;
        case 7:
            hitboxName = "left leg";
            break;
        case 8:
            hitboxName = "right leg";
            break;
        case 9:
            hitboxName = "left leg";
            break;
        case 10:
            hitboxName = "right leg";
            break;
        case 11:
            hitboxName = "left leg";
            break;
        case 12:
            hitboxName = "right leg";
            break;
        case 13:
            hitboxName = "left arm";
            break;
        case 14:
            hitboxName = "right arm";
            break;
        case 15:
            hitboxName = "left arm";
            break;
        case 16:
            hitboxName = "left arm";
            break;
        case 17:
            hitboxName = "right arm";
            break;
        case 18:
            hitboxName = "right arm";
            break;
        default:
            hitboxName = "body";
    }
    return hitboxName;
}
function HitgroupName(index) {
    return hitboxes[index] || 'body';
}

var shots_fired = 0;
var hits = 0;
var lastUpdate = 0;
var logged = false;

function ragebot_fire() {
    if (!config.aimlog.value) { return }
    predicthc = Event.GetInt("hitchance");
    safety = Event.GetInt("safepoint");
    hitboxName = getHitboxName(Event.GetInt("hitbox"));
    exploit = (Event.GetInt("exploit") + 1).toString();
    target = Event.GetInt("target_index");
    shots_fired++;
    logged = false;
    lastUpdate = Globals.Curtime();
}

function hitlog() {
    if (!config.aimlog.value) { return }
    var hit = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    var attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    if (attacker == Entity.GetLocalPlayer() && hit == target) hits++;

    var hittype = "Hit ";
    me = Entity.GetLocalPlayer();
    hitbox = Event.GetInt('hitgroup');
    target_damage = Event.GetInt("dmg_health");
    target_health = Event.GetInt("health");
    victim = Event.GetInt('userid');
    attacker = Event.GetInt('attacker');
    weapon = Event.GetString('weapon');
    victimIndex = Entity.GetEntityFromUserID(victim);
    attackerIndex = Entity.GetEntityFromUserID(attacker);
    name = Entity.GetName(victimIndex);

    if (safety == 1) {
        safety = "true";
    }
    else {
        safety = "false";
    }

    if (weapon == "hegrenade")
        hittype = "Naded ";
    else if (weapon == "inferno")
        hittype = "Burned ";
    else if (weapon == "knife")
        hittype = "Knifed ";

    if (me == attackerIndex && me != victimIndex) {
        Cheat.PrintColor([89, 119, 239, 255], "[ aurora ] ");
        if (hittype == "Hit ") {
            if (config.aimlog_chat.value) {
                Cheat.PrintChat(" \x08[\x0B aurora \x08] " + hittype + name + "'s \x0B" + HitgroupName(hitbox) + "\x08 for \x07" + target_damage.toString() + "\x08 (" + target_health.toString() + " remaining) | aimed: \x0B" + hitboxName + "\x08 | safety:\x03" + safety + "\n");
            }
            Cheat.Print(" " + hittype + name + "'s " + HitgroupName(hitbox) + " for " + target_damage.toString() + " (" + target_health.toString() + " remaining)| aimed: " + hitboxName + " | safety:" + safety + "\n");
        }
        else {
            Cheat.Print(" " + hittype + name + "'s " + HitgroupName(hitbox) + " for " + target_damage.toString() + " (" + target_health.toString() + " remaining) \n");
        }
    }

}



function onDrawHitlogs() {
    if (!config.aimlog.value) { return }
    if (!World.GetServerString()) return;

    if (shots_fired > hits && (Globals.Curtime() - lastUpdate > 0.33)) {
        if (Globals.Curtime() - lastUpdate > 1) {
            shots_fired = 0;
            hits = 0;
        }
        if (!logged) {
            var simtime = Globals.Tickcount() % 16;
            logged = true;
            var issafe = "true";
            var reason = "?";
            if (safety == 0) {
                issafe = "false";
            }

            if (Entity.IsAlive(target) == false) {
                reason = "death";
            } else if (Entity.IsAlive(Entity.GetLocalPlayer()) == false) {
                reason = "dead";
            } else if (safety == true && predicthc < 76) {
                reason = "spread";
            }
            else if (safety == true && predicthc > 76) {
                reason = "prediction error";
            }

            if (target != -1) {
                Cheat.PrintColor([89, 119, 239, 255], "[ aurora ] ");
                Cheat.Print(" " + "Missed " + Entity.GetName(target) + "'s " + hitboxName + " due to " + reason + ", | safety:" + issafe + "\n");

                if (config.aimlog_chat.value) {
                    Cheat.PrintChat(" \x08[\x0B aurora \x08] " + "\x08Missed " + Entity.GetName(target) + "'s \x0B" + hitboxName + "\x08 due to \x07" + reason + "\x08, | safety:\x03" + issafe);
                }
            }
        }
    }
}

closesttarget = -1
function onTargetSelection() {
    //config.target_selection.value
    if (!Ragebot.GetTarget()) {
        closesttarget = closestTarget();
    } else {
        closesttarget = Ragebot.GetTarget();
    }

    if (config.target_selection.value == 1) {
        if (Ragebot.GetTarget() !== closestTarget()) {
            Ragebot.ForceTarget(closestTarget())
        }
    }
}




function onStartup(callback) {
    callback();

    Cheat.Print("      _____                                     \n");
    Cheat.Print("     /  _  \\  __ _________  ________________    \n");
    Cheat.Print("    /  /_\\  \\|  |  \\_  __ \\/  _ \\_  __ \\__  \\  \n");
    Cheat.Print("   /    |    \\  |  /|  | \\(  <_> )  | \\// __ \\_ \n");
    Cheat.Print("   \\____|__  /____/ |__|   \\____/|__|  (____  / \n");
    Cheat.Print("           \\/                               \\/  \n")
}
onStartup(config_system.load);


function onCreateMove() {
    onTelepeak()
    onMMFakeduck()
    onAvoidingHitboxes()
    onForcingSafety()
    onAirHitchance()
    onMinDMG()
    onDelayShot()
    onNSDistance()
    on_cmove()
    onAntiAim()
    onFreestanding()
    onSlowwalkAA()
    OnSlowwalkSpeed()
    onShakingLegs()
    onDoubleTap()
    onFastRecharge()
    onSwapRecharge()
    onHP2()
    onFakeLag()
    onHidechat()
    onEPeek()
    onDynamicHitchance()
    onPingSpike()
    onTargetSelection()
}

function onDraw() {
    onDrawHitlogs()
    on_paint()
    onKillEffect()
    onRainbowBar()
    onFog()
    onSnowflakes()
    onIndicators()
    onWatermark()
    keybinds()
    ImportGrenades();
    GrenadeWarning();
}

function onScriptUnload(callback) {
    UI.SetValue(["Config", "Cheat", "General", "Restrictions"], restrictions_cache);
    UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], yaw_offset_cache);
    UI.SetValue(["Rage", "Anti Aim", "Directions", "At targets"], at_tar)
    UI.SetValue(["Rage", "Anti Aim", "General", "Pitch mode"], pitch_cache);
    UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], jitter_offset_cache);

    Convar.SetString("fog_override", "0")
    AntiAim.SetOverride(0)
    Convar.SetString("r_aspectratio", aspectratiocache.toString())

    callback()
}

function onUnload() {
    on_unload()
    onDTUnload()
    onScriptUnload(config_system.save)
}

function onPlayerConnect() {
    lastPressed = Global.Tickcount();
    oldTick = Global.Tickcount();
    on_plant_time = 0
    fill = 0
    planting = false
    var c4 = Entity.GetEntitiesByClassID(129)[0];
    if (c4 == undefined) return;
}


Cheat.RegisterCallback("Draw", "onDraw")
Cheat.RegisterCallback("Unload", "onUnload")
Cheat.RegisterCallback("CreateMove", "onCreateMove")

Cheat.RegisterCallback("player_connect_full", "onPlayerConnect")
Cheat.RegisterCallback("bomb_beginplant", "bomb_beginplant");
Cheat.RegisterCallback("bomb_abortplant", "bomb_abortplant");
Cheat.RegisterCallback("bomb_defused", "bomb_defused");
Cheat.RegisterCallback("bomb_planted", "bomb_planted");
Cheat.RegisterCallback("bomb_exploded", "bomb_exploded");
Cheat.RegisterCallback("player_hurt", "OnHurt");
Cheat.RegisterCallback("bullet_impact", "OnBulletImpact");
Cheat.RegisterCallback("FrameStageNotify", "onAspectRatio");
Cheat.RegisterCallback("player_death", "onPlayerDeath");
Cheat.RegisterCallback("FRAME_START", "AuroraClantag");
Cheat.RegisterCallback("weapon_fire", "onWeaponFire");
Cheat.RegisterCallback("ragebot_fire", "onLogSpeed")
Cheat.RegisterCallback("ragebot_fire", "ragebot_fire");
Cheat.RegisterCallback("player_hurt", "hitlog");
