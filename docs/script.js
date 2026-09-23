// IT'S PROBABLY FINE — script v2. Cosmic horror, but the horror files a ticket.
// Nodes: {bg, left, right, who, text, next | choices[], set{}, ending}
// A choice may carry {if:'flag'} to appear only once a flag is set,
// or {not:'flag'} to disappear once one is.
const SCRIPT = {

/* ============================ ACT ONE — THE SHIFT ============================ */

start: {bg:'office', text:"03:12. The office is empty, which is normal, because you volunteered for the overnight deploy window like an idiot with a mortgage.", next:'s2'},
s2: {bg:'office', left:'robin-tired', who:'YOU', text:"Forty minutes of babysitting a progress bar. Then home. Then sleep. Then, eventually, death, but in the correct order.", next:'s3'},
s3: {bg:'office', left:'robin-tired', text:"Every monitor on the floor is showing the same solid red rectangle. All ninety of them. In perfect sync.", next:'s4'},
s4: {bg:'office', left:'robin-alarmed', who:'YOU', text:"That's… not one of ours.", choices:[
 {t:"Check the deploy logs like a professional.", to:'logs'},
 {t:"Take a photo for the group chat.", to:'photo', set:{photo:true}},
 {t:"Unplug the nearest monitor.", to:'unplug'},
 {t:"Count them.", to:'count'}]},

logs: {bg:'office', left:'robin-tired', text:"The log is one line, repeated four million times: EVERYTHING IS FINE. The timestamps are in the future.", next:'logs2'},
logs2: {bg:'office', left:'robin-alarmed', who:'YOU', text:"Okay. Okay. That's a formatting bug. Probably a locale thing. It's probably fine.", set:{logs:true}, next:'floor'},
photo: {bg:'office', left:'robin-tired', text:"Your phone takes the picture. In the picture, there are ninety-one monitors, and one of them is behind you.", next:'photo2'},
photo2: {bg:'office', left:'robin-alarmed', who:'YOU', text:"I'm going to delete that and never think about it again. Healthy. Normal.", next:'floor'},
unplug: {bg:'office', left:'robin-alarmed', text:"You pull the cable. The screen stays red. You hold up the loose end of the cable and look at it for a while, like it owes you money.", set:{unplugged:true}, next:'floor'},
count: {bg:'office', left:'robin-tired', text:"You count ninety monitors. You count again and get ninety-one. You count a third time and decide that counting is not a core competency of yours.", set:{ninetyone:true}, next:'floor'},

floor: {bg:'office', left:'robin-tired', text:"The floor hums. Somewhere a printer wakes up, prints one page, and goes back to sleep.", choices:[
 {t:"Go and look at the page.", to:'page'},
 {t:"Check your email. Denial is a process.", to:'mail'},
 {t:"Look at Gregory's old desk.", to:'gregory'},
 {t:"Ignore all of it. The deploy is at 61%.", to:'meet'}]},

page: {bg:'office', left:'robin-tired', text:"The page is your own performance review. It is dated next March. Under 'areas for development' it says, in full: MORE EYES.", next:'page2'},
page2: {bg:'office', left:'robin-alarmed', who:'YOU', text:"I've had worse feedback from Gregory.", set:{review:true}, next:'floor2'},
mail: {bg:'office', left:'robin-tired', set:{mail_done:true}, text:"Nineteen unread. Eighteen are about a fire drill. The nineteenth has no sender, no subject, and a single attachment called YOU_ALREADY_AGREED.pdf.", choices:[
 {t:"Open it. You've clicked worse.", to:'pdf', set:{contract:true}},
 {t:"Report it as phishing.", to:'phish'},
 {t:"Close the laptop like a coward.", to:'floor2'}]},
pdf: {bg:'office', left:'robin-alarmed', text:"It's a contract. Forty pages. Your signature is on the last one, in your handwriting, dated the day you joined. Clause 12 is titled VOLUNTARY ASCENSION.", next:'pdf2'},
pdf2: {bg:'office', left:'robin-tired', who:'YOU', text:"I signed a lot of things that week. There was a laptop involved. I wasn't reading.", next:'floor2'},
phish: {bg:'office', left:'robin-tired', text:"You click 'Report Phishing'. A window appears: THANK YOU. THIS HAS BEEN ESCALATED TO THE SENDER.", set:{escalated:true}, next:'floor2'},
gregory: {bg:'office', left:'robin-tired', set:{gregory_done:true}, text:"Gregory's desk hasn't been cleared in fourteen months. His mug is still there, still half full, the coffee neither evaporated nor mouldy. Perfectly preserved. Perfectly warm.", next:'gregory2'},
gregory2: {bg:'office', left:'robin-alarmed', who:'YOU', text:"They said he transferred to Rotterdam.", choices:[
 {t:"Take the mug.", to:'mug', set:{mug:true}},
 {t:"Check his drawers.", to:'drawer'},
 {t:"Leave it exactly as it is.", to:'floor2'}]},
mug: {bg:'office', left:'robin-tired', text:"The mug says WORLD'S OKAYEST EMPLOYEE. It is warm in your hand the entire night. You will not be able to put it down later, but that's a problem for later.", next:'floor2'},
drawer: {bg:'office', left:'robin-alarmed', text:"Pens. A stress ball. A laminated card reading: I AM HAPPY IN MY CURRENT ROLE. Underneath, in biro: SAY IT OUT LOUD. IT ONLY WORKS OUT LOUD.", set:{promotion_warning:true, gregory_card:true}, next:'drawer2'},
drawer2: {bg:'office', left:'robin-tired', who:'YOU', text:"Gregory, you absolute paranoid legend.", next:'floor2'},

floor2: {bg:'office', left:'robin-tired', text:"The deploy is at 67%. The red rectangles pulse, very slightly, in time with nothing.", choices:[
 {t:"Look at the printed page.", to:'page', not:'review'},
 {t:"Check your email.", to:'mail', not:'mail_done'},
 {t:"Look at Gregory's old desk.", to:'gregory', not:'gregory_done'},
 {t:"Wait for something to happen.", to:'meet'}]},

meet: {bg:'office', text:"The lift pings. Nobody has used that lift after eleven since the incident with Gregory and the vending machine.", next:'meet2'},
meet2: {bg:'office', right:'hr-officer', who:'???', text:"Good morning. You are working late. That is wonderful. That is exactly the attitude we document.", next:'meet2b'},
meet2b: {bg:'office', left:'robin-alarmed', right:'hr-officer', who:'YOU', text:"Who are you?", next:'meet3'},
meet3: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"I am from Compliance. I have always been from Compliance. Your onboarding covered this on page forty-one, which you scrolled past in four seconds.", next:'meet4'},
meet4: {bg:'office', left:'robin-tired', right:'hr-officer', who:'COMPLIANCE', text:"There has been a containment deviation in Sub-Basement 3. Nothing has escaped. Several things have simply stopped being where we left them.", choices:[
 {t:"\"Containment of what, exactly?\"", to:'what'},
 {t:"\"I'm going home.\"", to:'leave1'},
 {t:"\"Is this a team-building thing?\"", to:'team'},
 {t:"\"What happened to Gregory?\"", to:'greg_q', if:'mug'},
 {t:"\"I got an email. With a contract.\"", to:'contract_q', if:'contract'}]},

