/*
*
*
*
******************************************************
* Copyright (C) 2021-2030 { Aurora.js } <{ auroradevpayments@gmail.com }>
*
* This file is part of { Aurora Development }.
*
* { Aurora.js } can not be copied and/or distributed without the express
* permission of { Zapzter or Apnix }
******************************************************
* Anti-aim
* Ragebot Enhancements
* Misc
*/

// vector / function region start 
const wep2tab = {
  "usp s": "USP", "glock 18": "Glock", "dual berettas": "Dualies", "r8 revolver": "Revolver", "desert eagle": "Deagle", "p250": "P250", "tec 9": "Tec-9",
  "mp9": "MP9", "mac 10": "Mac10", "pp bizon": "PP-Bizon", "ump 45": "UMP45", "ak 47": "AK47", "sg 553": "SG553", "aug": "AUG", "m4a1 s": "M4A1-S", "m4a4": "M4A4", "ssg 08": "SSG08",
  "awp": "AWP", "g3sg1": "G3SG1", "scar 20": "SCAR20", "xm1014": "XM1014", "mag 7": "MAG7", "m249": "M249", "negev": "Negev", "p2000": "General", "famas": "FAMAS", "five seven": "Five Seven", "mp7": "MP7",
  "ump 45": "UMP45", "p90": "P90", "cz75 auto": "CZ-75", "mp5 sd": "MP5", "galil ar": "GALIL", "sawed off": "Sawed off"
};
const tab_names = ["General", "USP", "Glock", "Five Seven", "Tec-9", "Deagle", "Revolver", "Dualies", "P250", "CZ-75", "Mac10", "P90", "MP5", "MP7", "MP9", "UMP45", "PP-Bizon", "M4A1-S", "M4A4", "AK47", "AUG", "SG553", "FAMAS", "GALIL", "AWP", "SSG08", "SCAR20", "G3SG1", "M249", "XM1014", "MAG7", "Negev", "Sawed off"];
const username = Cheat.GetUsername();

function SetDTSpeed(tolerance, shift, process_ticks) {
  return Exploit.OverrideTolerance(tolerance), Exploit.OverrideShift(shift), Exploit.OverrideMaxProcessTicks(process_ticks);
}

function in_air(player) {
  const flag = Entity.GetProp(player, "CBasePlayer", "m_fFlags");

  if (!(flag & 1)) {
    return true;
  }
}
function easeInOutElastic(t, b, c, d) {
  var s = 1.70158;
  var p = 0;
  var a = c;
  if (t == 0) return b;
  if ((t /= d / 2) == 2) return b + c;
  if (!p) p = d * (.3 * 1.5);
  if (a < Math.abs(c)) {
    a = c;
    var s = p / 4;
  }
  else var s = p / (2 * Math.PI) * Math.asin(c / a);
  if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
}

function getVelocity(index) {
  const velocity = Entity.GetProp(index, "CBasePlayer", "m_vecVelocity[0]");
  return Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
}

function not_in_scope(player) {
  const scopeflag = Entity.GetProp(player, "CCSPlayer", "m_bIsScoped");
  if (scopeflag) {
    return false
  }
  else {
    return true
  }
}

function inBounds(point, x, y, x2, y2) {
  return point[0] > x && point[1] > y && point[0] < x + x2 && point[1] < y + y2
}

function getDropdownValue(value, index) {
  const mask = 1 << index;
  return value & mask ? true : false;
}

function setDropdownValue(value, index, enable) {
  const mask = 1 << index;

  return enable ? (value | mask) : (value & ~mask);
}

function normalize_yaw(angle) {
  const adjusted_yaw = angle;

  if (adjusted_yaw < -180)
    adjusted_yaw += 360;

  if (adjusted_yaw > 180)
    adjusted_yaw -= 360;

  return adjusted_yaw;
}

function degrees_to_radians(degrees) {
  return degrees * (Math.PI / 180);
}

function ang_on_screen(x, y) {
  if (x == 0 && y == 0) {
    return 0
  }

  return degrees_to_radians(Math.atan2(y, x))
}

Render.ShadowedString = function (x, y, centered, text, color, font) {
  Render.String(x + 1, y + 1, centered, text, [10, 10, 10, 125], font)
  Render.String(x, y, centered, text, color, font)
}
Render.OutlineString = function (x, y, centered, text, color, font) {
  const alpha = Math.min(50, 90)
  Render.String(x - 1, y - 1, centered, text, [10, 10, 10, alpha], font)
  Render.String(x - 1, y + 1, centered, text, [10, 10, 10, alpha], font)
  Render.String(x + 1, y - 1, centered, text, [10, 10, 10, alpha], font)
  Render.String(x + 1, y + 1, centered, text, [10, 10, 10, alpha], font)
  Render.String(x, y, centered, text, color, font)
}
Render.AlphaString = function (x, y, centered, text, color, font) {
  const alpha = Math.abs(Math.sin(((Date.now() / 1000) / Math.PI) * 5)) * (color[3] * 0.75)
  Render.String(x + 1, y + 1, centered, text, [10, 10, 10, alpha], font);
  Render.String(x, y, centered, text, color, font);
}
const normalize = function (angle) {
  while (angle < -180) angle += 360;
  while (angle > 180) angle -= 360;
  return angle;
};

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function angle_to_vector(angles) {
  const sp = Math.sin(degrees_to_radians(angles[0]));
  const cp = Math.cos(degrees_to_radians(angles[0]));
  const sy = Math.sin(degrees_to_radians(angles[1]));
  const cy = Math.cos(degrees_to_radians(angles[1]));

  return [cp * cy, cp * sy, -sp]
}

const extend_vector = function (pos, length, angle) {
  var rad = angle * Math.PI / 180
  return [pos[0] + (Math.cos(rad) * length), pos[1] + (Math.sin(rad) * length), pos[2]];
}

function extrapolate_tick(entity, ticks, x, y, z) {
  velocity = Entity.GetProp(entity, "CBasePlayer", "m_vecVelocity[0]");
  new_pos = [x, y, z];
  new_pos[0] = new_pos[0] + velocity[0] * Globals.TickInterval() * ticks;
  new_pos[1] = new_pos[1] + velocity[1] * Globals.TickInterval() * ticks;
  new_pos[2] = new_pos[2] + velocity[2] * Globals.TickInterval() * ticks;
  return new_pos;
}

function CalcAngle(localplayerpos, enemypos) {
  var relativeyaw = Math.atan((localplayerpos[1] - enemypos[1]) / (localplayerpos[0] - enemypos[0]))
  return relativeyaw * 180 / Math.PI
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
  const length = VectorLength(vec[0], vec[1], vec[2]);
  return [vec[0] / length, vec[1] / length, vec[2] / length];
}

function VectorDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function VectorDistance(a, b) {
  return VectorLength(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function ClosestPointOnRay(target, rayStart, rayEnd) {
  const to = VectorSubtract(target, rayStart);
  const dir = VectorSubtract(rayEnd, rayStart);
  const length = VectorLength(dir[0], dir[1], dir[2]);
  dir = VectorNormalize(dir);

  const rangeAlong = VectorDot(dir, to);
  if (rangeAlong < 0.0) {
    return rayStart;
  }
  if (rangeAlong > length) {
    return rayEnd;
  }
  return VectorAdd(rayStart, VectorMultiply(dir, [rangeAlong, rangeAlong, rangeAlong]));
}
function getInnacurateDelta(entity) {
  const weaponData = Entity.GetCCSWeaponInfo(target);
  const entityVelocity = getVelocity(entity)

  if (!weaponData) {
    return
  }
  else if (entityVelocity >= weaponData["max_speed"]) {
    return true
  }
  else return false
}
function getHeadDamage(entity) {
  const localPlayer = Entity.GetLocalPlayer();
  const localEyePos = Entity.GetEyePosition(localPlayer);

  const entityHeadPos = Entity.GetHitboxPosition(entity, 0)

  const headDamage = Trace.Bullet(localPlayer, entity, localEyePos, entityHeadPos)

  return headDamage[1]
}
function lethalCheck(entity) {
  const localPlayer = Entity.GetLocalPlayer();
  const localEyePos = Entity.GetEyePosition(localPlayer);

  const entityHealth = Entity.GetProp(entity, "CBasePlayer", "m_iHealth")
  const entityPelvisPos = Entity.GetHitboxPosition(entity, 2)
  const entityBodyPos = Entity.GetHitboxPosition(entity, 3)
  const entityThoraxPos = Entity.GetHitboxPosition(entity, 4)
  const entityChestPos = Entity.GetHitboxPosition(entity, 5)

  const predictedLocation = extrapolate_tick(localPlayer, 16, localEyePos[0], localEyePos[1], localEyePos[2])

  const pelvisInformation = Trace.Bullet(localPlayer, entity, predictedLocation, entityPelvisPos)
  const bodyInformation = Trace.Bullet(localPlayer, entity, predictedLocation, entityBodyPos)
  const thoraxInformation = Trace.Bullet(localPlayer, entity, predictedLocation, entityThoraxPos)
  const chestInformation = Trace.Bullet(localPlayer, entity, predictedLocation, entityChestPos)

  const predictedDamage = Math.max(pelvisInformation[1], bodyInformation[1], thoraxInformation[1], chestInformation[1])

  const weaponInfo = Entity.GetCCSWeaponInfo(localPlayer)
  const weaponDamage = weaponInfo["damage"];

  if (predictedDamage > entityHealth) {
    return true;
  }
  else if (predictedDamage < entityHealth) {
    return false;
  }
  if (predictedDamage = null) {
    if (weaponDamage > entityHealth) {
      return true;
    }
    else if (weaponDamage > entityHealth) {
      return false;
    }
  }
}

// easing library
var pi = 3.14159265358979323846
var easing = { __index: "easing" };
easing.insine = function (t) {
  return Math.sin(1.5707963 * t);
}
easing.outsine = function (t) {
  return 1 + Math.sin(1.5707963 * (--t));
}
easing.inoutsine = function (t) {
  return 0.5 * (1 + Math.sin(3.1415926 * (t - 0.5)));
}
easing.inquad = function (t) {
  return t * t;
}
easing.outquad = function (t) {
  return t * (2 - t);
}
easing.inoutquad = function (t) {
  return t < 0.5 ? 2 * t * t : t * (4 - 2 * t) - 1;
}
easing.incubic = function (t) {
  return t * t * t;
}
easing.outcubic = function (t) {
  return 1 + (--t) * t * t;
}
easing.inoutcubic = function (t) {
  return t < 0.5 ? 4 * t * t * t : 1 + (--t) * (2 * (--t)) * (2 * t);
}
easing.inquart = function (t) {
  t *= t;
  return t * t;
}
easing.outquart = function (t) {
  t = (--t) * t;
  return 1 - t * t;
}
easing.inoutquart = function (t) {
  if (t < 0.5) {
    t *= t;
    return 8 * t * t;
  }
  else {
    t = (--t) * t;
    return 1 - 8 * t * t;
  }
}
easing.inquint = function (t) {
  t2 = t * t;
  return t * t2 * t2;
}
easing.outquint = function (t) {
  t2 = (--t) * t;
  return 1 + t * t2 * t2;
}
easing.inoutquint = function (t) {
  var t2;
  if (t < 0.5) {
    t2 = t * t;
    return 16 * t * t2 * t2;
  }
  else {
    t2 = (--t) * t;
    return 1 + 16 * t * t2 * t2;
  }
}
easing.inexpo = function (t) {
  return (Math.pow(2, 8 * t) - 1) / 255;
}
easing.outexpo = function (t) {
  return 1 - Math.pow(2, -8 * t);
}
easing.inoutexpo = function (t) {
  if (t < 0.5) {
    return (Math.pow(2, 16 * t) - 1) / 510;
  }
  else {
    return 1 - 0.5 * Math.pow(2, -16 * (t - 0.5));
  }
}
easing.incirc = function (t) {
  return 1 - Math.sqrt(1 - t);
}
easing.outcirc = function (t) {
  return Math.sqrt(t);
}
easing.inoutcirc = function (t) {
  if (t < 0.5) {
    return (1 - Math.sqrt(1 - 2 * t)) * 0.5;
  }
  else {
    return (1 + Math.sqrt(2 * t - 1)) * 0.5;
  }
}
easing.inback = function (t) {
  return t * t * (2.70158 * t - 1.70158);
}
easing.outback = function (t) {
  return 1 + (--t) * t * (2.70158 * t + 1.70158);
}
easing.inoutback = function (t) {
  if (t < 0.5) {
    return t * t * (7 * t - 2.5) * 2;
  }
  else {
    return 1 + (--t) * t * 2 * (7 * t + 2.5);
  }
}
easing.inelastic = function (t) {
  t2 = t * t;
  return t2 * t2 * Math.sin(t * pi * 4.5);
}
easing.outelastic = function (t) {
  t2 = (t - 1) * (t - 1);
  return 1 - t2 * t2 * Math.cos(t * pi * 4.5);
}
easing.inoutelastic = function (t) {
  var t2;
  if (t < 0.45) {
    t2 = t * t;
    return 8 * t2 * t2 * Math.sin(t * pi * 9);
  }
  else if (t < 0.55) {
    return 0.5 + 0.75 * Math.sin(t * pi * 4);
  }
  else {
    t2 = (t - 1) * (t - 1);
    return 1 - 8 * t2 * t2 * Math.sin(t * pi * 9);
  }
}
easing.inbounce = function (t) {
  return Math.pow(2, 6 * (t - 1)) * Math.abs(Math.sin(t * pi * 3.5));
}
easing.outbounce = function (t) {
  return 1 - Math.pow(2, -6 * t) * Math.abs(Math.cos(t * pi * 3.5));
}
easing.inoutbounce = function (t) {
  if (t < 0.5) {
    return 8 * Math.pow(2, 8 * (t - 1)) * Math.abs(Math.sin(t * pi * 7));
  }
  else {
    return 1 - 8 * Math.pow(2, -8 * t) * Math.abs(Math.sin(t * pi * 7));
  }
}

function setupmenu() {
  var weapon = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()));
  UI.AddHotkey(["Rage", "General", "General", "Key assignment"], "aurora - damage", "aurora - damage");
  for (var weapon in wep2tab) {
    UI.AddSliderInt(["Rage", "Target", wep2tab[weapon]], "Damage Override", 0, 130)
    UI.AddMultiDropdown(["Rage", "Target", wep2tab[weapon]], "AURORA | force conditions", ["baim if lethal", "head if running"])
    UI.AddMultiDropdown(["Rage", "Target", wep2tab[weapon]], "AURORA | force hitbox safety", ["Head", "Chest", "Arms", "Stomach", "Legs", "Feet"])
    UI.AddMultiDropdown(["Rage", "Target", wep2tab[weapon]], "AURORA | hitchance options", ["in air hitchance", "noscope hitchance"])
    UI.AddSliderInt(["Rage", "Target", wep2tab[weapon]], "in air hitchance", 0, 100)
    UI.AddSliderInt(["Rage", "Target", wep2tab[weapon]], "noscope hitchance", 0, 100)
  }
}
setupmenu()

