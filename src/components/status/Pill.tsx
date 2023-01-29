import classnames from 'classnames';
import { JSX, mergeProps, ParentProps, splitProps } from 'solid-js';
import { Show } from 'solid-js/web';

export interface StatusPillProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	text: string;
	progress?: number;
}

export default function Pill(props: ParentProps<StatusPillProps>) {
	const [content, container] = splitProps(props, ['text', 'progress'])
	const containerProps = {
		class: classnames(
			'flex',
			'gap-2',
			'py-2',
			'px-3',
			'rounded-full',
			'items-center',
			'text-stone-600',
			'dark:text-stone-400',
			'bg-stone-300/50',
			'hover:bg-stone-300',
			'dark:hover:bg-stone-700',
			'dark:bg-stone-700/50',
			'max-w-xs',
			'relative',
			'transition-all',
			'cursor-pointer',
		),
	};

	return <button {...mergeProps(containerProps, container)}>
		{props.children}
		<div class='w-full truncate'>{content.text}</div>
		<Show when={content.progress}>
			<div class='absolute inset-0 rounded-full overflow-hidden'>
				<div class='absolute top-0 bottom-0 left-0 bg-stone-500/25' style={{ width: `${content.progress! * 100}%` }} />
			</div>
		</Show>
	</button>;
}
