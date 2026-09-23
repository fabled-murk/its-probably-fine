// IT'S PROBABLY FINE — script. Cosmic horror, but the horror files a ticket.
const SCRIPT = {

start: {bg:'office', text:"03:12. The office is empty, which is normal, because you volunteered for the overnight deploy window like an idiot with a mortgage."},
s2: {bg:'office', left:'robin-tired', who:'YOU', text:"Forty minutes of babysitting a progress bar. Then home. Then sleep. Then, eventually, death, but in the correct order."},
s3: {bg:'office', left:'robin-tired', text:"Every monitor on the floor is showing the same solid red rectangle. All ninety of them. In perfect sync.", next:'s4'},
s4: {bg:'office', left:'robin-alarmed', who:'YOU', text:"That's… not one of ours.", choices:[
 {t:"Check the deploy logs like a professional.", to:'logs'},
 {t:"Take a photo for the group chat.", to:'photo', set:{photo:true}},
 {t:"Unplug the nearest monitor.", to:'unplug'}]},

logs: {bg:'office', left:'robin-tired', text:"The log is one line, repeated four million times: EVERYTHING IS FINE. The timestamps are in the future.", next:'logs2'},
logs2: {bg:'office', left:'robin-alarmed', who:'YOU', text:"Okay. Okay. That's a formatting bug. Probably a locale thing. It's probably fine.", next:'meet'},
photo: {bg:'office', left:'robin-tired', text:"Your phone takes the picture. In the picture, there are ninety-one monitors, and one of them is behind you.", next:'photo2'},
photo2: {bg:'office', left:'robin-alarmed', who:'YOU', text:"I'm going to delete that and never think about it again. Healthy. Normal.", next:'meet'},
unplug: {bg:'office', left:'robin-alarmed', text:"You pull the cable. The screen stays red. You hold up the loose end of the cable and look at it for a while, like it owes you money.", next:'meet'},

meet: {bg:'office', text:"The lift pings. Nobody has used that lift after eleven since the incident with Gregory and the vending machine.", next:'meet2'},
meet2: {bg:'office', right:'hr-officer', who:'???', text:"Good morning. You are working late. That is wonderful. That is exactly the attitude we document."},
meet2b: {bg:'office', left:'robin-alarmed', right:'hr-officer', who:'YOU', text:"Who are you?", next:'meet3'},
meet3: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"I am from Compliance. I have always been from Compliance. Your onboarding covered this on page forty-one, which you scrolled past in four seconds.", next:'meet4'},
meet4: {bg:'office', left:'robin-tired', right:'hr-officer', who:'COMPLIANCE', text:"There has been a containment deviation in Sub-Basement 3. Nothing has escaped. Several things have simply stopped being where we left them.", choices:[
 {t:"\"Containment of what, exactly?\"", to:'what'},
 {t:"\"I'm going home.\"", to:'leave1'},
 {t:"\"Is this a team-building thing?\"", to:'team'}]},

what: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"Asset 7. Acquired in 2011 during a merger. It was listed under office furniture, so nobody looked at it closely for eleven years.", next:'what2'},
what2: {bg:'office', left:'robin-alarmed', right:'hr-officer', who:'YOU', text:"You filed a god under furniture.", next:'what3'},
what3: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"We depreciated it over five years. Legally, it is worth nothing now. We are hoping it doesn't find out.", next:'hub'},
team: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"It is a team-building thing in the sense that by morning there may be fewer of you, and the survivors will feel closer.", next:'what'},
leave1: {bg:'office', right:'hr-officer', who:'COMPLIANCE', text:"Of course. The doors unlock at 06:00. Or when the deviation resolves. Whichever is survived first.", next:'hub'},

hub: {bg:'office', left:'robin-tired', text:"Compliance walks into the lift and does not press any buttons. It descends anyway.", next:'hub2'},
hub2: {bg:'office', left:'robin-tired', who:'YOU', text:"Right. Options. I have options.", choices:[
 {t:"Go down to Sub-Basement 3.", to:'b1'},
 {t:"Find another human being first.", to:'k1'},
 {t:"Try the car park and just drive away.", to:'p1'}]},

