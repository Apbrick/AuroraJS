//TODO: E-Peek, Dynamic Indicator Sorting at Crosshair
var cached_fakelagState = UI.GetValue(["Rage", "Fake Lag", "General", "Enabled"]);
var cached_fakelagLimit = UI.GetValue(["Rage", "Fake Lag", "General", "Limit"]);
var cached_fakelagJitter = UI.GetValue(["Rage", "Fake Lag", "General", "Jitter"]);
var cached_aspectRatio = Convar.GetString("r_aspectratio");
var cached_legmovementState = UI.GetValue(["Misc.", "Movement", "Leg movement"]);

UI.AddSubTab(["Misc.", "SUBTAB_MGR"], "Aurora");
UI.AddDropdown(["Misc.", "Aurora", "Aurora"], "Section", ["Anti-Aim", "Doubletap", "Fakelag", "Visuals", "Miscellaneous"], 0);

//Anti-Aim
UI.AddDropdown(["Misc.", "Aurora", "Aurora"], "Anti-Aim Mode", ["None", "Simple", "Advanced", "Aurora"], 0);
UI.AddCheckbox(["Misc.", "Aurora", "Aurora"], "Low delta on slowwalk");
UI.AddCheckbox(["Misc.", "Aurora", "Aurora"], "Shaking legs");

//Doubletap
UI.AddDropdown(["Misc.", "Aurora", "Aurora"], "Doubletap Mode", ["None", "Fast", "Quick", "Supersonic"], 0);
UI.AddCheckbox(["Misc.", "Aurora", "Aurora"], "Faster recharge");

//Fakelag
UI.AddCheckbox(["Misc.", "Aurora", "Aurora"], "Advanced Fakelag");
UI.AddCheckbox(["Misc.", "Aurora", "Aurora"], "Randomized Selection");
UI.AddSliderInt(["Misc.", "Aurora", "Aurora"], "Limit Minimum", 0, 14);
UI.AddSliderInt(["Misc.", "Aurora", "Aurora"], "Limit Maximum", 0, 14);
UI.AddSliderInt(["Misc.", "Aurora", "Aurora"], "Jitter Minimum", 0, 100);
UI.AddSliderInt(["Misc.", "Aurora", "Aurora"], "Jitter Maximum", 0, 100);

//Visuals
UI.AddMultiDropdown(["Misc.", "Aurora", "Aurora"], "Indicators", ["Anti-Aim", "Doubletap", "Fakelag"]);
UI.AddCheckbox(["Misc.", "Aurora", "Aurora"], "Watermark");
UI.AddCheckbox(["Misc.", "Aurora", "Aurora"], "Hotkey list");
UI.AddCheckbox(["Misc.", "Aurora", "Aurora"], "Aspect ratio");
UI.AddSliderFloat(["Misc.", "Aurora", "Aurora"], "Aspect ratio value", 0, 5);
UI.AddColorPicker(["Misc.", "Aurora", "Aurora"], "Coloring");

//Miscellaneous
UI.AddDropdown(["Misc.", "Aurora", "Aurora"], "Clantag", ["None", "Static", "Simple", "Fancy"], 0);

debugbuild = Cheat.GetUsername() == "Apnix" || Cheat.GetUsername() == "geinibba3413" || Cheat.GetUsername() == "Heneston";
betabuild = Cheat.GetUsername() == "Brexan" || Cheat.GetUsername() == "avatar" || Cheat.GetUsername() == "Zapzter" || Cheat.GetUsername() == "xyren";

function getDropdownValue(value, index) {
    var mask = 1 << index;
    return value & mask ? true : false;
}

function getMathRandom(min, max) {
    return Math.floor(Math.random() * ((Math.floor(max) + 1) - Math.ceil(min))) + Math.ceil(min);
}

