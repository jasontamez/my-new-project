import { IdeaStorage } from './PersistentInfo';
import shuffle from 'array-shuffle';
import characters from '../data/characters.json';
import action from '../data/actions.json';
import event from '../data/events.json';
import locale from '../data/locales.json';
import time from '../data/times.json';
import object from '../data/objects.json';
import topic from '../data/topics.json';
import {
	LocalesObject,
	GenresObject,
	ContentObject,
	PersonObject,
	EventObject,
	TriggersObject
} from '../components/ReduxDucks';

//npm install english-number
//import { nameOf } from 'english-number';
//const englishNumber = (input: number) => nameOf(input).toLowerCase().replace(/ and /g, " ");
//export default englishNumber;

const EnglishNumbers = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
	"twenty"
];

export class BasicIdea {
	idea?: string
	type?: string
	fantasy?: boolean
	medievalFantasy?: boolean
	historicalFiction?: boolean
	western?: boolean
	samurai?: boolean
	superhero?: boolean
	horror?: boolean
	scifi?: boolean
	spacefaring?: boolean
	properName?: boolean
	humanDeath?: boolean
	humanDistress?: boolean
	animalDeath?: boolean
	animalDistress?: boolean
	religionAndMyths?: boolean
	christianity?: boolean
	greekRomanMyth?: boolean
	sexual?: boolean
	illicitSubstances?: boolean
	alcohol?: boolean
	tobacco?: boolean
	modern?: boolean
	// eslint-disable-next-line
	constructor() {}
	getIdea() {
		return this.idea || "idea";
	}
	id() {
		return String(this.idea) + String(this.type);
	}
}

class BasicError extends BasicIdea {
	constructor(msg: string) {
		super();
		this.idea = msg;
		this.type = "error";
	}
}
let BasicError1 = new BasicError("ERROR");

// Character, Object
class PossiblePlural extends BasicIdea {
	min?: number
	max?: number
	rateBy?: number | "incremental"
	rateFavorsLower?: boolean
	plural?: string | boolean
	article?: string
	numerals?: boolean
	getNumber(n: number) {
		return EnglishNumbers[n];
	}
	getIdea(Idea = this) {
		const plu = Idea.plural;
		const idea = Idea.idea || "idea";
		if((typeof plu) === "boolean") {
			return idea;
		}
		const plural = plu || "s";
		const article = Idea.article || "a";
		let amounts: number[] = [];
		const rate = Idea.rateBy === undefined ? 1 : Idea.rateBy;
		let min = Idea.min || 0;
		let max = Idea.max || 5;
		if(Idea.rateFavorsLower) {
			let many = 1;
			while(max >= min) {
				for(let x = 0; x < many; x++) {
					amounts.push(max);
				}
				max--;
				if(rate === "incremental") {
					many++;
				} else {
					many = many * rate;
				}
			}
		} else {
			let many = 1;
			while(min <= max) {
				for(let x = 0; x < many; x++) {
					amounts.push(min);
				}
				min++;
				if(rate === "incremental") {
					many++;
				} else {
					many = many * rate;
				}
			}
		}
		let choice = amounts[Math.floor(Math.random() * amounts.length)];
		if(choice === 0) {
			return idea + plural;
		} else if (choice === 1) {
			return article + " " + idea;
		} else if (Idea.numerals) {
			return choice.toString() + " " + idea + plural;
		}
		return EnglishNumbers[choice] + " " + idea + plural;
	}
}
class AnObject extends PossiblePlural {
	constructor(initializer: any) {
		super();
		let newObj: any = this;
		const parent: any = object.default;
		Object.getOwnPropertyNames(parent).forEach(
			(prop: string) =>
				(newObj[prop] = parent[prop])
		);
		Object.getOwnPropertyNames(initializer).forEach(
			(prop: string) =>
				(newObj[prop] = initializer[prop])
		);
		this.type = "object";
	}
}

class Character extends PossiblePlural {
	realPerson?: boolean
	getIdea() {
		if(this.realPerson) {
			console.log(this);
			return this.idea || "idea";
		}
		return super.getIdea(this);
	}
	constructor(initializer: any) {
		super();
		let newObj: any = this;
		const parent: any = characters.default;
		Object.getOwnPropertyNames(parent).forEach(
			(prop: string) =>
				(newObj[prop] = parent[prop])
		);
		Object.getOwnPropertyNames(initializer).forEach(
			(prop: string) =>
				(newObj[prop] = initializer[prop])
		);
		this.type = "character";
	}
}

class Locale extends BasicIdea {
	political?: boolean
	geographical?: boolean
	construct?: boolean
	preposition?: string
	largeSize?: boolean
	mediumSize?: boolean
	smallSize?: boolean
	variableSize?: boolean
	tinySize?: boolean
	specific?: boolean
	getIdea() {
		console.log(this);
		return (this.preposition || "in") + " " + (this.idea || "idea");
	}
	constructor(initializer: any) {
		super();
		let newObj: any = this;
		const parent: any = locale.default;
		Object.getOwnPropertyNames(parent).forEach(
			(prop: string) =>
				(newObj[prop] = parent[prop])
		);
		Object.getOwnPropertyNames(initializer).forEach(
			(prop: string) =>
				(newObj[prop] = initializer[prop])
		);
		this.type = "locale";
	}
}