function setupMenuHitchances() {
  for (var i in wep2tab) {
    if (UI.GetValue(["Rage", "Target", wep2tab[i], "AURORA | hitchance options"]) & (1 << 0)) {
      UI.SetEnabled(["Rage", "Target", wep2tab[i], "in air hitchance"], 1);
    }
    else {
      UI.SetEnabled(["Rage", "Target", wep2tab[i], "in air hitchance"], 0);
    }
    if (UI.GetValue(["Rage", "Target", wep2tab[i], "AURORA | hitchance options"]) & (1 << 1)) {
      UI.SetEnabled(["Rage", "Target", wep2tab[i], "noscope hitchance"], 1);
    }
    else {
      UI.SetEnabled(["Rage", "Target", wep2tab[i], "noscope hitchance"], 0);
    }
  }
}
Cheat.RegisterCallback("CreateMove", "setupMenuHitchances");


// vector / function region end

// menu region start

UI.AddSubTab(["Rage", "SUBTAB_MGR"], "Aurora");

const path = ["Rage", "Aurora", "Aurora"]

const tab_select = UI.AddDropdown(path, "AURORA | tab selected", ["anti-hit", "rage", "visuals", "misc"], 0);

UI.SetValue(tab_select, 0);

manual_right = UI.AddHotkey(["Rage", "Anti Aim", "Key assignment"], "AURORA | manual right", "aurora - right");
manual_left = UI.AddHotkey(["Rage", "Anti Aim", "Key assignment"], "AURORA | manual left", "aurora - left");
slowDeltaKey = UI.AddHotkey(["Rage", "Anti Aim", "Key assignment"], "AURORA | slow delta", "aurora - slow delta");

aa_master = UI.AddCheckbox(path, "AURORA | anti-hit enable")
manual_toggled = UI.AddCheckbox(path, "AURORA | manual aa");
freestanding = UI.AddCheckbox(path, "AURORA | freestanding");
freestanding_mode = UI.AddDropdown(path, "AURORA | freestanding mode", ["default", "reversed"], 0)
anti_brute = UI.AddCheckbox(path, "AURORA | evade bullets")
evadeDistance = UI.AddSliderInt(path, "AURORA | evade distance", 16, 48);
slow_delta = UI.AddDropdown(path, "AURORA | slow delta type", ["on key", "slowwalk", "always"], 0)
jitter_condition = UI.AddCheckbox(path, "AURORA | safe jitter")
jitter_fake = UI.AddCheckbox(path, "AURORA | automatic jitter")

rage_master = UI.AddCheckbox(path, "AURORA | rage enable")
enhance_dt = UI.AddCheckbox(path, "AURORA | enhance tickbase")
dt_modes = UI.AddDropdown(path, 'AURORA | tickbase shift', ["fast", "consistent", "instant", "experimental"], 0);
flag_type = UI.AddDropdown(path, 'AURORA | condition flag type', ["head", "esp"], 0);

visual_master = UI.AddCheckbox(path, "AURORA | visuals enable")
global_accents = UI.AddColorPicker(path, "AURORA | accent color")
barColorX = UI.AddColorPicker(path, "AURORA | bar color one")
barColorY = UI.AddColorPicker(path, "AURORA | bar color two")
watermark_enable = UI.AddCheckbox(path, "AURORA | watermark")
indicator_enable = UI.AddCheckbox(path, "AURORA | indicators")

misc_master = UI.AddCheckbox(path, "AURORA | misc enable")
ideal_tick = UI.AddCheckbox(path, "AURORA | ideal tick")
jitterMovement = UI.AddCheckbox(path, "AURORA | jitter legs")