function onSectionSelection() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Section"]) == 0) { //Anti-Aim

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"], 1);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Low delta on slowwalk"], 1);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Shaking legs"], 1);

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Doubletap Mode"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Faster recharge"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Randomized Selection"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Minimum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Maximum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Minimum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Maximum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Indicators"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Watermark"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Hotkey list"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio value"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Coloring"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Clantag"], 0);

    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Section"]) == 1) { //Doubletap

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Doubletap Mode"], 1);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Faster recharge"], 1);

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Low delta on slowwalk"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Shaking legs"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Randomized Selection"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Minimum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Maximum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Minimum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Maximum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Indicators"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Watermark"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Hotkey list"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio value"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Coloring"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Clantag"], 0);
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Section"]) == 2) { //Fakelag

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"], 1);

        if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"]) == 1) {
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Randomized Selection"], 1);
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Minimum"], 1);
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Maximum"], 1);
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Minimum"], 1);
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Maximum"], 1);
        } else {
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Randomized Selection"], 0);
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Minimum"], 0);
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Maximum"], 0);
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Minimum"], 0);
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Maximum"], 0);
        }

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Doubletap Mode"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Faster recharge"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Low delta on slowwalk"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Shaking legs"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Indicators"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Watermark"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Hotkey list"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio value"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Coloring"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Clantag"], 0);

    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Section"]) == 3) { //Visuals

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Indicators"], 1);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Watermark"], 1);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Hotkey list"], 1);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio"], 1);

        if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Aspect ratio"]) == 1) {
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio value"], 1);
        } else {
            UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio value"], 0);
        }

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Coloring"], 1);

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Randomized Selection"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Minimum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Maximum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Minimum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Maximum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Doubletap Mode"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Faster recharge"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Low delta on slowwalk"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Shaking legs"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Clantag"], 0);
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Section"]) == 4) { //Miscellaneous

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Clantag"], 1);

        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Doubletap Mode"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Faster recharge"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Low delta on slowwalk"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Shaking legs"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Randomized Selection"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Minimum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Limit Maximum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Minimum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Jitter Maximum"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Indicators"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Watermark"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Hotkey list"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Aspect ratio value"], 0);
        UI.SetEnabled(["Misc.", "Aurora", "Aurora", "Coloring"], 0);
    }
}

function aaNone() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"]) == 0) {
        AntiAim.SetOverride(0);
    }
}

function aaSimple() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"]) == 1) {
        AntiAim.SetOverride(1);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 2);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], 16);
        UI.SetValue(["Rage", "Anti Aim", "Fake", "Lower body yaw mode"], 1);
        UI.SetValue(["Rage", "Anti Aim", "General", "Key assignment", "Jitter"], 3);
        AntiAim.SetRealOffset(42);
        AntiAim.SetFakeOffset(getMathRandom(25, 32));
    }
}

function aaAdvanced() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"]) == 2) {
        AntiAim.SetOverride(1);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 2);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], getMathRandom(2, 10));
        UI.SetValue(["Rage", "Anti Aim", "Fake", "Lower body yaw mode"], 1);
        UI.SetValue(["Rage", "Anti Aim", "General", "Key assignment", "Jitter"], 3);
        AntiAim.SetRealOffset(getMathRandom(40, 48));
        AntiAim.SetFakeOffset(getMathRandom(25, 32));
    }
}

function aaAurora() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"]) == 3) {
        if ((UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"]) == 1) || (UI.GetValue(["Legit", "General", "General", "Key assignment", "AA Direction inverter"]) == 1)) {
            AntiAim.SetOverride(1);
            AntiAim.SetFakeOffset(Globals.Tickcount() % 4, 5 * 1 ? 3 : 3);
            AntiAim.SetRealOffset(getMathRandom(35, 25));
            AntiAim.SetLBYOffset(-10);
        } else if (!(UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"]) == 1) || !(UI.GetValue(["Legit", "General", "General", "Key assignment", "AA Direction inverter"]) == 1)) {
            AntiAim.SetOverride(1);
            AntiAim.SetFakeOffset(Globals.Tickcount() % 4, 5 * 1 ? 5 : 5);
            AntiAim.SetRealOffset(getMathRandom(-35, -25));
            AntiAim.SetLBYOffset(9);
        }
    }
}

