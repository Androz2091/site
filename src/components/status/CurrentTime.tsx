import { DateTime } from "luxon";
import { createSignal, getOwner, onCleanup, runWithOwner } from "solid-js";
import Pill from "./Pill";
import DismissibleCard from "../DismissibleCard";

export default function CurrentTime() {
	const getLocalTime = () => DateTime.local({ zone: "Europe/Paris" });
	const getFormattedTime = () =>
		getLocalTime().toLocaleString(DateTime.TIME_SIMPLE);
	const getFormattedDateTime = () =>
		getLocalTime().toLocaleString(DateTime.DATETIME_FULL);

	const [currentTime, setCurrentTime] = createSignal(getFormattedTime());
	const [currentDateTime, setCurrentDateTime] = createSignal(
		getFormattedDateTime(),
	);

	const updateTimes = () => {
		setCurrentTime(getFormattedTime());
		setCurrentDateTime(getFormattedDateTime());
	};

	const now = DateTime.now();
	const nextMinute = now.endOf("minute");
	const msToNextMinute = nextMinute.diff(now).milliseconds;

	const owner = getOwner();
	const timeout = setTimeout(() => {
		updateTimes();

		const interval = setInterval(updateTimes, 60_000);

		runWithOwner(owner, () => {
			onCleanup(() => clearInterval(interval));
		});
	}, msToNextMinute);

	onCleanup(() => clearTimeout(timeout));

	const [pill, setPill] = createSignal<HTMLDivElement>();

	return (
		<div class="relative">
			<Pill ref={setPill}>
				<span class="i-mdi-clock-outline" />
				<span>{currentTime()}</span>
			</Pill>
			<DismissibleCard ref={pill}>
				<span>{currentDateTime()}</span>
			</DismissibleCard>
		</div>
	);
}
