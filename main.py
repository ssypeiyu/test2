use_huskylens = False
if use_huskylens:
    huskylens.init_i2c()
    huskylens.init_mode(protocolAlgorithm.OBJECTCLASSIFICATION)

score = 0
advance_score = 0
is_advanced = False
question_count = 10
time_limit = 30
advance_time = 300
is_running = False

"""
要確認correct ID
"""
def check_image_phase1():
    for id in [3, 4]:  # ✅ 請改為你第一回合的正確圖卡 ID
        if huskylens.isAppear_s(id):
            return True
    return False

def check_image_phase2():
    for id in [6, 7]:  # ✅ 請改為你第二回合的正確圖卡 ID
        if huskylens.isAppear_s(id):
            return True
    return False

def check_image_phase3():
    for id in [10, 11]:  # ✅ 第二階段用的正確圖卡 ID
        if huskylens.isAppear_s(id):
            return True
    return False
"""
要確認wrong ID
"""

#====================check_wrong_image ID====== 
#===第一階段wrong====
def check_wrong_image_phase1(shown_ids: List[number]) -> bool:
    for id in [1, 2, 5]: 
        if huskylens.isAppear_s(id):
            if not id in shown_ids:
                shown_ids.append(id)
                return True
    return False

def check_wrong_image_phase2(shown_ids: List[number]) -> bool:
    for id in [6, 7]: 
        if huskylens.isAppear_s(id):
            if not id in shown_ids:
                shown_ids.append(id)
                return True
    return False   
#============第二階段wrong====
def check_wrong_image_phase3(shown_ids: List[number]) -> bool:
    for id in [8, 9]:
        if huskylens.isAppear_s(id):
            if not id in shown_ids:
                shown_ids.append(id)
                return True
    return False

#===================第一階段score==================
def display_countdown(seconds: number):
    shown_wrong_ids: List[number] = []

    for i in range(seconds, 0, -1):
        basic.show_number(i)

        # 每 3 秒辨識一次
        if i % 3 == 0:
            huskylens.request()

            if check_image_phase1():
                basic.show_string("Good job")
                global score
                score += 1
                break

            elif check_wrong_image_phase1(shown_wrong_ids):
                music.play_tone(196, music.beat(BeatFraction.EIGHTH))
                basic.show_string("X")

        basic.pause(1000)

def display_countdown_phase2(seconds: number):
    shown_wrong_ids: List[number] = []

    for i in range(seconds, 0, -1):
        basic.show_number(i)

        if i % 3 == 0:
            huskylens.request()

            if check_image_phase2():
                basic.show_string("Good job")
                global score
                score += 1
                break

            elif check_wrong_image_phase2(shown_wrong_ids):
                music.play_tone(196, music.beat(BeatFraction.EIGHTH))
                basic.show_string("X")

        basic.pause(1000)


#===============第二階段score===================
def display_advance_mode(seconds: number):
    shown_wrong_ids: List[number] = []

    for i in range(seconds, 0, -1):
        basic.show_number(i)

        if i % 3 == 0:
            huskylens.request()

            if check_image_phase3():
                basic.show_string("Good job")
                global advance_score
                advance_score += 5

            elif check_wrong_image_phase2(shown_wrong_ids):
                music.play_tone(196, music.beat(BeatFraction.EIGHTH))
                basic.show_string("X")

        basic.pause(1000)

#======================第一階段QUIZ===============
def start_quiz():
    global is_advanced, score
    is_advanced = False
    score = 0

    for i in range(1, 7):  # 再生能源
        basic.show_string("Q" + str(i))
        display_countdown(time_limit)

    for i in range(7, 12):  # 非再生能源
        basic.show_string("Q" + str(i))
        display_countdown_phase2(time_limit)

    basic.show_string("Score:")
    basic.show_number(score)

#======================第二階段QUIZ==============
def start_advanced():
    global is_advanced, advance_score
    is_advanced = True
    advance_score = 0
    display_advance_mode(advance_time)  #300秒

    basic.show_string("AdvScore:")
    basic.show_number(advance_score)

    basic.show_string("Total:")
    basic.show_number(score + advance_score)

#============按鍵==============
def on_button_pressed_a():
    global is_running
    if is_running:
        return
    is_running = True

    basic.clear_screen()

    start_text = "START!"
    start_tones = [262, 294, 330, 349, 392, 440]  # C4 ~ A4 對應每個字

    for i in range(len(start_text)):
        basic.show_string(start_text[i])
        music.play_tone(start_tones[i], music.beat(BeatFraction.EIGHTH))
        basic.pause(100)

    basic.pause(500)
    start_quiz()
    is_running = False


def on_button_pressed_ab():
    global is_running
    if is_running:
        return
    is_running = True

    basic.clear_screen()

    adv_text = "START!"
    adv_tones = [220, 196, 175, 165]  

    for i in range(len(adv_text)):
        basic.show_string(adv_text[i])
        music.play_tone(adv_tones[i], music.beat(BeatFraction.EIGHTH))
        basic.pause(100)

    basic.pause(500)
    start_advanced()
    is_running = False

input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.AB, on_button_pressed_ab)