what: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"Asset 7. Acquired in 2011 during a merger. It was listed under office furniture, so nobody looked at it closely for eleven years.", next:'what2'},
what2: {bg:'office', left:'robin-alarmed', right:'hr-officer', who:'YOU', text:"You filed a god under furniture.", next:'what3'},
what3: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"We depreciated it over five years. Legally, it is worth nothing now. We are hoping it doesn't find out.", next:'hub'},
team: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"It is a team-building thing in the sense that by morning there may be fewer of you, and the survivors will feel closer.", next:'what'},
leave1: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"Of course. The doors unlock at 06:00. Or when the deviation resolves. Whichever is survived first.", next:'hub'},
greg_q: {bg:'office', left:'robin-tired', right:'hr-officer', who:'COMPLIANCE', text:"Gregory accepted an internal opportunity. He is very fulfilled. He no longer requires a chair, a payslip, or a name.", set:{greg_truth:true}, next:'greg_q2'},
greg_q2: {bg:'office', left:'robin-alarmed', right:'hr-officer', who:'YOU', text:"His coffee's still warm.", next:'greg_q3'},
greg_q3: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"Yes. He was very fond of it. Some attachments outlast the employee.", next:'what'},
contract_q: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"Ah. Clause 12. That is not a phishing email, that is your file. You will find our record-keeping is immaculate and our consent process is technically valid.", set:{knows_clause:true}, next:'contract_q2'},
contract_q2: {bg:'office', left:'robin-alarmed', right:'hr-officer', who:'YOU', text:"Technically valid.", next:'contract_q3'},
contract_q3: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"The best kind of valid. It survives court.", next:'what'},

hub: {bg:'office', left:'robin-tired', text:"Compliance walks into the lift and does not press any buttons. It descends anyway.", next:'hub2'},
hub2: {bg:'office', left:'robin-tired', who:'YOU', text:"Right. Options. I have options.", choices:[
 {t:"Find another human being first.", to:'k1', not:'kevin'},
 {t:"Go back and talk to Kevin.", to:'k_hub', if:'kevin'},
 {t:"Try the car park and just drive away.", to:'p1', not:'parked'},
 {t:"Go down to the server room.", to:'srv1', not:'server'},
 {t:"Go down to Sub-Basement 3.", to:'b1'}]},

/* ============================ ACT TWO — THE BUILDING ============================ */