function setup_menu() {
  UI.SetEnabled(aa_master, 0);
  UI.SetEnabled(anti_brute, 0);
  UI.SetEnabled(evadeDistance, 0);
  UI.SetEnabled(slow_delta, 0);
  UI.SetEnabled(jitter_condition, 0);
  UI.SetEnabled(jitter_fake, 0);
  UI.SetEnabled(manual_toggled, 0);
  UI.SetEnabled(freestanding, 0);
  UI.SetEnabled(freestanding_mode, 0);

  UI.SetEnabled(rage_master, 0);
  UI.SetEnabled(enhance_dt, 0);
  UI.SetEnabled(dt_modes, 0);
  UI.SetEnabled(flag_type, 0);

  UI.SetEnabled(visual_master, 0);
  UI.SetEnabled(global_accents, 0);
  UI.SetEnabled(barColorX, 0);
  UI.SetEnabled(barColorY, 0);
  UI.SetEnabled(indicator_enable, 0);
  UI.SetEnabled(watermark_enable, 0);

  UI.SetEnabled(misc_master, 0);
  UI.SetEnabled(ideal_tick, 0);
  UI.SetEnabled(jitterMovement, 0);

  if (UI.GetValue(tab_select) == 0) {
    UI.SetEnabled(aa_master, 1);
    if (UI.GetValue(aa_master)) {
      UI.SetEnabled(manual_toggled, 1);
      UI.SetEnabled(freestanding, 1);
      if (UI.GetValue(freestanding)) {
        UI.SetEnabled(freestanding_mode, 1);
      }
      else { UI.SetEnabled(freestanding_mode, 0); }
      UI.SetEnabled(anti_brute, 1);
      if (UI.GetValue(anti_brute)) {
        UI.SetEnabled(evadeDistance, 1);
      }
      else { UI.SetEnabled(evadeDistance, 0); }
      UI.SetEnabled(slow_delta, 1);
      UI.SetEnabled(jitter_condition, 1);
      UI.SetEnabled(jitter_fake, 1);
    }
  }

  if (UI.GetValue(tab_select) == 1) {
    UI.SetEnabled(rage_master, 1);
    if (UI.GetValue(rage_master)) {
      UI.SetEnabled(enhance_dt, 1);
      if (UI.GetValue(enhance_dt)) {
        UI.SetEnabled(dt_modes, 1);
      }
      UI.SetEnabled(flag_type, 1);
    }
  }

  if (UI.GetValue(tab_select) == 2) {
    UI.SetEnabled(visual_master, 1);
    if (UI.GetValue(visual_master)) {
      UI.SetEnabled(global_accents, 1);
      UI.SetEnabled(barColorX, 1);
      UI.SetEnabled(barColorY, 1);
      UI.SetEnabled(indicator_enable, 1);
      UI.SetEnabled(watermark_enable, 1);
    }
  }

  if (UI.GetValue(tab_select) == 3) {
    UI.SetEnabled(misc_master, 1);
    if (UI.GetValue(misc_master)) {
      UI.SetEnabled(ideal_tick, 1);
      UI.SetEnabled(jitterMovement, 1);
    }
  }
}
Cheat.RegisterCallback("Draw", "setup_menu");

function onLoad() {
  Cheat.PrintLog("[ AURORA ] Welcome to aurora, " + username, [142, 104, 173, 255]);
  Cheat.PrintLog("[ AURORA ] Latest update: 2021-04-22 ", [142, 104, 173, 255]);
}
onLoad()

// menu region end

// anti-hit region start 

const aa = true,
  isLeft = 0,
  isRight = 0,
  isBack = 0,
  shouldIndicate = false

function manual_antiaim() {
  if (manual_toggled) {
    if (UI.GetValue(manual_right)) {
      isLeft = 0
      isBack = 0
      isRight = 1
      shouldIndicate = true
      UI.SetValue(['Rage', 'Anti Aim', 'Directions', 'Yaw offset'], 90);
    }
    else if (UI.GetValue(manual_left)) {
      isLeft = 1
      isBack = 0
      isRight = 0
      shouldIndicate = true
      UI.SetValue(['Rage', 'Anti Aim', 'Directions', 'Yaw offset'], -90);
    }
    else {
      isLeft = 0
      isBack = 1
      isRight = 0
      shouldIndicate = false
      UI.SetValue(['Rage', 'Anti Aim', 'Directions', 'Yaw offset'], 0);
    }
  }
}

const aa = {
  timeSinceInvert: 0,
  evades: 0,
  should_brute: false,
  timeSinceSwitch: Globals.Curtime(),
  shouldInvert: 1,
  shouldSlowDelta: false,
  activeStage: 0,
  updatedTimeSinceInvert: 0,
  shouldJitter: false,
  fakeJitterOffset: 0
}

function bulletImpact() {
  const localPlayer = Entity.GetLocalPlayer();

  const currentTime = Globals.Curtime();

  if (!UI.GetValue(anti_brute)) {
    return;
  }
  if (!Entity.IsAlive(localPlayer)) {
    return;
  }

  const bulletPos = [Event.GetInt("x"), Event.GetInt("y"), Event.GetInt("z")]

  const localHead = Entity.GetHitboxPosition(localPlayer, 0);

  const shooterId = Event.GetInt('userid')

  const shooter = Entity.GetEntityFromUserID(shooterId);

  const eyePos = Entity.GetEyePosition(shooter);

  if (!Entity.IsEnemy(shooter)) {
    return;
  }

  if (Math.abs((aa.timeSinceInvert - currentTime)) < 0.3) {
    return;
  }

  if (VectorDistance(localHead, ClosestPointOnRay(localHead, eyePos, bulletPos)) < UI.GetValue(evadeDistance)) {
    aa.timeSinceInvert = currentTime
    aa.evades = aa.evades += 1
    if (aa.evades == 4) {
      aa.evades = 1
    }
  }
}
Cheat.RegisterCallback("bullet_impact", "bulletImpact");

function onRoundStart() {
  aa.evades = 1
}
Cheat.RegisterCallback("round_start", "onRoundStart");

function onDeath() {
  deadPlayer = Entity.GetEntityFromUserID(Event.GetInt('userid'));

  if (!Entity.IsLocalPlayer(deadPlayer)) {
    return
  }
  aa.evades = 1
}
Cheat.RegisterCallback("player_death", "onDeath");

function updateTime() {
  aa.updatedTimeSinceInvert = Math.abs(aa.timeSinceInvert - Globals.Curtime())
}

function getBestEnemy() {
  const target = Entity.GetEnemies();
  const bestFOV = 180
  const localPlayer = Entity.GetLocalPlayer();
  const bestEnemy = null

  const localEye = Entity.GetEyePosition(localPlayer)
  const localView = Local.GetCameraAngles()

  for (var i in target) {
    const currentPos = Entity.GetProp(target[i], "CBasePlayer", "m_vecOrigin")
    const currentFOV = Math.abs(normalize_yaw(ang_on_screen(localEye[0] - currentPos[0], localEye[1] - currentPos[1]) - localView[1] + 180))
    const headPos = Entity.GetHitboxPosition(target[i], 0);
    const forward = VectorSubtract(headPos, localEye);
    bestYaw = (Math.atan2(forward[1], forward[0]) * 180 / Math.PI); // pasted from csgo sdk :sunglasses: used for freestanding :: https://github.com/ValveSoftware/source-sdk-2013/blob/master/sp/src/mathlib/mathlib_base.cpp#L535-L563

    if (currentFOV < bestFOV) {
      bestFOV = currentFOV
      bestEnemy = target[i]
    }
  }
  return bestEnemy
}