function onSlowWalk() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Low delta on slowwalk"]) == 1) {
        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && !UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"], "AA Inverter")) {
            AntiAim.SetOverride(1);
            AntiAim.SetFakeOffset(0);
            AntiAim.SetRealOffset(-47);
        } else if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) && UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"], "AA Inverter")) {
            AntiAim.SetOverride(1);
            AntiAim.SetFakeOffset(0);
            AntiAim.SetRealOffset(47);
        } else {
            AntiAim.SetOverride(0);
        }
    }
}

function onShakingLegs() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Shaking legs"]) == 1) {
        if (Globals.Tickcount() % getMathRandom(4, 7) == 0) {
            if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 2) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
            } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 1) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 0);
            } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 0) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
            }
        }
    }
}

function dtShots(ticks) {
    var localPlayer = Entity.GetLocalPlayer();
    var weapon = Entity.GetWeapon(localPlayer);
    var tickBase = Entity.GetProp(localPlayer, "CCSPlayer", "m_nTickBase");
    var curTime = Globals.TickInterval() * (tickBase - ticks);

    if (localPlayer == null || weapon == null) {
        return false;
    }
    if (curTime < Entity.GetProp(weapon, "CBaseCombatWeapon", "m_flNextPrimaryAttack")) {
        return false;
    }
    if (curTime < Entity.GetProp(localPlayer, "CCSPlayer", "m_flNextAttack")) {
        return false;
    }
    return true;
}

function onDoubletap() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Doubletap Mode"]) == 0) {
        Exploit.EnableRecharge();
        Exploit.OverrideShift(12);
        Exploit.OverrideTolerance(3);
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Doubletap Mode"]) == 1) {
        Exploit[(1 != Exploit.GetCharge() ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 14), Exploit.OverrideShift(12), Exploit.OverrideTolerance(0), dtShots(14) && 1 != Exploit.GetCharge() && (Exploit.DisableRecharge(), Exploit.Recharge());
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Doubletap Mode"]) == 2) {
        Exploit[(1 != Exploit.GetCharge() ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 16), Exploit.OverrideShift(14), Exploit.OverrideTolerance(0), dtShots(16) && 1 != Exploit.GetCharge() && (Exploit.DisableRecharge(), Exploit.Recharge());
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Doubletap Mode"]) == 3) {
        Exploit[(1 != Exploit.GetCharge() ? "Enable" : "Disable") + "Recharge"](), Convar.SetInt("cl_clock_correction", 0), Convar.SetInt("sv_maxusrcmdprocessticks", 20), Exploit.OverrideShift(19), Exploit.OverrideTolerance(0), dtShots(20) && 1 != Exploit.GetCharge() && (Exploit.DisableRecharge(), Exploit.Recharge());
    }
}

function dtRecharge() {
    var rechargeTime = 0;
    var updateTime = !![];
    var shouldDisableRecharge = !![];

    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Faster recharge"]) == 1) {
        const Currentdate = new Date().getTime() / 10000;
        Exploit.DisableRecharge(), shouldDisableRecharge = !![];
        if (Exploit.GetCharge() >= 1) updateTime = !![];
        Exploit.GetCharge() < 1 && (updateTime && (rechargeTime = Currentdate, updateTime = ![]), Currentdate - rechargeTime > 0.45 && updateTime == ![] && (Exploit.Recharge(), rechargeTime = Currentdate));
    } else {
        shouldDisableRecharge && (Exploit.EnableRecharge(), shouldDisableRecharge = ![]);
    }
}