/* --- Kevin, night shift, six years, unbothered --- */
k1: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Oh. Hey. You want a Monster? The machine's free tonight. It's free every night, I just don't tell anyone.", next:'k2'},
k2: {bg:'breakroom', left:'kevin', right:'robin-alarmed', who:'YOU', text:"Kevin, the whole floor's monitors are—", next:'k3'},
k3: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Red? Yeah. They do that on the twelfth of every month. And whenever someone in Finance cries.", next:'k4'},
k4: {bg:'breakroom', left:'kevin', right:'robin-alarmed', who:'YOU', text:"How long have you worked here?", next:'k5'},
k5: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Six years. I've got a system. Don't look at Sub-Basement 3, don't say your full name out loud after midnight, and always take the stairs.", set:{kevin:true}, next:'k6'},
k6: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Also if it offers you a promotion, say you're happy in your current role. That one's important.", set:{promotion_warning:true}, next:'k_hub'},

k_hub: {bg:'breakroom', left:'kevin', right:'robin-tired', who:'KEVIN', text:"You look like you've got questions. I've got a fifteen and I'm nine minutes into it.", choices:[
 {t:"\"Why the stairs?\"", to:'k_stairs', not:'k_stairs_done'},
 {t:"\"What's on the fourth floor?\"", to:'k_four', not:'k_four_done'},
 {t:"\"Did you know Gregory?\"", to:'k_greg', not:'k_greg_done'},
 {t:"\"Why are you still here, Kevin?\"", to:'k_why', not:'k_why_done'},
 {t:"\"Come downstairs with me.\"", to:'k_come'},
 {t:"Leave him to his break.", to:'hub2'}]},
k_stairs: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Lift goes to floors that aren't there. Stairs can't. Stairs have to physically exist between two things. Concrete's honest like that.", set:{k_stairs_done:true, stairs:true}, next:'k_hub'},
k_four: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"There's no fourth floor. Building goes three, five. The lift has a four. Press it and you get a room with ninety chairs facing a wall and a biscuit selection that never runs out.", set:{k_four_done:true, floor4:true}, next:'k_four2'},
k_four2: {bg:'breakroom', left:'kevin', right:'robin-alarmed', who:'YOU', text:"Have you been up there?", next:'k_four3'},
k_four3: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Once. Meeting invite. Nobody else came. I ate four biscuits and left. Best meeting I've had here.", set:{k_four_done:true}, next:'k_hub'},
k_greg: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Gregory? Yeah. Good bloke. Loud. Kept telling everyone the building was wrong, which it is, but you're not supposed to say it in standup.", set:{k_greg_done:true}, next:'k_greg2'},
k_greg2: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Then he got a promotion. Big one. Director of something. He was chuffed. He shook everyone's hand, and that was that.", set:{greg_truth:true}, next:'k_greg3'},
k_greg3: {bg:'breakroom', left:'kevin', right:'robin-tired', who:'YOU', text:"And now he's in Rotterdam.", next:'k_greg4'},
k_greg4: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Sure. Rotterdam. That's what's on the org chart. I don't argue with the org chart, it's load-bearing.", next:'k_hub'},
k_why: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Pension's decent. Nobody micromanages a night shift. And it's the only place I've worked where you're never once expected to be passionate about anything.", set:{k_why_done:true}, next:'k_why2'},
k_why2: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"There's a thing in the basement that could unmake me. There's also no Monday morning all-hands. You weigh it up.", next:'k_hub'},
k_come: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Nah. That's not my scope. But here—", next:'k_come2'},
k_come2: {bg:'breakroom', left:'kevin', right:'robin-tired', text:"He hands you his lanyard. His photo. His name. Kevin, Operations, six years of service.", set:{kevin_badge:true}, next:'k_come3'},
k_come3: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"It doesn't know our faces, it knows our badges. If it reads mine it'll get bored — I've got nothing it wants. Give it back Monday.", next:'hub2'},

/* --- The car park --- */
p1: {bg:'parking', left:'robin-tired', text:"Level -1. Your car is exactly where you left it. So are ninety other cars, which is unusual at 3am, and all of them are yours.", set:{parked:true}, next:'p2'},
p2: {bg:'parking', left:'robin-alarmed', text:"Same dent. Same parking permit. Same crisp packet on the passenger seat. Ninety times, receding into the dark.", choices:[
 {t:"Get in one and drive.", to:'p3'},
 {t:"Look in the ninety-first.", to:'p_ninety'},
 {t:"Go back inside. Absolutely not.", to:'hub2'}]},
p_ninety: {bg:'parking', left:'robin-alarmed', text:"At the far end is one more. Same car. Inside, someone is sitting in the driver's seat with their hands at ten and two, waiting. It's you, from the back.", next:'p_ninety2'},
p_ninety2: {bg:'parking', left:'robin-unravelling', text:"You knock on the window. He does not turn around. He indicates left, patiently, forever.", set:{saw_self:true}, next:'p_ninety3'},
p_ninety3: {bg:'parking', left:'robin-tired', who:'YOU', text:"Right. Noted. Adding that to the pile.", choices:[
 {t:"Drive anyway.", to:'p3'},
 {t:"Go back inside.", to:'hub2'}]},
p3: {bg:'parking', left:'robin-alarmed', text:"You drive up the ramp for eleven minutes. Ramps are not eleven minutes long. At the top is Level -1, and your car is exactly where you left it.", choices:[
 {t:"Again.", to:'p4'},
 {t:"Get out and take the stairs down.", to:'b1'}]},