k1: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Oh. Hey. You want a Monster? The machine's free tonight. It's free every night, I just don't tell anyone."},
k2: {bg:'breakroom', left:'kevin', right:'robin-alarmed', who:'YOU', text:"Kevin, the whole floor's monitors are—", next:'k3'},
k3: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Red? Yeah. They do that on the twelfth of every month. And whenever someone in Finance cries.", next:'k4'},
k4: {bg:'breakroom', left:'kevin', right:'robin-alarmed', who:'YOU', text:"How long have you worked here?", next:'k5'},
k5: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Six years. I've got a system. Don't look at Sub-Basement 3, don't say your full name out loud after midnight, and always take the stairs.", set:{kevin:true}, next:'k6'},
k6: {bg:'breakroom', left:'kevin', who:'KEVIN', text:"Also if it offers you a promotion, say you're happy in your current role. That one's important.", set:{promotion_warning:true}, choices:[
 {t:"Take Kevin with you downstairs.", to:'b1', set:{kevin_along:true}},
 {t:"Go downstairs alone.", to:'b1'},
 {t:"Go to the car park.", to:'p1'}]},

p1: {bg:'parking', left:'robin-tired', text:"Level -1. Your car is exactly where you left it. So are ninety other cars, which is unusual at 3am, and all of them are yours.", next:'p2'},
p2: {bg:'parking', left:'robin-alarmed', text:"Same dent. Same parking permit. Same crisp packet on the passenger seat. Ninety times, receding into the dark.", choices:[
 {t:"Get in one and drive.", to:'p3'},
 {t:"Go back inside. Absolutely not.", to:'hub2'}]},
p3: {bg:'parking', left:'robin-alarmed', text:"You drive up the ramp for eleven minutes. Ramps are not eleven minutes long. At the top is Level -1, and your car is exactly where you left it.", choices:[
 {t:"Again.", to:'end_loop'},
 {t:"Get out and take the stairs down.", to:'b1'}]},

b1: {bg:'basement', left:'robin-tired', text:"Sub-Basement 3. The corridor is longer than the building. One door is open, and flat red light lies across the concrete like something spilled.", next:'b2'},
b2: {bg:'basement', left:'robin-alarmed', right:'hr-officer', who:'COMPLIANCE', text:"You came. Excellent. I have taken the liberty of adding this to your performance review under initiative.", next:'b3'},
b3: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"The deviation is through that door. Your task is simple: look at it, and continue to have an opinion about your job.", choices:[
 {t:"\"Why me?\"", to:'b4'},
 {t:"Walk through the door.", to:'t1'},
 {t:"\"No.\"", to:'refuse'}]},
b4: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"Because you are the only employee whose engagement survey scored below the threshold at which Asset 7 finds a person interesting. You are, statistically, furniture.", next:'b5'},
b5: {bg:'basement', left:'robin-tired', right:'hr-officer', who:'YOU', text:"That's the nicest thing anyone here has ever said to me.", next:'t1'},
refuse: {bg:'basement', right:'hr-officer', who:'COMPLIANCE', text:"Noted. Declining is permitted. It is recorded, but it is permitted.", choices:[
 {t:"Leave. Go home. Never come back.", to:'end_quit'},
 {t:"…fine. Open the door.", to:'t1'}]},

t1: {bg:'void', text:"There is no room behind the door. There is a white nothing with no floor, and in it, something is patiently being the wrong shape.", next:'t2'},
t2: {bg:'void', right:'the-thing', text:"Dozens of red eyes open at different speeds, like a building switching its lights on for the working day.", next:'t3'},
t3: {bg:'void', left:'robin-alarmed', right:'the-thing', who:'ASSET 7', text:"YOU ARE THE FIRST ONE TO COME DOWN HERE WHO ISN'T HOLDING A CLIPBOARD.", next:'t4'},
t4: {bg:'void', left:'robin-alarmed', right:'the-thing', who:'YOU', text:"I left it upstairs. I can go and get it, if that's the format you prefer.", next:'t5'},
t5: {bg:'void', right:'the-thing', who:'ASSET 7', text:"I HAVE BEEN IN A BASEMENT FOR FIFTEEN YEARS. I WAS WORSHIPPED ONCE. NOW I AM DEPRECIATED OVER FIVE YEARS AND FILED UNDER CHAIRS.", next:'t6'},
t6: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Yeah, they do that. I've been 'interim' for three years.", next:'t7'},
t7: {bg:'void', right:'the-thing', who:'ASSET 7', text:"…INTERIM.", next:'t8'},
t8: {bg:'void', right:'the-thing', who:'ASSET 7', text:"THEN YOU UNDERSTAND. I WILL OFFER YOU WHAT I OFFERED THE OTHERS. A PROMOTION. YOU WILL BECOME PART OF ME, AND YOU WILL NEVER ATTEND ANOTHER MEETING.", next:'t9'},
t9: {bg:'void', left:'robin-alarmed', right:'the-thing', text:"It is, you notice, the first genuinely good offer you have received in this building.", choices:[
 {t:"Accept the promotion.", to:'end_ascend'},
 {t:"\"I'm happy in my current role.\"", if:'promotion_warning', to:'happy'},
 {t:"Decline politely.", to:'decline'},
 {t:"Ask what happened to the others.", to:'others'},
 {t:"Offer it a job instead.", to:'end_hire'}]},