function onFakelag() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"]) == 1) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
        if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Randomized Selection"]) == 1) {
            UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], getMathRandom(UI.GetValue(["Misc.", "Aurora", "Aurora", "Limit Minimum"]), UI.GetValue(["Misc.", "Aurora", "Aurora", "Limit Maximum"])));
            UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], getMathRandom(UI.GetValue(["Misc.", "Aurora", "Aurora", "Jitter Minimum"]), UI.GetValue(["Misc.", "Aurora", "Aurora", "Jitter Maximum"])));
        } else {
            if (Globals.Tickcount() % getMathRandom(1, 3) == 0) {
                var limitAmount = UI.GetValue(["Rage", "Fake Lag", "General", "Limit"]);
                var jitterAmount = UI.GetValue(["Rage", "Fake Lag", "General", "Jitter"]);

                if (limitAmount < UI.GetValue(["Misc.", "Aurora", "Aurora", "Limit Maximum"])) {
                    limitAmount++;
                    UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], limitAmount);
                } else if (limitAmount == UI.GetValue(["Misc.", "Aurora", "Aurora", "Limit Maximum"])) {
                    UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], 0);
                }

                if (jitterAmount < UI.GetValue(["Misc.", "Aurora", "Aurora", "Jitter Maximum"])) {
                    jitterAmount++;
                    UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], jitterAmount);
                } else if (jitterAmount == UI.GetValue(["Misc.", "Aurora", "Aurora", "Jitter Maximum"])) {
                    UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], 0);
                }
            }

            if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"])) {
                UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
                UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], 13);
                UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], 2);
            }
        }
    }
}

function aaText() {
    var returnVar = "";

    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"]) == 0) {
        returnVar = "None";
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"]) == 1) {
        returnVar = "Simple";
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"]) == 2) {
        returnVar = "Advanced";
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Anti-Aim Mode"]) == 3) {
        returnVar = "Aurora";
    }

    return returnVar;
}

function dtText() {
    var returnVar = "";

    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Doubletap Mode"]) == 0) {
        returnVar = "None";
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Doubletap Mode"]) == 1) {
        returnVar = "Fast";
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Doubletap Mode"]) == 2) {
        returnVar = "Quick";
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Doubletap Mode"]) == 3) {
        returnVar = "Supersonic";
    }

    return returnVar;
}