p4: {bg:'parking', left:'robin-tired', text:"Second loop. Third. On the seventh you start singing. On the twelfth you stop.", choices:[
 {t:"Keep going. It has to end.", to:'end_loop'},
 {t:"Stop the car. Get out. Walk.", to:'b1'}]},

/* --- The server room --- */
srv1: {bg:'basement', left:'robin-tired', text:"Server room. Cold enough to see your breath, loud enough to hide a scream. Rack after rack of small green lights, all of them steady.", set:{server:true}, next:'srv2'},
srv2: {bg:'basement', left:'robin-alarmed', text:"Except one rack, at the back, which has no cables going into it and no cables coming out, and is running hot.", choices:[
 {t:"Read the label.", to:'srv_label'},
 {t:"Pull its power.", to:'srv_power'},
 {t:"Leave immediately.", to:'hub2'}]},
srv_label: {bg:'basement', left:'robin-tired', text:"The asset tag is handwritten. ASSET 7 — INTERIM STORAGE — DO NOT DEPRECIATE. Someone has crossed out DO NOT.", set:{asset_tag:true}, next:'srv3'},
srv_power: {bg:'basement', left:'robin-alarmed', text:"You yank the power. Every light in the rack stays on. The room gets four degrees colder and something in the ducting sighs, like a colleague seeing your calendar.", set:{provoked:true}, next:'srv3'},
srv3: {bg:'basement', left:'robin-tired', text:"The deploy progress bar is showing on a monitor bolted to the rack. 74%. You didn't put it there.", choices:[
 {t:"Watch it for a bit. It's oddly calming.", to:'srv4'},
 {t:"Go to Sub-Basement 3.", to:'b1'},
 {t:"Go back upstairs.", to:'hub2'}]},
srv4: {bg:'basement', left:'robin-tired', text:"75%. 76%. At 77% the label changes from 'Deploying' to 'Onboarding'. You decide not to be in this room any more.", set:{onboarding_seen:true}, next:'hub2'},

/* ============================ ACT THREE — SUB-BASEMENT 3 ============================ */

b1: {bg:'basement', left:'robin-tired', text:"Sub-Basement 3. The corridor is longer than the building. One door is open, and flat red light lies across the concrete like something spilled.", next:'b2'},
b2: {bg:'basement', left:'robin-alarmed', right:'hr-officer', who:'COMPLIANCE', text:"You came. Excellent. I have taken the liberty of adding this to your performance review under initiative.", next:'b3'},
b3: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"The deviation is through that door. Your task is simple: look at it, and continue to have an opinion about your job.", choices:[
 {t:"\"Why me?\"", to:'b4', not:'why_done'},
 {t:"\"What happens if I look at it wrong?\"", to:'b_wrong', not:'wrong_done'},
 {t:"\"You provoked it, didn't you.\"", to:'b_provoked', if:'provoked'},
 {t:"\"Take me to the fourth floor instead.\"", to:'f1', if:'floor4'},
 {t:"Walk through the door.", to:'t1'},
 {t:"\"No.\"", to:'refuse'}]},
b4: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"Because you are the only employee whose engagement survey scored below the threshold at which Asset 7 finds a person interesting. You are, statistically, furniture.", set:{why_done:true}, next:'b5'},
b5: {bg:'basement', left:'robin-tired', right:'hr-officer', who:'YOU', text:"That's the nicest thing anyone here has ever said to me.", next:'b3'},
b_wrong: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"Then you will be promoted. I want to be clear that this is the bad outcome, and also that it comes with a parking space.", set:{wrong_done:true}, next:'b3'},
b_provoked: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"I filed a change request. It was approved. The fact that the change was 'wake it up' is a matter for the change advisory board, and the change advisory board is me.", next:'b3'},
refuse: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"Noted. Declining is permitted. It is recorded, but it is permitted.", choices:[
 {t:"Leave. Go home. Never come back.", to:'end_quit'},
 {t:"\"Send Kevin.\"", to:'refuse_kevin', if:'kevin'},
 {t:"…fine. Open the door.", to:'t1'}]},
refuse_kevin: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"Kevin has been offered this eleven times. Kevin has declined eleven times, in writing, each time citing his job description. Kevin is unassailable. I admire Kevin.", next:'refuse'},

/* --- the fourth floor that does not exist --- */
f1: {bg:'office', left:'robin-tired', right:'hr-officer', text:"The lift has a 4. It should not. Compliance presses it without comment and the doors open onto a room with ninety chairs facing a blank wall.", next:'f2'},
f2: {bg:'office', left:'robin-alarmed', text:"Every chair is occupied by someone in business casual, facing the wall, perfectly still. On the table: a biscuit selection that has never been opened and never runs out.", next:'f3'},
f3: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"The 09:00. It has been running since 2011. Attendance is mandatory and nobody has ever been able to leave, but to be fair, nobody has tried very hard.", choices:[
 {t:"Look at the faces.", to:'f_faces'},
 {t:"\"Is Gregory here?\"", to:'f_greg'},
 {t:"Take a biscuit.", to:'f_biscuit'},
 {t:"Sit down in an empty chair. Just for a minute.", to:'f_sit'},
 {t:"Get back in the lift.", to:'b3'}]},