class AnEvent extends BasicIdea {
	plural?: boolean
	punctual?: boolean
	constructor(initializer: any) {
		super();
		let newObj: any = this;
		const parent: any = event.default;
		Object.getOwnPropertyNames(parent).forEach(
			(prop: string) =>
				(newObj[prop] = parent[prop])
		);
		Object.getOwnPropertyNames(initializer).forEach(
			(prop: string) =>
				(newObj[prop] = initializer[prop])
		);
		this.type = "event";
	}
}

class Topic extends BasicIdea {
	constructor(initializer: any) {
		super();
		let newObj: any = this;
		const parent: any = topic.default;
		Object.getOwnPropertyNames(parent).forEach(
			(prop: string) =>
				(newObj[prop] = parent[prop])
		);
		Object.getOwnPropertyNames(initializer).forEach(
			(prop: string) =>
				(newObj[prop] = initializer[prop])
		);
		this.type = "topic";
	}
}

class ATime extends BasicIdea {
	constructor(initializer: any) {
		super();
		let newObj: any = this;
		const parent: any = time.default;
		Object.getOwnPropertyNames(parent).forEach(
			(prop: string) =>
				(newObj[prop] = parent[prop])
		);
		Object.getOwnPropertyNames(initializer).forEach(
			(prop: string) =>
				(newObj[prop] = initializer[prop])
		);
		this.type = "time";
	}
}

class Action extends BasicIdea {
	constructor(initializer: any) {
		super();
		let newObj: any = this;
		const parent: any = action.default;
		Object.getOwnPropertyNames(parent).forEach(
			(prop: string) =>
				(newObj[prop] = parent[prop])
		);
		Object.getOwnPropertyNames(initializer).forEach(
			(prop: string) =>
				(newObj[prop] = initializer[prop])
		);
		this.type = "action";
	}
}

type UsedIdea = [any, number];
type Omit = BasicIdea | UsedIdea;

const filter = (original: any[], omit: string[] = []) => {
	if(omit.length === 0) {
		return original;
	}
	let gone: any[] = [];
	let staying: any[] =[];
	original.forEach((testing: any) => {
		let test: any = testing;
		if(Array.isArray(test)) {
			test = testing[0];
		}
		if(omit.some((prop: string) => test[prop])) {
			gone.push(testing);
		} else {
			staying.push(testing);
		}
	});
	return [gone, staying];
};

// THIS IS NOT BEING USED ANYMORE
// THIS IS NOT BEING USED ANYMORE |
// THIS IS NOT BEING USED ANYMORE v
export const makeInspirations = (omit: string[] = []) => {
	const inspirations: BasicIdea[] = [
		...filter(action.contents, omit)[1].map((a: any) => new Action(a)),
		...filter(characters.contents, omit)[1].map((c: any) => new Character(c)),
		...filter(event.contents, omit)[1].map((e: any) => new AnEvent(e)),
		...filter(locale.contents, omit)[1].map((l: any) => new Locale(l)),
		...filter(object.contents, omit)[1].map((o: any) => new AnObject(o)),
		...filter(time.contents, omit)[1].map((t: any) => new ATime(t)),
		...filter(topic.contents, omit)[1].map((t: any) => new Topic(t))
	];
	return inspirations;
}
// THIS IS NOT BEING USED ANYMORE ^
// THIS IS NOT BEING USED ANYMORE |

const makeIdea = (idea: any) => {
	switch(idea.type) {
		case "action":
			return new Action(idea);
		case "character":
			return new Character(idea);
		case "event":
			return new AnEvent(idea);
		case "locale":
			return new Locale(idea);
		case "object":
			return new AnObject(idea);
		case "time":
			return new ATime(idea);
		case "topic":
			return new Topic(idea);
	}
	return BasicError1;
};

export const initializeIdeas = (callback: Function) => {
	let ideas: object[] = shuffle([
		...action.contents.map(a => ({...action.default, ...a, type: "action"})),
		...characters.contents.map(c => ({...characters.default, ...c, type: "character"})),
		...event.contents.map(e => ({...event.default, ...e, type: "event"})),
		...locale.contents.map(l => ({...locale.default, ...l, type: "locale"})),
		...object.contents.map(o => ({...object.default, ...o, type: "object"})),
		...time.contents.map(t => ({...time.default, ...t, type: "time"})),
		...topic.contents.map(t => ({...topic.default, ...t, type: "topic"}))
	]);
	Promise.all([
		IdeaStorage.setItem("sent", []),
		IdeaStorage.setItem("ideas", ideas),
		IdeaStorage.setItem("omit", [])
	]).then(() => {
		callback(true);
	}).catch((e) => {
		console.log("ERROR - INIT IDEAS:");
		console.log(e);
		callback(false);
	});
};

