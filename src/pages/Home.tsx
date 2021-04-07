import React from 'react';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
//	IonTitle,
	IonToolbar,
	IonLabel,
	IonIcon,
	useIonViewDidEnter
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import {
	StatusObject,
	updateIdeas,
	setStatus,
	reduceStatus,
	setOmitStatus,
	setTotal,
	addFave,
	removeFave,
	currentPage
} from "../components/ReduxDucks";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { Shake } from '@ionic-native/shake';
import { BasicIdea, getNewIdeas, initializeIdeas, pruneIdeas } from '../components/GatherInspiration';
import './Home.css';
import { starOutline, star } from 'ionicons/icons';
import fireSwal from '../components/Swal';

const Home = () => {
	const state = useSelector((state: any) => state, shallowEqual);
	const dispatch = useDispatch();
	useIonViewDidEnter(() => {
		dispatch(currentPage("home"));
	});
	// fetchStatus controls whether or not we can spit out a new idea.
	const fetchStatus: StatusObject = state.status;

	// Handle shake-to-update
	if(state.settings.shake) {
		const shakeToUpdate = () => {
			state.page === "home" && maybeGenerateNewIdea();
		};
		Shake.startWatch().subscribe(() => shakeToUpdate());
	}

	const maybeGenerateNewIdea = (status: StatusObject = fetchStatus, output: any = undefined) => {
		if(output !== undefined) {
			switch(output.type) {
				case "initialized":
					dispatch(setTotal(output.value));
					status.total = output.value;
					break;
				case "new items loaded":
					delete status.new;
					break;
				case "omissions noted":
					status.omitsChanged = false;
					dispatch(setOmitStatus(false));
					break;
			}
		} else if (status.generating) {
			return;
		}
		if(!status.total) {
			// Inititalize;
			let ns = reduceStatus(status);
			initializeIdeas(maybeGenerateNewIdea, ns);
		} else if(status.new !== undefined) {
			// New ideas
			//
			//
			//
			//
			//
		} else if(status.omitsChanged) {
			// Omits updated
			let ns = reduceStatus(status);
			pruneIdeas(maybeGenerateNewIdea, [
				state.locales,
				state.genres,
				state.content,
				state.person,
				state.event,
				state.triggers
			], ns);
		} else {
			// Ok to fetch!
			dispatch(setStatus(true));
			getNewIdeas(receiveNewIdeas, (state.nextIdeaFlush < Date.now()));
		}
	};

	// Set up variables
	interface Format extends Array<string[]> {
		lastFormat?: string[]
	}
	let singleFormats: Format = [
		["Create a story about ", "."],
		["Write about ", "."],
		["What do you think about a story involving ", "?"],
		["", " could be the nucleus of a story."],
		["Maybe you can write about ", "?"],
		["When nothing else comes to mind, you can still write about ", "."],
		["Here's a random seed for a story: ", "."],
		["What would happen in a story with ", "?"],
		["Try writing about ", "."],
		["Write about ", " and see what happens."],
		["Stop everything and write about ", "!"],
		["Your new muse: ", "."],
		["Consider ", "."],
		["Ponder ", " and start writing."]
	];
	let doubleFormats: Format = [
		["What would happen in a story with ", " that also involved ", "?"],
		["Ponder ", " and ", " before you start writing."],
		["", " could be a part of a story about ", "."],
		["Your next plot could involve ", ", but also have ", "."],
		["Put ", " and ", " together and see what happens."],
		["Try writing about ", " and ", "."],
		["Here's a random seed for a story: ", " mixed up with ", "."],
		["Your new muse: ", " with ", "."],
		["Consider ", " transposed with ", "."],
		["Think about ", ", and then consider ", "."],
		["Write about ", " and ", "."]
	];
	let singleLocaleFormats: Format = [
		["Create a story set ", "."],
		["What do you think about a tale set ", "?"],
		["A story set ", " might be interesting."],
		["What would happen in a book set ", "?"],
		["Try writing a story set ", "."],
		["Write about anything, but set the story ", "!"],
		["Imagine what happens ", " and start writing."]
	];

	const getFormat = (format: Format) => {
		const x = generateRandomNumber(format.length);
		const choice = format[x];
		// remove the picked format
		format.splice(x, 1);
		// if we've prevously saved a format, reintroduce it to the list
		if(format.lastFormat) {
			format.push(format.lastFormat);
		}
		// save the current format so it can't be used the very next time
		format.lastFormat = choice;
		// return the chosen format
		return choice;
	};

	const generateRandomNumber = (n: number) => {
		// Returns a number from 0 to n-1
		return Math.floor(Math.random() * n);
	};

	const receiveNewIdeas = (idea1: BasicIdea, idea2: BasicIdea, flushFlag: boolean = false) => {
		let formatting: string[] = [];
		let singleFormatType = singleFormats;
		let ideasToDisplay: string[] = [];
		const type1 = idea1.type;	
		const type2 = idea2.type;
		if(type1 === "error" || type2 === "error") {
			return dispatch(updateIdeas([idea1, idea2, flushFlag, [idea1.idea!, idea2.idea!, "", idea1.idea!, ": ", idea2.idea!, ""]]));
		}
		const i1 = idea1.getIdea();
		const i2 = idea2.getIdea();
		let rawIdeas: string[] = [i1, i2];
		if(type1 === "character" && type2 === "action")  {
			// CHARACTER ACTION
			ideasToDisplay = [i1 + " " + i2];
		} else if (type1 === "action" && type2 === "character") {
			// ACTION CHARACTER
			rawIdeas = [i2 , i1];
			ideasToDisplay = [i2 + " " + i1];
		} else if (type1 === type2 && (type1 === "time" || type1 === "locale")) {
			// TIME TIME
			// LOCALE LOCALE
			formatting = getFormat(singleLocaleFormats);
			formatting = [formatting[0], " and ", formatting[1]];
			ideasToDisplay = [i1, i2];
		} else if (type1 === "time" && type2 === "locale") {
			// TIME LOCALE
			singleFormatType = singleLocaleFormats;
			rawIdeas = [i2 , i1];
			ideasToDisplay = [i2 + " " + i1];
		} else if  (type2 === "time" && type1 === "locale") {
			// LOCALE TIME
			singleFormatType = singleLocaleFormats;
			ideasToDisplay = [i1 + " " + i2];
		} else if ((type1 === "time") || (type1 === "locale")) {
			// TIME [ANY]
			// LOCALE [ANY]
			rawIdeas = [i2 , i1];
			ideasToDisplay = [i2 + " " + i1];
		} else if ((type2 === "time") || (type2 === "locale")) {
			// [ANY] TIME
			// [ANY] LOCALE
			ideasToDisplay = [i1 + " " + i2];
		} else {
			// ALL OTHERS
			formatting = getFormat(doubleFormats);
			ideasToDisplay = [i1, i2];
		}
		// Apply the singular format
		if(formatting.length === 0) {
			formatting = getFormat(singleFormatType);
		}
		let final: string[] = [formatting.shift()!];
		while(formatting.length > 0) {
			final.push(ideasToDisplay.shift()!, formatting.shift()!)
		}
		dispatch(updateIdeas([idea1, idea2, flushFlag, [...rawIdeas, ...final]]));
	};

	const displayIdea = () => {
		if(fetchStatus.generating || state.idea1 === null || state.idea2 === null) {
			return (<p className="theIdea loading selectable">LOADING</p>);
		}
		const encase = (text: string) => {
			return (<span className="idea" key={"ID"+text}>{text}</span>);
		};
		let flag = true;
		return (<p className="theIdea selectable">{
			state.ideas.slice(2).map((s: string) => {
				if(flag) {
					flag = false;
					return s;
				}
				flag = true;
				return encase(s);
			})
		}</p>);
	};

	const toggleFavorite = () => {
		if(state.status.generating) {
			return;
		}
		if(state.currentFave) {
			dispatch(removeFave(state.currentFave));
			fireSwal({
				title: "Removed from Favorites",
				customClass: {popup: 'dangerToast'},
				toast: true,
				timer: 2500,
				position: 'top',
				timerProgressBar: true,
				showConfirmButton: false
			});
			return;
		}
		dispatch(addFave());
		fireSwal({
			title: "Saved to Favorites",
			toast: true,
			timer: 2500,
			position: 'top',
			timerProgressBar: true,
			showConfirmButton: false
		});
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					{/*<IonTitle>Get Inspired</IonTitle>*/}
					<IonButtons slot="start">
						<IonMenuButton />
						<IonButton onClick={() => maybeGenerateNewIdea()}><IonLabel>CLICK</IonLabel></IonButton>
					</IonButtons>
					<IonButtons slot="end">
						<IonButton onClick={() => toggleFavorite()} disabled={state.status.generating}><IonIcon icon={state.currentFave ? star : starOutline} color={state.currentFave ? undefined : "primary"} /></IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				{displayIdea()}
				<ExploreContainer />
			</IonContent>
		</IonPage>
	);
};

export default Home;