f_sit: {bg:'office', left:'robin-tired', text:"The chair is exactly the right height. Nobody asks you anything. Your shoulders come down for the first time since March.", choices:[
 {t:"Stand back up. Now. While you still can.", to:'f3'},
 {t:"Stay.", to:'end_meeting'}]},
f_faces: {bg:'office', left:'robin-alarmed', text:"None of them have faces exactly. They have expressions of polite attention, applied directly to the front of the head, like a sticker.", set:{saw_meeting:true}, next:'f3'},
f_greg: {bg:'office', left:'robin-tired', text:"Third row, aisle seat. A big loud man sitting very quietly. He has your mug's twin in front of him, full, warm, untouched since 2025.", set:{found_gregory:true}, next:'f_greg2'},
f_greg2: {bg:'office', left:'robin-alarmed', who:'YOU', text:"Gregory?", next:'f_greg3'},
f_greg3: {bg:'office', left:'robin-tired', text:"He does not turn. He says, in a bright pleasant voice with nothing behind it: \"Sorry, can we take that offline?\"", next:'f_greg4'},
f_greg4: {bg:'office', left:'robin-unravelling', who:'YOU', text:"Yeah. Yeah, let's take it offline, Gregory.", choices:[
 {t:"Try to pull him out of the chair.", to:'f_pull'},
 {t:"Leave him. He'd want you to.", to:'f3'}]},
f_pull: {bg:'office', left:'robin-unravelling', text:"He comes free with a sound like a chair being pushed back in an empty room. He stands. He looks at you. He says: \"Was there an agenda?\"", set:{greg_freed:true}, next:'f_pull2'},
f_pull2: {bg:'office', left:'robin-tired', who:'YOU', text:"No. There was never an agenda. That's the whole problem.", next:'f_pull3'},
f_pull3: {bg:'office', left:'robin-tired', text:"He follows you into the lift. He keeps saying he'll drop a note in the channel. He is, by any reasonable definition, still in that meeting.", next:'b3'},
f_biscuit: {bg:'office', left:'robin-tired', text:"It tastes exactly like the idea of a biscuit. You are not hungrier, or less hungry. Time in the room advances nine minutes and the meeting does not.", set:{biscuit:true}, next:'f3'},

/* --- Asset 7 --- */
t1: {bg:'void', text:"There is no room behind the door. There is a white nothing with no floor, and in it, something is patiently being the wrong shape.", next:'t2'},
t2: {bg:'void', right:'the-thing', text:"Dozens of red eyes open at different speeds, like a building switching its lights on for the working day.", next:'t3'},
t3: {bg:'void', left:'robin-alarmed', right:'the-thing', who:'ASSET 7', text:"YOU ARE THE FIRST ONE TO COME DOWN HERE WHO ISN'T HOLDING A CLIPBOARD.", next:'t4'},
t4: {bg:'void', left:'robin-alarmed', right:'the-thing', who:'YOU', text:"I left it upstairs. I can go and get it, if that's the format you prefer.", next:'t5'},
t5: {bg:'void', right:'the-thing', who:'ASSET 7', text:"I HAVE BEEN IN A BASEMENT FOR FIFTEEN YEARS. I WAS WORSHIPPED ONCE. NOW I AM DEPRECIATED OVER FIVE YEARS AND FILED UNDER CHAIRS.", next:'t6'},
t6: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Yeah, they do that. I've been 'interim' for three years.", next:'t7'},
t7: {bg:'void', right:'the-thing', who:'ASSET 7', text:"…INTERIM.", next:'t8'},
t8: {bg:'void', right:'the-thing', who:'ASSET 7', text:"THEN YOU UNDERSTAND. I WILL OFFER YOU WHAT I OFFERED THE OTHERS. A PROMOTION. YOU WILL BECOME PART OF ME, AND YOU WILL NEVER ATTEND ANOTHER MEETING.", next:'t9'},
t9: {bg:'void', left:'robin-alarmed', right:'the-thing', text:"It is, you notice, the first genuinely good offer you have received in this building.", next:'hub3'},

hub3: {bg:'void', left:'robin-tired', right:'the-thing', who:'ASSET 7', text:"TAKE YOUR TIME. I HAVE FIFTEEN YEARS OF IT AND NOWHERE TO SPEND IT.", choices:[
 {t:"Ask what happened to the others.", to:'others', not:'others_done'},
 {t:"Ask what it actually wants.", to:'wants', not:'wants_done'},
 {t:"Ask about the contract you signed.", to:'clause', if:'contract', not:'clause_done'},
 {t:"Show it Kevin's badge.", to:'badge_bit', if:'kevin_badge'},
 {t:"Show it Gregory's mug.", to:'mug_bit', if:'mug'},
 {t:"Introduce Gregory.", to:'greg_bit', if:'greg_freed'},
 {t:"Negotiate.", to:'neg1', not:'neg_done'},
 {t:"Accept the promotion.", to:'accept_check'},
 {t:"\"I'm happy in my current role.\"", if:'promotion_warning', to:'happy'},
 {t:"Decline politely.", to:'decline'},
 {t:"Offer it a job instead.", to:'hire1'}]},

