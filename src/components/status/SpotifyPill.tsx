import { createSignal, lazy, onCleanup, Show, Suspense } from 'solid-js';
import Dismiss from 'solid-dismiss';

import FloatingCard from '../FloatingCard';
import type { Spotify } from '../lanyard/useLanyard';
import Pill from './Pill';

export interface SpotifyPillProps {
	info: Spotify,
}

const SpotifyEmbed = lazy(() => import('../SpotifyEmbed'));

export default function SpotifyPill(props: SpotifyPillProps) {
	const duration = props.info.timestamps.end - props.info.timestamps.start;

	const calcSeconds = () => Date.now() - props.info.timestamps.start;

	const [seconds, setSeconds] = createSignal(calcSeconds());
	const progress = () => Math.min(seconds() / duration, 1);

	const interval = setInterval(() => setSeconds(calcSeconds()), 1000);
	onCleanup(() => clearInterval(interval));

	const [pill, setPill] = createSignal<HTMLDivElement>();

	const [cardVisible, setCardVisible] = createSignal(false);

	return <div class='relative'>
		<Pill
			text={`${props.info.song} - ${props.info.artist}`}
			progress={progress()}
			ref={setPill}
		>
			<div class='text-xl i-fa-brands-spotify text-[#1DB954]' />
		</Pill>
		<Dismiss menuButton={pill} open={cardVisible} setOpen={setCardVisible}>
			<FloatingCard ref={pill}>
				<Suspense>
					<SpotifyEmbed trackId={props.info.track_id} seconds={seconds} />
				</Suspense>
			</FloatingCard>
		</Dismiss>
	</div>;
}
