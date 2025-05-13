let use_huskylens = false
if (use_huskylens) {
    huskylens.initI2c()
    huskylens.initMode(protocolAlgorithm.OBJECTCLASSIFICATION)
}

let score = 0
let advance_score = 0
let is_advanced = false
let question_count = 10
let time_limit = 30
let advance_time = 300
let is_running = false
/** 要確認correct ID */
function check_image_phase1(): boolean {
    for (let id of [3, 4]) {
        //  ✅ 請改為你第一回合的正確圖卡 ID
        if (huskylens.isAppear_s(id)) {
            return true
        }
        
    }
    return false
}

function check_image_phase2(): boolean {
    for (let id of [6, 7]) {
        //  ✅ 請改為你第二回合的正確圖卡 ID
        if (huskylens.isAppear_s(id)) {
            return true
        }
        
    }
    return false
}

function check_image_phase3(): boolean {
    for (let id of [10, 11]) {
        //  ✅ 第二階段用的正確圖卡 ID
        if (huskylens.isAppear_s(id)) {
            return true
        }
        
    }
    return false
}

/** 要確認wrong ID */
// ====================check_wrong_image ID====== 
// ===第一階段wrong====
function check_wrong_image_phase1(shown_ids: number[]): boolean {
    for (let id of [1, 2, 5]) {
        if (huskylens.isAppear_s(id)) {
            if (!(shown_ids.indexOf(id) >= 0)) {
                shown_ids.push(id)
                return true
            }
            
        }
        
    }
    return false
}

function check_wrong_image_phase2(shown_ids: number[]): boolean {
    for (let id of [6, 7]) {
        if (huskylens.isAppear_s(id)) {
            if (!(shown_ids.indexOf(id) >= 0)) {
                shown_ids.push(id)
                return true
            }
            
        }
        
    }
    return false
}

// ============第二階段wrong====
function check_wrong_image_phase3(shown_ids: number[]): boolean {
    for (let id of [8, 9]) {
        if (huskylens.isAppear_s(id)) {
            if (!(shown_ids.indexOf(id) >= 0)) {
                shown_ids.push(id)
                return true
            }
            
        }
        
    }
    return false
}

// ===================第一階段score==================
function display_countdown(seconds: number) {
    let shown_wrong_ids : number[] = []
    for (let i = seconds; i > 0; i += -1) {
        basic.showNumber(i)
        //  每 3 秒辨識一次
        if (i % 3 == 0) {
            huskylens.request()
            if (check_image_phase1()) {
                basic.showString("Good job")
                
                score += 1
                break
            } else if (check_wrong_image_phase1(shown_wrong_ids)) {
                music.playTone(196, music.beat(BeatFraction.Eighth))
                basic.showString("X")
            }
            
        }
        
        basic.pause(1000)
    }
}

function display_countdown_phase2(seconds: number) {
    let shown_wrong_ids : number[] = []
    for (let i = seconds; i > 0; i += -1) {
        basic.showNumber(i)
        if (i % 3 == 0) {
            huskylens.request()
            if (check_image_phase2()) {
                basic.showString("Good job")
                
                score += 1
                break
            } else if (check_wrong_image_phase2(shown_wrong_ids)) {
                music.playTone(196, music.beat(BeatFraction.Eighth))
                basic.showString("X")
            }
            
        }
        
        basic.pause(1000)
    }
}

// ===============第二階段score===================
function display_advance_mode(seconds: number) {
    let shown_wrong_ids : number[] = []
    for (let i = seconds; i > 0; i += -1) {
        basic.showNumber(i)
        if (i % 3 == 0) {
            huskylens.request()
            if (check_image_phase3()) {
                basic.showString("Good job")
                
                advance_score += 5
            } else if (check_wrong_image_phase2(shown_wrong_ids)) {
                music.playTone(196, music.beat(BeatFraction.Eighth))
                basic.showString("X")
            }
            
        }
        
        basic.pause(1000)
    }
}

// ======================第一階段QUIZ===============
function start_quiz() {
    let i: number;
    
    is_advanced = false
    score = 0
    for (i = 1; i < 7; i++) {
        //  再生能源
        basic.showString("Q" + ("" + i))
        display_countdown(time_limit)
    }
    for (i = 7; i < 12; i++) {
        //  非再生能源
        basic.showString("Q" + ("" + i))
        display_countdown_phase2(time_limit)
    }
    basic.showString("Score:")
    basic.showNumber(score)
}

// ======================第二階段QUIZ==============
function start_advanced() {
    
    is_advanced = true
    advance_score = 0
    display_advance_mode(advance_time)
    // 300秒
    basic.showString("AdvScore:")
    basic.showNumber(advance_score)
    basic.showString("Total:")
    basic.showNumber(score + advance_score)
}

// ============按鍵==============
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (is_running) {
        return
    }
    
    is_running = true
    basic.clearScreen()
    let start_text = "START!"
    let start_tones = [262, 294, 330, 349, 392, 440]
    //  C4 ~ A4 對應每個字
    for (let i = 0; i < start_text.length; i++) {
        basic.showString(start_text[i])
        music.playTone(start_tones[i], music.beat(BeatFraction.Eighth))
        basic.pause(100)
    }
    basic.pause(500)
    start_quiz()
    is_running = false
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    if (is_running) {
        return
    }
    
    is_running = true
    basic.clearScreen()
    let adv_text = "START!"
    let adv_tones = [220, 196, 175, 165]
    for (let i = 0; i < adv_text.length; i++) {
        basic.showString(adv_text[i])
        music.playTone(adv_tones[i], music.beat(BeatFraction.Eighth))
        basic.pause(100)
    }
    basic.pause(500)
    start_advanced()
    is_running = false
})