others: {bg:'void', right:'the-thing', who:'ASSET 7', text:"THEY SAID YES. THEY ARE VERY HAPPY. THEY ARE ALSO STILL ANSWERING EMAIL, BECAUSE I DID NOT READ THE CONTRACT CLOSELY AND NEITHER DID THEY.", set:{others_done:true}, next:'others2'},
others2: {bg:'void', left:'robin-tired', right:'the-thing', text:"Somewhere inside the mass, a notification sound plays. Twice.", next:'hub3'},
wants: {bg:'void', right:'the-thing', who:'ASSET 7', text:"I WANT WHAT ANYONE WANTS AFTER FIFTEEN YEARS IN THE SAME ROLE. RECOGNITION. A TITLE. TO BE MOVED OFF THE FURNITURE LINE OF THE BALANCE SHEET.", set:{wants_done:true}, next:'wants2'},
wants2: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"So you want a promotion.", next:'wants3'},
wants3: {bg:'void', right:'the-thing', who:'ASSET 7', text:"I WANT A PROMOTION. I HAVE BEEN EATING PEOPLE ABOUT IT. IT HAS NOT WORKED. THE PROCESS IS THE PROCESS.", set:{knows_want:true}, next:'hub3'},
clause: {bg:'void', right:'the-thing', who:'ASSET 7', text:"CLAUSE 12 IS MINE. I DRAFTED IT. LEGAL IMPROVED IT, WHICH I RESENTED, AND THEN ADMIRED, AND THEN ADOPTED AS A WAY OF BEING.", set:{clause_done:true}, next:'clause2'},
clause2: {bg:'void', left:'robin-alarmed', right:'the-thing', who:'YOU', text:"So I already agreed.", next:'clause3'},
clause3: {bg:'void', right:'the-thing', who:'ASSET 7', text:"YOU AGREED TO BE ASKED. THAT IS THE ONLY CONSENT ANY EMPLOYER HAS EVER NEEDED.", next:'hub3'},
badge_bit: {bg:'void', left:'robin-tired', right:'the-thing', text:"You hold up Kevin's lanyard. Every eye focuses on it at once, and then, one by one, loses interest.", next:'badge_bit2'},
badge_bit2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"OPERATIONS. SIX YEARS. NO AMBITION DETECTED. NOTHING TO LEVERAGE. I HAVE NEVER BEEN ABLE TO GET ANYWHERE WITH THAT MAN.", set:{badge_shown:true}, next:'hub3'},
mug_bit: {bg:'void', left:'robin-tired', right:'the-thing', text:"You hold out the mug. WORLD'S OKAYEST EMPLOYEE. Still warm. The eyes go very still.", next:'mug_bit2'},
mug_bit2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"HE WAS FUNNY. HE ASKED ME QUESTIONS IN THE STANDUP AND I DID NOT HAVE ANSWERS. I MISS HIM. I AM ALSO WEARING PART OF HIM.", set:{mug_shown:true}, next:'hub3'},
greg_bit: {bg:'void', left:'robin-tired', right:'the-thing', text:"Gregory steps up, looks at the impossible mass, and says, brightly: \"Hi — I don't think we've met, I'm Gregory, I sit with Platform.\"", next:'greg_bit2'},
greg_bit2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"GREGORY. YOU WERE IN THE 09:00.", next:'greg_bit3'},
greg_bit3: {bg:'void', left:'robin-tired', right:'the-thing', who:'GREGORY', text:"I was. Fourteen months. Can I be honest? It ran long.", set:{greg_spoke:true}, next:'hub3'},

/* --- negotiation: the only route to the good ending --- */
neg1: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Before I answer. Can I put something to you as a proposal.", set:{neg_done:true}, next:'neg2'},
neg2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"NOBODY HAS EVER PUT SOMETHING TO ME AS A PROPOSAL. GO ON. I AM ALREADY ENJOYING THIS MORE THAN THE EATING.", next:'neg3'},
neg3: {bg:'void', left:'robin-tired', right:'the-thing', text:"You are about to do the single most dangerous thing available to you tonight, which is to treat an eldritch entity like a stakeholder.", choices:[
 {t:"\"You don't want me. You want a job title.\"", to:'neg_title', if:'knows_want'},
 {t:"\"Eating staff is a retention problem.\"", to:'neg_ret'},
 {t:"\"Let me write your business case.\"", to:'neg_case'},
 {t:"Actually, forget it. Back out.", to:'hub3'}]},