function flText() {
    var returnVar = "";

    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"]) == 0) {
        returnVar = "None";
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Advanced Fakelag"]) == 1) {
        returnVar = "Aurora Fakelag";
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

function onIndicators() {
    if (Entity.IsAlive(Entity.GetLocalPlayer())) {
        var font = Render.GetFont("verdana.ttf", 10, true);
        var x = (Global.GetScreenSize()[0] / 2);
        var y = (Global.GetScreenSize()[1] / 2);
        var color = UI.GetColor(["Misc.", "Aurora", "Aurora", "Coloring"]);

        if (getDropdownValue(UI.GetValue(["Misc.", "Aurora", "Aurora", "Indicators"]), 0)) {
            Render.String(x - 30, y + 15, 0, "Aurora", color, font);
            Render.String(x + 28, y + 15, 0, String(Math.round(Math.min(Local.GetRealYaw() - Local.GetFakeYaw()) / 2, 60)), color, font);
            Render.String(x - 12, y + 25, 0, aaText(), color, font);
        }

        if (getDropdownValue(UI.GetValue(["Misc.", "Aurora", "Aurora", "Indicators"]), 1)) {
            Render.String(x - 12, y + 35, 0, "   " + dtText(), color, font);
            Render.String(x - 30, y + 35, 0, "DT", [184 - 35 * Exploit.GetCharge(), 6 + 178 * Exploit.GetCharge(), 6, 255], font);
        }

        if (getDropdownValue(UI.GetValue(["Misc.", "Aurora", "Aurora", "Indicators"]), 2)) {
            Render.String(x - 30, y + 45, 0, flText(), color, font);
        }
    }
}

function onWatermark() {
    if (Entity.IsAlive(Entity.GetLocalPlayer())) {
        Number.prototype.zeroPad = function () {
            return ('0' + this).slice(-2);
        }

        var font = Render.GetFont("verdana.ttf", 10, true);
        const date = new Date();
        const CurrentTime = date.getHours().zeroPad() + ":" + date.getMinutes().zeroPad() + ":" + date.getSeconds().zeroPad();
        var color = UI.GetColor(["Misc.", "Aurora", "Aurora", "Coloring"]);
        var textdebug = "Aurora [debug] | " + Cheat.GetUsername() + " | " + Global.Tickrate() + "ticks | " + Math.floor(Global.Latency() * 1000 / 1.5) + "ms | " + CurrentTime;
        var textrelease = "Aurora [" + stText() + "] | " + Cheat.GetUsername() + " | " + Global.Tickrate() + " ticks | " + Math.floor(Global.Latency() * 1000 / 1.5) + "ms | " + CurrentTime;
        var textbeta = "Aurora [beta] | " + Cheat.GetUsername() + " | " + Global.Tickrate() + " ticks | " + Math.floor(Global.Latency() * 1000 / 1.5) + "ms | " + CurrentTime;

        if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Watermark"]) == 1) {
            UI.SetValue(["Misc.", "Helpers", "General", "Watermark"], 0);

            if (debugbuild) {
                var w = Render.TextSize(textdebug, font)[0] + 10;
            } else if (betabuild) {
                var w = Render.TextSize(textbeta, font)[0] + 10;
            } else {
                var w = Render.TextSize(textrelease, font)[0] + 10;
            }

            var x = Global.GetScreenSize()[0] - w - 10;

            Render.FilledRect(x - 30, 11 + 2, w, 18, [17, 17, 17, 155]);
            Render.FilledRect(x - 30, 11, w, 2, [color[0], color[1], color[2], 222]);
            if (debugbuild) {
                Render.String(x - 25, 11 + 3, 0, textdebug, [255, 255, 255, 255], font);
            } else if (betabuild) {
                Render.String(x - 25, 11 + 3, 0, textbeta, [255, 255, 255, 255], font);
            } else {
                Render.String(x - 25, 11 + 3, 0, textrelease, [255, 255, 255, 255], font);
            }
        }
    }
}

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

        const sliderX = UI.AddSliderInt(["Rage", "Anti Aim", "General"], "_draggable_" + this.draggables.length + "_x", 0, screenSize[0]);
        const sliderY = UI.AddSliderInt(["Rage", "Anti Aim", "General"], "_draggable_" + this.draggables.length + "_y", 0, screenSize[1]);
        UI.SetEnabled(sliderX, 0);
        UI.SetEnabled(sliderY, 0);

        this.draggables.push({
            pos: [UI.GetValue(sliderX), UI.GetValue(sliderY)],
            size: [startingSizeX, startingSizeY],

            isDragging: false,

            initialDragPosition: [sliderX, sliderY],
            sliders: [sliderX, sliderY],

            callbackFunction: callback,

            update: function () {
                const screenSize = Render.GetScreenSize();
                const menuOpened = UI.IsMenuOpen();

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

const onHotkeylist = function () {
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
    "Thirdperson", "Zoom", "Freecam", "Thirdperson", "Disable Autowall", "Extended backtrack", "Disable autowall"
];

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
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Hotkey list"]) == 1) {
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
            const hotkeyListAccent = UI.GetColor(["Misc.", "Aurora", "Aurora", "Coloring"]);
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

function onAspectratio() {
    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Aspect ratio"]) == 0) {
        Convar.SetString("r_aspectratio", String(cached_aspectRatio));
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Aspect ratio"]) == 1) {
        Convar.SetString("r_aspectratio", String(UI.GetValue(["Misc.", "Aurora", "Aurora", "Aspect ratio value"])));
    }
}

function onClantag() {
    var oldTick = Globals.Tickcount();
    var AuroraNL = ["/", "/\\", "A", "A|", "A|_", "A|_|", "Au", "Au|", "Au|‾", "Aur", "Aur0", "Auro", "Auro|", "Auro|‾", "Auror", "Auror/", "Auror/\\", "Aurora", "Aurora", "Auror", "Auro", "Aur", "Au", "A", ""];
    var AuroraGS = ["A", "Au", "Aur", "Auro", "Auror", "Aurora", "Aurora", "Auror", "Auro", "Aur", "Au", "A", ""];
    var AuroraStatic = "Aurora"

    if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Clantag"]) == 1 && Globals.Tickcount() - oldTick > 16) {
        Local.SetClanTag(AuroraStatic)
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Clantag"]) == 2 && Globals.Tickcount() - oldTick > 16) {
        cur = Math.floor(Globals.Curtime() * 2 % 12 + 1);
        Local.SetClanTag(AuroraGS[cur]);
        oldTick = Globals.Tickcount();
        Globals.ChokedCommands() == 0;
    } else if (UI.GetValue(["Misc.", "Aurora", "Aurora", "Clantag"]) == 3 && Globals.Tickcount() - oldTick > 16) {
        cur = Math.floor(Globals.Curtime() * 2 % 23 + 1);
        Local.SetClanTag(AuroraNL[cur]);
        oldTick = Globals.Tickcount();
        Globals.ChokedCommands() == 0;
    } else if (Globals.Tickcount() - oldTick > 16) {
        Local.SetClanTag("")
    }
}

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
    var Aurora_AA_EPeek_YAW = GetMathRandom(172, 179);

    restrictions = UI.GetValue(["Config", "Cheat", "General", "Restrictions"]);
    yaw_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]);
    jitter_offset = UI.GetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"]);
    pitch_mode = UI.GetValue(["Rage", "Anti Aim", "General", "Pitch mode"]);
    at_targets = UI.GetValue(["Rage", "Anti Aim", "Directions", "At targets"]);


    if (!planted) {
        DefuseReset()
    }
    if (!currently_defusing && !picking_hostage && UI.GetValue(["Misc.", "Aurora", "Aurora", "E-Peek"]) && Input.IsKeyPressed(45)) {
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
    const userid = Entity.GetEntitiesByClassID(Event.GetFloat("userid"));

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

function onUnload() {
    Exploit.EnableRecharge();
    UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], cached_fakelagState);
    UI.SetValue(["Rage", "Fake Lag", "General", "Limit"], cached_fakelagLimit);
    UI.SetValue(["Rage", "Fake Lag", "General", "Jitter"], cached_fakelagJitter);
    UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], cached_fakelagState);
    UI.SetValue(["Misc.", "Movement", "Leg movement"], cached_legmovementState);
}

Cheat.RegisterCallback("Unload", "onUnload");
Cheat.RegisterCallback("Draw", "onSectionSelection");

//Anti-Aim
Cheat.RegisterCallback("CreateMove", "aaNone");
Cheat.RegisterCallback("CreateMove", "aaSimple");
Cheat.RegisterCallback("CreateMove", "aaAdvanced");
Cheat.RegisterCallback("CreateMove", "aaAurora");
Cheat.RegisterCallback("CreateMove", "onSlowWalk");
Cheat.RegisterCallback("CreateMove", "onShakingLegs");

//Doubletap
Cheat.RegisterCallback("CreateMove", "onDoubletap");
Cheat.RegisterCallback("CreateMove", "dtRecharge");

//Fakelag
Cheat.RegisterCallback("CreateMove", "onFakelag");

//Visuals
Cheat.RegisterCallback("Draw", "onIndicators");
Cheat.RegisterCallback("Draw", "onWatermark");
Cheat.RegisterCallback("Draw", "onHotkeylist");
Cheat.RegisterCallback("Draw", "onAspectratio");

//Miscellaneous
Cheat.RegisterCallback("CreateMove", "onClantag");