function earlyFreestanding(target) {
  const localPlayer = Entity.GetLocalPlayer();
  const localEyePos = Entity.GetEyePosition(localPlayer)
  const localView = Local.GetViewAngles();

  const rightDamage = 0
  const leftDamage = 0

  const color = [255, 255, 255, 255]

  if (!target) {
    return
  }

  if (!Entity.IsAlive(target) || Entity.IsDormant(target)) {
    return
  }

  for (angle = -90; angle <= 90; angle += 45) {
    if (angle == 0) {
      continue
    }
    const currentAngle = angle

    const targetHeadPos = Entity.GetHitboxPosition(target, 0);

    const localEyeDirection = extend_vector(localEyePos, 32, (localView[1] + currentAngle))

    const extrapolatedPos = extrapolate_tick(Entity.GetLocalPlayer(), Globals.Tickrate() / 8, localEyeDirection[0], localEyeDirection[1], localEyeDirection[2])

    const bulletData = Trace.Bullet(localPlayer, target, extrapolatedPos, targetHeadPos)[1]

    eye3d = Render.WorldToScreen([localEyePos[0], localEyePos[1], localEyePos[2]]);

    end3d = Render.WorldToScreen([extrapolatedPos[0], extrapolatedPos[1], extrapolatedPos[2]]);

    head3d = Render.WorldToScreen([targetHeadPos[0], targetHeadPos[1], targetHeadPos[2]]);

    if (angle <= 0) {
      rightDamage += bulletData
    }
    else if (angle >= 0) {
      leftDamage += bulletData
    }
  }
  if (leftDamage > rightDamage) {
    return side = 0
  }
  else {
    return side = 1
  }
}
function handleFreestanding() {
  if (!UI.GetValue(freestanding)) {
    return
  }
  const selectedMode = UI.GetValue(freestanding_mode)
  const inverted = UI.GetValue(['Rage', 'Anti Aim', 'General', 'Key assignment', 'AA Direction inverter'])


  if (selectedMode == 0) {
    if (earlyFreestanding(getBestEnemy()) == 0 && !inverted) {
      UI.ToggleHotkey(['Rage', 'Anti Aim', 'General', 'Key assignment', 'AA Direction inverter'])
    }
    else if (earlyFreestanding(getBestEnemy()) == 1 && inverted) {
      UI.ToggleHotkey(['Rage', 'Anti Aim', 'General', 'Key assignment', 'AA Direction inverter'])
    }
  }
  else {
    if (earlyFreestanding(getBestEnemy()) == 0 && inverted) {
      UI.ToggleHotkey(['Rage', 'Anti Aim', 'General', 'Key assignment', 'AA Direction inverter'])
    }
    else if (earlyFreestanding(getBestEnemy()) == 1 && !inverted) {
      UI.ToggleHotkey(['Rage', 'Anti Aim', 'General', 'Key assignment', 'AA Direction inverter'])
    }
  }
}
function globalAntiAim() {
  const local_player = Entity.GetLocalPlayer();
  const local_hp = Entity.GetProp(local_player, "CBasePlayer", "m_iHealth")
  const local_velocity = getVelocity(local_player)

  const isSlow = UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]);
  const isSlowKey = UI.GetValue(slowDeltaKey);

  if (aa.updatedTimeSinceInvert > 3) {
    aa.should_brute = false
  }
  else {
    aa.should_brute = true
  }

  if (UI.GetValue(slow_delta) == 1 && isSlow) {
    aa.shouldSlowDelta = true
  }
  else if (UI.GetValue(slow_delta) == 0 && isSlowKey) {
    aa.shouldSlowDelta = true
  }
  else if (UI.GetValue(slow_delta) == 2) {
    aa.shouldSlowDelta = true
  }
  else {
    aa.shouldSlowDelta = false
  }

  if (UI.GetValue(jitter_condition)) {
    if (local_hp > 80 || local_velocity > 240) {
      aa.shouldJitter = true
    }
    else {
      aa.shouldJitter = false
    }
  }
}

function getJitterValue() {
  const date = Date.now() / 1000
  const random = Math.abs(Math.sin((date / Globals.Curtime()) * 5).toFixed(0))

  if (!UI.GetValue(jitter_fake)) {
    aa.fakeJitterOffset = 0
  }

  if (random == 1) {
    aa.fakeJitterOffset = 10
  }
  else {
    aa.fakeJitterOffset = 0
  }

  if (!UI.GetValue(jitter_fake)) {
    aa.fakeJitterOffset = 0
  }
}

function set_anti_aim(state) {
  const inverted = UI.GetValue(['Rage', 'Anti Aim', 'General', 'Key assignment', 'AA Direction inverter'])
  switch (state) {
    case 'jitter':
      AntiAim.SetOverride(1);
      AntiAim.SetFakeOffset(0);
      AntiAim.SetRealOffset(-60);
      aa.activeStage = 'stateJitter'
      break;
    case 'slowDelta':
      AntiAim.SetOverride(1);
      AntiAim.SetFakeOffset(0);
      AntiAim.SetRealOffset(-28 + (aa.fakeJitterOffset));
      aa.activeStage = 'slowDelta'
      break;
    case 'highLeft':
      AntiAim.SetOverride(1);
      AntiAim.SetFakeOffset(0);
      AntiAim.SetRealOffset(60 - (aa.fakeJitterOffset));
      aa.activeStage = 'highLeft'
      break;
    case 'highRight':
      AntiAim.SetOverride(1);
      AntiAim.SetFakeOffset(0);
      AntiAim.SetRealOffset(-60 + (aa.fakeJitterOffset));
      aa.activeStage = 'highRight'
      break;
    case 'lowRight':
      AntiAim.SetOverride(1);
      AntiAim.SetFakeOffset(0);
      AntiAim.SetRealOffset(-25 + aa.fakeJitterOffset);
      aa.activeStage = 'lowRight'
      break;
    case 'normal':
      AntiAim.SetOverride(1);
      AntiAim.SetFakeOffset(0);
      AntiAim.SetRealOffset(inverted ? 60 : -50);
      aa.activeStage = 'normal'
      break;
  }
}

function anti_aim_main() {
  const local_player = Entity.GetLocalPlayer();

  if (aa.should_brute) {
    if (aa.evades == 1) {
      set_anti_aim("highLeft")
    }
    else if (aa.evades == 2) {
      set_anti_aim("highRight")
    }
    else if (aa.evades == 3) {
      set_anti_aim("lowRight")
    }
  }
  else if (!aa.should_brute) {
    if (in_air(local_player)) {
      set_anti_aim("jitter")
    }
    else if (aa.shouldSlowDelta) {
      set_anti_aim("slowDelta")
    }
    else {
      set_anti_aim("normal")
    }
  }

  if (aa.shouldJitter && UI.GetValue(jitter_condition)) {
    UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], 13)
  }
  else {
    UI.SetValue(["Rage", "Anti Aim", "Directions", "Jitter offset"], 0)
  }
}