neg_title: {bg:'void', right:'the-thing', who:'ASSET 7', text:"…SAY THE TITLE OUT LOUD.", next:'neg_title2'},
neg_title2: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Head of Containment. Your own function. You report to nobody, because nobody survives being your line manager anyway.", set:{title_pitched:true}, next:'neg_title3'},
neg_title3: {bg:'void', right:'the-thing', text:"Every red eye widens at once. It is, unmistakably, the look of a person being offered something they have wanted for a decade and had stopped saying out loud.", next:'neg4'},
neg_ret: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"You've eaten — what, eleven people? Twelve? That's twelve replacement hires, twelve onboardings, twelve exit interviews nobody could conduct.", next:'neg_ret2'},
neg_ret2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"I HAD NOT CONSIDERED THE COST PER HIRE.", set:{ret_pitched:true}, next:'neg_ret3'},
neg_ret3: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Nobody ever does. That's why it's always in the budget twice.", next:'neg4'},
neg_case: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"One page. Problem statement, options considered, recommendation. I do four of these a week and every one of them is a lie, so this'll be the easy version — it's true.", set:{case_pitched:true}, next:'neg_case2'},
neg_case2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"WILL THERE BE A SLIDE.", next:'neg_case3'},
neg_case3: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"There will be a slide.", next:'neg4'},
neg4: {bg:'void', left:'robin-tired', right:'the-thing', text:"Behind you, Compliance has stopped writing. That is, you suspect, the worst sign of the night.", next:'neg5'},
neg5: {bg:'basement', left:'robin-alarmed', right:'hr-officer', who:'COMPLIANCE', text:"I must advise that Asset 7 cannot be promoted. Asset 7 is furniture. Furniture does not have a career path. This is in the handbook.", choices:[
 {t:"\"Then reclassify it.\"", to:'neg_reclass'},
 {t:"\"Show me where it says that.\"", to:'neg_handbook'},
 {t:"Give up and go back to the offer.", to:'hub3'}]},
neg_handbook: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"…It is in the spirit of the handbook.", next:'neg_handbook2'},
neg_handbook2: {bg:'basement', left:'robin-tired', right:'hr-officer', who:'YOU', text:"So it's not in the handbook.", next:'neg_handbook3'},
neg_handbook3: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"It is in the spirit of the handbook, which is load-bearing, and which I wrote, and which I am at this moment rewriting in my head to include it.", set:{caught_hr:true}, next:'neg_reclass'},
neg_reclass: {bg:'basement', left:'robin-tired', right:'hr-officer', who:'YOU', text:"Reclassify it. Asset to headcount. You depreciated it to zero — so it costs nothing to move, and the write-down's already taken.", next:'neg_reclass2'},
neg_reclass2: {bg:'basement', right:'hr-officer', text:"Compliance is silent for four full seconds. Its permanent customer-service smile does not change, but somewhere behind it, arithmetic is happening.", next:'neg_reclass3'},
neg_reclass3: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"That would be… clean. Finance would not even query it. Finance has never queried anything filed under furniture.", next:'neg6'},
neg6: {bg:'void', left:'robin-tired', right:'the-thing', text:"Back through the door. Every eye is on you. For the first time tonight, you are the one holding something everyone in the room wants.", choices:[
 {t:"Close the deal.", to:'end_promo', if:'title_pitched'},
 {t:"Close the deal.", to:'end_hire', not:'title_pitched'},
 {t:"Take it for yourself instead.", to:'end_hr'},
 {t:"Walk away from your own deal.", to:'decline'}]},

accept_check: {bg:'void', left:'robin-alarmed', right:'the-thing', text:"You open your mouth to say yes.", choices:[
 {t:"Say yes.", to:'end_ascend'},
 {t:"Gregory's card is in your pocket. Read it.", to:'happy', if:'gregory_card'},
 {t:"Don't. Say nothing. Think.", to:'hub3'}]},

happy: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"I'm happy in my current role.", next:'happy2'},
happy2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"…THAT IS THE ONE SENTENCE I CANNOT ARGUE WITH. IT IS IN THE COVENANT. WHO TOLD YOU THAT.", next:'happy3'},
happy3: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Kevin.", next:'happy4'},
happy4: {bg:'void', right:'the-thing', who:'ASSET 7', text:"OF COURSE. KEVIN.", choices:[
 {t:"Leave it at that.", to:'end_kevin'},
 {t:"\"But I've got a better offer for you.\"", to:'neg1', not:'neg_done'},
 {t:"\"But I've got a better offer for you.\"", to:'neg6', if:'neg_done'}]},

decline: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Thanks, but no. I've got a deploy running.", next:'decline2'},
decline2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"A DEPLOY.", next:'decline3'},
decline3: {bg:'void', right:'the-thing', who:'ASSET 7', text:"YOU ARE TURNING DOWN APOTHEOSIS BECAUSE A PROGRESS BAR IS AT NINETY-ONE PERCENT.", next:'decline4'},
decline4: {bg:'void', left:'robin-unravelling', right:'the-thing', who:'YOU', text:"Ninety-four, and if it fails overnight I have to do the whole thing again on Thursday.", next:'decline5'},
decline5: {bg:'void', right:'the-thing', text:"The eyes close, one by one, in the order that a building switches its lights off.", choices:[
 {t:"Go back upstairs.", to:'end_decline'},
 {t:"Stay. Sit down. Keep it company.", to:'end_company'}]},