export const getNewIdeas = (callback: Function, doFlush: boolean = false, amount: number = 2) => {
	let flushFlag = false;
	Promise.all([
		IdeaStorage.getItem("sent"),
		IdeaStorage.getItem("ideas")
	]).then((values: any[]) => {
		let NOW = Date.now();
		let sent = values[0] as UsedIdea[];
		let ideas = values[1] as any[];
		if(doFlush) {
			// Check sent ideas to see if they can be re-introduced to the pool
			let ind = -1;
			sent.every((pair: UsedIdea, i: number) => {
				if(pair[1] > NOW) {
					ind = i;
					return true;
				}
				return false;
			});
			if(ind !== -1) {
				ind++;
				let expired: any[] = sent.slice(0, ind).map(pair => pair[0]);
				sent = sent.slice(ind);
				let lenny = ideas.length;
				if(lenny > 50) {
					lenny = Math.floor(lenny / 2);
					let back = shuffle(ideas.slice(lenny).concat(expired));
					ideas = ideas.slice(0, lenny).concat(back);
				} else {
					ideas = shuffle(ideas.concat(expired));
				}
			}
			flushFlag = true;
		}
		if(ideas.length < 2) {
			// We do not have enough ideas. Expire some from sent.
			let expired: any[] = shuffle(sent.slice(0, 20).map(pair => pair[0]));
			sent = sent.slice(20);
			ideas = ideas.concat(expired);
			flushFlag = true;
		}
		let idea1: any = ideas.shift();
		let idea2: any = ideas.shift();
		let Idea1: BasicIdea = makeIdea(idea1);
		let Idea2: BasicIdea = makeIdea(idea2);
		sent.push([idea1, NOW], [idea2, NOW]);
		if(Idea1 === BasicError1 || Idea2 === BasicError1) {
			Idea1 = BasicError1;
			Idea2 = new BasicError("comp/GI/mi");
		}
		Promise.all([
			IdeaStorage.setItem("sent", sent),
			IdeaStorage.setItem("ideas", ideas)
		]).then(() => {
			callback(Idea1, Idea2, flushFlag);
		}).catch((e) => {
			console.log("ERROR - SAVE IDEAS AFTER GET:");
			console.log(e);
			callback(BasicError1, new BasicError("comp/GI/gni2"), flushFlag)
		});
	}).catch((e) => {
		console.log("ERROR - GET NEW IDEAS:");
		console.log(e);
		callback(BasicError1, new BasicError("comp/GI/gni1"))
	});
};

export const pruneIdeas = (callback: Function, objects: [LocalesObject, GenresObject, ContentObject, PersonObject, EventObject, TriggersObject]) => {
	const getOmissions = () => {
		let omissions: string[] = [];
		objects.forEach((o: any) => {
			Object.keys(o).forEach((k: string) => {
				if(o[k]) {
					omissions.push(k);
				}
			});
		});
		return omissions;
	};
	const isOmittable = (check: any, omissions: string[]) => {
		return omissions.some((p: string) => {
			return check[p];
		});
	};
	Promise.all([
		IdeaStorage.getItem("sent"),
		IdeaStorage.getItem("ideas"),
		IdeaStorage.getItem("omit")
	]).then((values: any[]) => {
		let sent = values[0] as UsedIdea[];
		let ideas = values[1] as BasicIdea[];
		let omit = values[2] as Omit[];
		let newOmit: Omit[] = [];
		let unomit: Omit[] = [];
		let omissions = getOmissions();
		sent = sent.filter((s: UsedIdea) => {
			let res: boolean = isOmittable(s[0], omissions);
			if(res) {
				newOmit.push(s);
			}
			return !res;
		});
		ideas = ideas.filter((s: BasicIdea) => {
			let res: boolean = isOmittable(s, omissions);
			if(res) {
				newOmit.push(s);
			}
			return !res;
		});
		omit = omit.filter((s: Omit) => {
			let test = Array.isArray(s) ? s[0] : s;
			let res: boolean = isOmittable(test, omissions);
			if(!res) {
				unomit.push(s);
			}
			return res;
		});
		unomit = unomit.filter((s: Omit) => {
			if(Array.isArray(s)) {
				sent.push(s);
				return false;
			}
			return true;
		});
		sent.sort((a: UsedIdea, b: UsedIdea) => {
			return a[1] - b[1];
		});
		if(ideas.length > 50) {
			let lenny = ideas.length;
			let i1 = ideas.slice(0, lenny);
			let i2 = shuffle(ideas.slice(lenny).concat(unomit as BasicIdea[]));
			ideas = i1.concat(i2);
		} else {
			ideas = shuffle(ideas.concat(unomit as BasicIdea[]));
		}
		omit = omit.concat(newOmit);
		Promise.all([
			IdeaStorage.setItem("sent", sent),
			IdeaStorage.setItem("ideas", ideas),
			IdeaStorage.setItem("omit", omit)
		]).then(() => {
			callback();
		}).catch((e) => {
			console.log("ERROR - SAVE IDEAS AFTER OMISSIONS:");
			console.log(e);
		});
	}).catch((e) => {
		console.log("ERROR - SAVE IDEAS TRYING TO OMIT OMISSIONS:");
		console.log(e);
	});
};