function jitterLegs() {
  if (!UI.GetValue(jitterMovement)) {
    return
  }
  const random = Math.round(Math.random())
  const currentAnim = UI.GetValue(["Misc.", "Movement", "Leg movement"])

  if (random == 0 && currentAnim == 0) {
    UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
  }
  else if (random == 1 && currentAnim == 1) {
    UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
  }
  else if (random == 1 && currentAnim == 2) {
    UI.SetValue(["Misc.", "Movement", "Leg movement"], 0);
  }
  if (random == 0) {
    UI.SetValue(["Rage", "Anti Aim", "Fake", "Jitter move"], 0);
  }
  else {
    UI.SetValue(["Rage", "Anti Aim", "Fake", "Jitter move"], 1);
  }
}
Cheat.RegisterCallback("CreateMove", "jitterLegs");

// anti-hit region end

// ragebot enhancement region start

function overrideInAirHitchance() {
  var localPlayer = Entity.GetLocalPlayer();
  var weapon = Entity.GetName(Entity.GetWeapon(localPlayer));
  var target = Entity.GetEnemies();

  if (!wep2tab.hasOwnProperty(weapon)) {
    return
  }

  var inAirHitchance = UI.GetValue(["Rage", "Target", wep2tab[weapon], "in air hitchance"]);

  for (var i in target) {
    if (UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | hitchance options"]) & (1 << 0) && in_air(localPlayer)) {
      Ragebot.ForceTargetHitchance(target[i], inAirHitchance);
    }
  }
}

function overrideNoScopeHitchance() {
  var localPlayer = Entity.GetLocalPlayer();
  var weapon = Entity.GetName(Entity.GetWeapon(localPlayer));
  var target = Entity.GetEnemies();

  if (!wep2tab.hasOwnProperty(weapon)) {
    return
  }

  var noScopeHitchance = UI.GetValue(["Rage", "Target", wep2tab[weapon], "noscope hitchance"]);

  for (var i in target) {
    if (UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | hitchance options"]) & (1 << 1) && not_in_scope(localPlayer) && !in_air(localPlayer)) {
      Ragebot.ForceTargetHitchance(target[i], noScopeHitchance);
    }
  }
}

function avoidUnsafeHitboxes() {
  var localPlayer = Entity.GetLocalPlayer();
  var weapon = Entity.GetName(Entity.GetWeapon(localPlayer));
  var target = Entity.GetEnemies();

  if (!wep2tab.hasOwnProperty(weapon)) {
    return
  }

  if (UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | force hitbox safety"]) & (1 << 0)) {
    Ragebot.ForceHitboxSafety(0)
    Ragebot.ForceHitboxSafety(1)
  }
  if (UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | force hitbox safety"]) & (1 << 1)) {
    Ragebot.ForceHitboxSafety(4)
    Ragebot.ForceHitboxSafety(5)
    Ragebot.ForceHitboxSafety(6)
  }
  if (UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | force hitbox safety"]) & (1 << 2)) {
    Ragebot.ForceHitboxSafety(13)
    Ragebot.ForceHitboxSafety(14)
    Ragebot.ForceHitboxSafety(15)
    Ragebot.ForceHitboxSafety(16)
    Ragebot.ForceHitboxSafety(17)
    Ragebot.ForceHitboxSafety(18)
  }
  if (UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | force hitbox safety"]) & (1 << 3)) {
    Ragebot.ForceHitboxSafety(2)
    Ragebot.ForceHitboxSafety(3)
  }
  if (UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | force hitbox safety"]) & (1 << 4)) {
    Ragebot.ForceHitboxSafety(7)
    Ragebot.ForceHitboxSafety(8)
    Ragebot.ForceHitboxSafety(9)
    Ragebot.ForceHitboxSafety(10)
  }
  if (UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | force hitbox safety"]) & (1 << 5)) {
    Ragebot.ForceHitboxSafety(11)
    Ragebot.ForceHitboxSafety(12)
  }
}
function enableForceBody(entity) {
  Ragebot.ForceHitboxSafety(0, entity);
  if (!UI.GetValue(["Rage", "General", "General", "Key assignment", "Force body aim"])) {
    UI.ToggleHotkey(["Rage", "General", "General", "Key assignment", "Force body aim"])
  }
}
function disableForceBody() {
  if (UI.GetValue(["Rage", "General", "General", "Key assignment", "Force body aim"])) {
    UI.ToggleHotkey(["Rage", "General", "General", "Key assignment", "Force body aim"])
  }
}
function enableForceHead(target) {
  for (var i = 2; i <= 18; i++) {
    Ragebot.ForceHitboxSafety(i)
  }

  Ragebot.ForceTargetMinimumDamage(target, getHeadDamage(target));
}
var drawFlag = [];

function forceTargetConditions() {
  const localPlayer = Entity.GetLocalPlayer();
  const weapon = Entity.GetName(Entity.GetWeapon(localPlayer));
  const target = Entity.GetEnemies();

  if (!wep2tab.hasOwnProperty(weapon)) {
    return
  }

  const enabledConditions = UI.GetValue(["Rage", "Target", wep2tab[weapon], "AURORA | force conditions"])

  if (!Entity.IsAlive(localPlayer) || !World.GetServerString()) {
    return
  }

  for (i = 0; i < target.length; i++) {
    if (!Entity.IsAlive(target[i]) || Entity.IsDormant(target[i])) {
      continue
    }
    if (enabledConditions & (1 << 0) && lethalCheck(target[i])) {
      drawFlag[target[i]] = "LETHAL"
      enableForceBody()
    }
    else if (enabledConditions & (1 << 1) && in_air(target[i]) || enabledConditions & (1 << 2) && getInnacurateDelta()) {
      drawFlag[target[i]] = "HEAD"
      enableForceHead(target[i])
    }
    else {
      drawFlag[target[i]] = ""
      disableForceBody()
    }
  }
}