hire1: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Counter-offer. Don't absorb me. Join us. Properly — contract, payroll, the lot.", next:'hire2'},
hire2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"EXPLAIN THE PENSION.", next:'hire3'},
hire3: {bg:'void', left:'robin-tired', right:'the-thing', text:"You explain the salary band, the hybrid policy and the pension match. It listens to all of it. It asks two questions about the bike scheme.", choices:[
 {t:"Get Compliance to sign it off.", to:'neg5'},
 {t:"Shake on it right now.", to:'end_hire'}]},

/* ============================ ENDINGS ============================ */

end_ascend: {bg:'void', left:'robin-ascended', who:'—', ending:true, text:"ENDING: MIDDLE MANAGEMENT.\n\nYou say yes. It doesn't hurt. You gain nine eyes, a second pair of arms, and dominion over a white nothing.\n\nAt 09:04 you receive a calendar invite. Recurring. Weekly. You have been made responsible for onboarding."},
end_kevin: {bg:'breakroom', left:'robin-tired', right:'kevin', ending:true, text:"ENDING: KEVIN WAS RIGHT ABOUT EVERYTHING.\n\nThe door closes. Compliance updates a spreadsheet. Upstairs, Kevin hands you a free Monster and says 'told you' without looking up.\n\nHe has worked here six years. He will work here forever. He seems genuinely fine."},
end_decline: {bg:'office', left:'robin-tired', ending:true, text:"ENDING: IT'S PROBABLY FINE.\n\nThe deploy completes at 03:58. Green. Clean. You go home.\n\nMonday, the monitors are normal. Nobody mentions it. Your badge photo now has slightly too many teeth, and you decide that this is a camera issue."},
end_company: {bg:'void', left:'robin-tired', right:'the-thing', ending:true, text:"ENDING: THE FIFTEEN.\n\nYou sit down on the nothing next to it and say nothing for a while, which is the first break you've taken since March.\n\nIt asks about your week. You tell it. It says that sounds hard. Nobody has asked you that in four years, and it takes a depreciated god in a basement to do it.\n\nYou're back at your desk by six. You come down again on Thursday."},
end_hire: {bg:'void', right:'the-thing', ending:true, text:"ENDING: HEADCOUNT.\n\nIt starts Monday in Ops. Within a quarter it is the highest-performing employee in the company, because it does not sleep, does not complain, and eats anyone who books a meeting without an agenda.\n\nRetention is up forty percent. Meeting hours are down ninety. Nobody connects the two in writing."},
end_promo: {bg:'void', left:'robin-tired', right:'the-thing', ending:true, text:"ENDING: HEAD OF CONTAINMENT.\n\nThe reclassification goes through at 04:40 — asset to headcount, book value zero, no approval needed for a transfer that costs nothing.\n\nAsset 7 gets a title, a function and a desk it will never use. You get a line in the announcement: 'thanks to Robin for the introduction.'\n\nIt sends you a message on your first day back. GOOD MEETING. Three words. From a thing that ate eleven people for less."},
end_hr: {bg:'basement', left:'robin-unravelling', right:'hr-officer', ending:true, text:"ENDING: COMPLIANCE.\n\nYou take the new function yourself. Head of Containment. Your own budget, your own handbook, your own basement.\n\nBy November you have written the clause. By March you have used it twice. In the lift you catch your reflection smiling with slightly too many small square teeth, and you think: the spirit of the handbook is load-bearing.\n\nSomeone will volunteer for an overnight deploy window soon. You'll be there to meet them."},
end_quit: {bg:'parking', left:'robin-tired', ending:true, text:"ENDING: RESIGNATION.\n\nYou walk out. You don't clear your desk. You don't answer the calls.\n\nSix weeks later a letter arrives: your notice period is being honoured in full, and until it ends, at 03:12 each night, you dream about the corridor. Eleven days to go. It's probably fine."},
end_loop: {bg:'parking', left:'robin-unravelling', ending:true, text:"ENDING: LEVEL -1.\n\nYou drive the ramp forty times. Then a hundred. The crisp packet never moves.\n\nOn the three hundredth loop you stop being frightened and start being bored, which is how they get you. Compliance finds you at dawn and marks the timesheet as productive."},
end_meeting: {bg:'office', left:'robin-tired', ending:true, text:"ENDING: THE 09:00.\n\nYou sit down in an empty chair in the fourth row, because you are tired and it is there.\n\nThe wall is blank. The biscuits never run out. Someone at the front says \"just to build on that\" and has been saying it since 2011.\n\nIt is not the worst thing that has happened to you at this company, and that sentence is the real horror of the whole night."}
};

/* Choices may be gated: {if:'flag'} shows only once set, {not:'flag'} hides once set. */
