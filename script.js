const questions = [
	{
		id: "time",
		text: "Will I have more time with you?",
	},
	{
		id: "enjoy",
		text: "Do you enjoy spending time with me?",
	},
	{
		id: "laugh",
		text: "Do I make you laugh?",
	},
	{
		id: "support",
		text: "Do you feel supported by me when life gets stressful?",
	},
	{
		id: "trust",
		text: "Do you feel safe and respected with me?",
	},
	{
		id: "listening",
		text: "Do you feel like I listen to you properly?",
	},
	{
		id: "communication",
		text: "Can we promise to communicate honestly, even when it is hard?",
	},
	{
		id: "conflict",
		text: "When we disagree, do you feel we can handle it with respect?",
	},
	{
		id: "boundaries",
		text: "Do you want us to respect each other’s boundaries and privacy?",
	},
	{
		id: "growth",
		text: "Do you want us to keep growing together and learning each other better?",
	},
	{
		id: "future",
		text: "Can you see us building something real together?",
	},
	{
		id: "girlfriend",
		text: "Will you be my girlfriend?",
	}
];

let i = 0;
const answers = [];

const qText = document.getElementById("qText");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const dodgeToggle = document.getElementById("dodgeToggle");
const localSaveToggle = document.getElementById("localSaveToggle");

const final = document.getElementById("final");
const finalText = document.getElementById("finalText");

function render(){
	qText.textContent = questions[i].text;
	resetNoPosition();
}

function resetNoPosition(){
	noBtn.style.transform = "translate(0px, 0px)";
}

function clamp(n, min, max){
	return Math.max(min, Math.min(max, n));
}

function moveNoButton(){
	if(!dodgeToggle.checked) return;

	const container = document.getElementById("buttons");
	const rect = container.getBoundingClientRect();
	const btnRect = noBtn.getBoundingClientRect();

	// allow movement within the button container
	const maxX = rect.width - btnRect.width;
	const maxY = rect.height - btnRect.height;

	// pick a new random translate
	const x = Math.random() * maxX;
	const y = Math.random() * maxY;

	noBtn.style.position = "absolute";
	noBtn.style.left = "0px";
	noBtn.style.top = "0px";
	noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

function saveLocal(){
	if(!localSaveToggle.checked) return;
	localStorage.setItem("kelebogile_answers", JSON.stringify({
		createdAt: new Date().toISOString(),
		answers
	}));
}

// OPTIONAL: Google Forms submit (only if you configure it)
// 1) Create a Google Form with short-answer fields.
// 2) Get the form POST URL and entry IDs.
// 3) Replace FORM_ACTION and entry.xxxxx below.
const FORM_ACTION = ""; // e.g. "https://docs.google.com/forms/d/e/.../formResponse"
const FORM_ENTRIES = {
	// time: "entry.111111111",
	// enjoy: "entry.666666666",
	// laugh: "entry.777777777",
	// support: "entry.888888888",
	// trust: "entry.222222222",
	// listening: "entry.999999999",
	// communication: "entry.333333333",
	// conflict: "entry.1010101010",
	// boundaries: "entry.444444444",
	// growth: "entry.1111111110",
	// future: "entry.1212121212",
	// girlfriend: "entry.555555555",
};

async function submitToFormIfConfigured(){
	if(!FORM_ACTION) return;

	const fd = new FormData();
	for(const a of answers){
		const key = FORM_ENTRIES[a.id];
		if(key) fd.append(key, a.value);
	}

	// no-cors because Google Forms blocks CORS; submission still works
	await fetch(FORM_ACTION, { method: "POST", mode: "no-cors", body: fd });
}

function done(){
	yesBtn.disabled = true;
	noBtn.disabled = true;
	final.classList.remove("hidden");

	const girlfriendAnswer = answers.find(a => a.id === "girlfriend")?.value;
	finalText.textContent = girlfriendAnswer === "Yes"
		? "I am happy you said yes."
		: "Thank you for being honest. I respect your answer.";

	saveLocal();
	submitToFormIfConfigured().catch(() => {});
}

function record(value){
	answers.push({
		id: questions[i].id,
		question: questions[i].text,
		value,
		time: new Date().toISOString()
	});
	saveLocal();
}

function next(){
	i++;
	if(i >= questions.length){
		done();
		return;
	}
	render();
}

yesBtn.addEventListener("click", () => {
	record("Yes");
	next();
});

noBtn.addEventListener("click", () => {
	record("No");
	moveNoButton();
	// still move forward after a No, so the user is never trapped
	next();
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton, { passive: true });

render();