function drawFlags() {
  const selectedFlagType = UI.GetValue(flag_type);
  const localPlayer = Entity.GetLocalPlayer();
  const accentColor = UI.GetColor(global_accents)
  if (!selectedFlagType == 0) {
    return
  }

  if (!Entity.IsAlive(localPlayer)) {
    return
  }

  const target = Entity.GetEnemies();
  const flagFont = Render.GetFont("verdanab.ttf", 9, true);

  for (i = 0; i < target.length; i++) {
    if (!Entity.IsAlive(target[i]) || Entity.IsDormant(target[i])) {
      continue
    }
    const renderPos = Entity.GetRenderBox(target[i]);

    renderX = renderPos[3] - renderPos[1]
    renderX /= 2
    renderX += renderPos[1]


    switch (drawFlag[target[i]]) {
      case "LETHAL":
        Render.ShadowedString(renderX, renderPos[2] - 26, 1, "LETHAL", [160, 196, 255, 255], flagFont)
        break;
      case "HEAD":
        Render.ShadowedString(renderX, renderPos[2] - 26, 1, "HEAD", [255, 173, 173, 255], flagFont)
        break;
      default:
        Render.ShadowedString(renderX, renderPos[2] - 26, 1, "DEFAULT", accentColor, flagFont)
        break;
    }
  }
}
function drawFlagsCM() { // WHY DO ENTITY.DRAWFLAG BE IN CRATEMOVE WHAI
  const selectedFlagType = UI.GetValue(flag_type);
  const localPlayer = Entity.GetLocalPlayer();

  const accentColor = UI.GetColor(global_accents)

  if (!selectedFlagType == 1) {
    return
  }

  if (!Entity.IsAlive(localPlayer)) {
    return
  }

  const target = Entity.GetEnemies();

  for (i = 0; i < target.length; i++) {
    if (!Entity.IsAlive(target[i]) || Entity.IsDormant(target[i])) {
      continue
    }

    switch (drawFlag[target[i]]) {
      case "LETHAL":
        Entity.DrawFlag(target[i], "LETHAL", accentColor);
        break;
      case "HEAD":
        Entity.DrawFlag(target[i], "HEAD", accentColor);
        break;
      default:
        Entity.DrawFlag(target[i], "DEFAULT", accentColor);
        break;
    }
  }
}


function MinDMGOverride() {
  const weapon = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()));
  const target = Entity.GetEnemies();

  if (!wep2tab.hasOwnProperty(weapon)) {
    return
  }

  const overridingDamage = UI.GetValue(["Rage", "General", "General", "Key assignment", "aurora - damage"])
  const dmg = overridingDamage ? UI.GetValue(["Rage", "Target", wep2tab[weapon], "Damage Override"]) : UI.GetValue(["Rage", "Target", wep2tab[weapon], "Minimum damage"])

  for (var i in target) {
    Ragebot.ForceTargetMinimumDamage(target[i], dmg);
  }
}

function renderMindamage() {
  const weapon = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()));

  if (!Entity.IsAlive(Entity.GetLocalPlayer())) {
    return;
  }
  if (!wep2tab.hasOwnProperty(weapon)) {
    return
  }
  const target = Entity.GetEnemies();

  const font = Render.GetFont("Verdanab.ttf", 10, true);

  const x = Render.GetScreenSize()[0];
  const y = Render.GetScreenSize()[1];

  const overridingDamage = UI.GetValue(["Rage", "General", "General", "Key assignment", "aurora - damage"])
  const dmg = UI.GetValue(["Rage", "Target", wep2tab[weapon], "Damage Override"])
  const w = Render.TextSize(String(dmg), font)[0];
  const x = Render.GetScreenSize()[0]
  const y = Render.GetScreenSize()[1];

  if (!wep2tab.hasOwnProperty(weapon)) {
    return
  }

  if (overridingDamage) {
    Render.ShadowedString(x / 2 + 5, y / 2 - 17, 0, String(dmg), [230, 230, 230, 255], font)
  }
}

const dt = {
  shift: 0,
  timeSinceTarget: 0,
  mode: ""
}

function overrideDoubletapSpeed() {
  if (!UI.GetValue(enhance_dt)) {
    return;
  }

  if (UI.GetValue(dt_modes) == 0) {
    SetDTSpeed(0, 14, 16)
    dt.shift = 14
    dt.mode = "fast"
  }
  else if (UI.GetValue(dt_modes) == 1) {
    SetDTSpeed(0, 15, 16)
    dt.shift = 15
    dt.mode = "consistent"

  }
  else if (UI.GetValue(dt_modes) == 2) {
    SetDTSpeed(0, 16, 18)
    dt.shift = 16
    dt.mode = "instant"
  }
  else if (UI.GetValue(dt_modes) == 3) {
    SetDTSpeed(0, 18, 20)
    dt.shift = 18
    dt.mode = "experimental"
  }
}
function canShift(player, weapon, shift) {
  if (weapon == null) {
    return false;
  }

  const tickbase = Entity.GetProp(player, "CCSPlayer", "m_nTickBase")
  const delay = Globals.TickInterval() * (tickbase - shift)

  if (delay + 0.1 < Entity.GetProp(player, "CCSPlayer", "m_flNextAttack")) {
    return false;
  }
  if (delay + 0.1 < Entity.GetProp(weapon, "CBaseCombatWeapon", "m_flNextPrimaryAttack")) {
    return false;
  }
  return true;
}

function DTRecharge() {
  Exploit.EnableRecharge();

  if (!UI.GetValue(enhance_dt)) {
    return;
  }

  const localPlayer = Entity.GetLocalPlayer()
  const localWeapon = Entity.GetWeapon(localPlayer)
  const curTime = Globals.Curtime();

  const doubletap = UI.GetValue(['Rage', 'Exploits', 'Keys', 'Double tap'])
  const getCharge = Exploit.GetCharge();

  if (getCharge != 1) {
    Exploit.EnableRecharge();
  }
  else {
    Exploit.DisableRecharge();
  }
  if (Ragebot.GetTarget() != 0) {
    dt.timeSinceTarget = Globals.Curtime();
  }
  if (!doubletap) {
    Exploit.EnableRecharge();
  }
  else {
    Exploit.DisableRecharge();
  }
  if (Math.abs(dt.timeSinceTarget - curTime) < 0.5 && Math.abs(dt.timeSinceTarget - curTime) > 0.05) {
    return
  }
  if (canShift(localPlayer, localWeapon, 16) && Exploit.GetCharge() != 1) {
    Exploit.DisableRecharge();
    Exploit.Recharge();
  }
}
function onUnload() {
  Exploit.EnableRecharge();
  AntiAim.SetOverride(0);
}
Cheat.RegisterCallback("Unload", "onUnload");

// ragebot enhancements region end

// hud region start