others: {bg:'void', right:'the-thing', who:'ASSET 7', text:"THEY SAID YES. THEY ARE VERY HAPPY. THEY ARE ALSO STILL ANSWERING EMAIL, BECAUSE I DID NOT READ THE CONTRACT CLOSELY AND NEITHER DID THEY.", next:'t9b'},
t9b: {bg:'void', left:'robin-tired', right:'the-thing', text:"Somewhere inside the mass, a notification sound plays. Twice.", choices:[
 {t:"Accept anyway.", to:'end_ascend'},
 {t:"Decline politely.", to:'decline'},
 {t:"Offer it a job instead.", to:'end_hire'}]},

happy: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"I'm happy in my current role.", next:'happy2'},
happy2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"…THAT IS THE ONE SENTENCE I CANNOT ARGUE WITH. IT IS IN THE COVENANT. WHO TOLD YOU THAT.", next:'happy3'},
happy3: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Kevin.", next:'happy4'},
happy4: {bg:'void', right:'the-thing', who:'ASSET 7', text:"OF COURSE. KEVIN.", next:'end_kevin'},

decline: {bg:'void', left:'robin-tired', right:'the-thing', who:'YOU', text:"Thanks, but no. I've got a deploy running.", next:'decline2'},
decline2: {bg:'void', right:'the-thing', who:'ASSET 7', text:"A DEPLOY.", next:'decline3'},
decline3: {bg:'void', right:'the-thing', who:'ASSET 7', text:"YOU ARE TURNING DOWN APOTHEOSIS BECAUSE A PROGRESS BAR IS AT NINETY-ONE PERCENT.", next:'decline4'},
decline4: {bg:'void', left:'robin-unravelling', right:'the-thing', who:'YOU', text:"Ninety-four, and if it fails overnight I have to do the whole thing again on Thursday.", next:'decline5'},
decline5: {bg:'void', right:'the-thing', text:"The eyes close, one by one, in the order that a building switches its lights off.", next:'end_decline'},

end_ascend: {bg:'void', left:'robin-ascended', who:'—', ending:true, text:"ENDING: MIDDLE MANAGEMENT.\n\nYou say yes. It doesn't hurt. You gain nine eyes, a second pair of arms, and dominion over a white nothing.\n\nAt 09:04 you receive a calendar invite. Recurring. Weekly. You have been made responsible for onboarding."},
end_kevin: {bg:'basement', left:'robin-tired', right:'kevin', ending:true, text:"ENDING: KEVIN WAS RIGHT ABOUT EVERYTHING.\n\nThe door closes. Compliance updates a spreadsheet. Upstairs, Kevin hands you a free Monster and says 'told you' without looking up.\n\nHe has worked here six years. He will work here forever. He seems genuinely fine."},
end_decline: {bg:'office', left:'robin-tired', ending:true, text:"ENDING: IT'S PROBABLY FINE.\n\nThe deploy completes at 03:58. Green. Clean. You go home.\n\nMonday, the monitors are normal. Nobody mentions it. Your badge photo now has slightly too many teeth, and you decide that this is a camera issue."},
end_hire: {bg:'void', right:'the-thing', ending:true, text:"ENDING: HEADCOUNT.\n\nYou explain the salary band, the hybrid policy and the pension match. It listens to all of it.\n\nIt starts Monday in Ops. Within a quarter it is the highest-performing employee in the company, because it does not sleep, does not complain, and eats anyone who books a meeting without an agenda. Retention is up forty percent."},
end_quit: {bg:'parking', left:'robin-tired', ending:true, text:"ENDING: RESIGNATION.\n\nYou walk out. You don't clear your desk. You don't answer the calls.\n\nSix weeks later a letter arrives: your notice period is being honoured in full, and until it ends, at 03:12 each night, you dream about the corridor. Eleven days to go. It's probably fine."},
end_loop: {bg:'parking', left:'robin-unravelling', ending:true, text:"ENDING: LEVEL -1.\n\nYou drive the ramp forty times. Then a hundred. The crisp packet never moves.\n\nOn the three hundredth loop you stop being frightened and start being bored, which is how they get you. Compliance finds you at dawn and marks the timesheet as productive."}
};
SCRIPT.s2.next='s3'; SCRIPT.start.next='s2'; SCRIPT.meet2.next='meet2b'; SCRIPT.k1.next='k2';