function renderWatermark() {
  if (!UI.GetValue(watermark_enable)) {
    return
  }
  if (!UI.GetValue(indicator_enable) || !Entity.IsAlive(Entity.GetLocalPlayer())) {
    return
  }

  const x = Render.GetScreenSize()[0]
  const y = 10

  const font = Render.GetFont('Verdana.ttf', 11, true)

  const margin = 18
  const padding = 4

  const accentColor = UI.GetColor(global_accents)
  const date = new Date()
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (day < 10) {
    const text = " Aurora | " + username + " | " + year + "-" + month + "-0" + day
  }
  if (month < 10) {
    const text = " Aurora | " + username + " | " + year + "-0" + (month + 1) + "-" + day
  }
  else {
    const text = " Aurora | " + username + " | " + year + "-" + month + "-" + day
  }
  const w = Render.TextSize(text, font)[0]
  const h = Render.TextSize(text, font)[1]

  Render.FilledRect(x - w - margin - padding * 2, margin - padding, w + padding * 2, h + 10, [30, 30, 30, 155]) // background

  Render.FilledRect(x - w - margin - padding * 2, margin - padding, 2, h + 10, accentColor) // accent bar

  Render.String(x - w - margin - padding, margin - 2, 0, text, [255, 255, 255, 230], font)
}

const positioning = {
  x: 10,
  y: 10,
  w: 10,
  h: 10,
}
const animation = {
  time: 0,
  start: 0,
  finish: 0,
  duration: 0,
}

function renderHudIndicator() {
  const accentColor = UI.GetColor(global_accents);

  const margin = 18
  const padding = 4

  const font = Render.GetFont('Verdana.ttf', 11, true)

  const isDrag = Input.IsKeyPressed(0x01);
  const cursorPos = Input.GetCursorPosition();

  const charge = Exploit.GetCharge();

  const doubletap = UI.GetValue(['Rage', 'Exploits', 'Keys', 'Key assignment', 'Double tap'])

  const indicatorCharge = charge
  if (charge < 0.25) {
    indicatorCharge = 0
  }
  else {
    indicatorCharge = charge
  }

  const addLength = "         "
  if (charge < 0.25) {
    addLength = ""
  }
  else {
    addLength = "         "
  }
  const text = "charge: " + addLength + " tickbase: " + dt.shift + " | mode: " + dt.mode

  positioning.w = Render.TextSize(text, font)[0]
  positioning.h = Render.TextSize(text, font)[1]

  if (doubletap) {
    Render.FilledRect(positioning.x, positioning.y, positioning.w + padding * 2, positioning.h + 10, [30, 30, 30, 155])

    Render.FilledRect(positioning.x - 2, positioning.y, 2, (positioning.h + 10) * (indicatorCharge), accentColor)

    Render.GradientRect(positioning.x + 50, positioning.y + positioning.h / 2, 100 * (charge - 0.25) / 2, positioning.h, 1, [accentColor[0], accentColor[1], accentColor[2], 255], [accentColor[0], accentColor[1], accentColor[2], 125])

    Render.String(positioning.x + padding, positioning.y + 2, 0, text, [255, 255, 255, 255], font)
  }

  if (isDrag && UI.IsMenuOpen()) {
    if (inBounds(cursorPos, positioning.x - 25, positioning.y - 25, positioning.w + 25, positioning.h + 25)) {
      positioning.x = cursorPos[0]
      positioning.y = cursorPos[1]
    }
  }
}

function renderIndicators() {
  if (!UI.GetValue(indicator_enable) || !Entity.IsAlive(Entity.GetLocalPlayer())) {
    return
  }

  const x = Render.GetScreenSize()[0]
  const y = Render.GetScreenSize()[1]

  const accentColor = UI.GetColor(global_accents)
  const barColorOne = UI.GetColor(barColorX);
  const barColorTwo = UI.GetColor(barColorY);

  const doubletap = UI.GetValue(['Rage', 'Exploits', 'Keys', 'Key assignment', 'Double tap',])
  const hideshot = UI.GetValue(['Rage', 'Exploits', 'Keys', 'Hide shots'])
  const body_aim = UI.GetValue(['Rage', 'General', 'General', 'Key assignment', 'Force body aim',])
  const freestanding = UI.GetValue(['Rage', 'Anti Aim', 'Directions', 'Auto direction',])
  const inverted = UI.GetValue(['Rage', 'Anti Aim', 'General', 'Key assignment', 'AA Direction inverter',])

  const fontStyleDefault = Render.GetFont("Verdanab.ttf", 9, true)
  const arrowFont = Render.GetFont("Arialbd.ttf", 21, true);

  const DTAndHStext = hideshot ? 'HIDE' : 'DT'
  if (doubletap && hideshot) {
    DTAndHStext = 'DT'
  }

  const fake = Local.GetFakeYaw();
  const real = Local.GetRealYaw();
  const delta = Math.min(Math.abs(normalize_yaw(real - fake) / 2, 60).toFixed(0))

  const date = Date.now() / 1000
  const alpha = Math.abs(Math.sin((date / Math.PI) * 5))

  const manualRightColor = isRight ? [accentColor[0], accentColor[1], accentColor[2], alpha * 255] : [30, 30, 30, 90]
  const manualLeftColor = isLeft ? [accentColor[0], accentColor[1], accentColor[2], alpha * 255] : [30, 30, 30, 90]

  const charge = Exploit.GetCharge();

  Render.AlphaString(x / 2, y / 2 + 23, 1, "AURORA", [accentColor[0], accentColor[1], accentColor[2], alpha * 255], fontStyleDefault);

  Render.ShadowedString(x / 2, y / 2 + 40, 1, DTAndHStext, [184 - 35 * charge, 6 + 178 * charge, 6, 255], fontStyleDefault)

  Render.GradientRect(x / 2, y / 2 + 37, delta, 2, 1, [barColorOne[0], barColorOne[1], barColorOne[2], barColorOne[3]], [barColorTwo[0], barColorTwo[1], barColorTwo[2], barColorTwo[3]])

  Render.GradientRect(x / 2 - delta + 1, y / 2 + 37, delta, 2, 1, [barColorTwo[0], barColorTwo[1], barColorTwo[2], barColorTwo[3]], [barColorOne[0], barColorOne[1], barColorOne[2], barColorOne[3]])

  if (shouldIndicate) {
    Render.AlphaString(x / 2 + 50, y / 2 - 12, 1, ">", manualRightColor, arrowFont)
    Render.AlphaString(x / 2 - 50, y / 2 - 12, 1, "<", manualLeftColor, arrowFont)
  }
}

function on_createmove() {
  globalAntiAim()
  forceTargetConditions()
  drawFlagsCM()

  MinDMGOverride()
  overrideDoubletapSpeed()
  manual_antiaim()
  anti_aim_main()
  updateTime()
  getJitterValue()
  DTRecharge()
  overrideInAirHitchance()
  overrideNoScopeHitchance()
  avoidUnsafeHitboxes()
  handleFreestanding()
}
Cheat.RegisterCallback("CreateMove", "on_createmove");

function on_draw() {
  renderMindamage()
  renderWatermark()
  renderIndicators()
  renderHudIndicator()
  drawFlags()
}
Cheat.RegisterCallback("Draw", "on_draw");
